import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import { CoordinateListResponse, UserInterestResponse, eventPocResponse } from "@/types/coordinateEventType";
import { ApiError } from "@/types/api";
import { MiscAdapter } from "@/adapters/miscAdapter";

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
    const adaptedParams = MiscAdapter.adaptCoordinateRequestParam(params);
    return api.request<CoordinateListResponse>(`${endpoints.coordinate.enquiry}?offset=${offset}`, {
      method: "GET",
      params: adaptedParams,
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
    return api.request<eventPocResponse>(`${endpoints.event.poc}/${eventId}`, {
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

  const unblockPocDetail = (pocId: number, eventId: string) => {
    // return api.request<pocDetail>(`https://api.whr.ai/event-poc/unmask?pocId=14046510&eventId=512bb2b6-d9c4-5dae-bc68-99d0e9510448&unlockValue=email,phone`, {
    //   method: "GET",
    // });
    return {
        "id": 28532,
        "name": "HKTDC Exhibition",
        "designation": "Manager",
        "email": "test@hktdc.org",
        "phoneNumber": "+850000000456",
        "location": {
            "cityName": null,
            "countryName": null
        },
        "profilePicture": "https://c1.10times.com/userimages/h.jpg",
        "level": "Manager",
        "emailActive": "2024-11-11 19:18:44"
    };
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
    unblockPocDetail,
    isLoading: api.isLoading,
    error: api.error as ApiError,
  };
};
