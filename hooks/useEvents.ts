import { useQuery } from "@/hooks/useQuery";
import { useEventsService } from "@/services/eventsService";
import { EventQuery } from "@/types/events/dto/event-query.dto";

export const eventsKeys = {
  all: ["events"] as const,
  list: (query: EventQuery) => [...eventsKeys.all, query] as const,
};

export const useEvents = {
  list: (query: EventQuery) => {
    const eventsService = useEventsService();

    const EventQuery = useQuery({
      queryKey: eventsKeys.list(query),
      queryFn: () => eventsService.getEvents(query),
    });
    return {
      events: EventQuery.data?.events || [],
      totalEvents: EventQuery.data?.count || 0,
      isLoading: EventQuery.isLoading,
      error: EventQuery.error,
    };
  },
};
