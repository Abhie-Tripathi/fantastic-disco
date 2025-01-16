import { useApi } from "@/hooks/useApi";
// import { endpoints } from "@/config/endpoints";
// import { CoordinateListResponse, UserInterestResponse, eventPocResponse } from "@/types/coordinateEventType";
import { ApiError } from "@/types/api";
import companyData from "@/public/data/companyData.json";

interface fnProp {
  offset: number;
  searchParams: URLSearchParams;
}

interface CompanyListResponse {
  totalCount: number;
  data: any[];
}

export const useCompanyService = () => {
  const api = useApi<CompanyListResponse | undefined>();

  const getCompanyWithSearchParams = (searchParamsString: string) => {
    console.log("searchParamsString", searchParamsString);
    let tempResponse: CompanyListResponse = companyData;
    return tempResponse;
    // return api.request(`${endpoints.event.events}?${searchParamsString}`, {
    //   method: "GET",
    // });
  };

  return {
    getCompanyWithSearchParams,
    isLoading: api.isLoading,
    error: api.error as ApiError,
  };
};
