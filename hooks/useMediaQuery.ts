import { useCallback, useEffect, useState } from "react";

export const BREAKPOINTS = {
  xs: 320,    // Custom breakpoint for extra small devices
  sm: 640,    // Tailwind sm: 640px
  md: 768,    // Tailwind md: 768px
  lg: 1024,   // Tailwind lg: 1024px
  xl: 1280,   // Tailwind xl: 1280px
  "2xl": 1536 // Tailwind 2xl: 1536px
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;

type QueryType =
  | "up" // matches(min-width)
  | "down" // matches(max-width)
  | "between" // matches range
  | "only"; // matches exact breakpoint

type QueryDimension = "width" | "height";

interface MediaQueryOptions {
  type?: QueryType;
  start?: BreakpointKey;
  end?: BreakpointKey;
  defaultState?: boolean;
  ssr?: boolean;
  dimension?: QueryDimension;
}

const isBrowser = typeof window !== "undefined";

const constructMediaQuery = (options: MediaQueryOptions): string => {
  const { type = "up", start = "xs", end, dimension = "width" } = options;
  const dimensionPrefix = dimension === "height" ? "min-height" : "min-width";
  const dimensionMaxPrefix = dimension === "height" ? "max-height" : "max-width";

  switch (type) {
    case "up":
      return `(${dimensionPrefix}: ${BREAKPOINTS[start]}px)`;
    case "down":
      // Subtract 0.02px to work around Safari rounding issues
      return `(${dimensionMaxPrefix}: ${BREAKPOINTS[start] - 0.02}px)`;
    case "between":
      if (!end) throw new Error("End breakpoint is required for between");
      return `(${dimensionPrefix}: ${BREAKPOINTS[start]}px) and (${dimensionMaxPrefix}: ${
        BREAKPOINTS[end] - 0.02
      }px)`;
    case "only":
      const nextBreakpoint =
        Object.keys(BREAKPOINTS).findIndex((b) => b === start) + 1;
      const nextKey = Object.keys(BREAKPOINTS)[nextBreakpoint] as BreakpointKey;
      return nextKey
        ? `(${dimensionPrefix}: ${BREAKPOINTS[start]}px) and (${dimensionMaxPrefix}: ${
            BREAKPOINTS[nextKey] - 0.02
          }px)`
        : `(${dimensionPrefix}: ${BREAKPOINTS[start]}px)`;
    default:
      return `(${dimensionPrefix}: ${BREAKPOINTS[start]}px)`;
  }
};

export const useMediaQuery = (options: MediaQueryOptions | string): boolean => {
  const normalizedOptions =
    typeof options === "string" ? { start: options as BreakpointKey } : options;

  const { defaultState = false, ssr = true } = normalizedOptions;

  const mediaQuery = useCallback(() => {
    return constructMediaQuery(normalizedOptions);
  }, [normalizedOptions]);

  const [matches, setMatches] = useState(() => {
    if (!isBrowser && ssr) return defaultState;

    if (isBrowser) {
      return window.matchMedia(mediaQuery()).matches;
    }

    return defaultState;
  });

  useEffect(() => {
    if (!isBrowser) return;

    const query = window.matchMedia(mediaQuery());
    setMatches(query.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    query.addEventListener("change", listener);

    return () => {
      query.removeEventListener("change", listener);
    };
  }, [mediaQuery]);

  return matches;
};

export const useIsMobile = (ssrState = false) =>
  useMediaQuery({ type: "down", start: "md", defaultState: ssrState });

export const useIsTablet = (ssrState = false) =>
  useMediaQuery({
    type: "between",
    start: "sm",
    end: "lg",
    defaultState: ssrState,
  });

export const useIsDesktop = (ssrState = false) =>
  useMediaQuery({ type: "up", start: "lg", defaultState: ssrState });

export const useIsLargeScreen = (ssrState = false) =>
  useMediaQuery({ type: "up", start: "xl", defaultState: ssrState });

export const useIsShortScreen = (ssrState = false) =>
  useMediaQuery({ type: "down", start: "md", defaultState: ssrState, dimension: "height" });

export const useIsTallScreen = (ssrState = false) =>
  useMediaQuery({ type: "up", start: "lg", defaultState: ssrState, dimension: "height" });

export const useResponsiveValue = <T>(config: {
  mobile: T;
  tablet?: T;
  desktop: T;
  defaultValue?: T;
  shortScreen?: T;
  tallScreen?: T;
}): T => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const isShortScreen = useIsShortScreen();
  const isTallScreen = useIsTallScreen();

  if (isShortScreen && config.shortScreen) return config.shortScreen;
  if (isTallScreen && config.tallScreen) return config.tallScreen;

  if (isMobile) return config.mobile;
  if (isTablet && config.tablet) return config.tablet;
  if (isDesktop) return config.desktop;
  return config.defaultValue || config.desktop;
};
