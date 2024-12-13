import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
export const useProductSettingServices = () => {
  const api = useApi();

  const getResearchData = async () => {
    const response = await api.request(`${endpoints.configuration}?source=interest`);
    if (!response) {
      throw new Error("Failed to retrieve brand kit data.");
    }

    return response;
  };

  const getOutreachData = async () => {
    const response = await api.request(`${endpoints.configuration}?source=outreach`);
    if (!response) {
      throw new Error("Failed to retrieve brand kit data.");
    }

    return response;
  };

  return {
    getResearchData,
    getOutreachData,
    isLoading: api.isLoading,
    error: api.error,
  };
};
