import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import {
  FilterConfiguration,
  InterestConfigurationResponse,
  OutreachConfigurationResponse,
} from "@/types/configuration";
import { sessionStorage } from "./storageService";

export const useConfigurationService = () => {
  const api = useApi();

  const CONFIG_CACHE_KEY = "filter_configuration";
  const CONFIG_CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  const getFilterConfiguration = async () => {
    const cachedConfig = sessionStorage.get<{ filter: FilterConfiguration }>(
      CONFIG_CACHE_KEY
    );

    if (cachedConfig) {
      return { filter: cachedConfig };
    }

    const response = await api.request<{ filter: FilterConfiguration }>(
      endpoints.configuration.filterConfiguration
    );
    if (response?.filter && Object.keys(response.filter)) {
      sessionStorage.set(CONFIG_CACHE_KEY, response.filter, {
        ttl: CONFIG_CACHE_TTL,
      });
    }

    return response;
  };

  const getInterestConfiguration = async () => {
    return api.request<InterestConfigurationResponse>(
      endpoints.configuration.interestConfiguration
    );
  };

  const getOutreachConfiguration = async () => {
    return api.request<OutreachConfigurationResponse>(
      endpoints.configuration.outreachConfiguration
    );
  };

  return {
    getFilterConfiguration,
    getInterestConfiguration,
    getOutreachConfiguration,
  };
};
