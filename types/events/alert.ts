export interface AlertResponse {
    count: number;
    events: Alert[];
  }
  
  export interface Alert {
    id: string;
    name: string;
    description: string;
    type: string;
    level: string;
    startDate: string;
    endDate: string;
    originLatitude: string;
    originLongitude: string;
    lastModified: string;
  }
  
  export interface AlertPolygonResponse {
    bbox: null | number[];
    type: string;
    features: Array<{
      bbox: number[];
      type: string;
      geometry: {
        type: string;
        coordinates: number[][][];
      };
      properties: {
        url: {
          report: string;
          details: string;
          geometry: string;
        };
        icon: string;
        iso3: string;
        name: string;
        Class: string;
        glide: string;
        source: string;
        todate: string;
        country: string;
        eventid: number;
        fromdate: string;
        sourceid: string;
        episodeid: number;
        eventname: string;
        eventtype: string;
        iscurrent: string;
        alertlevel: string;
        alertscore: number;
        description: string;
        iconoverall: string;
        istemporary: string;
        polygondate: string;
        datemodified: string;
        iconitemlink: string;
        polygonlabel: string;
        severitydata: {
          severity: number;
          severitytext: string;
          severityunit: string;
        };
        countryonland: string;
        iconeventlink: string;
        htmldescription: string;
        affectedcountries: Array<{
          iso3: string;
          countryname: string;
        }>;
        episodealertlevel: string;
        episodealertscore: number;
      };
    }>;
  }
  