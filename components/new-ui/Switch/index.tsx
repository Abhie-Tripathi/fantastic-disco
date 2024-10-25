"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import styles from "./switch.module.css";
import classNames from "classnames";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={classNames(styles.switchRoot, className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className={classNames(styles.switchThumb)} />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
