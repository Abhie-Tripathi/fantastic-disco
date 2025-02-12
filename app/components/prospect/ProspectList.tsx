"use client";

import { PaginationComponent } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { useFilterState } from "@/hooks/useFilterState";
import { convertToCustomFormat } from "@/utils/dateFormat";
import { Buildings, Location } from "geist-icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface companyDetail {
  name: string;
  profile: string;
  url: string;
  city: string;
  country: string;
  cdn_url: string;
  industries: string[];
  eventCount?: number;
  companyType?: string;

  id: number | string;
  description: string;
  location: {
    cityName: string;
    countryName: string;
    state: string;
  };
  logo: string | null;
  event_categoryName: string[];
  stats: {
    totalEvents: number;
    upcomingEvents: number;
    totalExhibit: number;
    totalVisitor: number;
    totalSponsor: number;
    lastLogin: string;
  };
  company_tag: string[];
}

const ProspectCard = ({ companyDetail }: { companyDetail: companyDetail }) => {
  return (
    <div className="bg-background rounded-xl border border-[var(--border-color)] shadow-sm relative">
      <Link
        href={`/internal/company/${companyDetail.id}`}
        target="_blank"
        className="block"
      >
        <div className="p-6 flex gap-6">
          {companyDetail.logo && (
            <Image
              src={companyDetail.logo}
              alt="eventLogo"
              className="flex h-16 w-16 rounded-lg shadow-lg"
              width={200}
              height={200}
            />
          )}
          <div className="flex gap-2 flex-col">
            <div className="text-xl font-semibold">{companyDetail.name}</div>
            {companyDetail?.description &&
              companyDetail?.description.length > 10 && (
                <div className="text-[#707287] text-sm line-clamp-2">
                  {companyDetail?.description}
                </div>
              )}

            <div className="flex gap-2">
              {companyDetail.location?.cityName !== null &&
                companyDetail.location?.countryName !== null && (
                  <div className="flex gap-2 items-center border-r w-fit pr-3">
                    <Location color="#666666" width="14px" height="14px" />
                    <span className="text-[#6E6F89] text-sm">
                      {[
                        companyDetail.location?.cityName,
                        companyDetail.location?.countryName,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}

              <div className="flex gap-2 items-center w-fit">
                {companyDetail.event_categoryName?.length > 0 && (
                  <>
                    <Buildings color="#666666" width="14px" height="14px" />
                    {companyDetail.event_categoryName?.map((item) => (
                      <span
                        key={item}
                        className="text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-4 border-[#CCE6FF] border rounded-md w-fit"
                      >
                        {item}
                      </span>
                    ))}
                  </>
                )}

                {companyDetail?.company_tag.length > 0 &&
                  companyDetail?.company_tag
                    ?.filter(Boolean)
                    .slice(0, 2)
                    ?.map((item: any, index: number) => (
                      <span
                        key={item}
                        className="text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-4 border-[#CCE6FF] border rounded-md w-fit"
                      >
                        #{item}
                      </span>
                    ))}

                {/* {companyDetail?.companyType && (
                  <span className="text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-2 border-[#CCE6FF] border rounded-md w-fit flex">
                    <Factory height={14} color="#666666" />
                    Private
                  </span>
                )} */}

                {/* <span className="text-[var(--info-text-color)] text-xs font-medium">
                  +2 more
                </span> */}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center w-fit">
              {companyDetail.stats?.totalEvents > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                >
                  Total Events: {companyDetail.stats.totalEvents}
                </Badge>
              )}
              {companyDetail.stats?.upcomingEvents > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                >
                  Upcoming Events: {companyDetail.stats.upcomingEvents}
                </Badge>
              )}
              {companyDetail.stats?.totalExhibit > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                >
                  Events Exhibited: {companyDetail.stats.totalExhibit}
                </Badge>
              )}
              {companyDetail.stats?.totalSponsor > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                >
                  Events Sponsored: {companyDetail.stats.totalSponsor}
                </Badge>
              )}
              {companyDetail.stats?.totalVisitor > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                >
                  Events Visited: {companyDetail.stats.totalVisitor}
                </Badge>
              )}
              {companyDetail?.stats?.lastLogin && (
                <Badge
                  variant="outline"
                  className="text-gray-600 capitalize rounded-sm"
                >
                  Last Active:{" "}
                  {convertToCustomFormat(companyDetail?.stats?.lastLogin)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const ProspectList = ({
  companies,
  count = 0,
}: {
  companies: any[];
  count: number | undefined;
}) => {
  const { setFilter, getFilterValue } = useFilterState();
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const currentPage =
    Math.floor(Number(getFilterValue("skip") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(count / itemsPerPage);

  const handlePageChange = (page: number) => {
    setFilter("skip", ((page - 1) * itemsPerPage).toString());
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);

    setFilter("take", newItemsPerPage.toString());
  };
  return (
    <div className="flex gap-3 flex-col">
      {companies?.map((item: companyDetail, index: number) => (
        <ProspectCard companyDetail={item} key={index} />
      ))}
      <div className="sticky bottom-0 bg-background py-2 border-t">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          count={count}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};
