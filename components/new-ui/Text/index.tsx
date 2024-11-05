import React from "react";
import classes from "./text.module.css";
import clsx from "clsx";

/**
 * @typedef {'xl' | 'large' | 'normal' | 'small'} Variant
 * @description The available variants for the Text component.
 *
 * @typedef {'primary' | 'secondary' | 'tertiary'} Color
 * @description The available colors for the Text component.
 *
 * @typedef {'regular' | 'medium' | 'semibold' | 'bold'} FontWeight
 * @description The available font weights for the Text component.
 *
 * @typedef {'p' | 'span' | 'li'} Tag
 * @description The available HTML tags for the Text component.
 *
 * @typedef {true | false} Justify
 * @description The available justify options for the Text component.
 */

type Size = "xl" | "large" | "normal" | "small";
type Variant = "noMargin" | "normalMargin" | "smallMargin" | "largeMargin";
type Color = "primary" | "secondary" | "tertiary";
type FontWeight = "regular" | "medium" | "semibold" | "bold";
type Tag = "p" | "span" | "li";
type Justify = true | false;

interface TextProps {
  as?: Tag;
  size?: Size;
  variant?: Variant;
  color?: Color;
  fontWeight?: FontWeight;
  justify?: Justify;
  className?: string;
  children: React.ReactNode;
}

/**
 * Renders a Text Tag with a given variant and children.
 *
 * @param {TextProps} props - The component props.
 * @returns {React.ReactElement} The rendered text component.
 */
const Text: React.FC<TextProps> = ({
  as = "p",
  size = "normal",
  variant = "normalMargin",
  color = "primary",
  fontWeight = "regular",
  justify = false,
  className,
  children,
}) => {
  const Tag = as;
  const listItem = as === "li";
  const colorClassName = classes[color];
  const sizeClassName = classes[size];
  const variantClassName = classes[variant];
  const fontWeightClassName = classes[fontWeight];
  const combinedClassNames = clsx(
    colorClassName,
    sizeClassName,
    variantClassName,
    fontWeightClassName,
    justify && classes.justify,
    listItem && classes.listItem,
    className
  );
  return <Tag className={combinedClassNames}>{children}</Tag>;
};

export default Text;
