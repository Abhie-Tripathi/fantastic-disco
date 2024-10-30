import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import {
  CalendarMonthEventsResponse,
  CalendarWeekEventsResponse,
  EventCoOrganizerDetailResponse,
  EventCount,
  EventDetailResponse,
  EventEditionDetailResponse,
  EventPOCDetailResponse,
  EventsResponse,
  MapEventsResponse,
  RecentSearchesResponse,
} from "@/types/events";
import { EventSearchParams } from "@/types/events";
import { EventsAdapter } from "@/adapters/eventsAdapter";
import { myFetch } from "@/utils/myFetch";
import { ReadonlyURLSearchParams } from "next/navigation";
import { BaseURL } from "@/config";
import { ApiError } from "@/types/api";

export const searchEvents = async (searchParams: ReadonlyURLSearchParams) => {
  return myFetch(
    `${BaseURL}/event/all?${searchParams.toString().replace(/%2C/g, ",")}`
  );
};

export const searchEventId = async (id: string) => {
  return myFetch(`${BaseURL}/event/all?id=${id}`);
};

export const useEventsService = () => {
  const api = useApi<
    | CalendarMonthEventsResponse
    | CalendarWeekEventsResponse
    | MapEventsResponse
    | EventsResponse
  >();

  const getEvents = (params?: EventSearchParams) => {
    return api.request(endpoints.event.events, {
      method: "GET",
      params,
    });
  };

  const getEventById = async (id: string) => {
    const response = await api.request<EventDetailResponse>(
      `${endpoints.event.events}`,
      {
        method: "GET",
        params: {
          eventId: id,
        },
      }
    );
    return EventsAdapter.adaptEventByIdResponse(response);
  };

  const getEventDetailById = async (id: string) => {
    const response = await api.request<EventDetailResponse>(
      `${endpoints.event.eventDetailById}/${id}?shows=eventBrand%2CeventSeries%2Cmaturity%2CeventImpactScore%2CeventInboundScore%2CinternationalScore%2Cisforecasted%2CtrustScore%2CeventRating%2CestimatedExhibitScore%2CaudienceSpread`,
      {
        method: "GET",
      }
    );
    return EventsAdapter.adaptEventDetailByIdResponse(response);
  };

  const getEventPOCDetails = (id: string) => {
    return api.request<EventPOCDetailResponse>(
      `${endpoints.event.eventPOCDetailById}/${id}`,
      {
        method: "GET",
      }
    );
  };

  const getEventEditionDetails = (id: string, take: number, skip: number) => {
    return api.request<EventEditionDetailResponse>(
      `${endpoints.event.eventEditionsDetailsById}/${id}${
        take ? `?take=${take}` : ""
      }${skip !== undefined && skip !== null ? `&skip=${skip}` : ""}`,
      {
        method: "GET",
      }
    );
  };

  const getEventCoOrganizerDetails = (id: string) => {
    return api.request<EventCoOrganizerDetailResponse>(
      `${endpoints.event.events}/${id}/coorganizers`,
      {
        method: "GET",
      }
    );
  };

  const getEventsWithSearchParams = async (searchParamsString: string) => {
    const params = new URLSearchParams(searchParamsString);
    const adaptedParams = EventsAdapter.adaptRequestParams(params);
    const response = await api.request(`${endpoints.event.events}`, {
      method: "GET",
      params: adaptedParams,
    });
    console.log(EventsAdapter.adaptResponse(response, params));
    return EventsAdapter.adaptResponse(response, params);
  };

  const saveEvent = (eventId: string) => {
    return api.request(`${endpoints.event.savedEvents}`, {
      method: "POST",
      data: {
        eventIds: [eventId],
      },
    });
  };

  const getRecentSearches = () => {
    return api.request<RecentSearchesResponse>(endpoints.event.recentSearches, {
      method: "GET",
      params: {
        limit: 5,
      },
    });
  };

  const getEventsCount = async (searchParams: string) => {
    const response = await api.request<EventCount[]>(
      `${endpoints.event.count}?${searchParams}`,
      {
        method: "GET",
      }
    );
    return EventsAdapter.adaptEventCountResponse(response);
  };

  const bookmarkThisEvent = async (id: string) => {
    const response = await api.request(`${endpoints.tracker.saveEvent}`, {
      method: "POST",
      data: {
        eventId: id,
      },
    });
    console.log(response)
    return response;
  };

  return {
    getEvents,
    saveEvent,
    getEventById,
    getEventsCount,
    getRecentSearches,
    bookmarkThisEvent,
    getEventDetailById,
    getEventPOCDetails,
    getEventEditionDetails,
    getEventsWithSearchParams,
    getEventCoOrganizerDetails,
    isLoading: api.isLoading,
    error: api.error as ApiError,
  };
};
