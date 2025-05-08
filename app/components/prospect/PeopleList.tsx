"use client";

import { PaginationComponent } from "@/components/pagination";
import { useFilterState } from "@/hooks/useFilterState";
import { useState, useEffect, useMemo, useCallback } from "react";
import { MailIcon, PhoneIcon } from "lucide-react";
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
import { useBulkAction } from "@/context/bulkAction";
import { Checkbox } from "@/components/ui/checkbox";
import CreateTrackerDialog from "@/components/search/createTrackerDialog";

// Constants
const DEFAULT_ITEMS_PER_PAGE = 10;
const CACHE_TIME = 300000; // 5 minutes
const STALE_TIME = 300000; // 5 minutes
const DEFAULT_USER_ICON = "/usersIcon.svg";

// Types
interface PeopleCardProps {
  poc: userListData;
  unlockPoc: (pocId: number | string) => Promise<void>;
  isBulkActionActive: boolean;
  selectedPeopleIds: Set<string>;
  toggleSelection: (id: string) => void;
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

const PeopleCard: React.FC<PeopleCardProps> = ({
  poc,
  unlockPoc,
  isBulkActionActive,
  selectedPeopleIds,
  toggleSelection,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(
    poc.user_profilePicture
  );

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

    return poc.top_event_categories.slice(0, 2).map((item) => (
      <span
        key={item.key}
        className="whitespace-nowrap text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-4 border-[#CCE6FF] border rounded-md w-fit"
      >
        {item.key}
      </span>
    ));
  }, [poc.top_event_categories]);

  const renderCountryZones = useCallback(() => {
    if (!poc.top_event_countryZone?.length) return null;

    return poc.top_event_countryZone.slice(0, 2).map((item) => (
      <Badge
        key={item.key}
        variant="secondary"
        className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
      >
        {item.key}
      </Badge>
    ));
  }, [poc.top_event_countryZone]);

  return (
    <div className="flex gap-4 w-full items-center">
      {isBulkActionActive && (
        <Checkbox
          checked={selectedPeopleIds.has(poc.user_id)}
          onCheckedChange={() => toggleSelection(poc.user_id)}
        />
      )}
      <div className="bg-background rounded-xl border shadow-sm relative w-full">
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
                    Speaker ({poc.speakingCount} events)
                  </Badge>
                )}

                {poc.attendCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                  >
                    {poc.attendCount} events attended
                  </Badge>
                )}
              </div>

              {poc.state !== 2 && (
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
    </div>
  );
};

export const PeopleList: React.FC = () => {
  const searchParams = useSearchParams();
  const { getFilterValue, setMultipleFilters } = useFilterState();
  const companyService = useCompanyService();
  const { isBulkActionActive, setIsBulkActionActive } = useBulkAction();
  const [selectedPeopleIds, setSelectedPeopleIds] = useState<Set<string>>(
    new Set()
  );
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<any>();

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

  function handleSelectAll(checked: boolean) {
    if (checked) {
      const allIds = filteredUsers.map((user) => user.user_id);
      setSelectedPeopleIds(new Set(allIds));
    } else {
      setSelectedPeopleIds(new Set());
    }
  }

  function toggleSelection(id: string) {
    setSelectedPeopleIds((prev) => {
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
    setSelectedPeopleIds(new Set());
  }

  function handleCreate() {
    setTrackerModalOpen(true);
    const filterValues = {
      filterValues: {
        userName: filteredUsers
          .filter((user) => selectedPeopleIds.has(user.user_id))
          .map((user) => user.user_name || "")
          .join(","),
        userOrgWebsite: filteredUsers
          .filter((user) => selectedPeopleIds.has(user.user_id))
          .map((user) => user.user_companyName || "")
          .join(","),
      },
    };

    setFilterValues(filterValues);
  }

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
    <div className="flex-1 px-6">
      <div className="flex justify-between items-center sticky top-0 bg-background z-50 shadow-[0_1px_4px_-2px_rgba(21,34,50,0.078)] transition-padding duration-200 py-3 pt-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-white">
            {new Intl.NumberFormat("en", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(count)}
          </Badge>
          <p className="text-primary font-semibold">People Found</p>
        </div>
        <div className="flex justify-center"></div>
        <div className="flex justify-end gap-2">
          {/* Export and Sort buttons removed as they were disabled */}
        </div>
      </div>
      {isBulkActionActive && (
        <div className="flex gap-4 py-3">
          <div className="flex gap-2 items-center">
            <Checkbox
              className="rounded-sm"
              checked={selectedPeopleIds.size === filteredUsers.length}
              onCheckedChange={handleSelectAll}
            />
            <label className="text-sm">Select All</label>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={selectedPeopleIds.size === 0}
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
      <div className="flex gap-3 flex-col">
        {filteredUsers.map((item) => (
          <PeopleCard
            key={item.user_id}
            poc={item}
            unlockPoc={unlockPoc}
            isBulkActionActive={isBulkActionActive}
            selectedPeopleIds={selectedPeopleIds}
            toggleSelection={toggleSelection}
          />
        ))}
      </div>
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
        trackerType="people"
        trackerPayloadFilterValues={filterValues}
        open={trackerModalOpen}
        onOpenChange={setTrackerModalOpen}
      />
    </div>
  );
};
