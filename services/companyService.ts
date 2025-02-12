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
    const params = new URLSearchParams(searchParamsString);
    if (params.get("viewBy") === null) params.set("viewBy", "company");

    params.set("limit", params.get("take") || "10");
    params.set("offset", params.get("skip") || "0");
    params.delete("skip");
    params.delete("take");

    return api.request(`${endpoints.company.list}?viewAs=list&${params}`, {
      method: "GET",
    });
  };

  const unlockUserDetail = (pocId: number, companyId: string) => {
    const payload: any = {
      pocId: pocId,
      unlockValue: "email,phone",
    };
    if (companyId === "isUser") payload.isUser = "true";
    else payload.companyId = companyId;

    return api.request<pocDetail>(`${endpoints.company.unmaskUser}`, {
      method: "GET",
      params: payload,
    });
  };

  const getCompanyDetailById = (companyId: string | number) => {
    return api.request(
      `${endpoints.company.detail}?viewBy=company&viewAs=detail&companyId=${companyId}`,
      {
        method: "GET",
      }
    );
  };

  const getCompanyEvents = (
    companyId: string | number,
    eventType: string,
    offset: number = 0
  ) => {
    return api.request(
      `${endpoints.company.events}/${companyId}?eventOf=${eventType}&limit=10&offset=${offset}`,
      {
        method: "GET",
      }
    );
  };

  const getCompanyPOC = (companyId: string | number) => {
    return api.request(`${endpoints.company.pocList}/${companyId}`, {
      method: "GET",
    });
  };

  const getEventCountByCountry = (companyId: string | number) => {
    return api.request(
      `${endpoints.company.events}/${companyId}?groupBy=country`,
      {
        method: "GET",
      }
    );
  };

  return {
    getCompanyList,
    unlockUserDetail,
    getCompanyDetailById,
    getCompanyEvents,
    getCompanyPOC,
    getEventCountByCountry,
    isLoading: api.isLoading,
    error: api.error as ApiError,
  };
};
