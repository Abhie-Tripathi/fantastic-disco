import { sendGAEvent } from "@next/third-parties/google";

export const GAEvent = (
  name: string,
  category: string,
  action: string,
  label: string
) => {
  sendGAEvent("event", name, {
    "Event Category": category,
    "Event Action": action,
    "Event Label": label,
  });
};
