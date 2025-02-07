import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import { CoordinateListResponse, PresetList, UserInterestResponse, eventPocResponse, pocDetail } from "@/types/coordinateEventType";
import { ApiError } from "@/types/api";
import { MiscAdapter } from "@/adapters/miscAdapter";
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
  ownerId: string,
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

interface createIntentProp {
  sourceModule: string;
  eventId: string;
  interest: string;
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
    // https://api.dev.gtm.whr.ai/enquiries/2daa7ddb-d747-4302-8b89-523dbc7a5fdb/interested-users
    return api.request(`${endpoints.coordinate.enquiryDetail}/${enquiryId}/interested-users`, {
      method: "GET",
    });

    // return api.request<UserInterestResponse>(`${endpoints.coordinate.iterestedUsers}/${eventId}?enquiryId=${enquiryId}`, {
    //   method: "GET",
    // });
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
    return api.request(`${endpoints.coordinate.eventDetail}/${eventId}`, {
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
    ownerId,
  }: setOwnerProp) => {
    const response = await api.request(`${endpoints.coordinate.enquiryDetail}/${enquiryId}/owner`, {
      method: "POST",
      data: {
        ownerId: ownerId,
      },
    });
    return response;
  }

  const setEnquiryStatus = async ({
    enquiryId,
    enquiryStatus,
  }: updateEnquiryStatusProp) => {
    const response = await api.request(`${endpoints.coordinate.enquiryDetail}/${enquiryId}`, {
      method: "PATCH",
      data: {
        // enquiryId: enquiryId,
        status: enquiryStatus,
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
    // return tempRes;
    // https://api.dev.gtm.whr.ai/me/account/configuration/interest
    return api.request(`${endpoints.account.configuration}/interest`, {
      method: "GET",
    });
  }

  const getPipelineConfig = async() => {

    // const temp = await api.request('https://api.dev.gtm.whr.ai/auth/verify-otp', {
    //   method: "POST",
    //   data: {
    //     email:'rajat@10times.com',
    //     otp: '729203',
    //   },
    // });
    // console.log(temp);
    // const temp2 = await api.request<any>('https://api.dev.gtm.whr.ai/me/account/enquiries', {
    //   method: "GET",
    // });
    // console.log(temp2);
    

    return api.request(`${endpoints.account.configuration}/outreach`, {
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

  const createUserIntent = (payload: createIntentProp) => {
    console.log('endpoint..',`${endpoints.coordinate.createIntent}`);
    
    return api.request<any>(`${endpoints.coordinate.createIntent}`, {
      method: "POST",
      data: payload,
    });
  };

  const getAllUsers = () => {
    return api.request<any>(`${endpoints.account.users}`, {
      method: "GET",
    });
  }

  const getEnquiryFollowers = (enquiryId: string) => {
    return api.request(`${endpoints.coordinate.enquiryDetail}/${enquiryId}/followers`, {
      method: "GET",
    });
  }

  const setEnquiryFollowers = (enquiryId: string) => {
    return api.request(`${endpoints.intent.enquiryActivity}`, {
      method: "POST",
      data: {
        activityType: 'FOLLOW',
        enquiryId: enquiryId,
      },
    });
  }

  const deleteEnquiryActivityIntent = (intentId: string) => {
    return api.request<any>(`${endpoints.intent.enquiryActivity}/${intentId}`, {
      method: "DELETE",
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
    createUserIntent,
    getAllUsers,
    getEnquiryFollowers,
    setEnquiryFollowers,
    deleteEnquiryActivityIntent,
    isLoading: api.isLoading,
    error: api.error as ApiError,
  };
};
