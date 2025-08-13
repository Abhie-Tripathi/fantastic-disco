import { useFilterContext } from "@/context/filterContext";

export const useSafeFilterContext = () => {
  try {
    return useFilterContext();
  } catch (e) {
    return {
      isTentimesUser: false,
      localFilters: {
        audienceSpread: "",
        presetCountry: "",
        audienceSpreadRegions: ""
      },
      setLocalFilter: () => {},
      setMultipleLocalFilters: () => {},
      getLocalFilterValue: () => "",
      morphedData: {}
    };
  }
};