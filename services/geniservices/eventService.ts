import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
export const useEventServices = () => {
  const api = useApi();
  const getEvents = async () => {
    return api.request(`${endpoints.events.getEvents}`);
  };
  const getEventsByWidgetId = async (widgetId: string, page: number) => {
    return api.request(
      `${endpoints.events.getEventsByWidgetId}?widgetId=${widgetId}&offset=${page}&limit=8`
    );
  };

  const getUpcomingEvents = async (page: number) => {
    const today = new Date().toISOString().split('T')[0];
    return api.request(
      `${endpoints.events.getSortedEvents}?sortBy=start_date&sortType=asc&offset=${page}&limit=8&upcoming=${encodeURIComponent(today)}`
    );
  };
  const getPastEvents = async (page: number) => {
    const today = new Date().toISOString().split('T')[0];
    return api.request(
      `${endpoints.events.getSortedEvents}?sortBy=start_date&sortType=asc&offset=${page}&limit=8&expired=${encodeURIComponent(today)}`
    );
  };


  const getEventById = async (eventId: string) => {
    return api.request(
      `${endpoints.events.getEventById}/${eventId}?source=eventgtm`
    );
  };

  const getEventByPublicAPI = async (eventId: string) => {
    return api.request(
      `${endpoints.events.getEventByPublicAPI}/${eventId}`
    );
  };
  const deleteEvent = async (eventId:any) => {
    console.log("delte_api",eventId,`${endpoints.events.deleteEvent}/${eventId}`)
    return api.request(`${endpoints.events.deleteEvent}/${eventId}`, {
      method: "DELETE",
      // data: customizeData,
    });
  };

  const addEvent = async (eventData: any) => {
    return api.request(`${endpoints.events.addEvent}`, {
      method: "POST",
      data: eventData,
    });
  };

  const addSpeakersData = async (speakerData: any) => {
    return api.request(`${endpoints.events.addSpeakers}`, {
      method: "POST",
      data: speakerData,
    });
  };

  const addExhibitorsDataData = async (exhibitorsData: any) => {
    return api.request(`${endpoints.events.addExhibitors}`, {
      method: "POST",
      data: exhibitorsData,
    });
  };

  const updateEvent = async (eventData: any) => {
    return api.request(`${endpoints.events.updateEvent}`, {
      method: "PATCH",
      data: eventData,
    });
  };



  return {
    getEvents,
    getEventsByWidgetId,
    getUpcomingEvents,
    getPastEvents,
    getEventById,
    getEventByPublicAPI,
    deleteEvent,
    addEvent,
    addSpeakersData,
    addExhibitorsDataData,
    updateEvent,
    isLoading: api.isLoading,
    error: api.error,
  };
};
