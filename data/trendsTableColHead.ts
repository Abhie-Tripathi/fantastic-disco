import Workshop from "/public/trendsSubCategoryIcons/workshops.svg";
import Arts from "/public/trendsSubCategoryIcons/arts.svg";
import Festival from "/public/trendsSubCategoryIcons/festivals.svg";
import Concert from "/public/trendsSubCategoryIcons/concerts.svg";
import Sport from "/public/trendsSubCategoryIcons/sport.svg";
import Community from "/public/trendsSubCategoryIcons/community.svg";
import Tradeshow from "/public/trendsSubCategoryIcons/tradeshow.svg";
import Conferences from "/public/trendsSubCategoryIcons/conference.svg";
import { StaticImageData } from "next/image";

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
