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
import { useCallback, useState, useMemo } from "react";
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
import FilterContent from "./FilterContent";

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
  children: React.ReactNode;
}

const Filters = ({
  isCollapsed,
  onToggleCollapse,
  type,
  children,
}: FiltersProps) => {
  const { localFilters, applyFilters, deleteMultipleLocalFilters } =
    useFilterContext();
  const { getFilterValue } = useFilterState();
  const { theme } = useTheme();

  const filterCount = useMemo(() => {
    const excludedFilters = [
      "active_gte",
      "active_lte",
      "show",
      "limit",
      "offset",
      "skip",
    ];
    return Object.keys(localFilters).filter(
      (key) => !excludedFilters.includes(key)
    ).length;
  }, [localFilters]);

  const [trackerModalOpen, setTrackerModalOpen] = useState(false);

  const searchHandler = useCallback(() => {
    applyFilters({ resetPage: true });
  }, [applyFilters]);

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

  return (
    <div className="w-full flex flex-col h-full bg-background">
      <button
        onClick={onToggleCollapse}
        className="md:flex hidden group absolute -right-4 top-14 z-20 bg-background hover:bg-muted border border-border shadow-sm rounded-full w-9 h-9 items-center justify-center transition-all duration-200"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 group-hover:text-primary transition-colors" />
        ) : (
          <ChevronLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
        )}
      </button>
      <div className="overflow-y-auto md:pt-4 md:pl-6 h-[calc(100vh-60px)] flex flex-col">
        <div className="sticky top-0 bg-background z-10 p-4 md:p-0 md:pb-3">
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
          <div className="block md:hidden mt-4">
            <MultiSelectSearchBar varient="medium" />
          </div>
        </div>

        <div className="hidden md:block overflow-y-scroll">
          <FilterContent
            type={type}
            filterCount={filterCount}
            createTrackerHandler={createTrackerHandler}
            searchHandler={searchHandler}
          />
        </div>

        <div className="hidden md:block w-full sticky bottom-0 bg-background z-10">
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

        <div className="md:hidden block">{children}</div>

        <CreateTrackerDialog
          open={trackerModalOpen}
          onOpenChange={setTrackerModalOpen}
        />
      </div>
    </div>
  );
};

export default Filters;
