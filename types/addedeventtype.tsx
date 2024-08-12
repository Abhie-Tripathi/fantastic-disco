export interface AddedEventsType {
    id:string
    pageBgColor :string,
    eventFont : string,
    registerBtnColor : string,
    registerBtnText : string,
    registerMessage : string,
    boothNumber : string,
    speakerProfilesData : SpeakerProfileType[],
    participationMessage : string,
    bannerUrl : string;
  }
  interface SpeakerProfileType {
    id: string;
    name: string;
    linkedin: string;
    designation: string;
    // profileImage: string | ArrayBuffer | null;
    profileImage : File | null
  }