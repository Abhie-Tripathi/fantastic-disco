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
  }
  