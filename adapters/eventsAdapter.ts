import {
  EventsResponse,
  Event,
  CalendarMonthEvent,
  CalendarWeekEventsResponse,
  MapEventsResponse,
  GTMEventDetail,
} from "@/types/events";
import { newCategories } from "@/data/categories";
import { designations } from "@/data/designations";

export const EventsAdapter = {
  adaptRequestParams: (params: URLSearchParams): Record<string, string> => {
    const adaptedParams: Record<string, string> = {
      sortBy: "score",
      sortType: "desc",
      max: "20",
      offset: params.get("skip") || "0",
    };

    if (params.get("show") || params.get("trust_score_gte")) {
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
      if (showsParams?.includes("estimatedExhibitors"))
        adaptedShowsParams.push("estimatedExhibitScore");
      if (showsParams?.includes("scores")) {
        adaptedShowsParams.push("eventImpactScore");
        adaptedShowsParams.push("inboundScore");
        adaptedShowsParams.push("internationalScore");
      }
      if (showsParams?.includes("ranking")) {
        adaptedShowsParams.push("eventRanking");
      }
      if (params.get("trust_score_gte")) {
        adaptedShowsParams.push("trustScore");
      }
      if (showsParams?.includes("audienceZone")) {
        adaptedShowsParams.push("audienceZone");
      }
      if (adaptedShowsParams.length > 0)
        adaptedParams.shows = adaptedShowsParams.join(",");
    }

    if (params.get("eventName")) {
      adaptedParams.eventName = params.get("eventName")!;
      return adaptedParams;
    }

    if (params.get("onlyBranded") !== null) {
      adaptedParams.eventBrand = params.get("onlyBranded") ?? "";
    }
    if (params.get("onlySeries") !== null) {
      adaptedParams.eventSeries = params.get("onlySeries") ?? "";
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
    if (params.get("estimatedVisitorRangeTag")) {
      adaptedParams.estimatedVisitorRangeTag = params.get(
        "estimatedVisitorRangeTag"
      )!;
    }
    const activeGte = params.get("active_gte");
    const activeLte = params.get("active_lte");

    if (activeGte) {
      const startDate = new Date(activeGte).toISOString().split("T")[0];
      adaptedParams.startDate = `${startDate},${startDate}`;
    }
    if (activeLte) {
      const endDate = new Date(activeLte).toISOString().split("T")[0];
      adaptedParams.endDate = `${endDate},${endDate}`;
    }
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
    if (params.get("ratings")) {
      adaptedParams.eventRating = params.get("ratings")!;
    }
    if (params.get("maturity")) {
      adaptedParams.maturity = params.get("maturity")!;
    }
    if (params.get("frequencies")) {
      const frequencies = params.get("frequencies");
      const res = frequencies
        ?.split(",")
        ?.map((item) => item!.charAt(0).toUpperCase() + item!.slice(1))
        .join(",");
      adaptedParams.eventFrequency = res || "";
    }

    if (params.get("includeKeywords") || params.get("excludeKeywords")) {
      const includeKeywords = params.get("includeKeywords")
        ? params
            .get("includeKeywords")!
            .split(",")
            .map((keyword) => `${keyword.trim().replace(/ /g, "_")}`)
            .join(",")
        : "";
      const excludeKeywords = params.get("excludeKeywords")
        ? params
            .get("excludeKeywords")!
            .split(",")
            .map((keyword) => `${keyword.trim().replace(/ /g, "_")}`)
            .join(",")
        : "";

      if (includeKeywords) adaptedParams.includeKeywords = includeKeywords;
      if (excludeKeywords) adaptedParams.excludeKeywords = excludeKeywords;
      // adaptedParams.eventKeywords = includeKeywords + "+" + excludeKeywords;
    }

    if (params.get("estimatedVisitors")) {
      adaptedParams.eventSize = params.get("estimatedVisitors")!;
    }

    if (params.get("estimatedExhibitors")) {
      adaptedParams.estimatedExhibitScore = params.get("estimatedExhibitors")!;
    }

    if (params.get("impact_score_gte") && params.get("impact_score_lte")) {
      adaptedParams.eventImpactScore = `${params.get(
        "impact_score_gte"
      )}-${params.get("impact_score_lte")}`;
    }

    if (params.get("inbound_score_gte") && params.get("inbound_score_lte")) {
      adaptedParams.inboundScore = `${params.get(
        "inbound_score_gte"
      )}-${params.get("inbound_score_lte")}`;
    }

    if (params.get("top")) {
      adaptedParams.eventRanking = `0-${params.get("top")}`;
    }

    if (params.get("designations")) {
      const designationSlugs = params.get("designations")?.split(",") || [];
      const designationIds = designationSlugs.map((slug) => {
        const designation = designations.find((des) => des.slug === slug);
        return designation ? designation.id : slug;
      });
      adaptedParams.designation = designationIds.join(",");
    }

    if (params.get("audienceSpread")) {
      adaptedParams.audienceSpread = params.get("audienceSpread")!;
    }

    if (
      params.get("international_score_gte") &&
      params.get("international_score_lte")
    ) {
      adaptedParams.internationalScore = `${params.get(
        "international_score_gte"
      )}-${params.get("international_score_lte")}`;
    }

    if (params.get("trust_score_gte") || params.get("trust_score_lte")) {
      adaptedParams.trustScore = params.get("trust_score_gte")!;
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
      const categoryIds = categorySlugs.map((slug) => {
        const category = newCategories.find((cat) => cat.slug === slug);
        return category ? category.id : slug;
      });
      adaptedParams.eventCategory = categoryIds.join(",");
    }

    if (params.get("viewBound")) {
      const viewBound = JSON.parse(params.get("viewBound") || "{}");
      const coordinates = JSON.parse(viewBound.coordinates);
      adaptedParams.mapRadius = (coordinates.radius * 1000).toString();
      adaptedParams.latitude = coordinates.latitude;
      adaptedParams.longitude = coordinates.longitude;
    }

    if (params.get("geoCoordinates")) {
      const geoCoordinates = JSON.parse(params.get("geoCoordinates") || "");
      adaptedParams.mapRadius = String(geoCoordinates.radius * 1000);
      adaptedParams.latitude = geoCoordinates.latitude;
      adaptedParams.longitude = geoCoordinates.longitude;
    }
    if (
      params.get("active_gte") &&
      params.get("active_lte") &&
      params.get("view") == "calendar"
    ) {
      const startDate = params.get("active_gte");
      const endDate = params.get("active_lte");
      adaptedParams.groupBy = `${startDate},${endDate}`;
      adaptedParams.startDate = `${startDate},${endDate}` || "";
      adaptedParams.endDate = `${startDate},${endDate}` || "";
    }

    if (
      !params.get("active_gte") &&
      !params.get("active_lte") &&
      params.get("view") == "calendar"
    ) {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );

      const startDate = firstDayOfMonth.toISOString().split("T")[0];
      const endDate = lastDayOfMonth.toISOString().split("T")[0];
      adaptedParams.groupBy = `${startDate},${endDate}`;
      adaptedParams.startDate = `${startDate},${endDate}` || "";
      adaptedParams.endDate = `${startDate},${endDate}` || "";
    }

    if (
      params.get("active_gte") &&
      !params.get("active_lte") &&
      params.get("view") == "calendar"
    ) {
      const startDate = new Date(params.get("active_gte")!);
      const endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 1);
      adaptedParams.groupBy = `${startDate.toISOString().split("T")[0]},${
        endDate.toISOString().split("T")[0]
      }`;
      adaptedParams.startDate =
        `${startDate.toISOString().split("T")[0]},${
          endDate.toISOString().split("T")[0]
        }` || "";
      adaptedParams.endDate =
        `${startDate.toISOString().split("T")[0]},${
          endDate.toISOString().split("T")[0]
        }` || "";
    }

    if (
      !params.get("active_gte") &&
      params.get("active_lte") &&
      params.get("view") == "calendar"
    ) {
      const endDate = new Date(params.get("active_lte")!);
      const startDate = new Date(endDate);
      startDate.setFullYear(endDate.getFullYear() - 1);
      adaptedParams.groupBy = `${startDate.toISOString().split("T")[0]},${
        endDate.toISOString().split("T")[0]
      }`;
      adaptedParams.startDate =
        `${startDate.toISOString().split("T")[0]},${
          endDate.toISOString().split("T")[0]
        }` || "";
      adaptedParams.endDate =
        `${startDate.toISOString().split("T")[0]},${
          endDate.toISOString().split("T")[0]
        }` || "";
    }

    if (params.get("take")) {
      adaptedParams.max = params.get("take")!;
    }

    if (params.get("skip")) {
      adaptedParams.offset = params.get("skip")!;
    }

    if (params.get("view") == "map") {
      adaptedParams.max = "50";
    }

    if (params.get("query")) {
      adaptedParams.eventName = params.get("query")!;
    }

    return adaptedParams;
  },

  adaptEventCountRequestParam: (params: URLSearchParams) => {
    const adaptedParams: any = {};

    if (params.get("locationIds")) {
      adaptedParams.locationIds = params.get("locationIds");
    }

    if (params.get("groupBy")) {
      adaptedParams.groupBy = params.get("groupBy");
    }

    if (params.get("categories")) {
      const categorySlugs = params.get("categories")?.split(",") || [];
      const categoryIds = categorySlugs.map((slug) => {
        const category = newCategories.find((cat) => cat.slug === slug);
        return category ? category.id : slug;
      });
      adaptedParams.eventCategory = categoryIds.join(",");
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
    if (params.get("ratings")) {
      adaptedParams.eventRating = params.get("ratings")!;
    }
    if (params.get("maturity")) {
      adaptedParams.maturity = params.get("maturity")!;
    }
    if (params.get("frequencies")) {
      adaptedParams.eventFrequency =
        params.get("frequencies")!.charAt(0).toUpperCase() +
        params.get("frequencies")!.slice(1);
    }

    if (params.get("includeKeywords") || params.get("excludeKeywords")) {
      const includeKeywords = params.get("includeKeywords")
        ? params
            .get("includeKeywords")!
            .split(",")
            .map((keyword) => `${keyword.trim().replace(/ /g, "_")}`)
            .join("+")
        : "";
      const excludeKeywords = params.get("excludeKeywords")
        ? params
            .get("excludeKeywords")!
            .split(",")
            .map((keyword) => `-${keyword.trim()}`)
            .join("+")
        : "";

      adaptedParams.eventKeywords = includeKeywords + "+" + excludeKeywords;
    }

    if (params.get("estimatedVisitors")) {
      adaptedParams.eventSize = params.get("estimatedVisitors")!;
    }

    if (params.get("estimatedExhibitors")) {
      adaptedParams.estimatedExhibitScore = params.get("estimatedExhibitors")!;
    }

    if (params.get("impact_score_gte") && params.get("impact_score_lte")) {
      adaptedParams.eventImpactScore = `${params.get(
        "impact_score_gte"
      )}-${params.get("impact_score_lte")}`;
    }

    if (params.get("inbound_score_gte") && params.get("inbound_score_lte")) {
      adaptedParams.inboundScore = `${params.get(
        "inbound_score_gte"
      )}-${params.get("inbound_score_lte")}`;
    }

    if (params.get("top")) {
      adaptedParams.eventRanking = `0-${params.get("top")}`;
    }

    if (params.get("designations")) {
      const designationSlugs = params.get("designations")?.split(",") || [];
      const designationIds = designationSlugs.map((slug) => {
        const designation = designations.find((des) => des.slug === slug);
        return designation ? designation.id : slug;
      });
      adaptedParams.designation = designationIds.join(",");
    }

    if (params.get("audienceSpread")) {
      adaptedParams.audienceSpread = params.get("audienceSpread")!;
    }

    if (
      params.get("international_score_gte") &&
      params.get("international_score_lte")
    ) {
      adaptedParams.internationalScore = `${params.get(
        "international_score_gte"
      )}-${params.get("international_score_lte")}`;
    }

    if (params.get("trust_score_gte") || params.get("trust_score_lte")) {
      adaptedParams.trustScore = params.get("trust_score_gte")!;
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

    if (params.get("onlyBranded") !== null) {
      adaptedParams.eventBrand = params.get("onlyBranded") ?? "";
    }
    if (params.get("onlySeries") !== null) {
      adaptedParams.eventSeries = params.get("onlySeries") ?? "";
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
                eventType: determineEventType(item.eventType),
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

    if (params.get("view") === "map") {
      return {
        count: response.stats.totalEvents,
        events: response.events.map((item: any) => ({
          id: item.id,
          eventImpactScore: null,
          latitude:
            item.location.geoCordinates.latitude ||
            item.location.cityCordinates.latitude,
          longitude:
            item.location.geoCordinates.longitude ||
            item.location.cityCordinates.longitude,
          eventType: determineEventType(item.type[0]),
        })),
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
          audienceZone: item.audienceZone,
          description: item.description,
          logoUrl: item.logoUrl,
          bannerUrl: null,
          editions: 1,
          sponsorsCount: 0,
          speakersCount: 0,
          "trustScore%": item["trustScore%"],
          "10TimesUrl": item["10TimesUrl"],
          frequency: item.frequency || null,
          co_organizers: [],
          rankings: item.ranking
            ? {
                globalRank: item.ranking.globalRank ?? null,
                countryRank: item.ranking.countryRank ?? undefined,
                categoryRank: item.ranking.categoryRank ?? undefined,
                countryCategoryRank:
                  item.ranking.countryCategoryRank ?? undefined,
                rank: item.ranking.rank ?? null,
                rankRange: params.get("top") || null,
                rankType: null,
                categoryId: null,
                countryId: null,
              }
            : undefined,

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
          primaryEventType: determineEventType(item.type[0]),
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
          scores:
            item.eventImpactScore ||
            item.eventInboundScore ||
            item.internationalScore
              ? {
                  impactScore: item.eventImpactScore || null,
                  inboundScore: item.eventInboundScore || null,
                  internationalScore: item.internationalScore || null,
                }
              : null,
          rating: item.stats.rating || null,
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

  adaptEventByIdResponse: (response: any) => {
    return {
      event: {
        id: response.events[0].id,
        name: response.events[0].name,
        startDateTime: response.events[0].startDate.split("T")[0],
        endDateTime: response.events[0].endDate.split("T")[0],
        status: response.events[0].status.toLowerCase(),
        format: response.events[0].format.toLowerCase(),
        createdAt: response.events[0].createdAt,
        updatedAt: response.events[0].createdAt,
        description: response.events[0].description,
        logoUrl: response.events[0].logoUrl,
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
        exhibitorsCount:
          parseInt(response.events[0].stats.estimatedExhibitor) || null,
        timings: {
          [response.events[0].startDate.split("T")[0]]: {
            endTime: response.events[0].endDate.split("T")[1].slice(0, 5),
            startTime: response.events[0].startDate.split("T")[1].slice(0, 5),
          },
        },
        entryType: response.events[0].entryType,
        website: response.events[0].url,
        repeatSentiment: response.events[0].repeatSentiment,
        reputationScore: response.events[0].reputationSentiment,
        rehostScore: 0,
        estimatedAttendance: response.events[0].stats.estimatedVisitor,
        currency: {
          name: "USD",
          symbol: "$",
        },
        predictedEventSpendBreakUp: [],
        primaryEventType: (() => {
          const type = response.events[0].type[0].toLowerCase();
          if (type === "tradeshow") return "tradeshows";
          if (type === "conference") return "conferences";
          return type;
        })(),
        categories: response.events[0].categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })),
        eventTypes: response.events[0].type.map((type: string) => ({
          id: "",
          name: type,
          slug: type.toLowerCase(),
          eventGroupType: "ATTENDED",
        })),
        tags: response.events[0].eventKeywords.map((keyword: string) => ({
          id: "",
          name: keyword,
          slug: keyword.toLowerCase(),
        })),
        venueLocation: {
          venue: {
            id: "",
            name: response.events[0].location.venueName,
            cityId: response.events[0].location.cityId,
            stateId: "",
            countryId: response.events[0].location.countryId,
            latitude: response.events[0].location.geoCordinates.latitude,
            longitude: response.events[0].location.geoCordinates.longitude,
            address: response.events[0].location.venueAddress,
            locationType: "VENUE",
          },
          city: {
            id: response.events[0].location.cityId,
            name: response.events[0].location.cityName,
            stateId: "",
            countryId: response.events[0].location.countryId,
            latitude: response.events[0].location.cityCordinates.latitude,
            longitude: response.events[0].location.cityCordinates.longitude,
            locationType: "CITY",
          },
          state: {
            id: "",
            name: "",
            countryId: response.events[0].location.countryId,
            latitude: "",
            longitude: "",
            locationType: "STATE",
          },
          country: {
            id: response.events[0].location.countryId,
            name: response.events[0].location.countryName,
            latitude: "",
            longitude: "",
            regions: response.events[0].eventZone,
            locationType: "COUNTRY",
            displayName: response.events[0].location.countryName,
            iso: response.events[0].location.countryIso,
          },
        },
        organizer: response.events[0].organizer
          ? {
              id: response.events[0].organizer.id,
              name: response.events[0].organizer.name,
              website: response.events[0].organizer.website,
              logoUrl: response.events[0].organizer.logoUrl,
              location: response.events[0].organizer.location,
            }
          : null,
        isSaved: false,
        economicImpact: null,
        scores: {
          impactScore: response.events[0].eventImpactScore || null,
          inboundScore: response.events[0].eventInboundScore || null,
          internationalScore: response.events[0].internationalScore || null,
        },
        rating: response.events[0].stats.eventRating || null,
        audienceSpread: response.events[0].audienceSpread || null,
        rehostDate: response.events[0].isforecasted || null,
        isBranded: response.events[0].eventBrand || null,
        isSeries: response.events[0].eventSeries || null,
        maturity: response.events[0].maturity || null,
      },
    };
  },
  adaptEventDetailByIdResponse: (response: any): { event: GTMEventDetail } => {
    return {
      event: {
        id: response.event.id,
        name: response.event.name,
        startDateTime: response.event.startDate.split("T")[0],
        endDateTime: response.event.endDate.split("T")[0],
        status: response.event.status.toLowerCase(),
        format: response.event.format.toLowerCase(),
        createdAt: response.event.createdAt,
        updatedAt: response.event.createdAt,
        audienceZone: response.event.audienceZone,
        description: response.event.description,
        logoUrl: response.event.logoUrl,
        bannerUrl: null,
        editions: 1,
        exhibitorsCount: response.event.confirmedExhibitor,
        sponsorsCount: response.event.confirmedSponsor,
        speakersCount: response.event.confirmedSpeaker,
        frequency: response.event.frequency || null,
        co_organizers: [],
        rankings: {
          rank: null,
          globalRank: undefined,
          countryRank: undefined,
          categoryRank: null,
          countryCategoryRank: null,
          rankRange: null,
          rankType: null,
          categoryId: null,
          countryId: null,
        },
        // exhibitorsCount: parseInt(response.event.stats.estimatedExhibitor) || null,
        timings: {
          [response.event.startDate.split("T")[0]]: {
            endTime: response.event.endDate.split("T")[1].slice(0, 5),
            startTime: response.event.startDate.split("T")[1].slice(0, 5),
          },
        },
        entryType: response.event.entryType,
        website: response.event.url,
        repeatSentiment: response.event.repeatSentiment,
        reputationScore: response.event.reputationSentiment,
        rehostScore: 0,
        estimatedAttendance: response.event.stats.estimatedVisitor,
        currency: {
          name: "USD",
          symbol: "$",
        },
        designationSpread: response.event.designationSpread,
        designation: response.event.designation,
        predictedEventSpendBreakUp: [],
        primaryEventType: (() => {
          const type = response.event.type[0].toLowerCase();
          if (type === "tradeshow") return "tradeshows";
          if (type === "conference") return "conferences";
          return type;
        })(),
        categories: response.event.categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })),
        eventTypes: response.event.type.map((type: string) => ({
          id: "",
          name: type,
          slug: type.toLowerCase(),
          eventGroupType: "ATTENDED",
        })),
        tags: response.event.eventKeywords.map((keyword: string) => ({
          id: "",
          name: keyword,
          slug: keyword.toLowerCase(),
        })),
        venueLocation: {
          venue: {
            id: "",
            name: response.event.location.venueName,
            cityId: response.event.location.cityId,
            stateId: "",
            countryId: response.event.location.countryId,
            latitude: response.event.location.geoCordinates.latitude,
            longitude: response.event.location.geoCordinates.longitude,
            address: response.event.location.venueAddress,
            locationType: "VENUE",
          },
          city: {
            id: response.event.location.cityId,
            name: response.event.location.cityName,
            stateId: "",
            countryId: response.event.location.countryId,
            latitude: response.event.location.cityCordinates.latitude,
            longitude: response.event.location.cityCordinates.longitude,
            locationType: "CITY",
          },
          state: {
            id: "",
            name: "",
            countryId: response.event.location.countryId,
            latitude: "",
            longitude: "",
            locationType: "STATE",
          },
          country: {
            id: response.event.location.countryId,
            name: response.event.location.countryName,
            latitude: "",
            longitude: "",
            regions: response.event.eventZone,
            locationType: "COUNTRY",
            displayName: response.event.location.countryName,
            iso: response.event.location.countryIso,
          },
        },
        organizer: response.event.organizer
          ? {
              id: response.event.organizer.id,
              name: response.event.organizer.name,
              website: response.event.organizer.website,
              logo: response.event.organizer.logo,
              cityName: response.event.organizer.cityName,
              countryName: response.event.organizer.countryName,
              totalOrganize: response.event.organizer.totalOrganize,
            }
          : null,
        isSaved: false,
        economicImpact: null,
        "trustScore%": response.event["trustScore%"],
        "10TimesUrl": response.event["10TimesUrl"],
        scores: {
          impactScore: response.event.eventImpactScore || null,
          inboundScore: response.event.eventInboundScore || null,
          internationalScore: response.event.internationalScore || null,
        },
        rating: response.event.stats.eventRating || null,
        audienceSpread: response.event.audienceSpread || null,
        rehostDate: response.event.isforecasted || null,
        futureExpectedStartDate: response.event.futureExpectedStartDate || null,
        futureExpectedEndDate: response.event.futureExpectedEndDate || null,
        isBranded: response.event.eventBrand || null,
        isSeries: response.event.eventSeries || null,
        maturity: response.event.maturity || null,
        above5CountryEvent: response.event.above5CountryEvent || [],
        below5CountryEvent: response.event.below5CountryEvent || [],
        above5GlobalEvent: response.event.above5GlobalEvent || [],
        below5GlobalEvent: response.event.below5GlobalEvent || [],
        above5CategoryEvent: response.event.above5CategoryEvent || [],
        below5CategoryEvent: response.event.below5CategoryEvent || [],
        above5CountryCategoryRankEvent:
          response.event.above5CountryCategoryRankEvent || [],
        below5CountryCategoryEvent:
          response.event.below5CountryCategoryEvent || [],
        rankData: {
          global: response.event.rankData.global,
          country: {
            name: response.event.rankData.country.name,
            rank: response.event.rankData.country.rank,
            maxRank: response.event.rankData.country.maxRank,
          },
          category: response.event.rankData.category,
          countryCategoryRank: response.event.rankData.countryCategoryRank,
        },
        stats: {
          score: response.event.stats.score,
          eventFollower: response.event.stats.eventFollower,
          estimatedVisitor: response.event.stats.estimatedVisitor,
          rating: response.event.stats.rating,
          estimatedExhibitor: response.event.stats.estimatedExhibitor,
        },
      },
    };
  },

  adaptRecentSearchResponse: (response: any) => {
    // Convert shows string back to original filter names
    const showsMapping: Record<string, string> = {
      eventBrand: "branded",
      eventSeries: "series",
      eventRating: "rating",
      eventFrequency: "frequency",
      maturity: "maturity",
      isforecasted: "forecasted",
      estimatedExhibitScore: "estimatedExhibitors",
      eventImpactScore: "scores",
      inboundScore: "scores",
      internationalScore: "scores",
      eventRanking: "ranking",
      trustScore: "trustScore",
      audienceZone: "audienceZone"
    };

    const shows = response.shows?.split(',').map((show: string) => {
      return showsMapping[show] || show;
    }).filter((value: string, index: number, self: string[]) => 
      // Remove duplicates (especially for "scores" which maps to multiple values)
      self.indexOf(value) === index
    ) || [];

    return {
      eventCategory: response.eventCategory?.map((cat: any) => ({
        id: cat.id,
        name: cat.name
      })) || [],
      
      eventType: response.eventType?.map((type: string) => 
        type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
      ) || [],
      
      eventStatus: response.eventStatus?.split(',') || [],
      eventFormat: response.eventFormat?.split(',') || [],
      eventEntry: response.eventEntry?.split(',') || [],
      eventRating: response.eventRating || null,
      
      dateRange: {
        startDate: response.startDate?.split(',')[0] || null,
        endDate: response.endDate?.split(',')[1] || null
      },
      
      sorting: {
        sortBy: response.sortBy || 'score',
        sortType: response.sortType || 'desc'
      },
      
      eventRanking: response.eventRanking || null,
      eventFrequency: response.eventFrequency?.split(',') || [],
      eventSeries: response.eventSeries === 'true',
      maturity: response.maturity || null,
      
      scores: {
        estimatedExhibitScore: response.estimatedExhibitScore || null,
        eventImpactScore: response.eventImpactScore || null
      },
      
      eventBrand: response.eventBrand === 'true',
      
      shows,
      
      designation: response.designation || null,
      
      locations: {
        cities: response.locationIds?.city?.map((city: any) => ({
          id: Object.keys(city)[0],
          name: Object.values(city)[0]
        })) || [],
        states: response.locationIds?.state || [],
        eventCities: response.eventCity?.map((city: any) => ({
          id: Object.keys(city)[0],
          name: Object.values(city)[0]
        })) || [],
        eventStates: response.eventState || [],
        eventCountries: response.eventCountry || []
      },
      
      keywords: {
        include: response.includeKeywords || null
      },
      
      estimatedVisitorRangeTag: response.estimatedVisitorRangeTag || null
    };
  },
};

function determineEventType(item: string): string {
  if (!item) return "";
  if (item.toLowerCase() === "tradeshow") return "tradeshows";
  if (item.toLowerCase() === "conference") return "conferences";
  if (item.toLowerCase() === "workshop") return "workshops";
  else return "unknown";
}
