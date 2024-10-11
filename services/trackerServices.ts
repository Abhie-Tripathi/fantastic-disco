import { useApi } from '@/hooks/useApi';
import { endpoints } from "@/config/endpoints";
export const useTrackerServices = () => {
    const api = useApi();
    const createTracker = (formData: any) => {
        
      return api.request(
        `${endpoints.tracker.create}`,
        {
            method: "POST",
            data: formData,
        }
      );
    };
    const getTrackers = (params: string)=>{

      return api.request(
        `${endpoints.tracker.getTrackers}?${params}`,
      )
    }
    const getSavedEvents =(trackerId:string, params: string)=>{
      return api.request(
        `${endpoints.tracker.getSavedEvents}/${trackerId}/saved-events?${params}`
      )
    }
    const getNotes=(trackerId:string, params:string)=>{
      return api.request(
        `${endpoints.tracker.getNotes}&entityId=${trackerId}&${params}`
      )
    }
    const getTrackerDetail=(trackerId:string)=>{
      return api.request(
        `${endpoints.tracker.create}/${trackerId}`,
      );
    }
  
    return {
      createTracker,
      getTrackers,
      getSavedEvents,
      getTrackerDetail,
      getNotes,
      isLoading: api.isLoading,
      error: api.error,
    };
  };