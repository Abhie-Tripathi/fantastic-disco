import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
export const useIntendServices = () => {
  const api = useApi();
  const getAllGuest = async (queryParams:string) => {
    return api.request(`${endpoints.intend.getGuest}?${queryParams}`);
  };

  const getGuestCount = async(eventId:string) =>{
    return api.request(`${endpoints.intend.getGuest}?eventId=${eventId}`);
  }

  const addIntend = async(obj:any) =>{
    return api.request(`${endpoints.intend.addIntend}`, {
      method: 'POST',
      data: obj,
  });
  }

  const updateStatus = async(obj:any) =>{
    return api.request(`${endpoints.intend.updateStatus}`, {
      method: 'PATCH',
      data: obj,
  });
  }
  
  return {
    getAllGuest,
    getGuestCount,
    updateStatus,
    addIntend,
    isLoading: api.isLoading,
    error: api.error,
  };
};
