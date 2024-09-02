export interface CoordinateCardType {
    eventId: string;
    enquiryId: string;
    eventName: string;
    eventCtas?: string[];
    eventCountry: string;
    eventLocation: string;
    eventImage: string;
    eventStartDate: string;
    eventEndDate: string;
    eventCompany: string;
    eventDuration: string;
    userCount: number;
    currentEnquiryStatus: string;
    upvote: any;
    enquiryActivity: any;
    handleModal: (id: string, enquiryId: string) => void;
    handleShortlistModal: (eventId: string, enquiryId: string) => void;
}