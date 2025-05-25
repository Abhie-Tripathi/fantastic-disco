import { isEventeli } from "@/config";
import EventTypeSelector from "@/components/search/eventType";
import CategorySelector from "@/components/search/categorySelector";
import EventFormatSelector from "@/components/search/eventFormat";
import ProductTopics from "@/components/search/advancedFilters/product&Topics";
import ProductTopicsNew from "@/app/components/prospect/Filters/productTopicsNew";
import LocationSelector from "@/components/search/location";
import DateRangeSelector from "@/components/search/dateRange";
import StatusSelector from "@/components/search/status";
import EventEntrySelector from "@/components/search/eventEntry";
import MultiSelectSearchBar from "@/components/search/searchbar";
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
import PeopleFilter from "@/app/components/prospect/Filters/peopleFilter";
import EventFollowers from "@/app/components/prospect/Filters/eventFollowers";
import ParticipationType from "@/app/components/prospect/Filters/participationType";
import CompanySize from "@/app/components/prospect/Filters/companySize";
import EstablishedYear from "@/app/components/prospect/Filters/establishedYear";
import Industry from "@/app/components/prospect/Filters/industryFilter";
import CompanyType from "@/app/components/prospect/Filters/companyType";
import Seniority from "@/app/components/prospect/Filters/seniority";
import Department from "@/app/components/prospect/Filters/department";

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
    // {
    //   id: "audience-intel",
    //   label: "Audience Intel",
    //   filters: [
    //     {
    //       id: "designations",
    //       component: "AudienceDesAndDep",
    //       enabled: true,
    //     },
    //   ],
    // },
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

export const filters = isEventeli ? geoFilters : gtmFilters;

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

export const getFilterComponent = (componentName: string) => {
  return components[componentName];
}; 