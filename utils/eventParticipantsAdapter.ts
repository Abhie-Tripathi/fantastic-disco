import {
  EventExhibitorDetails,
  EventExhibitorDetailsResponse,
  EventSpeakerDetails,
  EventSpeakerDetailsResponse,
  EventSponsorDetailsResponse,
} from "@/types/events";

export const EventParticpantAdapter = () => {
  const exhibitorAdapter = (response: EventExhibitorDetailsResponse) => {
    const data = response.eventExhibitors || [];
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
  const sponsorAdapter = (response: EventSponsorDetailsResponse) => {
    const data = response.eventSponsors || [];
    const sponsorData =
      data && data.length > 0
        ? data.slice(0, 3).map((sponsor) => ({
            id: sponsor.id || "",
            name: sponsor.company || "",
            logo: sponsor.logo || "",
            details: sponsor.title || "",
            type: "sponsor",
          }))
        : [];
    return sponsorData;
  };

  return { exhibitorAdapter, speakerAdapter, sponsorAdapter };
};
