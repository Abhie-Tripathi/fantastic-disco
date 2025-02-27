import { isEventeli } from "@/config";

type EventGroupType = "social" | "business" | "unAttended";

export interface EventType {
  id: string;
  label: string;
  isEnabled: boolean;
}

interface EventFormat {
  id: string;
  label: string;
  isEnabled: boolean;
}

export const searchFilters = {
    eventTypes: {
      isEnabled: true,
      options: {
        social: [
          { id: "festival", label: "Festival", isEnabled: true },
          { id: "concert", label: "Concert", isEnabled: true },
          { id: "sport", label: "Sport", isEnabled: true },
          { id: "performing-arts", label: "Performing Arts", isEnabled: true },
          { id: "community", label: "Community", isEnabled: true },
        ],
        business: [
          { id: "tradeshows", label: "Tradeshows", isEnabled: true },
          { id: "conferences", label: "Conferences", isEnabled: true },
          { id: "workshops", label: "Workshops", isEnabled: true },
        ],
        unAttended: [{ id: "holiday", label: "Holiday", isEnabled: true }],
      } as Record<EventGroupType, EventType[]>,
    },
  
    eventFormats: {
      isEnabled: true,
      options: [
        { id: "online", label: "Online/Virtual", isEnabled: true },
        { id: "offline", label: "Offline", isEnabled: true },
        { id: "hybrid", label: "Hybrid", isEnabled: true },
      ] as EventFormat[],
    },
  
    categories: {
      isEnabled: true,
      options: [
        {
          id: "6cf777d1-4a39-58d3-9a7d-2a4d9fd94f59",
          name: "Agriculture & Forestry",
          slug: "agriculture-forestry",
          isEnabled: true,
        },
        {
          id: "f6e9db7c-ae7a-5dab-b4ef-0f44ed9f5ac5",
          name: "Animals & Pets",
          slug: "animals-pets",
          isEnabled: true,
        },
        {
          id: "78a6c448-4ea5-55aa-94bf-7f4d52c1207a",
          name: "Apparel & Clothing",
          slug: "apparel-fashion",
          isEnabled: true,
        },
        {
          id: "ec0f4cc4-a5ca-5d75-809a-c4e34b344647",
          name: "Arts & Crafts",
          slug: "arts-crafts",
          isEnabled: true,
        },
        {
          id: "1c4d2f34-e5c5-58bc-a751-333c6010744d",
          name: "Auto & Automotive",
          slug: "automotive",
          isEnabled: true,
        },
        {
          id: "b75fb787-9d26-5454-95af-9ee79e7aac65",
          name: "Baby, Kids & Maternity",
          slug: "baby-kids",
          isEnabled: true,
        },
        {
          id: "ddb2bdad-a8c4-51aa-b99e-ef52374b7f73",
          name: "Banking & Finance",
          slug: "finance",
          isEnabled: true,
        },
        {
          id: "bc9570ef-7418-56b6-9664-6fc68f86fbf1",
          name: "Building & Construction",
          slug: "building-construction",
          isEnabled: true,
        },
        {
          id: "9778e936-2ccf-5c2b-a5ed-6cdefcd2deb2",
          name: "Business Services",
          slug: "business-consultancy",
          isEnabled: true,
        },
        {
          id: "8003cefd-9faa-5df4-b596-ae371029b710",
          name: "Education & Training",
          slug: "education-training",
          isEnabled: true,
        },
        {
          id: "350fda6c-6778-500e-ae97-aade11bba0e8",
          name: "Electric & Electronics",
          slug: "electronics-electricals",
          isEnabled: true,
        },
        {
          id: "abbcbea6-dae3-5ad7-bcd5-7532176f1e4f",
          name: "Entertainment & Media",
          slug: "entertainment",
          isEnabled: true,
        },
        {
          id: "7cedb4fe-1034-5d7b-b78b-ce626910428c",
          name: "Environment & Waste",
          slug: "waste-management",
          isEnabled: false,
        },
        {
          id: "fb687197-0b29-53ad-8056-e1a5d092c3fe",
          name: "Fashion & Beauty",
          slug: "fashion-accessories",
          isEnabled: true,
        },
        {
          id: "9d8d303c-8e46-53bf-8280-c954ca497c36",
          name: "Food & Beverages",
          slug: "food-beverage",
          isEnabled: true,
        },
        {
          id: "7a23ef89-72c7-52d4-ab63-263ce971ac0c",
          name: "Home & Office",
          slug: "home-office",
          isEnabled: true,
        },
        {
          id: "8ce0fae8-ae48-528f-bae1-668151f1109a",
          name: "Hospitality",
          slug: "hospitality",
          isEnabled: true,
        },
        {
          id: "4df15939-8144-5507-ae87-cf491580699e",
          name: "Industrial Engineering",
          slug: "engineering",
          isEnabled: false,
        },
        {
          id: "53b63b61-dc54-5bea-85fd-93b5ac8da525",
          name: "IT & Technology",
          slug: "technology",
          isEnabled: true,
        },
        {
          id: "482c81be-c5b1-5ed8-8306-0ec51cfda560",
          name: "Logistics & Transportation",
          slug: "logistics-transportation",
          isEnabled: true,
        },
        {
          id: "b97d648f-b1c6-513b-b4cf-8d4c749e7fb7",
          name: "Medical & Pharma",
          slug: "medical-pharma",
          isEnabled: true,
        },
        {
          id: "6194eb56-96c7-5914-acd4-5256353ea082",
          name: "Miscellaneous",
          slug: "trade-promotion",
          isEnabled: true,
        },
        {
          id: "2a1aabd1-1923-514c-86bc-7556550e14b8",
          name: "Packing & Packaging",
          slug: "packaging",
          isEnabled: true,
        },
        {
          id: "387d34b6-9b8a-58ab-b841-981a9534c2e6",
          name: "Power & Energy",
          slug: "power-energy",
          isEnabled: true,
        },
        {
          id: "13bfc587-7c7a-583c-a74f-b447c44edca8",
          name: "Science & Research",
          slug: "research",
          isEnabled: false,
        },
        {
          id: "3dc4b0f9-bc00-5862-8227-2f19a8569fd4",
          name: "Security & Defense",
          slug: "security",
          isEnabled: true,
        },
        {
          id: "891d0abb-d06b-5208-b95b-839b7e3f0696",
          name: "Telecommunication",
          slug: "telecommunication",
          isEnabled: true,
        },
        {
          id: "56482620-c2c7-5df4-bf68-bb91e7a9b6ab",
          name: "Travel & Tourism",
          slug: "travel-tourism",
          isEnabled: true,
        },
        {
          id: "770269a5-ff95-5e95-95a7-048e882e7302",
          name: "Wellness, Health & Fitness",
          slug: "wellness-healthcare",
          isEnabled: true,
        },
      ],
    },
  
    eventStatus: isEventeli
      ? {
          isEnabled: true,
          options: [
            { id: "active", label: "Active", isEnabled: true },
            { id: "cancelled", label: "Cancelled", isEnabled: true },
            { id: "postponed", label: "Postponed", isEnabled: true },
            { id: "predicted", label: "Predicted", isEnabled: false },
          ],
        }
      : {
          isEnabled: true,
          options: [
            { id: "active", label: "Active", isEnabled: true },
            { id: "cancelled", label: "Cancelled", isEnabled: true },
            { id: "postponed", label: "Postponed", isEnabled: true },
          ],
        },
  
    userRatings: {
      isEnabled: true,
      isToggleEnabled: true,
      options: [
        { id: "0-1", label: "0-1", isEnabled: true },
        { id: "1-2", label: "1-2", isEnabled: true },
        { id: "2-3", label: "2-3", isEnabled: true },
        { id: "3-4", label: "3-4", isEnabled: true },
        { id: "4-5", label: "4-5", isEnabled: false },
      ],
    },
  
    eventEntries: {
      isEnabled: true,
      options: [
        { id: "free", label: "Free", isEnabled: true },
        { id: "paid", label: "Paid", isEnabled: false },
      ],
    },
  
    maturityLevels: {
      isEnabled: true,
      isToggleEnabled: true,
      options: [
        { id: "new", label: "New", isEnabled: true },
        { id: "growing", label: "Growing", isEnabled: true },
        { id: "established", label: "Established", isEnabled: true },
        { id: "flagship", label: "Flagship", isEnabled: true },
      ],
    },
  
    globalAndTourings: {
      isEnabled: true,
      isToogleEnabled: true,
      options: [
        { id: "BRANDED", label: "Branded", isEnabled: true },
        { id: "SERIES", label: "Series", isEnabled: true },
      ],
    },
  
    frequencies: {
      isEnabled: true,
      isToogleEnabled: true,
      options: [
        { id: "weekly", label: "Weekly", isEnabled: true },
        { id: "monthly", label: "Monthly", isEnabled: true },
        { id: "quarterly", label: "Quarterly", isEnabled: true },
        { id: "bi-annual", label: "Bi-Annual", isEnabled: true },
        { id: "annual", label: "Annual", isEnabled: true },
        { id: "biennial", label: "Biennial", isEnabled: true },
        { id: "triennial", label: "Triennial", isEnabled: true },
        { id: "quadrennial", label: "Quadrennial", isEnabled: true },
        { id: "quinquennial", label: "Quinquennial", isEnabled: true },
        { id: "one-time", label: "One-Time", isEnabled: true },
      ],
    },
  
    eventRanking: {
      isToogleEnabled: true,
      options: [
        { id: "100", label: "Top 100", isEnabled: true },
        { id: "500", label: "Top 500", isEnabled: true },
        { id: "1000", label: "Top 1000", isEnabled: true },
      ],
    },
  
    audienceZone: {
      isEnabled: true,
      isToogleEnabled: true,
    },
  
    estimatedExhibitor: {
      isEnabled: true,
      isToogleEnabled: true,
      options: [
        { id: "0-100", label: "0-100", min: 0, max: 100, isEnabled: true },
        { id: "100-500", label: "100-500", min: 100, max: 500, isEnabled: true },
        { id: "500-1000", label: "500-1000", min: 500, max: 1000, isEnabled: true },
        { id: "1000", label: "1000+", min: 1000, max: Infinity, isEnabled: true },
      ],
    },
  
    estimatedVisitors: {
      isEnabled: true,
      options: [
        { id: "nano", label: "Nano", min: 0, max: 500, isEnabled: true },
        { id: "micro", label: "Micro", min: 500, max: 1000, isEnabled: true },
        { id: "small", label: "Small", min: 1000, max: 5000, isEnabled: true },
        { id: "medium", label: "Medium", min: 5000, max: 10000, isEnabled: true },
        { id: "large", label: "Large", min: 10000, max: 25000, isEnabled: true },
        { id: "mega", label: "Mega", min: 25000, max: 50000, isEnabled: true },
        { id: "ultra", label: "Ultra", min: 50000, max: 100000, isEnabled: true }
      ],
    },
  
    eventAnalytics: {
      isEnabled: true,
      isToogleEnabled: true,
    },
  
    forcastedStatus : {
      isEnabled: true,
      isToogleEnabled: true
    }
  };

// const apiResponse = {
//   source: "research",
//   data: {
//     durations: {

//       startDate: "2024-11-01,2025-04-30",
//       endDate: "2024-11-01,2025-04-30",
//     },
//     locationIds: {
//       enabledValue: [
//         {
//           description: "United States",
//           id: "dd718c3c-be27-5c3e-bd82-dc78a23e01e0",
//           type: "country",
//         },
//         {
//           description: "India",
//           id: "226e11ef-32fc-5484-9843-7087fdfb413d",
//           type: "country",
//         },
//       ],
//     },
//     eventRating: {
//       isRatingEnabled: true,
//       enabledValue: ["0-1", "4-5"],
//     },
//     branded: {
//       isBrandedEnabled: true,
//       enabledValue: {
//         eventBrand: false,
//         eventSeries: true,
//       },
//     },
//     eventSize: {
//       enabledValue: ["0-500", "500-1000", "10000-25000", "200000"],
//     },
//     estimatedExhibitScore: {
//       isExhibitorsEnabled: true,
//       enabledValue: ["0-100", "100-500", "500-1000"],
//     },
//     analytics: {
//       isAnalyticsEnabled: true,
//     },
//     eventRanking: {
//       isRanking: true,
//     },
//     audienceZone: {
//       isZoneEnabled: true,
//     },
//     designation: {
//       isProfileEnabled: true,
//     },
//     audienceSpread: {
//       isAudienceEnabled: false,
//     },
//     eventEntry: {
//       enabledValue: ["PAID"],
//     },
//     eventStatus: {
//       enabledValue: ["ACTIVE", "CANCELLED"],
//     },
//     keywords: {
//       isKeywordEnabled: true,
//       positiveKeywords: ["ai"],
//       negativeKeywords: ["ml"],
//     },
//     eventType: {
//       enabledValue: ["Tradeshow", "Conference"],
//     },
//     maturity: {
//       isMaturityEnabled: true,
//       enabledValue: ["new", "growing"],
//     },
//     eventCategory: {
//       enabledValue: [
//         {
//           id: "ddb2bdad-a8c4-51aa-b99e-ef52374b7f73",
//           slug: "finance",
//         },
//         {
//           id: "b75fb787-9d26-5454-95af-9ee79e7aac65",
//           slug: "baby-kids",
//         },
//       ],
//     },
//     eventFormat: {
//       enabledValue: ["offline", "online"],
//     },
//   },
// };

export const generateSearchFilters=(apiResponse: any)=> {
    // const  data  = apiResponse.filter.data;
    // console.log(apiResponse.filter.data);
    const  data  = apiResponse.filter;
    
    return {
      eventTypes: {
        isEnabled: data?.eventType?.enabledValue?.length > 0 ?? true,
        // options:searchFiltersg?.eventTypes?.options
        options: Object.fromEntries(
            Object.entries(searchFilters?.eventTypes?.options ?? {}).map(([key, group]) => {
              const updatedGroup = group.map((format) => ({
                ...format,
                isEnabled:
                  key === "business" // Update only the "business" group
                    ? data?.eventType?.enabledValue?.includes(
                        format.id.charAt(0).toUpperCase() + format.id.substring(1, format.id.length - 1)
                      ) ?? true
                    : format.isEnabled, // Keep `isEnabled` unchanged for other groups
              }));
              return [key, updatedGroup];
            })
          ),
        
      },
  
      eventFormats: {
        isEnabled: true,
        options: searchFilters?.eventFormats?.options?.map((format) => ({
          ...format,
          isEnabled: data?.eventFormat?.enabledValue?.includes(format.id) ?? true,
        })),
      },
  
      categories: {
        isEnabled: data?.eventCategory?.enabledValue?.length > 0 ?? true,
        options: searchFilters?.categories?.options?.map((category) => ({
          ...category,
          isEnabled: data?.eventCategory?.enabledValue?.some(
            (c: any) => c.id === category.id
          ) ?? true,
      })),
    },

    eventStatus: {
      isEnabled: data?.eventStatus?.enabledValue?.length > 0 ?? true,
      options: searchFilters?.eventStatus?.options?.map((status) => ({
        ...status,
        isEnabled:
          data?.eventStatus?.enabledValue?.includes(status.id.toUpperCase()) ??
          true,
      })),
    },

    userRatings: {
      isEnabled: data?.eventRating?.isRatingEnabled ?? true,
      isToggleEnabled: Boolean(data?.eventRating?.enabledValue?.length),
      options: searchFilters?.userRatings?.options?.map((rating) => ({
        ...rating,
        isEnabled: data?.ratings?.enabledValue?.includes(rating.id) ?? true,
      })),
    },

    eventEntries: {
      isEnabled: data?.eventEntry?.enabledValue?.length > 0 ?? true,
      options: searchFilters?.eventEntries?.options?.map((entry) => ({
        ...entry,
        isEnabled:
          data?.eventEntry?.enabledValue?.includes(entry.id.toUpperCase()) ??
          true,
      })),
    },

    maturityLevels: {
      isEnabled: data?.maturity?.isMaturityEnabled ?? true,
      isToggleEnabled: Boolean(data?.maturity?.enabledValue?.length),
      options: searchFilters?.maturityLevels?.options?.map((level) => ({
        ...level,
        isEnabled: data?.maturity?.enabledValue?.includes(level.id) ?? true,
      })),
    },

    globalAndTourings: {
      isEnabled: data?.branded?.isBrandedEnabled ?? true,
      isToggleEnabled: Boolean(data?.branded?.enabledValue),
      options: [
        {
          id: "BRANDED",
          label: "Branded",
          isEnabled: data?.branded?.enabledValue?.eventBrand ?? true,
        },
        {
          id: "SERIES",
          label: "Series",
          isEnabled: data?.branded?.enabledValue?.eventSeries ?? true,
        },
      ],
    },

    frequencies: {
      isEnabled: data?.eventFrequency?.isFreqEnabled ?? true,
      isToggleEnabled: true,
      options: searchFilters?.frequencies?.options?.map((format) => ({
        ...format,
        isEnabled:
          data?.eventFrequency?.enabledValue?.includes(format.id) ?? true,
      })),
    },

    eventRanking: {
      isEnabled: data?.eventRanking?.isRanking ?? true,
      isToggleEnabled: Boolean(data?.eventRanking?.isRanking),
      options: searchFilters.eventRanking.options,
    },

    audienceZone: {
      isEnabled: data?.audienceZone?.isZoneEnabled ?? true,
      isToggleEnabled: Boolean(data?.audienceZone?.isZoneEnabled),
    },

    estimatedExhibitor: {
      isEnabled: data?.estimatedExhibitScore?.isExhibitorsEnabled ?? true,
      isToggleEnabled: Boolean(
        data?.estimatedExhibitScore?.enabledValue?.length
      ),
      options: searchFilters.estimatedExhibitor.options.map((exhibitor) => ({
        ...exhibitor,
        isEnabled:
          data?.estimatedExhibitScore?.enabledValue?.includes(exhibitor.id) ??
          true,
      })),
    },

    estimatedVisitors: {
      isEnabled: data?.eventSize?.enabledValue?.length > 0 ?? true,
      options: searchFilters.estimatedVisitors.options.map((visitor) => {
        return {
          ...visitor,
          isEnabled:
            data?.estimatedVisitorRangeTag?.enabledValue?.includes(visitor.id) ??
            true,
        };
      }),
    },

    eventAnalytics: {
      isEnabled: data?.analytics?.isAnalyticsEnabled ?? true,
      isToggleEnabled: Boolean(data?.analytics?.isAnalyticsEnabled),
    },

    forcastedStatus: {
      isEnabled: data?.isForecasted?.isForecastedEnabled ?? true,
      isToggleEnabled: true,
    },

    audienceSpread: {
      isEnabled: data?.audienceSpread?.isAudienceEnabled ?? true,
    },

    audienceProfile: {
      isEnabled: data?.designation?.isProfileEnabled ?? true,
    },

    economicImpact: {
      isEnabled: data?.economicImpact?.isEconomicImpactEnabled ?? true,
      isToggleEnabled: true,
    },
  };
};


// console.log(getUpdatedSearchFilters(apiResponse));
