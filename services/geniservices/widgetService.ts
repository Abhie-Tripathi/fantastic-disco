import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import { GetDraftWidgetResponse } from "@/types/geniTypes/widgetTypes";
export const useWidgetServices = () => {
  const api = useApi();
  //   const getDraftWidget = async () => {
  //     return api.request(`${endpoints.widget.draftWidget}`);
  //   };
  const getDraftWidget = async (): Promise<GetDraftWidgetResponse> => {
    const response = await api.request<GetDraftWidgetResponse>(
      `${endpoints.widget.draftWidget}`
    );
    return response ?? { totalCount: 0, data: [] };
  };
  const getActiveWidget = async () => {
    return api.request(`${endpoints.widget.activeWidget}`);
  };
  const getDeActiveWidget = async () => {
    return api.request(`${endpoints.widget.deActiveWidget}`);
  };
  const getOnlyDraftWidget = async () => {
    return api.request(`${endpoints.widget.onlyDraftWidget}`);
  };
  const getWidgetById = async (widgetId: string) => {
    return api.request(`${endpoints.widget.widgetById}/${widgetId}`);
  };
  const addCustomizedData = async (customizedData: any) => {
    return api.request(`${endpoints.widget.widget}`, {
      method: "POST",
      data: customizedData,
    });
  };
  const updateWidgetData = async (widgetData: any) => {
    return api.request(`${endpoints.widget.widget}`, {
      method: "POST",
      data: widgetData,
    });
  };

  return {
    getDraftWidget,
    getActiveWidget,
    getDeActiveWidget,
    getOnlyDraftWidget,
    getWidgetById,
    addCustomizedData,
    updateWidgetData,
    isLoading: api.isLoading,
    error: api.error,
  };
};
