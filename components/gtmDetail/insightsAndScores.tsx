"use client";
import { Event, OverallRankingsDetail, TTabs } from "@/types/events";
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
  eventDetails: Event;
  eventRankingDetails: OverallRankingsDetail;
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
  eventRankingDetails,
  scrollSection,
  setActiveTab,
}: Props) => {
  const {
    scores,
    economicImpact,
    rankings,
    economicImpactBreakdown,
    trustScore,
  } = (eventDetails && eventDetails.insights) || {};
  const estimatedEconomicImpact = parseFloat(
    economicImpact?.replace(/[$,]/g, "") ?? "0"
  );
  const roundedEstimatedEconomicImpact =
    estimatedEconomicImpact && Math.ceil(estimatedEconomicImpact);
  // const rankings: RankingDetail = {
  //   above5CategoryEvent: above5CategoryEvent,
  //   below5CategoryEvent: below5CategoryEvent,
  //   above5CountryEvent: above5CountryEvent,
  //   below5CountryEvent: below5CountryEvent,
  //   above5CountryCategoryRankEvent: above5CountryCategoryRankEvent,
  //   below5CountryCategoryEvent: below5CountryCategoryEvent,
  // };
  const { morphedData } = useFilterContext();
  const { eventAnalytics, eventRanking } = morphedData || {};
  const isAnalyticsEnabled = eventAnalytics && eventAnalytics.isEnabled;
  const isTrustScoreEnabled = eventRanking && eventRanking.isEnabled;
  const economicImpactEnabled =
    (morphedData &&
      morphedData.economicImpact &&
      morphedData.economicImpact.isEnabled) ||
    true;
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
        <div className="flex gap-6 max-xl:flex-col max-xl:h-auto">
          {((scores &&
            Object.values(scores).every((value) => value !== null)) ||
            (trustScore !== null && trustScore != null && trustScore > 0)) && (
            <div
              className={`w-1/2 grid ${
                economicImpact &&
                economicImpact.trim() !== "" &&
                economicImpactBreakdown &&
                Object.keys(economicImpactBreakdown).length > 0
                  ? "w-1/2 grid-cols-2 grid-rows-2"
                  : "w-full grid-rows-1 grid-cols-4 h-fit max-xl:grid-cols-2 max-xl:grid-rows-2"
              }  gap-6 max-xl:w-full`}
            >
              <>
                {scores &&
                  scores.impactScore !== 0 &&
                  scores.impactScore !== null && (
                    <div className="flex flex-col bg-[#FAFAFA] items-center border border-[var(--neutral-light-color)] p-4 rounded-sm gap-3 w-full h-auto">
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
                {trustScore !== null &&
                  trustScore !== undefined &&
                  trustScore > 0 && (
                    <div className="flex flex-col bg-[#FAFAFA] items-center border border-[var(--neutral-light-color)] p-4 rounded-sm gap-3 w-full h-auto">
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
                        <CircularProgressBar
                          value={Math.round(trustScore ?? 0)}
                        />
                      ) : (
                        <Restriction />
                      )}
                    </div>
                  )}
                {scores &&
                  scores.inboundScore !== null &&
                  scores.inboundScore > 0 && (
                    <div className="flex flex-col bg-[#FAFAFA] items-center border border-[var(--neutral-light-color)] p-4 rounded-sm gap-3 w-full h-auto">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full cursor-pointer">
                              Inbound Score
                            </h1>
                          </TooltipTrigger>
                          <TooltipContent className="w-56 tooltip-content-styles">
                            <p className="text-[var(--secondary-text-color)] font-medium">
                              The number of attendees traveling to the event
                              from other cities within the host country.
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
                {scores &&
                  scores.internationalScore !== null &&
                  scores.internationalScore > 0 && (
                    <div className="flex flex-col bg-[#FAFAFA] items-center border border-[var(--neutral-light-color)] p-4 rounded-sm gap-3 w-full h-auto">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full cursor-pointer">
                              International Score
                            </h1>
                          </TooltipTrigger>
                          <TooltipContent className="w-56 tooltip-content-styles">
                            <p className="text-[var(--secondary-text-color)] font-medium">
                              The number of attendees traveling to the event
                              from outside the host country.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {isAnalyticsEnabled ? (
                        <CircularProgressBar
                          value={scores.internationalScore}
                        />
                      ) : (
                        <Restriction />
                      )}
                    </div>
                  )}
              </>
            </div>
          )}

          {economicImpact &&
            economicImpact.trim() !== "" &&
            economicImpactBreakdown &&
            Object.keys(economicImpactBreakdown).length > 0 && (
              <div
                className={`${
                  (scores &&
                    Object.values(scores).every((value) => value === null)) ||
                  (trustScore !== null &&
                    trustScore !== undefined &&
                    trustScore > 0)
                    ? "w-1/2"
                    : "w-fill"
                } border border-[#EBEBEB] relative rounded-md p-4 h-full max-h-96 overflow-y-auto scrollbar max-xl:w-full`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="cursor-pointer font-medium text-[var(--primary-text-color)]">
                            Estimated Economic Impact
                          </p>
                        </TooltipTrigger>
                        <TooltipContent className="w-80 tooltip-content-styles">
                          <p className="text-[var(--secondary-text-color)] font-medium">
                            Total economic impact of an event by forecasting the
                            spending generated by attendees.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {economicImpactEnabled ? (
                      <div className="text-primary font-semibold text-xl">
                        {`$${Intl.NumberFormat("en-US").format(
                          roundedEstimatedEconomicImpact
                        )}`}
                      </div>
                    ) : (
                      <Restriction />
                    )}
                  </div>
                </div>
                {economicImpactEnabled && (
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
                      {economicImpactBreakdown &&
                        Object.keys(economicImpactBreakdown).length > 0 &&
                        Object.entries(economicImpactBreakdown)
                          .sort(([, valueA], [, valueB]) => valueB - valueA)
                          .map(([key, value]) => (
                            <li key={key} className="flex justify-between">
                              <Text size="large">{key}</Text>
                              <span className="text-primary font-semibold leading-6">
                                ${""}
                                {Intl.NumberFormat("en-US").format(
                                  Math.ceil(value)
                                )}
                              </span>
                            </li>
                          ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
        </div>
        <EventRank
          rankings={rankings}
          eventDetails={eventDetails}
          eventRankingDetails={eventRankingDetails}
        />
      </div>
    </div>
  );
};
