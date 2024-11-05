export interface CalendarWeekEventsResponse {
  count: number;
  events: CalendarMonthEvent[];
}

type EventType =
  | "concert"
  | "community"
  | "workshops"
  | "conferences"
  | "festival"
  | "sport"
  | string;

export interface CalendarMonthEvent {
  id: string;
  name: string;
  startDateTime: string;
  endDateTime: string;
  impactScore: number;
  eventType: EventType;
}
