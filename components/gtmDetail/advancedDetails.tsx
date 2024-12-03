"use client";
import { InformationFill } from "geist-icons";
import {
  ChevronLeftCircle,
  CircleChevronLeft,
  CircleChevronRight,
  CircleSlash,
} from "lucide-react";
import DetailDialog from "../eventDetail/modal";
import PastEditions from "../eventDetail/pastEditions";
import { capitalize } from "lodash";
import { Event, EventEditionDetailResponse } from "@/types/events";
import { Heading } from "../eventDetail/heading";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { format } from "date-fns";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import { GTMEventDetail } from "@/types/events";
import { renderFormattedDates } from "@/utils/dateFormat";

interface Props {
  eventDetails: GTMEventDetail;
  eventEditionData: EventEditionDetailResponse;
  eventId: string;
}

const CarouselComponent = ({
  eventDetails,
  eventEditionData,
  eventId,
}: {
  eventDetails: GTMEventDetail;
  eventEditionData: EventEditionDetailResponse;
  eventId: string;
}) => {
  const {
    maturity,
    frequency,
    isBranded,
    isSeries,
    rehostDate,
    futureExpectedEndDate,
    futureExpectedStartDate,
  } = eventDetails;
  const { count, editions } = eventEditionData;
  const [api, setApi] = useState<CarouselApi>();
  const [isSlidingEnabled, setIsSlidingEnabled] = useState<boolean>();
  useEffect(() => {
    if (!api) {
      return;
    }
    setIsSlidingEnabled(api.canScrollNext() && api.canScrollPrev());
  }, [api]);
  return (
    <div className="flex justify-center">
      <Carousel
        className={`${isSlidingEnabled ? "w-11/12" : "w-full"}`}
        setApi={setApi}
      >
        <CarouselContent className="-ml-1">
          {maturity && (
            <CarouselItem className="pl-6 basis-3/12 carousel-item">
              <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
                <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                  Maturity
                </h1>
                {maturity ? (
                  <span className="text-[#0062D1] dark:bg-[#10233D] dark:border-[#0D3868] bg-[#EBF5FF] h-fit font-semibold text-sm py-1 px-4 border-[#CCE6FF] border rounded-md w-fit">
                    {maturity.charAt(0).toUpperCase() +
                      maturity.slice(1, maturity.length)}
                  </span>
                ) : (
                  <span className="text-[#666666] text-sm flex items-center gap-2">
                    <CircleSlash width={15} height={15} />
                    No data available
                  </span>
                )}
              </div>
            </CarouselItem>
          )}
          {editions && (
            <CarouselItem className="pl-6 basis-3/12 carousel-item">
              <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
                <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                  Edition
                </h1>
                {editions && (
                  // <span className="text-[#6750A4] bg-[#E6E6F9] h-fit font-semibold text-sm py-1 px-4 border-[#B8B7EA] border rounded-md w-fit cursor-not-allowed">
                  //   {`${editions} Edition${
                  //     editions && editions > 1 ? "s" : ""
                  //   }`}
                  // </span>
                  <DetailDialog
                    titleColor="text-[var(--primary-text-color)]"
                    title={"No. of Editions"}
                    triggerText={`${count} Edition${count > 1 ? "s" : ""}`}
                    className="text-[#6750A4] bg-[#E6E6F9] dark:bg-[#2D2541] dark:border-[#8F80D4] h-fit font-semibold text-sm py-1 px-4 border-[#B8B7EA] border rounded-md w-fit cursor-pointer"
                  >
                    <PastEditions
                      eventId={eventId}
                      eventEditionData={eventEditionData}
                    />
                  </DetailDialog>
                )}
              </div>
            </CarouselItem>
          )}
          {frequency && (
            <CarouselItem className="pl-6 basis-3/12 carousel-item">
              <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
                <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                  Frequency
                </h1>
                <div className="flex gap-4 flex-wrap">
                  {frequency ? (
                    <span className="text-[#A35200] bg-[#FFF4D6] dark:bg-[#331B00] dark:border-[#4D2A00] h-fit font-semibold text-sm py-1 px-4 border border-[#FEF0CD]  rounded-md w-fit cursor-pointer">
                      {capitalize(frequency)}
                    </span>
                  ) : (
                    <span className="text-[#666666] text-sm flex items-center gap-2">
                      <CircleSlash width={15} height={15} />
                      No data available
                    </span>
                  )}
                </div>
              </div>
            </CarouselItem>
          )}
          {(futureExpectedStartDate || futureExpectedEndDate) && (
            <CarouselItem className="pl-6 basis-3/12 carousel-item">
              <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
                <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                  Rehost Month
                </h1>
                <span className="text-[var(--primary-color-hover)] font-semibold text-md">
                  {format(futureExpectedStartDate, "MMM, yyyy")}
                </span>
              </div>
            </CarouselItem>
          )}
          {(isBranded || isSeries) && (
            <CarouselItem className="pl-6 basis-3/12 carousel-item">
              <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
                <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                  Brand
                </h1>
                {!isBranded && !isSeries && (
                  <span className="text-[#666666] text-sm flex items-center gap-2">
                    <CircleSlash width={15} height={15} />
                    No data available
                  </span>
                )}
                {isBranded && (
                  <span className="text-sm font-semibold py-1 px-3 border-[#F9D7E2] border rounded-sm w-fit text-[#DF2670] bg-[#FEECF2] dark:bg-[#3A1726] dark:border-[#551B33]">
                    Branded Event
                  </span>
                )}
                {isSeries && (
                  <span className="text-sm font-semibold py-1 px-3 border-[#BEF4EB] border rounded-sm w-fit text-[#0D8C7D] bg-[#E5FAF6] dark:bg-[#062822] dark:border-[#0D8C7D]">
                    Series Event
                  </span>
                )}
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        {isSlidingEnabled && (
          <>
            <CarouselPrevious className="bg-[#F2F2F2] rounded-full border-[var(--neutral-light-color)] dark:bg-transparent dark:border-2 dark:border-[var(--border-color)] w-8 h-w-8  my-[0.8rem]" />
            <CarouselNext className="bg-[#F2F2F2] rounded-full border-[var(--neutral-light-color)] dark:bg-transparent dark:border-2 dark:border-[var(--border-color)] w-8 h-w-8 my-[0.8rem]" />
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
  return (
    <div className="flex flex-col gap-6">
      <Heading heading="Advanced Details" />
      <CarouselComponent
        eventDetails={eventDetails}
        eventId={eventId}
        eventEditionData={eventEditionData}
      />
    </div>
  );
};
