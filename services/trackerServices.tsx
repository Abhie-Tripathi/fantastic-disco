import { useApi } from '@/hooks/useApi';
import { endpoints } from "@/config/endpoints";
import { Tracker, Access, NewAccess, ExistingAccess, EditAccess, AllTrackerTypes } from '@/types/trackers';
import { EventsAdapter } from "@/adapters/eventsAdapter";
import {TrackersAdapter } from '@/adapters/trackerAdapter';
import {CalendarWeekEventsResponse, EventCount, EventsResponse, MapEventsResponse} from "@/types/events";
import { EventTableType } from '@/types/ListViewTable';
import { useFilterState } from '@/hooks/useFilterState';
interface OriginalResponse {
  totalEvents: number;
  events: any[];
}
type GetSavedEventsResponse =
  | { result: EventTableType[]; count: number }
  | { events: EventTableType[]; count: number }
  | { events: EventTableType[]; totalEvents: number }
  | CalendarWeekEventsResponse
  | MapEventsResponse
  | EventsResponse;

export const useTrackerServices = () => {
    const api = useApi();
    const {getFilterValue} =useFilterState();
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
    const getSavedEvents = async (
      trackerId: string,
      params: string,
      signal?: AbortSignal
    ): Promise<GetSavedEventsResponse | undefined> => {
      const response = await api.request<{ result: EventTableType[]; count: number  }>(
        `${endpoints.tracker.getSavedEvents}/${trackerId}/saved-events?${params}`,
        {
          method: "GET",
          signal: signal, // Pass the signal here
        }
      );
    
      if (getFilterValue("view") === "table") {
        return response;
      }
    
      const updatedResponse = TrackersAdapter.adaptTrackerEventData(response);
      return EventsAdapter.adaptResponse(updatedResponse, new URLSearchParams("view=list"));
    };
    
    const globalSavedEvents = async (
      params: string
    ): Promise<GetSavedEventsResponse | undefined> => {
      const response = await api.request<{ result: EventTableType[]; count: number  }>(
        `${endpoints.tracker.getSavedEvents}/saved-events?${params}`,
        {
          method: "GET"
        }
      );
    
      if (getFilterValue("view") === "table") {
        return response;
      }
    
      const updatedResponse = TrackersAdapter.adaptTrackerEventData(response);
      return EventsAdapter.adaptResponse(updatedResponse, new URLSearchParams("view=list"));
    };
    
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
    const createNewAccess=(formData: NewAccess):Promise<{ user: { id: string } } | undefined> =>{
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
    const getTrackerEvents = async(
      trackerId:string, params:string, eventType:string,
      abortSignal?: AbortSignal
    ): Promise<GetSavedEventsResponse | undefined> => {
      const response=await api.request<{ result: EventTableType[]; count: number }>(
        `${endpoints.tracker.commonUrl}/${trackerId}/events?${params}${eventType.length !== 0 ? `&type=${eventType}` : ''}`,
        {
          method: "GET",
          signal: abortSignal,
        }
      );
      // return response;
      if(getFilterValue("view")==="table"){
        return response;
      }
      const updatedResponse = TrackersAdapter.adaptTrackerEventData(response);
      return EventsAdapter.adaptResponse(updatedResponse, new URLSearchParams("view=list"));
    };
    const getTrackerMapEvents = async(
      trackerId:string, params:string, eventType:string,
      abortSignal?: AbortSignal
    ) => {
      const setParams = new URLSearchParams(eventType);
    const adaptedParams = EventsAdapter.adaptRequestParams(setParams);
      const response:any= await api.request(
        setParams.get("type")==="saved"?`${endpoints.tracker.commonUrl}/${trackerId}/saved-events`:`${endpoints.tracker.commonUrl}/${trackerId}/events`,
        {
          method: "GET",
          signal: abortSignal,
          params: adaptedParams,
        }
      );
      
      const updatedResponse = TrackersAdapter.adaptTrackerEventData(response);
      
      return EventsAdapter.adaptResponse(updatedResponse, new URLSearchParams("view=Map"));
    };
    
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
    const getMapViewData=async(trackerId:string, currentZoomGroup:string, type:any)=>{
      
      // const params = new URLSearchParams(new URL(type).search);
      // const t = params.get("type"); 
      // console.log(1111);
        const response = await api.request<EventCount[]>(
          type==="saved"?`${endpoints.tracker.commonUrl}/${trackerId}/saved-events?limit=20&offset=0&groupBy=${currentZoomGroup}`:`${endpoints.tracker.commonUrl}/${trackerId}/events?limit=20&offset=0&type=${type}&groupBy=${currentZoomGroup}`,
          {
            method: "GET",
          }
        );
        return EventsAdapter.adaptEventCountResponse(response);
    }
    const getEventsLatLongData = async (trackerId:string,searchParams:string, type:string) => {
      const params = new URLSearchParams(searchParams);
    const adaptedParams = EventsAdapter.adaptRequestParams(params);
    
    const response = await api.request(type==="saved"?`${endpoints.tracker.commonUrl}/${trackerId}/saved-events`:`${endpoints.tracker.commonUrl}/${trackerId}/events?type=${type}`, {
      method: "GET",
      params: adaptedParams,
    },true);
    return  TrackersAdapter.adaptTrackerMapEventData(response)
    };
    const getCalendarViewEvents = async (trackerId:string, searchParams:string, isListing:boolean, viewType?:string)=>{
      // console.log(type);
      const newParams=new URLSearchParams(searchParams);
      const type=newParams.get("type");
      newParams.delete("type");
      const entries = Array.from(newParams.entries());
      const result = entries
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
      
      // console.log(`${endpoints.tracker.commonUrl}/${trackerId}/events?type=${type}&groupBy=${searchParams}`);
      const response: OriginalResponse | undefined = await api.request(type==="saved"?`${endpoints.tracker.commonUrl}/${trackerId}/saved-events?${result}`:`${endpoints.tracker.commonUrl}/${trackerId}/events?${searchParams}`, {
        method: "GET",
      });
      
      // console.log(TrackersAdapter.adaptTrackerMapEventData(response));
      if(isListing){
        const updatedResponse  = TrackersAdapter.adaptTrackerEventData(response);
        
        
        return EventsAdapter.adaptResponse(updatedResponse, new URLSearchParams(""));
      }else 
      return EventsAdapter.adaptResponse(response, new URLSearchParams(`view=calendar&calendar_type=${viewType}`));
    }
    // const getEventsCount = async (searchParams: string) => {
    //   const params = new URLSearchParams(searchParams);
    //   const adaptedParams = EventsAdapter.adaptEventCountRequestParam(params);
    //   const response = await api.request<EventCount[]>(
    //     `${endpoints.event.count}`,
    //     {
    //       method: "GET",
    //       params: adaptedParams,
    //     }
    //   );
    //   return EventsAdapter.adaptEventCountResponse(response);
    // };
    return {
      createTracker,
      globalSavedEvents,
      getMapViewData,
      getEventsLatLongData,
      editTracker,
      getTrackerMapEvents,
      getShareAccess,
      getCalendarViewEvents,
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