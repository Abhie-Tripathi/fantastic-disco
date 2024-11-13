import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import { Brandkit } from "@/types/geniTypes/brandkitTypes";
export const useBrandKitServices = () => {
  const api = useApi();
  const getBrandkit = async (): Promise<Brandkit> => {
    const response = await api.request<Brandkit>(`${endpoints.brandkit.getKit}`);
    
    if (!response) {
      throw new Error("Failed to retrieve brand kit data.");
    }
    
    return response;
  };
  const addBrandkit = async (formData: any) => {
    return api.request(`${endpoints.brandkit.create}`, {
      method: "POST",
      data: formData,
    });
  };
  const updateBrandkit = async (formData: any) => {
    return api.request(`${endpoints.brandkit.create}`, {
      method: "PATCH",
      data: formData,
    });
  };
  
  return {
    getBrandkit,
    addBrandkit,
    isLoading: api.isLoading,
    error: api.error,
    updateBrandkit
  };
};
