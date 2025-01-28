export interface RecentSearchesResponse {
  count: number;
  recentSearches: RecentSearch[];
}

export interface RecentSearch {
  id: string;
  path: string;
  request: {
    method: string;
    body: Record<string, unknown>;
    query: {
      status: string;
      active_gte: string;
      active_lte: string;
      eventTypes: string;
      locationIds: string;
      view?: string;
    };
  };
  createdAt: string;
}

interface LocationId {
  [key: string]: string;
}

interface LocationIds {
  city?: LocationId[];
  state?: LocationId[];
  country?: LocationId[];
}

interface EventCategory {
  id: string;
  name: string;
}

export interface RecentSearchItem {
  eventFormat?: string;
  eventStatus?: string;
  eventCategory?: EventCategory[];
  estimatedVisitorRangeTag?: string;
  eventEntry?: string;
  estimatedExhibitors?: number;
  eventType?: string[];
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortType?: string;
  shows?: string;
  groupBy?: string;
  locationIds?: LocationIds;
  eventCity?: LocationId[];
  eventState?: LocationId[];
  eventCountry?: LocationId[];
  createdAt: string;
  ratings: string;
  maturity?: string;
  onlyBranded?: boolean;
  onlySeries?: boolean;
  frequencies?: string[];
  includeKeywords?: string[];
  excludeKeywords?: string[];
}