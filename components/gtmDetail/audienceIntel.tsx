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
import {
  DesignationSpread,
  Event,
  EventExhibitorDetails,
  EventParticipantsDetails,
  TTabs,
} from "@/types/events";
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
import { useFilterContext } from "@/context/filterContext";
import Restriction from "../eventDetail/restriction";

// type TTabs = "Department Type" | "Designation Type";
interface Props {
  eventDetails: GTMEventDetail;
  eventExhibitorData: EventParticipantsDetails[];
  eventSpeakerData: EventParticipantsDetails[];
  scrollSection: string;
  setActiveTab: Dispatch<SetStateAction<TTabs>>;
}

export const AudienceIntel = ({
  eventDetails,
  eventExhibitorData,
  eventSpeakerData,
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

  const { audienceSpread, stats, designation, designationSpread } =
    eventDetails;

  const hasEstimatedExhibitor =
    estimatedExhibitor &&
    estimatedExhibitor.options.find(
      (option: { min: number; max: number | null; isEnabled: boolean }) =>
        Number(stats.estimatedExhibitor) >= option.min &&
        (option.max === null || Number(stats.estimatedExhibitor) <= option.max)
    )?.isEnabled === true;

  const [minValue, maxValue] = stats.estimatedVisitor
    .split("-")
    .map((v) => Number(v.trim()));

  const hasEstimatedVisitor =
    estimatedVisitors &&
    estimatedVisitors.options.some(
      (option: { min: number; max: number | null; isEnabled: boolean }) =>
        option.min === minValue &&
        (option.max === null || option.max === maxValue) &&
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
    threshold: 0.5,
    triggerOnce: false,
  });
  useMemo(() => {
    if (inView) {
      setActiveTab(scrollSection as TTabs);
    }
  }, [inView]);
  const getMaxCountObject = (designationSpread: DesignationSpread[]) => {
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
      <Heading heading="Audience Intel" scrollSection={scrollSection} />
      <div className="flex flex-col gap-6">
        <div className="flex gap-6">
          <div className="relative flex flex-col bg-[#FAFAFA] dark:bg-transparent dark:border-[var(--border-color)] border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
            <h1 className="text-[1rem] font-medium border-b pb-2 w-full">
              Estimated Visitor
            </h1>
            <p
              className={`text-[#6750A4] font-semibold text-lg ${
                hasEstimatedVisitor ? "opacity-100" : "opacity-0"
              }`}
            >
              {hasEstimatedVisitor && stats.estimatedVisitor
                ? numberWithCommas(stats.estimatedVisitor || "--")
                : "--"}
            </p>
            {!hasEstimatedVisitor && <Restriction className="-right-3" />}
          </div>
          <div className="relative flex flex-col bg-[#FAFAFA] dark:bg-transparent dark:border-[var(--border-color)] border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
            <h1 className="text-[1rem] font-medium border-b pb-2 w-full">
              Estimated Exhibitor
            </h1>
            <p
              className={`text-[#6750A4] font-semibold text-lg ${
                isEstimatedExhibitorEnabled ? "opacity-100" : "opacity-0"
              }`}
            >
              {isEstimatedExhibitorEnabled && stats.estimatedExhibitor
                ? stats.estimatedExhibitor ?? "--"
                : "--"}
            </p>
            {!isEstimatedExhibitorEnabled && (
              <Restriction className="-right-3" />
            )}
          </div>
        </div>
        <div className="flex gap-6 max-xl:flex-col max-h-full">
          <div className="relative flex flex-1 w-auto h-full">
            <div className="flex flex-1 flex-col gap-6 border border-[#EBEBEB] dark:bg-transparent dark:border-[var(--border-color)] rounded-md p-4 h-auto overflow-y-auto scrollbar w-full">
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
              {!isAudienceSpreadEnabled && <Restriction className="-right-3" />}
              <ul className="h-80">
                {audienceSpread && Object.keys(audienceSpread).length > 0 ? (
                  Object.entries(audienceSpread).map(([key, value], index) => {
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
                          {isAudienceSpreadEnabled && Flag && (
                            <Flag className="w-8 h-8" />
                          )}{" "}
                          {/* Ensure Flag exists before rendering */}
                          <Text color="primary" variant="noMargin" size="large">
                            {isAudienceSpreadEnabled && value.name}
                          </Text>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[var(--primary-color)]">
                            {isAudienceSpreadEnabled && value.count}
                          </span>
                          <span className="bg-[#FEECF2] dark:bg-[#3A1726] border border-[#F9D7E2] dark:border-[#551B33] text-sm font-medium text-[#df2670] py-1 px-3 rounded-full">
                            {isAudienceSpreadEnabled && value.percentage}%
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
          <div className="flex flex-1 w-auto h-full">
            <div className="relative flex flex-1 flex-col gap-6 border border-[#EBEBEB] dark:bg-transparent dark:border-[var(--border-color)] rounded-md p-4 h-auto w-full">
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
              {designationSpread && designationSpread.length > 0 && (
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
                        {isDesignationEnabled && maxCountObject?.designation}
                      </Text>
                      <span className="text-[var(--primary-color)] font-medium">
                        {isDesignationEnabled ? maxCountObject?.count : 0}
                      </span>
                    </p>
                    <Progress
                      value={
                        isDesignationEnabled ? maxCountObject?.percentage : 0
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              )}
              <Text
                color="primary"
                fontWeight="medium"
                variant="noMargin"
                size="large"
              >
                Other designations
              </Text>
              <ul className="flex flex-col gap-4 h-64 overflow-y-auto pr-2">
                {designationSpread && designationSpread.length > 0 ? (
                  designationSpread.map((designation, index) => (
                    <li key={`designation-${designation.designation}-${index}`}>
                      <p className="flex justify-between">
                        <Text fontWeight="medium" color="secondary">
                          {isDesignationEnabled && designation.designation}
                        </Text>
                        <span className="text-[var(--primary-color)] font-medium">
                          {isDesignationEnabled ? designation.count : 0}
                        </span>
                      </p>
                      <Progress
                        value={
                          isDesignationEnabled ? designation.percentage : 0
                        }
                        className="h-2"
                      />
                    </li>
                  ))
                ) : (
                  <span className="text-[#666666] text-sm flex items-center gap-2">
                    <CircleSlash width={15} height={15} />
                    No data available
                  </span>
                )}
              </ul>
              {!isDesignationEnabled && <Restriction className="-right-3" />}
            </div>
          </div>
        </div>
        <EventParticipants
          eventDetails={eventDetails}
          eventExhibitorData={eventExhibitorData}
          eventSpeakerData={eventSpeakerData}
        />
      </div>
    </div>
  );
};
