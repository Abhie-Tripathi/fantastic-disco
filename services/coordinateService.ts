import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import { CoordinateListResponse, PresetList, UserInterestResponse, eventPocResponse, pocDetail } from "@/types/coordinateEventType";
import { ApiError } from "@/types/api";
// import { MiscAdapter } from "@/adapters/miscAdapter";
import externalAxios from "@/lib/externalAxios";

interface fnProp {
  offset: number;
  searchParams: URLSearchParams;
}

interface upVoteProp {
  enquiryId: string,
  like: number,
  type: string
}

interface setOwnerProp {
  enquiryId: string,
  userId: string,
}

interface updateEnquiryStatusProp {
  enquiryId: string,
  enquiryStatus: string,
}

interface shortlistProp {
  entityId: string,
  status: string,
  id: string,
  modifiedBy: string,
  enquiryStatus: string,
}

interface outreachListProp {
  offset: number,
  status: string,
}

export const useCoordinateService = () => {
  const api = useApi<CoordinateListResponse | UserInterestResponse | eventPocResponse | undefined>();

  const getEventsWithSearchParams = async ({
    offset,
    searchParams,
  }: fnProp) => {
    const params = new URLSearchParams(searchParams);
    return api.request<CoordinateListResponse>(`${endpoints.coordinate.enquiry}?offset=${offset}`, {
      method: "GET",
      params: params,
    });
  };

  const getParticipentCount = () => {
    return api.request(`${endpoints.coordinate.participent}`, {
      method: "GET",
    });
  };

  const getInterestedUsers = (eventId: string, enquiryId: string) => {
    return api.request<UserInterestResponse>(`${endpoints.coordinate.iterestedUsers}/${eventId}?enquiryId=${enquiryId}`, {
      method: "GET",
    });
  };

  const upVote = async ({
    enquiryId,
    like,
    type
  }: upVoteProp) => {
    const response = await api.request(`${endpoints.coordinate.iterestedUsers}/${enquiryId}/activity`, {
      method: "POST",
      data: {
        source: "GTM",
        like: like,
        for: type?.toUpperCase(),
      },
    });
    return response;
  }

  const getEventDetailById = (eventId: string) => {
    return api.request(`${endpoints.event.eventDetailById}/${eventId}`, {
      method: "GET",
    });
  };

  const getEventPOC = (eventId: string) => {
    return api.request<eventPocResponse>(`${endpoints.event.poc}/${eventId}?sortBy=desc`, {
      method: "GET",
    });
  }

  const getEnquiryOwner = (enquiryId: string) => {
    return api.request(`${endpoints.coordinate.enquiryDetail}/${enquiryId}/owner`, {
      method: "GET",
    });
  }

  const setEnquiryOwner = async ({
    enquiryId,
    userId,
  }: setOwnerProp) => {
    const response = await api.request(`${endpoints.coordinate.enquiryDetail}/owner`, {
      method: "POST",
      data: {
        enquiryId: enquiryId,
        userId: userId,
      },
    });
    return response;
  }

  const setEnquiryStatus = async ({
    enquiryId,
    enquiryStatus,
  }: updateEnquiryStatusProp) => {
    const response = await api.request(`${endpoints.coordinate.enquiry}`, {
      method: "PATCH",
      data: {
        enquiryId: enquiryId,
        enquiryStatus: enquiryStatus,
      },
    });
    return response;
  }

  const shortlistUsers = async ({
    entityId,
    status,
    id,
    modifiedBy,
    enquiryStatus
  }: shortlistProp) => {
    const response = await api.request(`${endpoints.coordinate.iterestedUsers}`, {
      method: "PATCH",
      data: {
        entityId: entityId,
        status: status,
        id: id,
        modifiedBy: modifiedBy,
        enquiryStatus: enquiryStatus,
      },
    });
    return response;
  }

  const getOutreachEventList = ({offset, status}: outreachListProp) => {
    return api.request<CoordinateListResponse>(`${endpoints.coordinate.enquiry}?limit=10&offset=${offset}&status=${status}`, {
      method: "GET",
    });
  }

  const getOutreachSingleEvent = ({offset, status}: outreachListProp) => {
    return api.request<CoordinateListResponse>(`${endpoints.coordinate.enquiry}?limit=1&offset=${offset}&status=${status}`, {
      method: "GET",
    });
  }

  const getInterestConfig = () => {
    return api.request<CoordinateListResponse>(`${endpoints.configuration}?source=interest`, {
      method: "GET",
    });
  }

  const getPipelineConfig = () => {
    return api.request<CoordinateListResponse>(`${endpoints.configuration}?source=outreach`, {
      method: "GET",
    });
  }

  const unlockPocDetail = (pocId: number, eventId: string) => {
    return api.request<pocDetail>(`${endpoints.coordinate.pocUnmask}?pocId=${pocId}&eventId=${eventId}&unlockValue=email,phone`, {
      method: "GET",
    });
  }

  const getPresetJson = async(type: string, page: number) => {
    const data = await externalAxios.get<PresetList>(`/data/presetJson/${type}/${page}.json`, {
      method: "GET",
    });
    return data.data;
  }

  const getLatestComment = () => {
    return api.request<any>(`${endpoints.coordinate.latestComment}`, {
      method: "GET",
    });
  }

  return {
    getEventsWithSearchParams,
    getParticipentCount,
    getInterestedUsers,
    upVote,
    getEventDetailById,
    getEventPOC,
    getEnquiryOwner,
    setEnquiryOwner,
    setEnquiryStatus,
    shortlistUsers,
    getOutreachEventList,
    getOutreachSingleEvent,
    getInterestConfig,
    getPipelineConfig,
    unlockPocDetail,
    getPresetJson,
    getLatestComment,
    isLoading: api.isLoading,
    error: api.error as ApiError,
  };
};
