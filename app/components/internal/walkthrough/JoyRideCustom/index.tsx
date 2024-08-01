// components/JoyrideComponent.tsx

import React, { useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import Tooltip from "../Tooltip"; // Assuming you have this tooltip component

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

  const joyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;
    setCurrIndex(index);
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      let walkthroughCompleted: string[] = JSON.parse(
        localStorage.getItem("walkthroughCompleted") || "[]"
      );

      if (!walkthroughCompleted.includes(pathName)) {
        walkthroughCompleted.push(pathName);

        localStorage.setItem(
          "walkthroughCompleted",
          JSON.stringify(walkthroughCompleted)
        );
      }
      setJoyrideRun(false);
      if (onFinish) onFinish();
    }
  };

  return (
    <Joyride
      tooltipComponent={(props) => (
        <Tooltip {...props} totalSteps={steps.length} />
      )}
      steps={steps}
      run={joyrideRun}
      callback={joyrideCallback}
      continuous
      showProgress
      showSkipButton
      disableScrolling
      disableScrollParentFix
      disableOverlayClose
      spotlightClicks={spotClicksIndex.includes(currIndex)}
      styles={{
        options: {
          arrowColor: "#ffffff",
          backgroundColor: "#ffffff",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          primaryColor: "#000",
          textColor: "#004a14",
          width: 400,
          zIndex: 1000,
        },
      }}
    />
  );
};

export default JoyRideCustom;
