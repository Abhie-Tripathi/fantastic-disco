import { ColumnDropdown, SubColumn } from "./trendsTableColHead";

export const Trends: any[] = [
  {
    type: "Predicted Attendance",
    endpoints: "predicted-attendance",
  },
  {
    type: "Predicted Spend",
    endpoints: "predicted-spend",
  },
  {
    type: "Event Count",
    endpoints: "event-count",
  },
];

export const columnsDropdown: ColumnDropdown[] = [
  {
    label: "Number of events",
    value: "eventCount",
    tooltipDescription: "Count of events per each day",
    enable: true,
  },
  {
    label: "Predicted Attendance",
    value: "predictedAttendance",
    tooltipDescription: "No of people estimated to attend a event",
    enable: true,
  },
  {
    label: "Inbound Estimate",
    value: "inboundEstimate",
    tooltipDescription:
      "The number of attendees traveling to the event from other cities within the host country",
    enable: true,
  },
  {
    label: "International Estimate",
    value: "internationalEstimate",
    tooltipDescription:
      " The number of attendees traveling to the event from outside the host country",
    enable: true,
  }
];




export const treemapColumnsDropdown: ColumnDropdown[] = [
  {
    label: "Number of events",
    value: "eventCount",
    tooltipDescription: "Count of events per each day",
    enable: true,
  },
  {
    label: "Predicted Attendance",
    value: "predictedAttendance",
    tooltipDescription: "No of people estimated to attend a event",
    enable: false,
  },
  {
    label: "Inbound Estimate",
    value: "inboundEstimate",
    tooltipDescription:
      "The number of attendees traveling to the event from other cities within the host country",
    enable: false,
  },
  {
    label: "International Estimate",
    value: "internationalEstimate",
    tooltipDescription:
      " The number of attendees traveling to the event from outside the host country",
    enable: false,
  },
];

export const subCategories: SubColumn[] = [
  {
    slug: "festival",
    subColumnName: "Festivals",
    icon: "/trendsSubCategoryIcons/festivals.svg",
    color: "--social-color",
    fontWeight: "semibold",
  },
  {
    slug: "concert",
    subColumnName: "Concerts",
    icon: "/trendsSubCategoryIcons/concerts.svg",
    color: "--social-color",
    fontWeight: "semibold",
  },
  {
    slug: "sport",
    subColumnName: "Sport",
    icon: "/trendsSubCategoryIcons/sport.svg",
    color: "--social-color",
    fontWeight: "semibold",
  },
  {
    slug: "performing-arts",
    subColumnName: "Performing Arts",
    icon: "/trendsSubCategoryIcons/arts.svg",
    color: "--social-color",
    fontWeight: "semibold",
  },
  {
    slug: "community",
    subColumnName: "Community",
    icon: "/trendsSubCategoryIcons/community.svg",
    color: "--social-color",
    fontWeight: "semibold",
  },
  {
    slug: "tradeshows",
    subColumnName: "Tradeshow",
    icon: "/trendsSubCategoryIcons/tradeshow.svg",
    color: "--business-color",
    fontWeight: "semibold",
  },
  {
    slug: "conferences",
    subColumnName: "Conferences",
    icon: "/trendsSubCategoryIcons/conference.svg",
    color: "--business-color",
    fontWeight: "semibold",
  },
  {
    slug: "workshops",
    subColumnName: "Workshop",
    icon: "/trendsSubCategoryIcons/workshops.svg",
    color: "--business-color",
    fontWeight: "semibold",
  },
];

export const trendsNotificationFormDropdown = [
  {
    label: "Immediate",
    value: "immediate",
  },
  {
    label: "1 hour",
    value: "1hr",
  },
  {
    label: "8 hours",
    value: "8hrs",
  },
  {
    label: "24 hours",
    value: "24hrs",
  },
];

export const EVENT_TYPE_GROUPS = {
  Social: ["festival", "concert", "sport", "performing-arts", "community"],
  Business: ["tradeshows", "conferences", "workshops"],
  Holiday: ["holiday"],
};
