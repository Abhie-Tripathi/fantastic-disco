import React from "react";
import { TooltipRenderProps } from "react-joyride";
import styles from "./tooltip.module.css";
import LeftArrow from "/public/internal/go_to_circle.svg";
import Image from "next/image";
import VideoModal from "@/components/layout/videoModal";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CustomTooltipProps extends TooltipRenderProps {
  totalSteps: number;
  pathName: string;
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
  pathName,
}: CustomTooltipProps) => (
  <div className={styles.container} {...tooltipProps}>
    <nav>
      <h2>{step.title}</h2>
      {index !== totalSteps - 1 && <button {...skipProps} title="Close"
    className="flex items-center justify-center gap-1 text-[var(--secondary-text-color)] border-b border-transparent hover:border-[var(--secondary-text-color)]" style={{color:"var(--secondary-text-color)"}}>Close</button>}
      {index === totalSteps - 1 && <button {...closeProps}
    className="flex items-center justify-center gap-1 text-[var(--secondary-text-color)] border-b border-transparent hover:border-[var(--secondary-text-color)]" style={{color:"var(--secondary-text-color)"}}>Close</button>}
    </nav>
    <div className={styles.content}>{step.content}</div>
    <footer>
      {pathName === "research" ? (
        <div className="absolute left-5">
          <VideoModal
            source={index === 0 ? "search" : "eventSearch"}
            variant="text"
          />
        </div>
      ) : pathName === "tracker?showTemplates=true" && index === 0 ? (
        <div className="absolute left-5">
          <VideoModal
            source="trackers"
            variant="text"
          />
        </div>
      ) : (
        <></>
      )}
      {index > 0 && (
        <button {...backProps}>
          {/* <Image src={LeftArrow} alt="left arrow" /> */}
          <Button variant="outline" className="text-[var(--primary-color)] hover:text-[var(--primary-color)]">Prev</Button>
        </button>
      )}
      {continuous && index < totalSteps - 1 && (
        <button {...primaryProps}>
          {/* <Image
            src={LeftArrow}
            alt="left arrow"
            style={{ transform: "rotate(180deg)" }}
          /> */}
          <Button>Next</Button>
        </button>
      )}
    </footer>
  </div>
);

export default Tooltip;