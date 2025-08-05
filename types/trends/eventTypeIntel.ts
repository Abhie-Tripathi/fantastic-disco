export interface EventTypeIntelResponse {
  eventTypeIntel: EventTypeIntel;
}

export interface EventTypeIntel {
  total: number;
  Social: SocialEvents;
  Business: BusinessEvents;
}

export interface SocialEvents {
  festival: number;
  concert: number;
  sport: number;
  "stage-performance": number;
  "community-group": number;
}

export interface BusinessEvents {
  tradeshows: number;
  conferences: number;
  workshops: number;
}
