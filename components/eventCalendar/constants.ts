import { View } from "react-big-calendar";

export type CustomView = View | "year";

export const Views: Record<string, CustomView> = {
  YEAR: "year",
  MONTH: "month",
  WEEK: "week",
  WORK_WEEK: "work_week",
  DAY: "day",
  AGENDA: "agenda",
};

export const eventTypeColors: Record<string, string> = {
  concert: "#F4E5F6",
  protests: "#F0F0F0",
  sport: "#F4E5F6",
  conferences: "#E9EAFB",
  festival: "#F4E5F6",
  tradeshows: "#E9EAFB",
  exhibitions: "#E9EAFB",
  workshops: "#E9EAFB",
  community: "#F4E5F6",
};

export const groupedEventTypeColors: Record<string, string> = {
  business: "#5055A3",
  social: "#9D50A3",
  unattended: "#7D7D7D",
};

export const groupedEventTypes = {
  social: ["festival", "concert", "sport", "performing-arts", "community"],
  business: ["tradeshows", "conferences", "workshops"],
};

export const heatmapColors = [
  {
    name: "low",
    color: "#FFE6E6",
  },
  {
    name: "medium",
    color: "#FFF0F0",
  },
  {
    name: "high",
    color: "#FFF6E6",
  },
  {
    name: "critical",
    color: "#FFF4D6",
  },
];
