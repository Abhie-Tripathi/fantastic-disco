import { X } from "lucide-react";
import { z } from "zod";

const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  locationType: z.string(),
  latitude: z.string(),
  longitude: z.string(),
});

const RankingSchema = z
  .object({
    rank: z.number(),
    rankType: z.string(),
    rankRange: z.string(),
    categoryId: z.string().nullable(),
    countryId: z.string().nullable(),
  })
  .nullable()
  .optional();

const DetailRankingSchema = z.object({
  global: z.number(),
  country: z.object({
    id: z.string(),
    rank: z.number(),
  }),
  categories: z.array(
    z.object({
      id: z.string(),
      rank: z.number(),
    })
  ),
  category_country: z.array(
    z.object({
      categoryId: z.string(),
      countryId: z.string(),
      rank: z.number(),
    })
  ),
});

const RankingsSchema = z.union([RankingSchema, DetailRankingSchema]);

const AudienceSpreadSchema = z.record(
  z.string(),
  z.object({
    iso: z.string(),
    name: z.string(),
    count: z.number(),
    percentage: z.number(),
  })
);

const StateSchema = LocationSchema.extend({
  countryId: z.string(),
});

const CitySchema = LocationSchema.extend({
  stateId: z.string(),
  countryId: z.string(),
});

const CountrySchema = LocationSchema.extend({
  regions: z.array(z.string()),
  iso: z.string(),
  displayName: z.string(),
});

const VenueSchema = LocationSchema.extend({
  cityId: z.string(),
  stateId: z.string(),
  countryId: z.string(),
  address: z.string(),
  displayName: z.string(),
});

const BasicEventSchema = z.object({
  id: z.string(),
  startDateTime: z.string(),
  endDateTime: z.string(),
  status: z.string(),
  format: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string(),
  logoUrl: z.string().nullable(),
  bannerUrl: z.string().nullable(),
  timings: z.string().nullable(),
  matchedKeywords: z.array(z.string()).nullable(),
  matchedKeywordsPercentage: z.number().nullable(),
  lastVerifiedOn: z.string().nullable(),
  eventPageUrl: z.string().nullable(),
  rating: z.number(),
  name: z.string(),
  website: z.string(),
  entryType: z.string().nullable(),
  primaryEventType: z.string(),
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    })
  ),
  designations: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    })
  ),
  eventTypes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      eventGroupType: z.string(),
    })
  ),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    })
  ),
  eventLocation: z.object({
    country: CountrySchema.nullable(),
    venue: VenueSchema.nullable(),
    city: CitySchema.nullable(),
    state: StateSchema.nullable(),
  }),
  organizer: z
    .object({
      id: z.string(),
      name: z.string(),
      website: z.string(),
      logoUrl: z.string().nullable(),
      location: z.object({
        address: z.string().nullable(),
        city: CitySchema.nullable(),
        state: StateSchema.nullable(),
        country: CountrySchema.nullable(),
      }),
    })
    .nullable(),
  tickets: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        currency: z.string(),
        price: z.string(),
        ticketUrl: z.string().nullable(),
      })
    )
    .nullable(),
});

const AdvanceEventSchema = z.object({
  editions: z.number(),
  isBranded: z.boolean(),
  isSeries: z.boolean(),
  rehostDate: z.string(),
  maturity: z.string().nullable(),
  frequency: z.string().nullable(),
});

const InsightsEventSchema = z.object({
  yoyGrowth: z.number().nullable(),
  sponsorsCount: z.number(),
  speakersCount: z.number(),
  exhibitorsCount: z.number(),
  estimatedExhibitors: z.string(),
  economicImpact: z.string(),
  economicImpactBreakdown: z.record(z.number()).nullable(),
  estimatedVisitorRangeTag: z.string().nullable(),
  repeatSentiment: z.number(),
  trustScore: z.number().nullable(),
  reputationScore: z.number(),
  rehostScore: z.number(),
  estimatedAttendanceMean: z.number().nullable(),
  estimatedAttendance: z.string().nullable(),
  rankings: RankingsSchema,
  scores: z
    .object({
      impactScore: z.number().nullable(),
      inboundScore: z.number().nullable(),
      internationalScore: z.number().nullable(),
      internationalScoreTag: z.string().nullable(),
    })
    .optional(),
});

const AudienceSchema = z.object({
  audienceSpread: AudienceSpreadSchema,
  designationSpread: z.array(
    z.object({
      count: z.string(),
      percentage: z.number(),
      designation: z.string(),
    })
  ),
  audienceZone: z.string().nullable(),
});

const InterestSchema = z.record(
  z.enum(["speak", "sponsor", "attend", "exhibit", "bookmark"]),
  z.object({
    interestId: z.string(),
  })
);

const AlertSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  level: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  originLatitude: z.string(),
  originLongitude: z.string(),
  lastModified: z.string(),
});

const EventDataSchema = z.object({
  basic: BasicEventSchema,
  advance: AdvanceEventSchema.optional(),
  insights: InsightsEventSchema.optional(),
  audience: AudienceSchema.optional(),
  interests: InterestSchema.optional(),
  alerts: z.array(AlertSchema).optional(),
});

export interface EventResponse {
  count: number;
  events: Event[];
}

export type Location = z.infer<typeof LocationSchema>;
export type State = z.infer<typeof StateSchema>;
export type City = z.infer<typeof CitySchema>;
export type Country = z.infer<typeof CountrySchema>;
export type Venue = z.infer<typeof VenueSchema>;
export type Event = z.infer<typeof EventDataSchema>;
export type Ranking = z.infer<typeof RankingSchema>;
export type TTabs = "overview" | "insights" | "audience";
export type DetailRanking = z.infer<typeof DetailRankingSchema>;
export type Interest = z.infer<typeof InterestSchema>;
