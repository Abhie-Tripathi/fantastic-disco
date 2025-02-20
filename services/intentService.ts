import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import { CreateUserEventInterest } from "@/types/intent";

export const useIntentService = () => {
  const api = useApi();

  const createUserEventInterest = async (data: CreateUserEventInterest) => {
    return api.request<CreateUserEventInterest>(
      endpoints.intent.userEventInterest,
      {
        method: "POST",
        data,
      }
    );
  };

  const updateUserEventInterest = async (
    id: string,
    data: Partial<CreateUserEventInterest>
  ) => {
    return api.request(`${endpoints.intent.userEventInterest}/${id}`, {
      method: "PATCH",
      data,
    });
  };

  const deleteUserEventInterest = async (id: string) => {
    return api.request(`${endpoints.intent.userEventInterest}/${id}`, {
      method: "DELETE",
    });
  };

  return {
    createUserEventInterest,
    updateUserEventInterest,
    deleteUserEventInterest,
  };
};
