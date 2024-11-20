import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
export const useCalendarServices = () => {
  const api = useApi();
  const getYearlyEvents = async (): Promise<any> => {
    const response = await api.request<any>(`${endpoints.calendar.getyearlyEvents}views=calendar&start_date=2024-01-01&end_date=2024-12-31&widgetId=cm3ilyh100003yo24lkkm5tfb&calendarType=year`);
    
    if (!response) {
      throw new Error("Failed to get yearly data.");
    }
    
    return response;
  };

  const getMonthlyEvents = async (): Promise<any> => {
    const response = await api.request<any>(`${endpoints.calendar.getyearlyEvents}views=calendar&start_date=2024-12-01&end_date=2024-12-31&widgetId=cm3ilyh100003yo24lkkm5tfb&calendarType=month`);
    
    if (!response) {
      throw new Error("Failed to monthly data.");
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
