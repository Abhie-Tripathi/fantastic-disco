"use client";
import { categoryRank, countryRank, Event, TTabs } from "@/types/events";
import { EventRank } from "./eventRank";
import { InformationFill } from "geist-icons";
import Text from "../new-ui/Text";
import { CircularProgressBar } from "../eventDetail/circularProgressBar";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Heading } from "../eventDetail/heading";
import { GTMEventDetail } from "@/types/events";
interface Props {
  eventDetails: GTMEventDetail;
  scrollSection: string;
  setActiveTab: Dispatch<SetStateAction<TTabs>>;
}
export interface RankingDetail {
  above5CountryEvent: countryRank[] | [];
  below5CountryEvent: countryRank[] | [];
  above5CategoryEvent: categoryRank[] | [];
  below5CategoryEvent: categoryRank[] | [];
}
export const InsightsAndScores = ({
  eventDetails,
  scrollSection,
  setActiveTab,
}: Props) => {
  const {
    scores,
    economicImpact,
    above5CategoryEvent,
    below5CategoryEvent,
    above5CountryEvent,
    below5CountryEvent,
    "trustScore%": trustScore,
  } = eventDetails;
  const rankings: RankingDetail = {
    above5CategoryEvent: above5CategoryEvent,
    below5CategoryEvent: below5CategoryEvent,
    above5CountryEvent: above5CountryEvent,
    below5CountryEvent: below5CountryEvent,
  };
  const [ref, inView, entry, rootMargin] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  useEffect(() => {
    if (inView) {
      setActiveTab(scrollSection as TTabs);
    }
  }, [inView]);
  return (
    <div className={`flex flex-col gap-6`} ref={ref}>
      <Heading heading="Insights and Scores" scrollSection={scrollSection} />
      <div className="flex flex-col gap-6">
        <div className="flex gap-6 h-auto max-xl:flex-col max-xl:h-full">
          <div className="grid grid-cols-4 grid-rows-1 gap-6 w-full">
            {scores && (
              <>
                <div className="flex flex-col bg-[#FAFAFA] items-center border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
                  <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                    Impact Score
                  </h1>
                  <CircularProgressBar value={scores.impactScore} />
                </div>
                <div className="flex flex-col bg-[#FAFAFA] items-center border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
                  <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                    Trust Score
                  </h1>
                  <CircularProgressBar value={Math.round(trustScore ?? 0)} />
                </div>
                <div className="flex flex-col bg-[#FAFAFA] items-center border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
                  <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                    Inbound Score
                  </h1>
                  <CircularProgressBar value={scores.inboundScore} />
                </div>
                <div className="flex flex-col bg-[#FAFAFA] items-center border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
                  <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                    International Score
                  </h1>
                  <CircularProgressBar value={scores.internationalScore} />
                </div>
              </>
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
                  predictedEventSpendBreakUp.map((predictedEventSpend: any) => (
                    <li
                      key={predictedEventSpend.title}
                      className="flex justify-between"
                    >
                      <Text size="large">{predictedEventSpend.title}</Text>
                      <span className="text-primary font-semibold leading-6">
                        {predictedEventSpend.spend}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div> */}
        </div>
        <EventRank
          rankings={rankings as RankingDetail}
          eventDetails={eventDetails}
        />
      </div>
    </div>
  );
};
