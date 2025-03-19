export interface RecentSearchesResponse {
  recentSearches: RecentSearch[];
}

export interface RecentSearch {
  filterValues: {
    limit: number;
    offset: number;
    locationIds: string[];
    eventTypes?: string[];
    categories?: string[];
    viewBound?: {
      boundType: string;
      coordinates: {
        latitude: number;
        longitude: number;
        radius: number;
      };
    };
    active_gte: string;
    active_lte: string;
    impact_score_lte?: number;
    impact_score_gte?: number;
    inbound_score_lte?: number;
    inbound_score_gte?: number;
    international_score_lte?: number;
    international_score_gte?: number;
    status?: string[];
    maturity?: string[];
    onlyBranded?: boolean;
    onlySeries?: boolean;
    show: string[];
    ratings?: string[];
    frequencies?: string[];
    trust_score_lte?: number;
    trust_score_gte?: number;
    eventFormats?: string[];
    entryType?: string[];
    audienceSpread?: string[];
    estimatedExhibitors?: string[];
    top?: number;
    includeKeywords?: string[];
    excludeKeywords?: string[];
    estimatedVisitorRangeTag?: string[];
    view: string;
    sortBy?: string[];
    designations?: string[];
  };
  requestedAt: string;
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

// export interface RecentSearchItem {
//   eventType?: string[];
//   startDate?: string;
//   endDate?: string;
//   sortBy?: string;
//   sortType?: string;
//   eventRanking?: string;
//   eventFrequency?: string;
//   trustScore?: string;
//   maturity?: string;
//   estimatedExhibitScore?: string;
//   eventBrand?: string;
//   shows?: string;
//   audienceSpread?: string;
//   designation?: string;
//   includeKeywords?: string;
//   excludeKeywords?: string;
//   estimatedVisitorRangeTag?: string;
//   createdAt?: string;
//   eventCategory?: EventCategory[];
//   eventEntry?: string;
//   estimatedExhibitors?: number;
//   groupBy?: string;
//   locationIds?: LocationIds;
//   eventCity?: LocationId[];
//   eventState?: LocationId[];
//   eventCountry?: LocationId[];
//   onlyBranded?: boolean;
//   onlySeries?: boolean;
//   eventFormat?: string;
//   eventStatus?: string;
//   eventRating?: string;
//   eventSeries?: string;
//   inboundScore?: string;
//   internationalScore?: string;
//   eventImpactScore?: string;
// }
