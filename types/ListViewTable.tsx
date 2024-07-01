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
            longitude: number,
            latitude: number
        }
    };
    categories: [{ name: string }];
    eventKeywords : string[];
    organizer: { name: string };
    series: string;
    rank: {
        globalRank: number;
        countryRank: number;
        categoryRank: [{name: string, rank: number}]
        eventRank: number;
    };
    reputationSentiment: number;
    interestsGrowth: number;
    interestsGrowthRange: any,
    repeatSentiment: number;
    eventSize: number;
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
        estimatedExhibitor: number;
        estimatedVisitor: number;
    };
    internationalAudience: string;
}