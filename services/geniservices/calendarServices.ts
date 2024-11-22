import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
export const useCalendarServices = () => {
  const api = useApi();
  const getYearlyEvents = async (widgetId?:string,year?:any): Promise<any> => {
    const response = await api.request<any>(`${endpoints.calendar.getyearlyEvents}views=calendar&start_date=${year}-01-01&end_date=${year}-12-31&widgetId=${widgetId}&calendarType=year`);
    
    if (!response) {
      throw new Error("Failed to get yearly data.");
    }
    
    return response;
  };

  const getMonthlyEvents = async (widgetId?:string): Promise<any> => {
    const response = await api.request<any>(`${endpoints.calendar.getyearlyEvents}views=calendar&start_date=2024-01-01&end_date=2024-12-31&widgetId=${widgetId}&calendarType=month`);
    
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
