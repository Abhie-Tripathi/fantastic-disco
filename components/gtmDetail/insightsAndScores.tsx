"use client";
import { Event, OverallRankingsDetail, TTabs } from "@/types/events";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { Heading } from "../eventDetail/heading";
import { PlatformInsightsView } from "../eventDetail/platformInsightsView";
import { EventRank } from "./eventRank";
interface Props {
  eventDetails: Event;
  eventRankingDetails: OverallRankingsDetail;
  scrollSection: string;
  setActiveTab: Dispatch<SetStateAction<TTabs>>;
}
export const InsightsAndScores = ({
  eventDetails,
  eventRankingDetails,
  scrollSection,
  setActiveTab,
}: Props) => {
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
        heading="Insights and Scores"
        scrollSection={scrollSection}
        tooltipDescription="Shows the event’s influence, visitor appeal, and economic impact."
      />
      <div className="flex flex-col gap-6">
        <PlatformInsightsView
          eventDetails={eventDetails}
        />
        <EventRank
          eventDetails={eventDetails}
          eventRankingDetails={eventRankingDetails}
        />
      </div>
    </div>
  );
};
