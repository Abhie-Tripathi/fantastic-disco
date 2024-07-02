// components/JoyrideComponent.tsx

import React, { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import Tooltip from "../Tooltip"; // Assuming you have this tooltip component

interface Props {
  steps: Step[];
  run: boolean;
  onFinish?: () => void;
}

const JoyRideCustom: React.FC<Props> = ({ steps, run, onFinish }) => {
  const [joyrideRun, setJoyrideRun] = useState(run);

  const joyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
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
