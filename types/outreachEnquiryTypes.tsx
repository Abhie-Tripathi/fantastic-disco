export interface enquiryType {
    id: number;
    name: string;
    organizer: {name:string};
    location: {cityName: string, countryShortName: string, countryName: string};
    startDate: string;
    endDate: string;
    stats: {exhibitingCount: number, sponsoringCount: number, speakingCount: number};
    edition: number;
    company: {id: number};
}
