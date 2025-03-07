"use client";

import { Buildings, LockClosedSmall, Users } from "geist-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus, FilterX } from "lucide-react";
import { Filter } from "geist-icons";
import { useCallback } from "react";
import Industry from "@/app/components/prospect/Filters/industryFilter";
import { useFilterContext } from "@/context/filterContext";
import ProductTopics from "@/app/components/prospect/Filters/productTopics";
import CompanySize from "@/app/components/prospect/Filters/companySize";
import EstablishedYear from "@/app/components/prospect/Filters/establishedYear";
import EventFollowers from "@/app/components/prospect/Filters/eventFollowers";
import ParticipationType from "@/app/components/prospect/Filters/participationType";
import DesignationFilter from "@/app/components/prospect/Filters/designation";
import LocationSelector from "@/app/components/prospect/Filters/location";
import PeopleFilter from "@/app/components/prospect/Filters/peopleFilter";
import { PeopleList } from "@/app/components/prospect/PeopleList";
import { useFilterState } from "@/hooks/useFilterState";
import { CompanyListResponse } from "@/types/prospect";
import List from "@/components/search/list";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { FilterIcon } from "lucide-react";
import whrbotlogo from "@/public/whrbotlogo.svg";
import Image from "next/image";

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

const eventFiltersInCompany: ProspectFilters[] = [
  {
    id: "event-1",
    label: "Location",
    enabled: true,
    filterName: "eventLocationIds",
  },
  {
    id: "event-2",
    label: "Category",
    enabled: true,
    filterName: "eventCategoryIds",
  },
  {
    id: "event-3",
    label: "Followers",
    enabled: true,
    filterName: "eventFollowers",
  },
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
      {
        name: "eventTypes",
        label: "Event Type",
        component: "EventTypeSelector",
        enabled: true,
      },
      {
        name: "categories",
        label: "Category",
        component: "CategorySelector",
        enabled: true,
      },
      {
        name: "eventFormats",
        label: "Format",
        component: "EventFormatSelector",
        enabled: true,
      },
      {
        name: "locationIds",
        label: "Location",
        component: "LocationSelector",
        enabled: true,
      },
      {
        name: "active_gte",
        label: "Date Range",
        component: "DateRangeSelector",
        enabled: true,
      },
      {
        name: "status",
        label: "Status",
        component: "StatusSelector",
        enabled: true,
      },
      {
        name: "entryType",
        label: "Entry",
        component: "EventEntrySelector",
        enabled: true,
      },
      {
        name: "ratings",
        label: "User Rating",
        component: "UserRatingSelector",
        enabled: true,
      },
    ],
  },
  {
    id: "advanced-filters",
    label: "Advanced Filters",
    filters: [
      {
        name: "eventIds",
        label: "Edition",
        component: "EditionSelector",
        enabled: true,
      },
      {
        name: "type",
        label: "Global & Touring",
        component: "GlobalAndTouringSelector",
        enabled: true,
      },
      {
        name: "status",
        label: "Forecasted Status",
        component: "ForecastedStatusSelector",
        enabled: true,
      },
      {
        name: "frequencies",
        label: "Frequency",
        component: "FrequencySelector",
        enabled: true,
      },
      {
        name: "includeKeywords",
        label: "Keywords",
        component: "KeywordFilter",
        enabled: true,
      },
    ],
  },
  {
    id: "insights-scores",
    label: "Insights & Scores",
    filters: [
      {
        name: "estimatedVisitors",
        label: "Estimated Visitors",
        component: "EstimatedVisitorsSelector",
        enabled: true,
      },
      {
        name: "estimatedExhibitors",
        label: "Estimated Exhibitors",
        component: "EstimatedExhibitorsSelector",
        enabled: !isEventeli,
      },
      {
        name: "trust_score_gte",
        label: "Event Analytics",
        component: "EventAnalyticsSelector",
        enabled: true,
      },
      {
        name: "economic_impact_gte",
        label: "Economic Impact",
        component: "EstimatedEconomicImpactSelector",
        enabled: true,
      },
      {
        name: "top",
        label: "Event Ranking",
        component: "EventRankingSelector",
        enabled: true,
      },
    ],
  },
  {
    id: "audience-intel",
    label: "Audience Intelligence",
    filters: [
      {
        name: "ratings",
        label: "Audience Quality",
        component: "AudienceQualitySelector",
        enabled: true,
      },
      {
        name: "ratings",
        label: "Exhibitor Quality",
        component: "ExhibitorQualitySelector",
        enabled: true,
      },
      {
        name: "audienceSpread",
        label: "Audience Zone Status",
        component: "AudienceZoneSatusSelector",
        enabled: !isEventeli,
      },
      {
        name: "designations",
        label: "Audience Des & Dep",
        component: "AudienceDesAndDep",
        enabled: true,
      },
      {
        name: "audienceSpreadRegions",
        label: "Audience Spread",
        component: "AudienceSpread",
        enabled: true,
      },
    ],
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
  const { setFilter, getFilterValue } = useFilterState();

  const {
    localFilters,
    applyFilters,
    getLocalFilterValue,
    setLocalFilter,
    deleteMultipleLocalFilters,
  } = useFilterContext();

  const selectedView = getFilterValue("viewBy") || "event";

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
    console.log("Create tracker");
  };

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue={"event"}
        value={selectedView}
        onValueChange={handleTabChange}
      >
        <div className="overflow-y-auto pt-4 pl-6  h-[calc(100vh-60px)] flex flex-col">
          <div className="pb-3 sticky top-0 bg-background z-10">
            <TabsList className="grid grid-cols-3 w-full h-auto bg-[#F8F8FA] p-1 rounded-lg">
              <TabsTrigger
                value="event"
                className="text-sm flex gap-2 items-center px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Buildings width="16px" height="16px" />
                Events
              </TabsTrigger>
              <TabsTrigger
                value="company"
                className="text-sm flex gap-2 items-center px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Buildings width="16px" height="16px" />
                Companies
              </TabsTrigger>
              <TabsTrigger
                value="user"
                className="text-sm flex gap-2 items-center px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Users width="16px" height="16px" />
                People
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mb-3 bg-[#F7F7FF] rounded-xl p-4 border border-[#E6E6E6]">
            <div className="flex items-center gap-2">
              <Image
                src={whrbotlogo}
                alt="WHR bot"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-sm font-medium">WHR bot</div>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div className="text-xs text-[#6E6F89]">
                Let's save this search and help you track efficiently.
              </div>
              <div className="flex items-center">
                <Switch />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto w-full mt-0">
            <TabsContent value="event" className="mt-0">
              <div className="p-3 bg-[var(--background-secondary-color)]">
                <Accordion
                  type="multiple"
                  className="space-y-4"
                  defaultValue={["basic-filters"]}
                >
                  {eventFilters.map((section) => (
                    <AccordionItem
                      key={section.id}
                      value={section.id}
                      className="border-0"
                    >
                      <AccordionTrigger className="hover:no-underline py-2">
                      <div className="text-xs flex gap-2 items-center pl-2 uppercase font-medium text-[var(--secondary-text-color)]">
                        <Filter
                          color="var(--muted-foreground)"
                          width="12px"
                          height="12px"
                        />
                          {section.label}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-background border border-[var(--neutral-light-color)] rounded-sm p-4 space-y-3">
                          {section.filters.map((filter) => {
                            const Component = getFilterComponent(
                              filter.component
                            );
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
              <div className="h-[75%] overflow-y-auto w-full mt-0">
                <div className="p-3 bg-[var(--background-secondary-color)]">
                  <div className="space-y-6">
                    {/* Company Filters Section */}
                    <div>
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
                        className="bg-background border border-[var(--neutral-light-color)] rounded-sm mb-6"
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
                              ) : item.filterName === "eventFollowers" ? (
                                <EventFollowers />
                              ) : item.filterName === "eventLocationIds" ? (
                                <LocationSelector filterName={item.filterName} />
                              ) : item.filterName === "userJobTitle" ? (
                                <DesignationFilter />
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

                    {/* Event Filters Section */}
                    <div>
                      <div className="text-xs flex gap-2 items-center p-2 pb-4 font-medium text-[var(--secondary-text-color)]">
                        <Filter
                          color="var(--muted-foreground)"
                          width="12px"
                          height="12px"
                        />
                        EVENT FILTERS
                      </div>
                      <Accordion
                        type="single"
                        className="bg-background border border-[var(--neutral-light-color)] rounded-sm mb-6"
                        collapsible
                      >
                        {eventFiltersInCompany.map((item) => (
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
                              ) : item.filterName === "eventFollowers" ? (
                                <EventFollowers />
                              ) : item.filterName === "eventLocationIds" ? (
                                <LocationSelector filterName={item.filterName} />
                              ) : item.filterName === "userJobTitle" ? (
                                <DesignationFilter />
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

                    {/* People Filters Section */}
                    <div>
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
                              ) : item.filterName === "eventFollowers" ? (
                                <EventFollowers />
                              ) : item.filterName === "eventLocationIds" ? (
                                <LocationSelector filterName={item.filterName} />
                              ) : item.filterName === "userJobTitle" ? (
                                <DesignationFilter />
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
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="user" className="mt-0">
            <div className="h-[75%] overflow-y-auto w-full mt-0">
                <div className="p-3 bg-[var(--background-secondary-color)]">
                  <div className="space-y-6">
                    {/* Company Filters Section */}
                    <div>
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
                        className="bg-background border border-[var(--neutral-light-color)] rounded-sm mb-6"
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
                              ) : item.filterName === "eventFollowers" ? (
                                <EventFollowers />
                              ) : item.filterName === "eventLocationIds" ? (
                                <LocationSelector filterName={item.filterName} />
                              ) : item.filterName === "userJobTitle" ? (
                                <DesignationFilter />
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

                    {/* Event Filters Section */}
                    <div>
                      <div className="text-xs flex gap-2 items-center p-2 pb-4 font-medium text-[var(--secondary-text-color)]">
                        <Filter
                          color="var(--muted-foreground)"
                          width="12px"
                          height="12px"
                        />
                        EVENT FILTERS
                      </div>
                      <Accordion
                        type="single"
                        className="bg-background border border-[var(--neutral-light-color)] rounded-sm mb-6"
                        collapsible
                      >
                        {eventFiltersInCompany.map((item) => (
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
                              ) : item.filterName === "eventFollowers" ? (
                                <EventFollowers />
                              ) : item.filterName === "eventLocationIds" ? (
                                <LocationSelector filterName={item.filterName} />
                              ) : item.filterName === "userJobTitle" ? (
                                <DesignationFilter />
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

                    {/* People Filters Section */}
                    <div>
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
                              ) : item.filterName === "eventFollowers" ? (
                                <EventFollowers />
                              ) : item.filterName === "eventLocationIds" ? (
                                <LocationSelector filterName={item.filterName} />
                              ) : item.filterName === "userJobTitle" ? (
                                <DesignationFilter />
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
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>

          <div className="w-full sticky bottom-0 bg-background z-10">
            <div className="p-4 border-t bg-white/80 backdrop-blur-sm space-y-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  onClick={() =>
                    deleteMultipleLocalFilters(
                      Object.keys(localFilters) as (keyof Filters)[]
                    )
                  }
                  disabled={Object.keys(localFilters).length === 0}
                  className="text-xs text-[#6E6F89] hover:text-primary hover:bg-transparent p-0 h-auto font-normal"
                >
                  <FilterX className="w-3.5 h-3.5 mr-1" />
                  Reset all filters
                </Button>
                <span className="text-xs text-[#6E6F89]">
                  {Object.keys(localFilters).length} filters applied
                </span>
              </div>
              <Button onClick={searchHandler} className="w-full h-10">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Prospect;
