export interface SearchLocationResponse {
  formattedLocations: Location[];
}

export interface Location {
  id: string;
  name: string;
  displayName: string;
  latitude: string;
  longitude: string;
  locationType: string;
  state?: State;
  country?: Country;
}

interface LatLng {
  lat: number;
  lng: number;
}

interface Bounds {
  northeast: LatLng;
  southwest: LatLng;
}

interface Geometry {
  bounds: Bounds;
  location: LatLng;
  viewport: Bounds;
  location_type: string;
}

interface State {
  id: string;
  name: string;
  geometry: Geometry;
}

interface Country {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
}
