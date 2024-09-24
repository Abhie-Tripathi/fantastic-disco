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
    enquiryStatus?:string;
    userCount: number;
    users: { name: string; }[];
    upvote: any;
    enquiryActivity: any;
}