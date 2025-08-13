import { useFilterContext } from "@/context/filterContext";
export const useSafeFilterContext = () => {
  try {
    return useFilterContext();
  } catch (e) {
    return { 
        isTentimesUser: false, 
        localFilters: {}
    };
  }
};
