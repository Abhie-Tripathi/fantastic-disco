export interface CalendarMonthEventsResponse {
  count: number;
  countByMonth: CountByMonth;
  events: CalendarEvent[];
}

interface CountByMonth {
  [key: string]: number;
}

export interface CalendarEvent {
  id: string;
  name: string;
  startDateTime: string;
  endDateTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  estimatedAttendance: string;
  estimatedSpend: string;
  currency: Currency;
  scores: Scores;
  predictedEventSpendBreakUp: PredictedSpend[];
  categories: Category[];
  eventTypes: EventType[];
  tags: any[]; // You might want to define a more specific type if tags are used
  venueLocation: VenueLocation | null;
  organizer: Organizer | null;
}

interface Currency {
  name: string;
  symbol: string;
}

interface Scores {
  eventImpactScore: number;
  cityInboundScore: number;
  countryInboundScore: number;
}

interface PredictedSpend {
  title: string;
  spend: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface EventType {
  id: string;
  name: string;
  slug: string;
  eventGroupType: string;
}

interface VenueLocation {
  venue: Venue;
  city: City;
  state: State;
  country: Country;
}

interface Venue {
  id: string;
  name: string;
  cityId: string;
  stateId: string;
  countryId: string;
  latitude: string;
  longitude: string;
  address: string;
  locationType: string;
}

interface City {
  id: string;
  name: string;
  stateId: string;
  countryId: string;
  latitude: string;
  longitude: string;
  locationType: string;
}

interface State {
  id: string;
  name: string;
  countryId: string;
  latitude: string;
}

interface Country {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  regions: string[];
  locationType: string;
}

interface Organizer {
  id: string;
  name: string;
  website: string;
  logoUrl: string;
  location: OrganizerLocation;
}

interface OrganizerLocation {
  address: string;
  city: City;
  state: State;
  country: Country;
}
