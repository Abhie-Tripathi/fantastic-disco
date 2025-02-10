import { useApi } from "@/hooks/useApi";
// import { endpoints } from "@/config/endpoints";
// import { CoordinateListResponse, UserInterestResponse, eventPocResponse } from "@/types/coordinateEventType";
import { ApiError } from "@/types/api";
import companyData from "@/public/data/companyData.json";
import { endpoints } from "@/config/endpoints";
import { pocDetail } from "@/types/coordinateEventType";

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
    return api.request(`${endpoints.company.list}?viewAs=list&${searchParamsString}`, {
      method: "GET",
    });
  };

  const unlockUserDetail = (pocId: number, companyId: string | number) => {
    return api.request<pocDetail>(`${endpoints.company.unmaskUser}?pocId=${pocId}&companyId=${companyId}&unlockValue=email,phone`, {
      method: "GET",
    });
  }

  return {
    getCompanyList,
    unlockUserDetail,
    isLoading: api.isLoading,
    error: api.error as ApiError,
  };
};
