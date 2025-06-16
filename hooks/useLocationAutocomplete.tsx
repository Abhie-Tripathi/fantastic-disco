import { useQuery } from "@/hooks/useQuery";
import { useLocationService } from "@/services/locationService";
import { useDebounce } from "./useDebounce";

const DEBOUNCE_DELAY = 300;

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

export const useDatabaseLocationcomplete = (input: string, locationType?: string) => {
  const debouncedInput = useDebounce(input, DEBOUNCE_DELAY);
  const { getDatabaseLocationAutocomplete } = useLocationService();
  const { data, error, isLoading } = useQuery({
    queryKey: ["databaseLocationAutocomplete", debouncedInput],
    queryFn: () =>
      getDatabaseLocationAutocomplete(debouncedInput, locationType),
    enabled: !!debouncedInput,
  });

  return {
    predictions: data?.formattedLocations ?? [],
    isLoading,
    isError: !!error,
  };
};
