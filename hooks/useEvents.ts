import { AuthContext, useAuthContext } from "@/context";
import { MembershipPlan } from "@/data/membershipPlans";
import { useQuery } from "@/hooks/useQuery";
import { useEventsService } from "@/services/eventsService";
import { EventQuery } from "@/types/events/dto/event-query.dto";
import { showValues as showValuesConfig } from "@/constants/filters";
import { getShowValues} from "@/utils/showValues";
import { useMemo } from "react";
export const eventsKeys = {
  all: ["events"] as const,
  list: (query: EventQuery) => [...eventsKeys.all, query] as const,
};

export const useEvents = {
  list: (query: EventQuery, inTransition?: boolean) => {
    const { membershipData } = useAuthContext();
    
    const finalQuery = useMemo(() => {
      const limit = membershipData?.membership ? {
        [MembershipPlan.Freemium]: 10,
        [MembershipPlan.Essential]: 10,
        [MembershipPlan.Scale]: 50,
        [MembershipPlan.Advance]: 100,
        [MembershipPlan.Enterprise]: 100,
      }[membershipData.membership] : 10;
      
      const queryForProcessing = { ...query };
      const showValues = getShowValues(queryForProcessing);
      if (showValues) {
        queryForProcessing.showValues = showValues;
      }
      delete queryForProcessing.show; 
      
      const normalizedQuery = {
        ...queryForProcessing,
        offset: Number(queryForProcessing.offset ?? 0),
        limit: Number(queryForProcessing.limit ?? 10),
      };
      
      if (limit && normalizedQuery.limit && Number(normalizedQuery.limit) > limit) {
        normalizedQuery.limit = limit;
      }
      
      return normalizedQuery;
    }, [query, membershipData?.membership]);

    const eventsService = useEventsService();


    const EventQuery = useQuery({
      queryKey: eventsKeys.list(finalQuery),
      queryFn: () => eventsService.getEvents(finalQuery),
      enabled: !inTransition && !!membershipData,
    });
    return {
      events: EventQuery.data?.events || [],
      totalEvents: EventQuery.data?.count || 0,
      isLoading: EventQuery.isLoading,
      error: EventQuery.error,
    };
  },
};
