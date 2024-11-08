import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import { CoordinateListResponse, eventDataType } from "@/types/coordinateEventType";
import { ApiError } from "@/types/api";

interface fnProp {
    offset: number,
    searchParams: URLSearchParams
}

export const useCoordinateService = () => {
  const api = useApi<CoordinateListResponse>();

  const getEventsWithSearchParams1 = async (searchParamsString: string) => {
    const params = new URLSearchParams(searchParamsString);
    console.log("params", params);

    return api.request(`${endpoints.coordinate.list}`,
    {
      method: "GET",
      params: params,
    });
  };

  

  const fetchProjects = async ({ offset, searchParams }: fnProp) => {
    // const res = await fetch('/api/projects?cursor=' + pageParam + '&' + searchParams)
    // return res.json()
    const params = new URLSearchParams(searchParams);
    console.log("params", params.get('status'));
    if(!params.get('status')) {
        params.set('status', 'IN_DISCUSSION,SHORTLISTED,REJECTED');
    }
    return api.request(`${endpoints.coordinate.list}?limit=10&source=internal&offset=${offset}`, {
      method: "GET",
      params: params,
    });
  }

  const getEventsWithSearchParams = (searchParamsString: string) => {
    console.log('searchParamsString1', searchParamsString);
    const params = new URLSearchParams(searchParamsString);
    console.log("params", params.get('status'));
    if(!params.get('status')) {
        params.set('status', 'IN_DISCUSSION,SHORTLISTED,REJECTED');
    }
    return api.request(`${endpoints.coordinate.list}?limit=10&source=internal`, {
      method: "GET",
      params: params,
    });
  };

  return {
    getEventsWithSearchParams,
    fetchProjects,
    isLoading: api.isLoading,
    error: api.error as ApiError,
  };
};
