export interface AllEventsType {
  eventId: string;
  name: string;
  latitude : number;
  longitude: number;
  cityName: string;
  countryName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
  format: string;
  isLinkedToWidget: boolean;
  gmtZone: string;
  interest: string;
}