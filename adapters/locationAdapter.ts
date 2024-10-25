import { SearchLocationResponse } from "@/types/locations";

export const LocationAdapter = {
  adaptDatabaseLocationAutocomplete: (
    response: any
  ): SearchLocationResponse => {
    return {
      formattedLocations: response.map((item: any) => ({
        id: item.id,
        name: item.name,
        displayName: `${item.name}${item.state ? `, ${item.state}` : ''}${item.countryName ? `, ${item.countryName}` : ''}`.trim(),
        latitude: item.latitude,
        longitude: item.longitude,
        locationType: item.type,
        state: {
          id: "",
          name: item.state,
          geometry: {
            bounds: {
              northeast: { lat: 0, lng: 0 },
              southwest: { lat: 0, lng: 0 },
            },
            location: {
              lat: parseFloat(item.latitude),
              lng: parseFloat(item.longitude),
            },
            viewport: {
              northeast: { lat: 0, lng: 0 },
              southwest: { lat: 0, lng: 0 },
            },
            location_type: "APPROXIMATE",
          },
        },
        country: {
          id: "",
          name: item.countryName,
          latitude: "0",
          longitude: "0",
          iso: "",
        },
      })),
    };
  },
};
