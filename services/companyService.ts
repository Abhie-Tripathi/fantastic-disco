import { useApi } from "@/hooks/useApi";
// import { endpoints } from "@/config/endpoints";
// import { CoordinateListResponse, UserInterestResponse, eventPocResponse } from "@/types/coordinateEventType";
// import { ApiError } from "@/types/api";
// import companyData from "@/public/data/companyData.json";
import { endpoints } from "@/config/endpoints";
import { pocDetail } from "@/types/coordinateEventType";
import externalAxios from "@/lib/externalAxios";
import { CompanyDetailResponse, CompanyListResponse } from "@/types/prospect";
import prospectUserData from "@/public/data/prospect/prospectUserData.json";
import eventData from "@/public/data/prospect/userEventData.json";

interface fnProp {
  offset: number;
  searchParams: URLSearchParams;
}

export const useCompanyService = () => {
  const api = useApi<
    CompanyListResponse | CompanyDetailResponse | undefined | any
  >();

  const getCompanyList = (searchParamsString: string) => {
    const params = new URLSearchParams(searchParamsString);
    const url = endpoints.prospect.company.list;
    return api.request(url, {
      method: "GET",
      params: params,
    });
  };

  const getPeopleList = (searchParamsString: string) => {
    const params = new URLSearchParams(searchParamsString);
    const url = endpoints.prospect.users.list;
    return api.request(url, {
      method: "GET",
      params: params,
    });
  };

  const unlockUserDetail = (userId: number | string) => {
    const payload: any = {
      unmask: "email,phone",
      source: "prospectUserPage",
      target: "USER",
    };

    return api.request<pocDetail>(
      `${endpoints.prospect.users.detail}/${userId}`,
      {
        method: "GET",
        params: payload,
      }
    );
  };

  const unlockPocDetail = (pocId: number, companyId: string) => {
    const payload: any = {
      unmask: "email,phone",
      source: "companyPage",
      target: "COMPANY",
      targetId: companyId,
    };

    return api.request<pocDetail>(
      `${endpoints.prospect.users.detail}/${pocId}`,
      {
        method: "GET",
        params: payload,
      }
    );
  };

  const getCompanyDetailById = (companyId: string | number) => {
    return api.request<CompanyDetailResponse>(
      `${endpoints.prospect.company.detail}/${companyId}`,
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
      `${endpoints.prospect.company.detail}/${companyId}/events?eventOf=${eventType}&limit=10&offset=${offset}`,
      {
        method: "GET",
      }
    );
  };

  const getCompanyPOC = (companyId: string | number) => {
    return api.request(
      `${endpoints.prospect.company.detail}/${companyId}/pocs`,
      {
        method: "GET",
      }
    );
  };

  const getEventCountByCountry = (
    companyId: string | number,
    source: string
  ) => {
    return api.request(
      `${
        source === "userDetail"
          ? endpoints.prospect.users.detail
          : endpoints.prospect.company.detail
      }/${companyId}/events?groupBy=country`,
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

  const getUserDetailById = (userId: string | number) => {
    return api.request<any>(`${endpoints.prospect.users.detail}/${userId}`, {
      method: "GET",
    });
  };

  const getUserEvents = (
    userId: string | number,
    eventType: string,
    offset: number = 0
  ) => {
    return api.request(
      `${endpoints.prospect.users.detail}/${userId}/events?eventOf=${eventType}&limit=10&offset=${offset}`,
      {
        method: "GET",
      }
    );
  };

  return {
    getCompanyList,
    getPeopleList,
    unlockUserDetail,
    unlockPocDetail,
    getCompanyDetailById,
    getCompanyEvents,
    getCompanyPOC,
    getEventCountByCountry,
    checkCompanyLogo,
    getUserDetailById,
    getUserEvents,
    isLoading: api.isLoading,
    // error: api.error as ApiError,
  };
};
