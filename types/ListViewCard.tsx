export interface EventCardType {
    eventName: string;
    format: string;
    eventType: string;
    categoryName: string[];
    startDate: string;
    endDate: string;
    organiser: string;
    fee: string;
    participantCount: string;
    eventSeries: boolean;
    frequency: string;
    forecastedFrequency: string;
    eventZone: string;
    venueAddress: string;
    venueCountry: string;
    venueCity: string;
    estimatedAttendance: string;
    estimatedExhibitors: string;
    stats: {
      EIS: string;
      local: string;
      regional: string;
      international: string;
      influence: string;
    };
    tags: {
      keywords: string[];
      department: string[];
      designation: string[];
    };
  }