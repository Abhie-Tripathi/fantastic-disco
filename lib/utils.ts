import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function lightenColor(hex: string, factor: number): string {
  hex = hex.replace(/^#/, "");

  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  r = Math.round(r + (255 - r) * factor);
  g = Math.round(g + (255 - g) * factor);
  b = Math.round(b + (255 - b) * factor);

  const lightenedHex = ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1);

  return `#${lightenedHex}`;
}
