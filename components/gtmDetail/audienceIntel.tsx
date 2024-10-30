"use client";
import { InformationFill } from "geist-icons";
import { EventParticipants } from "./eventParticipants";
import { Progress } from "@/components/ui/progress";
import Indicator from "/public/indicator.svg";
import { CircleSlash } from "lucide-react";
import Text from "../new-ui/Text";
import * as Flags from "country-flag-icons/react/3x2";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Event, TTabs } from "@/types/events";
import { CircularProgressBar } from "../eventDetail/circularProgressBar";
import { useInView } from "react-intersection-observer";
import { Heading } from "../eventDetail/heading";
import { GTMEventDetail } from "@/types/events";
import {
  audienceSpreadDummyData,
  designationsDummyData as designations,
} from "@/data/dummyDataEventDetail";
import { numberWithCommas } from "@/utils/formater";
import { Badge } from "../ui/badge";

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
  const { audienceSpread, stats, designation } = eventDetails;
  const tabs = [
    { tabName: "Department Type", path: "department" },
    { tabName: "Designation Type", path: "designation" },
  ];

  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  useMemo(() => {
    if (inView) {
      setActiveTab(scrollSection as TTabs);
    }
  }, [inView]);
  // const [activeTab, setActiveTab] = useState<TTabs>("Department Type");
  return (
    <div className={`flex flex-col gap-6`} ref={ref}>
      <Heading heading="Audience Intel" scrollSection={scrollSection} />
      <div className="flex flex-col gap-6">
        <div className="flex gap-6">
          <div className="flex flex-col bg-[#FAFAFA] border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
            <h1 className="text-[1rem] font-medium border-b pb-2 w-full">
              Estimated Visitor
            </h1>
            <p className="text-[#6750A4] font-semibold text-lg">
              {stats.estimatedVisitor
                ? numberWithCommas(stats.estimatedVisitor ?? "")
                : "--"}
            </p>
          </div>
          <div className="flex flex-col bg-[#FAFAFA] border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
            <h1 className="text-[1rem] font-medium border-b pb-2 w-full">
              Estimated Exhibitor
            </h1>
            <p className="text-[#6750A4] font-semibold text-lg">
              {stats.estimatedExhibitor
                ? stats.estimatedExhibitor ?? "--"
                : "--"}
            </p>
          </div>
        </div>
        <div className="flex gap-6 h-full max-xl:flex-col max-xl:h-full">
          <div className="flex flex-col gap-6 border border-[#EBEBEB] rounded-md p-4 h-80 overflow-y-auto scrollbar w-full">
            <div className="flex justify-between">
              <Text
                color="primary"
                fontWeight="medium"
                variant="noMargin"
                size="large"
              >
                Audience Spread
              </Text>
              {!audienceSpread && (
                <Badge
                  variant={"outline"}
                  className="rounded-full bg-[#fff0f0] text-[#e5484d] shadow-none border-none h-fit"
                >
                  Demo
                </Badge>
              )}
            </div>

            <ul className="h-full">
              {audienceSpread && Object.keys(audienceSpread).length > 0 ? (
                Object.entries(audienceSpread).map(([key, value], index) => {
                  const Flag = Flags[value.iso as keyof typeof Flags]; // Ensure that value.iso exists and is a valid key in Flags
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
                        {Flag && <Flag className="w-8 h-8" />}{" "}
                        {/* Ensure Flag exists before rendering */}
                        <Text color="primary" variant="noMargin" size="large">
                          {value.name}
                        </Text>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[var(--primary-color)]">
                          {value.count}
                        </span>
                        <span className="bg-[#FEECF2] border border-[#F9D7E2] text-sm font-medium text-[#df2670] py-1 px-3 rounded-full">
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

          <div className="flex flex-col gap-6 border border-[#EBEBEB] rounded-md p-4 h-80 w-full">
            <div className="flex justify-between">
              <Text
                color="primary"
                fontWeight="medium"
                variant="noMargin"
                size="large"
              >
                Designation Types
              </Text>

              {!designation && (
                <Badge
                  variant={"outline"}
                  className="rounded-full bg-[#fff0f0] text-[#e5484d] shadow-none border-none"
                >
                  Demo
                </Badge>
              )}
            </div>

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
            <ul className="flex flex-col gap-4 max-h-80 overflow-y-auto scrollbar pr-2">
              {designation && designation.length > 0 ? (
                designation.map((item, index) => (
                  <li key={`designation-${item}-${index}`}>
                    <p className="flex justify-between">
                      <Text fontWeight="medium" color="secondary">
                        {item}
                      </Text>
                    </p>
                    <Progress value={100 - (index + 1) * 5} className="h-2" />
                  </li>
                ))
              ) : (
                <span className="text-[#666666] text-sm flex items-center gap-2">
                  <CircleSlash width={15} height={15} />
                  No data available
                </span>
              )}
            </ul>
          </div>
        </div>
        <EventParticipants eventDetails={eventDetails} />
      </div>
    </div>
  );
};
