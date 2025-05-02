export const MapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
export const isEventeli = true;
export const BASE_URL = isEventeli
  ? process.env.NEXT_PUBLIC_EVENTELI_URL
  : process.env.NEXT_PUBLIC_EVENTGENI_URL;
