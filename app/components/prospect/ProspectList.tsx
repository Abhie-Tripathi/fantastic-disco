"use client";

import NullState from "@/app/components/trackers/nullState";
import { PaginationComponent } from "@/components/pagination";
import FilterContent from "@/components/search/FilterContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import { useFilterContext } from "@/context/filterContext";
import { useFilterState } from "@/hooks/useFilterState";
import { useIsMobile } from "@/hooks/useMediaQuery";
import coordinateNullState from "@/public/coordinateNullState.svg";
import { useCompanyService } from "@/services/companyService";
import { ApiError } from "@/types/api";
import { companyListData, CompanyListResponse } from "@/types/prospect";
import { useQuery } from "@tanstack/react-query";
import { Buildings, Location } from "geist-icons";
import { Filter, FilterX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

// Constants
const EXCLUDED_TAGS = [
  "Core CRM",
  "All Paid",
  "Billing Company",
  "FLOOR Clients",
  "Complimentary Services",
  "Dead Account",
  "core-crm",
  "all-paid",
  "billing-company",
  "floor-clients",
  "complimentary-services",
  "dead-account",
] as const;

const DEFAULT_ITEMS_PER_PAGE = 10;
const CACHE_TIME = 300000; // 5 minutes
const STALE_TIME = 300000; // 5 minutes

// Types
interface ProspectCardProps {
  companyDetail: companyListData;
}

interface StatsBadgeProps {
  label: string;
  value: number | null;
}

// Components
const StatsBadge: React.FC<StatsBadgeProps> = ({ label, value }) => {
  if (value === null || value <= 0) return null;

  return (
    <Badge
      variant="secondary"
      className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
    >
      {label}: {value}
    </Badge>
  );
};

const ProspectCard: React.FC<ProspectCardProps> = ({ companyDetail }) => {
  const { checkCompanyLogo } = useCompanyService();
  const [compLogo, setCompLogo] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        if (companyDetail.logo !== null) {
          setCompLogo(companyDetail.logo);
          return;
        }

        if (companyDetail.website !== null) {
          const hasLogo = await checkCompanyLogo(companyDetail.website);
          if (hasLogo) {
            setCompLogo(`https://logo.clearbit.com/${companyDetail.website}`);
          }
        }
      } catch (error) {
        console.error("Error fetching company logo:", error);
        setCompLogo(null);
      }
    };

    fetchLogo();
  }, [
    companyDetail.id,
    companyDetail.logo,
    companyDetail.website,
    checkCompanyLogo,
  ]);

  const locationDisplay = useMemo(() => {
    const { cityName, countryName } = companyDetail.location || {};
    if (!cityName && !countryName) return null;

    return cityName === countryName
      ? cityName
      : [cityName, countryName].filter(Boolean).join(", ");
  }, [companyDetail.location]);

  const filteredTags = useMemo(() => {
    return companyDetail.company_tag
      ?.filter(
        (item): item is string =>
          Boolean(item) &&
          !EXCLUDED_TAGS.includes(item as (typeof EXCLUDED_TAGS)[number])
      )
      ?.slice(0, 2);
  }, [companyDetail.company_tag]);

  const renderTags = (tags: string[], prefix: string = "") => {
    const maxVisibleTags = isMobile ? 1 : 2;
    const visibleTags = tags.slice(0, maxVisibleTags);
    const remainingCount = tags.length - maxVisibleTags;

    return (
      <div className="flex flex-wrap gap-2 items-center">
        {visibleTags.map((item) => (
          <span
            key={item}
            className="whitespace-nowrap text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-4 border-[#CCE6FF] border rounded-md w-fit"
          >
            {prefix}
            {item}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="text-xs text-[#6E6F89]">+{remainingCount} more</span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-background rounded-xl border border-[var(--border-color)] shadow-sm relative">
      <Link href={`/internal/company/${companyDetail.id}`} className="block">
        <div className="p-4 flex gap-6">
          {compLogo && (
            <Image
              src={compLogo}
              alt={`${companyDetail.name} logo`}
              className="flex h-16 w-16 rounded-lg shadow-lg"
              width={200}
              height={200}
              priority={false}
            />
          )}
          <div className="flex gap-2 flex-col">
            <div className="text-lg md:text-xl font-semibold">
              {companyDetail.name}
            </div>
            {companyDetail?.description &&
              companyDetail.description.length > 10 && (
                <div className="text-xs md:text-sm text-[#707287] line-clamp-2">
                  {companyDetail.description}
                </div>
              )}

            <div className="flex flex-wrap gap-2">
              {locationDisplay && (
                <div className="flex gap-2 items-center border-r w-fit pr-3">
                  <Location color="#666666" width="14px" height="14px" />
                  <span className="text-xs md:text-sm text-[#6E6F89]">
                    {locationDisplay}
                  </span>
                </div>
              )}

              <div className="flex gap-2 items-center w-fit">
                {companyDetail.event_categoryName?.length > 0 && (
                  <>
                    <Buildings color="#666666" width="14px" height="14px" />
                    {renderTags(companyDetail.event_categoryName)}
                  </>
                )}

                <span className="hidden md:block">
                  {filteredTags?.length > 0 && renderTags(filteredTags, "#")}
                </span>
              </div>
            </div>

            <div className="hidden md:flex flex-wrap gap-2 items-center w-fit ">
              <StatsBadge
                label="Total Events"
                value={companyDetail.stats?.totalEvents}
              />
              <StatsBadge
                label="Upcoming Events"
                value={companyDetail.stats?.upcomingEvents}
              />
              <StatsBadge
                label="Events Exhibited"
                value={companyDetail.stats?.totalExhibit}
              />
              <StatsBadge
                label="Events Sponsored"
                value={companyDetail.stats?.totalSponsor}
              />
              <StatsBadge
                label="Events Visited"
                value={companyDetail.stats?.totalVisitor}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const ProspectList: React.FC = () => {
  const searchParams = useSearchParams();
  const { getFilterValue, setMultipleFilters } = useFilterState();
  const { getCompanyList } = useCompanyService();
  const { localFilters, deleteMultipleLocalFilters, applyFilters } =
    useFilterContext();
  const [showFilters, setShowFilter] = useState(false);

  const {
    data: companyData,
    error,
    isLoading,
  } = useQuery<CompanyListResponse | undefined>({
    queryKey: ["companies", searchParams.toString()],
    queryFn: () => getCompanyList(searchParams.toString()),
    refetchOnWindowFocus: false,
    gcTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });

  const companies = useMemo(
    () => companyData?.companyData || [],
    [companyData]
  );
  const count = useMemo(() => companyData?.totalCount || 0, [companyData]);

  const itemsPerPage = parseInt(
    getFilterValue("limit") || DEFAULT_ITEMS_PER_PAGE.toString()
  );
  const currentPage =
    Math.floor(parseInt(getFilterValue("offset") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(count / itemsPerPage);

  const handlePageChange = useCallback(
    (page: number) => {
      setMultipleFilters({
        offset: ((page - 1) * itemsPerPage).toString(),
        limit: itemsPerPage.toString(),
      });
    },
    [itemsPerPage, setMultipleFilters]
  );

  const searchHandler = useCallback(() => {
    applyFilters({ resetPage: true });
    setShowFilter(false);
  }, []);

  const filtersCount = (function () {
    const excludedFilters = ["view", "sortBy", "offset", "limit"];
    return Object.keys(localFilters).filter(
      (key) => !excludedFilters.includes(key)
    ).length;
  })();

  const toggleFilterHandler = () => {
    if (showFilters) {
      setShowFilter(false);
    } else {
      setShowFilter(true);
    }
  };

  const handleItemsPerPageChange = useCallback(
    (newItemsPerPage: string) => {
      setMultipleFilters({
        limit: newItemsPerPage,
      });
    },
    [setMultipleFilters]
  );

  return (
    <div className="flex flex-col">
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
            Companies Found
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
            type={"companies"}
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
              <NullState
                image={coordinateNullState}
                title={(error as ApiError).message}
              />
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
              {companies.map((item) => (
                <ProspectCard key={item.id} companyDetail={item} />
              ))}
              <div className="bg-background py-3">
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
