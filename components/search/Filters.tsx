"use client";

import JoyRideCustom from "@/app/components/internal/walkthrough/JoyRideCustom";
import CompanySize from "@/app/components/prospect/Filters/companySize";
import CompanyType from "@/app/components/prospect/Filters/companyType";
import Department from "@/app/components/prospect/Filters/department";
import EstablishedYear from "@/app/components/prospect/Filters/establishedYear";
import EventFollowers from "@/app/components/prospect/Filters/eventFollowers";
import Industry from "@/app/components/prospect/Filters/industryFilter";
import ParticipationType from "@/app/components/prospect/Filters/participationType";
import PeopleFilter from "@/app/components/prospect/Filters/peopleFilter";
import ProductTopicsNew from "@/app/components/prospect/Filters/productTopicsNew";
import Seniority from "@/app/components/prospect/Filters/seniority";
import AudienceDesAndDep from "@/components/search/advancedFilters/audienceDes&Dep";
import AudienceQualitySelector from "@/components/search/advancedFilters/audienceQualityScores";
import AudienceSpread from "@/components/search/advancedFilters/audienceSpread";
import AudienceZoneSatusSelector from "@/components/search/advancedFilters/audienceZone";
import EditionSelector from "@/components/search/advancedFilters/edition";
import EstimatedEconomicImpactSelector from "@/components/search/advancedFilters/estimatedEconomicImpact";
import EstimatedExhibitorsSelector from "@/components/search/advancedFilters/estimatedExhibitors";
import EstimatedVisitorsSelector from "@/components/search/advancedFilters/estimatedVisitors";
import EventAnalyticsSelector from "@/components/search/advancedFilters/eventAnalytics";
import EventRankingSelector from "@/components/search/advancedFilters/eventRanking";
import ExhibitorQualitySelector from "@/components/search/advancedFilters/exhibitorQualityScores";
import ForecastedStatusSelector from "@/components/search/advancedFilters/forecastedStatus";
import FrequencySelector from "@/components/search/advancedFilters/frequency";
import GlobalAndTouringSelector from "@/components/search/advancedFilters/globalAndTouring";
import {
  default as KeywordFilter,
  default as ProductTopics,
} from "@/components/search/advancedFilters/product&Topics";
import CategorySelector from "@/components/search/categorySelector";
import DateRangeSelector from "@/components/search/dateRange";
import EventEntrySelector from "@/components/search/eventEntry";
import EventFormatSelector from "@/components/search/eventFormat";
import EventTypeSelector from "@/components/search/eventType";
import LocationSelector from "@/components/search/location";
import MultiSelectSearchBar from "@/components/search/searchbar";
import StatusSelector from "@/components/search/status";
import UserRatingSelector from "@/components/search/userRatingSelector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isEventeli } from "@/config";
import { useFilterContext } from "@/context/filterContext";
import { useTheme } from "@/context/theme";
import { toast } from "@/hooks/use-toast";
import { useFilterState } from "@/hooks/useFilterState";
import whrbotlogo from "@/public/whrbotlogo.svg";
import { GAEvent } from "@/utils/GAEvent";
import {
  Calendar1,
  ChevronLeft,
  ChevronRight,
  Filter,
  FilterX,
  Lock,
  UserSearch,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Step } from "react-joyride";
import CreateTrackerDialog from "./createTrackerDialog";
import FilterContent from "./FilterContent";
import { useIsMobile, useMediaQuery } from "@/hooks/useMediaQuery";

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
  source?:string;
  onToggleCollapse?: () => void;
  type: "events" | "companies" | "people";
  children: React.ReactNode;
}

const Filters = ({
  isCollapsed,
  onToggleCollapse,
  type,
  children,
  source,
}: FiltersProps) => {
  const { localFilters, applyFilters, deleteMultipleLocalFilters } =
    useFilterContext();
  const { getFilterValue } = useFilterState();
  const isMobile = useIsMobile();
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

  const [steps, setSteps] = useState<Step[]>([]);
  const [run, setRun] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // const joyrideCallback = (data: CallBackProps) => {
  //   const { status, type, step } = data;
  //   console.log(step, type);
  //   if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
  //     if (typeof window !== "undefined") {
  //       let walkthroughCompleted: string[] = JSON.parse(
  //         localStorage.getItem("walkthroughCompleted") || "[]"
  //       );

  //       if (!walkthroughCompleted.includes("research")) {
  //         walkthroughCompleted.push("research");

  //         localStorage.setItem(
  //           "walkthroughCompleted",
  //           JSON.stringify(walkthroughCompleted)
  //         );
  //       }
  //     }
  //     setRun(false);
  //   }
  // };

  useEffect(() => {
    if (mounted) {
      const handle = requestAnimationFrame(() => {
        const newSteps: Step[] = [
          {
            target: "#research-tabs",
            title: "Research",
            content:
              "Track events, companies, or people to stay on top of what matters most.",
            disableBeacon: true,
          },
          ...(!isMobile
            ? [
                {
                  target: "#basic-filters",
                  title: "Basic Filters",
                  content:
                    "Explore the basic filters to quickly refine your results by category, date, and location.",
                  disableBeacon: true,
                },
                {
                  target: "#advanced-details",
                  title: "Advanced Details",
                  content:
                    "Unlock advanced filters and drill down into your data.",
                  disableBeacon: true,
                },
                {
                  target: "#insights-scores",
                  title: "Insights & Scores",
                  content: isEventeli
                    ? "Insight scores include estimated visitors, estimated exhibitors, ranking and analytics to help you assess each event’s impact."
                    : "Insight scores include estimated visitors, estimated exhibitors, and ranking to help you assess each event’s impact.",
                  disableBeacon: true,
                },
                ...(!isEventeli
                  ? [
                      {
                        target: "#audience-intel",
                        title: "Audience Intel",
                        content:
                          "Audience Intel gives you the where, who, and how of your audience for informed targeting.",
                        disableBeacon: true,
                      },
                    ]
                  : []),
              ]
            : [
                {
                  target: "#filters-mobile",
                  title: "Filters",
                  content:
                    "Unlock all basic and advanced filters and save this search.",
                  disableBeacon: true,
                },
              ]),
          {
            target: isMobile
              ? "#research-view-mobile"
              : (document.querySelectorAll(
                  "#research-view-desktop"
                )[1] as HTMLElement) ?? "",
            title: "View",
            content: `Switch between list, ${
              !isMobile ? "table," : ""
            } map, or calendar views to see data from any angle.`,
            disableBeacon: true,
          },
          ...(!isEventeli
            ? [
                {
                  target: isMobile
                    ? "#sorting-dropdown-mobile"
                    : (document.querySelectorAll(
                        "#sorting-dropdown-desktop"
                      )[1] as HTMLElement) ?? "",
                  title: "Sorting",
                  content:
                    "Sort by date or advanced intel and insights scores to surface your top priorities.",
                  disableBeacon: true,
                },
              ]
            : []),
          ...(!isMobile
            ? [
                {
                  target: "#save-search-btn",
                  title: "Save Search ",
                  content:
                    "Save this search to revisit your filtered results anytime with one click.",
                  disableBeacon: true,
                },
              ]
            : []),
        ];

        const walkthroughCompleted: string[] = JSON.parse(
          localStorage.getItem("walkthroughCompleted") || "[]"
        );

        if (!walkthroughCompleted.includes("research")) {
          setTimeout(() => {
            setSteps(newSteps);
            setRun(true);
          }, 2000);
        }
      });

      return () => cancelAnimationFrame(handle);
    }
  }, [mounted]);

  return (
    <div className="w-full flex flex-col h-full bg-background">
      {/* {steps.length > 0 && (
        <Joyride
          tooltipComponent={(props) => (
            <Tooltip {...props} totalSteps={steps.length} />
          )}
          continuous={true}
          steps={steps}
          run={run}
          callback={joyrideCallback}
          disableCloseOnEsc
          scrollToFirstStep={false}
          disableScrolling={true}
          spotlightPadding={4}
          styles={{
            options: {
              zIndex: 10000,
              primaryColor: "#6750a4",
              textColor: "#333",
              backgroundColor: "#fff",
              arrowColor: "#fff",
            },
            tooltip: {
              borderRadius: "8px",
              padding: "10px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              fontSize: "13px",
              lineHeight: "1.4",
              width: "auto",
            },
            tooltipContent: {
              display: "flex",
              justifyContent: "center",
              padding: "10px 5px",
            },
            tooltipFooter: {
              margin: "5px 0px",
            },
            buttonClose: {
              color: "#999",
              fontSize: "10px",
              margin: "0px",
            },
          }}
        />
      )} */}
      {steps?.length > 0 && (
        <JoyRideCustom
          steps={steps}
          run={run}
          onFinish={() => setRun(false)}
          pathName="research"
        />
      )}
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
      <div className={`overflow-y-auto flex flex-col ${source !== "tracker" ? "pt-4 pl-6 h-[calc(100vh-60px)]" : "h-[calc(100vh-181px)]"}`}>
      {source!=="tracker" &&
        <div className="sticky top-0 bg-background z-10 p-4 md:p-0 md:pb-3">
          <Tabs defaultValue={type} value={type}>
            <TabsList
              className="grid grid-cols-3 w-full h-auto bg-muted p-1 rounded-lg"
              id="research-tabs"
            >
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
          {type == "events" && (
            <div className="block md:hidden mt-4">
              <MultiSelectSearchBar varient="medium" />
            </div>
          )}
        </div>
        }
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