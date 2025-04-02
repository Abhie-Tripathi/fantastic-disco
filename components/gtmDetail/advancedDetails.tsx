"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFilterContext } from "@/context/filterContext";
import { Event, EventEditionDetailResponse } from "@/types/events";
import { format } from "date-fns";
import { capitalize } from "lodash";
import { CircleSlash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Heading } from "../eventDetail/heading";
import DetailDialog from "../eventDetail/modal";
import PastEditions from "../eventDetail/pastEditions";
import Restriction from "../eventDetail/restriction";

interface Props {
  eventDetails: Event["advance"];
  eventEditionData: EventEditionDetailResponse;
  eventId: string;
}

const CarouselComponent = ({
  morphedData,
  eventDetails,
  eventEditionData,
  eventId,
}: {
  morphedData: any;
  eventDetails: Event["advance"];
  eventEditionData: EventEditionDetailResponse;
  eventId: string;
}) => {
  const { maturity, frequency, isBranded, isSeries, rehostDate } =
    eventDetails || {};
  const { maturityLevels, frequencies, forcastedStatus, globalAndTourings } =
    morphedData;
  const { count, editions } = eventEditionData;
  const [api, setApi] = useState<CarouselApi>();
  const [isSlidingEnabled, setIsSlidingEnabled] = useState<boolean>();

  const isFutureForecastedDate = useMemo(() => {
    if (rehostDate) {
      const forecastDate = new Date(rehostDate);
      const today = new Date();
      return forecastDate > today;
    }
    return false;
  }, [rehostDate]);

  const hasMaturityOption =
    maturityLevels &&
    maturityLevels.options.find(
      (option: { id: string }) => option.id === maturity
    );

  const hasFrequencyOption =
    frequencies &&
    frequencies.options.find(
      (option: { id: string }) => option.id === frequency?.toLocaleLowerCase()
    );

  const hasSeriesEvent =
    globalAndTourings &&
    globalAndTourings.options.find(
      (option: { label: string }) => option.label === "Series"
    ).isEnabled === isSeries;

  const hasBrandedEvent =
    globalAndTourings &&
    globalAndTourings.options.find(
      (option: { label: string }) => option.label === "Branded"
    ).isEnabled === isBranded;

  const isBrandEnabled =
    globalAndTourings &&
    globalAndTourings.isEnabled &&
    (hasBrandedEvent || hasSeriesEvent);

  const isMaturityEnabled =
    maturityLevels &&
    maturityLevels.isEnabled &&
    hasMaturityOption &&
    hasMaturityOption.isEnabled;

  const isFrequencyEnabled =
    frequencies &&
    frequencies.isEnabled &&
    hasFrequencyOption &&
    hasFrequencyOption.isEnabled;

  const isForecastedEnabled = forcastedStatus && forcastedStatus.isEnabled;

  useEffect(() => {
    if (!api) {
      return;
    }
    setIsSlidingEnabled(api.canScrollNext() || api.canScrollPrev());
  }, [api]);
  return (
    <div className="flex justify-center px-3">
      <Carousel
        className={`${
          isSlidingEnabled ? "w-3/5 sm:w-3/4 md:w-[85%] xl:w-11/12" : "w-full"
        }`}
        setApi={setApi}
      >
        <CarouselContent
          className={`pt-6 pr-0 ${
            isSlidingEnabled
              ? "-ml-1 md:w-full"
              : "-ml-6 max-xl:grid max-xl:grid-cols-2 max-xl:grid-rows-subgrid max-xl:gap-y-6 max-xl:justify-items-centers"
          }`}
        >
          {maturity && (
            <CarouselItem className="pl-6 basis-3/12 carousel-item">
              <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full cursor-pointer">
                        Maturity
                      </h1>
                    </TooltipTrigger>
                    <TooltipContent
                      align="start"
                      alignOffset={-10}
                      className="w-52 tooltip-content-styles"
                      side="top"
                    >
                      <p className="text-[var(--secondary-text-color)] font-medium">
                        Lifecycle stage of an event, based on how often it has
                        occurred
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {isMaturityEnabled ? (
                  maturity ? (
                    <span className="text-[#0062D1] dark:bg-[#10233D] dark:border-[#0D3868] bg-[#EBF5FF] flex items-center justify-center h-7 font-semibold text-sm py-1 px-4 border-[#CCE6FF] border rounded-md w-24 text-center">
                      {maturity.charAt(0).toUpperCase() +
                        maturity.slice(1, maturity.length)}
                    </span>
                  ) : (
                    <span className="text-[#666666] text-sm flex items-center gap-2">
                      <CircleSlash width={15} height={15} />
                      No data available
                    </span>
                  )
                ) : (
                  <Restriction />
                )}
              </div>
            </CarouselItem>
          )}
          {editions && (
            <CarouselItem
              className={`relative ${
                isSlidingEnabled
                  ? "px-4 sm:basis-3/5 md:basis-1/2 lg:basis-1/3"
                  : "pl-6 basis-3/12"
              }  carousel-item`}
            >
              <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full cursor-pointer">
                        Edition
                      </h1>
                    </TooltipTrigger>
                    <TooltipContent
                      align="center"
                      alignOffset={-70}
                      className="w-80 tooltip-content-styles"
                      side="top"
                      avoidCollisions={true}
                      collisionPadding={{ right: 30 }}
                    >
                      <p className="text-[var(--secondary-text-color)] font-medium">
                        Specific occurrence or iteration of a recurring event,
                        often distinguished by its year, version, or any changes
                        made to the event&apos;s details.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {editions && (
                  <DetailDialog
                    titleColor="text-[var(--primary-text-color)]"
                    title={"No. of Editions"}
                    triggerText={`${count} Edition${count || 0 > 1 ? "s" : ""}`}
                    className="text-[#6750A4] bg-[#E6E6F9] dark:bg-[#2D2541] dark:border-[#8F80D4] flex items-center justify-center h-fit font-semibold text-sm py-1 px-4 border-[#B8B7EA] border rounded-md w-fit text-center cursor-pointer"
                  >
                    <PastEditions eventId={eventId} />
                  </DetailDialog>
                )}
              </div>
            </CarouselItem>
          )}
          {frequency && (
            <CarouselItem
              className={`relative ${
                isSlidingEnabled
                  ? "px-4 sm:basis-3/5 md:basis-1/2 lg:basis-1/3"
                  : "pl-6 basis-3/12"
              }  carousel-item`}
            >
              <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full cursor-pointer">
                        Frequency
                      </h1>
                    </TooltipTrigger>
                    <TooltipContent
                      align="start"
                      alignOffset={-10}
                      className="w-52 tooltip-content-styles"
                      side="top"
                    >
                      <p className="text-[var(--secondary-text-color)] font-medium">
                        Recurring pattern or interval at which an event takes
                        place
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex gap-4 flex-wrap">
                  {isFrequencyEnabled ? (
                    frequency ? (
                      <span className="text-[#A35200] bg-[#FFF4D6] dark:bg-[#331B00] dark:border-[#4D2A00] flex items-center justify-center h-7 font-semibold text-sm py-1 px-4 border border-[#FEF0CD] rounded-md w-28 text-center">
                        {capitalize(frequency)}
                      </span>
                    ) : (
                      <span className="text-[#666666] text-sm flex items-center gap-2">
                        <CircleSlash width={15} height={15} />
                        No data available
                      </span>
                    )
                  ) : (
                    <Restriction />
                  )}
                </div>
              </div>
            </CarouselItem>
          )}
          {rehostDate && isFutureForecastedDate && (
            <CarouselItem
              className={`relative ${
                isSlidingEnabled
                  ? "px-4 sm:basis-3/5 md:basis-1/2 lg:basis-1/3"
                  : "pl-6 basis-3/12"
              }  carousel-item`}
            >
              <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full cursor-pointer">
                        Forecasted
                      </h1>
                    </TooltipTrigger>
                    <TooltipContent
                      className="w-60 tooltip-content-styles"
                      side="top"
                    >
                      <p className="text-[var(--secondary-text-color)] font-medium">
                        Predicted timeline for when an event is expected to take
                        place, based on available data and historical patterns.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {isForecastedEnabled ? (
                  <span className="text-[var(--primary-color-hover)] font-semibold text-md text-center">
                    {format(rehostDate || "", "MMM, yyyy")}
                  </span>
                ) : (
                  <Restriction />
                )}
              </div>
            </CarouselItem>
          )}
          {(isBranded || isSeries) && (
            <CarouselItem className="pl-6 basis-3/12 carousel-item">
              <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full cursor-pointer">
                        Brand
                      </h1>
                    </TooltipTrigger>
                    <TooltipContent
                      align="center"
                      avoidCollisions={true}
                      collisionPadding={{ right: 30 }}
                      className="w-72 tooltip-content-styles"
                      side="top"
                    >
                      <p className="text-[var(--secondary-text-color)] font-medium">
                        Brand categorizes events as recurring in multiple
                        locations (Branded) or different locations each time
                        (Series).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {!isBranded && !isSeries && (
                  <span className="text-[#666666] text-sm flex items-center gap-2">
                    <CircleSlash width={15} height={15} />
                    No data available
                  </span>
                )}
                {isBrandEnabled ? (
                  <>
                    {isBranded && (
                      <span
                        className={`text-sm font-semibold py-1 px-3 border-[#F9D7E2] border rounded-sm w-32 ${
                          isBrandEnabled ? "" : "h-7"
                        } text-[#DF2670] bg-[#FEECF2] dark:bg-[#3A1726] dark:border-[#551B33] text-center`}
                      >
                        {isBrandEnabled && "Branded Event"}
                      </span>
                    )}
                    {isSeries && (
                      <span
                        className={`text-sm font-semibold py-1 px-3 border-[#BEF4EB] border rounded-sm w-32${
                          isBrandEnabled ? "" : "h-7"
                        } text-[#0D8C7D] bg-[#E5FAF6] dark:bg-[#062822] dark:border-[#0D8C7D] text-center`}
                      >
                        {isBrandEnabled && " Series Event"}
                      </span>
                    )}
                  </>
                ) : (
                  <Restriction />
                )}
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        {isSlidingEnabled && (
          <>
            <CarouselPrevious className="bg-[#F2F2F2] rounded-full border-[var(--neutral-light-color)] dark:bg-transparent dark:border-2 dark:border-[var(--border-color)] w-8 h-8  my-[0.8rem]" />
            <CarouselNext className="bg-[#F2F2F2] rounded-full border-[var(--neutral-light-color)] dark:bg-transparent dark:border-2 dark:border-[var(--border-color)] w-8 h-8 my-[0.8rem]" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export const AdvancedDetails = ({
  eventDetails,
  eventEditionData,
  eventId,
}: Props) => {
  const { morphedData } = useFilterContext();
  const { maturity, editions, frequency, isBranded, isSeries, rehostDate } =
    eventDetails || {};
  return (
    (maturity ||
      editions ||
      frequency ||
      isBranded ||
      isSeries ||
      rehostDate) && (
      <div className="flex flex-col">
        <Heading
          heading="Advanced Details"
          tooltipDescription="Highlights the event's maturity and history, such as its stage and editions held."
        />
        <CarouselComponent
          morphedData={morphedData}
          eventDetails={eventDetails}
          eventId={eventId}
          eventEditionData={eventEditionData}
        />
      </div>
    )
  );
};
