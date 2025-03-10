"use client";

import { PaginationComponent } from "@/components/pagination";
import { useFilterState } from "@/hooks/useFilterState";
import { useState, useEffect } from "react";
import { ArrowUpRight, MailIcon, PhoneIcon } from "lucide-react";
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
import { TabsList } from "@/components/ui/tabs";
import EventCount from "@/components/search/eventCount";
import SortDropdown from "@/components/search/sortDropdown";

/*
const PeopleCard = ({
  poc,
  unlockPoc,
}: {
  poc: userDetail;
  unlockPoc: any;
}) => {
  return (
    <div
      className="card flex flex-col gap-3  w-full overflow-y-auto"
      style={{ padding: "12px" }}
    >
      <div className="flex bg-[#F8F8FA] dark:bg-[var(--heading-background-color)] rounded-md px-6 py-4">
        <img
          src={
            poc?.user_profilePicture
              ? poc?.user_profilePicture
              : `https://img.10times.com/userimages/${
                  poc?.user_name && poc?.user_name.charAt(0).toLowerCase()
                }.jpg`
          }
          alt="image"
          className="flex h-14 w-14 rounded-xl shadow-lg"
          width={50}
          height={50}
        />
      </div>
      <div className="flex flex-col gap-2 flex-1 flex-wrap relative">
        <Text className="min-h-5" fontWeight="medium" variant="noMargin">
          {poc?.user_name}
        </Text>
        <p className="text-[#666666] text-[12px] min-h-5">
          <span
            className="line-clamp-2 overflow-hidden"
            title={poc?.user_designationName ? poc?.user_designationName : ""}
          >
            {poc?.user_designationName}
          </span>
        </p>
        <div className={`${poc?.state !== 2 ? "blur-sm" : ""} w-full`}>
          <p className="text-[#666666] flex items-center gap-2 text-[12px]">
            <MailIcon width="12px" height="12px" className="self-start mt-1" />
            <span className="break-all">{poc?.email}</span>
          </p>
          <p className="text-[#666666] flex items-center gap-2 text-[12px]">
            <PhoneIcon width="12px" height="12px" />
            <span>{poc?.phoneNumber ? poc?.phoneNumber : "-"}</span>
          </p>
        </div>
        {poc?.state !== 2 && (
          <div className="absolute bottom-0 right-[30%]">
            <Button
              disabled={poc?.state && poc.state === 1 ? true : false}
              onClick={() => unlockPoc(poc.user_id)}
              variant={"default"}
              size={"sm"}
              className="blur-none"
            >
              Show details
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
*/

const PeopleCardNew = ({
  poc,
  unlockPoc,
}: {
  poc: userListData;
  unlockPoc: any;
}) => {
  const [imageSrc, setImageSrc] = useState(poc.user_profilePicture);

  const handleError = (err: any) => {
    setImageSrc("/usersIcon.svg");
  };

  console.log("peoplecard");

  return (
    <div className="bg-background rounded-xl border shadow-sm relative">
      <Link href={`/internal/user/${poc.user_id}`} className="block">
        <div className="p-4 flex gap-6">
          {imageSrc !== null && (
            <img
              src={imageSrc}
              alt="eventLogo"
              className="flex h-16 w-16 rounded-lg shadow-lg border"
              width={200}
              height={200}
              onError={handleError}
            />
          )}
          <div className="flex gap-2 flex-col w-full">
            <div className="flex justify-between">
              <div className="text-xl font-semibold">{poc.user_name}</div>
              {/* {poc?.state !== 2 && (
                <div className="">
                  <Button
                    disabled={poc?.state && poc.state === 1 ? true : false}
                    onClick={() => unlockPoc(poc.user_id)}
                    variant={"default"}
                    size={"sm"}
                    className="blur-none h-7"
                  >
                    Show details
                  </Button>
                </div>
              )} */}
            </div>

            <div className="text-[#6E6F89] text-xs font-medium">
              {poc.user_designationName}
              {poc.user_companyName !== null && <>, {poc.user_companyName}</>}
            </div>

            <div className="flex flex-wrap gap-2">
              {(poc?.user_city !== null || poc?.user_country !== null) && (
                <div className="flex gap-2 items-center w-fit pr-3">
                  <Location color="#666666" width="14px" height="14px" />
                  <span className="text-[#6E6F89] text-sm">
                    {poc.user_city === poc?.user_country
                      ? poc.user_city
                      : [poc.user_city, poc.user_country]
                          .filter(Boolean)
                          .join(", ")}
                  </span>
                </div>
              )}
            </div>

            {poc?.about && poc?.about.length > 10 && (
              <div className="text-[#707287] text-sm line-clamp-4">
                {poc.about}
              </div>
            )}

            <div className="flex flex-wrap gap-2 items-center w-fit">
              {poc.top_event_categories?.length > 0 &&
                poc.top_event_categories?.slice(0, 2).map((item, index) => (
                  <span
                    key={index}
                    className="whitespace-nowrap text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-4 border-[#CCE6FF] border rounded-md w-fit"
                  >
                    {item.key}
                  </span>
                ))}

              {poc?.top_event_countryZone?.length > 0 &&
                poc.top_event_countryZone?.slice(0, 2).map((item, index) => (
                  <Badge
                    variant="secondary"
                    className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                    key={index}
                  >
                    {item.key}
                  </Badge>
                ))}

              {poc?.speakingCount !== null && poc?.speakingCount > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                >
                  Speaker ({poc?.speakingCount} events)
                </Badge>
              )}
              {poc?.attendCount !== null && poc?.attendCount > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                >
                  {poc?.attendCount} events attended
                </Badge>
              )}
            </div>

            {poc?.state !== 2 && (
              <div className="mt-1">
                <Button
                  disabled={poc?.state && poc.state === 1 ? true : false}
                  onClick={() => unlockPoc(poc.user_id)}
                  variant={"default"}
                  size={"sm"}
                  className="blur-none"
                >
                  Unlock Contact
                </Button>
              </div>
            )}

            {poc?.state === 2 && (
              <div className={`${poc?.state !== 2 ? "blur-sm" : ""} w-full`}>
                <p className="text-[#666666] flex items-center gap-2 text-[12px]">
                  <MailIcon
                    width="12px"
                    height="12px"
                    className="self-start mt-1"
                  />
                  <span className="break-all">{poc?.email}</span>
                </p>
                <p className="text-[#666666] flex items-center gap-2 text-[12px]">
                  <PhoneIcon width="12px" height="12px" />
                  <span>{poc?.phoneNumber ? poc?.phoneNumber : "-"}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export const PeopleList = () => {
  const searchParams = useSearchParams();
  const {
    data: companyData,
    error,
    isLoading,
  } = useQuery<CompanyListResponse | undefined>({
    queryKey: ["prospect", searchParams.toString()],
    queryFn: () => companyService.getCompanyList(searchParams.toString()),
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const companies = companyData?.companyData || [];
  const people = companyData?.userData || [];
  const count = companyData?.totalCount || 0;

  const [companyUsers, setCompanyUsers] = useState<userListData[]>([]);

  useEffect(() => {
    setCompanyUsers(people);
  }, [people]);

  const { getFilterValue, setMultipleFilters } = useFilterState();
  const companyService = useCompanyService();

  const itemsPerPage = parseInt(getFilterValue("limit") || "10");
  const currentPage =
    Math.floor(parseInt(getFilterValue("offset") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(count / itemsPerPage);

  const handlePageChange = (page: number) => {
    setMultipleFilters({
      offset: ((page - 1) * itemsPerPage).toString(),
      limit: itemsPerPage.toString(),
    });
  };

  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    setMultipleFilters({
      limit: newItemsPerPage,
    });
  };

  const unlockPoc = async (pocId: number | string) => {
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
      console.error("Error fetching data:", error);
    }
  };

  if (isLoading)
    return (
      <div className="flex-1 items-center justify-center min-h-svh">
        <Loading />
      </div>
    );

  if (error)
    return (
      <NullState
        image={coordinateNullState}
        title={(error as ApiError).message}
      />
    );

  if (count == 0)
    return (
      <NullState
        image={coordinateNullState}
        title="No Results Found"
        text="Try adjusting the filter criteria to refine your search"
      />
    );

  console.log("people section");

  return (
    <div className="flex-1 px-6 pt-6">
      {/* <div className="h-full overflow-y-auto w-full grid grid-cols-[repeat(auto-fill,_220px)] gap-4 pb-3 justify-center">
        {companyUsers.filter((item) => (item.user_name !== null && item.user_profilePicture !== null))?.map((item, index: number) => (
          <PeopleCard poc={item} key={index} unlockPoc={unlockPoc} />
        ))}
      </div> */}

      <div
        className={`flex justify-between items-center sticky top-0 bg-background z-50 shadow-[0_1px_4px_-2px_rgba(21,34,50,0.078)] transition-padding duration-200 py-3 pt-4`}
      >
        <div className="flex items-center gap-2">
          <EventCount view="people" />
        </div>
        <div className="flex justify-center"></div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled
          >
            <span className="flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4" />
              Export
            </span>
          </Button>
          <SortDropdown />
        </div>
      </div>
      <div className="flex gap-3 flex-col">
        {companyUsers
          .filter(
            (item) =>
              item.user_name !== null && item.user_profilePicture !== null
          )
          ?.map((item, index: number) => (
            <PeopleCardNew poc={item} key={index} unlockPoc={unlockPoc} />
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
    </div>
  );
};
