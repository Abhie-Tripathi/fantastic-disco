import { Step } from "react-joyride";

type ModuleName = "research" | "tracker"; // extend as needed

export const generateWalkthroughSteps = (module: ModuleName): Step[] => {
  switch (module) {
    case "research":
      return [
        {
          target: "#research-tabs",
          title: "Research Tabs",
          content: "Save this search to add it as tracker",
          disableBeacon: true,
        },
        {
          target: "#save-search-btn",
          title: "Save Search",
          content: "Save this search to add it as tracker",
          disableBeacon: true,
        },
      ];

    case "tracker":
      return [
        {
          target: "#research-tabs",
          title: "Research Tabs",
          content: "Save this search to add it as tracker",
          disableBeacon: true,
        },
        {
          target: "#save-search-btn",
          title: "Save Search",
          content: "Save this search to add it as tracker",
          disableBeacon: true,
        },
      ];

    default:
      return [];
  }
};
