import { useApi } from "@/hooks/useApi";
// import { endpoints } from "@/config/endpoints";
// import { CoordinateListResponse, UserInterestResponse, eventPocResponse } from "@/types/coordinateEventType";
import { ApiError } from "@/types/api";
import companyData from "@/public/data/companyData.json";
import { endpoints } from "@/config/endpoints";
import { pocDetail } from "@/types/coordinateEventType";
import externalAxios from "@/lib/externalAxios";

interface fnProp {
  offset: number;
  searchParams: URLSearchParams;
}

interface CompanyListResponse {
  totalCount: number;
  companyData?: any[];
  userData?: any[];
}

export const useCompanyService = () => {
  const api = useApi<CompanyListResponse | undefined>();

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

  const unlockUserDetail = (pocId: number) => {
    const payload: any = {
      pocId: pocId,
      unlockValue: "email,phone",
    };

    return api.request<pocDetail>(`${endpoints.company.unmaskUser}`, {
      method: "GET",
      params: payload,
    });
  };

  const unlockPocDetail = (pocId: number, companyId: string) => {
    return api.request<pocDetail>(`${endpoints.coordinate.pocUnmask}?pocId=${pocId}&companyId=${companyId}&unlockValue=email,phone`, {
      method: "GET",
    });
  }

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

  const checkCompanyLogo = async (website: string): Promise<boolean> => {
    try {
      const response = await externalAxios.get(
        `https://logo.clearbit.com/${website}`
      );
      if (response.status >= 200 && response.status < 300) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  return {
    getCompanyList,
    unlockUserDetail,
    unlockPocDetail,
    getCompanyDetailById,
    getCompanyEvents,
    getCompanyPOC,
    getEventCountByCountry,
    checkCompanyLogo,
    isLoading: api.isLoading,
    error: api.error as ApiError,
  };
};
