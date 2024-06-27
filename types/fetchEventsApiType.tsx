interface GeoCoordinates {
    longitude: number;
    latitude: number;
};

interface Location {
    cityId: string;
    cityName: string;
    countryId: string;
    countryName: string;
    venueName: string;
    venueAddress: string;
    geoCordinates: GeoCoordinates;
};

interface Category {
    id: string;
    name: string;
    slug: string;
    type: string;
    createdAt: string;
    updatedAt: string;
};

interface Organizer {
    id: string;
    name: string;
    website: string;
    logo: string;
    cityName: string;
    countryName: string;
};

interface Event {
interfaceid: string;
    name: string;
    eventGroupId: string;
    status: string;
    url: string;
    eventWebsite: string;
    eventZone: string;
    description: string;
    location: Location;
    stats: object;
    startDate: string;
    endDate: string;
    duration: string;
    totaleventEdition: number;
    format: string;
    type: string[];
    categories: Category[];
    eventKeywords: string[];
    organizer: Organizer;
    interestsGrowthRange: null | any;
    eventSize: number;
    internationalAudience: string;
    matchedKeywords: string[];
    keywordsMatchedScore: number;
};

interface EventsData {
    events: Event[];
};

export interface ApiResponse {
    data: EventsData;
};
