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
  eventType?: string[];
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortType?: string;
  eventRanking?: string;
  eventFrequency?: string;
  trustScore?: string;
  maturity?: string;
  estimatedExhibitScore?: string;
  eventBrand?: string;
  shows?: string;
  audienceSpread?: string;
  designation?: string;
  includeKeywords?: string;
  excludeKeywords?: string;
  estimatedVisitorRangeTag?: string;
  createdAt?: string;
  eventCategory?: EventCategory[];
  eventEntry?: string;
  estimatedExhibitors?: number;
  groupBy?: string;
  locationIds?: LocationIds;
  eventCity?: LocationId[];
  eventState?: LocationId[];
  eventCountry?: LocationId[];
  onlyBranded?: boolean;
  onlySeries?: boolean;
  eventFormat?: string;
  eventStatus?: string;
  eventRating?: string;
  eventSeries?: string;
  inboundScore?: string;
  internationalScore?: string
  eventImpactScore?: string;
}
