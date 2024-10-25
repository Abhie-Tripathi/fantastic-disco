"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import Text from "../new-ui/Text";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { useRef } from "react";
import { Event, RankingDetail } from "@/types";

interface EventRank {
  id?: string;
  categoryId?: string;
  countryId?: string;
  country?: string;
  category?: string;
  rank: string;
}

const EventRankCarousel = ({ id }: { id: number }) => {
  const swiperRef = useRef(null);
  return (
    <div className="flex flex-col blur-sm">
      <button
        className={`flex items-center bg-[#FAFAFA] gap-2 p-3 w-44 self-center rounded-sm shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)] cursor-not-allowed swiper-button-prev-${id}`}
      >
        <Text color="secondary" variant="noMargin" className="w-full">
          see 3 more events
        </Text>
        <ArrowUp width={15} height={15} color="#45A557" />
      </button>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        direction="vertical"
        centeredSlides={true}
        slidesPerView={3}
        initialSlide={2}
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
      >
        <>
          <SwiperSlide className="h-fit w-fit bg-white z-40">
            <li className="flex flex-row gap-2 border border-[var(--neutral-light-color)] rounded-sm p-3">
              <p className="text-xl font-semibold p-2">#40</p>
              <div className="flex flex-col justify-between">
                <Text color="primary" variant="noMargin" fontWeight="medium" className="w-28 truncate">
                  Annual Immuno-Oncology Summit
                </Text>
                <div className="flex justify-between gap-4">
                  <Text color="secondary" variant="noMargin">
                    Philadelphia, USA
                  </Text>
                  <Text color="secondary" variant="noMargin">
                    July 27
                  </Text>
                </div>
              </div>
            </li>
          </SwiperSlide>
          <SwiperSlide className="h-fit w-fit bg-white z-40">
            <li className="flex flex-row gap-2 border border-[var(--neutral-light-color)] rounded-sm p-3">
              <p className="text-xl font-semibold p-2">#41</p>
              <div className="flex flex-col justify-between">
                <Text color="primary" variant="noMargin" fontWeight="medium" className="w-28 truncate">
                  Annual Immuno-Oncology Summit
                </Text>
                <div className="flex justify-between gap-4">
                  <Text color="secondary" variant="noMargin">
                    Philadelphia, USA
                  </Text>
                  <Text color="secondary" variant="noMargin">
                    July 27
                  </Text>
                </div>
              </div>
            </li>
          </SwiperSlide>
          <SwiperSlide className="h-fit w-fit bg-white z-40">
            <li className="flex flex-row gap-2 bg-[#A099E0] border border-[#A099E0] bg-opacity-[0.3] rounded-sm p-3">
              <p className="text-xl font-semibold p-2">#42</p>
              <div className="flex flex-col justify-between">
                <Text color="primary" variant="noMargin" fontWeight="medium" className="w-28 truncate">
                  Annual Immuno-Oncology Summit
                </Text>
                <div className="flex justify-between gap-4">
                  <Text color="secondary" variant="noMargin">
                    Philadelphia, USA
                  </Text>
                  <Text color="secondary" variant="noMargin">
                    July 27
                  </Text>
                </div>
              </div>
            </li>
          </SwiperSlide>
          <SwiperSlide className="h-fit w-fit bg-white z-40">
            <li className="flex flex-row gap-2 border border-[var(--neutral-light-color)] rounded-sm p-3">
              <p className="text-xl font-semibold p-2">#43</p>
              <div className="flex flex-col justify-between">
                <Text color="primary" variant="noMargin" fontWeight="medium" className="w-28 truncate">
                  Annual Immuno-Oncology Summit
                </Text>
                <div className="flex justify-between gap-4">
                  <Text color="secondary" variant="noMargin">
                    Philadelphia, USA
                  </Text>
                  <Text color="secondary" variant="noMargin">
                    July 27
                  </Text>
                </div>
              </div>
            </li>
          </SwiperSlide>
          <SwiperSlide className="h-fit w-fit bg-white z-40">
            <li className="flex flex-row gap-2 border border-[var(--neutral-light-color)] rounded-sm p-3">
              <p className="text-xl font-semibold p-2">#44</p>
              <div className="flex flex-col justify-between">
                <Text color="primary" variant="noMargin" fontWeight="medium" className="w-28 truncate">
                  Annual Immuno-Oncology Summit
                </Text>
                <div className="flex justify-between gap-4">
                  <Text color="secondary" variant="noMargin">
                    Philadelphia, USA
                  </Text>
                  <Text color="secondary" variant="noMargin">
                    July 27
                  </Text>
                </div>
              </div>
            </li>
          </SwiperSlide>
          <SwiperSlide className="h-fit w-fit bg-white z-40">
            <li className="flex flex-row gap-2 border border-[var(--neutral-light-color)] rounded-sm p-3">
              <p className="text-xl font-semibold p-2">#45</p>
              <div className="flex flex-col justify-between">
                <Text color="primary" variant="noMargin" fontWeight="medium" className="w-28 truncate">
                  Annual Immuno-Oncology Summit
                </Text>
                <div className="flex justify-between gap-4">
                  <Text color="secondary" variant="noMargin">
                    Philadelphia, USA
                  </Text>
                  <Text color="secondary" variant="noMargin">
                    July 27
                  </Text>
                </div>
              </div>
            </li>
          </SwiperSlide>
        </>
      </Swiper>
      <button
        className={`flex items-center bg-[#FAFAFA] gap-2 p-3 w-44 self-center rounded-sm shadow-md cursor-not-allowed swiper-button-next-${id}`}
      >
        <Text color="secondary" variant="noMargin">
          see 3 more events
        </Text>
        <ArrowDown width={15} height={15} color="#E5484D" />
      </button>
    </div>
  );
};

const RankContainer = ({
  rank,
  rankType,
  name,
}: {
  rank: number;
  rankType: string;
  name: string;
}) => {
  return (
    <div className="flex flex-col p-3 rounded-sm gap-6 w-auto h-auto items-center">
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
      <div className="blur-sm">
        <Text color="secondary" className="text-center">
          #{rank} of 1000 in
        </Text>
        <p className="text-[#6750A4] text-center font-medium">{name}</p>
      </div>
      <EventRankCarousel id={rank} />
    </div>
  );
};

export const EventRank = ({
  rankings,
  eventDetails,
}: {
  rankings: RankingDetail;
  eventDetails: Event;
}) => {
  const { categories, venueLocation } = eventDetails;
  const minCategory =
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
  const countryRank = rankings.country && {
    rank: rankings.country?.rank,
    country:
      venueLocation?.country.id === rankings.country?.id
        ? venueLocation?.country.name
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
        venueLocation?.country.id === minCategoryCountry?.countryId &&
        venueLocation?.country.name,
    });
  return (
    <>
      {(countryRank || categoryRank || categoryCountryRank) && (
        <div className="flex flex-row justify-center border border-[var(--neutral-light-color)] p-3 rounded-sm gap-6 w-fill h-auto">
          {countryRank && (
            <RankContainer
              rank={countryRank?.rank ?? 0}
              rankType={"Country Rank"}
              name={countryRank.country ?? ""}
            />
          )}
          {categoryRank && (
            <RankContainer
              rank={categoryRank.rank ?? 0}
              rankType={"Category Rank"}
              name={categoryRank.category ?? ""}
            />
          )}
          {categoryCountryRank && (
            <RankContainer
              rank={categoryCountryRank.rank ?? 0}
              rankType={"Country + Category Rank"}
              name={`${categoryCountryRank.country ?? ""} ${
                categoryCountryRank.category ?? ""
              }`}
            />
          )}
        </div>
      )}
    </>
  );
};
