import { useCallback, useEffect, useRef, useState } from "react";
import type { Step } from "react-joyride";

interface StepConfig {
  readonly key: string;
  readonly content: string;
  readonly id?: string;
}

interface UseWalkthroughProps<T> {
  refs?: T;
  stepsConfig: readonly StepConfig[];
  deps?: unknown[];
  storageKey?: string;
  currentPath?: string;
  type?: string;
  conditionalKeys?: (type: string) => (keyof T)[];
}

export function useWalkthrough<
  T extends Record<string, React.RefObject<HTMLElement>>
>({
  refs,
  stepsConfig,
  deps = [],
  storageKey = "walkthroughCompleted",
  currentPath = typeof window !== "undefined"
    ? window.location.pathname + window.location.search
    : "",
  type,
  conditionalKeys,
}: UseWalkthroughProps<T>) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [run, setRun] = useState(false);
  const triesRef = useRef(0);
  const maxTries = 10;

  const updateSteps = useCallback(() => {
    const newSteps: Step[] = stepsConfig
      .map(({ key, content, id }) => {
        const el = id
          ? document.getElementById(id)
          : refs?.[key as keyof T]?.current;

        if (!el || !document.contains(el)) return null;

        return {
          target: el,
          content,
          disableBeacon: true,
        };
      })
      .filter(Boolean) as Step[];
    setSteps(newSteps);
  }, [...deps]);

  useEffect(() => {
    const walkthroughCompleted: string[] = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );
    if (currentPath && walkthroughCompleted.includes(currentPath)) {
      return;
    }

    const requiredKeys: (keyof T)[] =
      typeof conditionalKeys === "function" && type
        ? conditionalKeys(type)
        : [];

    const checkRefsAndRun = () => {
      const allReady = requiredKeys.every((key) => refs?.[key]?.current);

      if (allReady) {
        updateSteps();
        setRun(true);
      } else if (triesRef.current < maxTries) {
        triesRef.current++;
        requestAnimationFrame(checkRefsAndRun);
      }
    };

    checkRefsAndRun();
  }, [updateSteps, currentPath]);

  return { steps, run, setRun, updateSteps };
}
