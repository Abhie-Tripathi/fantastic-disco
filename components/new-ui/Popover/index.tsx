import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import styles from "./popover.module.css";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    align?: "center" | "end" | "start";
    sideOffset?: number;
  }
>(({ className, align = "start", sideOffset = 4, ...props }, ref) => {
  let alignClass;
  if (align === "center") {
    alignClass = styles.popoverContent;
  } else if (align === "start") {
    alignClass = `${styles.popoverContent} ${styles["popoverContent[data-side=left]"]}`;
  } else if (align === "end") {
    alignClass = `${styles.popoverContent} ${styles["popoverContent[data-side=right]"]}`;
  }

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={`${alignClass} ${className}`}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
