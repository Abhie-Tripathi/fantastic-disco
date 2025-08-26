import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";

export type AccessType = "SUPER_ADMIN" | "ADMIN" | "USER";
export type AccessAction = "ACCEPT" | "REJECT";

export interface AccessUser {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
}

export interface AccessRequestItem {
  id: string;
  requestedAt: string;
  updatedAt: string;
  accountId: string;
  accessType: AccessType;
  requestStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  expiry: string | null;
  requestedByUser: AccessUser;
  handledByUser: AccessUser | null;
}

export interface AccessRequestsResponse {
  requests: AccessRequestItem[];
}

export interface ReviewRequestPayload {
  accessType: AccessType;
  accessRequestId: string;
  action: AccessAction;
  redirectDomain: string;
}

export const useAccessManagementService = () => {
  const api = useApi();

  const getAccessRequests = async (signal?: AbortSignal) => {
    return api.request<AccessRequestItem[]>(endpoints.account.accessRequests, {
      method: "GET",
      signal,
    });
  };

  const reviewAccessRequest = async (payload: ReviewRequestPayload) => {
    return api.request<{ message: string }>(endpoints.account.requestReview, {
      method: "POST",
      data: payload,
    });
  };

  return {
    getAccessRequests,
    reviewAccessRequest,
    isLoading: api.isLoading,
    error: api.error,
  };
};


