"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import Text from "../new-ui/Text";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { useRef, useState } from "react";
import { Event, OverallRankingsDetail, RankingData } from "@/types/events";
import { format, formatDate } from "date-fns";
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

const EventRankCarousel = ({
  id,
  rankData,
  rankType,
  eventDetails,
}: {
  id: number;
  rankType: string;
  eventDetails: Event;
  rankData: RankingData;
}) => {
  const swiperRef = useRef(null);
  const { precedingEvents, succeedingEvents, currentEvent } = rankData;
  const { startDateTime, location, name, rank, id: eventId } = currentEvent;
  const { STATE, COUNTRY } = location;
  const [countryActiveIndex, setCountryIndex] = useState<number>(0);
  const [countryTotalSlides, setCountryTotalSlides] = useState<number>(0);
  const [categoryActiveIndex, setCategoryIndex] = useState<number>(0);
  const [categoryTotalSlides, setCategoryTotalSlides] = useState<number>(0);
  const [categoryCountryActiveIndex, setCategoryCountryIndex] =
    useState<number>(0);
  const [categoryCountryTotalSlides, setCategoryCountryTotalSlides] =
    useState<number>(0);
  const activeIndex =
    rankType === "Country Rank"
      ? countryActiveIndex
      : rankType === "Category Rank"
      ? categoryActiveIndex
      : rankType === "Country + Category Rank"
      ? categoryCountryActiveIndex
      : 0;
  const totalSlides =
    rankType === "Country Rank"
      ? countryTotalSlides
      : rankType === "Category Rank"
      ? categoryTotalSlides
      : rankType === "Country + Category Rank"
      ? categoryCountryTotalSlides
      : 0;
  return (
    <div className="flex flex-col">
      <button
        className={`flex items-center bg-[#FAFAFA] p-3 w-44 self-center rounded-sm shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)] ${
          activeIndex === 1 ? "cursor-not-allowed" : "cursor-pointer"
        }  swiper-button-prev-${id}`}
        disabled={activeIndex === 1}
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
        initialSlide={precedingEvents.length > 0 ? precedingEvents.length : 1}
        coverflowEffect={{
          rotate: 0,
          stretch: -1,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        navigation={{
          nextEl: `.swiper-button-next-${id}`,
          prevEl: `.swiper-button-prev-${id}`,
        }}
        modules={[EffectCoverflow, Navigation]}
        className="h-60 w-fit"
        ref={swiperRef}
        onSwiper={(swiper) =>
          rankType === "Country Rank"
            ? setCountryTotalSlides(swiper.slides.length)
            : rankType === "Category Rank"
            ? setCategoryTotalSlides(swiper.slides.length)
            : rankType === "Country + Category Rank"
            ? setCategoryCountryTotalSlides(swiper.slides.length)
            : null
        }
        onSlideChange={(swiper) => {
          rankType === "Country Rank"
            ? setCountryIndex(swiper.activeIndex)
            : rankType === "Category Rank"
            ? setCategoryIndex(swiper.activeIndex)
            : rankType === "Country + Category Rank"
            ? setCategoryCountryIndex(swiper.activeIndex)
            : null;
        }}
      >
        <>
          {precedingEvents &&
            precedingEvents.length > 0 &&
            precedingEvents.map((event) => {
              const { id, name, rank, startDateTime, endDateTime, location } =
                event;
              return (
                <SwiperSlide className="h-fit w-fit bg-white z-40" key={id}>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`/search/${id}`}
                    className="flex flex-row gap-2 border border-[var(--neutral-light-color)] rounded-sm p-3"
                  >
                    <p className="text-xl font-semibold p-2">#{rank}</p>
                    <div className="flex flex-col justify-between">
                      <Text
                        color="primary"
                        variant="noMargin"
                        fontWeight="medium"
                        className="w-28 truncate"
                      >
                        {name}
                      </Text>
                      <div className="flex justify-between gap-4">
                        <Text color="secondary" variant="noMargin">
                          {`${location.STATE?.name}, ${location.COUNTRY?.name}`}
                        </Text>
                        <Text color="secondary" variant="noMargin">
                          {format(new Date(startDateTime), "MMM dd")}
                        </Text>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          <SwiperSlide className="h-fit w-fit bg-white z-40">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`/search/${eventId}`}
              className="flex flex-row gap-2 bg-[#A099E0] border border-[#A099E0] bg-opacity-[0.3] rounded-sm p-3"
            >
              <p className="text-xl font-semibold p-2">#{rank}</p>
              <div className="flex flex-col justify-between">
                <Text
                  color="primary"
                  variant="noMargin"
                  fontWeight="medium"
                  className="w-28 truncate"
                >
                  {name}
                </Text>
                <div className="flex justify-between gap-4">
                  <Text color="secondary" variant="noMargin">
                    {`${STATE?.name}, ${COUNTRY?.name}`}
                  </Text>
                  <Text color="secondary" variant="noMargin">
                    {format(new Date(startDateTime), "MMM dd")}
                  </Text>
                </div>
              </div>
            </Link>
          </SwiperSlide>
          {succeedingEvents &&
            succeedingEvents.length > 0 &&
            succeedingEvents.map((event) => {
              const { id, name, rank, startDateTime, endDateTime, location } =
                event;
              return (
                <SwiperSlide className="h-fit w-fit bg-white z-40" key={id}>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`/search/${id}`}
                    className="flex flex-row gap-2 border border-[var(--neutral-light-color)] rounded-sm p-3"
                  >
                    <p className="text-xl font-semibold p-2">#{rank}</p>
                    <div className="flex flex-col justify-between">
                      <Text
                        color="primary"
                        variant="noMargin"
                        fontWeight="medium"
                        className="w-28 truncate"
                      >
                        {name}
                      </Text>
                      <div className="flex justify-between gap-4">
                        <Text color="secondary" variant="noMargin">
                          {`${location.STATE?.name}, ${location.COUNTRY?.name}`}
                        </Text>
                        <Text color="secondary" variant="noMargin">
                          {format(new Date(startDateTime), "MMM dd")}
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
        className={`flex items-center bg-[#FAFAFA] p-3 w-44 self-center rounded-sm shadow-md ${
          activeIndex === totalSlides - 2
            ? "cursor-not-allowed"
            : "cursor-pointer"
        } swiper-button-next-${id}`}
        disabled={activeIndex === totalSlides - 2}
      >
        <Text color="secondary" variant="noMargin" className="w-full">
          see more events
        </Text>
        <ArrowDown width={15} height={15} color="#E5484D" />
      </button>
    </div>
  );
};

const RankContainer = ({
  // rank,
  // name,
  rankData,
  rankType,
  eventDetails,
}: {
  // rank: number;
  // name: string;
  rankType: string;
  eventDetails: Event;
  rankData: RankingData;
}) => {
  const { maxRank, currentEvent } = rankData;
  const { categoryId, rank, location } = currentEvent;
  const { categories } = eventDetails;
  const categoryName =
    categoryId &&
    categories?.find((category) => category.id === categoryId)?.name;
  return (
    <div className="flex flex-col p-3 rounded-sm gap-6 w-fit h-auto items-center">
      <div className="flex flex-col items-center border border-[var(--neutral-light-color)] w-48 rounded-sm">
        <p className="text-3xl font-semibold p-2">{rank}</p>
        <Text
          color="secondary"
          variant="noMargin"
          fontWeight="medium"
          className="bg-[#F2F2F2] w-full p-2 text-center"
        >
          {rankType}
        </Text>
      </div>
      <div>
        <Text color="secondary" className="text-center">
          #{rank} of {maxRank} in
        </Text>
        <p className="text-[#6750A4] text-center font-medium">
          <span
            className={`${
              rankType === "Country + Category Rank"
                ? "text-[var(--highlight-text-color)]"
                : ""
            }`}
          >
            {rankType === "Country Rank"
              ? location.COUNTRY?.name
              : rankType === "Category Rank"
              ? categoryName
              : rankType === "Country + Category Rank"
              ? location.COUNTRY?.name
              : ""}
          </span>
          <span className="ml-2">
            {rankType === "Country + Category Rank" ? categoryName : ""}
          </span>
        </p>
      </div>
      <EventRankCarousel
        id={rank}
        rankData={rankData}
        rankType={rankType}
        eventDetails={eventDetails}
      />
    </div>
  );
};

export const EventRank = ({
  rankings,
  eventDetails,
  eventRankingDetails,
}: {
  rankings: NonNullable<Event["insights"]>["rankings"] | null | undefined;
  eventDetails: Event;
  eventRankingDetails: OverallRankingsDetail;
}) => {
  const { morphedData } = useFilterContext();

  const { categories, eventLocation } =
    (eventDetails && eventDetails.basic) || {};
  const minCategory =
    rankings &&
    rankings.categories &&
    rankings.categories.reduce((min, category) => {
      return category < min ? category : min;
    }, rankings.categories[0]);

  const categoryRank =
    minCategory &&
    Object.assign(minCategory, {
      rank: minCategory.rank,
      category: categories?.find((category) => category.id === minCategory.id)
        ?.name,
    });
  const countryRank = rankings && rankings.country && {
    rank: rankings.country?.rank,
    country:
      eventLocation?.country.id === rankings.country?.id
        ? eventLocation?.country.name
        : "",
  };
  const minCategoryCountry =
    rankings.category_country &&
    rankings.category_country.reduce((min, category) => {
      return category < min ? category : min;
    }, rankings.category_country[0]);
  const categoryCountryRank =
    minCategoryCountry &&
    Object.assign(minCategoryCountry, {
      rank: minCategoryCountry.rank,
      category: categories?.find(
        (category) => category.id === minCategoryCountry?.categoryId
      )?.name,
      country:
        eventLocation?.country.id === minCategoryCountry?.countryId &&
        eventLocation?.country.name,
    });

  const { category, category_country, country } = eventRankingDetails;

  const rankComponents = (
    <div className="flex flex-row justify-center max-[1400px]:hidden">
      {countryRank && country && Object.keys(country).length > 0 && (
        <RankContainer
          rankData={country}
          eventDetails={eventDetails}
          rankType={"Country Rank"}
        />
      )}
      {categoryRank && category && Object.keys(category).length > 0 && (
        <RankContainer
          rankData={category}
          rankType={"Category Rank"}
          eventDetails={eventDetails}
        />
      )}
      {categoryCountryRank &&
        category_country &&
        Object.keys(category_country).length > 0 && (
          <RankContainer
            rankData={category_country}
            rankType={"Country + Category Rank"}
            eventDetails={eventDetails}
          />
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
        {countryRank && country && Object.keys(country).length > 0 && (
          <SwiperSlide style={{ display: "flex", justifyContent: "center" }}>
            <RankContainer
              rankData={country}
              eventDetails={eventDetails}
              rankType={"Country Rank"}
            />
          </SwiperSlide>
        )}
        {categoryRank && category && Object.keys(category).length > 0 && (
          <SwiperSlide style={{ display: "flex", justifyContent: "center" }}>
            <RankContainer
              rankData={category}
              rankType={"Category Rank"}
              eventDetails={eventDetails}
            />
          </SwiperSlide>
        )}
        {categoryCountryRank &&
          category_country &&
          Object.keys(category_country).length > 0 && (
            <SwiperSlide style={{ display: "flex", justifyContent: "center" }}>
              <RankContainer
                rankData={category_country}
                rankType={"Country + Category Rank"}
                eventDetails={eventDetails}
              />
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
        <h1 className="text-[1rem] font-medium w-full">Event Ranking</h1>
        {rankComponents}
        {swiperRankComponents}
      </div>
    </>
  );
};
