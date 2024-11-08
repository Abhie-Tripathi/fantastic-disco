import { useQuery } from "@tanstack/react-query";
import { useLocationService } from "@/services/locationService";

export const useNominatimAutocomplete = (input: string) => {
  const { getNominatimAutocomplete } = useLocationService();
  const { data, error, isLoading } = useQuery({
    queryKey: ["nominatimAutocomplete", input],
    queryFn: () => getNominatimAutocomplete(input),
    enabled: !!input,
  });

  return {
    predictions: data?.data ?? [],
    isLoading,
    isError: !!error,
  };
};

// export const useSavedLocationAutocomplete = (input: string) => {
//   const { getSavedLocationAutocomplete } = useLocationService();
//   const { data, error, isLoading } = useQuery({
//     queryKey: ["savedLocationAutocomplete", input],
//     queryFn: () => getSavedLocationAutocomplete(input),
//     enabled: !!input,
//   });

//   return {
//     predictions: data?.savedLocations ?? [],
//     isLoading,
//     isError: !!error,
//   };
// };

export const useDatabaseLocationcomplete = (input: string) => {
  const { getDatabaseLocationAutocomplete } = useLocationService();
  const { data, error, isLoading } = useQuery({
    queryKey: ["databaseLocationAutocomplete", input],
    queryFn: () => getDatabaseLocationAutocomplete(input),
    enabled: !!input,
  });

  return {
    predictions: data?.formattedLocations ?? [],
    isLoading,
    isError: !!error,
  };
};
