"use client";
import "swiper/css";
import "swiper/css/navigation";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import clientLogo1 from "@/public/10timeslogotwo.png";
import clientLogo2 from "@/public/googlelogo.png";
import Image from "next/image";

const CarouselComponent = () => {
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
          <CarouselItem className="h-24 pl-6 basis-3/12 carousel-item">
            <div className="flex flex-col justify-center bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-md border border-[var(--neutral-light-color)] p-4 rounded-lg gap-4 w-auto h-full">
              <Image src={clientLogo1} width={40} alt="logo" />
            </div>
          </CarouselItem>

          <CarouselItem className="pl-6 basis-3/12 carousel-item">
            <div className="flex flex-col justify-center bg-white dark:bg-transparent dark:border-[var(--border-color)] items-center shadow-md border border-[var(--neutral-light-color)] p-4 rounded-lg gap-4 w-auto h-full">
              <Image src={clientLogo2} width={40} alt="logo" />
            </div>
          </CarouselItem>

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

export const CompanyClients = () => {
  return (
    <div className="flex flex-col gap-6">
      <CarouselComponent />
    </div>
  );
};
