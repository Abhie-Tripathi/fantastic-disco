import { useQuery } from "@tanstack/react-query";
import { useLocationService } from "@/services/locationService";
import { useDebounce } from "@/hooks/useDebounce";

const DEBOUNCE_DELAY = 300;

export const useNominatimAutocomplete = (input: string) => {
  const debouncedInput = useDebounce(input, DEBOUNCE_DELAY);
  const { getNominatimAutocomplete } = useLocationService();

  const { data, error, isLoading } = useQuery({
    queryKey: ["nominatimAutocomplete", debouncedInput],
    queryFn: () => getNominatimAutocomplete(debouncedInput),
    enabled: !!debouncedInput,
  });

  return {
    predictions: data?.data ?? [],
    isLoading,
    isError: !!error,
  };
};

// export const useSavedLocationAutocomplete = (input: string) => {
//   const debouncedInput = useDebounce(input, DEBOUNCE_DELAY);
//   const { getSavedLocationAutocomplete } = useLocationService();

//   const { data, error, isLoading } = useQuery({
//     queryKey: ["savedLocationAutocomplete", debouncedInput],
//     queryFn: () => getSavedLocationAutocomplete(debouncedInput),
//     enabled: !!debouncedInput,
//   });

//   return {
//     predictions: data?.savedLocations ?? [],
//     isLoading,
//     isError: !!error,
//   };
// };

export const useDatabaseLocationAutocomplete = (input: string) => {
  const debouncedInput = useDebounce(input, DEBOUNCE_DELAY);
  const { getDatabaseLocationAutocomplete } = useLocationService();

  const { data, error, isLoading } = useQuery({
    queryKey: ["databaseLocationAutocomplete", debouncedInput],
    queryFn: () => getDatabaseLocationAutocomplete(debouncedInput),
    enabled: !!debouncedInput,
  });

  return {
    predictions: data?.formattedLocations ?? [],
    isLoading,
    isError: !!error,
  };
};
