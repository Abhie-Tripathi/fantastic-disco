export interface AllEventsType {
  mainEvent : EventsType;
  subEvents : EventsType[]
  promoted : string;
  selectedOption: string
}
export interface EventsType{
  eventId: string;
  name: string;
  latitude: number;
  longitude: number;
  cityName: string;
  countryName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  participationType: string;
  description: string;
  format: string;
  isLinkedToWidget: boolean;
  gmtZone: string;
  interest: string;
  logoUrl: string;
  customizationData : CustomizationData;
  widgetTags : string;
  eventType : string;
  parentData : string;
  capacity : number,
  registration : boolean,
  approval : boolean,
  waitlisting : boolean
}
interface CustomizationData {
  pageBgColor: string;
  pageGradient : string;
  confettiType : string;
  leavesTheme : boolean;
  snowTheme : boolean;
  eventFont: string;
  registerBtnColor: string;
  registerBtnText: string;
  registerMessage: string;
  speaker: any[];
  participationMessage: string;
  venue: string;
  hashtags: string;
  boothNumber : string;
  eventFormat : string;
}
