import {
  EventsResponse,
  Event,
  CalendarMonthEvent,
  CalendarWeekEventsResponse,
  MapEventsResponse,
} from "@/types/events";
import { newCategories } from "@/data/categories";

export const EventsAdapter = {
  adaptRequestParams: (params: URLSearchParams): Record<string, string> => {
    const adaptedParams: Record<string, string> = {
      sortBy: "score",
      sortType: "desc",
      max: "10",
      offset: params.get("skip") || "0",
      eventCategory: "all",
    };

    if (params.get("show")) {
      const adaptedShowsParams = [];
      const showsParams = params.get("show");
      if (showsParams?.includes("branded"))
        adaptedShowsParams.push("eventBrand");
      if (showsParams?.includes("series"))
        adaptedShowsParams.push("eventSeries");
      if (showsParams?.includes("rating"))
        adaptedShowsParams.push("eventRating");
      if (showsParams?.includes("frequency"))
        adaptedShowsParams.push("eventFrequency");
      if (showsParams?.includes("maturity"))
        adaptedShowsParams.push("maturity");
      if (showsParams?.includes("forecasted"))
        adaptedShowsParams.push("isforecasted");
      if (showsParams?.includes("impact_score"))
        adaptedShowsParams.push("eventImpactScore");
      if (showsParams?.includes("inbound_score"))
        adaptedShowsParams.push("eventInboundScore");
      if (showsParams?.includes("international_score"))
        adaptedShowsParams.push("internationalScore");
      if (adaptedShowsParams.length > 0)
        adaptedParams.shows = adaptedShowsParams.join(",");
    }

    if (params.get("categories")) {
      adaptedParams.eventCategory = params.get("categories")!;
    }

    if (params.get("eventTypes")) {
      adaptedParams.eventType = params
        .get("eventTypes")!
        .split(",")
        .map(
          (type) =>
            type.charAt(0).toUpperCase() + type.slice(1).replace(/s$/, "")
        )
        .join(",");
    }

    const activeGte = params.get("active_gte");
    const activeLte = params.get("active_lte");
    if (activeGte && activeLte) {
      const startDate = new Date(activeGte).toISOString().split("T")[0];
      const endDate = new Date(activeLte).toISOString().split("T")[0];
      adaptedParams.startDate = `${startDate},${endDate}`;
      adaptedParams.endDate = `${startDate},${endDate}`;
    }

    if (params.get("locationIds")) {
      adaptedParams.locationIds = params.get("locationIds")!;
    }

    if (params.get("status")) {
      adaptedParams.eventStatus = params.get("status")!.toUpperCase();
    }
    if (params.get("eventFormats")) {
      adaptedParams.eventFormat = params.get("eventFormats")!;
    }
    if (params.get("entryType")) {
      adaptedParams.eventEntry = params.get("entryType")!.toUpperCase();
    }

    if (params.get("view") == "calendar") {
      adaptedParams.groupBy = adaptedParams.startDate;
      delete adaptedParams.startDate;
      delete adaptedParams.endDate;
    }

    if (params.get("eventIds")) {
      adaptedParams.eventId = params.get("eventIds")!;
    }

    if (params.get("categories")) {
      const categorySlugs = params.get("categories")?.split(",") || [];
      const categoryIds = categorySlugs.map(slug => {
        const category = newCategories.find(cat => cat.slug === slug);
        return category ? category.id : slug;
      });
      adaptedParams.eventCategory = categoryIds.join(",");
    }

    return adaptedParams;
  },

  adaptResponse: (
    response: any,
    params: URLSearchParams
  ): EventsResponse | CalendarWeekEventsResponse | MapEventsResponse => {
    if (
      params.get("view") === "calendar" &&
      params.get("calendar_type") === "week"
    ) {
      const eventMap = new Map();

      Object.values(response).forEach((day: any) => {
        if (day.event && Array.isArray(day.event)) {
          day.event.forEach((item: any) => {
            if (!eventMap.has(item.id)) {
              eventMap.set(item.id, {
                id: item.id,
                name: item.name,
                startDateTime: item.startDate?.split("T")[0],
                endDateTime: item.endDate?.split("T")[0],
                impactScore: 0, // Adjust if impact score is available
                eventType: determineEventType(item),
              });
            }
          });
        }
      });

      const distinctEvents = Array.from(eventMap.values());

      return {
        count: distinctEvents.length,
        events: distinctEvents,
      };
    } else if (params.get("view") === "calendar") {
      const events: any = {};
      let totalCount = 0;

      Object.entries(response).forEach(([date, dayData]: [string, any]) => {
        totalCount += dayData.totalEvent || 0;

        events[date] = {
          total: dayData.totalEvent || 0,
          business: dayData.totalEvent || 0,
          social: 0,
          averageImpactScore: 0,
        };
      });

      return {
        count: totalCount,
        events: events,
      };
    }

    return {
      count: response.stats.totalEvents,
      events: response.events.map(
        (item: any): Event => ({
          id: item.id,
          name: item.name,
          startDateTime: item.startDate.split("T")[0],
          endDateTime: item.endDate.split("T")[0],
          status: item.status.toLowerCase(),
          format: item.format.toLowerCase(),
          createdAt: item.createdAt,
          updatedAt: item.createdAt,
          description: item.description,
          logoUrl: item.logoUrl,
          bannerUrl: null,
          editions: 1,
          sponsorsCount: 0,
          speakersCount: 0,
          frequency: null,
          co_organizers: [],
          rankings: {
            rank: null,
            rankRange: null,
            rankType: null,
            categoryId: null,
            countryId: null,
          },
          exhibitorsCount: parseInt(item.stats.estimatedExhibitor) || null,
          timings: {
            [item.startDate.split("T")[0]]: {
              endTime: item.endDate.split("T")[1].slice(0, 5),
              startTime: item.startDate.split("T")[1].slice(0, 5),
            },
          },
          entryType: item.entryType,
          website: item.url,
          repeatSentiment: item.repeatSentiment,
          reputationScore: item.reputationSentiment,
          rehostScore: 0,
          estimatedAttendance: item.stats.estimatedVisitor,
          currency: {
            name: "USD",
            symbol: "$",
          },
          predictedEventSpendBreakUp: [],
          primaryEventType: (() => {
            const type = item.type[0].toLowerCase();
            if (type === "tradeshow") return "tradeshows";
            if (type === "conference") return "conferences";
            return type;
          })(),
          categories: item.categories.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
          })),
          eventTypes: item.type.map((type: string) => ({
            id: "",
            name: type,
            slug: type.toLowerCase(),
            eventGroupType: "ATTENDED",
          })),
          tags: item.eventKeywords.map((keyword: string) => ({
            id: "",
            name: keyword,
            slug: keyword.toLowerCase(),
          })),
          venueLocation: {
            venue: {
              id: "",
              name: item.location.venueName,
              cityId: item.location.cityId,
              stateId: "",
              countryId: item.location.countryId,
              latitude: item.location.geoCordinates.latitude,
              longitude: item.location.geoCordinates.longitude,
              address: item.location.venueAddress,
              locationType: "VENUE",
            },
            city: {
              id: item.location.cityId,
              name: item.location.cityName,
              stateId: "",
              countryId: item.location.countryId,
              latitude: item.location.cityCordinates.latitude,
              longitude: item.location.cityCordinates.longitude,
              locationType: "CITY",
            },
            state: {
              id: "",
              name: "",
              countryId: item.location.countryId,
              latitude: "",
              longitude: "",
              locationType: "STATE",
            },
            country: {
              id: item.location.countryId,
              name: item.location.countryName,
              latitude: "",
              longitude: "",
              regions: item.eventZone,
              locationType: "COUNTRY",
              displayName: item.location.countryName,
              iso: item.location.countryIso,
            },
          },
          organizer: item.organizer
            ? {
                id: item.organizer.id,
                name: item.organizer.name,
                website: item.organizer.website,
                logoUrl: item.organizer.logoUrl,
                location: item.organizer.location,
              }
            : null,
          isSaved: false,
          economicImpact: null,
          scores: {
            impactScore: item.eventImpactScore || null,
            inboundScore: item.eventInboundScore || null,
            internationalScore: item.internationalScore || null,
          },
          rating: item.stats.eventRating || null,
          audienceSpread: item.audienceSpread || null,
          rehostDate: item.isforecasted || null,
          isBranded: item.eventBrand || null,
          isSeries: item.eventSeries || null,
          maturity: item.maturity || null,
        })
      ),
    };
  },

  adaptEventCountResponse: (response: any) => {
    return response.map((item: any) => ({
      count: item.eventCount,
      cityId: item.cityId,
      name: item.name,
      latitude: item.geoCordinates.latitude,
      longitude: item.geoCordinates.longitude,
    }));
  },
};

function determineEventType(item: any): string {
  if (item.type && Array.isArray(item.type) && item.type.length > 0) {
    const type = item.type[0].toLowerCase();
    if (type === "tradeshow") return "tradeshows";
    if (type === "conference") return "conferences";
    return type;
  }
  return "unknown";
}
