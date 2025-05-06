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
    participationType : string;
    description : string;
    textValue: string;
    speaker: any[];
    prefilledProfile?: any;
    prefilledExhibitorDetails?:any;
    registerMessage: string;
    registerBtnText: string;
    registerBtnColor: string;
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
    // Location Data
    locationDisplayName: string;
    locationType: string;
    cityId: string;
    cityName: string;
    latitude: number;
    longitude: number;
    countryName: string;
    countryId: string;
    countryCode: string;
    stateName: string;
    stateId: string;
    venueName: string;
    venueAddress: string;
    venueLatitude: number;
    venueLongitude: number;
    venueId: string;
}

export interface addEventPayloadType {
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    location_city_id: string;
    location_city: string;
    location_country: string;
    location_country_id: string;
    location_country_iso_code: string;
    location_state: string;
    location_state_id: string;
    // logoUrl: z.string().nullable().optional(),
    venue_id?: string;
    venue_name?: string;
    venue_address?: string;
    venue_latitude?: number,
    venue_longitude?: number,
    latitude: number;
    longitude: number;
    participationType: string;
    event_type: string;
    format: string;
}
  