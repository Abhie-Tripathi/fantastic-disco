import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import { Country } from "@/types/events/event";
import { Designations } from "@/types/misc/designations";
import { UndefinedInitialDataInfiniteOptions } from "@tanstack/react-query";
import { MiscAdapter } from "@/adapters/miscAdapter";
// import { Designations } from "@/types/misc/designations";
// import externalAxios from "@/lib/externalAxios";

export const useMiscService = () => {
  const api = useApi();

  //   const getLabelAutocomplete = (input: string) => {
  //     return api.request<{ tags: Tags[] }>(`${endpoints.tags}`, {
  //       method: "GET",
  //       params: { query: input },
  //     });
  //   };

  //   const getDesginationAutocomplete = (input: string) => {
  //     return api.request<{ designations: Designations[] }>(
  //       `${endpoints.designations}`,
  //       {
  //         method: "GET",
  //         params: { name: input },
  //       }
  //     );
  //   };

  const getCountries = async () => {
    const response = await api.request<Country[]>(`${endpoints.locations}`, {
      method: "GET",
      params: { limit: 300, offset: 0 },
    });
    return MiscAdapter.adaptCountriesResponse(response);
  };
  const getDesginationAutocomplete = async (input: string) => {
    const response = await api.request<Designations[] | undefined>(
      `${endpoints.designations}`,
      {
        method: "GET",
        params: { name: input, take: 100 },
      }
    );
    return MiscAdapter.adaptDesignationsResponse(response);
  };

  const getRegions = () => {
    return MiscAdapter.adaptRegionsResponse();
  };

  //   const getWeatherData = async (
  //     latitude: string,
  //     longitude: string,
  //     activeDate: string
  //   ) => {
  //     return externalAxios
  //       .get<Weather>(
  //         `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${latitude}&lon=${longitude}&units=metric&date=${activeDate}&appid=${apiKey}`,
  //         {
  //           method: "GET",
  //         }
  //       )
  //       .then((data) => data.data);
  //   };

  return {
    getRegions,
    getCountries,
    // getLabelAutocomplete,
    getDesginationAutocomplete,
    isLoading: api.isLoading,
    error: api.error,
  };
};
