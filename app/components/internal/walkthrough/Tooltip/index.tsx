import React from "react";
import { TooltipRenderProps } from "react-joyride";
import styles from "./tooltip.module.css";
import LeftArrow from "/public/internal/go_to_circle.svg";
import Image from "next/image";

interface CustomTooltipProps extends TooltipRenderProps {
  totalSteps: number;
}

const Tooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  skipProps,
  totalSteps,
}: CustomTooltipProps) => (
  <div className={styles.container} {...tooltipProps}>
    <nav>
      <h2>{step.title}</h2>
      {index !== totalSteps - 1 && <button {...skipProps}>Skip</button>}
      {index === totalSteps - 1 && <button {...closeProps}>Close</button>}
    </nav>
    <div className={styles.content}>{step.content}</div>
    <footer>
      {index > 0 && (
        <button {...backProps}>
          <Image src={LeftArrow} alt="left arrow" />
        </button>
      )}
      {continuous && index < totalSteps - 1 && (
        <button {...primaryProps}>
          <Image
            src={LeftArrow}
            alt="left arrow"
            style={{ transform: "rotate(180deg)" }}
          />
        </button>
      )}
    </footer>
  </div>
);

export default Tooltip;