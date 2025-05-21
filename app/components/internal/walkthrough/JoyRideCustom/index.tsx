import React, { useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import Tooltip from "../Tooltip";

interface Props {
  steps: Step[];
  run: boolean;
  onFinish?: () => void;
  pathName: string;
  spotClicksIndex?: number[];
}

const JoyRideCustom: React.FC<Props> = ({
  steps,
  run,
  onFinish,
  pathName,
  spotClicksIndex = [],
}) => {
  const [joyrideRun, setJoyrideRun] = useState(run);
  const [currIndex, setCurrIndex] = useState(0);

  const scrollToTarget = (target: string | Element) => {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;

    if (element) {
      // Scroll the element into view smoothly, centered vertically
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Adjust scroll for any fixed header
      const headerHeight = document.querySelector("header")?.clientHeight || 0;
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middlePosition = absoluteElementTop - window.innerHeight / 2;

      window.scrollTo({
        top: middlePosition - headerHeight,
        behavior: "smooth",
      });
    }
  };

  const joyrideCallback = (data: CallBackProps) => {
    const { status, index, type, step } = data;

    if (type === "step:before" && step.target) {
      // Scroll first with delay before updating current step index
      // setTimeout(() => {
      scrollToTarget(step.target);
      setCurrIndex(index); // update step index after scroll starts
      // }, 100); // delay in ms (adjust as needed)
    } else {
      setCurrIndex(index);
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      const walkthroughCompleted: string[] = JSON.parse(
        localStorage.getItem("walkthroughCompleted") || "[]"
      );

      if (!walkthroughCompleted.includes(pathName)) {
        localStorage.setItem(
          "walkthroughCompleted",
          JSON.stringify([...walkthroughCompleted, pathName])
        );
      }
      setJoyrideRun(false);
      onFinish?.();
    }
  };

  return (
    <Joyride
      tooltipComponent={(props) => (
        <Tooltip {...props} totalSteps={steps.length} />
      )}
      steps={steps.map((step) => ({
        ...step,
        disableBeacon: true, // Disable beacon for all steps
      }))}
      scrollToFirstStep={false}
      disableScrollParentFix={true}
      run={joyrideRun}
      callback={joyrideCallback}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      spotlightClicks={spotClicksIndex.includes(currIndex)}
      scrollDuration={300}
      scrollOffset={150} // Adjust based on your header height
      styles={{
        options: {
          arrowColor: "#ffffff",
          backgroundColor: "#ffffff",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          primaryColor: "#000",
          textColor: "#004a14",
          width: 400,
          zIndex: 10000, // Make sure it's on top
        },
        tooltipContainer: {
          textAlign: "left",
          transition: "opacity 200ms ease-out",
        },
        buttonNext: {
          backgroundColor: "#000",
        },
        buttonBack: {
          color: "#000",
        },
      }}
      floaterProps={{
        disableAnimation: false,
        placement: "bottom",
        styles: {
          arrow: {
            spread: 20,
          },
        },
      }}
    />
  );
};

export default JoyRideCustom;
