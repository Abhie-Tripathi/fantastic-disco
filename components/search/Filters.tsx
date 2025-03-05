"use client";

import { Buildings, Filter, LockClosedSmall, Users } from "geist-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, FilterX } from "lucide-react";
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
import CompanySize from "@/app/components/prospect/Filters/companySize";
import EstablishedYear from "@/app/components/prospect/Filters/establishedYear";
import EventFollowers from "@/app/components/prospect/Filters/eventFollowers";
import ParticipationType from "@/app/components/prospect/Filters/participationType";
import Designation from "@/app/components/prospect/Filters/designation";
import LocationSelector from "@/app/components/prospect/Filters/location";
import PeopleFilter from "@/app/components/prospect/Filters/peopleFilter";
import { PeopleList } from "@/app/components/prospect/PeopleList";
import { useFilterState } from "@/hooks/useFilterState";
import { CompanyListResponse } from "@/types/prospect";
import { isEventeli } from "@/config";
import { Filters } from "@/context/filterContext";
import EventTypeSelector from "@/components/search/eventType";
import CategorySelector from "@/components/search/categorySelector";
import EventFormatSelector from "@/components/search/eventFormat";
import DateRangeSelector from "@/components/search/dateRange";
import StatusSelector from "@/components/search/status";
import EventEntrySelector from "@/components/search/eventEntry";
import UserRatingSelector from "@/components/search/userRatingSelector";
import EditionSelector from "@/components/search/advancedFilters/edition";
import GlobalAndTouringSelector from "@/components/search/advancedFilters/globalAndTouring";
import ForecastedStatusSelector from "@/components/search/advancedFilters/forecastedStatus";
import FrequencySelector from "@/components/search/advancedFilters/frequency";
import KeywordFilter from "@/components/search/advancedFilters/product&Topics";
import EstimatedVisitorsSelector from "@/components/search/advancedFilters/estimatedVisitors";
import EstimatedExhibitorsSelector from "@/components/search/advancedFilters/estimatedExhibitors";
import EventAnalyticsSelector from "@/components/search/advancedFilters/eventAnalytics";
import EstimatedEconomicImpactSelector from "@/components/search/advancedFilters/estimatedEconomicImpact";
import EventRankingSelector from "@/components/search/advancedFilters/eventRanking";
import AudienceQualitySelector from "@/components/search/advancedFilters/audienceQualityScores";
import ExhibitorQualitySelector from "@/components/search/advancedFilters/exhibitorQualityScores";
import AudienceZoneSatusSelector from "@/components/search/advancedFilters/audienceZone";
import AudienceDesAndDep from "@/components/search/advancedFilters/audienceDes&Dep";
import AudienceSpread from "@/components/search/advancedFilters/audienceSpread";

interface ProspectFilters {
  id: string;
  label: string;
  content?: any;
  type?: any;
  enabled?: boolean;
  filterName?: any;
}

const companyFilters: ProspectFilters[] = [
  {
    id: "item-1",
    label: "Category",
    enabled: true,
    filterName: "eventCategoryIds",
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
    filterName: "eventProductIds",
  },
  {
    id: "item-4",
    label: "Followers",
    filterName: "communitySize",
    enabled: true,
  },
  {
    id: "item-5",
    label: "Company Type",
    filterName: "eventParticipationType",
    enabled: true,
  },
  // {
  //   id: "item-6",
  //   label: "Established Year",
  //   filterName: "establishedYear",
  //   enabled: false,
  // },
];

interface FilterItem {
  name: keyof Filters;
  label: string;
  component: string;
  enabled?: boolean;
}

interface FilterSection {
  id: string;
  label: string;
  filters: FilterItem[];
}

const eventFilters: FilterSection[] = [
  {
    id: "basic-filters",
    label: "Basic Filters",
    filters: [
      { name: "eventTypes", label: "Event Type", component: "EventTypeSelector", enabled: true },
      { name: "categories", label: "Category", component: "CategorySelector", enabled: true },
      { name: "eventFormats", label: "Format", component: "EventFormatSelector", enabled: true },
      { name: "locationIds", label: "Location", component: "LocationSelector", enabled: true },
      { name: "active_gte", label: "Date Range", component: "DateRangeSelector", enabled: true },
      { name: "status", label: "Status", component: "StatusSelector", enabled: true },
      { name: "entryType", label: "Entry", component: "EventEntrySelector", enabled: true },
      { name: "ratings", label: "User Rating", component: "UserRatingSelector", enabled: true }
    ]
  },
  {
    id: "advanced-filters",
    label: "Advanced Filters",
    filters: [
      { name: "eventIds", label: "Edition", component: "EditionSelector", enabled: true },
      { name: "type", label: "Global & Touring", component: "GlobalAndTouringSelector", enabled: true },
      { name: "status", label: "Forecasted Status", component: "ForecastedStatusSelector", enabled: true },
      { name: "frequencies", label: "Frequency", component: "FrequencySelector", enabled: true },
      { name: "includeKeywords", label: "Keywords", component: "KeywordFilter", enabled: true }
    ]
  },
  {
    id: "insights-scores",
    label: "Insights & Scores",
    filters: [
      { name: "estimatedVisitors", label: "Estimated Visitors", component: "EstimatedVisitorsSelector", enabled: true },
      { name: "estimatedExhibitors", label: "Estimated Exhibitors", component: "EstimatedExhibitorsSelector", enabled: !isEventeli },
      { name: "trust_score_gte", label: "Event Analytics", component: "EventAnalyticsSelector", enabled: true },
      { name: "economic_impact_gte", label: "Economic Impact", component: "EstimatedEconomicImpactSelector", enabled: true },
      { name: "top", label: "Event Ranking", component: "EventRankingSelector", enabled: true }
    ]
  },
  {
    id: "audience-intel",
    label: "Audience Intelligence",
    filters: [
      { name: "ratings", label: "Audience Quality", component: "AudienceQualitySelector", enabled: true },
      { name: "ratings", label: "Exhibitor Quality", component: "ExhibitorQualitySelector", enabled: true },
      { name: "audienceSpread", label: "Audience Zone Status", component: "AudienceZoneSatusSelector", enabled: !isEventeli },
      { name: "designations", label: "Audience Des & Dep", component: "AudienceDesAndDep", enabled: true },
      { name: "audienceSpreadRegions", label: "Audience Spread", component: "AudienceSpread", enabled: true }
    ]
  }
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

const getFilterComponent = (componentName: string) => {
  const components: { [key: string]: React.ComponentType<any> } = {
    EventTypeSelector,
    CategorySelector,
    EventFormatSelector,
    LocationSelector,
    DateRangeSelector,
    StatusSelector,
    EventEntrySelector,
    UserRatingSelector,
    EditionSelector,
    GlobalAndTouringSelector,
    ForecastedStatusSelector,
    FrequencySelector,
    KeywordFilter,
    EstimatedVisitorsSelector,
    EstimatedExhibitorsSelector,
    EventAnalyticsSelector,
    EstimatedEconomicImpactSelector,
    EventRankingSelector,
    AudienceQualitySelector,
    ExhibitorQualitySelector,
    AudienceZoneSatusSelector,
    AudienceDesAndDep,
    AudienceSpread,
  };

  return components[componentName];
};

const Prospect = () => {
  const searchParams = useSearchParams();
  const companyService = useCompanyService();

  const { setFilter, getFilterValue } = useFilterState();

  const {
    localFilters,
    applyFilters,
    getLocalFilterValue,
    setLocalFilter,
    deleteMultipleLocalFilters,
  } = useFilterContext();

  const selectedView = getFilterValue("viewBy") || "company";

  const {
    data: companyData,
    error,
    isLoading,
  } = useQuery<CompanyListResponse | undefined>({
    queryKey: ["prospect", searchParams.toString()],
    queryFn: () => companyService.getCompanyList(searchParams.toString()),
    // enabled:
    //   !!searchParams.toString() &&
    //   !(Array.from(searchParams.values()).length == 0),
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const companies = companyData?.companyData || [];
  const peopleData = companyData?.userData || [];
  const count = companyData?.totalCount || 0;

  const searchHandler = useCallback(() => {
    applyFilters({ resetPage: true });
  }, []);

  const handleClearFilter = (item: any) => {
    deleteMultipleLocalFilters([item]);
  };

  const handleTabChange = (prop: string) => {
    setFilter("viewBy", prop);
  };

  const createTrackerHandler = () => {
    // TODO: Implement tracker creation
    console.log("Create tracker");
  };

  return (
    <div className="space-y-6 ">
      {/* <div className="pb-6 shadow-sm p-6 flex gap-6 items-center">
        <SearchBar />
        <div className="text-lg font-medium">
          Find your next ideal customers with real-time insights backed by
          trusted data.
        </div>
      </div> */}
      <Tabs
        defaultValue={"company"}
        value={selectedView}
        onValueChange={handleTabChange}
      >
        <div className="overflow-y-auto pt-6 pl-6 pr-3 w-[342px] h-[calc(100vh-60px)] flex flex-col">
          <div className="pb-3 sticky top-0 bg-background z-10">
            <TabsList className="grid grid-cols-3 px-2 w-fit h-auto">
              <TabsTrigger
                value="event"
                className="text-xs flex gap-2 items-center p-2"
              >
                <Buildings
                  color="var(--muted-foreground)"
                  width="12px"
                  height="12px"
                />
                Events
              </TabsTrigger>
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
              >
                <Users color="#666666" width="12px" height="12px" />
                People
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-y-auto w-full mt-0">
            <TabsContent value="event" className="mt-0">
              <div className="p-3 bg-[var(--background-secondary-color)]">
                <Accordion type="multiple" className="space-y-4" defaultValue={["basic-filters"]}>
                  {eventFilters.map((section) => (
                    <AccordionItem
                      key={section.id}
                      value={section.id}
                      className="border-0"
                    >
                      <AccordionTrigger className="hover:no-underline py-2">
                        <div className="text-sm font-medium">{section.label}</div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-background border border-[var(--neutral-light-color)] rounded-sm p-4 space-y-3">
                          {section.filters.map((filter) => {
                            const Component = getFilterComponent(filter.component);
                            if (!Component) return null;
                            
                            return (
                              <div 
                                key={filter.name} 
                                className="flex items-center justify-between group relative"
                                style={{ opacity: filter.enabled ? 1 : 0.5 }}
                              >
                                <div className="w-full">
                                  <Component 
                                    disabled={!filter.enabled}
                                    filterName={filter.name}
                                  />
                                </div>
                                {!filter.enabled && (
                                  <LockClosedSmall color="var(--secondary-text-color)" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="company" className="mt-0">
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
                        {item.filterName === "eventCategoryIds" ? (
                          <Industry filterName={item.filterName} />
                        ) : item.filterName === "eventProductIds" ? (
                          <ProductTopics />
                        ) : item.filterName === "eventParticipationType" ? (
                          <ParticipationType />
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
              </div>
            </TabsContent>

            <TabsContent value="user" className="mt-0">
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
                        {item.filterName === "userJobTitle" ? (
                          <Designation />
                        ) : item.filterName === "userNames" ||
                          item.filterName === "userSocialLink" ? (
                          <PeopleFilter filterName={item.filterName} />
                        ) : (
                          <></>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
          </div>

          <div className="w-full sticky bottom-0 bg-background z-10">
            <div className="p-4 border-t border-[var(--neutral-light-color)] bg-background/80 backdrop-blur-sm space-y-3">
              <Button
                onClick={searchHandler}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Apply Filters"
                )}
              </Button>
              <div className="flex gap-4 justify-center text-sm">
                <Button
                  variant="ghost"
                  onClick={createTrackerHandler}
                  disabled={Object.keys(localFilters).length === 0}
                  className="text-muted-foreground hover:text-primary hover:bg-transparent px-0"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Save Search
                </Button>
                <div className="w-px h-4 bg-border self-center" />
                <Button
                  variant="ghost"
                  onClick={() => deleteMultipleLocalFilters(Object.keys(localFilters) as (keyof Filters)[])}
                  disabled={Object.keys(localFilters).length === 0}
                  className="text-muted-foreground hover:text-primary hover:bg-transparent px-0"
                >
                  <FilterX className="w-4 h-4 mr-1.5" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 h-full overflow-y-auto pt-4 pl-3">
          {/* <TabsContent
              value="company"
              className="mt-0 overflow-y-auto h-full pr-6"
            >
              {isLoading ? (
                <div className="p-8">
                  <Loading />
                </div>
              ) : error ? (
                <NullState
                  image={coordinateNullState}
                  title={(error as ApiError).message}
                />
              ) : companies.length == 0 ? (
                <NullState
                  image={coordinateNullState}
                  title="No Results Found"
                  text="Try adjusting the filter criteria to refine your search"
                />
              ) : (
                <ProspectList companies={companies} count={count} />
              )}
            </TabsContent> */}

          {/* <TabsContent value="user" className="mt-0 h-full pr-6">
              {isLoading ? (
                <div className="p-8">
                  <Loading />
                </div>
              ) : error ? (
                <NullState
                  image={coordinateNullState}
                  title={(error as ApiError).message}
                />
              ) : peopleData.length == 0 ? (
                <NullState
                  image={coordinateNullState}
                  title="No Results Found"
                  text="Try adjusting the filter criteria to refine your search"
                />
              ) : (
                <PeopleList people={peopleData} count={count} />
              )}
            </TabsContent> */}
        </div>
      </Tabs>
    </div>
  );
};

export default Prospect;
