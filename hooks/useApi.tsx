import { useState, useCallback, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { AxiosRequestConfig } from "axios";
import { usePathname } from "next/navigation";

export interface ApiResponse<T> {
  data?: T;
  error?: {
    response: string;
    status: number;
    message: string;
    name: string;
  };
}

export function useApi<T>() {
  const pathname = usePathname();
  const [state, setState] = useState<{
    data: T | undefined;
    error: ApiResponse<T>["error"] | null;
    isLoading: boolean;
  }>({
    data: undefined,
    error: null,
    isLoading: false,
  });

  const setError = (error: ApiResponse<T>["error"] | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  useEffect(() => {
    setError(null);
  }, [pathname]);

  const request = useCallback(
    async <R = T,>(
      url: string,
      config?: AxiosRequestConfig,
      skipDataCheck?: boolean
    ): Promise<R | undefined> => {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await axiosInstance.request<ApiResponse<R>>({
        url,
        ...config,
      });

      if (skipDataCheck) {
        setState({ data: undefined, error: null, isLoading: false });
        return response.data as unknown as R;
      }

      if ("data" in response.data) {
        setState({
          data: response.data.data as unknown as T,
          error: null,
          isLoading: false,
        });
        return response.data.data;
      } else if ("error" in response.data) {
        setState({
          data: undefined,
          error: response.data.error,
          isLoading: false,
        });
        throw response.data.error;
      } else {
        const unknownError = {
          response: "Unknown error occurred",
          status: 500,
          message: "An unexpected error occurred",
          name: "UnknownError",
        };
        setState({ data: undefined, error: unknownError, isLoading: false });
        throw unknownError;
      }
    },
    []
  );
  
  return { ...state, request, setError };
}
