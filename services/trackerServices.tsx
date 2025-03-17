
import { useApi } from '@/hooks/useApi';
import { endpoints } from "@/config/endpoints";
import { Tracker, Access, NewAccess, ExistingAccess, EditAccess, AllTrackerTypes } from '@/types/trackers';
// import { EventsAdapter } from "@/adapters/eventsAdapter";
import {TrackersAdapter } from '@/adapters/trackerAdapter';
import {CalendarWeekEventsResponse, EventCount, MapEventsResponse, EventResponse} from "@/types/events";
import { EventTableType } from '@/types/ListViewTable';
import { useFilterState } from '@/hooks/useFilterState';
import { usePathname } from 'next/navigation';
import { BASE_URL, isEventeli } from '@/config';
interface OriginalResponse {
  totalEvents: number;
  events: any[];
}
interface UserAccess {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  accessType: string;
  accessId: string;
}
interface BookmarkResponse {
  interest: string;
  id: string;
  eventId:string;
}
interface UserAccessData {
  superAdmin: UserAccess[];
  others: UserAccess[];
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
    const getTrackers = (params: string):Promise<{trackers: AllTrackerTypes[], count: number} | undefined>=>{

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
      params: any
    )=> {
      console.log(params);
      
      const response = await api.request<EventResponse>(
        `${BASE_URL}/me/account/saved-events?limit=${params.limit|| 10}&offset=${params.offset || 0}`,
        {
          method: "GET"
        }
      );
    
        return response;
      // return EventsAdapter.adaptResponse(updatedResponse, new URLSearchParams("view=list"));
    };
   
    const getTrackerDetail=(trackerId:string, params?:string):Promise<Tracker| undefined>=>{
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
    const verifyAccess=async (formData: {otp: string, email:string, target:string, targetId:string})=>{
      return await api.request(`${endpoints.tracker.verifyAccess}`, {
        method:"POST",
        data:formData,
      });
    }
    const removeBookmark = async (id: string): Promise<BookmarkResponse | undefined> => {
      return api.request(`${endpoints.intent.userEventInterest}/${id}`, {
        method: "DELETE",
      });
    };
    const getShareAccess = async (trackerId: string, accessEntity: string): Promise<UserAccessData> => {
      const response = await api.request<UserAccessData>(`${endpoints.tracker.commonUrl}/${trackerId}/users`);
      
      if (!response) {
        throw new Error("UserAccessData is undefined");
      }
      
      return response;
    };    
    
    
    const shareTrackerInvite=(formData: ExistingAccess, trackerId:string)=>{
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
    const getTrackerEvents = async(query:any, trackerId:string
    )=> {
      console.log(trackerId);
      
      // console.log(pathname);
      // let active="active";
      // if(query.eventType==="newEvent") active="new";
      // else if(query.eventType==="expiredEvent") active="past";
      // else if(query.eventType==="activeEvent") active="active";

      console.log(query);
      if(query.eventType==="bookmarked")
      {
        return await api.request<EventResponse>(
          `${endpoints.tracker.commonUrl}/${trackerId}/saved-events?limit=${query.limit||"10"}&offset=${query.offset||"0"}`,
          {
            method: "GET"
          }
        );
      }
      const response = await api.request<EventResponse>(`${endpoints.tracker.commonUrl}/${trackerId}/events?limit=${query.limit||"10"}&offset=${query.offset||"0"}&type=${query.eventType}&sortBy=${query.sortBy || 'score'}`)
      return response;
    };
    const getTrackerMapEvents = async(
      trackerId:string, params:string, eventType:string,
      abortSignal?: AbortSignal
    ) => {
      console.log(params);
      
      let active="active";
      if(params==="newEvent") active="new";
      else if(params==="expiredEvent") active="past";
      else if(params==="activeEvent") active="active";
      const setParams = new URLSearchParams(eventType);
    // const adaptedParams = EventsAdapter.adaptRequestParams(setParams);
    // console.log(adaptedParams);
      const activeTab= !params?isEventeli?"business":"active":params;
      const response:any= await api.request(
        params==="bookmarked"?`${endpoints.tracker.commonUrl}/${trackerId}/saved-events`:`${endpoints.tracker.commonUrl}/${trackerId}/events?type=${activeTab}`,
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
    const getSuggestion = async (endpoint:string, searchInput:string, abortSignal:any) => {
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
        `${endpoints.intent.userEventInterest}`,
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
      console.log(type.toString());
      const eventType = type;
      const eventTypeParam = eventType !== null ? eventType : (!isEventeli ? "active" : "business");
        const response = await api.request<EventCount[]>(
          type==="bookmarked"?`${endpoints.tracker.commonUrl}/${trackerId}/saved-events/count?view=map&groupBy=${currentZoomGroup}`:`${endpoints.tracker.commonUrl}/${trackerId}/events/count?view=map&type=${eventTypeParam}&groupBy=${currentZoomGroup}`,
          {
            method: "GET",
          }
        );
        return response;
    }
    const getEventsLatLongData = async (trackerId:string,searchParams:string, type:any) => {
      const params = new URLSearchParams(searchParams.toString());
    // const adaptedParams = EventsAdapter.adaptRequestParams(params);
    // console.log(type.get("eventType"));
    const eventType = type.get("eventType");
      const eventTypeParam = eventType !== null ? eventType : (!isEventeli ? "active" : "business");
    const response = await api.request(type.get("eventType")==="bookmarked"?`${endpoints.tracker.commonUrl}/${trackerId}/saved-events?view=map`:`${endpoints.tracker.commonUrl}/${trackerId}/events?type=${eventTypeParam}&view=map`, {
      method: "GET",
      params: params
    },true);
    console.log(response);
    
    return response;
    };
    const getCalendarViewEvents = async (trackerId:string, searchParams:string, isListing:boolean, viewType?:string)=>{
      // console.log(type);
      const newParams=new URLSearchParams(searchParams.toString());
      const type=newParams.get("type");
      newParams.delete("type");
      const entries = Array.from(newParams.entries());
      const result = entries
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
      // console.log(`${endpoints.tracker.commonUrl}/${trackerId}/events?type=${type}&groupBy=${searchParams}`);
      const response: OriginalResponse | undefined = await api.request(type==="bookmarked"?`${endpoints.tracker.commonUrl}/${trackerId}/saved-events?${result}`:`${endpoints.tracker.commonUrl}/${trackerId}/events?${searchParams}`, {
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
      removeBookmark,
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
      verifyAccess,
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
