export interface SavedLocationsResponse {
  count: number;
  savedLocations: SavedLocation[];
}

interface GeoJsonPoint {
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    radius: number;
    radiusUnit: "km" | "mi";
  };
}

export interface SavedLocation {
  id: string;
  userId: string;
  type: "LOCATION_ID" | "GEO_JSON";
  geoJson: GeoJsonPoint | null;
  locationId: string | null;
  tags: null; // You might want to change this if tags can have a specific type
  locationName: string;
  customName: string | null;
  area: number | null;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}





