"use client";

import { PaginationComponent } from "@/components/pagination";
import { useFilterState } from "@/hooks/useFilterState";
import { pocDetail } from "@/types/coordinateEventType";
import Image from "next/image";
import { useState } from "react";
import Text from "@/components/new-ui/Text";
import { MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanyService } from "@/services/companyService";

interface userDetail {
  user_id: number | null;
  user_name: string | null;
  user_designationName: string | null;
  user_profilePicture: string | null;
  email?: string | null
  phoneNumber?: string | null,
  state?: number,
}

const PeopleCard = ({ poc, unlockPoc }: { poc: userDetail, unlockPoc: any }) => {
  return (
    <div
      className="card flex flex-col gap-3  w-full overflow-y-auto"
      style={{ padding: "12px" }}
    >
      {/* <div className="flex justify-center">
        <img
          src={
            poc?.profilePicture
              ? poc?.profilePicture
              : `https://img.10times.com/userimages/${
                  poc?.name && poc?.name.charAt(0).toLowerCase()
                }.jpg`
          }
          alt="POC Logo"
          className="rounded-lg shadow-md h-16 w-16"
        />
      </div> */}
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
        <div className={`${poc?.state !== 2 ? 'blur-sm' : ''} w-full`}>
          {/* {poc?.email && ( */}
            <p className="text-[#666666] flex items-center gap-2 text-[12px]">
              <MailIcon
                width="12px"
                height="12px"
                className="self-start mt-1"
              />
              <span className="break-all">{poc?.email}</span>
            </p>
          {/* )} */}
          <p className="text-[#666666] flex items-center gap-2 text-[12px]">
            <PhoneIcon width="12px" height="12px" />
            <span>{poc?.phoneNumber ? poc?.phoneNumber : "-"}</span>
          </p>
        </div>
        {(poc?.state !== 2) && (
          <div className="absolute bottom-0 right-[30%]">
            <Button
              disabled={
                poc?.state && (poc.state === 1)
                  ? true
                  : false
              }
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

export const PeopleList = ({
  people,
  count = 0,
}: {
  people: userDetail[];
  count: number | undefined;
}) => {
  const [companyUsers, setCompanyUsers] = useState(people);
  const { setFilter, getFilterValue } = useFilterState();
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const currentPage =
    Math.floor(Number(getFilterValue("skip") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(count / itemsPerPage);
  const companyService = useCompanyService();

  const handlePageChange = (page: number) => {
    setFilter("skip", ((page - 1) * itemsPerPage).toString());
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);

    setFilter("take", newItemsPerPage.toString());
  };

  const unlockPoc = async(pocId: number) => {
    try {
      setCompanyUsers(prevPocData => 
        prevPocData.map(poc => 
          poc.user_id === pocId
            ? { ...poc, state: 1 }
            : poc
        )
      );
      const data = await companyService.unlockUserDetail(pocId);
      if (data) {
        setCompanyUsers(prevPocData => 
          prevPocData.map(poc => 
            poc.user_id === pocId
              ? { ...poc, email: data.email, phoneNumber: data.phoneNumber, state: 2 }
              : poc
          )
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className="">
      <div className="h-full overflow-y-auto w-full grid grid-cols-[repeat(auto-fill,_220px)] gap-4 pb-3 justify-center">
        {companyUsers.filter((item) => (item.user_name !== null && item.user_profilePicture !== null))?.map((item, index: number) => (
          <PeopleCard poc={item} key={index} unlockPoc={unlockPoc} />
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
        />
      </div>
    </div>
  );
};
