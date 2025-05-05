export interface EventPOCDetailResponse {
  eventPoCs: EventPOCDetails[];
}

export interface EventEditionDetailResponse {
  count: number | null;
  editions: Editions[] | [];
}

export interface EventCoOrganizerDetailResponse {
  coorganizers: EventCoOrganizerDetail[] | [];
}

export interface EventExhibitorDetailsResponse {
  count: number | null;
  eventExhibitors: EventExhibitorDetails[];
}

export interface EventSpeakerDetailsResponse {
  count: number | null;
  eventSpeakers: EventSpeakerDetails[];
}

export interface EventSponsorDetailsResponse {
  count: number | null;
  eventSponsors: EventSponsorDetails[];
}

export interface Editions {
  edition_id: number;
  edition_venue_name: string | null;
  edition_venue_city_name: string | null;
  edition_venue_country_name: string | null;
  edition_start_date: string | null;
  edition_end_date: string | null;
}

export interface EventPOCDetails {
  designation: string | null;
  email: string | null;
  emailActive: string | null;
  id: number;
  level: string | null;
  location: {
    cityName: string | null;
    countryName: string | null;
  };
  name: string | null;
  state: number | null;
  phoneNumber: string | null;
  profilePicture: string | null;
}
export interface EventCoOrganizerDetail {
  id: number | null;
  name: string | undefined | null;
  logo: string | undefined | null;
  city: string | undefined | null;
  country: string | undefined | null;
  website: string | undefined | null;
}

export interface EventCoOrganizerDetail {
  id: number | null;
  name: string | undefined | null;
  logo: string | undefined | null;
  city: string | undefined | null;
  country: string | undefined | null;
  website: string | undefined | null;
}

export interface OverallRankingsDetail {
  category: RankingData;
  category_country: RankingData;
  country: RankingData;
  global: RankingData;
}

export interface RankingData {
  maxRank: number;
  precedingEvents: EventRankingDetail[];
  succeedingEvents: EventRankingDetail[];
  currentEvent: EventRankingDetail;
}

export interface EventRankingDetail {
  id: string;
  name: string;
  rank: number;
  startDateTime: string;
  endDateTime: string;
  categoryId?: string | null;
  location: {
    CITY?: EventRankingLocation;
    STATE?: EventRankingLocation;
    VENUE?: EventRankingLocation;
    COUNTRY?: EventRankingLocation;
  };
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

export interface EventExhibitorDetails {
  id: number;
  name: string;
  location: {
    cityName: string;
    countryName: string;
  };
  logo: any;
  interestCapturedOn: string;
  boothNo: string;
}

export interface EventSponsorDetails {
  id: number | null;
  company: string | null;
  title: string | null;
  website: string | null;
  cityId: string | null;
  cityName: string | null;
  countryId: string | null;
  countryName: string | null;
  companyId: string | null;
  companyRating: string | null;
  position: string | null;
  logo: string | null;
}

export interface EventParticipantsDetails {
  id: string | undefined | null;
  name: string | undefined | null;
  logo: string | undefined | null;
  details: string | undefined | null;
  type: "exhibitor" | "speaker" | "sponsor" | undefined | null;
}

export interface EventRankingLocation {
  id: string;
  name: string;
  locationType: "CITY" | "STATE" | "VENUE" | "COUNTRY";
}

export interface EventDate {
  date: number;
  month: string;
  formattedDate: string;
  isEventDay: boolean;
}

export interface UnmaskPocApiParamType {
  pocId: number;
  unmask: Unmask;
  target: Target;
  source: Source;
  targetId?: string;
}

export type Unmask = "email" | "phone" | "email,phone" | "";

export type Target = "USER" | "EVENT" | "COMPANY";

export type Source = "eventPage" | "companyPage" | "prospectUserPage";
