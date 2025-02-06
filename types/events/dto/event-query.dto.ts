import { z } from "zod";
import { timezones } from "@/utils/timezones";

export enum View {
  "list" = "list",
  "map" = "map",
  "calendar" = "calendar",
  "tracker" = "tracker",
  "detail" = "detail",
}

export enum EventFormat {
  online = "online",
  hybrid = "hybrid",
  offline = "offline",
}

export enum EventStatus {
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  POSTPONED = "POSTPONED",
  PREDICTED = "PREDICTED",
  UNVERIFIED = "UNVERIFIED",
}

export enum CountGroup {
  "year" = "year",
  "month" = "month",
  "week" = "week",
  "day" = "day",
  "country" = "country",
  "state" = "state",
  "city" = "city",
  "status" = "status",
  "alertType" = "alertType",
  "eventTypeGroup" = "eventTypeGroup",
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  radius: number;
}

export enum CalendarViewType {
  "year" = "year",
  "month" = "month",
  "week" = "week",
}

export enum BoundType {
  "point" = "point",
  "box" = "box",
}

const groupByOptions = {
  date: "date",
};

const dateViewOptions = {
  year: "year",
  month: "month",
  week: "week",
  day: "day",
};

const columns = {
  impactScore: "impactScore",
  predictedAttendance: "predictedAttendance",
  economicImpact: "economicImpact",
  eventCount: "eventCount",
  inboundEstimate: "inboundEstimate",
  internationalEstimate: "internationalEstimate",
};

export interface ViewBound {
  boundType: BoundType;
  coordinates: GeoCoordinates;
  properties?: Record<string, string>;
}

export interface QueryFilter {
  eventIds?: string[];
  query?: string;
  locationIds?: string[];
  geoCoordinates?: GeoCoordinates;
  viewBound?: ViewBound;
  eventTypes?: string[];
  categories?: string[];
  designations?: string[];
  tags?: string[];
  active_gte?: string;
  active_lte?: string;
  impact_score_lte?: number;
  impact_score_gte?: number;
  inbound_score_lte?: number;
  inbound_score_gte?: number;
  international_score_lte?: number;
  international_score_gte?: number;
  estimated_visitors_lte?: number;
  estimated_visitors_gte?: number;
  estimated_exhibitors_lte?: number;
  estimated_exhibitors_gte?: number;
  status?: EventStatus[];
  maturity?: string[];
  onlyBranded?: boolean;
  onlySeries?: boolean;
  show?: string[];
  ratings?: string[];
  frequencies?: string[];
  trust_score_lte?: number;
  trust_score_gte?: number;
  eventFormats?: string[];
  entryType?: string[];
  editions_lte?: number;
  editions_gte?: number;
  category_rank_lte?: number;
  category_rank_gte?: number;
  country_rank_lte?: number;
  country_rank_gte?: number;
  category_country_rank_lte?: number;
  category_country_rank_gte?: number;
  audienceSpread?: string[];
  audienceSpreadRegions?: string[];
  audienceZone?: string[];
  estimatedVisitors?: string[];
  estimatedExhibitors?: string[];
  economic_impact_lte?: number;
  economic_impact_gte?: number;
  top?: number;
  includeKeywords?: string[];
  excludeKeywords?: string[];
  regions?: string[];
  eventTypeGroup?: string;
  createdAt?: string;
  estimatedVisitorRangeTag?: string[];
}

export interface QueryDto extends QueryFilter {
  sortBy?: string[];
  localTimezone?: timezones;
  view?: View;
  calendar_type?: CalendarViewType;
  page?: number;
  limit?: number;
}

export interface CountQueryDto extends QueryFilter {
  groupBy?: CountGroup[];
}

export interface EventsTrendsDto extends QueryFilter {
  groupBy: keyof typeof groupByOptions;
  columns: Array<keyof typeof columns>;
  dateView: keyof typeof dateViewOptions;
}

export const EventQuerySchema = z.object({
  query: z.string().optional(),
  locationIds: z
    .string()
    .transform((val) => val?.split(",").map((item) => item.trim()))
    .optional(),
  eventTypes: z
    .string()
    .transform((val) => val?.split(",").map((item) => item.trim()))
    .optional(),
  categories: z
    .string()
    .transform((val) => val?.split(",").map((item) => item.trim()))
    .optional(),
  active_gte: z.string().datetime().optional(),
  active_lte: z.string().datetime().optional(),
  status: z
    .string()
    .transform((val) =>
      val?.split(",").map((item) => item.trim().toUpperCase() as EventStatus)
    )
    .optional(),
  eventFormats: z
    .string()
    .transform((val) =>
      val?.split(",").map((item) => item.trim() as EventFormat)
    )
    .optional(),
  view: z.nativeEnum(View).optional().default(View.list),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),
  sortBy: z
    .string()
    .transform((val) => val?.split(","))
    .optional(),
  geoCoordinates: z
    .string()
    .transform((val) => {
      try {
        return val ? JSON.parse(val) : undefined;
      } catch {
        return undefined;
      }
    })
    .optional(),
  estimated_visitors_gte: z.string().transform(Number).optional(),
  estimated_visitors_lte: z.string().transform(Number).optional(),
  trust_score_gte: z.string().transform(Number).optional(),
  trust_score_lte: z.string().transform(Number).optional(),
});

export type EventQuery = z.infer<typeof EventQuerySchema>;

export const parseEventQuery = (query: Record<string, any>): EventQuery => {
  return EventQuerySchema.parse(query);
};
