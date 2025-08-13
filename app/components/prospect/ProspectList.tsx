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
import {
  companyListData,
  CompanyListResponse,
  CompanyDetail,
} from "@/types/prospect";
import { useQuery } from "@tanstack/react-query";
import { localStorage as localStore } from "@/services/storageService";
import { isEventeli } from "@/config";
import { Buildings, Location } from "geist-icons";
import { Bookmark, BookmarkCheck, Filter, FilterX } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

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

const BOOKMARK_KEY = `whr.${isEventeli ? "geo" : "gtm"}.company.bookmark`;

const EXCLUDED_COMPANY_NAMES: string[] = [
  "ten times online private limited.",
  "unknown organisers",
  "to be mapped",
];

interface CircularProgressProps {
  value: number | null;
  label?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value = 0,
  label,
}) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;

  const getColorByValue = (value: number | null): string => {
    if (value == null) return "text-[#398e4a]";
    if (value <= 25) return "text-[#398e4a]";
    if (value <= 50) return "text-[#FFD70A]";
    if (value <= 75) return "text-[#FF990A]";
    return "text-[#DA2F35]";
  };

  const className = getColorByValue(value);

  return (
    <div className="text-center">
      <div className="relative inline-flex">
        <div className="absolute inset-0 flex items-center justify-center bg-white/10 rounded-full dark:bg-black/60 backdrop-blur-sm z-10">
          <span className="text-[10px] font-semibold text-gray-600">
            Coming Soon
          </span>
        </div>
        <svg className="w-[52px] h-[52px]" aria-hidden="true">
          <circle
            className="text-gray-200"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="26"
            cy="26"
          />
          <circle
            className={className}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (value ? (value / 100) * circumference : 0)
            }
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="26"
            cy="26"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
          aria-hidden="true"
        >
          {value ? value : "-"}
        </span>
      </div>
      {label && <p className="text-xs border-[#EBEBEB] border bg-white dark:bg-[#171717] rounded p-1">
        {label}
      </p>}
    </div>
  );
};

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
  toggleSelection: (
    id: string,
    website?: string | null | undefined,
    name?: string | null | undefined
  ) => void;
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

const ProspectCard: React.FC<
  ProspectCardProps & { onBookmarkChange?: () => void }
> = ({
  companyDetail,
  isBulkActionActive,
  selectedCompaniesIds,
  toggleSelection,
  onBookmarkChange,
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [faviconError, setFaviconError] = useState(false);
  const [sourceLogoError, setSourceLogoError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = localStore.get<string[]>(BOOKMARK_KEY) || [];
    setIsBookmarked(bookmarks.includes(companyDetail.id));
  }, [companyDetail.id]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    let bookmarks = localStore.get<string[]>(BOOKMARK_KEY) || [];
    if (bookmarks.includes(companyDetail.id)) {
      bookmarks = bookmarks.filter((id) => id !== companyDetail.id);
      setIsBookmarked(false);
    } else {
      bookmarks = [...bookmarks, companyDetail.id];
      setIsBookmarked(true);
    }
    localStore.set(BOOKMARK_KEY, bookmarks);
    if (onBookmarkChange) onBookmarkChange();
    toast({
      title: "Success",
      description: "Your interest has been recorded",
      variant: "default",
    });
  };

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

  const getHostURL = (url: string) => {
    return new URL(url).hostname;
  };

  return (
    <div className="flex gap-4 w-full items-center">
      {isBulkActionActive && (
        <Checkbox
          checked={companyDetail.id in selectedCompaniesIds}
          onCheckedChange={() =>
            toggleSelection(
              companyDetail.id,
              companyDetail.website,
              companyDetail.name
            )
          }
        />
      )}
      <div className="bg-background rounded-lg border shadow-sm relative w-full transition-colors duration-200 hover:bg-accent cursor-pointer">
        {/* Bookmark Icon */}
  
        <Link href={`/internal/company/${companyDetail.id}`} className="block">
        <div className="p-4">
          <div className="flex gap-2 md:gap-6">
            {/* Logo with fallbacks (unchanged) */}
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
              {companyDetail.logo && !sourceLogoError ? (
                <img
                  src={companyDetail.logo}
                  alt={`${companyDetail.name} logo`}
                  className="w-16 h-16 object-contain rounded-lg shadow-lg bg-white border"
                  onError={() => {
                    setSourceLogoError(true);
                  }}
                  width={64}
                  height={64}
                />
              ) : companyDetail.website && !faviconError ? (
                <div className="w-16 h-16 relative">
                  <img
                    src={`https://logo.clearbit.com/${getHostURL(
                      companyDetail.website
                    )}`}
                    alt={`${companyDetail.name} website favicon`}
                    className="w-16 h-16 object-contain p-2 border rounded-md bg-white shadow-sm"
                    onError={(e) => {
                      setFaviconError(true);
                    }}
                  />
                  {/* Fallback that shows when image errors */}
                  {faviconError && (
                    <div className="w-16 h-16 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center absolute top-0 left-0">
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
            {/* Main grid content for info and relevance */}
            <div className="flex gap-2 flex-col w-full">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
                {/* Left: Main info */}
                <div className="col-span-1 md:col-span-9 flex flex-col gap-2">
                  <div className="flex justify-between">
                  <div className="text-lg md:text-xl font-semibold">
                    {companyDetail.name}
                  </div>
                  <Button
                  className="md:hidden "
          onClick={handleBookmark}
          variant="ghost"
          size="icon"
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 text-primary" />
          ) : (
            <Bookmark className="w-5 h-5 text-primary" />
          )}
        </Button>

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
                          <Buildings
                            color="#666666"
                            width="14px"
                            height="14px"
                          />
                          {renderTags(companyDetail.event_categoryName)}
                        </>
                      )}
                      <span className="hidden md:block">
                        {filteredTags?.length > 0 &&
                          renderTags(filteredTags, "#")}
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
                {/* Right: Relevance/score */}
                <div className="col-span-1 md:col-span-3 flex gap-2 justify-end">
                  {/* Mobile: show two scores in a row, like mobile card */}
                  {!isMobile && 
                    <div className="w-min h-min border border-[#EBEBEB] dark:border-[#222] bg-[#FAFAFA] dark:bg-[#18181b] p-2 rounded">
                      <CircularProgress value={20} label="Relevance" />
                    </div>
                  }
                  <Button
                  className="hidden md:flex"
                    onClick={handleBookmark}
                    variant="ghost"
                    size="icon"
                    aria-label={
                      isBookmarked ? "Remove bookmark" : "Add bookmark"
                    }
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-primary" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-primary" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            </div>
            {isMobile && <div className="flex items-start justify-between gap-2 w-full">
              <div className="text-sm [color:var(--secondary-text-color)] dark:text-gray-400 font-medium">
              Relevance Score
          </div>
                      <div className="flex flex-col items-center">
                      <CircularProgress value={20} />
                      </div>
                    </div>}

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
  const [selectedView, setSelectedView] = useState(
    getFilterValue("upcomingEvents") === "true" ? "upcoming" : "all"
  ); // "all" || "upcoming" || "bookmarks"
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [bookmarkedCompanyDetails, setBookmarkedCompanyDetails] = useState<
    CompanyDetail[]
  >([]);
  const [loadingBookmarkedDetails, setLoadingBookmarkedDetails] =
    useState(false);

  useEffect(() => {
    setBookmarkedIds(localStore.get<string[]>(BOOKMARK_KEY) || []);
  }, []);

  const { getCompanyList, getCompanyDetailById } = useCompanyService();
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
  const value = Object.values(selectedData)
    .map((names) => names.orgWebsite)
    .join(",");

  const companies = useMemo(
    () =>
      (companyData?.companyData || []).filter(
        (company) =>
          !EXCLUDED_COMPANY_NAMES.includes(company.name?.trim().toLowerCase())
      ),
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
          if (company.website) {
            next[company.id] = {
              orgWebsite: company.website || "",
            };
          } else {
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

  function toggleSelection(
    id: string,
    website?: string | null | undefined,
    name?: string | null | undefined
  ) {
    setSelectedData((prev) => {
      const next = { ...prev };
      if (id in next) {
        delete next[id];
      } else {
        if (website) {
          next[id] = {
            orgWebsite: website || "",
          };
        } else {
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
    const orgNames: string[] = [];
    const orgWebsites: string[] = [];

    Object.values(selectedData).forEach((names) => {
      if (names.orgWebsite) {
        orgWebsites.push(names.orgWebsite);
      } else if (names.orgName) {
        orgNames.push(names.orgName);
      }
    });

    const filterValues = {
      ...(orgNames.length > 0 && { orgName: orgNames.join(",") }),
      ...(orgWebsites.length > 0 && { orgWebsite: orgWebsites.join(",") }),
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
    const excludedFilters = ["view", "sortBy", "offset", "limit","upcomingEvents"];
    return Object.keys(localFilters).filter(
      (key) => !excludedFilters.includes(key)
    ).length;
  })();

  const onTabsChange = (value: string) => {
    if (value === "all") {
      setFilter("upcomingEvents", "false");
      setShowBookmarkedOnly(false);
      setSelectedView("all");
    } else if (value === "upcoming") {
      setFilter("upcomingEvents", "true");
      setShowBookmarkedOnly(false);
      setSelectedView("upcoming");
    } else if (value === "bookmarks") {
      setShowBookmarkedOnly(true);
      setSelectedView("bookmarks");
    } else {
      setShowBookmarkedOnly(false);
      setSelectedView(value);
    }
    setShowViewDropdown(false);
  };

  const toggleFilterHandler = () => {
    if (showFilters) {
      setShowFilter(false);
    } else {
      setShowFilter(true);
    }
  };

  // Helper to update bookmarks after toggling
  const refreshBookmarks = useCallback(() => {
    setBookmarkedIds(localStore.get<string[]>(BOOKMARK_KEY) || []);
  }, []);

  // Fetch details for all bookmarked companies when bookmarks view is active
  useEffect(() => {
    const fetchBookmarkedDetails = async () => {
      if (!showBookmarkedOnly || bookmarkedIds.length === 0) {
        setBookmarkedCompanyDetails([]);
        setLoadingBookmarkedDetails(false);
        return;
      }
      setLoadingBookmarkedDetails(true);
      try {
        const details = await Promise.all(
          bookmarkedIds.map(async (id) => {
            try {
              const res = await getCompanyDetailById(id);
              return res?.companyData || null;
            } catch {
              return null;
            }
          })
        );
        setBookmarkedCompanyDetails(details.filter(Boolean) as CompanyDetail[]);
      } finally {
        setLoadingBookmarkedDetails(false);
      }
    };
    fetchBookmarkedDetails();
    // Only refetch when bookmarks view or ids change
  }, [showBookmarkedOnly, bookmarkedIds]);

  // Filter companies based on bookmarks if showBookmarkedOnly is true
  const filteredCompanies = useMemo(() => {
    if (showBookmarkedOnly) {
      // If we have loaded detailed data, use it
      if (bookmarkedCompanyDetails.length > 0) {
        // Map CompanyDetail to companyListData shape for ProspectCard
        return bookmarkedCompanyDetails.map((detail) => ({
          id: detail.id,
          name: detail.name,
          logo: detail.logo,
          description: detail.description,
          website: detail.website,
          location: {
            cityId:
              detail.location.cityId === null
                ? null
                : String(detail.location.cityId),
            cityName: detail.location.cityName,
            countryId: detail.location.countryId,
            countryName: detail.location.countryName,
            countryZone: null, // Ensure required property for companyListData
          },
          stats: {
            totalEvents: detail.stats.totalEvents,
            upcomingEvents: detail.stats.upcomingEvents,
            totalLeads: detail.stats.totalLeads,
            totalExhibit: detail.eventExhibited ?? null,
            totalVisitor: detail.visitor ?? null,
            totalSponsor: detail.eventSponsored ?? null,
            lastLogin: null,
          },
          company_linkedEvents: detail.linkedEvent ?? null,
          company_tag: detail.company_tag,
          event_categoryName:
            detail.industries?.asOrganizer?.map((i) => i.name) || [],
          event_tagName: [],
          social: {
            facebookId: null,
            linkedinId: null,
            twitterId: null,
          },
        }));
      }
      // If not loaded yet, return empty array to avoid showing stale data
      return [];
    }
    return companies;
  }, [companies, showBookmarkedOnly, bookmarkedCompanyDetails]);

  // Update count for badge
  const filteredCount = showBookmarkedOnly ? filteredCompanies.length : count;

  return (
    <div className="flex flex-col w-full md:px-6">
      {/* Mobile heading: flex, visible only on mobile */}
      <div className="flex justify-between items-center !sticky !top-[68px] md:!top-0 bg-background z-50 transition-padding duration-200 md:py-3 pt-4 pb-4 px-4 md:px-0 md:hidden">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-white text-xs whitespace-nowrap font-medium md:font-semibold">
            {new Intl.NumberFormat("en", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(filteredCount)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
      {!isEventeli && <Link href="/collections">
            <Button variant="outline" size="sm">
              Collections
            </Button>
          </Link>}
          {/* Tabs for All, Upcoming, Newly Listed (disabled) */}
          <Select value={selectedView} onValueChange={onTabsChange}>
            <SelectTrigger className="w-[110px] border-gray-300">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="bookmarks">Bookmarked</SelectItem>
              <SelectItem
                value="newly-listed"
                disabled
                className="flex items-center gap-2 pointer-events-none"
                tabIndex={-1}
                aria-disabled="true"
              >
                <span>Newly Listed</span>
                <span className="ml-2 px-1 rounded w-min text-[9px] bg-white text-black whitespace-nowrap shadow-sm select-none">
                  Coming Soon
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          {/* Bookmarks CTA for mobile */}

          <Button
            onClick={toggleFilterHandler}
            variant={filtersCount > 0 ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8 border relative"
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

      {/* Desktop heading: grid, visible only on md+ */}
      <div
        className={`hidden md:grid grid-cols-10 items-center !sticky !top-[76px] md:!top-0 bg-background z-50 transition-padding duration-200 md:py-3 md:pt-4 pb-4 px-4 md:px-0`}
      >
        {/* First part: Badge (col-span-2) */}
        <div className="col-span-1 flex items-center gap-2">
          <Badge className="bg-primary text-white text-xs whitespace-nowrap font-medium md:font-semibold">
            {new Intl.NumberFormat("en", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(filteredCount)}
          </Badge>
        </div>

        {/* Second part: Tabs (col-span-8) with bookmark button inside TabsList */}
        <div
          id="company-view-desktop"
          className="col-span-8 justify-center flex"
        >
          <Tabs
            defaultValue="all"
            value={selectedView}
            onValueChange={onTabsChange}
            className="mt-0"
          >
            <TabsList className="grid w-fit grid-cols-4 h-auto bg-muted/50 p-1 rounded-lg relative">
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
              <TabsTrigger
                value="bookmarks"
                className="flex items-center gap-2 py-2 px-4"
              >
                {/* <ListIcon className="h-4 w-4" /> */}
                <span>Bookmarked</span>
              </TabsTrigger>
              <TabsTrigger
                value="newly-listed"
                className="flex items-center gap-2 py-2 px-4 pointer-events-none relative"
                tabIndex={-1}
                aria-disabled="true"
              >
                <span>Newly Listed</span>
                <span className="absolute bottom-7 right-[-16px] w-min text-[9px] px-1 rounded bg-white text-black whitespace-nowrap shadow-sm select-none">
                  Coming Soon
                </span>
              </TabsTrigger>
              {/* Bookmark button inside TabsList, right-aligned */}
            </TabsList>
          </Tabs>
        </div>
        <div className="col-span-1"></div>
        {/* Removed the old col-span-2 bookmark button */}
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
          {isLoading || (showBookmarkedOnly && loadingBookmarkedDetails) ? (
            <div className="flex-1 items-center justify-center min-h-[400px]">
              <Loading />
            </div>
          ) : error ? (
            <div className="flex-1 items-center justify-center min-h-[400px]">
              <ZeroState
                text={(error as ApiError).message}
                errorStatusCode={(error as ApiError)?.statusCode}
              />
            </div>
          ) : count === 0 && !showBookmarkedOnly ? (
            <div className="flex-1 items-center justify-center min-h-[400px]">
              <NullState
                image={coordinateNullState}
                title="No Results Found"
                text="Try adjusting the filter criteria to refine your search"
              />
            </div>
          ) : showBookmarkedOnly && filteredCompanies.length === 0 ? (
            <div className="flex-1 items-center justify-center min-h-[400px]">
              <NullState
                image={coordinateNullState}
                title="No Bookmarks Found"
                text="You have not bookmarked any companies yet."
              />
            </div>
          ) : (
            <>
              {filteredCompanies.map((item) => (
                <ProspectCard
                  key={item.id}
                  companyDetail={item}
                  isBulkActionActive={isBulkActionActive}
                  selectedCompaniesIds={selectedData}
                  toggleSelection={toggleSelection}
                  onBookmarkChange={refreshBookmarks}
                />
              ))}
              {/* For pagination: only show if not showing bookmarks */}
              {!showBookmarkedOnly && (
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
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
