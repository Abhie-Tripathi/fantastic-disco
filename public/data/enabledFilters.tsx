const enabledFilters = {
    eventType: {
      enabledValue: [
        "tradeshows", "conferences"
      ],
    },
    eventFormat: {
      enabledValue: [
        "offline",
        "online",
        // "hybrid"
      ],
    },
    locationIds: {
      enabledValue: [
        {
          description: "United States",
          id: "dd718c3c-be27-5c3e-bd82-dc78a23e01e0",
          type: "country"
        },
        {
          description: "India",
          id: "226e11ef-32fc-5484-9843-7087fdfb413d",
          type: "country"
        }
      ],
    },
    keywords: {
      isKeywordEnabled: true,
      positiveKeywords: ["ai"],
      negativeKeywords: ["ml"]
    },
    durations: {
      startDate: "2024-11-01,2025-04-30",
      endDate: "2024-11-01,2025-04-30",
    },
    eventCategory: {
      enabledValue: [
        {
          id: "ddb2bdad-a8c4-51aa-b99e-ef52374b7f73",
          slug: "finance"
        },
        {
          id: "b75fb787-9d26-5454-95af-9ee79e7aac65",
          slug: "baby-kids"
        }
      ],
    },
    eventStatus: {
      enabledValue: [
        "active",
        "cancelled",
        // "postponed",
        // "predicted"
      ],
    },
    eventEntry: {
      enabledValue: [
        // "free",
        "paid"
      ]
    },
    eventRating: {
      isRatingEnabled: true,
      enabledValue: [
        "0-1", 
        // "1-2",
        // "2-3",
        // "3-4",
        "4-5"
      ],
    },
    maturity: {
      isMaturityEnabled: true,
      enabledValue: [
        "new",
        "growing",
        // "established",
        // "flagship"
      ]
    },
    branded: {
      isBrandedEnabled: true,
      enabledValue: {
        isBranded: true,
        isSeries: false
      }
    },
    forecasted: {
      isForecastedEnabled: true,
    },
    eventFrequency: {
      isFreqEnabled: true,
      enabledValue: [
        "weekly", 
        // "monthly",
        // "quarterly",
        // "bi-annual",
        "annual",
        "biennial",
        "triennial",
      ],
    },
    eventSize: {
      enabledValue: [
        "0-500", 
        "500-1000",
        // "5000-10000",
        "10000-25000",
        // "25000-50000",
        // "50000-100000",
        // "100000-200000",
        "200000"
      ],
    },
    estimatedExhibitScore: {
      isExhibitorsEnabled: true,
      enabledValue: [
        "0-100", 
        "100-500",
        "500-1000",
        // "1000+"
      ],
    },
    analytics: {
      isAnalyticsEnabled: true,
    },
    eventRanking: {
      isRanking: true,
    },
    audienceZone: {
      isZoneEnabled: true,
    }, 
    designation: {
      isProfileEnabled: true,  // corrected spelling of 'isProfileEnabed'
    },
    audienceSpread: {
      isAudienceEnabled: false,
    }
  }
  export default enabledFilters;
  