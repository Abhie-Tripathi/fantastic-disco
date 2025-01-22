export interface YearEventCount {
    total: number;
    business: number;
    social: number;
    unattended: number;
    averageImpactScore: number;
  }
  
  interface MonthlyCount {
    [monthKey: string]: number;
  }
  
  export interface CalendarYearEventsResponse {
    count: number;
    events: {
      [date: string]: YearEventCount;
    };
    countByMonth: MonthlyCount;
  }
  