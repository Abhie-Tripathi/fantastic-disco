interface OriginalResponse {
    totalEvents: number;
    events: any[];
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
        events: data?.events || [],
        stats: {
          totalEvents: data?.totalEvents || 0,
        },
      };
    },
  
  
    adaptTrackerMapEventData(data: any) {
  
      const eventData = data.events.map((item: any) => ({
        id: item.id,
        eventImpactScore: null,
        latitude:
          item.location.geoCordinates.latitude ||
          item.location.cityCordinates.latitude,
        longitude:
          item.location.geoCordinates.longitude ||
          item.location.cityCordinates.longitude,
        eventType: determineEventType(item.type[0]),
      }));
      return {
        count: data?.totalEvents || 0,
        events: eventData || [],
      };
    },
    adaptParams(params:any){
        console.log(params.get("view"), params.get("calendar_type"));
        
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
            console.log(params.get("view"));
            
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
            console.log(`${startDate},${endDate}`);
            
            return `${startDate},${endDate}`;
          }
    }
   
  };
  
  // Helper function to determine the event type
  function determineEventType(item: string): string {
    if (!item) return "";
    if (item.toLowerCase() === "tradeshow") return "tradeshows";
    if (item.toLowerCase() === "conference") return "conferences";
    return "unknown";
  }
  