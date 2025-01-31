import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function lightenColor(hex: string | undefined, factor: number | undefined): string {
  if (!hex) return "#ffffff";
  
  const defaultFactor = 0.5;
  if (typeof factor !== 'number' || isNaN(factor)) {
    factor = defaultFactor;
  }

  const cleanHex = hex.replace(/^#/, "");
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) return "#ffffff";

  try {
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) return "#ffffff";

    const clampedFactor = Math.max(0, Math.min(1, factor));

    const newR = Math.round(r + (255 - r) * clampedFactor);
    const newG = Math.round(g + (255 - g) * clampedFactor);
    const newB = Math.round(b + (255 - b) * clampedFactor);

    const lightenedHex = [newR, newG, newB]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');

    return `#${lightenedHex}`;
  } catch (error) {
    return "#ffffff";
  }
}
