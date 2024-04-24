import { myFetch } from "@/utils/myFetch";
import { ReadonlyURLSearchParams } from "next/navigation";

const base_url = "https://console.eventgtm.com" ?? "";

export const searchEvents = async (searchParams: ReadonlyURLSearchParams) => {
  return myFetch(
    `${base_url}/event/all?${searchParams.toString().replace(/%2C/g, ",")}`
  );
};

export const searchEventId = async (id: string) => {
  return myFetch(`${base_url}/event/all?id=${id}`);
};