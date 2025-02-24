import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import {
  FilterConfiguration,
  InterestConfiguration,
  InterestConfigurationResponse,
  OutreachConfiguration,
} from "@/types/configuration";

export const useConfigurationService = () => {
  const api = useApi();

  const getFilterConfiguration = async () => {
    return api.request<FilterConfiguration>(
      endpoints.configuration.filterConfiguration
    );
  };

  const getInterestConfiguration = async () => {
    return api.request<InterestConfigurationResponse>(
      endpoints.configuration.interestConfiguration
    );
  };

  const getOutreachConfiguration = async () => {
    return api.request<OutreachConfiguration>(
      endpoints.configuration.outreachConfiguration
    );
  };

  return {
    getFilterConfiguration,
    getInterestConfiguration,
    getOutreachConfiguration,
  };
};
