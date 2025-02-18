import { useApi } from '@/hooks/useApi';
import { endpoints } from "@/config/endpoints";
import { Tracker, Access, NewAccess, ExistingAccess, EditAccess, AllTrackerTypes } from '@/types/trackers';
// import { EventsAdapter } from "@/adapters/eventsAdapter";
import {TrackersAdapter } from '@/adapters/trackerAdapter';

import {CalendarWeekEventsResponse, EventCount, MapEventsResponse} from "@/types/events";
import { EventTableType } from '@/types/ListViewTable';
import { useFilterState } from '@/hooks/useFilterState';
import { usePathname } from 'next/navigation';
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
        `${endpoints.tracker.commonUrl}/${trackerId}/saved-events?${params}`,
        {
          method: "GET",
          signal: signal, // Pass the signal here
        }
      );
    
      // if (getFilterValue("view") === "table") {
        return response;
      // }
    
      // const updatedResponse = TrackersAdapter.adaptTrackerEventData(response);
      // return EventsAdapter.adaptResponse(updatedResponse, new URLSearchParams("view=list"));
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
        `${endpoints.tracker.commonUrl}/${trackerId}${params ? `?${params}` : ''}?refresh=true`,
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
        `${endpoints.tracker.commonUrl}/${trackerId}/users`,
      );
    }
    const shareTrackerInvite=(formData: ExistingAccess, trackerId)=>{
        return api.request(
          `${endpoints.tracker.commonUrl}/${trackerId}/access`,
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
    const removeAccess=( accessId:string, trackerId:string)=>{
      return api.request(
        `${endpoints.tracker.commonUrl}/${trackerId}/access/${accessId}`,
        {
          method:"DELETE"
        }
      )
    }
    const getTrackerEvents = async(query, trackerId
    ): Promise<GetSavedEventsResponse | undefined> => {
      // console.log(pathname);
      let active="active";
      if(query.eventType==="newEvent") active="new";
      else if(query.eventType==="expiredEvent") active="past";
      else if(query.eventType==="activeEvent") active="active";

      console.log(query);
      if(query.eventType==="savedEvent")
      {
        return await api.request<{ result: EventTableType[]; count: number  }>(
          `${endpoints.tracker.commonUrl}/${trackerId}/saved-events?limit=${query.limit||"10"}&offset=${query.skip||"0"}`,
          {
            method: "GET"
          }
        );
      }
      // const response=await api.request<{ result: EventTableType[]; count: number }>(
      //   `${endpoints.tracker.commonUrl}/${trackerId}/events?${params}${eventType.length !== 0 ? `&type=${eventType}` : ''}`,
      //   {
      //     method: "GET",
      //     signal: abortSignal,
      //   }
      // );
      const response = await api.request(`https://api.dev.gtm.whr.ai/trackers/${trackerId}/events?limit=${query.take||"20"}&offset=${query.limit||"0"}&type=${active}`)
      // return response;
      console.log(response);
      return response;
      // if(getFilterValue("view")==="table"){
      //   return response;
      // }
      // const updatedResponse = TrackersAdapter.adaptTrackerEventData(response);
      // return EventsAdapter.adaptResponse(updatedResponse, new URLSearchParams("view=list"));
    };
    const getTrackerMapEvents = async(
      trackerId:string, params:string, eventType:string,
      abortSignal?: AbortSignal
    ) => {
      console.log(eventType);
      
      const setParams = new URLSearchParams(eventType);
    // const adaptedParams = EventsAdapter.adaptRequestParams(setParams);
    // console.log(adaptedParams);
    
      const response:any= await api.request(
        setParams.get("type")==="saved"?`${endpoints.tracker.commonUrl}/${trackerId}/saved-events`:`${endpoints.tracker.commonUrl}/${trackerId}/events`,
        {
          method: "GET",
          signal: abortSignal,
          params: setParams,
        }
      );
      return response;
      // const updatedResponse = TrackersAdapter.adaptTrackerEventData(response);
      
      // return EventsAdapter.adaptResponse(updatedResponse, new URLSearchParams("view=Map"));
    };
    const getSuggestion = async (endpoint, searchInput, abortSignal) => {
      console.log("Received AbortSignal:", abortSignal);
  
      try {
          const response: any = await api.request(
              `${endpoints.tracker.suggestion}?query=${searchInput}&offset=0&limit=5`,
              {
                  method: "GET",
                  signal: abortSignal,
              }
          );
  
          console.log("API Response:", response);
          return response;
      } catch (error: any) {
          if (error.name === "AbortError") {
              console.log("Fetch aborted");
              return null;
          }
          console.error("Error fetching suggestions:", error);
          throw error;
      }
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
    const saveIntent=(formData:any)=>{
      console.log(formData);
      
      return api.request(
        `https://api.dev.gtm.whr.ai/intents/user-event-interest`,
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
      console.log(type);
      
      // const params = new URLSearchParams(new URL(type).search);
      // const t = params.get("type"); 
      // console.log(1111);
        const response = await api.request<EventCount[]>(
          type==="saved"?`${endpoints.tracker.commonUrl}/${trackerId}/saved-events/count?view=map&groupBy=${currentZoomGroup}`:`${endpoints.tracker.commonUrl}/${trackerId}/events/count?view=map&type=${type}&groupBy=${currentZoomGroup}`,
          {
            method: "GET",
          }
        );
        return response;
    }
    const getEventsLatLongData = async (trackerId:string,searchParams:string, type:string) => {
      const params = new URLSearchParams(searchParams);
    // const adaptedParams = EventsAdapter.adaptRequestParams(params);
    
    const response = await api.request(type==="saved"?`${endpoints.tracker.commonUrl}/${trackerId}/saved-events`:`${endpoints.tracker.commonUrl}/${trackerId}/events?type=${type}`, {
      method: "GET",
      params: params
    },true);
    console.log(response);
    
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
      return response;
      // if(isListing){
      //   const updatedResponse  = TrackersAdapter.adaptTrackerEventData(response);
        
        
      //   return EventsAdapter.adaptResponse(updatedResponse, new URLSearchParams(""));
      // }else 
      // return EventsAdapter.adaptResponse(response, new URLSearchParams(`view=calendar&calendar_type=${viewType}`));
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
      getSuggestion,
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
      saveIntent,
      saveNewEvent,
      deleteNewEvent,
      getSavedEvents,
      getTrackerDetail,
      getTrackerEvents,
      isLoading: api.isLoading,
      error: api.error,
    };
  };