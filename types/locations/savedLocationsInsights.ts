export interface SavedLocationInsightsResponse {
  count: number;
  savedLocations: SavedLocationInsights[];
}
export interface SavedLocationInsightsByIdResponse {
  id: string;
  displayName: string;
  locationType: "GEO_JSON" | "LOCATION_ID";
  geoLocations?: GeoLocation[];
  estimatedAttendance?: number | null;
  estimatedSpend?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  estimatedAttendance: number | null;
  estimatedSpend: string;
  radius: number
}

export interface SavedLocationInsights {
  id: string;
  userId: string;
  type: "GEO_JSON" | "LOCATION_ID";
  geoJson: GeoJson | null;
  locationId: string | null;
  tags: any | null;
  locationName: string;
  customName: string | null;
  area?: number;
  createdAt: string;
  updatedAt: string;
  estimatedAttendance: string;
  estimatedSpend: string;
  stats: Stat[];
}

export interface GeoJson {
  geometry?: Geometry;
  properties?: Properties;
  type?: string;
  licence?: string;
  features?: Feature[];
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  radius: number;
  radiusUnit: string;
}

export interface Feature {
  type: string;
  properties: Properties2;
  bbox: number[];
  geometry: Geometry2;
}

export interface Properties2 {
  place_id: number;
  osm_type: string;
  osm_id: number;
  place_rank: number;
  category: string;
  type: string;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
}

export interface Geometry2 {
  type: string;
  coordinates: number[][][];
}

export interface Stat {
  title: string;
  stats: number;
}

export interface SaveLocationDTO {
  locationType: string;
  geoJson?: GeoJson;
  locationId?: string;
  tags?: string[];
  customName?: string;
  locationName: string;
}

export interface GeoJson {
  geometry?: Geometry;
  properties?: Properties;
  type?: string;
  licence?: string;
  features?: Feature[];
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  radius: number;
  radiusUnit: string;
}

export interface Feature {
  type: string;
  properties: Properties2;
  bbox: number[];
  geometry: Geometry2;
}

export interface Properties2 {
  place_id: number;
  osm_type: string;
  osm_id: number;
  place_rank: number;
  category: string;
  type: string;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
}

export interface Geometry2 {
  type: string;
  coordinates: number[][][];
}
