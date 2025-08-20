import { useQuery } from "@/hooks/useQuery";
import { EventQuery } from "@/types/events/dto/event-query.dto";
import { useTrackerServices } from "@/services/trackerServices";
import { useMemo } from "react";

const STALE_TIME = 300000;

export const eventsKeys = {
  all: ["trackerevents"] as const,
  list: (query: EventQuery, trackerId?: string) => [...eventsKeys.all, query, trackerId] as const,
};

export const useTrackerEvents = {
  list: (query: EventQuery, trackerId?: string, view?: string) => {
    const finalQuery = useMemo(() => {
      const normalizedQuery = {
        ...query,
        offset: Number(query.offset ?? 0),
        limit: Number(query.limit ?? 10),
      };
      
      if (normalizedQuery.limit && Number(normalizedQuery.limit) > 20) {
        normalizedQuery.limit = 20;
      }
      
      return normalizedQuery;
    }, [query]);

    const trackerService = useTrackerServices();
    
    if (finalQuery.offset === 0 || finalQuery.offset === 10) {
      console.log(`🔄 useTrackerEvents called - offset: ${finalQuery.offset}, limit: ${finalQuery.limit}, trackerId: ${trackerId}`);
    }

    const EventQuery = useQuery({
      queryKey: eventsKeys.list(finalQuery, trackerId),
      queryFn: () =>
        view === "global"
          ? trackerService.globalSavedEvents(finalQuery)
          : trackerService.getTrackerEvents(finalQuery, trackerId || ""),
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
