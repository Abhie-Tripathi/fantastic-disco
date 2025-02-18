<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3e7d848119a404ad8874f360ded589e1f0107114
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
  lastVerifiedOn: z.string().nullable(),
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
  estimatedExhibitors: z.string(),
  rehostDate: z.string(),
  maturity: z.string().nullable(),
  frequency: z.string().nullable(),
});

const InsightsEventSchema = z.object({
  yoyGrowth: z.number().nullable(),
  sponsorsCount: z.number(),
  speakersCount: z.number(),
  exhibitorsCount: z.number(),
  economicImpact: z.string(),
  estimatedVisitorRangeTag: z.string().nullable(),
  repeatSentiment: z.number(),
  reputationScore: z.number(),
  rehostScore: z.number(),
  estimatedAttendanceMean: z.number().nullable(),
  estimatedAttendance: z.string().nullable(),
  rankings: RankingSchema,
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

const EventDataSchema = z.object({
  basic: BasicEventSchema,
  advance: AdvanceEventSchema.optional(),
  insights: InsightsEventSchema.optional(),
  audience: AudienceSchema.optional(),
  interests: InterestSchema.optional(),
});
<<<<<<< HEAD
=======
import { Category } from "./category";

export interface EventsResponse {
  count: number;
  events: Event[];
}

export interface EventDetailResponse {
  event: GTMEventDetail;
}

export interface EventPOCDetailResponse {
  eventPoc: GTMEventPOCDetails[];
}

export interface EventBookmarkResponse {
  savedEvent: {
    bookmark: boolean;
  };
}

export interface EventCoOrganizerDetailResponse {
  coorganizers: CoOrganizer[];
}
export interface EventEditionDetailResponse {
  count: number;
  editions: Editions[];
}

export interface EventExhibitorDetailsResponse {
  data: EventExhibitorDetails[];
}

export interface EventSpeakerDetailsResponse {
  data: EventSpeakerDetails[];
}

export interface EventExhibitorDetails {
  id: number;
  name: string;
  location: {
    cityName: string;
    countryName: string;
  };
  logo: any;
  interestCapturedOn: string;
}

export interface EventSpeakerDetails {
  id: number;
  name: string;
  designation: string;
  company: string;
  title: string;
  location: {
    cityName: string;
    countryName: string;
  };
  profilePicture: string;
  interestCapturedOn: string;
}

export interface EventParticipantsDetails {
  id: string;
  name: string;
  logo: string;
  details: string;
  type: "exhibitor" | "speaker" | "sponsor";
}

export interface Event {
  id: string;
  name: string;
  isSaved: boolean;
  startDateTime: string;
  endDateTime: string;
  status: string;
  format: string | null;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  logoUrl: any | null;
  bannerUrl: any | null;
  estimatedAttendance: string | null;
  economicImpact: string | null;
  currency: Currency | null;
  scores: Scores | null;
  predictedEventSpendBreakUp: PredictedEventSpendBreakUp[] | [] | null;
  categories: Category[] | [] | null;
  eventTypes: EventType[];
  tags: Tag[] | [] | null;
  venueLocation: VenueLocation | null;
  organizer: Organizer | null;
  rating: number | null;
  sponsorsCount: number | null;
  speakersCount: number | null;
  exhibitorsCount: number | null;
  timings: Timings;
  audienceSpread: AudienceSpread | null;
  audienceZone: string | null;
  editions: number | null;
  website: string | null;
  frequency: string | null;
  maturity: string | null;
  isBranded: boolean | null;
  isSeries: boolean | null;
  co_organizers: CoOrganizer[] | [] | null;
  repeatSentiment: number | null;
  reputationScore: number | null;
  rehostDate: string | null;
  rehostScore: number | null;
  "trustScore%": number | null;
  primaryEventType: string | null;
  entryType: "free_and_paid" | "free" | "paid" | null;
  rankings:
    | {
        globalRank: number | undefined;
        countryRank: number | undefined;
        categoryRank: Record<string, number | null> | null | undefined;
        countryCategoryRank: Record<string, number | null> | null;
        rank: string | null;
        rankRange: string | null;
        rankType: "global" | "country" | "category" | "category_country" | null;
        categoryId: string | null;
        countryId: string | null;
      }
    | undefined;
  "10TimesUrl": string | null;
}

export interface Tickets {
  id: string;
  name: string;
  price: string;
  type: string;
  currency: string;
  ticketUrl: string;
}

export interface RankingDetail {
  categories:
    | {
        id: string;
        rank: number;
      }[]
    | null;
  category_country:
    | {
        categoryId: string;
        countryId: string;
        rank: number;
      }[]
    | null;
  country: {
    id: string;
    rank: number;
  } | null;
  global: number;
}

export interface Currency {
  name: string;
  symbol: string;
}

export interface Timings {
  [key: string]: {
    startTime: string;
    endTime: string;
  };
}

export interface CoOrganizer {
  id: number | null;
  name: string | null;
  logo: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
}

export interface Editions {
  edition_id: number;
  edition_venue_name: string | null;
  edition_venue_city_name: string | null;
  edition_venue_country_name: string | null;
  edition_start_date: string | null;
  edition_end_date: string | null;
}

export interface Scores {
  impactScore: number;
  inboundScore: number;
  internationalScore: number;
}

export interface PredictedEventSpendBreakUp {
  title: string;
  spend: string;
}

export interface EventType {
  id: string;
  name: string;
  slug: string;
  eventGroupType: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface VenueLocation {
  venue: Venue;
  city: City;
  state: State;
  country: Country;
}

export interface Venue {
  id: string;
  name: string;
  cityId: string;
  stateId: string;
  countryId: string;
  latitude: string;
  longitude: string;
  address: string | null;
  locationType: string;
}

export interface City {
  id: string;
  name: string;
  stateId: string;
  countryId: string;
  latitude: string;
  longitude: string;
  locationType: string;
}

export interface State {
  id: string;
  name: string;
  countryId: string;
  latitude: string;
  longitude: string;
  geometry?: string;
  locationType?: string;
}

export interface Country {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  locationType: string;
  displayName: string;
  iso: string;
  regions: string[];
}

export interface GTMOrganizer {
  id: string;
  name: string;
  website: string;
  logo: string;
  cityName: string;
  countryName: string;
  totalOrganize: number;
}

export interface Organizer {
  id: string;
  name: string;
  website: string;
  logoUrl: string | null;
  location: OrganizerLocation | null;
}

export interface OrganizerLocation {
  address: string;
  city: City;
  state: State;
  country: Country;
}
>>>>>>> c7210c8d73ebe86b682ef8e323d153293bdf8608
=======
>>>>>>> 3e7d848119a404ad8874f360ded589e1f0107114

export interface EventResponse {
  count: number;
  events: Event[];
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3e7d848119a404ad8874f360ded589e1f0107114
export type Location = z.infer<typeof LocationSchema>;
export type State = z.infer<typeof StateSchema>;
export type City = z.infer<typeof CitySchema>;
export type Country = z.infer<typeof CountrySchema>;
export type Venue = z.infer<typeof VenueSchema>;
export type Event = z.infer<typeof EventDataSchema>;
export type Ranking = z.infer<typeof RankingSchema>;
export type Interest = z.infer<typeof InterestSchema>;
<<<<<<< HEAD
=======
export interface GTMEventPOCDetails {
  id: number;
  name: string;
  designation: string;
  email: string | null;
  phoneNumber: string | null;
  location: {
    cityName: string | null;
    countryName: string | null;
  };
  profilePicture: string;
  level: string;
  emailActive: string;
  state?: number;
}

export interface AudienceSpread {
  [key: string]: {
    iso: string;
    name: string;
    count: number;
    percentage: number;
  };
}

export interface EventDate {
  date: number;
  month: string;
  formattedDate: string;
  isEventDay: boolean;
}

export interface GTMEventDetail extends Omit<Event, "organizer"> {
  above5CountryEvent: countryRank[] | [];
  below5CountryEvent: countryRank[] | [];
  above5GlobalEvent: globalRank[] | [];
  below5GlobalEvent: globalRank[] | [];
  above5CategoryEvent: categoryRank[] | [];
  below5CategoryEvent: categoryRank[] | [];
  above5CountryCategoryRankEvent: countryCategoryRank[] | [];
  below5CountryCategoryEvent: countryCategoryRank[] | [];
  organizer: GTMOrganizer | null;
  "trustScore%": number | null;
  isEventBrand?: boolean;
  isEventSeries?: boolean;
  rankData: {
    global: number;
    country: {
      name: string;
      rank: number;
      maxRank: number;
    };
    category: {
      name: string;
      rank: number;
      maxRank: number;
    }[];
    countryCategoryRank: {
      name: string;
      rank: number;
      maxRank: number;
    }[];
  };
  economicImpactBreakdown: { [key: string]: number };
  designation: string[];
  designationSpread: DesignationSpread[];
  stats: {
    score: number;
    eventFollower: number;
    estimatedVisitor: string;
    rating: number;
    estimatedExhibitor: string;
  };
  futureExpectedStartDate: string;
  futureExpectedEndDate: string;
}

export interface EventExhibitorDetails {
  id: number;
  name: string;
  location: {
    cityName: string;
    countryName: string;
  };
  logo: any;
  interestCapturedOn: string;
}

export interface DesignationSpread {
  count: number;
  percentage: number;
  designation: string;
}

export interface rankingEvent {
  id: string;
  eventname: string;
  startdate: string;
  enddate: string;
  description: string;
  logoUrl: string;
  location: string;
}

export interface countryRank extends rankingEvent {
  countryrank: number;
  countryname: string;
}

export interface categoryRank extends rankingEvent {
  categoryrank: number;
  categoryname: string;
}
export interface globalRank extends rankingEvent {
  globalrank: number;
}

export interface countryCategoryRank extends rankingEvent {
  countrycategoryrank: number;
  categoryname: string;
}

export type TTabs = "overview" | "insights" | "audience";
>>>>>>> c7210c8d73ebe86b682ef8e323d153293bdf8608
=======
>>>>>>> 3e7d848119a404ad8874f360ded589e1f0107114
