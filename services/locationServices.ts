import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import { FeatureCollection, Polygon, MultiPolygon, Point, BBox } from "geojson";
import { LocationAdapter } from "@/adapters/locationAdapter";

export const useLocationService = () => {
  const api = useApi();
  const getDatabaseLocationAutocomplete = async (input: string) => {
    const response = await api.request<any>(
      `${endpoints.locationSuggestion}`,
      {
        method: "GET",
        params: { q: input },
      }
    );
    return LocationAdapter.adaptDatabaseLocationAutocomplete(response);
  };
  return {
    // getNominatimAutocomplete,
    // getSavedLocationAutocomplete,
    getDatabaseLocationAutocomplete,
    // getCoordinates,
    // getLocationName,
    // // getSavedLocationsInsights,
    // // deleteSavedLocation,
    // // saveLocation,
    // getLocationDetails,
    // getLocationBoundary,
    // getLocationBBox,
    // getSavedLocationInsightbyId,
    isLoading: api.isLoading,
    error: api.error,
  };
}