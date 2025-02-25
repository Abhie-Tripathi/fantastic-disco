import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
export const useProductSettingServices = () => {
  const api = useApi();

  const getResearchData = async () => {
    const response = await api.request(
      `${endpoints.configuration.interestConfiguration}`
    );
    if (!response) {
      throw new Error("Failed to get data.");
    }

    return response;
  };

  const getOutreachData = async () => {
    const response = await api.request(
      `${endpoints.configuration.outreachConfiguration}`
    );
    if (!response) {
      throw new Error("Failed to get outreach data.");
    }

    return response;
  };

  const updateResearchData = async ({ formData }: any) => {
    console.log("form_data",formData)
    return api.request(`${endpoints.configuration.updateResearch}`, {
      method: "PUT",
      data: formData,
    });
  };

  const updateOutreachData = async ({ formData }: any) => {
    // console.log("form_data",formData)
    return api.request(`${endpoints.configuration.updateOutreach}`, {
      method: "PUT",
      data: formData,
    });
  };

  return {
    getResearchData,
    getOutreachData,
    updateResearchData,
    updateOutreachData,
    isLoading: api.isLoading,
    error: api.error,
  };
};
