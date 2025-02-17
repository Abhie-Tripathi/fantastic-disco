import { useQuery } from "@tanstack/react-query";
import { useConfigurationService } from "@/services/configurationService";

export const configurationKeys = {
  all: ["configuration"] as const,
  filter: () => [...configurationKeys.all, "filter"] as const,
  interest: () => [...configurationKeys.all, "interest"] as const,
  outreach: () => [...configurationKeys.all, "outreach"] as const,
};

export const useConfiguration = {
  filter: () => {
    const configurationService = useConfigurationService();
    const filterQuery = useQuery({
      queryKey: configurationKeys.filter(),
      queryFn: () => configurationService.getFilterConfiguration(),
      staleTime: 5 * 60 * 1000,
    });

    return {
      filterConfiguration: filterQuery.data,
      isLoading: filterQuery.isLoading,
      error: filterQuery.error,
    };
  },

  interest: () => {
    const configurationService = useConfigurationService();
    const interestQuery = useQuery({
      queryKey: configurationKeys.interest(),
      queryFn: () => configurationService.getInterestConfiguration(),
      staleTime: 5 * 60 * 1000,
    });

    return {
      interestConfiguration: interestQuery.data,
      isLoading: interestQuery.isLoading,
      error: interestQuery.error,
    };
  },

  outreach: () => {
    const configurationService = useConfigurationService();
    const outreachQuery = useQuery({
      queryKey: configurationKeys.outreach(),
      queryFn: () => configurationService.getOutreachConfiguration(),
      staleTime: 5 * 60 * 1000,
    });

    return {
      outreachConfiguration: outreachQuery.data,
      isLoading: outreachQuery.isLoading,
      error: outreachQuery.error,
    };
  },
};
