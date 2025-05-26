import { Event } from "@/types/events";

export const formatEventLocation = (
  event: Event,
  hideVenue: boolean = false
): string | JSX.Element => {
  const { eventLocation, format } = event.basic;

  if (!eventLocation) return "Venue to be announced";

  if (format === "online") {
    return "Online";
  }

  if (format === "hybrid") {
    return `Hybrid - ${formatLocationParts(eventLocation, hideVenue)}`;
  }

  return formatLocationParts(eventLocation, hideVenue);
};

export const formatLocationParts = (
  location: Event["basic"]["eventLocation"],
  hideVenue: boolean = false
): string => {
  if (!location) return "";

  const { name, cityName, countryName, locationType } = location;

  if (name?.toLowerCase() === "online") return "Online";

  if (!name && !cityName && !countryName) return "";

  const type = locationType?.toLowerCase() || "";

  if (type === "city") {
    if (countryName) return `${name || cityName}, ${countryName}`;
    return name || cityName || "";
  }

  if (type === "country") {
    return countryName || "";
  }

  if (type === "state") {
    if (countryName) return `${name}, ${countryName}`;
    return name || "";
  }

  if (type === "venue") {
    if (hideVenue) {
      if (cityName && countryName) return `${cityName}, ${countryName}`;
      if (cityName) return cityName;
      if (countryName) return countryName;
      return "";
    }

    if (cityName && countryName) return `${name}, ${cityName}, ${countryName}`;
    if (cityName) return `${name}, ${cityName}`;
    if (countryName) return `${name}, ${countryName}`;
    return name || "";
  }

  if (cityName && countryName) return `${cityName}, ${countryName}`;
  if (cityName) return cityName;
  if (countryName) return countryName;

  return name || "";
};
