"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import styles from "./label.module.css";
import clsx from "clsx";

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  variant?: "normal" | "input";
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, variant = "normal", ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={clsx(styles.label, styles[variant], className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
