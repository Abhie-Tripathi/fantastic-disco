export interface EventPOCDetailResponse {
  eventPoCs: EventPOCDetails[];
}

export interface EventEditionDetailResponse {
  editions: Editions[];
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
