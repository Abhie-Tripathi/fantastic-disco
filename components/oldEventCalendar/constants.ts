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

export const darkEventTypeColors: Record<string, string> = {
  concert: "#4F4750",
  protests: "#F0F0F0",
  sport: "#4F4750",
  conferences: "#4F5063",
  festival: "#4F4750",
  tradeshows: "#4F5063",
  exhibitions: "#4F5063",
  workshops: "#4F5063",
  community: "#4F5063",
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
    color: "#FEF1DB",
    darkModeColor: "#675F4A",
  },
  {
    name: "medium",
    color: "#FFF1CA",
    darkModeColor: "#6A5D38",
  },
  {
    name: "high",
    color: "#FDDADA",
    darkModeColor: "#71585B",
  },
  {
    name: "critical",
    color: "#FFCCCC",
    darkModeColor: "#713E3E",
  },
];
