import { Designations } from "@/types/misc";

export const MiscAdapter = {
  adaptDesignationsResponse: (
    response: any
  ): { designations: Designations[] } => {
    if (Array.isArray(response)) {
      return { designations: response };
    }
    return { designations: [] };
  },

  adaptCountriesResponse: (response: any): { formattedLocations: any[] } => {
    if (Array.isArray(response)) {
      const formattedLocations = response.map((country: any) => ({
        id: country.id,
        name: country.name,
        displayName: country.name,
        latitude: country.latitude,
        longitude: country.longitude,
        locationType: country.locationType,
        iso: country.countryCode,
      }));
      return { formattedLocations };
    }
    return { formattedLocations: [] };
  },

  adaptRegionsResponse: (): { regions: string[] } => {
    return {
      regions: [
        "Antarctica",
        "East Asia",
        "Eastern Europe",
        "India Subcontinent",
        "Latin America",
        "Middle East",
        "North America",
        "Northern Africa",
        "Northern Europe",
        "Oceania",
        "SouthEast Asia",
        "Southern Africa",
        "UK",
        "Western Europe",
      ],
    };
  },
};
