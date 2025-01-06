import { sendGTMEvent } from "@next/third-parties/google";

export const GAEvent = (
  name: string,
  category: string,
  action: string,
  label: string
) => {
  sendGTMEvent({
    event: "gaEvent",
    "Event Category": category,
    "Event Action": action,
    "Event Label": label,
  });

  // sendGAEvent("event", name, {
  //   "Event Category": category,
  //   "Event Action": action,
  //   "Event Label": label,
  // });
};
