import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import { SuggestionsResponse } from "@/types/geniTypes/inviteResType";
export const useInviteServices = () => {
  const api = useApi();
  const getInviteCount = async () => {
    return api.request(`${endpoints.invite.getInviteCount}`);
  };

  const getSuggestions = async(query: string): Promise<SuggestionsResponse> =>{
    let url = `${endpoints.invite.getSuggestions}`;
    if (query.length > 0) {
      url += `?q=${query}`;
    }
    return await api.request(url) as SuggestionsResponse;
  }

  const sendInvite = async(obj:any) =>{
    return api.request(`${endpoints.invite.sendInvite}`, {
        method: "POST",
        data: obj,
    });
  }
  
  
  return {
    getInviteCount,
    getSuggestions,
    sendInvite,
    isLoading: api.isLoading,
    error: api.error,
  };
};
