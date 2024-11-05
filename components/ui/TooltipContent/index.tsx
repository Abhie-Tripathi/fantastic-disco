import React from "react";
import styles from "./tooltip.module.css";
import { OverlayArrow, Tooltip, TooltipProps } from "react-aria-components";

interface TooltipContentProps extends Omit<TooltipProps, "children"> {
  children: React.ReactNode;
}

const TooltipContent = ({ children, ...props }: TooltipContentProps) => {
  return (
    <Tooltip {...props} className={styles.tooltipContent}>
      <OverlayArrow>
        <svg width={8} height={8} viewBox="0 0 8 8">
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </Tooltip>
  );
};

export default TooltipContent;
