"use client";

import { PaginationComponent } from "@/components/pagination";
import { useFilterState } from "@/hooks/useFilterState";
import { Buildings, Location } from "geist-icons";
import { Factory } from "lucide-react";
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
}

const ProspectCard = ({ companyDetail }: { companyDetail: companyDetail }) => {
  return (
    <div className="bg-background rounded-xl border border-[var(--border-color)] shadow-sm relative">
      <Link
        href={`/internal/company/${companyDetail.url}`}
        target="_blank"
        className="block"
      >
        <div className="p-6 flex gap-6">
          {companyDetail.cdn_url && (
            <Image
              src={companyDetail.cdn_url}
              alt="eventLogo"
              className="flex h-16 w-16 rounded-lg shadow-lg"
              width={200}
              height={200}
            />
          )}
          <div className="flex gap-2 flex-col">
            <div className="text-xl font-semibold">{companyDetail.name}</div>
            <div className="text-[#707287] text-sm line-clamp-2">
              {companyDetail.profile}
            </div>

            <div className="flex gap-2">
              <div className="flex gap-2 items-center border-r w-fit pr-3">
                <Location color="#666666" width="14px" height="14px" />
                <span className="text-[#6E6F89] text-sm">
                  {companyDetail.city}, {companyDetail.country}
                </span>
              </div>

              <div className="flex gap-2 items-center w-fit">
                <Buildings color="#666666" width="14px" height="14px" />
                {companyDetail.industries.map((item) => (
                  <span
                    key={item}
                    className="text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-4 border-[#CCE6FF] border rounded-md w-fit"
                  >
                    {item}
                  </span>
                ))}

                {companyDetail.companyType && (
                  <span className="text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-2 border-[#CCE6FF] border rounded-md w-fit flex">
                    <Factory height={14} color="#666666" />
                    Private
                  </span>
                )}

                {/* <span className="text-[var(--info-text-color)] text-xs font-medium">
                  +2 more
                </span> */}
              </div>
            </div>

            {companyDetail.eventCount && (
              <div className="flex gap-2 items-center w-fit">
                <span className="text-[#A35200] bg-[#FFF4D6] h-fit font-semibold text-xs py-1 px-4 border-[#FEF0CD] border rounded-md w-fit">
                  {companyDetail.eventCount} Events
                </span>
              </div>
            )}
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
      <div className="bg-background py-2 border-t">
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
