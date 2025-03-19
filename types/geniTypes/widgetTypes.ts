interface ButtonSettings {
    primary: { [key: string]: any };  
    secondary: { [key: string]: any };
  }
  
  interface FontSettings {
    body: { [key: string]: any };
    heading: { [key: string]: any };
    subheading: { [key: string]: any };
  }
  
  interface CustomizationData {
    buttonSettings: ButtonSettings;
    cardBgColor: string;
    cardBorderRadius: number;
    fontSettings: FontSettings;
    selectedBtn: string;
    selectedCard: string;
  }
  
  interface OtherData {
    event: any[]; 
  }
  
  interface DraftWidget {
    customizationData: CustomizationData;
    domain: string;
    eventId: any[]; 
    id: string;
    otherData: OtherData;
    status: string;
    templatePublicId: number;
    type: string;
  }
  
 export  interface GetDraftWidgetResponse {
    totalCount: number;
    data: DraftWidget[];
  }
  
  