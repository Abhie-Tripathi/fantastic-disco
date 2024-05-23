export interface eventDataType {
    id: string;
    name: string;
    city: string;
    orgName: string;
    country: string;
    startDate: string;
    endDate: string;
    duration: string;
    status: string;
    enquiryId: string;
    userCount: number;
    users: { name: string; }[];
}