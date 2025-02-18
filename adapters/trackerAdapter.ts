interface OriginalResponse {
  totalEvents?: number;
  count?: number;
  events?: any[];
  result?: any[];
}
  
  interface AdaptedResponse {
    events: any[];
    stats: {
      totalEvents: number;
    };
  }
  
  export const TrackersAdapter = {
    adaptTrackerEventData(data: OriginalResponse | undefined): AdaptedResponse {
      return {
        events: data?.events || data?.result || [],
        stats: {
          totalEvents: data?.totalEvents || data?.count || 0,
        },
      };
    },
  
  
    adaptTrackerMapEventData(data: any) {
      const eventKey = data.events ? "events" : "result";
      console.log(data);
      
      const eventData = data[eventKey].map((item: any) => ({
        id: item.basic.id,
        eventImpactScore: null,
        latitude:
          item.basic.eventLocation
          .city.latitude,
        longitude:
        item.basic.eventLocation
        .city.longitude,
        eventType: determineEventType(item.basic.
          primaryEventType),
      }));
      return {
        count: data?.count || 0,
        events: eventData || [],
      };
    },
    adaptParams(params:any){
        
        if (params.get("view") == "calendar" && params.get("calendar_type") != "week") {
            const currentYear = new Date().getFullYear();
            const startDate = new Date(currentYear, 0, 1).toISOString().split("T")[0];
            const endDate = new Date(currentYear, 11, 31).toISOString().split("T")[0];
            return `${startDate},${endDate}`;
          }
        if (
            params.get("view") == "calendar" &&
            params.get("calendar_type") == "week"
          ) {
            
            const today = new Date();
            const firstDayOfMonth = new Date(
              today.getFullYear(),
              today.getMonth(),
              1
            );
            const lastDayOfMonth = new Date(
              today.getFullYear(),
              today.getMonth() + 1,
              0
            );
            const startDate = firstDayOfMonth.toISOString().split("T")[0];
            const endDate = lastDayOfMonth.toISOString().split("T")[0];
            
            return `${startDate},${endDate}`;
          }
    }
   
  };
  
  // Helper function to determine the event type
  function determineEventType(item: string): string {
    if (!item) return "";
    if (item.toLowerCase() === "tradeshow") return "tradeshows";
    if (item.toLowerCase() === "conference") return "conferences";
    if (item.toLowerCase() === "workshop") return "workshops";
    else return item;
  }
  