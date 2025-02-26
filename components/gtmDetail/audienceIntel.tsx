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
import { Event, EventParticipantsDetails, TTabs } from "@/types/events";
import { CircularProgressBar } from "../eventDetail/circularProgressBar";
import { useInView } from "react-intersection-observer";
import { Heading } from "../eventDetail/heading";
import { numberWithCommas } from "@/utils/formater";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFilterContext } from "@/context/filterContext";
import Restriction from "../eventDetail/restriction";

// type TTabs = "Department Type" | "Designation Type";
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

  const { estimatedAttendance } = (eventDetails && eventDetails.insights) || {};

  const { estimatedExhibitors } = (eventDetails && eventDetails.advance) || {};

  const parseEstimatedExhibitor = (
    value: string | number | undefined | null
  ) => {
    if (value) {
      if (typeof value === "string" && value.includes("-")) {
        const [minExhibitorValue, maxExhibitorValue] = value
          .split("-")
          .map((v) => Number(v.trim()));
        return { minExhibitorValue, maxExhibitorValue };
      } else {
        return { minExhibitorValue: value, maxExhibitorValue: value };
      }
    }
  };

  const { minExhibitorValue, maxExhibitorValue } = parseEstimatedExhibitor(
    estimatedExhibitors
  ) || { minExhibitorValue: 0, maxExhibitorValue: 0 };

  // const hasEstimatedExhibitor =
  //   estimatedExhibitor &&
  //   estimatedExhibitor.options.find(
  //     (option: { min: number; max: number | null; isEnabled: boolean }) =>
  //       Number(stats.estimatedExhibitor) >= option.min &&
  //       (option.max === null || Number(stats.estimatedExhibitor) <= option.max)
  //   )?.isEnabled === true;

  const hasEstimatedExhibitor =
    estimatedExhibitor &&
    estimatedExhibitor.options.some(
      (option: { min: number; max: number | null; isEnabled: boolean }) =>
        option.isEnabled &&
        Number(minExhibitorValue) >= option.min &&
        (option.max === null || Number(maxExhibitorValue) <= option.max)
    );

  const [minValue, maxValue] = (estimatedAttendance &&
    estimatedAttendance.split("-").map((v) => Number(v.trim()))) || [0, 0];

  const hasEstimatedVisitor =
    estimatedVisitors &&
    minValue &&
    maxValue &&
    estimatedVisitors.options.some(
      (option: { min: number; max: number | null; isEnabled: boolean }) =>
        option.min <= maxValue &&
        (option.max === null || option.max >= minValue) &&
        option.isEnabled
    );

  const isEstimatedExhibitorEnabled =
    estimatedExhibitor && estimatedExhibitor.isEnabled && hasEstimatedExhibitor;
  const isAudienceSpreadEnabled =
    audienceSpreadRestriction && audienceSpreadRestriction.isEnabled;
  const isDesignationEnabled = audienceProfile && audienceProfile.isEnabled;
  const tabs = [
    { tabName: "Department Type", path: "department" },
    { tabName: "Designation Type", path: "designation" },
  ];

  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  useMemo(() => {
    if (inView) {
      setActiveTab(scrollSection as TTabs);
    }
  }, [inView]);
  const getMaxCountObject = (
    designationSpread:
      | NonNullable<Event["audience"]>["designationSpread"]
      | undefined
      | null
  ) => {
    if (!designationSpread || designationSpread.length === 0) return null;

    return designationSpread.reduce((maxObj, currentObj) => {
      return Number(currentObj.count) > Number(maxObj.count)
        ? currentObj
        : maxObj;
    }, designationSpread[0]);
  };
  const maxCountObject = getMaxCountObject(designationSpread);
  // const [activeTab, setActiveTab] = useState<TTabs>("Department Type");
  return (
    <div className={`flex flex-col gap-6`} ref={ref}>
      <Heading
        heading="Audience Intel"
        scrollSection={scrollSection}
        tooltipDescription="Provides insights into exhibitors, speakers, and sponsors."
      />
      <div className="flex flex-col gap-6">
        <div className="flex gap-6">
          <div className="relative flex flex-col bg-[#FAFAFA] dark:bg-transparent dark:border-[var(--border-color)] border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1 className="text-[1rem] font-medium border-b pb-2 w-full cursor-pointer">
                    Estimated Visitor
                  </h1>
                </TooltipTrigger>
                <TooltipContent
                  align="start"
                  alignOffset={-80}
                  className="w-80 tooltip-content-styles"
                >
                  <p className="text-[var(--secondary-text-color)] font-medium">
                    Number of people who are predicted or estimated to attend an
                    event.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className={`text-[#6750A4] font-semibold text-lg `}>
              {estimatedAttendance &&
                (hasEstimatedVisitor ? (
                  numberWithCommas(estimatedAttendance || "--")
                ) : (
                  <Restriction />
                ))}
            </p>
          </div>
          <div className="relative flex flex-col bg-[#FAFAFA] dark:bg-transparent dark:border-[var(--border-color)] border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1 className="text-[1rem] font-medium border-b pb-2 w-full cursor-pointer">
                    Estimated Exhibitor
                  </h1>
                </TooltipTrigger>
                <TooltipContent
                  align="start"
                  alignOffset={-80}
                  className="w-80 tooltip-content-styles"
                >
                  <p className="text-[var(--secondary-text-color)] font-medium">
                    Projected number of exhibitors that will participate in an
                    event
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className={`text-[#6750A4] font-semibold text-lg `}>
              {isEstimatedExhibitorEnabled ? (
                estimatedExhibitors ? (
                  estimatedExhibitors
                ) : (
                  "--"
                )
              ) : (
                <Restriction />
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-6 max-xl:flex-col max-h-full">
          <div className="relative flex flex-1 w-auto h-full">
            <div className="flex flex-1 flex-col gap-6 border border-[#EBEBEB] dark:bg-transparent dark:border-[var(--border-color)] rounded-md p-4 h-auto overflow-y-auto scrollbar w-full">
              <div className="flex justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="cursor-pointer font-medium text-[var(--primary-text-color)]">
                        Audience Spread
                      </p>
                    </TooltipTrigger>
                    <TooltipContent
                      align="start"
                      alignOffset={-80}
                      className="w-80 tooltip-content-styles"
                    >
                      <p className="text-[var(--secondary-text-color)] font-medium">
                        Indicates the geographical diversity of the audience,
                        showing which countries are represented at the event.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {!isAudienceSpreadEnabled && <Restriction />}
              {isAudienceSpreadEnabled && (
                <ul className="h-80">
                  {audienceSpread && Object.keys(audienceSpread).length > 0 ? (
                    Object.entries(audienceSpread).map(
                      ([key, value], index) => {
                        if (value.iso == "UK") value.iso = "GB";
                        const Flag = Flags[value.iso as keyof typeof Flags];
                        return (
                          <li
                            className={`flex items-center justify-between p-3 ${
                              (index + 1) % 2 !== 0
                                ? "bg-[#FAFAFA] dark:bg-[#171717] border border-[#F2F2F2] dark:border-[#1A1A1A]"
                                : ""
                            }`}
                            key={key}
                          >
                            <div className="flex items-center gap-4">
                              <Flag className="w-8 h-8" />{" "}
                              <Text
                                color="primary"
                                variant="noMargin"
                                size="large"
                              >
                                {value.name}
                              </Text>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="bg-[#FEECF2] dark:bg-[#3A1726] border border-[#F9D7E2] dark:border-[#551B33] text-sm font-medium text-[#df2670] py-1 px-3 rounded-full">
                                {value.percentage}%
                              </span>
                            </div>
                          </li>
                        );
                      }
                    )
                  ) : (
                    <span className="text-[#666666] text-sm flex items-center gap-2">
                      <CircleSlash width={15} height={15} />
                      No data available
                    </span>
                  )}
                </ul>
              )}
            </div>
          </div>
          <div className="flex flex-1 w-auto h-full">
            <div className="relative flex flex-1 flex-col gap-6 border border-[#EBEBEB] dark:bg-transparent dark:border-[var(--border-color)] rounded-md p-4 h-auto w-full">
              <div className="flex justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="cursor-pointer font-medium text-[var(--primary-text-color)]">
                        Audience Profile
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="w-72 tooltip-content-styles">
                      <p className="text-[var(--secondary-text-color)] font-medium">
                        Specific roles (designations) and departments of
                        auidence that are going to attend the event
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {designationSpread && designationSpread.length > 0 ? (
                isDesignationEnabled ? (
                  <>
                    <div className="flex flex-col gap-4 bg-[#FAFAFA] dark:bg-[#171717] border border-[#EBEBEB] dark:border-[#2E2E2E] rounded-md p-3">
                      <Text
                        color="primary"
                        fontWeight="medium"
                        variant="noMargin"
                        size="large"
                      >
                        Most interested designation
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
                            {/* {Math.max(...designationSpread.map())} */}
                            {maxCountObject?.designation}
                          </Text>
                          <span className="text-[var(--primary-color)] font-medium">
                            {maxCountObject?.count}
                          </span>
                        </p>
                        <Progress
                          value={maxCountObject?.percentage}
                          className="h-2"
                        />
                      </div>
                    </div>
                    <Text
                      color="primary"
                      fontWeight="medium"
                      variant="noMargin"
                      size="large"
                    >
                      Other designations
                    </Text>
                    <ul className="flex flex-col gap-4 h-64 overflow-y-auto pr-2">
                      {designationSpread.map((designation, index) => (
                        <li
                          key={`designation-${designation.designation}-${index}`}
                        >
                          <p className="flex justify-between">
                            <Text fontWeight="medium" color="secondary">
                              {designation.designation}
                            </Text>
                            <span className="text-[var(--primary-color)] font-medium">
                              {designation.count}
                            </span>
                          </p>
                          <Progress
                            value={designation.percentage}
                            className="h-2"
                          />
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Restriction />
                )
              ) : (
                <span className="text-[#666666] text-sm flex items-center gap-2">
                  <CircleSlash width={15} height={15} />
                  No data available
                </span>
              )}
            </div>
          </div>
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
