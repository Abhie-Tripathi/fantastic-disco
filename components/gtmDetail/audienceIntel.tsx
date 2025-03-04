"use client";
import { useFilterContext } from "@/context/filterContext";
import { Event, EventParticipantsDetails, TTabs } from "@/types/events";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { AudienceSpread } from "../eventDetail/audienceSpread";
import { DesignationSpread } from "../eventDetail/designationSpread";
import { EventAudienceEstimates } from "../eventDetail/eventAudienceEstimates";
import { Heading } from "../eventDetail/heading";
import { EventParticipants } from "./eventParticipants";

interface Props {
  eventDetails: Event;
  eventExhibitorData: EventParticipantsDetails[];
  eventSpeakerData: EventParticipantsDetails[];
  eventSponsorData: EventParticipantsDetails[];
  scrollSection: string;
  setActiveTab: Dispatch<SetStateAction<TTabs>>;
}

export const AudienceIntel = ({
  eventDetails,
  eventExhibitorData,
  eventSpeakerData,
  eventSponsorData,
  scrollSection,
  setActiveTab,
}: Props) => {
  const { morphedData } = useFilterContext();
  const {
    estimatedVisitors,
    estimatedExhibitor,
    audienceSpread: audienceSpreadRestriction,
    audienceProfile,
  } = morphedData;

  const { audienceSpread, designationSpread } =
    (eventDetails && eventDetails.audience) || {};

  const { estimatedAttendance, estimatedExhibitors } =
    (eventDetails && eventDetails.insights) || {};

  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  useMemo(() => {
    if (inView) {
      setActiveTab(scrollSection as TTabs);
    }
  }, [inView]);

  return (
    <div className={`flex flex-col gap-6`} ref={ref}>
      <Heading
        heading="Audience Intel"
        scrollSection={scrollSection}
        tooltipDescription="Provides insights into exhibitors, speakers, and sponsors."
      />
      <div className="flex flex-col gap-6">
        <EventAudienceEstimates
          audienceEstimateData={{
            estimatedAttendance: estimatedAttendance,
            estimatedExhibitors: estimatedExhibitors,
          }}
          restrictedData={{
            estimatedVisitors: estimatedVisitors,
            estimatedExhibitor: estimatedExhibitor,
          }}
        />
        <div className="flex gap-6 max-xl:flex-col max-h-full xl:max-h-96">
          <AudienceSpread
            restrictedData={audienceSpreadRestriction}
            audienceSpread={audienceSpread}
          />
          <DesignationSpread
            restrictedData={audienceProfile}
            designationSpread={designationSpread}
          />
        </div>
        <EventParticipants
          eventDetails={eventDetails}
          eventExhibitorData={eventExhibitorData}
          eventSpeakerData={eventSpeakerData}
          eventSponsorData={eventSponsorData}
        />
      </div>
    </div>
  );
};
