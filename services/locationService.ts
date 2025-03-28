import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import externalAxios from "@/lib/externalAxios";
import { NominatimSearchResult } from "@/types/nominatim";
import {
  SearchLocationResponse,
  SavedLocationsResponse,
  SaveLocationDTO,
  SavedLocationInsightsResponse,
  SavedLocationInsightsByIdResponse,
} from "@/types/locations";
import { FeatureCollection, Polygon, MultiPolygon, Point, BBox } from "geojson";
import { LocationResponse } from "@/types/suggestion";
import { country_bounding_boxes } from "@/data/countryboundingbox";

export const useLocationService = () => {
  const api = useApi();

  const getNominatimAutocomplete = async (input: string) => {
    return externalAxios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: input, format: "json" },
    });
  };

  const getCoordinates = async (placeId: string) => {
    const data = await externalAxios.get(
      "https://nominatim.openstreetmap.org/details",
      {
        params: { place_id: placeId, format: "json" },
      }
    );
    const location = data.data.geometry.coordinates;
    return { lat: location[1], lng: location[0] };
  };

  const getLocationName = async (lat: number, lng: number): Promise<string> => {
    const data = await externalAxios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: { lat, lon: lng, format: "json" },
      }
    );
    return data.data.display_name;
  };
  // const getSavedLocationAutocomplete = (input: string) => {
  //   return api.request<SavedLocationsResponse>(
  //     `${endpoints.savedLocationsV1}`,
  //     {
  //       method: "GET",
  //       params: { query: input },
  //     }
  //   );
  // };

  // const getSavedLocationsInsights = (skip: number, sortBy: string) => {
  //   return api.request<SavedLocationInsightsResponse>(
  //     `${endpoints.savedLocationsV1}`,
  //     {
  //       method: "GET",
  //       params: {
  //         duration: "90D",
  //         offset: skip,
  //         sortBy: sortBy,
  //       },
  //     }
  //   );
  // };

  // const getSavedLocationInsightbyId = (id: string) => {
  //   return api.request<SavedLocationInsightsByIdResponse>(
  //     `${endpoints.savedLocations}/${id}`,
  //     {
  //       method: "GET",
  //       params: {
  //         duration: "90D",
  //       },
  //     }
  //   );
  // };

  // const saveLocation = (data: SaveLocationDTO[]) => {
  //   return api.request(`${endpoints.savedLocations}`, {
  //     method: "POST",
  //     data,
  //   });
  // };

  // const deleteSavedLocation = (id: string) => {
  //   return api.request(`${endpoints.savedLocations}/${id}`, {
  //     method: "DELETE",
  //   });
  // };

  const getDatabaseLocationAutocomplete = (
    input: string,
    locationType?: string
  ) => {
    return api.request<SearchLocationResponse>(
      `${endpoints.suggestions.location}`,
      {
        method: "GET",
        params: { query: input, type: locationType },
      }
    );
  };

  const getLocationDetails = async (id: string) => {
    const response = await api.request<SearchLocationResponse>(
      `${endpoints.locationSuggestion}`,
      {
        method: "GET",
        params: { ids: id },
      }
    );
    return response;
  };

  const getLocationBoundary = async (
    locationName: string
  ): Promise<FeatureCollection> => {
    try {
      const searchResponse = await externalAxios.get<NominatimSearchResult[]>(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: locationName,
            format: "json",
            polygon_geojson: 1,
          },
        }
      );

      if (searchResponse.data.length === 0) {
        throw new Error("Location not found");
      }

      const result =
        searchResponse.data.find(
          (item) =>
            item.geojson &&
            (item.geojson.type === "Polygon" ||
              item.geojson.type === "MultiPolygon")
        ) || searchResponse.data[0];

      let geometry: Polygon | MultiPolygon | Point;
      let bbox: BBox | undefined;

      if (
        result.geojson &&
        (result.geojson.type === "Polygon" ||
          result.geojson.type === "MultiPolygon")
      ) {
        geometry = result.geojson;
      } else {
        geometry = {
          type: "Point",
          coordinates: [parseFloat(result.lon), parseFloat(result.lat)],
        };
      }

      if (result.boundingbox) {
        bbox = [
          parseFloat(result.boundingbox[2]),
          parseFloat(result.boundingbox[0]),
          parseFloat(result.boundingbox[3]),
          parseFloat(result.boundingbox[1]),
        ];
      }

      return {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              name: result.display_name,
              osm_type: result.osm_type,
              osm_id: result.osm_id,
            },
            geometry: geometry,
            bbox: bbox,
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching location boundary:", error);
      throw error;
    }
  };

  const getLocationBBox = async (
    locationName: string
  ): Promise<BBox | undefined> => {
    const normalizedName = locationName.toLowerCase().trim();
    if (normalizedName === "united states" || normalizedName === "usa") {
      const [name, bbox] = country_bounding_boxes["US"];
      return bbox;
    }
    if (normalizedName === "new zealand" || normalizedName === "nz") {
      const [name, bbox] = country_bounding_boxes["NZ"];
      return bbox;
    }

    try {
      const response = await externalAxios.get<NominatimSearchResult[]>(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: locationName,
            format: "json",
            limit: 1,
          },
        }
      );

      if (response.data.length === 0) {
        throw new Error("Location not found");
      }

      const result = response.data[0];
      if (result.boundingbox) {
        return [
          parseFloat(result.boundingbox[2]),
          parseFloat(result.boundingbox[0]),
          parseFloat(result.boundingbox[3]),
          parseFloat(result.boundingbox[1]),
        ];
      }

      return undefined;
    } catch (error) {
      console.error("Error fetching location bbox:", error);
      throw error;
    }
  };

  return {
    getNominatimAutocomplete,
    // getSavedLocationAutocomplete,
    getDatabaseLocationAutocomplete,
    getCoordinates,
    getLocationName,
    // getSavedLocationsInsights,
    // deleteSavedLocation,
    // saveLocation,
    getLocationDetails,
    getLocationBoundary,
    getLocationBBox,
    // getSavedLocationInsightbyId,
    isLoading: api.isLoading,
    error: api.error,
  };
};
