import { useQuery } from "@tanstack/react-query";
import { useEventsService } from "@/services/eventsService";
import { EventQuery } from "@/types/events/dto/event-query.dto";
import { useTrackerServices } from "@/services/trackerServices";

export const eventsKeys = {
  all: ["events"] as const,
  list: (query: EventQuery) => [...eventsKeys.all, query] as const,
};

export const useEvents = {
  list: (query: EventQuery, source?:string, trackerId?:string) => {
    const eventsService = useEventsService();
    console.log(trackerId);
    const {
      getTrackerEvents,
      getSavedEvents,
      saveNewEvent,
      deleteNewEvent,
      error,
    } = useTrackerServices();
    const EventQuery = useQuery({
      queryKey: [JSON.stringify(query)],
      queryFn: () => 
        source === "tracker"
          ? getTrackerEvents(query, trackerId)
          : eventsService.getEvents(query),
    });

    return {
      events: EventQuery.data?.events || [],
      totalEvents: EventQuery.data?.count || 0,
      isLoading: EventQuery.isLoading,
      error: EventQuery.error,
    };
  },
};
