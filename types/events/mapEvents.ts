export interface MapEventsResponse {
  count: number;
  events: MapEvents[];
}

export interface MapEvents {
  id: string;
  eventImpactScore: number;
  latitude: string;
  longitude: string;
  eventType: string;
}
