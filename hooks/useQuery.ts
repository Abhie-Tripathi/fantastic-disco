import {
  useQuery as useTanstackQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

interface CustomQueryOptions<TData = unknown, TError = Error>
  extends UseQueryOptions<TData, TError> {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
}

export function useQuery<TData = unknown, TError = Error>(
  options: CustomQueryOptions<TData, TError>
): UseQueryResult<TData, TError> {
  const {
    staleTime = Infinity,
    gcTime = 5 * 60 * 1000,
    refetchOnWindowFocus = false,
    retry = false,
    ...restOptions
  } = options;

  return useTanstackQuery<TData, TError>({
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    retry,
    ...restOptions,
  });
}
