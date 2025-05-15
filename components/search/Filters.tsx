"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  FilterX,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar1,
  Building,
  UserSearch,
  Lock,
} from "lucide-react";
import { useCallback, useState, useMemo, useEffect, useRef } from "react";
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
import Seniority from "@/app/components/prospect/Filters/seniority";
import Department from "@/app/components/prospect/Filters/department";
import AudienceZoneSatusSelector from "@/components/search/advancedFilters/audienceZone";
import AudienceDesAndDep from "@/components/search/advancedFilters/audienceDes&Dep";
import ProductTopics from "@/components/search/advancedFilters/product&Topics";
import ProductTopicsNew from "@/app/components/prospect/Filters/productTopicsNew";
import MultiSelectSearchBar from "@/components/search/searchbar";
import AudienceSpread from "@/components/search/advancedFilters/audienceSpread";
import { Switch } from "@/components/ui/switch";
import whrbotlogo from "@/public/whrbotlogo.svg";
import Image from "next/image";
import { isEventeli } from "@/config";
import Link from "next/link";
import CreateTrackerDialog from "./createTrackerDialog";
import { GAEvent } from "@/utils/GAEvent";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/theme";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

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

const gtmFilters: {
  [key: string]: FilterSection[];
} = {
  events: [
    {
      id: "basic-filters",
      label: "Basic Filters",
      filters: [
        {
          id: "eventIds",
          component: "MultiSelectSearchBar",
          enabled: true,
        },
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
      id: "all-filters",
      label: "All Filters",
      filters: [
        {
          id: "category",
          component: "CategorySelector",
          filterName: "eventCategorySlugs",
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
          component: "ProductTopicsNew",
          filterName: "eventProductIds",
          enabled: true,
        },
        {
          id: "companyType",
          component: "CompanyType",
          filterName: "eventParticipationType",
          enabled: true,
        },
        {
          id: "company-followers",
          component: "EventFollowers",
          filterName: "communitySize",
          enabled: true,
        },
        {
          id: "locationIds",
          component: "LocationSelector",
          filterName: "eventLocationIds",
          enabled: true,
        },
        {
          id: "event-followers",
          component: "EventFollowers",
          enabled: true,
        },
        {
          id: "userNames",
          component: "PeopleFilter",
          filterName: "userNames",
          enabled: true,
        },
        {
          id: "userSocialLink",
          component: "PeopleFilter",
          filterName: "userSocialLink",
          enabled: true,
        },
        {
          id: "userJobTitle",
          component: "Seniority",
          filterName: "userJobTitle",
          enabled: true,
        },
        {
          id: "userDepartment",
          component: "Department",
          filterName: "userJobTitle",
          enabled: true,
        },
        // {
        //   id: "userJobTitle",
        //   component: "AudienceDesAndDep",
        //   filterName: "userJobTitle",
        //   enabled: true,
        // },
      ],
    },
  ],
  people: [
    {
      id: "all-filters",
      label: "Filters",
      filters: [
        {
          id: "userNames",
          component: "PeopleFilter",
          filterName: "userNames",
          enabled: true,
        },
        {
          id: "userSocialLink",
          component: "PeopleFilter",
          filterName: "userSocialLink",
          enabled: true,
        },
        {
          id: "userJobTitle",
          component: "Seniority",
          filterName: "userJobTitle",
          enabled: true,
        },
        {
          id: "userDepartment",
          component: "Department",
          filterName: "userJobTitle",
          enabled: true,
        },
        {
          id: "category",
          component: "CategorySelector",
          filterName: "eventCategorySlugs",
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
          component: "ProductTopicsNew",
          filterName: "eventProductIds",
          enabled: true,
        },
        {
          id: "people-followers",
          component: "EventFollowers",
          filterName: "communitySize",
          enabled: true,
        },
        {
          id: "locationIds",
          component: "LocationSelector",
          filterName: "eventLocationIds",
          enabled: true,
        },
        {
          id: "event-followers",
          component: "EventFollowers",
          enabled: true,
        },
      ],
    },
  ],
} as const;

const geoFilters: {
  [key: string]: FilterSection[];
} = {
  events: [
    {
      id: "basic-filters",
      label: "Basic Filters",
      filters: [
        {
          id: "eventIds",
          component: "MultiSelectSearchBar",
          enabled: true,
        },
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
        // {
        //   id: "audienceSpread",
        //   component: "AudienceZoneSatusSelector",
        //   enabled: !isEventeli,
        // },
        {
          id: "designations",
          component: "AudienceDesAndDep",
          enabled: true,
        },
        // {
        //   id: "audienceSpreadRegions",
        //   component: "AudienceSpread",
        //   enabled: true,
        // },
      ],
    },
  ],
  companies: [
    {
      id: "all-filters",
      label: "All Filters",
      filters: [
        {
          id: "category",
          component: "CategorySelector",
          filterName: "eventCategorySlugs",
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
          component: "ProductTopicsNew",
          filterName: "eventProductIds",
          enabled: true,
        },
        {
          id: "companyType",
          component: "CompanyType",
          filterName: "eventParticipationType",
          enabled: true,
        },
        {
          id: "company-followers",
          component: "EventFollowers",
          filterName: "communitySize",
          enabled: true,
        },
        {
          id: "locationIds",
          component: "LocationSelector",
          filterName: "eventLocationIds",
          enabled: true,
        },
        {
          id: "event-followers",
          component: "EventFollowers",
          enabled: true,
        },
        {
          id: "userNames",
          component: "PeopleFilter",
          filterName: "userNames",
          enabled: true,
        },
        {
          id: "userSocialLink",
          component: "PeopleFilter",
          filterName: "userSocialLink",
          enabled: true,
        },
        {
          id: "userJobTitle",
          component: "Seniority",
          filterName: "userJobTitle",
          enabled: true,
        },
        {
          id: "userDepartment",
          component: "Department",
          filterName: "userJobTitle",
          enabled: true,
        },
        // {
        //   id: "userJobTitle",
        //   component: "AudienceDesAndDep",
        //   filterName: "userJobTitle",
        //   enabled: true,
        // },
      ],
    },
  ],
  people: [
    {
      id: "all-filters",
      label: "Filters",
      filters: [
        {
          id: "userNames",
          component: "PeopleFilter",
          filterName: "userNames",
          enabled: true,
        },
        {
          id: "userSocialLink",
          component: "PeopleFilter",
          filterName: "userSocialLink",
          enabled: true,
        },
        {
          id: "userJobTitle",
          component: "Seniority",
          filterName: "userJobTitle",
          enabled: true,
        },
        {
          id: "userDepartment",
          component: "Department",
          filterName: "userJobTitle",
          enabled: true,
        },
        {
          id: "category",
          component: "CategorySelector",
          filterName: "eventCategorySlugs",
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
          component: "ProductTopicsNew",
          filterName: "eventProductIds",
          enabled: true,
        },
        {
          id: "people-followers",
          component: "EventFollowers",
          filterName: "communitySize",
          enabled: true,
        },
        {
          id: "locationIds",
          component: "LocationSelector",
          filterName: "eventLocationIds",
          enabled: true,
        },
        {
          id: "event-followers",
          component: "EventFollowers",
          enabled: true,
        },
      ],
    },
  ],
} as const;

const filters = isEventeli ? geoFilters : gtmFilters;

const getFilterComponent = (componentName: string) => {
  const components: { [key: string]: React.ComponentType<any> } = {
    EventTypeSelector,
    CategorySelector,
    EventFormatSelector,
    ProductTopics,
    ProductTopicsNew,
    LocationSelector,
    DateRangeSelector,
    StatusSelector,
    EventEntrySelector,
    MultiSelectSearchBar,
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
    Seniority,
    Department,
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
  const { theme } = useTheme();

  const filterCount = useMemo(() => {
    const excludedFilters = ["active_gte", "active_lte"];
    return Object.keys(localFilters).filter(
      (key) => !excludedFilters.includes(key)
    ).length;
  }, [localFilters]);

  const [trackerModalOpen, setTrackerModalOpen] = useState(false);

  const searchHandler = useCallback(() => {
    applyFilters({ resetPage: true });
  }, []);

  const createTrackerHandler = async () => {
    GAEvent("research", "Filters", "Saved Filter | Viewed", "Saved Filter");

    if (!(getFilterValue("locationIds") || getFilterValue("viewBound"))) {
      toast({
        title: "Please select location",
        variant: "destructive",
      });
    } else {
      setTrackerModalOpen(true);
    }
  };

  const [steps, setSteps] = useState<Step[]>([]);
  const [run, setRun] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const saveSearchRef = useRef(null);

  const joyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      if (typeof window !== "undefined") {
        let walkthroughCompleted: string[] = JSON.parse(
          localStorage.getItem("walkthroughCompleted") || "[]"
        );

        if (!walkthroughCompleted.includes("research")) {
          walkthroughCompleted.push("research");

          localStorage.setItem(
            "walkthroughCompleted",
            JSON.stringify(walkthroughCompleted)
          );
        }
      }
      setRun(false);
    }
  };

  useEffect(() => {
    if (mounted && saveSearchRef.current) {
      const handle = requestAnimationFrame(() => {
        const newSteps: Step[] = [
          {
            target: "#save-search-btn",
            title: "Save Search",
            content: "Save this search to add it as tracker",
            disableBeacon: true,
          },
        ];

        const walkthroughCompleted: string[] = JSON.parse(
          localStorage.getItem("walkthroughCompleted") || "[]"
        );

        if (!walkthroughCompleted.includes("research")) {
          setSteps(newSteps);
          setRun(true);
        }
      });

      return () => cancelAnimationFrame(handle);
    }
  }, [mounted, saveSearchRef.current]);

  return (
    <div className="w-full flex flex-col h-full bg-background">
      {mounted && steps.length > 0 && (
        <Joyride steps={steps} run={run} callback={joyrideCallback} />
      )}
      <button
        onClick={onToggleCollapse}
        className="group absolute -right-4 top-14 z-20 bg-background hover:bg-muted border border-border shadow-sm rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 group-hover:text-primary transition-colors" />
        ) : (
          <ChevronLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
        )}
      </button>
      <div className="overflow-y-auto pt-4 pl-6 h-[calc(100vh-60px)] flex flex-col">
        <div className="pb-3 sticky top-0 bg-background z-10">
          <Tabs defaultValue={type} value={type}>
            <TabsList className="grid grid-cols-3 w-full h-auto bg-muted p-1 rounded-lg">
              <Link href="/internal/search/events" className="contents">
                <TabsTrigger
                  value="events"
                  className="text-sm flex gap-2 items-center px-4 py-2 w-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Calendar1 className="w-4 h-4" />
                  Events
                </TabsTrigger>
              </Link>
              <Link href="/internal/search/companies" className="contents">
                <TabsTrigger
                  value="companies"
                  className="text-sm flex gap-2 items-center px-4 py-2 w-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Companies
                </TabsTrigger>
              </Link>
              <Link href="/internal/search/people" className="contents">
                <TabsTrigger
                  value="people"
                  className="text-sm flex gap-2 items-center px-4 py-2 w-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <UserSearch className="w-4 h-4" />
                  People
                </TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-y-auto w-full mt-0">
          <div className="p-3 bg-[var(--background-secondary-color)]">
            {type === "events" && filterCount > 0 && (
              <div
                className="mb-3 bg-[#F7F7FF] flex justify-between items-center dark:bg-accent/10 rounded-xl p-4 border border-border"
                ref={saveSearchRef}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={whrbotlogo}
                    alt="WHR bot"
                    className="w-8 h-8 rounded-full bg-background"
                  />
                  <div className="text-sm font-medium text-foreground">
                    Save this search
                  </div>
                </div>
                <div className=" flex items-center justify-between">
                  <Button
                    id="save-search-btn"
                    variant="outline"
                    size="sm"
                    onClick={createTrackerHandler}
                    className="h-8"
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
            <Accordion
              type="multiple"
              className="space-y-4"
              defaultValue={[filters[type][0]?.id]}
            >
              {filters[type].map((section) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="border rounded-lg bg-background shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <AccordionTrigger className="hover:no-underline py-3 px-4 transition-all duration-200 [&[data-state=open]]:bg-muted">
                    <div className="text-sm flex gap-2 items-center uppercase font-medium">
                      <Filter className="w-4 h-4" />
                      {section.label}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 border-t pt-4 mt-1">
                      {section.filters.map((filter) => {
                        const Component = getFilterComponent(filter.component);
                        if (!Component) return null;

                        return (
                          <div
                            key={filter.id}
                            className="flex items-center justify-between group relative transition-opacity duration-200"
                            style={{ opacity: filter.enabled ? 1 : 0.5 }}
                          >
                            <div className="w-full">
                              <Component
                                variant="accordion"
                                disabled={!filter.enabled}
                                filterName={filter.filterName}
                              />
                            </div>
                            {!filter.enabled && (
                              <Lock className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[var(--secondary-text-color)]" />
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
          <div className="p-4 pb-0 border-t bg-background/80 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                onClick={() => {
                  deleteMultipleLocalFilters(
                    Object.keys(localFilters) as any[]
                  );
                }}
                disabled={filterCount === 0}
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
