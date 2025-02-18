import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import {
  EventTypeIntelResponse,
  PredictedAttendanceResponse,
  PredictedEventsResponse,
} from "@/types";
import {
  CreateSaveTrendData,
  EditSaveTrendData,
  EventTrendsResponse,
  GetSaveTrendData,
} from "@/types/trends/trends";

export const useTrendsService = () => {
  const api = useApi();

  const getEventTrends = (queryParams: string) => {
    return api.request<EventTrendsResponse>(
      `${endpoints.trends.eventTrends}?${queryParams}`,
      {
        method: "GET",
      }
    );
  };

  const setSaveTrend = (saveTrendData: CreateSaveTrendData) => {
    return api.request(endpoints.tracker.commonUrl, {
      method: "POST",
      data: saveTrendData,
    });
  };

  const getSavedTrends = () => {
    return api.request<GetSaveTrendData>(
      `${endpoints.tracker.getTrackers}?type=trends&refresh=true`,
      {
        method: "GET",
      }
    );
  };

  const editSavedTrend = (
    savedTrendId: string,
    saveTrendData: EditSaveTrendData
  ) => {
    return api.request(`${endpoints.tracker.commonUrl}/${savedTrendId}`, {
      method: "PATCH",
      data: saveTrendData,
    });
  };

  const deleteSavedTrend = (savedTrendId: string) => {
    return api.request(`${endpoints.tracker.commonUrl}/${savedTrendId}`, {
      method: "DELETE",
    });
  };

  const getPredictedAttendance = (queryParams: URLSearchParams) => {
    return api.request<PredictedAttendanceResponse>(
      `${endpoints.trends.predictedAttendance}?${queryParams}`,
      {
        method: "GET",
      }
    );
  };

  const getPredictedNoOfEvents = (queryParams: URLSearchParams) => {
    return api.request<PredictedEventsResponse>(
      `${endpoints.trends.predictedEvents}?${queryParams}`,
      {
        method: "GET",
      }
    );
  };

  const getCategoryIntel = (queryParams: URLSearchParams) => {
    return api.request<EventTypeIntelResponse>(
      `${endpoints.trends.eventTypes}?${queryParams}`,
      {
        method: "GET",
      }
    );
  };

  return {
    getEventTrends,
    getSavedTrends,
    setSaveTrend,
    editSavedTrend,
    deleteSavedTrend,
    getPredictedAttendance,
    getPredictedNoOfEvents,
    getCategoryIntel,
    isLoading: api.isLoading,
    error: api.error,
  };
};
