import { AuthContext, useAuthContext } from "@/context";
import { MembershipPlan } from "@/data/membershipPlans";
import { useQuery } from "@/hooks/useQuery";
import { useEventsService } from "@/services/eventsService";
import { EventQuery } from "@/types/events/dto/event-query.dto";
import { showValues as showValuesConfig } from "@/constants/filters";
import { getShowValues} from "@/utils/showValues";
export const eventsKeys = {
  all: ["events"] as const,
  list: (query: EventQuery) => [...eventsKeys.all, query] as const,
};

export const useEvents = {
  list: (query: EventQuery, inTransition?: boolean) => {
    const { membershipData } = useAuthContext();
    
    const limit = membershipData?.membership ? {
      [MembershipPlan.Freemium]: 10,
      [MembershipPlan.Essential]: 10,
      [MembershipPlan.Scale]: 50,
      [MembershipPlan.Advance]: 100,
      [MembershipPlan.Enterprise]: 100,
    }[membershipData.membership] : 10;
    
    if (limit && query.limit && Number(query.limit) > limit)
      // Limit Restriction
    query.limit = limit;
    const showValues = getShowValues(query);
    if (showValues) {
      query.showValues = showValues;
    }
    delete query.show
    
    const eventsService = useEventsService();

    const EventQuery = useQuery({
      queryKey: eventsKeys.list(query),
      queryFn: () => eventsService.getEvents(query),
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
