export interface Tracker {
    name: string;
    id?: string;
    type?:string;
    accessLevel?:string;
    filterValues?: FilterValue;
    groupedEventsCount?:{
        expired?:number;
        new?:number;
        active?:number;
        business?:{
          total?:number;
          new?:number;
        };
        social?:{
          total?:number;
          new?:number;
        };
        unattended?:{
          total?:number;
          new?:number;
        }
    }
    savedEventsCount?:number;
  }
  type LocationObject = { [id: string]: string };
  export interface FilterValue {
    labels?: string;
    name?: string;
    category?: any;
    eventFormat?: string;
    eventStatus?: string;
    eventFrequency?: string;
    eventEntry?: string;
    eventEdition?: any;
    eventRanking?: string;
    brandedEvent?: boolean;
    trustScore?: any;
    eventSeries?: string;
    reputationScore?: any;
    maturity?: any;
    internationalScore?: any;
    inboundScore?: any;
    userRating?: string;
    exhibitScore?: string;
    total_attendance_gte?: any;
    total_attendance_lte?: any;
    location?: string[];
    startDate?: string;
    endDate?: string;
    eventRating?: string;
    eventRank?: any;
    localRank?: any;
    eventKeywords?: any;
    eventCategory?: any;
    editionRange?: any;
    eventSize?: any;
    eventCity?: any;
    eventCountry?: any;
    eventState?:any;
    eventRegion?: string;
    eventType?: string;
    locationIds?:{
      city?: LocationObject[];    
      country?: LocationObject[];  
      zone?: LocationObject[];
    } | string | undefined;
    
    includeKeywords?:string;
    excludeKeywords?:string;
    eventBrand?:string;
    estimatedExhibitScore?: string;
    speakerOrg?: string | undefined;
    speakerName?: string | undefined;
    orgWebsite?: string;
    orgName?: string;
    userType?: string;
    userName?: string;
    eventAttendanceRange?: any;
    eventImpactSocre?: any;
    globalRanking?: any;
    audienceSpread?: any;
    designation?: any;
}


  export interface Toggle{
    rating?:boolean;
    exhibit?:boolean;
    economicImpact?:boolean;
    trust?:boolean;
    maturity?: boolean;
    brandedEvent?: boolean;
    eventSeries?: boolean;
    forecastedStatus?: boolean;
    impactScore?: boolean;
    inboundScore?: boolean;
    internationalScore?: boolean;
    eventRank?: boolean;
    audienceZone?: boolean;
    audienceSpread?: boolean;
    globalToggle?:boolean;
    brandSeries?:boolean;
    eventFrequency?: boolean;
  }
   export interface Access{
    entityId: string;
    published: boolean;
   }
   export interface NewAccess{
    firstname:string;
    lastname:string;
    email:string;
   }
    export interface ExistingAccess{
      accessReceiverEmail:string,
      accessType:string,
      redirectDomain:string,
    }
    export interface EditAccess{
        entityId: string | null;
      accessLevel: string;
    }

    export interface AllTrackerTypes{
      filterValue: FilterValue;
      id: string;
      name:string;
      type:string
    }
    export interface TemplateItem {
      type: string;
      domain: string;
      img: string;
      url: string;
      trackerName: string;
      content: string;
      isEnabled: boolean;
    }
    
    export interface StandardTemplateGroup {
      heading: string;
      subHeading: string;
      templates: TemplateItem[];
    }
    export interface TrackerTypeProp{
      type:string;
      count:number;
    }