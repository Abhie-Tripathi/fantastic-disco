interface CustomizationData {
    pageBgColor: string;
    eventFont: string;
    registerBtnColor: string;
    registerBtnText: string;
    registerMessage: string;
    speakerProfilesData: string; 
    participationMessage: string;
    venue: string;
    hashtags: string[];
    boothNumber: string;
  }
  
  interface WidgetData {
    type: string;
  }
  
  interface EventData {
    location_city: string;
    location_country: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    description: string;
    format: string;
    gmt_time: string;
    latitude: number;
    longitude: number;
    participationType: string;
    logoUrl: string;
    customizationData: CustomizationData;
  }
  
  export interface Event {
    id: string;
    name: string;
    eventType: string;
    data: EventData;
    isWidgetLinked: boolean;
    widgetData: WidgetData[];
    children: SubEvent[];
  }
  
  interface SubEvent {
    id: string;
    name: string;
    type: string;
    data: EventData;
    isWidgetLinked: boolean;
    widgetData: WidgetData[];
  }
  
 export interface TransformedEvent {
    mainEvent: {
      eventId: string;
      name: string;
      cityName: string;
      countryName: string;
      startDate: string;
      logoUrl: string;
      endDate: string;
      startTime: string;
      endTime: string;
      description: string;
      format: string;
      isLinkedToWidget: boolean;
      gmtZone: string;
      latitude: number;
      longitude: number;
      participationType: string;
      eventType: string;
      widgetTags: string;
      customizationData: CustomizationData;
    };
    subEvents: TransformedSubEvent[];
  }
  
  interface TransformedSubEvent {
    eventId: string;
    name: string;
    cityName: string;
    countryName: string;
    startDate: string;
    logoUrl: string;
    endDate: string;
    startTime: string;
    endTime: string;
    description: string;
    format: string;
    isLinkedToWidget: boolean;
    gmtZone: string;
    latitude: number;
    longitude: number;
    participationType: string;
    eventType: string;
    customizationData: CustomizationData;
  }
  