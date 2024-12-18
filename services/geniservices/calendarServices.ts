import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
export const useCalendarServices = () => {
  const api = useApi();
  const getYearlyEvents = async (widgetId?:string|null,year?:any,tabSwitch?:any): Promise<any> => {
    const today = new Date().toISOString().split('T')[0];
    if(tabSwitch=="past"){
      tabSwitch="expired"
    }else{
      tabSwitch=tabSwitch
    }
    const response = await api.request<any>(`${endpoints.calendar.getyearlyEvents}views=calendar&start_date=${year}-01-01&end_date=${year}-12-31&widgetId=${widgetId}&calendarType=year&${tabSwitch?`${tabSwitch}=${today}`:""}`);
    
    if (!response) {
      throw new Error("Failed to get yearly data.");
    }
    
    return response;
  };

  const getMonthlyEvents = async (widgetId?:string|null,tabSwitch?:any): Promise<any> => {
    const today = new Date().toISOString().split('T')[0];
    if(tabSwitch=="past"){
      tabSwitch="expired"
    }else{
      tabSwitch=tabSwitch
    }
    const response = await api.request<any>(`${endpoints.calendar.getyearlyEvents}views=calendar&start_date=2024-01-01&end_date=2024-12-31&widgetId=${widgetId}&calendarType=month&${tabSwitch?`${tabSwitch}=${today}`:""}`);
    
    if (!response) {
      throw new Error("Failed to get monthly data.");
    }
    
    return response;
  };
  
  return {
    getYearlyEvents,
    getMonthlyEvents,
    isLoading: api.isLoading,
    error: api.error,
  };
};
