"use client";

import NullState from "@/app/components/trackers/nullState";
import { PaginationComponent } from "@/components/pagination";
import CreateTrackerDialog from "@/components/search/createTrackerDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useBulkAction } from "@/context/bulkAction";
import FilterContent from "@/components/search/FilterContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import ZeroState from "@/components/zerostate";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  isBulkActionActive: boolean;
  selectedCompaniesIds: Record<
    string,
    {
      orgWebsite?: string;
      orgName?: string;
    }
  >;
  toggleSelection: (id: string, website?: string | null | undefined, name?: string | null | undefined) => void;
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

const ProspectCard: React.FC<ProspectCardProps> = ({
  companyDetail,
  isBulkActionActive,
  selectedCompaniesIds,
  toggleSelection,
}) => {
  const { checkCompanyLogo } = useCompanyService();
  const isMobile = useIsMobile();
  const [faviconError, setFaviconError] = useState(false);

  // Compute logo URL
  const compLogo = useMemo(() => {
    if (companyDetail.logo) return companyDetail.logo;
    if (companyDetail.website && !faviconError) {
      return `https://logo.clearbit.com/${companyDetail.website}`;
    }
    return null;
  }, [companyDetail.logo, companyDetail.website, faviconError]);

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
     <div className="flex gap-4 w-full items-center">
      {isBulkActionActive && (
        <Checkbox
          checked={companyDetail.id in selectedCompaniesIds}
          onCheckedChange={() =>
            toggleSelection(companyDetail.id, companyDetail.website, companyDetail.name)
          }
        />
      )}
      <div className="bg-background rounded-xl border border-[var(--border-color)] shadow-sm relative w-full">
      <Link href={`/internal/company/${companyDetail.id}`} className="block">
        <div className="p-4 flex gap-6">
          {/* Logo with fallbacks (updated to match list.tsx) */}
          <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
            {companyDetail.logo ? (
              <img
                src={companyDetail.logo}
                alt={`${companyDetail.name} logo`}
                className="w-16 h-16 object-contain rounded-lg shadow-lg bg-white border"
                width={64}
                height={64}
              />
            ) : companyDetail.website && !faviconError ? (
              <div className="w-16 h-16 relative">
                <img
                  src={`https://logo.clearbit.com/${companyDetail.website}`}
                  alt={`${companyDetail.name} website favicon`}
                  className="w-16 h-16 object-contain p-2 border rounded-md bg-white shadow-sm"
                  onError={(e) => {
                    setFaviconError(true);
                  }}
                />
                {/* Fallback that shows when image errors */}
                {faviconError && (
                  <div
                    className="w-16 h-16 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center absolute top-0 left-0"
                  >
                    <span className="text-[#5055A3] text-lg font-semibold">
                      {companyDetail.name?.charAt(0) || "?"}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-16 h-16 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center">
                <span className="text-[#5055A3] text-lg font-semibold">
                  {companyDetail.name?.charAt(0) || "?"}
                </span>
              </div>
            )}
          </div>
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
  </div>
  );
};

export const ProspectList: React.FC = () => {
  const searchParams = useSearchParams();
  const { getFilterValue, setMultipleFilters, setFilter } = useFilterState();
  const [showViewDropdown, setShowViewDropdown] = useState<boolean>(false);
  const selectedView = getFilterValue("upcomingEvents") === "true" ? "upcoming" : "all"; // "all" || "upcoming"
  
  const { getCompanyList } = useCompanyService();
  const {
    isBulkActionActive,
    selectedData,
    setSelectedData,
    setIsBulkActionActive,
  } = useBulkAction<{
    orgWebsite?: string;
    orgName?: string;
  }>();
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<any>();
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
  const value=Object.values(selectedData)
        .map((names) => names.orgWebsite)
        .join(",");
  
  
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
  const handleItemsPerPageChange = useCallback(
    (newItemsPerPage: string) => {
      setMultipleFilters({
        limit: newItemsPerPage,
      });
    },
    [setMultipleFilters]
  );
  const handlePageChange = useCallback(
    (page: number) => {
      setMultipleFilters({
        offset: ((page - 1) * itemsPerPage).toString(),
        limit: itemsPerPage.toString(),
      });
    },
    [itemsPerPage, setMultipleFilters]
  );
  function handleSelectAll(checked: boolean) {
    setSelectedData((prev) => {
      const next = { ...prev };

      if (checked) {
        // ADD all companies to next
        companies.forEach((company) => {
          if(company.website){
          next[company.id] = {
            orgWebsite: company.website || "",
          };
        }else{
          next[company.id] = {
            orgName: (company.name || "").replace(/,/g, ""),
          };
        }
        });
      } else {
        // REMOVE all companies from next
        companies.forEach((company) => {
          if (company.id in next) {
            delete next[company.id];
          }
        });
      }

      return next;
    });
  }

  function toggleSelection(id: string, website?: string | null | undefined, name?: string | null | undefined) {
    setSelectedData((prev) => {
      const next = { ...prev };
      if (id in next) {
        delete next[id];
      } else {
        if(website){
        next[id] = {
          orgWebsite: website || "",
        };
        }else{
          next[id] = {
          orgName: name || "",
        };
        }
      }
      return next;
    });
  }

  function handleCancel() {
    setIsBulkActionActive(false);
    setSelectedData({});
  }

  function handleCreate() {
    setTrackerModalOpen(true);
    const filterValues = {
      orgWebsite: Object.values(selectedData)
        .map((names) => names.orgWebsite)
        .join(","),
    };

    setFilterValues({ filterValues });
  }

  const isAllSelected = useMemo(() => {
    return (
      companies.length > 0 && companies.every((user) => user.id in selectedData)
    );
  }, [companies, selectedData]);
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

  const onTabsChange = (value: string) => {
    if (value === "all")
      setFilter("upcomingEvents", "false");
    else if (value === "upcoming")
      setFilter("upcomingEvents", "true");
    setShowViewDropdown(false);
  };

  const toggleFilterHandler = () => {
    if (showFilters) {
      setShowFilter(false);
    } else {
      setShowFilter(true);
    }
  };

  

  return (
    <div className="flex flex-col w-full md:px-6">
      <div
        className={`flex justify-between items-center !sticky !top-[76px] md:!top-0  bg-background z-50 transition-padding duration-200 md:py-3 md:pt-4 pb-4 px-4 md:px-0`}
      >
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-white text-xs whitespace-nowrap font-medium md:font-semibold">
            {new Intl.NumberFormat("en", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(count)}
          </Badge>
          {/* <p className="text-primary font-medium md:font-semibold text-sm md:text-base whitespace-nowrap">
            Companies
          </p> */}
        </div>

        <div
          id="company-view-desktop"
          className="justify-center hidden md:flex"
        >
          <Tabs
            defaultValue="all"
            value={selectedView}
            onValueChange={onTabsChange}
            className="mt-0"
          >
            <TabsList className="grid w-fit grid-cols-2 h-auto bg-muted/50 p-1 rounded-lg">
              <TabsTrigger
                value="all"
                className="flex items-center gap-2 py-2 px-4"
              >
                {/* <TableIcon className="h-4 w-4" /> */}
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="flex items-center gap-2 py-2 px-4"
              >
                {/* <ListIcon className="h-4 w-4" /> */}
                <span>Upcoming</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* <div className="flex justify-center"></div> */}
        <div className="flex items-center md:hidden justify-end gap-2">
          <Select
            value={selectedView}
            onValueChange={onTabsChange}
          >
            <SelectTrigger className="w-[110px] border-gray-300">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>

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
      {isBulkActionActive && (
        <div className="flex justify-between w-full items-center">
          <div className="flex gap-2 items-center md:py-4">
            <Checkbox
              className="rounded-sm"
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <label className="text-sm items-center justify-center">
              Select companies to create company tracker
              {Object.keys(selectedData).length > 0 && (
              <span className="pt-[2px] text-[var(--secondary-text-color)] text-[12px] ml-1">
                ({Object.keys(selectedData).length} Selected)
              </span>
            )}
            </label>
          </div>
          <div className="flex gap-2 item-center">
            <Button
              disabled={Object.keys(selectedData).length === 0}
              variant={"default"}
              className="h-8"
              onClick={() => handleCreate()}
            >
              Submit
            </Button>
            <Button
              variant={"outline"}
              className="h-8 text-destructive"
              onClick={() => handleCancel()}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {/* {companies.map((item) => (
        <ProspectCard
          key={item.id}
          companyDetail={item}
          isBulkActionActive={isBulkActionActive}
          selectedCompaniesIds={selectedData}
          toggleSelection={toggleSelection}
        />
      ))} */}
      {/* <div className="sticky bg-background py-2 border-t">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          count={count}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          paginationItems={["5", "10"]}
        />
      </div> */}

      <CreateTrackerDialog
        trackerType="companies"
        trackerPayloadFilterValues={filterValues}
        open={trackerModalOpen}
        onOpenChange={setTrackerModalOpen}
      />

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
        <div className="flex-1 flex gap-3 flex-col px-4 md:px-0">
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
              {companies.map((item) => (
                <ProspectCard
          key={item.id}
          companyDetail={item}
          isBulkActionActive={isBulkActionActive}
          selectedCompaniesIds={selectedData}
          toggleSelection={toggleSelection}
        />
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
