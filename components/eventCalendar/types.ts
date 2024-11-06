export interface Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
    eventType: string;
    type: 'conference' | 'exhibition' | 'other';
  }
  
  export interface EventResponse {
    count: number;
    events: Event[];
  }