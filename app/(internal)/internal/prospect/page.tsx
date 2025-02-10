"use client";

// import SearchBar from "@/components/search/searchbar";
import { Buildings, Filter, LockClosedSmall, Users } from "geist-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useCompanyService } from "@/services/companyService";
import Loading from "@/components/ui/Loading";
import NullState from "@/app/components/trackers/nullState";
import coordinateNullState from "@/public/coordinateNullState.svg";
import { ApiError } from "@/types/api";
import { ProspectList } from "@/app/components/prospect/ProspectList";
import Industry from "@/app/components/prospect/Filters/industryFilter";
import { useFilterContext } from "@/context/filterContext";
import ProductTopics from "@/app/components/prospect/Filters/productTopics";
import CompanyType from "@/app/components/prospect/Filters/companyType";
import CompanySize from "@/app/components/prospect/Filters/companySize";
import EstablishedYear from "@/app/components/prospect/Filters/establishedYear";
import EventFollowers from "@/app/components/prospect/Filters/eventFollowers";
import ParticipationType from "@/app/components/prospect/Filters/participationType";
import Designation from "@/app/components/prospect/Filters/designation";
import LocationSelector from "@/app/components/prospect/Filters/location";
import PeopleFilter from "@/app/components/prospect/Filters/peopleFilter";
import { PeopleList } from "@/app/components/prospect/PeopleList";

interface CompanyListResponse {
  totalCount: number;
  data: any[];
}

interface ProspectFilters {
  id: string;
  label: string;
  content?: any;
  type?: any;
  enabled?: boolean;
  filterName?: any;
}

// const peopleData: pocDetail[] = [
//   {
//       "id": 63400046,
//       "name": "Vinoth",
//       "designation": "AGM - Own Shows",
//       "email": "sv@hitex.co.in",
//       "phoneNumber": "+91********159",
//       "profilePicture": "https://c1.10times.com/user/images/0/4/6/63400046_1710389446.jpg",
//       "emailActive": "2025-01-21 12:03:13"
//   },
//   {
//       "id": 35570,
//       "name": "John",
//       "designation": "Sr. Manager - Own Shows",
//       "email": "js@hitex.co.in",
//       "phoneNumber": "+91********117",
//       "profilePicture": "https://c1.10times.com/user_pic%2FskWcFEdNT4dxpz%2BZhi%2BVALFBjA85qfm3wWbW64Wn9MbKKYMMe91dsYHErZuQYxjacXZeNnGvKf7FY4qjzbUlrg%3D%3D.jpg",
//       "emailActive": "2025-01-20 18:09:28"
//   },
//   {
//       "id": 66132975,
//       "name": "Harshitha Reddy",
//       "designation": "Organizer",
//       "email": "hn*@hitex.co.in",
//       "phoneNumber": null,
//       "profilePicture": "https://c1.10times.com/userimages/h.jpg",
//       "emailActive": "2024-12-16 12:50:10"
//   },
//   {
//       "id": 66121550,
//       "name": "Sudarshan",
//       "designation": "Asst. Manager",
//       "email": "rs*@hitex.co.in",
//       "phoneNumber": "+91********610",
//       "profilePicture": "https://c1.10times.com/userimages/s.jpg",
//       "emailActive": "2024-08-31 10:52:57"
//   },
//   {
//       "id": 60350557,
//       "name": "LDF India",
//       "designation": "Marketing Manager",
//       "email": "sk*@hitex.co.in",
//       "phoneNumber": "+91********323",
//       "profilePicture": "https://c1.10times.com/user/images/5/5/7/60350557_1683541380.jpg",
//       "emailActive": "2023-11-07 14:29:38"
//   }
// ];

const companyFilters: ProspectFilters[] = [
  {
    id: "item-1",
    label: "Category",
    enabled: true,
    filterName: "companyCategoryIds",
  },
  {
    id: "item-2",
    label: "Location",
    enabled: true,
    filterName: "companyLocationIds",
  },
  {
    id: "item-3",
    label: "Product & Topics",
    enabled: true,
    filterName: "companyProductIds",
  },
  {
    id: "item-4",
    label: "Community Size",
    filterName: "communitySize",
    enabled: true,
  },
  {
    id: "item-5",
    label: "Company Type",
    filterName: "companyType",
    enabled: true,
  },
  {
    id: "item-6",
    label: "Established Year",
    filterName: "establishedYear",
    enabled: true,
  },
];

const eventFilters: ProspectFilters[] = [
  {
    id: "item-2",
    label: "Location",
    filterName: "eventLocationIds",
    enabled: true,
  },
  {
    id: "item-3",
    label: "Category",
    filterName: "eventCategoryIds",
    enabled: true,
  },
  {
    id: "item-4",
    label: "Followers",
    filterName: "eventFollowers",
    enabled: true,
  },
  {
    id: "item-5",
    label: "Participation Type",
    filterName: "eventParticipationType",
    enabled: true,
  },
];

const peopleFilters: ProspectFilters[] = [
  {
    id: "item-1",
    label: "User Name",
    filterName: "userNames",
    enabled: true,
  },
  {
    id: "item-2",
    label: "Job Title",
    filterName: "userJobTitle",
    enabled: true,
  },
  {
    id: "item-3",
    label: "LinkedIn",
    filterName: "userSocialLink",
    enabled: true,
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
  } = useQuery<CompanyListResponse | undefined | any>({
    queryKey: ["prospect", searchParams.toString()],
    queryFn: () => companyService.getCompanyList(searchParams.toString()),
    enabled:
      !!searchParams.toString(),
      // !(Array.from(searchParams.values()).length == 0),
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  console.log('companyData', companyData);
  

  const companies = companyData?.companyData || [];
  const peopleData = companyData?.userData || [];
  const count = companyData?.totalCount || 9;

  const {
    localFilters,
    applyFilters,
    getLocalFilterValue,
    setLocalFilter,
    deleteMultipleLocalFilters,
  } = useFilterContext();

  const searchHandler = useCallback(() => {
    applyFilters({ resetPage: true });
  }, []);

  const handleClearFilter = (item: any) => {
    deleteMultipleLocalFilters([item]);
  };

  const handleTabChange = (prop: string) => {
    setLocalFilter('viewBy', prop);
    applyFilters({ resetPage: true });
  }

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
      <Tabs defaultValue={"company"} style={{ marginTop: "12px!important" }} onValueChange={handleTabChange} >
        <div className="grid grid-cols-3 px-6">
          <TabsList className="grid grid-cols-2 h-auto px-2 col-span-1 mr-6 w-fit">
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
              value="user"
              className="text-xs flex gap-2 items-center p-2"
              // disabled={true}
            >
              <Users color="#666666" width="12px" height="12px" />
              People
            </TabsTrigger>
          </TabsList>
          { (companies.length > 0 || peopleData.length > 0) &&
            <div className="text-[#A8A8A8] text-sm font-semibold border-b mt-3 mb-6 relative col-span-2 mr">
            <span
              className="absolute top-[-10px] bg-background px-3"
              style={{ right: "calc(50% - 60px)" }}
            >
              Search Results
            </span>
          </div>
          }
        </div>

        <div
          className="h-full grid grid-cols-3 mt-0"
          style={{ height: "calc(100vh - 200px)", marginTop: "0!important" }}
        >
          <div className="col-span-1 overflow-y-auto pt-3 px-6">
            <div className="h-4/5 overflow-y-auto w-full mt-0">
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
                      <div className="flex items-center group relative">
                        <div className="w-4/6">
                          <AccordionTrigger
                            className="hover:no-underline p-2 py-3 font-normal text-sm justify-start whitespace-nowrap w-full"
                            iconPosition="start"
                          >
                            {item.label}
                            <span className="ml-4 bg-[#EBF5FF] text-[var(--info-text-color)] px-1 rounded-sm font-semibold text-xs">
                              {item?.filterName &&
                                getLocalFilterValue(item?.filterName) &&
                                getLocalFilterValue(item?.filterName).split(",")
                                  .length}
                            </span>
                          </AccordionTrigger>
                        </div>
                        {item?.filterName &&
                          getLocalFilterValue(item?.filterName) && (
                            <span
                              className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 text-primary underline font-medium text-xs w-2/6"
                              onClick={() => handleClearFilter(item.filterName)}
                            >
                              Remove Filter
                            </span>
                          )}
                        {!item.enabled && (
                          <LockClosedSmall color="var(--secondary-text-color)" />
                        )}
                      </div>
                      <AccordionContent
                        className={`"h-fit pb-1 overflow-x-hidden`}
                      >
                        {item.filterName === "companyCategoryIds" ? (
                          <Industry filterName={item.filterName} />
                        ) : item.filterName === "companyProductIds" ? (
                          <ProductTopics />
                        ) : item.filterName === "companyType" ? (
                          <CompanyType />
                        ) : item.filterName === "communitySize" ? (
                          <CompanySize />
                        ) : item.filterName === "establishedYear" ? (
                          <EstablishedYear />
                        ) : item.filterName === "companyLocationIds" ? (
                          <LocationSelector filterName={item.filterName} />
                        ) : (
                          <></>
                        )}
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
                    <AccordionItem
                      value={item.id}
                      key={item.id}
                      disabled={!item?.enabled}
                    >
                      <div className="flex items-center group relative">
                        <div className="w-4/6">
                          <AccordionTrigger
                            className="hover:no-underline p-2 py-3 font-normal text-sm justify-start whitespace-nowrap w-full"
                            iconPosition="start"
                          >
                            {item.label}
                            <span className="ml-4 bg-[#EBF5FF] text-[var(--info-text-color)] px-1 rounded-sm font-semibold text-xs">
                              {item?.filterName &&
                                getLocalFilterValue(item?.filterName) &&
                                getLocalFilterValue(item?.filterName).split(",")
                                  .length}
                            </span>
                          </AccordionTrigger>
                        </div>
                        {item?.filterName &&
                          getLocalFilterValue(item?.filterName) && (
                            <span
                              className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 text-primary underline font-medium text-xs w-2/6"
                              onClick={() => handleClearFilter(item.filterName)}
                            >
                              Remove Filter
                            </span>
                          )}
                        {!item.enabled && (
                          <LockClosedSmall color="var(--secondary-text-color)" />
                        )}
                      </div>
                      <AccordionContent
                        className={`"h-fit pb-1 overflow-x-hidden`}
                      >
                        {item.filterName === "eventCategoryIds" ? (
                          <Industry filterName={item.filterName} />
                        ) : item.filterName === "eventParticipationType" ? (
                          <ParticipationType />
                        ) : item.filterName === "eventFollowers" ? (
                          <EventFollowers />
                        ) : item.filterName === "eventLocationIds" ? (
                          <LocationSelector filterName={item.filterName} />
                        ) : (
                          <></>
                        )}
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
                  PEOPLE FILTERS
                </div>
                <Accordion
                  type="single"
                  className="bg-background border border-[var(--neutral-light-color)] rounded-sm"
                  collapsible
                >
                  {peopleFilters.map((item) => (
                    <AccordionItem
                      value={item.id}
                      key={item.id}
                      disabled={!item?.enabled}
                    >
                      <div className="flex items-center group relative">
                        <div className="w-4/6">
                          <AccordionTrigger
                            className="hover:no-underline p-2 py-3 font-normal text-sm justify-start whitespace-nowrap w-full"
                            iconPosition="start"
                          >
                            {item.label}
                            <span className="ml-4 bg-[#EBF5FF] text-[var(--info-text-color)] px-1 rounded-sm font-semibold text-xs">
                              {item?.filterName &&
                                getLocalFilterValue(item?.filterName) &&
                                getLocalFilterValue(item?.filterName).split(",")
                                  .length}
                            </span>
                          </AccordionTrigger>
                        </div>
                        {item?.filterName &&
                          getLocalFilterValue(item?.filterName) && (
                            <span
                              className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 text-primary underline font-medium text-xs w-2/6"
                              onClick={() => handleClearFilter(item.filterName)}
                            >
                              Remove Filter
                            </span>
                          )}
                        {!item.enabled && (
                          <LockClosedSmall color="var(--secondary-text-color)" />
                        )}
                      </div>
                      <AccordionContent
                        className={`"h-fit pb-1 overflow-x-hidden`}
                      >
                        {item.filterName === "designation" ? (
                          <Designation />
                        ) : item.filterName === "userName" ||
                          item.filterName === "linkedinProfile" ? (
                          <PeopleFilter filterName={item.filterName} />
                        ) : item.filterName === "companyType" ? (
                          <CompanyType />
                        ) : (
                          <></>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            <div className="w-full py-3">
              <Button
                onClick={searchHandler}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>

          <div className="col-span-2 overflow-y-auto pr-6">
            <TabsContent value="company">
              {isLoading ? (
                <Loading />
              ) : companies.length == 0 ? (
                <NullState
                  image={coordinateNullState}
                  title="No Results Found"
                  text="Try adjusting the filter criteria to refine your search"
                />
              ) : error ? (
                <NullState
                  image={coordinateNullState}
                  title={(error as ApiError).message}
                />
              ) : (
                <>
                  {/* <div className="text-[#A8A8A8] text-sm font-semibold border-b mt-3 mb-6 relative">
                  <span
                    className="absolute top-[-10px] bg-background px-3"
                    style={{ right: "calc(50% - 60px)" }}
                  >
                    Search Results
                  </span>
                </div> */}
                  <ProspectList companies={companies} count={count} />
                </>
              )}
            </TabsContent>

            <TabsContent value="user">
              {isLoading ? (
                <Loading />
              ) : peopleData.length == 0 ? (
                <NullState
                  image={coordinateNullState}
                  title="No Results Found"
                  text="Try adjusting the filter criteria to refine your search"
                />
              ) : error ? (
                <NullState
                  image={coordinateNullState}
                  title={(error as ApiError).message}
                />
              ) : (
                <>
                  {/* <div className="text-[#A8A8A8] text-sm font-semibold border-b mt-3 mb-6 relative">
                  <span
                    className="absolute top-[-10px] bg-background px-3"
                    style={{ right: "calc(50% - 60px)" }}
                  >
                    Search Results
                  </span>
                </div> */}
                  <PeopleList people={peopleData} count={peopleData.length} />
                </>
              )}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Prospect;
