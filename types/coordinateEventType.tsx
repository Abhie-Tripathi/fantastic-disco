export interface eventDataType {
    id: string;
    eventId: string;
    eventName: string;
    name: string;
    city: string;
    logo:string;
    orgName: string;
    country: string;
    startDate: string;
    endDate: string;
    duration: string;
    status: string;
    enquiryId: string;
    userCount: number;
    users: { name: string; }[];
    upvote: any;
    enquiryActivity: any;
}