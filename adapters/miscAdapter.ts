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

  adaptCoordinateRequestParam: (params: URLSearchParams): Record<string, string> => {
    const adaptedParams: Record<string, string> = {
      source: "internal",
      limit: "10",
    };

    const activeGte = params.get("active_gte");
    const activeLte = params.get("active_lte");
    if (activeGte && activeLte) {
      const startDate = new Date(activeGte).toISOString().split("T")[0];
      const endDate = new Date(activeLte).toISOString().split("T")[0];
      adaptedParams.duration = `${startDate},${endDate}`;
    }

    if (params.get("eventId")) {
      adaptedParams.eventId = params.get("eventId")!;
    }

    if (params.get("interest")) {
      adaptedParams.interest = params.get("interest")!;
    }

    if (params.get("liked")) {
      adaptedParams.liked = params.get("liked")!;
    }

    if(params.get('status')) {
      adaptedParams.status = params.get("status")!;
    }
    else {
      adaptedParams.status = 'IN_DISCUSSION,SHORTLISTED,REJECTED';
    }

    return adaptedParams;
  },
};
