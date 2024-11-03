export interface EventTableType {
    id: string;
    name: string;
    eventGroupId: string;
    status: string;
    url: string;
    startDate: string;
    endDate: string;
    format: string;
    location: {
        cityId: string;
        cityName: string;
        countryName: string;
        // venueId: string;
        venueName: string;
        venueAddress: string;
        geoCordinates: {
            longitude: string,
            latitude: string
        }
        cityCordinates: {
            longitude: string,
            latitude: string
        }
    };
    categories: [{ name: string, id: string, slug: string, isGroup: boolean }];
    eventKeywords : string[];
    organizer: { name: string };
    series: string;
    rank: {
        globalRank: number;
        countryRank: number;
        categoryRank: [{name: string, rank: number}]
        eventRank: number;
    };
    ranking: {
        globalRank?: number;
        countryRank?: number;
        categoryRank?: {
            [key: string]: number;
        };
        countryCategoryRank?: {
            [key: string]: number;
        };
    };
    reputationSentiment: number;
    interestsGrowth: number;
    interestsGrowthRange: any,
    repeatSentiment: number;
    eventSize: number;
    isSaved?:boolean;
    "internationalAudience%": string;
    price: any;   
    matchedKeywords: any;
    keywordsMatchedScore: number;
    stats: {
        score: number;
        rating: string;
        exhibitingLeads: number;
        sponsoringLeads: number;
        speakingLeads: number;
        eventFollower: number;
        estimatedExhibitor: string | null;
        estimatedVisitor: string | null;
    };
    internationalAudience: string;
    type: string[];
    eventBrand?:string;
    isEventSeries?:string;
    "trustScore%"?: number;
    futureExpectedStartDate?:any;
    competitorDomainOrName?:string[];
    competitorPercentage?:string;
    speakerPersonAssociation?:string[];
    speakerPersonAssociationPercentage?:string;
    peopleFinderPersonAssociation?:string[];
    peopleFinderPersonAssociationPercentage?:string;
    recruitmentAssociation?:string[];
    recruitmentAssociationPercentage?:string;
    maturity?:string;
    eventImpactScore?:number;
    eventInboundScore?:number;
    internationalScore?:number;
    audienceZone?:string;
    audienceSpread?:any;
}
export interface AllEventsType{
     result: EventTableType[] ;
     count: number 
}