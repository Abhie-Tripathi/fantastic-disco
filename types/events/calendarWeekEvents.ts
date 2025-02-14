export interface WeekEvent {
  id: string;
  name: string;
  startDateTime: string;
  endDateTime: string;
  impactScore: number | null;
  eventType: string;
}

export interface CalendarWeekEventsResponse {
  count: number;
  events: WeekEvent[];
}
