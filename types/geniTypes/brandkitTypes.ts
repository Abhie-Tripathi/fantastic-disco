interface Domain {
    domain: string;
  }
  
  interface OtherData {
    domain0: string;
  }
  
  export interface Brandkit {
    color: string[];             
    fontFamily: string[];        
    logo: string[];             
    domain: Domain;
    otherData: OtherData;
  }
  
  