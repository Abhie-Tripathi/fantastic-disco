"use client";
import { Event, TTabs } from "@/types/events";
import { EventRank } from "./eventRank";
import { InformationFill } from "geist-icons";
import Text from "../new-ui/Text";
import { CircularProgressBar } from "../eventDetail/circularProgressBar";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { Heading } from "../eventDetail/heading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFilterContext } from "@/context/filterContext";
import Restriction from "../eventDetail/restriction";
interface Props {
  eventDetails: Event["insights"];
  scrollSection: string;
  setActiveTab: Dispatch<SetStateAction<TTabs>>;
}
// export interface RankingDetail {
//   above5CountryEvent: countryRank[] | [];
//   below5CountryEvent: countryRank[] | [];
//   above5CategoryEvent: categoryRank[] | [];
//   below5CategoryEvent: categoryRank[] | [];
//   above5CountryCategoryRankEvent: countryCategoryRank[] | [];
//   below5CountryCategoryEvent: countryCategoryRank[] | [];
// }
export const InsightsAndScores = ({
  eventDetails,
  scrollSection,
  setActiveTab,
}: Props) => {
  const { scores, economicImpact, rankings, trustScore } = eventDetails || {};
  // const rankings: RankingDetail = {
  //   above5CategoryEvent: above5CategoryEvent,
  //   below5CategoryEvent: below5CategoryEvent,
  //   above5CountryEvent: above5CountryEvent,
  //   below5CountryEvent: below5CountryEvent,
  //   above5CountryCategoryRankEvent: above5CountryCategoryRankEvent,
  //   below5CountryCategoryEvent: below5CountryCategoryEvent,
  // };
  const { morphedData } = useFilterContext();
  const { eventAnalytics, eventRanking } = morphedData;
  const isAnalyticsEnabled = eventAnalytics && eventAnalytics.isEnabled;
  const isTrustScoreEnabled = eventRanking && eventRanking.isEnabled;
  const [ref, inView, entry, rootMargin] = useInView({
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
        {((scores && Object.values(scores).every((value) => value !== null)) ||
          (trustScore && trustScore > 0)) && (
          <div className="flex gap-6 h-auto max-xl:flex-col max-xl:h-full">
            <div className="grid grid-cols-4 grid-rows-1 gap-6 w-full max-xl:grid-cols-2 max-xl:grid-rows-subgrid">
              {scores && scores.impactScore !== null && (
                <div className="flex flex-col bg-[#FAFAFA] dark:bg-transparent dark:border-[var(--border-color)] items-center border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full cursor-pointer">
                          Impact Score
                        </h1>
                      </TooltipTrigger>
                      <TooltipContent className="w-56 tooltip-content-styles">
                        <p className="text-[var(--secondary-text-color)] font-medium">
                          Quantifies the significance of an event within a
                          specific location.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {isAnalyticsEnabled ? (
                    <CircularProgressBar value={scores.impactScore} />
                  ) : (
                    <Restriction />
                  )}
                </div>
              )}
              {trustScore && (
                <div className="flex flex-col bg-[#FAFAFA] dark:bg-transparent dark:border-[var(--border-color)] items-center border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full cursor-pointer">
                          Trust Score
                        </h1>
                      </TooltipTrigger>
                      <TooltipContent className="w-56 tooltip-content-styles">
                        <p className="text-[var(--secondary-text-color)] font-medium">
                          Reflects an event&apos;s reliability and user
                          confidence based on interest, feedback, and past
                          attendance.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {isTrustScoreEnabled ? (
                    <CircularProgressBar value={Math.round(trustScore ?? 0)} />
                  ) : (
                    <Restriction />
                  )}
                </div>
              )}
              {scores && scores.inboundScore && (
                <div className="flex flex-col bg-[#FAFAFA] dark:bg-transparent dark:border-[var(--border-color)] items-center border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full cursor-pointer">
                          Inbound Score
                        </h1>
                      </TooltipTrigger>
                      <TooltipContent className="w-56 tooltip-content-styles">
                        <p className="text-[var(--secondary-text-color)] font-medium">
                          The number of attendees traveling to the event from
                          other cities within the host country.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {isAnalyticsEnabled ? (
                    <CircularProgressBar value={scores.inboundScore} />
                  ) : (
                    <Restriction />
                  )}
                </div>
              )}
              {scores && scores.internationalScore && (
                <div className="flex flex-col bg-[#FAFAFA] dark:bg-transparent dark:border-[var(--border-color)] items-center border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full cursor-pointer">
                          International Score
                        </h1>
                      </TooltipTrigger>
                      <TooltipContent className="w-56 tooltip-content-styles">
                        <p className="text-[var(--secondary-text-color)] font-medium">
                          The number of attendees traveling to the event from
                          outside the host country.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {isAnalyticsEnabled ? (
                    <CircularProgressBar value={scores.internationalScore} />
                  ) : (
                    <Restriction />
                  )}
                </div>
              )}
            </div>

            {/* <div className="w-1/2 border border-[#EBEBEB] rounded-md p-4 overflow-y-auto scrollbar max-xl:w-full">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Text variant="noMargin" fontWeight="medium">
                      Estimated Economic Impact
                    </Text>
                  </div>
                  <div className="text-primary font-semibold text-2xl">
                    {`${economicImpact}`}
                  </div>
                </div>

                <div className="mt-8">
                  <div className="pb-2 border-b border-[#EBEBEB] flex justify-between ">
                    <Text
                      variant="noMargin"
                      size="small"
                      fontWeight="medium"
                      color="secondary"
                    >
                      IMPACT CATEGORIES
                    </Text>
                    <Text
                      variant="noMargin"
                      size="small"
                      color="secondary"
                      fontWeight="medium"
                    >
                      IMPACT (USD)
                    </Text>
                  </div>

                  <ul className="list-none flex flex-col gap-2 mt-2">
                    {predictedEventSpendBreakUp &&
                      predictedEventSpendBreakUp.length > 0 &&
                      predictedEventSpendBreakUp.map(
                        (predictedEventSpend: any) => (
                          <li
                            key={predictedEventSpend.title}
                            className="flex justify-between"
                          >
                            <Text size="large">
                              {predictedEventSpend.title}
                            </Text>
                            <span className="text-primary font-semibold leading-6">
                              {predictedEventSpend.spend}
                            </span>
                          </li>
                        )
                      )}
                  </ul>
                </div>
              </div> */}
          </div>
        )}

        {/* <EventRank
            rankings={rankings as RankingDetail}
            eventDetails={eventDetails}
          /> */}
      </div>
    </div>
  );
};
