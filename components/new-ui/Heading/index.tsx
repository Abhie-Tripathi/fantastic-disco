import React from "react";
import classes from "./heading.module.css";

/**
 * @typedef {'title' | 'titleNoMargin' | 'subTitle' | 'normal'} Variant
 * @description The available variants for the Heading component.
 *
 * @typedef {'primary' | 'secondary' | 'tertiary'} Color
 * @description The available colors for the Heading component.
 *
 * @typedef {'regular' | 'medium' | 'semibold' | 'bold'} fontWeight
 * @description The available font weights for the Heading component.
 *
 * @typedef {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} Tag
 * @description The available HTML tags for the Heading component.
 */

type Variant = "title" | "titleNoMargin" | "subTitle" | "normal";
type Color = "primary" | "secondary" | "tertiary";
type FontWeight = "regular" | "medium" | "semibold" | "bold";
type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps {
  as?: Tag;
  variant?: Variant;
  color?: Color;
  fontWeight?: FontWeight;
  className?: string;
  children: React.ReactNode;
}

/**
 * Renders a Heading Tag with a given variant and children.
 *
 * @param {HeadingProps} props - The component props.
 * @returns {React.ReactElement} The rendered heading component.
 */
const Heading: React.FC<HeadingProps> = ({
  as = "h2",
  variant = "title",
  color = "primary",
  fontWeight,
  className,
  children,
}) => {
  const Tag = as;
  const colorClassName = classes[color];
  const variantClassName = classes[variant];
  const fontWeightClassName = fontWeight && classes[fontWeight];
  const tagClassName = classes[`heading-${as}`];
  const combinedClassNames =
    `${colorClassName} ${variantClassName} ${fontWeightClassName} ${tagClassName} ${
      className ?? ""
    }`.trim();

  return <Tag className={combinedClassNames}>{children}</Tag>;
};

export default Heading;
