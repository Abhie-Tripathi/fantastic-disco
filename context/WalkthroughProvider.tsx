"use client";

import Tooltip from "@/app/components/internal/walkthrough/Tooltip";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

interface WalkthroughContextType {
  setSteps: (steps: Step[]) => void;
  runTour: () => void;
  stopTour: () => void;
  registerTarget: (key: string, id: string) => void;
  getTargetId: (key: string) => string | null;
}

const WalkthroughContext = createContext<WalkthroughContextType | null>(null);

export const WalkthroughProvider = ({ children }: { children: ReactNode }) => {
  const [steps, setStepsState] = useState<Step[]>([]);
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);
  const idsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const setSteps = useCallback((newSteps: Step[]) => {
    setStepsState(newSteps);
  }, []);

  const runTour = useCallback(() => {
    setRun(true);
  }, []);

  const stopTour = useCallback(() => {
    setRun(false);
  }, []);

  const registerTarget = (key: string, id: string) => {
    idsRef.current[key] = id;
  };

  const getTargetId = (key: string): string | null => {
    return idsRef.current[key] ? `#${idsRef.current[key]}` : null;
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) stopTour();
  };

  return (
    <WalkthroughContext.Provider
      value={{ setSteps, runTour, stopTour, registerTarget, getTargetId }}
    >
      {children}
      {mounted && steps.length > 0 && (
        <Joyride
          steps={steps}
          run={run}
          callback={handleJoyrideCallback}
          showSkipButton
          showProgress
          scrollToFirstStep={false}
          disableScrolling
          tooltipComponent={(props) => (
            <Tooltip {...props} totalSteps={steps.length} />
          )}
          styles={{
            options: {
              primaryColor: "#6750a4",
              zIndex: 9999,
            },
            tooltipContainer: {
              padding: "8px 12px",
              borderRadius: "8px",
            },
            buttonNext: {
              fontSize: "13px",
              padding: "4px 12px",
            },
            buttonBack: {
              fontSize: "13px",
              marginRight: "6px",
            },
          }}
        />
      )}
    </WalkthroughContext.Provider>
  );
};

export const useWalkthroughContext = () => {
  const context = useContext(WalkthroughContext);
  if (!context) {
    throw new Error(
      "useWalkthroughContext must be used within WalkthroughProvider"
    );
  }
  return context;
};
