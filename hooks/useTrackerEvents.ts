import { useQuery } from "@tanstack/react-query";
import { EventQuery } from "@/types/events/dto/event-query.dto";
import { useTrackerServices } from "@/services/trackerServices";

export const eventsKeys = {
  all: ["events"] as const,
  list: (query: EventQuery) => [...eventsKeys.all, query] as const,
};

export const useTrackerEvents = {
  list: (query: EventQuery, trackerId?:string, eventType?:string) => {
    const trackerService=useTrackerServices();
    const EventQuery = useQuery({
      queryKey: [query],
      queryFn: () => 
        trackerService.getTrackerEvents(query, trackerId||""),
      staleTime: 0, // Always refetch when queryKey changes
      refetchOnMount: true, // Ensure refetch on mount

          
    });
    console.log(query);
    
    return {
      events: EventQuery?.data?.events  || [],
      totalEvents: EventQuery?.data?.count || 0,
      isLoading: EventQuery.isLoading,
      error: EventQuery.error,
    };
  },
};