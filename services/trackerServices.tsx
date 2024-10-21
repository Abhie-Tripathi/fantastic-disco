import { useApi } from '@/hooks/useApi';
import { endpoints } from "@/config/endpoints";
import { Tracker, Access, NewAccess, ExistingAccess, EditAccess, AllTrackerTypes } from '@/types/trackers';
import { AllEventsType, EventTableType } from '@/types/ListViewTable';
export const useTrackerServices = () => {
    const api = useApi();
    const createTracker = (formData: Tracker) => {
        
      return api.request(
        `${endpoints.tracker.create}`,
        {
            method: "POST",
            data: formData,
        }
      );
    };
    const editTracker=(trackerId:string, formData: Tracker)=>{
      return api.request(
        `${endpoints.tracker.commonUrl}/${trackerId}`,
        {
            method: "PATCH",
            data: formData,
        }
      ); 
    }
    const getTrackers = (params: string):Promise<{trackerData: AllTrackerTypes[], totalCount: number} | undefined>=>{

      return api.request(
        `${endpoints.tracker.getTrackers}?${params}`,
      )
    }
    const getSavedEvents =(trackerId:string, params: string):Promise<{result: EventTableType[], count: number} | undefined>=>{
      return api.request(
        `${endpoints.tracker.getSavedEvents}/${trackerId}/saved-events?${params}`
      )
    }
    const getTrackerDetail=(trackerId:string, params?:string):Promise<{tracker: Tracker }| undefined>=>{
      return api.request(
        `${endpoints.tracker.commonUrl}/${trackerId}${params ? `?${params}` : ''}`,
      );
    }
    const delTracker=(trackerId: string)=>{
      return api.request(
        `${endpoints.tracker.commonUrl}/${trackerId}`,
        {
          method:"DELETE"
        }
      );
    }
    const getShareAccess=(trackerId: string, accessEntity: string)=>{
      return api.request(
        `${endpoints.tracker.access}?accessEntity=${accessEntity}&accessEntityId=${trackerId}`,
      );
    }
    const shareTrackerInvite=(formData: ExistingAccess)=>{
        return api.request(
          `${endpoints.tracker.shareAccess}`,
          {
            method:"POST",
            data:formData,
          }
        )
    }
    const createNewAccess=(formData: NewAccess)=>{
        return api.request(
          `${endpoints.tracker.createNewAccess}`,
          {
            method:"POST",
            data: formData
          }
        )
    }
    const editAccess=(accessEntry:string, formData: EditAccess)=>{
      return api.request(
        `${endpoints.tracker.shareAccess}/${accessEntry}`,
        {
          method:"PATCH",
          data: formData
        }
      )
    }
    const removeAccess=(accessEntry:string, formData:Access)=>{
      return api.request(
        `${endpoints.tracker.shareAccess}/${accessEntry}`,
        {
          method:"PATCH",
          data:formData,
        }
      )
    }
    const getTrackerEvents=(trackerId:string, params:string, eventType:string):Promise<{totalEvents: number, events: EventTableType[]} | undefined>=>{
        return api.request(
          `${endpoints.tracker.commonUrl}/${trackerId}/events?${params}&${eventType.length!==0? `&type=${eventType}`: ''}`
        )
    }
    const saveNewEvent=(formData:any)=>{
        return api.request(
          `${endpoints.tracker.saveEvent}`,
          {
            method:'POST',
            data: formData
          }
        )
    }
    const deleteNewEvent=(formData:any)=>{
        return api.request(
          `${endpoints.tracker.saveEvent}`,
          {
            method: "DELETE",
            data: formData
          }
        )
    }
    return {
      createTracker,
      editTracker,
      getShareAccess,
      editAccess,
      shareTrackerInvite,
      createNewAccess,
      removeAccess,
      delTracker,
      getTrackers,
      saveNewEvent,
      deleteNewEvent,
      getSavedEvents,
      getTrackerDetail,
      getTrackerEvents,
      isLoading: api.isLoading,
      error: api.error,
    };
  };