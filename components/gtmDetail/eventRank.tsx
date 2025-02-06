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
import { useFilterContext } from "@/context/filterContext";
import Restriction from "../eventDetail/restriction";

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
  const { morphedData } = useFilterContext();
  const {
    categories,
    venueLocation,
    rankData,
    name,
    startDateTime,
    id: eventId,
  } = eventDetails;
  const { eventRanking } = morphedData;
  const swiperRef = useRef(null);
  const {
    above5CategoryEvent,
    below5CategoryEvent,
    above5CountryEvent,
    below5CountryEvent,
    above5CountryCategoryRankEvent,
    below5CountryCategoryEvent,
  } = rankings;

  const countryRank = rankData.country.rank;
  const [countryActiveIndex, setCountryIndex] = useState<number>(0);
  const [countryTotalSlides, setCountryTotalSlides] = useState<number>(0);
  const countryName = rankData.country.name;

  const categoryRank =
    rankData.category &&
    rankData.category.length > 0 &&
    Math.min(...rankData.category.map((category) => category.rank));
  const [categoryActiveIndex, setCategoryActiveIndex] = useState<number>(0);
  const [categoryTotalSlides, setCategoryTotalSlides] = useState<number>(0);
  const categoryName =
    rankData.category.find((category) => category.rank === categoryRank)
      ?.name ?? "";

  const countryCategoryRank =
    rankData.countryCategoryRank &&
    rankData.countryCategoryRank.length > 0 &&
    Math.min(
      ...rankData.countryCategoryRank.map(
        (countryCategoryRank) => countryCategoryRank.rank
      )
    );
  const [countryCategoryActiveIndex, setCountryCategoryActiveIndex] =
    useState<number>(0);
  const [countryCategoryTotalSlides, setCountryCategoryTotalSlides] =
    useState<number>(0);

  const rankComponents = (
    <div className="flex flex-row justify-center max-[1400px]:hidden">
      {countryRank && (
        <div className="flex flex-col p-3 rounded-sm gap-6 w-auto h-auto items-center">
          <div className="flex flex-col items-center border border-[var(--neutral-light-color)] dark:bg-[var(--primary-foreground)] dark:border-[var(--border-color)] w-48 rounded-sm">
            <p className={`text-3xl font-semibold p-2`}>
              {(eventRanking && eventRanking.isEnabled ? (
                countryRank
              ) : (
                <Restriction />
              )) ?? "--"}
            </p>
            <Text
              color="secondary"
              variant="noMargin"
              fontWeight="medium"
              className="bg-[#F2F2F2] dark:bg-[#1A1A1A] dark:border-t dark:border-t-2-[var(--border-color)] w-full p-2 text-center"
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
              className={`flex items-center bg-[#FAFAFA] dark:border dark:border-[var(--border-color)] dark:bg-[#292929] gap-2 p-3 w-44 self-center rounded-sm shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)] ${
                countryActiveIndex === 1
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              } swiper-button-prev-country-${countryRank}`}
              disabled={countryActiveIndex === 1}
            >
              <Text color="secondary" variant="noMargin" className="w-full">
                see more events
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
              onSwiper={(swiper) => setCountryTotalSlides(swiper.slides.length)}
              onSlideChange={(swiper) => {
                setCountryIndex(swiper.activeIndex);
              }}
            >
              <>
                {below5CountryEvent.map((belowCountryEvent) => {
                  const { countryrank, startdate, eventname, id, location } =
                    belowCountryEvent;
                  return (
                    <SwiperSlide
                      className="h-fit w-fit bg-white z-40 dark:bg-[var(--primary-foreground)] "
                      key={id}
                    >
                      <Link
                        href={`/internal/event/${id}`}
                        className="flex flex-row justify-between border border-[var(--neutral-light-color)] dark:border-[var(--border-color)] rounded-sm p-3"
                      >
                        <p className="text-xl font-semibold p-2">
                          #
                          {(eventRanking &&
                            eventRanking.isEnabled &&
                            countryrank) ??
                            "--"}
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
                            <Text color="secondary" variant="noMargin">
                              {location}
                            </Text>
                            <Text color="secondary" variant="noMargin">
                              {formatDate(startdate, "MMM dd")}
                            </Text>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  );
                })}
                <SwiperSlide className="h-fit w-fit bg-white z-40 dark:bg-[var(--primary-foreground)] ">
                  <Link
                    href={`/internal/event/${eventId}`}
                    className="flex flex-row justify-between bg-[#A099E0] border border-[#A099E0] bg-opacity-[0.3] rounded-sm p-3"
                  >
                    <p className="text-xl font-semibold p-2">
                      #
                      {(eventRanking &&
                        eventRanking.isEnabled &&
                        countryRank) ??
                        "--"}
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
                        <Text color="secondary" variant="noMargin">
                          {`${venueLocation?.state.name} ${venueLocation?.country.name}`}
                        </Text>
                        <Text color="secondary" variant="noMargin">
                          {formatDate(startDateTime, "MMM dd")}
                        </Text>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
                {above5CountryEvent.map((aboveCountryEvent) => {
                  const { countryrank, startdate, eventname, id, location } =
                    aboveCountryEvent;
                  return (
                    <SwiperSlide
                      className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)]  z-40"
                      key={id}
                    >
                      <Link
                        href={`/internal/event/${id}`}
                        className="flex flex-row justify-between border border-[var(--neutral-light-color)] dark:border-[var(--border-color)] rounded-sm p-3"
                      >
                        <p className="text-xl font-semibold p-2">
                          #
                          {(eventRanking &&
                            eventRanking.isEnabled &&
                            countryrank) ??
                            "--"}
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
                            <Text color="secondary" variant="noMargin">
                              {location}
                            </Text>
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
              className={`flex items-center bg-[#FAFAFA] dark:border dark:border-[var(--border-color)] dark:bg-[#292929] gap-2 p-3 w-44 self-center rounded-sm shadow-md ${
                countryActiveIndex === countryTotalSlides - 2
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              } swiper-button-next-country-${countryRank}`}
              disabled={countryActiveIndex === countryTotalSlides - 2}
            >
              <Text color="secondary" variant="noMargin" className="w-full">
                see more events
              </Text>
              <ArrowDown width={15} height={15} color="#E5484D" />
            </button>
          </div>
        </div>
      )}
      {categoryRank && (
        <div className="flex flex-col p-3 rounded-sm gap-6 w-auto h-auto items-center">
          <div className="flex flex-col items-center border border-[var(--neutral-light-color)] dark:bg-[var(--primary-foreground)] dark:border-[var(--border-color)] w-48 rounded-sm">
            <p className={`text-3xl font-semibold p-2 `}>
              {(eventRanking && eventRanking.isEnabled ? (
                categoryRank
              ) : (
                <Restriction />
              )) ?? "--"}
            </p>
            <Text
              color="secondary"
              variant="noMargin"
              fontWeight="medium"
              className="bg-[#F2F2F2] dark:bg-[#1A1A1A] dark:border-t dark:border-t-2-[var(--border-color)] w-full p-2 text-center"
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
              className={`flex items-center bg-[#FAFAFA] dark:bg-[#292929] dark:border dark:border-[var(--border-color)] gap-2 p-3 w-44 self-center rounded-sm shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)] ${
                categoryActiveIndex === 1
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              } swiper-button-prev-category-${categoryRank}`}
              disabled={categoryActiveIndex === 1}
            >
              <Text color="secondary" variant="noMargin" className="w-full">
                see more events
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
                below5CategoryEvent.length > 0 ? below5CategoryEvent.length : 1
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
                  const { categoryrank, startdate, eventname, location, id } =
                    belowCategoryEvent;
                  return (
                    <SwiperSlide
                      className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)] z-40"
                      key={id}
                    >
                      <Link
                        href={`/internal/event/${id}`}
                        className="flex flex-row justify-between border border-[var(--neutral-light-color)] dark:border-[var(--border-color)] rounded-sm p-3"
                      >
                        <p className="text-xl font-semibold p-2">
                          #
                          {(eventRanking &&
                            eventRanking.isEnabled &&
                            categoryrank) ??
                            "--"}
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
                            <Text color="secondary" variant="noMargin">
                              {location}
                            </Text>
                            <Text color="secondary" variant="noMargin">
                              {formatDate(startdate, "MMM dd")}
                            </Text>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  );
                })}
                <SwiperSlide className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)] z-40">
                  <Link
                    href={`/internal/event/${eventId}`}
                    className="flex flex-row justify-between bg-[#A099E0] border border-[#A099E0] bg-opacity-[0.3] rounded-sm p-3"
                  >
                    <p className="text-xl font-semibold p-2">
                      #
                      {(eventRanking &&
                        eventRanking.isEnabled &&
                        categoryRank) ??
                        "--"}
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
                        <Text color="secondary" variant="noMargin">
                          {`${venueLocation?.state.name} ${venueLocation?.country.name}`}
                        </Text>
                        <Text color="secondary" variant="noMargin">
                          {formatDate(startDateTime, "MMM dd")}
                        </Text>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
                {above5CategoryEvent.map((aboveCategoryEvent) => {
                  const { categoryrank, startdate, eventname, id, location } =
                    aboveCategoryEvent;
                  return (
                    <SwiperSlide
                      className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)] z-40"
                      key={id}
                    >
                      <Link
                        href={`/internal/event/${id}`}
                        className="flex flex-row justify-between border border-[var(--neutral-light-color)] dark:border-[var(--border-color)] rounded-sm p-3"
                      >
                        <p className="text-xl font-semibold p-2">
                          #
                          {(eventRanking &&
                            eventRanking.isEnabled &&
                            categoryrank) ??
                            "--"}
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
                            <Text color="secondary" variant="noMargin">
                              {location}
                            </Text>
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
              className={`flex items-center bg-[#FAFAFA] dark:bg-[#292929] dark:border dark:border-[var(--border-color)] gap-2 p-3 w-44 self-center rounded-sm shadow-md ${
                categoryActiveIndex === categoryTotalSlides - 2
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              } swiper-button-next-category-${categoryRank}`}
              disabled={categoryActiveIndex === categoryTotalSlides - 2}
            >
              <Text color="secondary" variant="noMargin" className="w-full">
                see more events
              </Text>
              <ArrowDown width={15} height={15} color="#E5484D" />
            </button>
          </div>
        </div>
      )}
      {countryCategoryRank && (
        <div className="flex flex-col p-3 rounded-sm gap-6 w-auto h-auto items-center">
          <div className="flex flex-col items-center border border-[var(--neutral-light-color)] dark:bg-[var(--primary-foreground)] dark:border-[var(--border-color)] w-48 rounded-sm">
            <p className={`text-3xl font-semibold p-2 `}>
              {(eventRanking && eventRanking.isEnabled ? (
                countryCategoryRank
              ) : (
                <Restriction />
              )) ?? "--"}
            </p>
            <Text
              color="secondary"
              variant="noMargin"
              fontWeight="medium"
              className="bg-[#F2F2F2] dark:bg-[#1A1A1A] dark:border-t dark:border-t-2-[var(--border-color)] w-full p-2 text-center"
            >
              Country + Category Rank
            </Text>
          </div>
          <div>
            {/* <Text color="secondary" className="text-center">
              #{rank} of 1000 in
            </Text> */}
            <p className="text-[#6750A4] text-center font-medium">
              {`${countryName} ${categoryName}`}
            </p>
          </div>
          <div className="flex flex-col">
            <button
              className={`flex items-center bg-[#FAFAFA] dark:bg-[#292929] dark:border dark:border-[var(--border-color)] gap-2 p-3 w-44 self-center rounded-sm shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)] ${
                countryCategoryActiveIndex === 1
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              } swiper-button-prev-country-category-${countryCategoryRank}`}
              disabled={countryCategoryActiveIndex === 1}
            >
              <Text color="secondary" variant="noMargin" className="w-full">
                see more events
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
                below5CountryCategoryEvent.length > 0
                  ? below5CountryCategoryEvent.length
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
                nextEl: `.swiper-button-next-country-category-${countryCategoryRank}`,
                prevEl: `.swiper-button-prev-country-category-${countryCategoryRank}`,
              }}
              modules={[EffectCoverflow, Navigation]}
              className="h-60 w-56"
              ref={swiperRef}
              onSwiper={(swiper) =>
                setCountryCategoryTotalSlides(swiper.slides.length)
              }
              onSlideChange={(swiper) => {
                setCountryCategoryActiveIndex(swiper.activeIndex);
              }}
            >
              <>
                {below5CountryCategoryEvent &&
                  below5CountryCategoryEvent.length > 0 &&
                  below5CountryCategoryEvent.map((belowCategoryEvent) => {
                    const {
                      countrycategoryrank,
                      startdate,
                      eventname,
                      id,
                      location,
                    } = belowCategoryEvent;
                    return (
                      <SwiperSlide
                        className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)] z-40"
                        key={id}
                      >
                        <Link
                          href={`/internal/event/${id}`}
                          className="flex flex-row justify-between border border-[var(--neutral-light-color)] dark:border-[var(--border-color)] rounded-sm p-3"
                        >
                          <p className="text-xl font-semibold p-2">
                            #
                            {(eventRanking &&
                              eventRanking.isEnabled &&
                              countrycategoryrank) ??
                              "--"}
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
                              <Text color="secondary" variant="noMargin">
                                {location}
                              </Text>
                              <Text color="secondary" variant="noMargin">
                                {formatDate(startdate, "MMM dd")}
                              </Text>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    );
                  })}
                <SwiperSlide className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)] z-40">
                  <Link
                    href={`/internal/event/${eventId}`}
                    className="flex flex-row justify-between bg-[#A099E0] border border-[#A099E0] bg-opacity-[0.3] rounded-sm p-3"
                  >
                    <p className="text-xl font-semibold p-2">
                      #
                      {(eventRanking &&
                        eventRanking.isEnabled &&
                        countryCategoryRank) ??
                        "--"}
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
                        <Text color="secondary" variant="noMargin">
                          {`${venueLocation?.state.name} ${venueLocation?.country.name}`}
                        </Text>
                        <Text color="secondary" variant="noMargin">
                          {formatDate(startDateTime, "MMM dd")}
                        </Text>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
                {above5CountryCategoryRankEvent &&
                  above5CountryCategoryRankEvent.length > 0 &&
                  above5CountryCategoryRankEvent.map((aboveCategoryEvent) => {
                    const {
                      countrycategoryrank,
                      startdate,
                      eventname,
                      location,
                      id,
                    } = aboveCategoryEvent;
                    return (
                      <SwiperSlide
                        className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)] z-40"
                        key={id}
                      >
                        <Link
                          href={`/internal/event/${id}`}
                          className="flex flex-row justify-between border border-[var(--neutral-light-color)] dark:border-[var(--border-color)] rounded-sm p-3"
                        >
                          <p className="text-xl font-semibold p-2">
                            #
                            {(eventRanking &&
                              eventRanking.isEnabled &&
                              countrycategoryrank) ??
                              "--"}
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
                              <Text color="secondary" variant="noMargin">
                                {location}
                              </Text>
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
              className={`flex items-center bg-[#FAFAFA] dark:bg-[#292929] dark:border dark:border-[var(--border-color)] gap-2 p-3 w-44 self-center rounded-sm shadow-md ${
                countryCategoryActiveIndex === countryCategoryTotalSlides - 2
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              } swiper-button-next-country-category-${countryCategoryRank}`}
              disabled={
                countryCategoryActiveIndex === countryCategoryTotalSlides - 2
              }
            >
              <Text color="secondary" variant="noMargin" className="w-full">
                see more events
              </Text>
              <ArrowDown width={15} height={15} color="#E5484D" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const swiperRankComponents = (
    <div className="hidden max-[1400px]:flex max-[1400px]: justify-center w-full">
      <Swiper
        className="w-full h-full"
        modules={[Navigation, Pagination]}
        grabCursor={true}
        centeredSlides={true}
        spaceBetween={5}
        slidesPerView="auto"
        navigation={{
          nextEl: ".custom-next-ranking",
          prevEl: ".custom-prev-ranking",
        }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
      >
        {countryRank && (
          <SwiperSlide style={{ display: "flex", justifyContent: "center" }}>
            <div className="flex flex-col p-3 rounded-sm gap-6 w-auto h-auto items-center">
              <div className="flex flex-col items-center border border-[var(--neutral-light-color)] dark:bg-[var(--primary-foreground)] dark:border-[var(--border-color)] w-48 rounded-sm">
                <p className={`text-3xl font-semibold p-2 `}>
                  {(eventRanking && eventRanking.isEnabled ? (
                    countryRank
                  ) : (
                    <Restriction />
                  )) ?? "--"}
                </p>
                <Text
                  color="secondary"
                  variant="noMargin"
                  fontWeight="medium"
                  className="bg-[#F2F2F2] dark:bg-[#1A1A1A] dark:border-t dark:border-t-2-[var(--border-color)] w-full p-2 text-center"
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
                  className={`flex items-center bg-[#FAFAFA] dark:border dark:border-[var(--border-color)] dark:bg-[#292929] gap-2 p-3 w-44 self-center rounded-sm shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)] ${
                    countryActiveIndex === 1
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } swiper-button-prev-country-${countryRank}`}
                  disabled={countryActiveIndex === 1}
                >
                  <Text color="secondary" variant="noMargin" className="w-full">
                    see more events
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
                    below5CountryEvent.length > 0
                      ? below5CountryEvent.length
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
                      const {
                        countryrank,
                        startdate,
                        eventname,
                        id,
                        location,
                      } = belowCountryEvent;
                      return (
                        <SwiperSlide
                          className="h-fit w-fit bg-white z-40 dark:bg-[var(--primary-foreground)] "
                          key={id}
                        >
                          <Link
                            href={`/internal/event/${id}`}
                            className="flex flex-row justify-between border border-[var(--neutral-light-color)] dark:border-[var(--border-color)] rounded-sm p-3"
                          >
                            <p className="text-xl font-semibold p-2">
                              #
                              {(eventRanking &&
                                eventRanking.isEnabled &&
                                countryrank) ??
                                "--"}
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
                                <Text color="secondary" variant="noMargin">
                                  {location}
                                </Text>
                                <Text color="secondary" variant="noMargin">
                                  {formatDate(startdate, "MMM dd")}
                                </Text>
                              </div>
                            </div>
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                    <SwiperSlide className="h-fit w-fit bg-white z-40 dark:bg-[var(--primary-foreground)] ">
                      <Link
                        href={`/internal/event/${eventId}`}
                        className="flex flex-row justify-between bg-[#A099E0] border border-[#A099E0] bg-opacity-[0.3] rounded-sm p-3"
                      >
                        <p className="text-xl font-semibold p-2">
                          #
                          {(eventRanking &&
                            eventRanking.isEnabled &&
                            countryRank) ??
                            "--"}
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
                            <Text color="secondary" variant="noMargin">
                              {`${venueLocation?.state.name} ${venueLocation?.country.name}`}
                            </Text>
                            <Text color="secondary" variant="noMargin">
                              {formatDate(startDateTime, "MMM dd")}
                            </Text>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                    {above5CountryEvent.map((aboveCountryEvent) => {
                      const {
                        countryrank,
                        startdate,
                        eventname,
                        id,
                        location,
                      } = aboveCountryEvent;
                      return (
                        <SwiperSlide
                          className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)]  z-40"
                          key={id}
                        >
                          <Link
                            href={`/internal/event/${id}`}
                            className="flex flex-row justify-between border border-[var(--neutral-light-color)] dark:border-[var(--border-color)] rounded-sm p-3"
                          >
                            <p className="text-xl font-semibold p-2">
                              #
                              {(eventRanking &&
                                eventRanking.isEnabled &&
                                countryrank) ??
                                "--"}
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
                                <Text color="secondary" variant="noMargin">
                                  {location}
                                </Text>
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
                  className={`flex items-center bg-[#FAFAFA] dark:border dark:border-[var(--border-color)] dark:bg-[#292929] gap-2 p-3 w-44 self-center rounded-sm shadow-md ${
                    countryActiveIndex === countryTotalSlides - 2
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } swiper-button-next-country-${countryRank}`}
                  disabled={countryActiveIndex === countryTotalSlides - 2}
                >
                  <Text color="secondary" variant="noMargin" className="w-full">
                    see more events
                  </Text>
                  <ArrowDown width={15} height={15} color="#E5484D" />
                </button>
              </div>
            </div>
          </SwiperSlide>
        )}
        {categoryRank && (
          <SwiperSlide style={{ display: "flex", justifyContent: "center" }}>
            <div className="flex flex-col p-3 rounded-sm gap-6 w-auto h-auto items-center">
              <div className="flex flex-col items-center border border-[var(--neutral-light-color)] dark:bg-[var(--primary-foreground)] dark:border-[var(--border-color)] w-48 rounded-sm">
                <p className={`text-3xl font-semibold p-2`}>
                  {(eventRanking && eventRanking.isEnabled ? (
                    categoryRank
                  ) : (
                    <Restriction />
                  )) ?? "--"}
                </p>
                <Text
                  color="secondary"
                  variant="noMargin"
                  fontWeight="medium"
                  className="bg-[#F2F2F2] dark:bg-[#1A1A1A] dark:border-t dark:border-t-2-[var(--border-color)] w-full p-2 text-center"
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
                  className={`flex items-center bg-[#FAFAFA] dark:bg-[#292929] dark:border dark:border-[var(--border-color)] gap-2 p-3 w-44 self-center rounded-sm shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)] ${
                    categoryActiveIndex === 1
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } swiper-button-prev-category-${categoryRank}`}
                  disabled={categoryActiveIndex === 1}
                >
                  <Text color="secondary" variant="noMargin" className="w-full">
                    see more events
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
                        categoryrank,
                        startdate,
                        eventname,
                        location,
                        id,
                      } = belowCategoryEvent;
                      return (
                        <SwiperSlide
                          className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)] z-40"
                          key={id}
                        >
                          <Link
                            href={`/internal/event/${id}`}
                            className="flex flex-row justify-between border border-[var(--neutral-light-color)] dark:border-[var(--border-color)] rounded-sm p-3"
                          >
                            <p className="text-xl font-semibold p-2">
                              #
                              {(eventRanking &&
                                eventRanking.isEnabled &&
                                categoryrank) ??
                                "--"}
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
                                <Text color="secondary" variant="noMargin">
                                  {location}
                                </Text>
                                <Text color="secondary" variant="noMargin">
                                  {formatDate(startdate, "MMM dd")}
                                </Text>
                              </div>
                            </div>
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                    <SwiperSlide className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)] z-40">
                      <Link
                        href={`/internal/event/${eventId}`}
                        className="flex flex-row justify-between bg-[#A099E0] border border-[#A099E0] bg-opacity-[0.3] rounded-sm p-3"
                      >
                        <p className="text-xl font-semibold p-2">
                          #
                          {(eventRanking &&
                            eventRanking.isEnabled &&
                            categoryRank) ??
                            "--"}
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
                            <Text color="secondary" variant="noMargin">
                              {`${venueLocation?.state.name} ${venueLocation?.country.name}`}
                            </Text>
                            <Text color="secondary" variant="noMargin">
                              {formatDate(startDateTime, "MMM dd")}
                            </Text>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                    {above5CategoryEvent.map((aboveCategoryEvent) => {
                      const {
                        categoryrank,
                        startdate,
                        eventname,
                        id,
                        location,
                      } = aboveCategoryEvent;
                      return (
                        <SwiperSlide
                          className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)] z-40"
                          key={id}
                        >
                          <Link
                            href={`/internal/event/${id}`}
                            className="flex flex-row justify-between border border-[var(--neutral-light-color)] dark:border-[var(--border-color)] rounded-sm p-3"
                          >
                            <p className="text-xl font-semibold p-2">
                              #
                              {(eventRanking &&
                                eventRanking.isEnabled &&
                                categoryrank) ??
                                "--"}
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
                                <Text color="secondary" variant="noMargin">
                                  {location}
                                </Text>
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
                  className={`flex items-center bg-[#FAFAFA] dark:bg-[#292929] dark:border dark:border-[var(--border-color)] gap-2 p-3 w-44 self-center rounded-sm shadow-md ${
                    categoryActiveIndex === categoryTotalSlides - 2
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } swiper-button-next-category-${categoryRank}`}
                  disabled={categoryActiveIndex === categoryTotalSlides - 2}
                >
                  <Text color="secondary" variant="noMargin" className="w-full">
                    see more events
                  </Text>
                  <ArrowDown width={15} height={15} color="#E5484D" />
                </button>
              </div>
            </div>
          </SwiperSlide>
        )}
        {countryCategoryRank && (
          <SwiperSlide style={{ display: "flex", justifyContent: "center" }}>
            <div className="flex flex-col p-3 rounded-sm gap-6 w-auto h-auto items-center">
              <div className="flex flex-col items-center border border-[var(--neutral-light-color)] dark:bg-[var(--primary-foreground)] dark:border-[var(--border-color)] w-48 rounded-sm">
                <p className={`text-3xl font-semibold p-2 `}>
                  {(eventRanking && eventRanking.isEnabled ? (
                    countryCategoryRank
                  ) : (
                    <Restriction />
                  )) ?? "--"}
                </p>
                <Text
                  color="secondary"
                  variant="noMargin"
                  fontWeight="medium"
                  className="bg-[#F2F2F2] dark:bg-[#1A1A1A] dark:border-t dark:border-t-2-[var(--border-color)] w-full p-2 text-center"
                >
                  Country + Category Rank
                </Text>
              </div>
              <div>
                {/* <Text color="secondary" className="text-center">
                  #{rank} of 1000 in
                </Text> */}
                <p className="text-[#6750A4] text-center font-medium">
                  {`${countryName} ${categoryName}`}
                </p>
              </div>
              <div className="flex flex-col">
                <button
                  className={`flex items-center bg-[#FAFAFA] dark:bg-[#292929] dark:border dark:border-[var(--border-color)] gap-2 p-3 w-44 self-center rounded-sm shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)] ${
                    countryCategoryActiveIndex === 1
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } swiper-button-prev-country-category-${countryCategoryRank}`}
                  disabled={countryCategoryActiveIndex === 1}
                >
                  <Text color="secondary" variant="noMargin" className="w-full">
                    see more events
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
                    below5CountryCategoryEvent.length > 0
                      ? below5CountryCategoryEvent.length
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
                    nextEl: `.swiper-button-next-country-category-${countryCategoryRank}`,
                    prevEl: `.swiper-button-prev-country-category-${countryCategoryRank}`,
                  }}
                  modules={[EffectCoverflow, Navigation]}
                  className="h-60 w-56"
                  ref={swiperRef}
                  onSwiper={(swiper) =>
                    setCountryCategoryTotalSlides(swiper.slides.length)
                  }
                  onSlideChange={(swiper) => {
                    setCountryCategoryActiveIndex(swiper.activeIndex);
                  }}
                >
                  <>
                    {below5CountryCategoryEvent &&
                      below5CountryCategoryEvent.length > 0 &&
                      below5CountryCategoryEvent.map((belowCategoryEvent) => {
                        const {
                          countrycategoryrank,
                          startdate,
                          eventname,
                          id,
                          location,
                        } = belowCategoryEvent;
                        return (
                          <SwiperSlide
                            className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)] z-40"
                            key={id}
                          >
                            <Link
                              href={`/internal/event/${id}`}
                              className="flex flex-row justify-between border border-[var(--neutral-light-color)] dark:border-[var(--border-color)] rounded-sm p-3"
                            >
                              <p className="text-xl font-semibold p-2">
                                #
                                {(eventRanking &&
                                  eventRanking.isEnabled &&
                                  countrycategoryrank) ??
                                  "--"}
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
                                  <Text color="secondary" variant="noMargin">
                                    {location}
                                  </Text>
                                  <Text color="secondary" variant="noMargin">
                                    {formatDate(startdate, "MMM dd")}
                                  </Text>
                                </div>
                              </div>
                            </Link>
                          </SwiperSlide>
                        );
                      })}
                    <SwiperSlide className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)] z-40">
                      <Link
                        href={`/internal/event/${eventId}`}
                        className="flex flex-row justify-between bg-[#A099E0] border border-[#A099E0] bg-opacity-[0.3] rounded-sm p-3"
                      >
                        <p className="text-xl font-semibold p-2">
                          #
                          {(eventRanking &&
                            eventRanking.isEnabled &&
                            countryCategoryRank) ??
                            "--"}
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
                            <Text color="secondary" variant="noMargin">
                              {`${venueLocation?.state.name} ${venueLocation?.country.name}`}
                            </Text>
                            <Text color="secondary" variant="noMargin">
                              {formatDate(startDateTime, "MMM dd")}
                            </Text>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                    {above5CountryCategoryRankEvent &&
                      above5CountryCategoryRankEvent.length > 0 &&
                      above5CountryCategoryRankEvent.map(
                        (aboveCategoryEvent) => {
                          const {
                            countrycategoryrank,
                            startdate,
                            eventname,
                            location,
                            id,
                          } = aboveCategoryEvent;
                          return (
                            <SwiperSlide
                              className="h-fit w-fit bg-white dark:bg-[var(--primary-foreground)] z-40"
                              key={id}
                            >
                              <Link
                                href={`/internal/event/${id}`}
                                className="flex flex-row justify-between border border-[var(--neutral-light-color)] dark:border-[var(--border-color)] rounded-sm p-3"
                              >
                                <p className="text-xl font-semibold p-2">
                                  #
                                  {(eventRanking &&
                                    eventRanking.isEnabled &&
                                    countrycategoryrank) ??
                                    "--"}
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
                                    <Text color="secondary" variant="noMargin">
                                      {location}
                                    </Text>
                                    <Text color="secondary" variant="noMargin">
                                      {formatDate(startdate, "MMM dd")}
                                    </Text>
                                  </div>
                                </div>
                              </Link>
                            </SwiperSlide>
                          );
                        }
                      )}
                  </>
                </Swiper>
                <button
                  className={`flex items-center bg-[#FAFAFA] dark:bg-[#292929] dark:border dark:border-[var(--border-color)] gap-2 p-3 w-44 self-center rounded-sm shadow-md ${
                    countryCategoryActiveIndex ===
                    countryCategoryTotalSlides - 2
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } swiper-button-next-country-category-${countryCategoryRank}`}
                  disabled={
                    countryCategoryActiveIndex ===
                    countryCategoryTotalSlides - 2
                  }
                >
                  <Text color="secondary" variant="noMargin" className="w-full">
                    see more events
                  </Text>
                  <ArrowDown width={15} height={15} color="#E5484D" />
                </button>
              </div>
            </div>
          </SwiperSlide>
        )}
        <div className="custom-prev-ranking flex justify-center items-center absolute left-0 top-16 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-300 rounded-full w-8 h-8">
          &#8592;
        </div>
        <div className="custom-next-ranking flex justify-center items-center absolute right-0 top-16 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-300 rounded-full w-8 h-8">
          &#8594;
        </div>
        <div className="custom-pagination flex justify-center mt-4"></div>
      </Swiper>
    </div>
  );
  return (
    <>
      <div className="flex flex-col gap-6 relative border border-[var(--neutral-light-color)] dark:border-[var(--border-color)] p-3 rounded-sm w-fill h-auto">
        <h1 className="text-[1rem] font-medium w-full">
          Event Ranking
        </h1>
        {rankComponents}
        {swiperRankComponents}
      </div>
    </>
  );
};
