import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEventsService } from "@/services/eventsService";
import type { EventTableType } from "@/types/ListViewTable";

export const eventsKeys = {
  all: ["events"] as const,
  list: () => [...eventsKeys.all] as const,
};

export const useEvents = {
  list: () => {
    const queryClient = useQueryClient();
    const eventsService = useEventsService();

    const query = useQuery({
      queryKey: eventsKeys.list(),
      queryFn: () => eventsService.getEvents(),
      staleTime: 5 * 60 * 1000,
    });

    return {
      events: query.data?.events || [],
      totalEvents: query.data?.count || 0,
      isLoading: query.isLoading,
      error: query.error,
    };
  },
};
