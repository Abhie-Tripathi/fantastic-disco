export interface AddedEventsType {
    id:string
    name: string,
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
    logoUrl : string;
  }
  interface SpeakerProfileType {
    id: string;
    name: string;
    linkedin: string;
    designation: string;
    // profileImage: string | ArrayBuffer | null;
    profileImage : File | null
  }