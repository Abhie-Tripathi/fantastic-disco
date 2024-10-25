import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import styles from "./hoverCard.module.css";

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> & {
    align?: "center" | "start" | "end";
    sideOffset?: number;
  }
>(({ className, align = "center", sideOffset = 5, ...props }, ref) => {
  let alignClass;
  if (align === "center") {
    alignClass = styles.hoverCardContentCenter;
  } else if (align === "start") {
    alignClass = styles.hoverCardContentLeft;
  } else if (align === "end") {
    alignClass = styles.hoverCardContentRight;
  }

  return (
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={`${styles.hoverCardContent} ${alignClass} ${className}`}
      {...props}
    />
  );
});

HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
