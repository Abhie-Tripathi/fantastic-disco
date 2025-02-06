export interface Location {
  id: string;
  name: string;
  locationType: string;
  latitude: string;
  longitude: string;
}

export interface State extends Location {
  countryId: string;
}

export interface City extends Location {
  stateId: string;
  countryId: string;
}

export interface Country extends Location {
  regions: string[];
}

export interface Venue extends Location {
  cityId: string;
  stateId: string;
  countryId: string;
  address: string;
  displayName: string;
}

interface CategoryItem {
  id: string;

  name: string;
  slug: string;
}

interface EventType extends CategoryItem {
  eventGroupType: string;
}

interface OrganizerLocation {
  address: string | null;
  city: {
    id: string;
    name: string;
    stateId: string;
    countryId: string;
    latitude: string;
    longitude: string;
    locationType: string;
  } | null;
  state: {
    id: string;
    name: string;
    countryId: string;
    latitude: string;
    longitude: string;
    locationType: string;
  } | null;
  country: {
    id: string;
    name: string;
    latitude: string;
    longitude: string;
    regions: string[];
    locationType: string;
  } | null;
}

interface Organizer {
  id: string;
  name: string;
  website: string;
  logoUrl: string | null;
  totalExhibit: number;
  totalSponsor: number;
  totalVisitor: number;
  totalOrganize: number;
  location: OrganizerLocation;
}

interface Ticket {
  id: string;
  name: string;
  type: string;
  currency: string;
  price: string;
  ticketUrl: string | null;
}

export interface Event {
  id: string;
  startDateTime: string;
  endDateTime: string;
  status: string;
  format: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  editions: number;
  "10timesEventPageUrl": string;
  sponsorsCount: number;
  speakersCount: number;
  exhibitorsCount: number;
  timings: string | null;
  lastVerifiedOn: string | null;
  estimatedVisitorRangeTag: string | null;
  economicImpactBreakdown: Record<string, number>;
  isBranded: boolean;
  eventPageUrl: string;
  isSeries: boolean;
  rehostDate: string;
  rating: number;
  estimatedExhibitors: string;
  trustScore: number;
  entryType: string | null;
  audienceSpread: Record<
    string,
    {
      iso: string;
      name: string;
      count: number;
      percentage: number;
    }
  >;
  designationSpread: Array<{
    count: string;
    percentage: number;
    designation: string;
  }>;
  audienceZone: string | null;
  economicImpact: string;
  alerts: any[];
  rankings: {
    global: number;
    country: {
      countryId: string;
      rank: number;
    } | null;
    categories: Array<{
      categoryId: string;
      rank: number;
    }>;
    category_country: Array<{
      categoryId: string;
      countryId: string;
      rank: number;
    }>;
  };
  scores: {
    impactScore: number | null;
    inboundScore: number | null;
    internationalScore: number | null;
    internationalScoreTag: string | null;
  };
  maturity: string | null;
  frequency: string | null;
  yoyGrowth: number | null;
  name: string;
  website: string;
  repeatSentiment: number;
  reputationScore: number;
  rehostScore: number;
  estimatedAttendanceMean: number | null;
  estimatedAttendance: number | null;
  primaryEventType: string;
  trackerMatchInfo: any;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  designations: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  eventTypes: Array<{
    id: string;
    name: string;
    slug: string;
    eventGroupType: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  eventLocation: {
    state: State | State[] | null;
    city: City | City[] | null;
    venue: Venue | null;
    country: Country | null;
  };
  organizer: {
    id: string;
    name: string;
    website: string;
    logoUrl: string | null;
    totalExhibit: number;
    totalSponsor: number;
    totalVisitor: number;
    totalOrganize: number;
    location: {
      address: string | null;
      city: {
        id: string;
        name: string;
        stateId: string;
        countryId: string;
        latitude: string;
        longitude: string;
        locationType: string;
      } | null;
      state: {
        id: string;
        name: string;
        countryId: string;
        latitude: string;
        longitude: string;
        locationType: string;
      } | null;
      country: {
        id: string;
        name: string;
        latitude: string;
        longitude: string;
        regions: string[];
        locationType: string;
      } | null;
    };
  } | null;
  tickets: Array<{
    id: string;
    name: string;
    type: string;
    currency: string;
    price: string;
    ticketUrl: string | null;
  }> | null;
}
