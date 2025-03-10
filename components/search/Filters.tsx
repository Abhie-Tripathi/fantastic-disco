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
import { FilterX, ChevronLeft, ChevronRight } from "lucide-react";
import { Filter } from "geist-icons";
import { useCallback, useState } from "react";
import Industry from "@/app/components/prospect/Filters/industryFilter";
import { useFilterContext } from "@/context/filterContext";
import CompanySize from "@/app/components/prospect/Filters/companySize";
import EstablishedYear from "@/app/components/prospect/Filters/establishedYear";
import EventFollowers from "@/app/components/prospect/Filters/eventFollowers";
import ParticipationType from "@/app/components/prospect/Filters/participationType";
import LocationSelector from "@/components/search/location";
import PeopleFilter from "@/app/components/prospect/Filters/peopleFilter";
import { useFilterState } from "@/hooks/useFilterState";
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
import CompanyType from "@/app/components/prospect/Filters/companyType";
import AudienceZoneSatusSelector from "@/components/search/advancedFilters/audienceZone";
import AudienceDesAndDep from "@/components/search/advancedFilters/audienceDes&Dep";
import ProductTopics from "@/components/search/advancedFilters/product&Topics";
import AudienceSpread from "@/components/search/advancedFilters/audienceSpread";
import { Switch } from "@/components/ui/switch";
import whrbotlogo from "@/public/whrbotlogo.svg";
import Image from "next/image";
import { isEventeli } from "@/config";
import Link from "next/link";
import CreateTrackerDialog from "./createTrackerDialog";
import { GAEvent } from "@/utils/GAEvent";
import { toast } from "@/hooks/use-toast";

interface FilterSection {
  id: string;
  label: string;
  filters: FilterItem[];
}

interface FilterItem {
  id: string;
  component: string;
  enabled: boolean;
  filterName?: string;
}

const filters: {
  [key: string]: FilterSection[];
} = {
  events: [
    {
      id: "basic-filters",
      label: "Basic Filters",
      filters: [
        {
          id: "eventTypes",
          component: "EventTypeSelector",
          enabled: true,
        },
        {
          id: "categories",
          component: "CategorySelector",
          enabled: true,
        },
        {
          id: "eventFormats",
          component: "EventFormatSelector",
          enabled: true,
        },
        {
          id: "locationIds",
          component: "LocationSelector",
          enabled: true,
        },
        {
          id: "dateRange",
          component: "DateRangeSelector",
          enabled: true,
        },
        {
          id: "status",
          component: "StatusSelector",
          enabled: true,
        },
        {
          id: "entryType",
          component: "EventEntrySelector",
          enabled: true,
        },
        {
          id: "ratings",
          component: "UserRatingSelector",
          enabled: true,
        },
      ],
    },
    {
      id: "advanced-details",
      label: "Advanced Details",
      filters: [
        {
          id: "eventIds",
          component: "EditionSelector",
          enabled: true,
        },
        {
          id: "brand",
          component: "GlobalAndTouringSelector",
          enabled: true,
        },
        {
          id: "status",
          component: "ForecastedStatusSelector",
          enabled: true,
        },
        {
          id: "frequencies",
          component: "FrequencySelector",
          enabled: true,
        },
        {
          id: "productTopics",
          component: "ProductTopics",
          enabled: true,
        },
      ],
    },
    {
      id: "insights-scores",
      label: "Insights & Scores",
      filters: [
        {
          id: "estimatedVisitors",
          component: "EstimatedVisitorsSelector",
          enabled: true,
        },
        {
          id: "estimatedExhibitors",
          component: "EstimatedExhibitorsSelector",
          enabled: !isEventeli,
        },
        {
          id: "eventAnalytics",
          component: "EventAnalyticsSelector",
          enabled: true,
        },
        {
          id: "economicImpact",
          component: "EstimatedEconomicImpactSelector",
          enabled: true,
        },
        {
          id: "eventRanking",
          component: "EventRankingSelector",
          enabled: true,
        },
      ],
    },
    {
      id: "audience-intel",
      label: "Audience Intel",
      filters: [
        {
          id: "ratings",
          component: "AudienceQualitySelector",
          enabled: true,
        },
        {
          id: "ratings",
          component: "ExhibitorQualitySelector",
          enabled: true,
        },
        {
          id: "audienceSpread",
          component: "AudienceZoneSatusSelector",
          enabled: !isEventeli,
        },
        {
          id: "designations",
          component: "AudienceDesAndDep",
          enabled: true,
        },
        {
          id: "audienceSpreadRegions",
          component: "AudienceSpread",
          enabled: true,
        },
      ],
    },
  ],
  companies: [
    {
      id: "company-filters",
      label: "Company Filters",
      filters: [
        {
          id: "category",
          component: "CategorySelector",
          filterName: "companyCategoryIds",
          enabled: true,
        },
        {
          id: "location",
          component: "LocationSelector",
          filterName: "companyLocationIds",
          enabled: true,
        },
        {
          id: "product-topics",
          component: "ProductTopics",
          filterName: "companyProductIds",
          enabled: true,
        },
        {
          id: "followers",
          component: "EventFollowers",
          enabled: true,
        },
        {
          id: "companyType",
          component: "CompanyType",
          enabled: true,
        },
      ],
    },
    {
      id: "event-filters",
      label: "Event Filters",
      filters: [
        {
          id: "locationIds",
          component: "LocationSelector",
          filterName: "eventLocationIds",
          enabled: true,
        },
        {
          id: "categoryIds",
          component: "CategorySelector",
          filterName: "eventCategoryIds",
          enabled: true,
        },
        {
          id: "followers",
          component: "EventFollowers",
          enabled: true,
        },
      ],
    },
    {
      id: "people-filters",
      label: "People Filters",
      filters: [
        {
          id: "userNames",
          component: "PeopleFilter",
          filterName: "userNames",
          enabled: true,
        },
        {
          id: "userJobTitle",
          component: "AudienceDesAndDep",
          filterName: "userJobTitle",
          enabled: true,
        },
        {
          id: "userSocialLink",
          component: "PeopleFilter",
          filterName: "userSocialLink",
          enabled: true,
        },
      ],
    },
  ],
  people: [
    {
      id: "company-filters",
      label: "Company Filters",
      filters: [
        {
          id: "category",
          component: "CategorySelector",
          enabled: true,
        },
        {
          id: "location",
          component: "LocationSelector",
          enabled: true,
        },
        {
          id: "product-topics",
          component: "ProductTopics",
          enabled: true,
        },
        {
          id: "followers",
          component: "EventFollowers",
          enabled: true,
        },
        {
          id: "companyType",
          component: "CompanyType",
          enabled: true,
        },
      ],
    },
    {
      id: "event-filters",
      label: "Event Filters",
      filters: [
        {
          id: "locationIds",
          component: "LocationSelector",
          enabled: true,
        },
        {
          id: "categoryIds",
          component: "CategorySelector",
          enabled: true,
        },
        {
          id: "followers",
          component: "EventFollowers",
          enabled: true,
        },
      ],
    },
    {
      id: "people-filters",
      label: "People Filters",
      filters: [
        {
          id: "userNames",
          component: "PeopleFilter",
          filterName: "userNames",
          enabled: true,
        },
        {
          id: "userJobTitle",
          component: "AudienceDesAndDep",
          filterName: "userJobTitle",
          enabled: true,
        },
        {
          id: "userSocialLink",
          component: "PeopleFilter",
          filterName: "userSocialLink",
          enabled: true,
        },
      ],
    },
  ],
} as const;

const getFilterComponent = (componentName: string) => {
  const components: { [key: string]: React.ComponentType<any> } = {
    EventTypeSelector,
    CategorySelector,
    EventFormatSelector,
    ProductTopics,
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
    PeopleFilter,
    EventFollowers,
    ParticipationType,
    CompanySize,
    EstablishedYear,
    Industry,
    CompanyType,
  };

  return components[componentName];
};

interface FiltersProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  type: "events" | "companies" | "people";
}

const Filters = ({ isCollapsed, onToggleCollapse, type }: FiltersProps) => {
  const { localFilters, applyFilters, deleteMultipleLocalFilters } =
    useFilterContext();

  const { getFilterValue } = useFilterState();
  const filterCount = Object.keys(localFilters).length;
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);

  const searchHandler = useCallback(() => {
    applyFilters({ resetPage: true });
  }, []);

  const createTrackerHandler = async () => {
    GAEvent("research", "Filters", "Saved Filter | Viewed", "Saved Filter");

    if (!getFilterValue("locationIds")) {
      toast({
        title: "Please select location",
        variant: "destructive",
      });
    } else {
      setTrackerModalOpen(true);
    }
  };

  return (
    <div>
      <button
        onClick={onToggleCollapse}
        className="group absolute -right-4 top-14 z-20 bg-white hover:bg-[#F8F8FA] border border-[#E6E6E6] shadow-sm rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 group-hover:text-primary transition-colors" />
        ) : (
          <ChevronLeft className="w-4 h-4  group-hover:text-primary transition-colors" />
        )}
      </button>
      <div className="overflow-y-auto pt-4 pl-6 h-[calc(100vh-60px)] flex flex-col">
        <div className="pb-3 sticky top-0 bg-background z-10">
          <Tabs defaultValue={type} value={type}>
            <TabsList className="grid grid-cols-3 w-full h-auto bg-[#F8F8FA] p-1 rounded-lg">
              <Link href="/internal/search/events" className="contents">
                <TabsTrigger
                  value="events"
                  className="text-sm flex gap-2 items-center px-4 py-2 w-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Buildings width="16px" height="16px" />
                  Events
                </TabsTrigger>
              </Link>
              <Link href="/internal/search/companies" className="contents">
                <TabsTrigger
                  value="companies"
                  className="text-sm flex gap-2 items-center px-4 py-2 w-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Buildings width="16px" height="16px" />
                  Companies
                </TabsTrigger>
              </Link>
              <Link href="/internal/search/people" className="contents">
                <TabsTrigger
                  value="people"
                  className="text-sm flex gap-2 items-center px-4 py-2 w-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Users width="16px" height="16px" />
                  People
                </TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
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
              <Switch
                checked={trackerModalOpen}
                onCheckedChange={createTrackerHandler}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full mt-0">
          <div className="p-3 bg-[var(--background-secondary-color)]">
            <Accordion
              type="multiple"
              className="space-y-4"
              defaultValue={[filters[type][0]?.id]}
            >
              {filters[type].map((section) => (
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
                        const Component = getFilterComponent(filter.component);
                        if (!Component) return null;

                        return (
                          <div
                            key={filter.id}
                            className="flex items-center justify-between group relative"
                            style={{ opacity: filter.enabled ? 1 : 0.5 }}
                          >
                            <div className="w-full">
                              <Component
                                disabled={!filter.enabled}
                                filterName={filter.filterName}
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
        </div>

        <div className="w-full sticky bottom-0 bg-background z-10">
          <div className="p-4 border-t bg-white/80 backdrop-blur-sm space-y-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                onClick={() => {
                  deleteMultipleLocalFilters(
                    Object.keys(localFilters) as any[]
                  );
                }}
                disabled={Object.keys(localFilters).length === 0}
                className="text-xs text-[#6E6F89] hover:text-primary hover:bg-transparent p-0 h-auto font-normal"
              >
                <FilterX className="w-3.5 h-3.5 mr-1" />
                Reset all filters
              </Button>
              <span className="text-xs text-[#6E6F89]">
                {filterCount} filters applied
              </span>
            </div>
            <Button onClick={searchHandler} className="w-full h-10">
              Apply Filters
            </Button>
          </div>
        </div>

        <CreateTrackerDialog
          open={trackerModalOpen}
          onOpenChange={setTrackerModalOpen}
        />
      </div>
    </div>
  );
};

export default Filters;
