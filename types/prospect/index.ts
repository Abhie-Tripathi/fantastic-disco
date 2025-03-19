export interface CompanyListResponse {
  totalCount: number;
  companyData?: companyListData[];
  userData?: userListData[];
}

export interface companyListData {
  id: string;
  name: string;
  logo: string | null;
  description: string | null;
  website: string;
  location: {
    cityId: string | null;
    cityName: string | null;
    countryId: string | null;
    countryName: string | null;
    countryZone: string | null;
  };
  stats: {
    totalEvents: number | null;
    upcomingEvents: number | null;
    totalLeads: number | null;
    totalExhibit: number | null;
    totalVisitor: number | null;
    totalSponsor: number | null;
    lastLogin: string | null;
  };
  company_linkedEvents: number | null;
  company_tag: string[];
  event_categoryName: string[];
  event_tagName: string[];
  social: {
    facebookId: string | null;
    linkedinId: string | null;
    twitterId: string | null;
  };
}

export interface userListData {
  user_id: string;
  user_name: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  state?: number;
  user_profilePicture: string | null;
  user_city: string | null;
  user_country: string | null;
  user_companyName: string | null;
  user_designationName: string | null;
  user_linkedin: string | null;
  top_event_countryZone: {
    key: string;
    doc_count: number;
  }[];
  top_event_categories: {
    key: string;
    doc_count: number;
  }[];

  top_event_tags: {
    key: string;
    doc_count: number;
  }[];
  speakingCount: number;
  attendCount: number;
  about: string | null;
}

export interface CompanyDetailResponse {
  companyData: CompanyDetail;
}

export interface CompanyDetail {
  id: string;
  name: string;
  logo: string | null;
  description: string | null;
  website: string;
  location: {
    cityId: number | string | null;
    cityName: string | null;
    countryId: string | null;
    countryName: string | null;
  };
  stats: {
    upcomingEvents: number | null;
    totalEvents: number | null;
    totalLeads: number | null;
    score: number | null;
  };
  company_tag: string[];
  industries: {
    asOrganizer: {
      name: string;
      eventCount: number;
    }[];
    asExhibitor: {
      name: string;
      eventCount: number;
    }[];
  };
  followers: number | null;
  eventSponsored: number | null;
  eventExhibited: number | null;
  eventVisited: {
    companyContact: number | null;
    eventContact: number | null;
  };
  visitor: number | null;
  linkedEvent: number | null;
}
