export interface enquiryType {
    enquiryId: string;
    eventId: string;
    eventName: string;
    userCountPerInterest: {
        EXHIBITOR: number,
        SPONSOR: number,
        SPEAKER: number,
        ATTENDING: number,
    };
    eventCountry: string;
    startDate: string;
    endDate: string;
    orgName: string;
    enquiryStatus: string;
    owner: {
        id: string,
        firstName: string,
        lastname: string | null,
        designation: string | null,
        profilPicture: string | null,
    }
}
