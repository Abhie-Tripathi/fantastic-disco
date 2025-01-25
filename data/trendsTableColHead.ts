import Workshop from "/public/trendsSubCategoryIcons/workshops.svg";
import Arts from "/public/trendsSubCategoryIcons/arts.svg";
import Festival from "/public/trendsSubCategoryIcons/festivals.svg";
import Concert from "/public/trendsSubCategoryIcons/concerts.svg";
import Sport from "/public/trendsSubCategoryIcons/sport.svg";
import Community from "/public/trendsSubCategoryIcons/community.svg";
import Tradeshow from "/public/trendsSubCategoryIcons/tradeshow.svg";
import Conferences from "/public/trendsSubCategoryIcons/conference.svg";
import { StaticImageData } from "next/image";
import CategoriesTrendsData from "@/data/categoriesTrends.json";
import TimeTrendsData from "@/data/timeTrends.json";
import LocationTrendsData from "@/data/locationTrends.json";

export interface TableHeaderConfig {
  [key: string]: Column[];
}

export interface TableDataConfig {
  [key: string]: Row[];
}

export interface Column {
  slug?: string;
  name: string;
  icon?: StaticImageData;
  color: string;
  fontWeight?: string;
}

export interface NewColumn {
  slug?: string;
  columnName: string;
  icon?: string;
  color: string;
  fontWeight?: string;
  subHeading?: SubColumn[];
}

export interface SubColumn extends Omit<NewColumn, "columnName"> {
  subColumnName: string;
}

export interface Row {
  [key: string]: string | number | undefined | null;
}

export const categoriesTrends: Column[] = [
  {
    slug: "month",
    name: "Months",
    color: "--primary-text-color",
  },
  {
    slug: "total",
    name: "Total",
    color: "--primary-text-color",
  },
  {
    slug: "festivals",
    name: "Festivals",
    icon: Festival,
    color: "--social-color",
    fontWeight: "semibold",
  },
  {
    slug: "concerts",
    name: "Concerts",
    icon: Concert,
    color: "--social-color",
    fontWeight: "semibold",
  },
  {
    slug: "sport",
    name: "Sport",
    icon: Sport,
    color: "--social-color",
    fontWeight: "semibold",
  },
  {
    slug: "performing-arts",
    name: "Performing Arts",
    icon: Arts,
    color: "--social-color",
    fontWeight: "semibold",
  },
  {
    slug: "community",
    name: "Community",
    icon: Community,
    color: "--social-color",
    fontWeight: "semibold",
  },
  {
    slug: "tradeshow",
    name: "Tradeshow",
    icon: Tradeshow,
    color: "--business-color",
    fontWeight: "semibold",
  },
  {
    slug: "conferences",
    name: "Conferences",
    icon: Conferences,
    color: "--business-color",
    fontWeight: "semibold",
  },
  {
    slug: "workshop",
    name: "Workshop",
    icon: Workshop,
    color: "--business-color",
    fontWeight: "semibold",
  },
];

export const locationTrends: Column[] = [
  {
    slug: "city",
    name: "Cities",
    color: "--primary-text-color",
  },
  {
    slug: "threshold",
    name: "Threshold",
    color: "--primary-text-color",
  },
  {
    slug: "predictedAttendance",
    name: "Predicted Attendance",
    color: "--primary-text-color",
  },
  {
    slug: "impactScore",
    name: "Impact Score",
    color: "--primary-text-color",
  },
  {
    slug: "inboundScore",
    name: "Inbound Score",
    color: "--primary-text-color",
  },
  {
    slug: "intlScore",
    name: "INTL Score",
    color: "--primary-text-color",
  },
  {
    slug: "events",
    name: "Events",
    color: "--primary-text-color",
  },
];

export const timeTrends: Column[] = [
  {
    slug: "month",
    name: "Months",
    color: "--primary-text-color",
  },
  {
    slug: "threshold",
    name: "Threshold",
    color: "--primary-text-color",
  },
  {
    slug: "predictedAttendance",
    name: "Predicted Attendance",
    color: "--primary-text-color",
  },
  {
    slug: "impactScore",
    name: "Impact Score",
    color: "--primary-text-color",
  },
  {
    slug: "inboundScore",
    name: "Inbound Score",
    color: "--primary-text-color",
  },
  {
    slug: "intlScore",
    name: "INTL Score",
    color: "--primary-text-color",
  },
  {
    slug: "events",
    name: "Events",
    color: "--primary-text-color",
  },
];

export const newTimeTrends: NewColumn[] = [
  {
    slug: "date",
    columnName: "Dates",
    color: "--primary-text-color",
  },
  {
    slug: "predictedAttendance",
    columnName: "Predicted Attendance",
    color: "--primary-text-color",
    subHeading: [
      {
        slug: "avg",
        subColumnName: "Avg",
        color: "--primary-text-color",
      },
      {
        slug: "value",
        subColumnName: "Value",
        color: "--primary-text-color",
      },
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
    ],
  },
  {
    slug: "eventCount",
    columnName: "Event Count",
    color: "--primary-text-color",
    subHeading: [
      {
        slug: "avg",
        subColumnName: "Avg",
        color: "--primary-text-color",
      },
      {
        slug: "value",
        subColumnName: "Value",
        color: "--primary-text-color",
      },
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
    ],
  },
];

export const tableHeaderConfig: TableHeaderConfig = {
  "Category Trends": categoriesTrends,
  "Location Trends": locationTrends,
  "Time Trends": timeTrends,
};

export const tableDataConfig: TableDataConfig = {
  "Category Trends": CategoriesTrendsData,
  "Location Trends": LocationTrendsData,
  "Time Trends": TimeTrendsData,
};
