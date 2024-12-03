import { Location } from "@/components/search/location";

export const sessionService = () => {
  const saveLastSearchedLocation = (location: Location) => {
    const locationString = JSON.stringify(location);
    sessionStorage.setItem("lastSearchedLocation", locationString);
  };

  const getLastSearchedLocation = (): Location | undefined => {
    const locationString = sessionStorage.getItem("lastSearchedLocation");
    if (!locationString) return;
    return JSON.parse(locationString);
  };

  const clearLastSearchedLocation = () => {
    sessionStorage.removeItem("lastSearchedLocation");
  };

  return {
    saveLastSearchedLocation,
    getLastSearchedLocation,
    clearLastSearchedLocation,
  };
};
