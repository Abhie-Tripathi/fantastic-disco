"use client";

import { PaginationComponent } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { useFilterState } from "@/hooks/useFilterState";
import { useCompanyService } from "@/services/companyService";
import { companyListData, CompanyListResponse } from "@/types/prospect";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  MouseEventHandler,
  ChangeEventHandler,
} from "react";
import Loading from "@/components/ui/Loading";
import NullState from "@/app/components/trackers/nullState";
import coordinateNullState from "@/public/coordinateNullState.svg";
import { ApiError } from "@/types/api";
import {
  ArrowUpRight,
  CalendarIcon,
  Globe,
  ListIcon,
  TableIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Buildings } from "geist-icons";
import { Location } from "geist-icons";
import { Button } from "@/components/ui/button";
import SortDropdown from "@/components/search/sortDropdown";
import EventCount from "@/components/search/eventCount";
import { useBulkAction } from "@/context/bulkAction";
import { Input } from "@/components/ui/input";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Label } from "@/components/ui/label";
import CreateTrackerDialog from "@/components/search/createTrackerDialog";

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
  selectedCompaniesIds: Set<string>;
  toggleSelection: (id: string) => void;
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
  const [compLogo, setCompLogo] = useState<string | null>(null);

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

  const renderTags = (tags: string[], prefix: string = "") =>
    tags.map((item) => (
      <span
        key={item}
        className="whitespace-nowrap text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-4 border-[#CCE6FF] border rounded-md w-fit"
      >
        {prefix}
        {item}
      </span>
    ));

  return (
    <div className="flex gap-4 w-full items-center">
      {isBulkActionActive && (
        <Checkbox
          checked={selectedCompaniesIds.has(companyDetail.id)}
          onCheckedChange={() => toggleSelection(companyDetail.id)}
        />
      )}
      <div className="bg-background rounded-xl border border-[var(--border-color)] shadow-sm relative w-full">
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
              <div className="text-xl font-semibold">{companyDetail.name}</div>
              {companyDetail?.description &&
                companyDetail.description.length > 10 && (
                  <div className="text-[#707287] text-sm line-clamp-2">
                    {companyDetail.description}
                  </div>
                )}

              <div className="flex flex-wrap gap-2">
                {locationDisplay && (
                  <div className="flex gap-2 items-center border-r w-fit pr-3">
                    <Location color="#666666" width="14px" height="14px" />
                    <span className="text-[#6E6F89] text-sm">
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

                  {filteredTags?.length > 0 && renderTags(filteredTags, "#")}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center w-fit">
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
  const { getFilterValue, setMultipleFilters } = useFilterState();
  const { getCompanyList } = useCompanyService();
  const { isBulkActionActive, setIsBulkActionActive } = useBulkAction();
  const [selectedCompaniesIds, setSelectedCompaniesIds] = useState<Set<string>>(
    new Set()
  );
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<any>();
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

  const handleItemsPerPageChange = useCallback(
    (newItemsPerPage: string) => {
      setMultipleFilters({
        limit: newItemsPerPage,
      });
    },
    [setMultipleFilters]
  );

  function handleSelectAll(checked: boolean) {
    if (checked) {
      const allIds = companies.map((company) => company.id);
      setSelectedCompaniesIds(new Set(allIds));
    } else {
      setSelectedCompaniesIds(new Set());
    }
  }

  function toggleSelection(id: string) {
    setSelectedCompaniesIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleCancel() {
    setIsBulkActionActive(false);
    setSelectedCompaniesIds(new Set());
  }

  function handleCreate() {
    setTrackerModalOpen(true);
    const filterValues = {
      filterValues: {
        orgWebsite: companies
          .filter((company) => selectedCompaniesIds.has(company.id))
          .map((company) => company.website || "")
          .join(","),
      },
    };

    setFilterValues(filterValues);
  }

  if (isLoading) {
    return (
      <div className="flex-1 items-center justify-center min-h-svh">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <NullState
        image={coordinateNullState}
        title={(error as ApiError).message}
      />
    );
  }

  if (count === 0) {
    return (
      <NullState
        image={coordinateNullState}
        title="No Results Found"
        text="Try adjusting the filter criteria to refine your search"
      />
    );
  }

  return (
    <div className="flex-1 flex gap-3 flex-col px-6">
      <div className="flex justify-between items-center sticky top-0 bg-background z-50 shadow-[0_1px_4px_-2px_rgba(21,34,50,0.078)] transition-padding duration-200 py-3 pt-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-white">
            {new Intl.NumberFormat("en", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(count)}
          </Badge>
          <p className="text-primary font-semibold">Companies Found</p>
        </div>
        <div className="flex justify-center"></div>
        <div className="flex justify-end gap-2">
          {/* Export and Sort buttons removed as they were disabled */}
        </div>
      </div>
      {isBulkActionActive && (
        <div className="flex gap-4">
          <div className="flex gap-2 items-center">
            <Checkbox
              className="rounded-sm"
              checked={selectedCompaniesIds.size === companies.length}
              onCheckedChange={handleSelectAll}
            />
            <label className="text-sm">Select All</label>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={selectedCompaniesIds.size === 0}
              variant={"default"}
              className="h-8"
              onClick={() => handleCreate()}
            >
              Create
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
      {companies.map((item) => (
        <ProspectCard
          key={item.id}
          companyDetail={item}
          isBulkActionActive={isBulkActionActive}
          selectedCompaniesIds={selectedCompaniesIds}
          toggleSelection={toggleSelection}
        />
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

      <CreateTrackerDialog
        trackerType="companies"
        trackerPayloadFilterValues={filterValues}
        open={trackerModalOpen}
        onOpenChange={setTrackerModalOpen}
      />
    </div>
  );
};
