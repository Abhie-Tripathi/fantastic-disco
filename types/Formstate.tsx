// types.ts
interface SpeakerProfileType {
    id: string;
    name: string;
    linkedin: string;
    designation: string;
    // profileImage: string | ArrayBuffer | null;
    profileImage: File | null
}
interface ImageState {
    placeHolder: any;
    file: File | null;
}
export interface FormState {
    descriptionModal : boolean;
    speakerModal : boolean;
    registerModal : boolean;
    eventName : string;
    cityName : string;
    participationType : string;
    description : string;
    textValue: string;
    speaker: any[];
    prefilledProfile?: any;
    prefilledExhibitorDetails?:any;
    registerMessage: string;
    registerBtnText: string;
    registerBtnColor: string;
    countryName: string;
    timeZone: string;
    timeZoneKey: number;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    eventFormat: string;
    boothNumber: string;
    participationMessage: string;
    banner: ImageState;
    venue: string;
    latitude: number;
    longitude: number;
    hashtags: string[];
    query: string;
    isEventNameEmpty: boolean;
    isEventFormatEmpty: boolean;
    isEventDescriptionEmpty: boolean;
    isEventParticipationEmpty: boolean;
    isParticipationMessageEmpty: boolean;
    isTextValueMessageEmpty: boolean;
    errorMessage: string;
    parentData : string;
    capacity:number;
    registration:boolean;
    approval:boolean;
    waitlisting:boolean;
    capacityModal:boolean
    virtualLink:string;
    exhibitorModal:boolean;
    exhibitor:any[];
    event_type:string;
    isEventTypeEmpty:boolean
  }
export interface AddEventFormState {
    descriptionModal : boolean;
    speakerModal : boolean;
    registerModal : boolean;
    eventName : string;
    cityName : string;
    participationType : string;
    description : string;
    textValue: string;
    speaker: any[];
    prefilledProfile?: any;
    prefilledExhibitorDetails?:any;
    registerMessage: string;
    registerBtnText: string;
    registerBtnColor: string;
    countryName: string;
    timeZone: string;
    timeZoneKey: number;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    eventFormat: string;
    boothNumber: string;
    participationMessage: string;
    banner: ImageState;
    venue: string;
    hashtags: string[];
    query: string;
    isEventNameEmpty: boolean;
    isEventFormatEmpty: boolean;
    isEventDescriptionEmpty: boolean;
    isEventParticipationEmpty: boolean;
    isParticipationMessageEmpty: boolean;
    isTextValueMessageEmpty: boolean;
    errorMessage: string;
    parentData : string;
    capacity:number;
    registration:boolean;
    approval:boolean;
    waitlisting:boolean;
    capacityModal:boolean
    virtualLink:string;
    exhibitorModal:boolean;
    exhibitor:any[];
    event_type:string;
    isEventTypeEmpty:boolean,

    venueId: string;
    cityId: string;
    locationType: string;
    locationName: string;
    latitude: number;
    longitude: number;
    locationDisplayName: string;
}

export interface addEventPayloadType {
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    gmt_time?: string;
    description?: string;
    location_city_id: string;
    venue_latitude?: number,
    venue_longitude?: number,
    venue_id?: string;
    latitude: number;
    longitude: number;
    format: string;
    participationType: string;
    event_type: string;
}
  