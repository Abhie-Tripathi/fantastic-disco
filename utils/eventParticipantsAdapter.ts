import {
  EventExhibitorDetails,
  EventExhibitorDetailsResponse,
  EventSpeakerDetails,
  EventSpeakerDetailsResponse,
} from "@/types/events";

export const EventParticpantAdapter = () => {
  const exhibitorAdapter = (response: EventExhibitorDetailsResponse) => {
    const data = response.eventExhibitors || response.exhibitors || [];
    const exhibitorData =
      data && data.length > 0
        ? data.slice(0, 3).map((exhibitor) => ({
            id: exhibitor.id || "",
            name: exhibitor.name || "",
            logo: exhibitor.logo || "",
            details: exhibitor.boothNo || "",
            type: "exhibitor",
          }))
        : [];
    return exhibitorData;
  };
  const speakerAdapter = (response: EventSpeakerDetailsResponse) => {
    const data = response.eventSpeakers || [];
    const speakerData =
      data && data.length > 0
        ? data.slice(0, 3).map((speaker) => ({
            id: speaker.id || "",
            name: speaker.name || "",
            logo: speaker.profilePicture || "",
            details: speaker.designation || "",
            type: "speaker",
          }))
        : [];
    return speakerData;
  };
  const sponsorAdapter = () => {};

  return { exhibitorAdapter, speakerAdapter, sponsorAdapter };
};
