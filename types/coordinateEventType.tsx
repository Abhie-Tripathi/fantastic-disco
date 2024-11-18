export interface eventDataType {
    id: string;
    eventId: string;
    eventName: string;
    name: string;
    eventCity: string;
    logo:string;
    orgName: string;
    eventCountry: string;
    startDate: string;
    endDate: string;
    duration: string;
    status: string;
    enquiryId: string;
    enquiryStatus:string;
    userCount: number;
    users: { name: string; }[];
    upvote: any;
    enquiryActivity: any;
    userCountPerInterest: {
        EXHIBITOR: number,
        SPONSOR: number,
        SPEAKER: number,
        ATTENDING: number,
    };
    owner: {
        id: string,
        firstName: string,
        lastname: string | null,
        designation: string | null,
        profilPicture: string | null,
    };
}

export interface CoordinateListResponse {
    totalCount: number;
    enquiryData: eventDataType[];
}

export interface UserInterestResponse {
    participent: {
        attendee: any;
        speakers: any;
        sponsors: any;
        exhibitors: any;
    };
    stats: {
        attendee: number;
        sponsor: number;
        uniqueUser: number;
    };
}

export interface pocDetail {
    id: number,
    name: string| null,
    designation: string | null,
    email: string | null
    phoneNumber: string | null,
    profilePicture: string | null,
    emailActive: string | null,
}
export interface eventPocResponse {
    eventPoc: pocDetail[]
}