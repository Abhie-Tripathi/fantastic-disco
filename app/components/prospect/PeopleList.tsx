"use client";

import { PaginationComponent } from "@/components/pagination";
import { useFilterState } from "@/hooks/useFilterState";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Filter, FilterX, MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanyService } from "@/services/companyService";
import { Location } from "geist-icons";
import { Badge } from "@/components/ui/badge";
import { CompanyListResponse, userListData } from "@/types/prospect";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/ui/Loading";
import NullState from "@/app/components/trackers/nullState";
import coordinateNullState from "@/public/coordinateNullState.svg";
import { ApiError } from "@/types/api";
import Link from "next/link";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useFilterContext } from "@/context/filterContext";
import FilterContent from "@/components/search/FilterContent";
import ZeroState from "@/components/zerostate";

// Constants
const DEFAULT_ITEMS_PER_PAGE = 10;
const CACHE_TIME = 300000; // 5 minutes
const STALE_TIME = 300000; // 5 minutes
const DEFAULT_USER_ICON = "/usersIcon.svg";

// Types
interface PeopleCardProps {
  poc: userListData;
  unlockPoc: (pocId: number | string) => Promise<void>;
}

interface ContactInfoProps {
  email: string | null | undefined;
  phoneNumber: string | null | undefined;
}

// Components
const ContactInfo: React.FC<ContactInfoProps> = ({ email, phoneNumber }) => (
  <div className="w-full">
    <p className="text-[#666666] flex items-center gap-2 text-[12px]">
      <MailIcon width="12px" height="12px" className="self-start mt-1" />
      <span className="break-all">{email || "-"}</span>
    </p>
    <p className="text-[#666666] flex items-center gap-2 text-[12px]">
      <PhoneIcon width="12px" height="12px" />
      <span>{phoneNumber || "-"}</span>
    </p>
  </div>
);

const PeopleCard: React.FC<PeopleCardProps> = ({ poc, unlockPoc }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(
    poc.user_profilePicture
  );
  const isMobile = useIsMobile();

  const handleImageError = useCallback(() => {
    setImageSrc(DEFAULT_USER_ICON);
  }, []);

  const locationDisplay = useMemo(() => {
    if (!poc.user_city && !poc.user_country) return null;
    return poc.user_city === poc.user_country
      ? poc.user_city
      : [poc.user_city, poc.user_country].filter(Boolean).join(", ");
  }, [poc.user_city, poc.user_country]);

  const renderEventCategories = useCallback(() => {
    if (!poc.top_event_categories?.length) return null;

    const maxVisibleTags = isMobile ? 1 : 2;
    const visibleCategories = poc.top_event_categories.slice(0, maxVisibleTags);
    const remainingCount = poc.top_event_categories.length - maxVisibleTags;

    return (
      <div className="flex flex-wrap gap-2 items-center">
        {visibleCategories.map((item) => (
          <span
            key={item.key}
            className="whitespace-nowrap text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-4 border-[#CCE6FF] border rounded-md w-fit"
          >
            {item.key}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="text-xs text-[#6E6F89]">+{remainingCount} more</span>
        )}
      </div>
    );
  }, [poc.top_event_categories, isMobile]);

  const renderCountryZones = useCallback(() => {
    if (!poc.top_event_countryZone?.length) return null;

    const maxVisibleTags = isMobile ? 1 : 2;
    const visibleZones = poc.top_event_countryZone.slice(0, maxVisibleTags);
    const remainingCount = poc.top_event_countryZone.length - maxVisibleTags;

    return (
      <div className="flex flex-wrap gap-2 items-center">
        {visibleZones.map((item) => (
          <Badge
            key={item.key}
            variant="secondary"
            className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
          >
            {item.key}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <span className="text-xs text-[#6E6F89]">+{remainingCount} more</span>
        )}
      </div>
    );
  }, [poc.top_event_countryZone, isMobile]);

  return (
    <div className="bg-background rounded-xl border shadow-sm relative">
      <Link href={`/internal/user/${poc.user_id}`} className="block">
        <div className="p-4 flex gap-6">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={`${poc.user_name}'s profile picture`}
              className="flex h-16 w-16 rounded-lg shadow-lg border"
              width={200}
              height={200}
              onError={handleImageError}
              priority={false}
            />
          )}
          <div className="flex gap-2 flex-col w-full">
            <div className="flex justify-between">
              <div className="text-xl font-semibold">{poc.user_name}</div>
            </div>

            <div className="text-[#6E6F89] text-xs font-medium">
              {poc.user_designationName}
              {poc.user_companyName && <>, {poc.user_companyName}</>}
            </div>

            {locationDisplay && (
              <div className="flex gap-2 items-center w-fit pr-3">
                <Location color="#666666" width="14px" height="14px" />
                <span className="text-[#6E6F89] text-sm">
                  {locationDisplay}
                </span>
              </div>
            )}

            {poc.about && poc.about.length > 10 && (
              <div className="text-[#707287] text-sm line-clamp-4">
                {poc.about}
              </div>
            )}

            <div className="flex flex-wrap gap-2 items-center w-fit">
              {renderEventCategories()}
              {renderCountryZones()}

              {poc.speakingCount > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                >
                  Speaker {!isMobile ? `${poc.speakingCount} events` : ""}
                </Badge>
              )}

              {poc.attendCount > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                >
                  {poc.attendCount} events {isMobile ? "" : "attended"}
                </Badge>
              )}
            </div>

            {poc.state !== 2 && !isMobile && (
              <div className="mt-1" onClick={(e) => e.preventDefault()}>
                <Button
                  disabled={poc.state === 1}
                  onClick={() => unlockPoc(poc.user_id)}
                  variant="default"
                  size="sm"
                  className="blur-none"
                >
                  Unlock Contact
                </Button>
              </div>
            )}

            {poc.state === 2 && (
              <ContactInfo email={poc.email} phoneNumber={poc.phoneNumber} />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export const PeopleList: React.FC = () => {
  const searchParams = useSearchParams();
  const { getFilterValue, setMultipleFilters } = useFilterState();
  const companyService = useCompanyService();
  const [showFilters, setShowFilter] = useState(false);
  const { localFilters, deleteMultipleLocalFilters, applyFilters } =
    useFilterContext();

  const {
    data: companyData,
    error,
    isLoading,
  } = useQuery<CompanyListResponse | undefined>({
    queryKey: ["people", searchParams.toString()],
    queryFn: () => companyService.getPeopleList(searchParams.toString()),
    refetchOnWindowFocus: false,
    gcTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });

  const [companyUsers, setCompanyUsers] = useState<userListData[]>([]);
  const people = useMemo(() => companyData?.userData || [], [companyData]);
  const count = useMemo(() => companyData?.totalCount || 0, [companyData]);

  useEffect(() => {
    setCompanyUsers(people);
  }, [people]);

  const itemsPerPage = parseInt(
    getFilterValue("limit") || DEFAULT_ITEMS_PER_PAGE.toString()
  );
  const currentPage =
    Math.floor(parseInt(getFilterValue("offset") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(count / itemsPerPage) - 1;

  const handlePageChange = useCallback(
    (page: number) => {
      setMultipleFilters({
        offset: ((page - 1) * itemsPerPage).toString(),
        limit: itemsPerPage.toString(),
      });
    },
    [itemsPerPage, setMultipleFilters]
  );

  const handleItemsPerPageChange = useCallback(
    (newItemsPerPage: string) => {
      setMultipleFilters({
        limit: newItemsPerPage,
      });
    },
    [setMultipleFilters]
  );

  const toggleFilterHandler = () => {
    if (showFilters) {
      setShowFilter(false);
    } else {
      setShowFilter(true);
    }
  };

  const searchHandler = useCallback(() => {
    applyFilters({ resetPage: true });
    setShowFilter(false);
  }, []);

  const filtersCount = (function () {
    const excludedFilters = ["view", "sortBy", "offset", "limit", "show"];
    return Object.keys(localFilters).filter(
      (key) => !excludedFilters.includes(key)
    ).length;
  })();

  const unlockPoc = useCallback(
    async (pocId: number | string) => {
      try {
        setCompanyUsers((prevPocData) =>
          prevPocData.map((poc) =>
            poc.user_id === pocId ? { ...poc, state: 1 } : poc
          )
        );

        const data = await companyService.unlockUserDetail(pocId);
        if (data) {
          setCompanyUsers((prevPocData) =>
            prevPocData.map((poc) =>
              poc.user_id === pocId
                ? {
                    ...poc,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    state: 2,
                  }
                : poc
            )
          );
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },
    [companyService]
  );

  const filteredUsers = useMemo(
    () =>
      companyUsers.filter(
        (item) => item.user_name !== null && item.user_profilePicture !== null
      ),
    [companyUsers]
  );

  return (
    <div className="flex flex-col w-full">
      <div
        className={`flex justify-between items-center !sticky !top-[76px] md:!top-0  bg-background z-50 shadow-[0_1px_4px_-2px_rgba(21,34,50,0.078)] transition-padding duration-200 md:py-3 md:pt-4 px-4 pb-4`}
      >
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-white text-xs whitespace-nowrap font-medium md:font-semibold">
            {new Intl.NumberFormat("en", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(count)}
          </Badge>
          <p className="text-primary font-medium md:font-semibold text-sm md:text-base whitespace-nowrap">
            People
          </p>
        </div>
        <div className="flex justify-center"></div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={toggleFilterHandler}
            variant={filtersCount > 0 ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8 border relative  md:hidden"
          >
            <Filter className="w-4 h-4" />
            {filtersCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                {filtersCount}
              </div>
            )}
          </Button>
        </div>
      </div>

      {showFilters ? (
        <>
          <FilterContent
            type={"people"}
            filterCount={filtersCount}
            searchHandler={searchHandler}
          />
          <div className="w-full sticky bottom-0 bg-background z-10">
            <div className="p-4 pb-0 border-t bg-background/80 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    deleteMultipleLocalFilters(
                      Object.keys(localFilters) as any[]
                    );
                  }}
                  disabled={filtersCount === 0}
                  className="text-xs text-[#6E6F89] hover:text-primary hover:bg-transparent p-0 h-auto font-normal"
                >
                  <FilterX className="w-3.5 h-3.5 mr-1" />
                  Reset all filters
                </Button>
                <span className="text-xs text-[#6E6F89]">
                  {filtersCount} filters applied
                </span>
              </div>
              <Button onClick={searchHandler} className="w-full h-10">
                Apply Filters
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex gap-3 flex-col px-4 md:px-6">
          {isLoading ? (
            <div className="flex-1 items-center justify-center min-h-[400px]">
              <Loading />
            </div>
          ) : error ? (
            <div className="flex-1 items-center justify-center min-h-[400px]">
              <ZeroState text={(error as ApiError).message} errorStatusCode={(error as ApiError)?.statusCode} />
            </div>
          ) : count === 0 ? (
            <div className="flex-1 items-center justify-center min-h-[400px]">
              <NullState
                image={coordinateNullState}
                title="No Results Found"
                text="Try adjusting the filter criteria to refine your search"
              />
            </div>
          ) : (
            <>
              {filteredUsers.map((item) => (
                <PeopleCard key={item.user_id} poc={item} unlockPoc={unlockPoc} />
              ))}
              <div className="sticky bg-background py-2 border-t">
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  count={count}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  paginationItems={["5", "10"]}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
