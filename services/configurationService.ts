import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import {
  FilterConfiguration,
  InterestConfiguration,
  InterestConfigurationResponse,
  OutreachConfigurationResponse,
} from "@/types/configuration";

export const useConfigurationService = () => {
  const api = useApi();

  const getFilterConfiguration = async () => {
    return api.request<{ filter: FilterConfiguration }>(
      endpoints.configuration.filterConfiguration
    );
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
