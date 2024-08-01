export interface Event {
    id: string;
    eventGroupId: string;
    source: string;
    sourceId: string;
    description: string;
    title: string;
    eventUrl: string;
    startingDateTime: string;
    endingDateTime: string;
    companyName: string;
    categoryId: string;
    status: string;
    venueId: string;
    createdAt: string;
    updatedAt: string;
    venue: {
        id: string;
        source: string;
        sourceId: string;
        name: string;
        city: string;
        country: string;
        longitude: number;
        latitude: number;
        area: string | null;
        createdAt: string;
        updatedAt: string;
    };
    category: {
        id: string;
        name: string;
        slug: string;
        type: string;
        createdAt: string;
        updatedAt: string;
    };
    labels: {
        id: string;
        name: string;
        slug: string;
        createdAt: string;
        updatedAt: string;
    }[];
  }
  
  
  export interface EventDataType{
    events : Event[]
  }