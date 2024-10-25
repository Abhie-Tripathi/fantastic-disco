"use client";
import { InformationFill } from "geist-icons";
import { EventParticipants } from "./eventParticipants";
import { Progress } from "@/components/ui/progress";
import Indicator from "/public/indicator.svg";
import { CircleSlash } from "lucide-react";
import Text from "../new-ui/Text";
import * as Flags from "country-flag-icons/react/3x2";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Event, TTabs } from "@/types/events";
import { CircularProgressBar } from "../eventDetail/circularProgressBar";
import { useInView } from "react-intersection-observer";
import { Heading } from "../eventDetail/heading";
import { GTMEventDetail } from "@/types/events";

// type TTabs = "Department Type" | "Designation Type";
interface Props {
  eventDetails: GTMEventDetail;
  scrollSection: string;
  setActiveTab: Dispatch<SetStateAction<TTabs>>;
}

export const AudienceIntel = ({
  eventDetails,
  scrollSection,
  setActiveTab,
}: Props) => {
  const { audienceSpread } = eventDetails;
  const tabs = [
    { tabName: "Department Type", path: "department" },
    { tabName: "Designation Type", path: "designation" },
  ];

  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  useEffect(() => {
    if (inView) {
      setActiveTab(scrollSection as TTabs);
    }
  }, [inView]);
  // const [activeTab, setActiveTab] = useState<TTabs>("Department Type");
  return (
    <div className={`flex flex-col gap-6 ${scrollSection}`}>
      <Heading heading="Audience Intel" />
      <div className="flex flex-col gap-6">
        <div className="flex gap-6 h-full max-xl:flex-col max-xl:h-full">
          <div className="flex flex-1 flex-col gap-6 h-fit">
            {/* <div className="flex p-3 justify-between items-center gap-8 border border-[var(--neutral-light-color)] rounded-sm">
              <div className="flex items-center gap-2">
                <Text variant="noMargin" fontWeight="medium">
                  Event Reputation Score
                </Text>
              </div>
              <div className="w-16 h-16">
                <CircularProgressBar value={null} />
              </div>
            </div> */}
            <div className="flex flex-col gap-6 border border-[#EBEBEB] rounded-md p-4 h-80 overflow-y-auto scrollbar">
              <Text
                color="primary"
                fontWeight="medium"
                variant="noMargin"
                size="large"
              >
                Audience Spread
              </Text>
              <ul className="h-full">
                {audienceSpread != null ? (
                  Object.entries(audienceSpread).map(([key, value], index) => {
                    const Flag = Flags[value.iso as keyof typeof Flags];
                    return (
                      <li
                        className={`flex items-center justify-between p-3 ${
                          (index + 1) % 2 !== 0
                            ? "bg-[#FAFAFA] border border-[#F2F2F2]"
                            : ""
                        }`}
                        key={key}
                      >
                        <div className="flex items-center gap-4">
                          <Flag className="w-8 h-8" />
                          <Text color="primary" variant="noMargin" size="large">
                            {value.name}
                          </Text>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[var(--primary-color)]">
                            {value.count}
                          </span>
                          <span className="bg-[#FEECF2] border border-[#F9D7E2] text-sm font-medium text-[var(--highlight-text-color)] py-1 px-3 rounded-full">
                            {value.percentage}%
                          </span>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <span className="text-[#666666] text-sm flex items-center gap-2">
                    <CircleSlash width={15} height={15} />
                    No data available
                  </span>
                )}
              </ul>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 border border-[#EBEBEB] rounded-md p-4 h-80">
            {/* <ul className="flex flex-row gap-12 mb-4 sticky z-10 bg-[#ffffff] w-full shadow pt-3">
              {tabs.map((tab) => (
                <li
                  key={tab.tabName}
                  onClick={() => setActiveTab(tab.tabName as TTabs)}
                  className={`relative pb-2 font-semibold cursor-pointer ${
                    activeTab === tab.tabName
                      ? "text-[var(--primary-color)] border-b-2 border-b-[var(--primary-color)]"
                      : "text-[var(--tertiary-text-color)]"
                  }`}
                >
                  {tab.tabName}
                </li>
              ))}
            </ul> */}
            <Text
              color="primary"
              fontWeight="medium"
              variant="noMargin"
              size="large"
            >
              Designation Types
            </Text>
            {/* <div className="flex flex-col gap-4 bg-[#FAFAFA] border border-[#EBEBEB] p-6">
              <Text
                color="primary"
                fontWeight="medium"
                variant="noMargin"
                size="large"
              >
                Most interested Dept
              </Text>
              <div>
                <p className="flex justify-between">
                  <Text
                    fontWeight="medium"
                    color="secondary"
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={Indicator}
                      width={10}
                      height={10}
                      alt="Indicator"
                    />
                    Marketing
                  </Text>
                  <span className="text-[var(--primary-color)] font-medium">
                    125
                  </span>
                </p>
                <Progress value={70} className="h-2" />
              </div>
            </div> */}
            {/* <Text
              color="primary"
              fontWeight="medium"
              variant="noMargin"
              size="large"
            >
              Other departments
            </Text> */}
            {/* <ul className="flex flex-col gap-4 max-h-80 overflow-y-auto scrollbar pr-2">
             &.length > 0 ? (
            .map((designation) => {
                  const randomProgress = Math.floor(Math.random() * 101);
                  return (
                    <li key={designation.id}>
                      <p className="flex justify-between">
                        <Text fontWeight="medium" color="secondary">
                          {designation.name}
                        </Text>
                        <span className="text-[var(--primary-color)] font-medium">
                        125
                      </span>
                      </p>
                      <Progress value={randomProgress} className="h-2" />
                    </li>
                  );
                })
              ) : (
                <span className="text-[#666666] text-sm flex items-center gap-2">
                  <CircleSlash width={15} height={15} />
                  No data available
                </span>
              )}
            </ul> */}
          </div>
        </div>
        <EventParticipants eventDetails={eventDetails} />
      </div>
    </div>
  );
};
