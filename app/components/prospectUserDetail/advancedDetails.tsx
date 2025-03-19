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
  calculateDateDifference,
  convertToCustomFormat,
} from "@/utils/dateFormat";
import { useEffect, useState } from "react";

interface stats {
  upcomingEvents: number;
  totalEvents: number;
  lastLogin: string;
}
interface Props {
  companyData: {
    attendCount: number;
    speakingCount: number;
  };
}

interface CarouselProp {
  companyData: {
    attendCount: number;
    speakingCount: number;
  };
}

const CarouselComponent = ({ companyData }: CarouselProp) => {
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
        <CarouselContent
          className={`${
            isSlidingEnabled ? "-ml-1" : "-ml-6"
          } max-xl:grid max-xl:grid-cols-2 max-xl:grid-rows-subgrid max-xl:gap-y-6 max-xl:justify-items-centers`}
        >
          {companyData.attendCount > 0 && (
            <CarouselItem className="pl-6 basis-3/12 carousel-item">
              <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
                <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                  Events Attend
                </h1>
                <span className="text-base font-semibold flex items-center gap-2">
                  {companyData.attendCount}
                </span>
              </div>
            </CarouselItem>
          )}

          {companyData.speakingCount > 0 && (
            <CarouselItem className="pl-6 basis-3/12 carousel-item">
              <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
                <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                  Events Speak
                </h1>
                <span className="text-base font-semibold flex items-center gap-2">
                  {companyData.speakingCount}
                </span>
              </div>
            </CarouselItem>
          )}

          {/* <CarouselItem className="pl-6 basis-3/12 carousel-item">
            <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
              <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                Company Type
              </h1>
              <span className="text-[#6750A4] bg-[#E6E6F9] dark:bg-[#2D2541] dark:border-[#8F80D4] h-fit font-semibold text-sm py-1 px-4 border-[#B8B7EA] border rounded-md w-fit">
                Private
              </span>
            </div>
          </CarouselItem> */}

          {/* <CarouselItem className="pl-6 basis-3/12 carousel-item">
            <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
              <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                Followers
              </h1>
              <span className="text-base font-semibold flex items-center gap-2">
                1.8M
              </span>
            </div>
          </CarouselItem> */}

          {/* <CarouselItem className="pl-6 basis-3/12 carousel-item">
            <div className="flex flex-col bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-sm border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-auto h-full">
              <h1 className="text-[1rem] font-medium text-center border-b pb-2 w-full">
                Group
              </h1>
              <span className="text-[#0062D1] dark:bg-[#10233D] dark:border-[#0D3868] bg-[#EBF5FF] h-fit font-semibold text-sm py-1 px-4 border-[#CCE6FF] border rounded-md w-fit">
                FORTUNE
              </span>
            </div>
          </CarouselItem> */}
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

export const AdvancedDetails = ({ companyData }: Props) => {
  return (
    <>
      <div className="flex flex-col gap-6">
        <CarouselComponent companyData={companyData} />
      </div>
    </>
  );
};
