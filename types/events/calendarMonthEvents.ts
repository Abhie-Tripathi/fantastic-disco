export interface MonthEventCount {
  total: number;
  business: number;
  social: number;
  unattended: number;
  averageImpactScore: number;
}

interface EventsByDate {
  [date: string]: MonthEventCount;
}

export interface CalendarMonthEventsResponse {
  count: number;
  events: EventsByDate;
}
