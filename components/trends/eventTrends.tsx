"use client";

import LineChart from "@/components/eventTrends/chart/LineChart";
import Text from "../new-ui/Text";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../new-ui/Popover";
import Image from "next/image";
import CategoryInput from "@/components/search/categorySelector";
import DownArrow from "/public/arrow_drop_down.svg";
import styles from "@/app/(main)/trends/trends.module.css";
import TrendInput from "../eventTrends/Dropdowns/Trends";
import { Ttrends } from "@/types/trends";
import { format, parseISO } from "date-fns";
import { Event } from "@/types/events";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { aggregateAttendanceData } from "@/utils/lineChart";
import React from "react";

const Card = ({
  event,
  selectedTrends,
}: {
  event: Event;
  selectedTrends: string;
}) => {
  const {
    name,
    startDateTime,
    endDateTime,
    estimatedAttendance,
    scores,
    economicImpact,
    eventTypes,
    categories,
  } = event;
  if (!scores) return null;
  const { impactScore } = scores;

  return (
    <li className="rounded flex flex-col px-6 py-3 bg-primary-foreground shadow-md border justify-between min-h-[130px] gap-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col flex-0.6 gap-2 w-[28rem] max-[1760px]:w-[25rem] justify-center">
          <Text size="xl" fontWeight="bold">
            {name}
          </Text>
          <Text size="normal" color="secondary">
            {`${format(parseISO(startDateTime), "EEE, dd MMM yyyy")} - ${format(
              parseISO(endDateTime),
              "EEE, dd MMM yyyy"
            )}`}
          </Text>
        </div>
        <div className="flex flex-col flex-0.4 justify-center gap-2 items-center">
          {selectedTrends === "Predicted Attendance" ||
          selectedTrends === "Predicted Spend" ? (
            <p className="text-[var(--primary-color)] font-bold text-lg]">
              {selectedTrends === "Predicted Attendance"
                ? estimatedAttendance
                : selectedTrends === "Predicted Spend"
                ? economicImpact
                : ""}
            </p>
          ) : selectedTrends === "Event Count" ? (
            <div className="w-[4rem] h-[4rem]">
              <CircularProgressbar
                value={impactScore}
                text={`${impactScore}`}
                styles={{
                  path: {
                    stroke: `rgb(103, 80, 164, 1)`,
                    // strokeWidth: 8
                  },
                  text: {
                    fontWeight: "bolder",
                    fill: "#000",
                    fontSize: "25px",
                    dominantBaseline: "central", // Vertically centers the text
                    textAnchor: "middle", // Horizontally centers the text
                  },
                }}
              />
            </div>
          ) : null}
          {/* <p className="text-[var(--primary-color)] font-bold text-lg]">{estimatedAttendance}</p> */}
          <Text size="small" className="max-[1760px]:text-center">
            {selectedTrends === "Event Count"
              ? "Event Impact Score"
              : selectedTrends}
          </Text>
        </div>
      </div>
      <div className="flex flex-row">
        <ul className="pr-2 border-r-2 flex flex-row h-fit">
          {eventTypes.map((event) => (
            <li
              className="text-[12px] py-1 px-2 border-[#CCE6FF] border rounded-full w-fit text-[#0062d1] bg-[#EBF5FF]"
              key={event.id}
            >
              {event.name}
            </li>
          ))}
        </ul>
        <ul className="ml-2 flex flex-row gap-2 flex-wrap">
          {categories &&
            categories.length > 0 &&
            categories.slice(0, 3).map((category) => (
              <li
                className="text-[#171717] text-[12px] py-1 px-2 border-[#C9C9C9] border rounded-full w-fit"
                key={category.id}
              >
                {category.name}
              </li>
            ))}
        </ul>
      </div>
    </li>
  );
};

interface IEventTrendsProps {
  loading: boolean;
  selectedTrends: Ttrends;
  predictedData: any;
  eventData: Event[] | undefined;
  startingDate: string;
  endingDate: string;
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  setSelectedTrends: Dispatch<SetStateAction<Ttrends>>;
}

const EventTrends = ({
  loading,
  predictedData,
  selectedTrends,
  setSelectedTrends,
  selectedCategories,
  setSelectedCategories,
  eventData,
  startingDate,
  endingDate,
}: IEventTrendsProps) => {
  const [filteredData, setFilteredData] = useState<any>([]);
  const [totalAttendance, setTotalAttendance] = useState<number>(0);

  useEffect(() => {
    const aggregatedData = aggregateAttendanceData(
      predictedData,
      startingDate,
      endingDate
    );
    setFilteredData(aggregatedData);
    predictedData && setTotalAttendance(predictedData.total);
  }, [predictedData]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-start gap-5">
        <Popover>
          <PopoverTrigger className="relative w-[268px]">
            <div className={styles.dropdown_title}>Categories</div>
            <div className={styles.dropdown_container}>
              <div className={styles.dropdown_value}>
                {selectedCategories.length == 11 ? (
                  <>
                    All
                    <span className={styles.dropdown_value_stats}>11</span>
                  </>
                ) : selectedCategories.length > 2 ? (
                  `${selectedCategories.slice(0, 2).join(",")}...`
                ) : selectedCategories.length == 0 ? (
                  "Select"
                ) : (
                  selectedCategories.join(",")
                )}
              </div>
              <Image src={DownArrow} alt="downarrow" />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <CategoryInput />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger className="relative w-[268px]">
            <div className={styles.dropdown_title}>Trend</div>
            <div className={styles.dropdown_container}>
              <div className={styles.dropdown_value}>{selectedTrends}</div>
              <Image src={DownArrow} alt="downarrow" />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <TrendInput
              // className={styles.dropdown}
              state={selectedTrends}
              setState={setSelectedTrends}
            />
          </PopoverContent>
        </Popover>
      </div>
      {loading ? (
        // <div className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3">
        <div className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3 absolute inset-0">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div className="flex gap-8">
          <div className="shadow-md  flex-[0.6] rounded w-[90rem]">
            <LineChart
              selectedTrends={selectedTrends}
              predictedAttendance={filteredData}
              totalAttendance={totalAttendance}
            />
          </div>
          <div className="flex flex-col flex-[0.4] rounded bg-[#FAFAFA] border border-[#EBEBEB] p-6 gap-4">
            <h2 className="text-[1rem]">
              <span className="text-primary">Top Events</span>
            </h2>
            <ul className="flex flex-col gap-4">
              {eventData !== undefined
                ? eventData
                    .slice(0, 3)
                    .map((event) => (
                      <Card
                        key={event.id}
                        event={event}
                        selectedTrends={selectedTrends}
                      />
                    ))
                : null}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTrends;
