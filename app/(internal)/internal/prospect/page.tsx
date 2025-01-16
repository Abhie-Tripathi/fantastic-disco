"use client";

// import SearchBar from "@/components/search/searchbar";
import { Buildings, Filter, Location, Users } from "geist-icons";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CompanyType from "@/app/components/prospect/companyTypeFilter";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useCompanyService } from "@/services/companyService";
import Loading from "@/components/ui/Loading";
import NullState from "@/app/components/trackers/nullState";
import coordinateNullState from "@/public/coordinateNullState.svg";
import { ApiError } from "@/types/api";
import { PaginationComponent } from "@/components/pagination";
import { useFilterState } from "@/hooks/useFilterState";

interface companyDetail {
  name: string;
  profile: string;
  url: string;
  city: string;
  country: string;
  cdn_url: string;
  industries: string[];
}

interface CompanyListResponse {
  totalCount: number;
  data: any[];
}

const ProspectCard = ({ companyDetail }: { companyDetail: companyDetail }) => {
  return (
    <div className="bg-background rounded-xl border border-[var(--border-color)] shadow-sm relative">
      {/* <Link href={`/search/${event.id}`} className="block"> */}
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

              {/* <span className="text-[var(--info-text-color)] text-xs font-medium">
                +2 more
              </span> */}
            </div>
          </div>
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
};

const companyFilters = [
  {
    id: "item-1",
    label: "Industry",
    content: ["Industry 1", "Industry 2", "Industry 3"],
    type: "checkbox",
    enabled: true,
  },
  {
    id: "item-2",
    label: "Location",
    content: ["Industry 1", "Industry 2", "Industry 3"],
    type: "search",
  },
  {
    id: "item-3",
    label: "Product & Topics",
    content: ["Industry 1", "Industry 2", "Industry 3"],
    type: "checkbox",
    enabled: false,
  },
  {
    id: "item-4",
    label: "Company Size",
    content: ["Industry 1", "Industry 2", "Industry 3"],
    type: "checkbox",
  },
  {
    id: "item-5",
    label: "Company Type",
    content: ["Industry 1", "Industry 2", "Industry 3"],
    type: "checkbox",
  },
  {
    id: "item-6",
    label: "Established Year",
    content: ["Industry 1", "Industry 2", "Industry 3"],
    type: "",
  },
];

const eventFilters = [
  {
    id: "item-1",
    label: "Event Partcipation",
    content: ["Industry 1", "Industry 2", "Industry 3"],
  },
  {
    id: "item-2",
    label: "Event Regions",
    content: ["Industry 1", "Industry 2", "Industry 3"],
  },
  {
    id: "item-3",
    label: "Industry Interests",
    content: ["Industry 1", "Industry 2", "Industry 3"],
  },
  {
    id: "item-4",
    label: "Followers",
    content: ["Industry 1", "Industry 2", "Industry 3"],
  },
  {
    id: "item-5",
    label: "Participation Type",
    content: ["Industry 1", "Industry 2", "Industry 3"],
  },
];

const peopleFilters = [
  {
    id: "item-1",
    filterName: "userName",
    label: "User Name",
    content: ["Industry 1", "Industry 2", "Industry 3"],
    type: "checkbox",
  },
  {
    id: "item-2",
    label: "Designation",
    filterName: "designation",
    content: ["Industry 1", "Industry 2", "Industry 3"],
    type: "search",
  },
  {
    id: "item-3",
    label: "LinkedIn",
    content: ["Industry 1", "Industry 2", "Industry 3"],
    type: "checkbox",
  },
];

const Prospect = () => {
  const searchParams = useSearchParams();
  const companyService = useCompanyService();

  const {
    data: companyData,
    error,
    isLoading,
    refetch,
  } = useQuery<CompanyListResponse | undefined>({
    queryKey: ["events", searchParams.toString()],
    queryFn: () =>
      companyService.getCompanyWithSearchParams(searchParams.toString()),
    enabled:
      !!searchParams.toString() &&
      !(Array.from(searchParams.values()).length == 0),
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const companies = companyData?.data || [];
  const count = companyData?.totalCount;
  const { setFilter, getFilterValue } = useFilterState();
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const currentPage = Math.floor(Number(getFilterValue("skip") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(count / itemsPerPage);

  const searchHandler = useCallback(() => {
    console.log("searchHandler", companies);
    // applyFilters();
  }, []);

  const handlePageChange = (page: number) => {
    setFilter("skip", ((page - 1) * itemsPerPage).toString());
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);

    setFilter("take", newItemsPerPage.toString());
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 shadow-sm p-6 flex gap-6 items-center">
        {/* <SearchBar /> */}
        <div className="text-lg font-medium">
          Find your next ideal customers with real-time insights backed by
          trusted data.
        </div>
        <div className="badge_success">Coming Soon</div>
      </div>
      <div
        className="h-full grid grid-cols-3 mt-0"
        style={{ height: "calc(100vh - 145px)", marginTop: "0!important" }}
      >
        <div className="col-span-1 overflow-y-auto py-3 px-6">
          <Tabs
            defaultValue={"company"}
            className="h-full w-full flex flex-col justify-between"
          >
            <div className="flex w-full justify-between">
              <TabsList className="grid grid-cols-2 h-auto px-2">
                <TabsTrigger
                  value="company"
                  className="text-xs flex gap-2 items-center p-2"
                >
                  <Buildings
                    color="var(--muted-foreground)"
                    width="12px"
                    height="12px"
                  />
                  Companies
                </TabsTrigger>
                <TabsTrigger
                  value="people"
                  className="text-xs flex gap-2 items-center p-2"
                  // disabled={true}
                >
                  <Users color="#666666" width="12px" height="12px" />
                  People
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="company"
              className="h-4/5 overflow-y-auto w-full"
            >
              <div className="p-3 bg-[var(--background-secondary-color)]">
                <div className="text-xs flex gap-2 items-center p-2 pb-4 font-medium text-[var(--secondary-text-color)]">
                  <Filter
                    color="var(--muted-foreground)"
                    width="12px"
                    height="12px"
                  />
                  COMPANY FILTERS
                </div>

                <Accordion
                  type="single"
                  className="bg-background border border-[var(--neutral-light-color)] rounded-sm"
                  collapsible
                >
                  {companyFilters.map((item) => (
                    <AccordionItem
                      value={item.id}
                      key={item.id}
                      disabled={!item?.enabled}
                    >
                      <AccordionTrigger
                        className="hover:no-underline p-2 py-3 font-normal text-sm justify-start"
                        iconPosition="start"
                      >
                        {item.label}
                      </AccordionTrigger>
                      <AccordionContent
                        className={`"h-fit pb-1 overflow-x-hidden`}
                      >
                        {/* content */}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="text-xs flex gap-2 items-center p-2 py-4 font-medium text-[var(--secondary-text-color)]">
                  <Filter
                    color="var(--muted-foreground)"
                    width="12px"
                    height="12px"
                  />
                  EVENT FILTERS
                </div>

                <Accordion
                  type="single"
                  className="bg-background border border-[var(--neutral-light-color)] rounded-sm"
                  collapsible
                >
                  {eventFilters.map((item) => (
                    <AccordionItem value={item.id} key={item.id}>
                      <AccordionTrigger
                        className="hover:no-underline p-2 py-3 font-normal text-sm justify-start"
                        iconPosition="start"
                      >
                        {item.label}
                      </AccordionTrigger>
                      <AccordionContent
                        className={`"h-fit pb-1 overflow-x-hidden`}
                      >
                        {/* content */}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="people" className="flex-grow overflow-hidden">
              <div className="p-3 bg-[var(--background-secondary-color)]">
                <div className="text-xs flex gap-2 items-center p-2 pb-4 font-medium text-[var(--secondary-text-color)]">
                  <Filter
                    color="var(--muted-foreground)"
                    width="12px"
                    height="12px"
                  />
                  PEOPLE FILTERS
                </div>

                <Accordion
                  type="single"
                  className="bg-background border border-[var(--neutral-light-color)] rounded-sm"
                  collapsible
                >
                  {peopleFilters.map((item) => (
                    <AccordionItem value={item.id} key={item.id}>
                      <AccordionTrigger
                        className="hover:no-underline p-2 py-3 font-normal text-sm justify-start"
                        iconPosition="start"
                      >
                        {item.label}
                      </AccordionTrigger>
                      <AccordionContent
                        className={`"h-fit pb-1 overflow-x-hidden`}
                      >
                        {item.filterName === "designation" ? (
                          <CompanyType />
                        ) : (
                          <></>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
            <Button onClick={searchHandler} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </Tabs>
        </div>

        <div className="col-span-2 overflow-y-auto px-6 my-3">
          {isLoading ? (
            <Loading />
          ) : companies.length == 0 ? (
            <NullState image={coordinateNullState} title="No Results Found" text="Try adjusting the filter criteria to refine your search"/>
          ) : error ? (
            <NullState image={coordinateNullState} title={(error as ApiError).message}/>
          ) : (
            <>
              <div className="text-[#A8A8A8] text-sm font-semibold border-b mt-3 mb-6 relative">
                <span
                  className="absolute top-[-10px] bg-background px-3"
                  style={{ right: "calc(50% - 60px)" }}
                >
                  Search Results
                </span>
              </div>
              <div className="flex gap-3 flex-col">
                {companies?.map((item: companyDetail, index: number) => (
                  <ProspectCard companyDetail={item} key={index} />
                ))}
                <div className="mt-4 sticky bottom-0 bg-background py-4 border-t">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prospect;
