"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Visibility from "../../../public/visibility.svg";
import IntelligentEventTracking from "/public/intelligent_Event_Tracking.png";
import SmartEventDiscovery from "/public/smart_Event_Discovery.png";
import IntelligentNotification from "/public/intelligent_Notification.png";
import styles from "./carousel.style.module.css";
import DynamicEventTrends from "/public/dynamic_Event_Trends.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/styles/carausel.css";
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

export default function Carousel() {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="hidden lg:flex w-1/2 bg-[#FAFAFF] items-center justify-center">
      <div>
        <Slider {...settings} className="h-full max-w-[500px] relative">
          {carousels.map((carousel) => (
            <div key={carousel.title} className="">
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
                <p className="text-center">{carousel.description}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
