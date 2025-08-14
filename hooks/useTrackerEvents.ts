import { useQuery } from "@/hooks/useQuery";
import { EventQuery } from "@/types/events/dto/event-query.dto";
import { useTrackerServices } from "@/services/trackerServices";

const STALE_TIME = 300000;

export const eventsKeys = {
  all: ["trackerevents"] as const,
  list: (query: EventQuery, trackerId?: string) => [...eventsKeys.all, query, trackerId] as const, 
};

export const useTrackerEvents = {
  list: (query: EventQuery, trackerId?: string, view?: string) => {
    if (query.limit && Number(query.limit) > 20) 
      query.limit = 20

    const trackerService = useTrackerServices();
    const EventQuery = useQuery({
      queryKey: eventsKeys.list(query, trackerId),
      queryFn: () =>
        view === "global"
          ? trackerService.globalSavedEvents(query)
          : trackerService.getTrackerEvents(query, trackerId || ""),
      staleTime: STALE_TIME,
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
