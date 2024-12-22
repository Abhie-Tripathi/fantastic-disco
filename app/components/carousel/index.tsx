"use client";
import React from "react";
import Image from "next/image";
import IntelligentEventTracking from "/public/intelligent_Event_Tracking.png";
import SmartEventDiscovery from "/public/smart_Event_Discovery.png";
import IntelligentNotification from "/public/intelligent_Notification.png";
import DynamicEventTrends from "/public/dynamic_Event_Trends.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
const carousels = [
  {
    title: "Intelligent Event Tracking",
    image: IntelligentEventTracking,
    description:
      "Stay ahead with continuous insights and trends. Monitor your interests with effortless precision.",
  },
  {
    title: "Smart Event Discovery",
    image: SmartEventDiscovery,
    description:
      "Search and visualise events with interactive maps, lists and calendar views.",
  },
  {
    title: "Intelligent Notifications",
    image: IntelligentNotification,
    description:
      "Never miss a beat with real-time alerts. Stay informed with timely notifications.",
  },
  {
    title: "Dynamic Event Trends",
    image: DynamicEventTrends,
    description:
      "Leverage our analytics to understand upcoming events and trends that can impact your business.",
  },
];

const SwiperCarousel = () => {
  return (
    <Swiper
      className="w-full h-full"
      modules={[Pagination, Autoplay]}
      grabCursor={true}
      autoplay={{ delay: 2500 }}
      centeredSlides={true}
      spaceBetween={5}
      slidesPerView="auto"
      pagination={{
        clickable: true,
        el: ".custom-pagination",
      }}
    >
      {carousels.map((carousel) => (
        <SwiperSlide key={carousel.title}>
          <div className="">
            <div className="flex flex-col items-center justify-center p-8">
              <h2 className="text-2xl font-bold mb-4 text-[#6750a4]">
                {carousel.title}
              </h2>
              <Image
                src={carousel.image}
                alt={carousel.title}
                width={460}
                height={380}
                objectFit="cover"
                className="mb-4"
              />
              <p className="w-4/5 text-center break-normal">
                {carousel.description}
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
      <div className="custom-pagination flex justify-center mt-4"></div>
    </Swiper>
  );
};

export default function Carousel() {
  return (
    <div className="hidden lg:flex w-1/2 bg-[#FAFAFF] items-center justify-center">
      <div className="w-full">
        <SwiperCarousel />
      </div>
    </div>
  );
}
