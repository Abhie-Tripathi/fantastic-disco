import { useApi } from "@/hooks/useApi";
// import { endpoints } from "@/config/endpoints";
// import { CoordinateListResponse, UserInterestResponse, eventPocResponse } from "@/types/coordinateEventType";
import { ApiError } from "@/types/api";
import companyData from "@/public/data/companyData.json";
import { endpoints } from "@/config/endpoints";

interface fnProp {
  offset: number;
  searchParams: URLSearchParams;
}

interface CompanyListResponse {
  totalCount: number;
  data: any[];
}

export const useCompanyService = () => {
  const api = useApi<CompanyListResponse | undefined | any>();

  const getCompanyList = (searchParamsString: string) => {
    return api.request(`${endpoints.company.list}?viewBy=company&viewAs=list&${searchParamsString}`, {
      method: "GET",
    });
  };

  return {
    getCompanyList,
    isLoading: api.isLoading,
    error: api.error as ApiError,
  };
};
