import { useQuery } from "@tanstack/react-query";
import { EventQuery } from "@/types/events/dto/event-query.dto";
import { useTrackerServices } from "@/services/trackerServices";

export const eventsKeys = {
  all: ["events"] as const,
  list: (query: EventQuery) => [...eventsKeys.all, query] as const,
};

export const useTrackerEvents = {
  list: (query: EventQuery, trackerId?:string) => {
    const trackerService=useTrackerServices();
    const EventQuery = useQuery({
      queryKey: [JSON.stringify(query)],
      queryFn: () => 
        trackerService.getTrackerEvents(query, trackerId||"")
          
    });
    console.log(EventQuery);
    
    return {
      events: EventQuery?.data?.events  || [],
      totalEvents: EventQuery?.data?.count || 0,
      isLoading: EventQuery.isLoading,
      error: EventQuery.error,
    };
  },
};