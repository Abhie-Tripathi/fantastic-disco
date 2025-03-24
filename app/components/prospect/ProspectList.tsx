"use client";

import { PaginationComponent } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { useFilterState } from "@/hooks/useFilterState";
import { useCompanyService } from "@/services/companyService";
import { companyListData } from "@/types/prospect";
import { Buildings, Location } from "geist-icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const excludedTags = [
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
];

const ProspectCard = ({
  companyDetail,
}: {
  companyDetail: companyListData;
}) => {
  const { checkCompanyLogo } = useCompanyService();
  const [compLogo, setCompLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      if (companyDetail.logo !== null) {
        setCompLogo(companyDetail.logo);
      } else if (
        companyDetail.logo === null &&
        companyDetail.website !== null
      ) {
        const tempLogo = await checkCompanyLogo(companyDetail.website);
        if (tempLogo) {
          setCompLogo(`https://logo.clearbit.com/${companyDetail.website}`);
        }
      } else setCompLogo(null);
    };

    fetchLogo();
  }, [companyDetail.id]);

  return (
    <div className="bg-background rounded-xl border border-[var(--border-color)] shadow-sm relative">
      <Link href={`/internal/company/${companyDetail.id}`} className="block">
        <div className="p-4 flex gap-6">
          {compLogo !== null && (
            <Image
              src={compLogo}
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

            <div className="flex flex-wrap gap-2">
              {(companyDetail.location?.cityName !== null ||
                companyDetail.location?.countryName !== null) && (
                <div className="flex gap-2 items-center border-r w-fit pr-3">
                  <Location color="#666666" width="14px" height="14px" />
                  <span className="text-[#6E6F89] text-sm">
                    {companyDetail.location?.cityName ===
                    companyDetail.location?.countryName
                      ? companyDetail.location?.cityName
                      : [
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
                        className="whitespace-nowrap text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-4 border-[#CCE6FF] border rounded-md w-fit"
                      >
                        {item}
                      </span>
                    ))}
                  </>
                )}

                {companyDetail?.company_tag.length > 0 &&
                  companyDetail?.company_tag
                    ?.filter((item) => !excludedTags.includes(item))
                    ?.filter(Boolean)
                    .slice(0, 2)
                    ?.map((item: any, index: number) => (
                      <span
                        key={item}
                        className="whitespace-nowrap text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-4 border-[#CCE6FF] border rounded-md w-fit"
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
              {companyDetail.stats?.totalEvents !== null &&
                companyDetail.stats?.totalEvents > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                  >
                    Total Events: {companyDetail.stats.totalEvents}
                  </Badge>
                )}
              {companyDetail.stats?.upcomingEvents !== null &&
                companyDetail.stats?.upcomingEvents > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                  >
                    Upcoming Events: {companyDetail.stats.upcomingEvents}
                  </Badge>
                )}
              {companyDetail.stats?.totalExhibit !== null &&
                companyDetail.stats?.totalExhibit > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                  >
                    Events Exhibited: {companyDetail.stats.totalExhibit}
                  </Badge>
                )}
              {companyDetail.stats?.totalSponsor !== null &&
                companyDetail.stats?.totalSponsor > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                  >
                    Events Sponsored: {companyDetail.stats.totalSponsor}
                  </Badge>
                )}
              {companyDetail.stats?.totalVisitor !== null &&
                companyDetail.stats?.totalVisitor > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[#A35200] bg-[#FFF4D6] capitalize rounded-sm"
                  >
                    Events Visited: {companyDetail.stats.totalVisitor}
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
  companies: companyListData[];
  count: number | undefined;
}) => {
  const { getFilterValue, setMultipleFilters } = useFilterState();

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
  return (
    <div className="flex gap-3 flex-col">
      {companies?.map((item, index) => (
        <ProspectCard companyDetail={item} key={index} />
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
          hideLastPage={true}
        />
      </div>
    </div>
  );
};
