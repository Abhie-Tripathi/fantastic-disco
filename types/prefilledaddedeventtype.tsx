export interface PrefilledAddedEventsType {
    id:string
    name: string,
    hashtags : string;
    pageBgColor :string,
    description : string,
    eventFont : string,
    startDate : string,
    endDate : string,
    startTime : string,
    endTime : string,
    timeZone: string,
    cityName : string,
    countryName : string,
    participationType : string,
    eventFormat : string,
    registerBtnColor : string,
    registerBtnText : string,
    registerMessage : string,
    boothNumber : string,
    speakerProfilesData : SpeakerProfileType[],
    participationMessage : string,
    bannerUrl : string;
    latitude : number;
    longitude: number;
    venue : string;
    promoted : string;
    eventType : string;
    event_type: string;
  }
  interface SpeakerProfileType {
    id: string;
    name: string;
    linkedin: string;
    designation: string;
    // profileImage: string | ArrayBuffer | null;
    profileImage : File | null
  }