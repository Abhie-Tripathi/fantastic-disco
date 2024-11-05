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
