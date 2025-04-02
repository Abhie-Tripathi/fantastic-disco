import { Country } from "../events";

export interface EventTypeData {
  tradeshows: number | null;
  conferences: number | null;
  workshops: number | null;
  festival: number | null;
  concert: number | null;
  sport: number | null;
  community: number | null;
  "performing-arts": number | null;
}

export interface EventGroupData {
  Social?: number | null;
  Business?: number | null;
  Unattended?: number | null;
}

export interface GroupedDataItem {
  total: number | null;
  byEventType: EventTypeData | null;
  byEventTypeGroup: EventGroupData | null;
}

export interface GroupedDataByDate {
  [date: string]: {
    impactScore?: GroupedDataItem;
    predictedAttendance?: GroupedDataItem;
    economicImpact?: GroupedDataItem;
    eventCount?: GroupedDataItem;
    inboundEstimate?: GroupedDataItem;
    internationalEstimate?: GroupedDataItem;
  };
}

export interface Thresholds {
  impactScore?: number | null;
  predictedAttendance?: number | null;
  economicImpact?: number | null;
  eventCount?: number | null;
  inboundEstimate?: number | null;
  internationalEstimate?: number | null;
}

export type TEventColumnType = keyof Thresholds;

export interface EventTrendsResponse {
  thresholds: Thresholds;
  groupedData: GroupedDataByDate;
}

export interface Values {
  avg: number;
  value: number;
  maxRow?: number;
  maxCol?: number;
  thresholdHighlightCol: string;
  thresholdHighlightRow: string;
}
export interface TableData {
  date: string;
  predictedAttendance?: {} & EventTypeData & Values;
  inboundEstimate?: {} & EventTypeData & Values;
  internationalEstimate?: {} & EventTypeData & Values;
  impactScore?: {} & EventTypeData & Values;
  economicImpact?: {} & EventTypeData & Values;
  eventCount?: {} & EventTypeData & Values;
}

export interface TableGroupedHoliday {
  date: string;
  count: number;
  holidays: string[];
}

export interface ViewBound {
  boundType: "point";
  coordinates: Coordinates;
  properties: {
    name: string;
  };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface BaseFilterValue {
  groupBy: "date" | "month" | "year";
  dateView: "day" | "month" | "year";
  active_gte: string;
  active_lte: string;
}

export interface CreateFilterValue extends BaseFilterValue {
  locationIds?: string;
  viewBound?: ViewBound;
  eventTypes: string;
  columns: string;
}

export interface CreateSaveTrendData {
  name: string;
  filterValues: CreateFilterValue;
  type: "TR_CUSTOM" | "CUSTOM";
}

export interface EditSaveTrendData extends CreateSaveTrendData {
  accessLevel: "ADMIN";
}

export interface EventTypes {
  [key: string]: {
    name: string;
    slug: string;
  };
}

export interface LocationIds {
  [key: string]: Omit<Country, "id" | "regions">;
}

export interface GetFilterValue extends BaseFilterValue {
  columns: string[];
  eventTypes: EventTypes;
  locationIds?: LocationIds;
  viewBound?: string;
}

export interface TrackerData {
  id: string;
  name: string;
  type: "TR_CUSTOM";
  filterValues: GetFilterValue;
  created: string;
}

export interface GetSaveTrendData {
  trackers: TrackerData[];
  count: number;
}
