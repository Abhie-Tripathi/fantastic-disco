// export function numberWithCommas(x: string | number) {
//   console.log(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
//   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

import { Event } from "@/types/events";

export function numberWithCommas(range: string) {
  if (range === "0" || !range) {
    return "--";
  }
  const parts = range.split("-").map((part) => part.trim());
  const formattedParts = parts.map((part) => {
    const number = parseInt(part, 10);
    if (number >= 1000) {
      return Number((number / 1000).toPrecision(2)) + "k";
    } else {
      return number.toString();
    }
  });

  return formattedParts.join(" - ");
}

export function normalizeLat(lat: number) {
  lat = ((lat + 90) % 180) - 90;

  return lat;
}

export function normalizeLon(lon: number) {
  lon = ((lon + 180) % 360) - 180;

  return lon;
}

export const formatEstimatedSpend = (spend: string | null) => {
  if (!spend) return "--";
  const spendNumber = parseFloat(spend.slice(1).replace(/,/g, ""));

  if (spendNumber >= 1000000000) {
    const billions = (spendNumber / 1000000000).toFixed(1);
    return `$${billions}B`;
  }
  if (spendNumber >= 1000000) {
    const millions = (spendNumber / 1000000).toFixed(1);
    return `$${millions}M`;
  }
  if (spendNumber >= 100000) {
    const thousands = (spendNumber / 1000).toFixed(0);
    return `$${thousands}k`;
  }
  return spend;
}

export const getEventLatLong = (event: Event) => {
  const lat = parseFloat(
    event.basic.eventLocation?.venue?.latitude ||
      event.basic.eventLocation?.city?.latitude ||
      event.basic.eventLocation?.state?.latitude ||
      event.basic.eventLocation?.country?.latitude ||
      ""
  );
  const lon = parseFloat(
    event.basic.eventLocation?.venue?.longitude ||
      event.basic.eventLocation?.city?.longitude ||
      event.basic.eventLocation?.state?.longitude ||
      event.basic.eventLocation?.country?.longitude ||
      ""
  );
  return { lat, lon };
};