"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import Text from "../new-ui/Text";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { useRef, useState } from "react";
import { Event, GTMEventDetail } from "@/types/events";
import { RankingDetail } from "./insightsAndScores";
import { formatDate } from "date-fns";
import Link from "next/link";

interface EventRank {
  id?: string;
  categoryId?: string;
  countryId?: string;
  country?: string;
  category?: string;
  rank: string;
}

export const EventRank = ({
  rankings,
  eventDetails,
}: {
  rankings: RankingDetail;
  eventDetails: GTMEventDetail;
}) => {
  const { categories, venueLocation, rankData } = eventDetails;
  const swiperRef = useRef(null);
  const {
    above5CategoryEvent,
    below5CategoryEvent,
    above5CountryEvent,
    below5CountryEvent,
  } = rankings;
  const countryRank = rankData.country.rank;
  const [countryActiveIndex, setCountryIndex] = useState<number>(0);
  const [countryTotalSlides, setCountryTotalSlides] = useState<number>(0);
  const countryName = rankData.country.name;
  const categoryRank = Math.min(
    ...rankData.category.map((category) => category.rank)
  );
  const [categoryActiveIndex, setCategoryActiveIndex] = useState<number>(0);
  const [categoryTotalSlides, setCategoryTotalSlides] = useState<number>(0);
  const categoryName =
    rankData.category.find((category) => category.rank === categoryRank)
      ?.name ?? "";
  const { name, startDateTime, id: eventId } = eventDetails;
  return (
    <>
      <div className="flex flex-row justify-center border border-[var(--neutral-light-color)] p-3 rounded-sm gap-12 w-fill h-auto">
        {countryRank && (
          <div className="flex flex-col p-3 rounded-sm gap-6 w-auto h-auto items-center">
            <div className="flex flex-col items-center border border-[var(--neutral-light-color)] w-48 rounded-sm">
              <p className="text-3xl font-semibold p-2">
                {countryRank ?? "--"}
              </p>
              <Text
                color="secondary"
                variant="noMargin"
                fontWeight="medium"
                className="bg-[#F2F2F2] w-full p-2 text-center"
              >
                Country Rank
              </Text>
            </div>
            <div>
              {/* <Text color="secondary" className="text-center">
                #{rank} of 1000 in
              </Text> */}
              <p className="text-[#6750A4] text-center font-medium">
                {countryName}
              </p>
            </div>
            <div className="flex flex-col">
              <button
                className={`flex items-center bg-[#FAFAFA] gap-2 p-3 w-44 self-center rounded-sm shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)] cursor-pointer swiper-button-prev-country-${countryRank}`}
                disabled={countryActiveIndex === 1}
              >
                <Text color="secondary" variant="noMargin" className="w-full">
                  see{" "}
                  {below5CategoryEvent.length > 0
                    ? below5CountryEvent.length - 1
                    : ""}{" "}
                  more events
                </Text>
                <ArrowUp width={15} height={15} color="#45A557" />
              </button>
              <Swiper
                effect={"coverflow"}
                grabCursor={true}
                direction="vertical"
                centeredSlides={true}
                slidesPerView={3}
                initialSlide={
                  below5CountryEvent.length > 0 ? below5CountryEvent.length : 1
                }
                coverflowEffect={{
                  rotate: 0,
                  stretch: -1,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                navigation={{
                  nextEl: `.swiper-button-next-country-${countryRank}`,
                  prevEl: `.swiper-button-prev-country-${countryRank}`,
                }}
                modules={[EffectCoverflow, Navigation]}
                className="h-60 w-56"
                ref={swiperRef}
                onSwiper={(swiper) =>
                  setCountryTotalSlides(swiper.slides.length)
                }
                onSlideChange={(swiper) => {
                  setCountryIndex(swiper.activeIndex);
                }}
              >
                <>
                  {below5CountryEvent.map((belowCountryEvent) => {
                    const { countryrank, startdate, eventname, id } =
                      belowCountryEvent;
                    return (
                      <SwiperSlide
                        className="h-fit w-fit bg-white z-40"
                        key={id}
                      >
                        <Link
                          href={`/internal/event/${id}`}
                          className="flex flex-row justify-between border border-[var(--neutral-light-color)] rounded-sm p-3"
                        >
                          <p className="text-xl font-semibold p-2">
                            #{countryrank ?? "--"}
                          </p>
                          <div className="flex flex-col justify-between">
                            <Text
                              color="primary"
                              variant="noMargin"
                              fontWeight="medium"
                              className="w-32 line-clamp-1"
                            >
                              {eventname}
                            </Text>
                            <div className="flex justify-between gap-4">
                              {/* <Text color="secondary" variant="noMargin">
                              Philadelphia, USA
                            </Text> */}
                              <Text color="secondary" variant="noMargin">
                                {formatDate(startdate, "MMM dd")}
                              </Text>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    );
                  })}
                  <SwiperSlide className="h-fit w-fit bg-white z-40">
                    <Link
                      href={`/internal/event/${eventId}`}
                      className="flex flex-row justify-between bg-[#A099E0] border border-[#A099E0] bg-opacity-[0.3] rounded-sm p-3"
                    >
                      <p className="text-xl font-semibold p-2">
                        #{countryRank ?? "--"}
                      </p>
                      <div className="flex flex-col justify-between">
                        <Text
                          color="primary"
                          variant="noMargin"
                          fontWeight="medium"
                          className="w-32 line-clamp-1"
                        >
                          {name}
                        </Text>
                        <div className="flex justify-between gap-4">
                          {/* <Text color="secondary" variant="noMargin">
                            Philadelphia, USA
                          </Text> */}
                          <Text color="secondary" variant="noMargin">
                            {formatDate(startDateTime, "MMM dd")}
                          </Text>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                  {above5CountryEvent.map((aboveCountryEvent) => {
                    const { countryrank, startdate, enddate, eventname, id } =
                      aboveCountryEvent;
                    return (
                      <SwiperSlide
                        className="h-fit w-fit bg-white z-40"
                        key={id}
                      >
                        <Link
                          href={`/internal/event/${id}`}
                          className="flex flex-row justify-between border border-[var(--neutral-light-color)] rounded-sm p-3"
                        >
                          <p className="text-xl font-semibold p-2">
                            #{countryrank ?? "--"}
                          </p>
                          <div className="flex flex-col justify-between">
                            <Text
                              color="primary"
                              variant="noMargin"
                              fontWeight="medium"
                              className="w-32 line-clamp-1"
                            >
                              {eventname}
                            </Text>
                            <div className="flex justify-between gap-4">
                              {/* <Text color="secondary" variant="noMargin">
                                Philadelphia, USA
                              </Text> */}
                              <Text color="secondary" variant="noMargin">
                                {formatDate(startdate, "MMM dd")}
                              </Text>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    );
                  })}
                </>
              </Swiper>
              <button
                className={`flex items-center bg-[#FAFAFA] gap-2 p-3 w-44 self-center rounded-sm shadow-md cursor-pointer swiper-button-next-country-${countryRank}`}
                disabled={countryActiveIndex === countryTotalSlides - 2}
              >
                <Text color="secondary" variant="noMargin">
                  see{" "}
                  {above5CountryEvent.length > 0
                    ? above5CountryEvent.length - 1
                    : ""}{" "}
                  more events
                </Text>
                <ArrowDown width={15} height={15} color="#E5484D" />
              </button>
            </div>
          </div>
        )}
        {categoryRank && (
          <div className="flex flex-col p-3 rounded-sm gap-6 w-auto h-auto items-center">
            <div className="flex flex-col items-center border border-[var(--neutral-light-color)] w-48 rounded-sm">
              <p className="text-3xl font-semibold p-2">{categoryRank}</p>
              <Text
                color="secondary"
                variant="noMargin"
                fontWeight="medium"
                className="bg-[#F2F2F2] w-full p-2 text-center"
              >
                Category Rank
              </Text>
            </div>
            <div>
              {/* <Text color="secondary" className="text-center">
                #{rank} of 1000 in
              </Text> */}
              <p className="text-[#6750A4] text-center font-medium">
                {categoryName}
              </p>
            </div>
            <div className="flex flex-col">
              <button
                className={`flex items-center bg-[#FAFAFA] gap-2 p-3 w-44 self-center rounded-sm shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)] cursor-pointer swiper-button-prev-category-${categoryRank}`}
                disabled={categoryActiveIndex === 1}
              >
                <Text color="secondary" variant="noMargin" className="w-full">
                  see{" "}
                  {below5CategoryEvent.length > 0
                    ? below5CategoryEvent.length - 1
                    : ""}{" "}
                  more events
                </Text>
                <ArrowUp width={15} height={15} color="#45A557" />
              </button>
              <Swiper
                effect={"coverflow"}
                grabCursor={true}
                direction="vertical"
                centeredSlides={true}
                slidesPerView={3}
                initialSlide={
                  below5CategoryEvent.length > 0
                    ? below5CategoryEvent.length
                    : 1
                }
                coverflowEffect={{
                  rotate: 0,
                  stretch: -1,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                navigation={{
                  nextEl: `.swiper-button-next-category-${categoryRank}`,
                  prevEl: `.swiper-button-prev-category-${categoryRank}`,
                }}
                modules={[EffectCoverflow, Navigation]}
                className="h-60 w-56"
                ref={swiperRef}
                onSwiper={(swiper) =>
                  setCategoryTotalSlides(swiper.slides.length)
                }
                onSlideChange={(swiper) => {
                  setCategoryActiveIndex(swiper.activeIndex);
                }}
              >
                <>
                  {below5CategoryEvent.map((belowCategoryEvent) => {
                    const {
                      categoryname,
                      categoryrank,
                      description,
                      startdate,
                      enddate,
                      eventname,
                      id,
                    } = belowCategoryEvent;
                    return (
                      <SwiperSlide
                        className="h-fit w-fit bg-white z-40"
                        key={id}
                      >
                        <Link
                          href={`/internal/event/${id}`}
                          className="flex flex-row justify-between border border-[var(--neutral-light-color)] rounded-sm p-3"
                        >
                          <p className="text-xl font-semibold p-2">
                            #{categoryrank ?? "--"}
                          </p>
                          <div className="flex flex-col justify-between">
                            <Text
                              color="primary"
                              variant="noMargin"
                              fontWeight="medium"
                              className="w-32 line-clamp-1"
                            >
                              {eventname}
                            </Text>
                            <div className="flex justify-between gap-4">
                              {/* <Text color="secondary" variant="noMargin">
                              Philadelphia, USA
                            </Text> */}
                              <Text color="secondary" variant="noMargin">
                                {formatDate(startdate, "MMM dd")}
                              </Text>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    );
                  })}
                  <SwiperSlide className="h-fit w-fit bg-white z-40">
                    <Link
                      href={`/internal/event/${eventId}`}
                      className="flex flex-row justify-between bg-[#A099E0] border border-[#A099E0] bg-opacity-[0.3] rounded-sm p-3"
                    >
                      <p className="text-xl font-semibold p-2">
                        #{categoryRank ?? "--"}
                      </p>
                      <div className="flex flex-col justify-between">
                        <Text
                          color="primary"
                          variant="noMargin"
                          fontWeight="medium"
                          className="w-32 line-clamp-1"
                        >
                          {name}
                        </Text>
                        <div className="flex justify-between gap-4">
                          {/* <Text color="secondary" variant="noMargin">
                            Philadelphia, USA
                          </Text> */}
                          <Text color="secondary" variant="noMargin">
                            {formatDate(startDateTime, "MMM dd")}
                          </Text>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                  {above5CategoryEvent.map((aboveCategoryEvent) => {
                    const { categoryrank, startdate, enddate, eventname, id } =
                      aboveCategoryEvent;
                    return (
                      <SwiperSlide
                        className="h-fit w-fit bg-white z-40"
                        key={id}
                      >
                        <Link
                          href={`/internal/event/${id}`}
                          className="flex flex-row justify-between border border-[var(--neutral-light-color)] rounded-sm p-3"
                        >
                          <p className="text-xl font-semibold p-2">
                            #{categoryrank ?? "--"}
                          </p>
                          <div className="flex flex-col justify-between">
                            <Text
                              color="primary"
                              variant="noMargin"
                              fontWeight="medium"
                              className="w-32 line-clamp-1"
                            >
                              {eventname}
                            </Text>
                            <div className="flex justify-between gap-4">
                              {/* <Text color="secondary" variant="noMargin">
                                Philadelphia, USA
                              </Text> */}
                              <Text color="secondary" variant="noMargin">
                                {formatDate(startdate, "MMM dd")}
                              </Text>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    );
                  })}
                </>
              </Swiper>
              <button
                className={`flex items-center bg-[#FAFAFA] gap-2 p-3 w-44 self-center rounded-sm shadow-md cursor-pointer swiper-button-next-category-${categoryRank}`}
                disabled={categoryActiveIndex === categoryTotalSlides - 2}
              >
                <Text color="secondary" variant="noMargin">
                  see{" "}
                  {above5CategoryEvent.length > 0
                    ? above5CategoryEvent.length - 1
                    : ""}{" "}
                  more events
                </Text>
                <ArrowDown width={15} height={15} color="#E5484D" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
