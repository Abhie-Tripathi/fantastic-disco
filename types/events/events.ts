import { Category } from "./category";

export interface EventsResponse {
  count: number;
  events: Event[];
}

export interface EventDetailResponse {
  event: Event;
}

export interface EventPOCDetailResponse {
  eventPoCs: EventPOCDetails[];
}

export interface EventCoOrganizerDetailResponse {
  coorganizers: CoOrganizer[];
}
export interface EventEditionDetailResponse {
  editions: Editions[];
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
  "trustScore%": string | null;
  primaryEventType: string | null;
  entryType: "free_and_paid" | "free" | "paid" | null;
  rankings: {
    rank: string | null;
    rankRange: string | null;
    rankType: "global" | "country" | "category" | "category_country" | null;
    categoryId: string | null;
    countryId: string | null;
  } | null;
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

export interface EventResponse {
  count: number;
  events: Event[];
}

export interface EventPOCDetails {
  designation: string;
  email: string;
  emailActive: string;
  id: number;
  level: string;
  location: {
    cityName: string | null;
    countryName: string | null;
  };
  name: string;
  phoneNumber: string;
  profilePicture: string;
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
