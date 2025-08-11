import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import {
  FilterConfiguration,
  InterestConfigurationResponse,
  OutreachConfigurationResponse,
} from "@/types/configuration";
import { sessionStorage } from "./storageService";
import { isEventeli } from "@/config";

export const useConfigurationService = () => {
  const api = useApi();
  const platform = isEventeli ? "geo" : "gtm";
  const CONFIG_CACHE_KEY = `whr.${platform}.config.filter`;
  const CONFIG_CACHE_TTL = 24 * 60 * 60 * 1000;

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
