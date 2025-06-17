import { useQuery } from "@/hooks/useQuery";
import { EventQuery } from "@/types/events/dto/event-query.dto";
import { useTrackerServices } from "@/services/trackerServices";

export const eventsKeys = {
  all: ["events"] as const,
  list: (query: EventQuery, trackerId?: string) => [...eventsKeys.all, query, trackerId] as const, 
};

export const useTrackerEvents = {
  list: (query: EventQuery, trackerId?: string, view?: string) => {
    const trackerService = useTrackerServices();
    const EventQuery = useQuery({
      queryKey: eventsKeys.list(query, trackerId),
      queryFn: () =>
        view === "global"
          ? trackerService.globalSavedEvents(query)
          : trackerService.getTrackerEvents(query, trackerId || ""),
          staleTime: 0,
      refetchOnWindowFocus: false,

          
    });
    
    return {
      events: EventQuery?.data?.events || [],
      totalEvents: EventQuery?.data?.count || 0,
      isFetching: EventQuery.isFetching,
      isLoading: EventQuery.isLoading,
      error: EventQuery.error,
    };
  },
};
