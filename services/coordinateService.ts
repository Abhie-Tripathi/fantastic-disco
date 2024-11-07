import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import { eventDataType } from "@/types/coordinateEventType";
import { ApiError } from "@/types/api";

export const useCoordinateService = () => {
  const api = useApi<eventDataType[]>();

  const getEventsWithSearchParams = async (searchParamsString: string) => {
    const params = new URLSearchParams(searchParamsString);
    console.log("params", params);

    return api.request(endpoints.event.events, {
      method: "GET",
      params: params,
    });
  };

  return {
    getEventsWithSearchParams,
    isLoading: api.isLoading,
    error: api.error as ApiError,
  };
};
