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
    adaptTrackerEventData(data: OriginalResponse): AdaptedResponse {
      return {
        events: data.events,
        stats: {
          totalEvents: data.totalEvents,
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
  };
  
  // Helper function to determine the event type
  function determineEventType(item: string): string {
    if (!item) return "";
    if (item.toLowerCase() === "tradeshow") return "tradeshows";
    if (item.toLowerCase() === "conference") return "conferences";
    return "unknown";
  }
  