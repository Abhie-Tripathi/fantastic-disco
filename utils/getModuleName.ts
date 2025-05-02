// This function returns module name based on the url excluding the params.

import { usePathname } from "next/navigation";

export function getModuleName() {
  const pathName = usePathname()?.split("?")[0] ?? "";

  const patterns: { match: (path: string) => boolean; module: string }[] = [
    { match: (p) => p.startsWith("/internal"), module: "Dashboard" },
    {
      match: (p) => p.startsWith("/internal/search/events"),
      module: "Research",
    },
    { match: (p) => p.startsWith("/internal/trackers"), module: "Tracker" },
    {
      match: (p) => p.startsWith("/internal/coordinate"),
      module: "Coordinate",
    },
    { match: (p) => p.startsWith("/internal/outreach"), module: "Outreach" },
    {
      match: (p) => /^\/internal\/trackers\/[^/]+\/trackedEvents$/.test(p),
      module: "Tracker",
    },
    // Add more pattern-based matches here
  ];

  const matched = patterns.find((pattern) => pattern.match(pathName));

  return matched?.module || "";
}
