import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import {
  CoordinateListResponse,
  PresetList,
  UserInterestResponse,
  enquiryCountResponse,
  eventPocResponse,
  pocDetail,
} from "@/types/coordinateEventType";
import { ApiError } from "@/types/api";
// import { MiscAdapter } from "@/adapters/miscAdapter";
import externalAxios from "@/lib/externalAxios";
import { Target, Unmask, UnmaskPocApiParamType, Source } from "@/types/events";

interface fnProp {
  offset: number;
  searchParams: URLSearchParams;
}

interface upVoteProp {
  enquiryId: string;
  activityType: string;
  activitySubType: string;
}

interface setOwnerProp {
  enquiryId: string;
  ownerId: string;
}

interface updateEnquiryStatusProp {
  enquiryId: string;
  enquiryStatus: string;
}

interface shortlistProp {
  entityId: string;
  status: string;
  id: string;
  modifiedBy: string;
  enquiryStatus: string;
}

interface outreachListProp {
  offset: number;
  status: string;
}

interface createIntentProp {
  sourceModule: string;
  eventId: string;
  interest: string;
}

export const useCoordinateService = () => {
  const api = useApi<
    CoordinateListResponse | UserInterestResponse | eventPocResponse | undefined
  >();

  const getEventsWithSearchParams = async ({
    offset,
    searchParams,
  }: fnProp) => {
    const params = new URLSearchParams(searchParams.toString());
    const activeGte = params.get("active_gte");
    const activeLte = params.get("active_lte");
    if (activeGte && activeLte) {
      params.set("event_active_gte", activeGte);
      params.set("event_active_lte", activeLte);
    } else if (activeGte) {
      params.set("event_active_gte", activeGte);
    } else if (activeLte) {
      params.set("event_active_lte", activeLte);
    }
    params.delete("active_gte");
    params.delete("active_lte");

    return api.request<CoordinateListResponse>(
      `${endpoints.coordinate.enquiry}?offset=${offset}`,
      {
        method: "GET",
        params: params,
      }
    );
  };

  const getEvents = async (q: string) => {
    const params = {
      offset: 0,
      limit: 5,
      name: q,
    };
    const response = await api.request<CoordinateListResponse>(
      endpoints.coordinate.enquiry,
      {
        method: "GET",
        params: params,
      }
    );
    return response;
  };

  const getParticipentCount = () => {
    return api.request<enquiryCountResponse>(
      `${endpoints.coordinate.participent}?type=interests`,
      {
        method: "GET",
      }
    );
  };

  const getEnquiryStatusCount = () => {
    return api.request<enquiryCountResponse>(
      `${endpoints.coordinate.participent}?type=status`,
      {
        method: "GET",
      }
    );
  };

  const getInterestedUsers = (eventId: string, enquiryId: string) => {
    return api.request(
      `${endpoints.coordinate.enquiryDetail}/${enquiryId}/interested-users`,
      {
        method: "GET",
      }
    );
  };

  const upVote = ({ enquiryId, activityType, activitySubType }: upVoteProp) => {
    return api.request(`${endpoints.intent.enquiryActivity}`, {
      method: "POST",
      data: {
        enquiryId: enquiryId,
        activityType: activityType,
        activitySubType: activitySubType,
      },
    });
  };

  const getEventDetailById = (eventId: string) => {
    return api.request(`${endpoints.coordinate.eventDetail}/${eventId}`, {
      method: "GET",
    });
  };

  const getEventPOC = (eventId: string) => {
    return api.request<eventPocResponse>(
      `${endpoints.coordinate.eventDetail}/${eventId}/pocs`,
      {
        method: "GET",
      }
    );
  };

  const getEnquiryOwner = (enquiryId: string) => {
    return api.request(
      `${endpoints.coordinate.enquiryDetail}/${enquiryId}/owner`,
      {
        method: "GET",
      }
    );
  };

  const setEnquiryOwner = async ({ enquiryId, ownerId }: setOwnerProp) => {
    const response = await api.request(
      `${endpoints.coordinate.enquiryDetail}/${enquiryId}/owner`,
      {
        method: "POST",
        data: {
          ownerId: ownerId,
        },
      }
    );
    return response;
  };

  const setEnquiryStatus = async ({
    enquiryId,
    enquiryStatus,
  }: updateEnquiryStatusProp) => {
    const response = await api.request(
      `${endpoints.coordinate.enquiryDetail}/${enquiryId}`,
      {
        method: "PATCH",
        data: {
          // enquiryId: enquiryId,
          status: enquiryStatus,
        },
      }
    );
    return response;
  };

  const shortlistUsers = async ({
    entityId,
    status,
    id,
    modifiedBy,
    enquiryStatus,
  }: shortlistProp) => {
    const response = await api.request(
      `${endpoints.coordinate.iterestedUsers}`,
      {
        method: "PATCH",
        data: {
          entityId: entityId,
          status: status,
          id: id,
          modifiedBy: modifiedBy,
          enquiryStatus: enquiryStatus,
        },
      }
    );
    return response;
  };

  const getOutreachEventList = ({ offset, status }: outreachListProp) => {
    return api.request<CoordinateListResponse>(
      `${endpoints.coordinate.enquiry}?limit=10&offset=${offset}&status=${status}`,
      {
        method: "GET",
      }
    );
  };

  const getOutreachSingleEvent = ({ offset, status }: outreachListProp) => {
    return api.request<CoordinateListResponse>(
      `${endpoints.coordinate.enquiry}?limit=1&offset=${offset}&status=${status}`,
      {
        method: "GET",
      }
    );
  };

  const getInterestConfig = () => {
    return api.request(`${endpoints.account.configuration}/interest`, {
      method: "GET",
    });
  };

  const getPipelineConfig = async () => {
    return api.request(`${endpoints.account.configuration}/outreach`, {
      method: "GET",
    });
  };

  /**
   * Unlocks POC (Point of Contact) details based on the provided parameters.
   *
   * @param {UnmaskPocApiParamType} param0 - The parameters for the request.
   * @param {number} param0.pocId - The unique identifier of the POC (Point of Contact).
   * @param {Unmask} [param0.unmask] - Optional parameter specifying which details to unmask. See {@link Unmask}.
   * @param {Target} param0.target - The target entity type (USER, EVENT, COMPANY). See {@link Target}.
   * @param {Source} param0.source - The source of the request (eventPage, companyPage, prospectUserPage). See {@link Source}.
   * @param {string} [param0.targetId] - Optional target identifier for the request. It can be eventId | companyId
   * @returns {Promise<pocDetail>} A promise resolving to the POC details.
   */
  const unlockPocDetail = ({
    pocId,
    unmask,
    target,
    source,
    targetId,
  }: UnmaskPocApiParamType): Promise<pocDetail | undefined> => {
    const queryParams = new URLSearchParams({
      ...(unmask && { unmask }),
      ...(target && { target }),
      ...(source && { source }),
      ...(targetId && { targetId }),
    });
    const url = `/users/${pocId}?${queryParams.toString()}`;
    return api.request<pocDetail>(url, {
      method: "GET",
    });
  };

  const getPresetJson = async (type: string, page: number) => {
    const data = await externalAxios.get<PresetList>(
      `/data/presetJson/${type}/${page}.json`,
      {
        method: "GET",
      }
    );
    return data.data;
  };

  const getLatestComment = () => {
    return api.request<any>(`${endpoints.coordinate.latestComment}`, {
      method: "GET",
    });
  };

  const createUserIntent = (payload: createIntentProp) => {
    return api.request<any>(`${endpoints.coordinate.createIntent}`, {
      method: "POST",
      data: payload,
    });
  };

  const getAllUsers = () => {
    return api.request<any>(`${endpoints.account.users}`, {
      method: "GET",
    });
  };

  const getEnquiryFollowers = (enquiryId: string) => {
    return api.request(
      `${endpoints.coordinate.enquiryDetail}/${enquiryId}/followers`,
      {
        method: "GET",
      }
    );
  };

  const setEnquiryFollowers = (enquiryId: string) => {
    return api.request(`${endpoints.intent.enquiryActivity}`, {
      method: "POST",
      data: {
        activityType: "FOLLOW",
        enquiryId: enquiryId,
      },
    });
  };

  const deleteEnquiryActivityIntent = (intentId: string) => {
    return api.request<any>(`${endpoints.intent.enquiryActivity}/${intentId}`, {
      method: "DELETE",
    });
  };

  const fetchEvents = (websiteUrl: string) => {  
    const data = {
      events: [],
      totalCount: 0,
    }
    return data;
  }

  const fetchSimilarEvents = (eventData: any) => {
    const payload = {
      query: eventData.name,
      // active_gte: eventData.startDate,
      // active_lte: eventData.endDate,
      limit: 10,
    }
    return api.request(
      `${endpoints.event.events}`,
      {
        method: "GET",
        params: payload,
      }
    );
  }

  const addNewEvent = async(formData: any) => {
    const data = await externalAxios.post<any>(
      `https://stg-board.10times.com/enquiry/submit`,
      {
        data: formData,
      }
    );
    return data.data;
  }

  return {
    getEventsWithSearchParams,
    getEvents,
    getParticipentCount,
    getEnquiryStatusCount,
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
    fetchEvents,
    fetchSimilarEvents,
    addNewEvent,
    isLoading: api.isLoading,
    // error: api.error as ApiError,
  };
};
