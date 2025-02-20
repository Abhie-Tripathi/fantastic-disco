import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import { CreateUserEventInterest } from "@/types/intent";

export const useIntentService = () => {
  const api = useApi();

  const createUserEventInterest = async (data: CreateUserEventInterest) => {
    return api.request<CreateUserEventInterest>(
      endpoints.intent.createUserEventInterest,
      {
        method: "POST",
        data,
      }
    );
  };
  const deleteUserEventInterest = async (id: string) => {
    return fetch(`${endpoints.intent.createUserEventInterest}/${id}`, {
        method: "DELETE",
    });
};
  return {
    createUserEventInterest,
    deleteUserEventInterest
  };
};
