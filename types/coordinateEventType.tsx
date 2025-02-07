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
        [name: string]: number,
    };
    owner: {
        id: string,
        firstName: string,
        lastname: string | null,
        designation: string | null,
        profilPicture: string | null,
    };
}

export interface enquiryType {
    id: string;
    status: string;
    eventId: string;
    eventData: {
        name: string;
        startDate: string;
        endDate: string;
        eventId: string;
        logoUrl: string | null;
        organizerName: string;
        location: {
            cityName: string | null,
            stateName: string | null,
            countryName: string | null
        }
    };
    ownerId: string | null;
    createdAt: string;
    updatedAt: string;
    interestedCount: {
        total: number,
        [name: string]: number,
    };
    activityCount: {
        total: number,
        [name: string]: number,
    };
    myActivity: any;
}

export interface CoordinateListResponse {
    count: number;
    enquiries: enquiryType[];
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
    state?: number,
}
export interface eventPocResponse {
    eventPoc: pocDetail[]
}

export interface PresetJsonData {
    id: number;
    img?: any;
    url: string;
    trackerName: string;
    content: string;
    data: any;
    enabled: boolean;
    presetType: string;
    eventCount?: string;
}

export interface PresetList {
    totalCount: number;
    data: PresetJsonData[];
}