import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import {
  EventCount,
  RecentSearchesResponse,
  RecentSearchItem,
  Event,
  EventResponse,
} from "@/types/events";
import { ApiError } from "@/types/api";
import { EventQuery } from "@/types/events/dto/event-query.dto";

export const useEventsService = () => {
  const api = useApi();

  const getEvents = async (params?: EventQuery) => {
    console.log("service called");
    const response = await api.request<EventResponse>(endpoints.event.events, {
      method: "GET",
      params,
    });
    console.log(response);
    return response;
  };

  const getEventDetailById = async (id: string) => {
    return api.request<Event>(`${endpoints.event.eventDetailById}/${id}`, {
      method: "GET",
    });
  };

  const getEventsCount = async (params?: EventQuery) => {
    return await api.request<EventCount[]>(`${endpoints.event.count}`, {
      method: "GET",
      params,
    });
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

  const getAlertPolygon = (eventId: string) => {
    return api.request<AlertPolygonResponse>(
      `${endpoints.event.events}/${eventId}/polygons`,
      {
        method: "GET",
      }
    );
  };

  // const getEventExhibitorDetails = (id: string, take: number, skip: number) => {
  //   return api.request<EventExhibitorDetailsResponse>(
  //     `${endpoints.event.eventDetailById}/exhibitor?id=${id}&take=${take}&skip=${skip}`,
  //     {
  //       method: "GET",
  //     }
  //   );
  // };

  const getEventExhibitorDetails = async (
    id: string,
    take: number,
    skip: number
  ) => {
    const response = await api.request<EventExhibitorDetails[]>(
      `${endpoints.event.eventDetailById}/exhibitor?id=${id}&take=${take}&skip=${skip}`,
      {
        method: "GET",
      }
    );
    if (!response) {
      throw new Error("Failed to fetch exhibitor details");
    }
    const adaptedExhibitorData = exhibitorAdapter(response);
    return adaptedExhibitorData;
  };

  const getEventSpeakerDetails = async (
    id: string,
    take: number,
    skip: number
  ) => {
    const response = await api.request<EventSpeakerDetails[]>(
      `${endpoints.event.eventDetailById}/speaker?id=${id}&take=${take}&skip=${skip}`,
      {
        method: "GET",
      }
    );
    if (!response) {
      throw new Error("Failed to fetch exhibitor details");
    }
    const adaptedSpeakerData = speakerAdapter(response);
    return adaptedSpeakerData;
  };

  const getEventsWithSearchParams = async (searchParamsString: string) => {
    const response = await api.request(
      `${endpoints.event.events}?${searchParamsString}`,
      {
        method: "GET",
      }
    );
    return response;
  };

  const getRawEventsWithSearchParams = async (searchParamsString: string) => {
    const params = new URLSearchParams(searchParamsString);
    const adaptedParams = EventsAdapter.adaptRequestParams(params);
    const response = await api.request(`${endpoints.event.events}`, {
      method: "GET",
      params: adaptedParams,
    }, true);
    
    return TrackersAdapter.adaptTrackerMapEventData(response);
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

  const bookmarkThisEvent = async (id: string) => {
    const response = await api.request(`${endpoints.tracker.saveEvent}`, {
      method: "POST",
      data: {
        eventId: id,
      },
    });
    return response;
  };

  const getIsEventBookMarked = async (id: string): Promise<boolean> => {
    const response = await api.request<EventBookmarkResponse>(
      `${endpoints.tracker.saveEvent}?eventId=${id}`,
      {
        method: "GET",
      }
    );
    return response?.savedEvent.bookmark ?? false;
  };

  const unBookmarkThisEvent = async (id: string) => {
    const response = await api.request(`${endpoints.tracker.saveEvent}`, {
      method: "DELETE",
      data: {
        eventIds: [id.toString()],
      },
    });
    return response;
  };
  const fetchEnabledFilters = async (source: String) => {
    const response = await api.request(
      `${endpoints.event.enabledFilters}?source=${source}`,
      {
        method: "GET",
      }
    );
    return response;
  };

  const getRecentSearch = async () => {
    const response = await api.request<RecentSearchItem[]>(
      `${endpoints.event.recentSearch}`,
      {
        method: "GET",
      }
    );
    return response;
  }
  return {
    getEvents,
    saveEvent,
    fetchEnabledFilters,
    getEventsCount,
    getRecentSearches,
    bookmarkThisEvent,
    unBookmarkThisEvent,
    getIsEventBookMarked,
    getRawEventsWithSearchParams,
    getEventDetailById,
    getEventPOCDetails,
    getEventEditionDetails,
    getEventExhibitorDetails,
    getEventSpeakerDetails,
    getEventsWithSearchParams,
    getEventCoOrganizerDetails,
    getRecentSearch,
    isLoading: api.isLoading,
    error: api.error as ApiError,
  };
};
