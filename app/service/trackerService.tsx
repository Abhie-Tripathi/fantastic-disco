import { myFetch } from "@/utils/myFetch";
const base_url = process.env.NEXT_PUBLIC_EVENTELI_URL ?? "";

export const createTracker = async (trackerDTO: any) => {
  return myFetch(`${base_url}/tracker/create`, {
    method: "POST",
    body: JSON.stringify(trackerDTO),
  });
};