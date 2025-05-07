"use client";
import styles from "./filters.style.module.css";
import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showToast } from '@/utils/showToast';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { isEventeli } from "@/config";
import { ApiError } from "@/types/api";
import { toast } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";
import EventTypeSelector from "@/components/search/eventType";
import CategorySelector from "@/components/search/categorySelector";
import EventFormatSelector from '@/components/search/eventFormat';
import EventStatusSelector from "@/components/search/status";
import DateRangeSelector from "@/components/search/dateRange";
import EventEntrySelector from "@/components/search/eventEntry";
import UserRatingSelector from "@/components/search/userRatingSelector";
import MaturitySelector from "@/components/search/advancedFilters/edition"
import LocationSelector from "@/components/search/location";
import EstimatedVisitorsSelector from "@/components/search/advancedFilters/estimatedVisitors";
import GlobalAndTouringSelector from "@/components/search/advancedFilters/globalAndTouring";
import EstimatedExhibitorsSelector from "@/components/search/advancedFilters/estimatedExhibitors";
import EstimatedEconomicImpactSelector from "@/components/search/advancedFilters/estimatedEconomicImpact";
import AudienceProfileSelector from "@/components/search/advancedFilters/audienceDes&Dep";
import ProductSelector from "@/components/search/advancedFilters/product&Topics"
import AudienceSpreadSelector from "@/components/search/advancedFilters/audienceSpread"
import { useTrackerServices } from '@/services/trackerServices'
import Image from "next/image";
import Url from '/public/url.svg'
import CloseIcon from "/public/internal/cross.svg";
import Add from '/public/add_Icon.svg'
import TemplateTable from "./templateTable";
import Competitor from "/public/competitor.svg";
import Speaking from "/public/speaking.svg";
import Keywords from "/public/keywords.svg";
import Company from '/public/company_Icon.svg'
import Name from '/public/userName_Icon.svg'
import { convertToCustomFormat, convertToYYYYMMDD } from "@/utils/dateFormat";
import { PresetData } from '@/types/trackers';
import { ChevronDown, InformationFill, Plus, Share } from "geist-icons";
import eventVisitorsData from "../../../../../public/data/eventVisitorsData.json";
// import styles from "./search.module.css";
import { EventDataType } from "@/app/components/types/allevents";
import EventStatusData from "@/public/data/eventType.json";
import userOne from "/public/userOne.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RecentSearches from "@/app/components/Search/RecentSearches";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import Loading from "@/app/components/UI/Loading";
import { Button } from "@/components/ui/button";
import Template from "/public/template.svg";
import Vector1 from "/public/vectorTemplate.svg";
import EventKeyword from "@/app/components/dropdown/EventKeyword";
// import { MapStyle } from "@/components/Map";
// const Calendar = lazy(() => import("@/components/Calendar"));
// const Map = lazy(() => import("@/components/Map"));

//JSON Data files:
import { useDefaultFilters } from '@/hooks/useDefaultFilters';
import { useTheme } from "@/context";
import { GAEvent } from "@/utils/GAEvent";
import SearchBar from "../../searchBar/SearchBar";
import CsvUploader from "./csvUploader";
import FrequencySelector from "@/components/search/advancedFilters/frequency";
import ForecastedStatusSelector from "@/components/search/advancedFilters/forecastedStatus";
import EventAnalyticsSelector from "@/components/search/advancedFilters/eventAnalytics";
import EventRankingSelector from "@/components/search/advancedFilters/eventRanking";
import AudienceZoneSelector from "@/components/search/advancedFilters/audienceZone";
import AudienceQualitySelector from "@/components/advancedFilters/audienceQualityScore";
import trackerEmptyTable from "/public/internal/trackerEmptyTable.svg";
import { suggestionGenerator } from "@/utils/openAI";
import { Tracker, Toggle } from '@/types/trackers'
import ExhibitorQualitySelector from "@/components/advancedFilters/exhibitorQualityScore";
import { useTrackerContext } from "@/context/tracker";
import LocationTemplate from '@/components/search/locationTemplate'
import { Designations } from "@/types/misc";
import { useFilterContext } from "@/context/filterContext";
import { categories, newCategories } from "@/data/categories";
import Presets from "./Presets";
import TeliTemplates from "./teliTemplates";
import { viewBound } from "@/types/events/dto/event-query.dto";
type EventGroupType = "social" | "business";
interface InputArea {
  type: string;
  placeholder: string;
}
export interface LocationItem {
  id: string;
  description: string | undefined;
}
interface Filters {
  shows: string;
  [key: string]: any;
}
export type Location = LocationItem[];
// interface Toggle{
//   rating?:boolean;
//   exhibit?:boolean;
//   trust?:boolean;
//   maturity?: boolean;
//   brandedEvent?: boolean;
//   eventSeries?: boolean;
//   forecastedStatus?: boolean;
//   impactScore?: boolean;
//   inboundScore?: boolean;
//   internationalScore?: boolean;
//   eventRank?: boolean;
//   audienceZone?: boolean;
//   audienceSpread?: boolean;
// }
interface Template {
  name: string;
  type?: string;
  templateName?: string;
  description?: string | undefined;
  inputAreas?: InputArea[] | undefined;
  isUploadEnable?: boolean;
}
interface CategoryData {
  attendedCategories?: string[];
  nonAttendedCategories?: string[];
  unscheduledCategories?: string[];
}
// interface Tracker {
//   name: string;
//   accessLevel?:string;
//   filterValue: FilterValue;
// }
interface Cat {
  name: string;
  id: string;
}
interface EditData {
  tracker: Tracker;
}
interface PresetJsonData {
  id: number;
  img?: any;
  url: string;
  trackerName: string;
  content: string;
  data: any;
  enabled: boolean;
  presetType: string;
  eventCount?: string;
}
const top10Data = [['BMC Training'], ['Lorman Education Services'], ['http://www.iu.edu/']];
const top10Speakers = [
  ["abc.com", "xyz.com"],
  ["Mark Zuckerberg", "Facebook"],
]
const keyData1 = [
  ['Mental health', 'Psychologist', 'Therapist', 'wellness coaches'],
  [],
];
const staticPresetData = [
  // {
  //   id: 1,
  //   img: Competitor,
  //   url: "T_COMPETITOR",
  //   trackerName: "Top 100 Companies",
  //   content: "This list highlights 100 global events organizers connecting industries, fostering business growth, and innovation.",
  //   data: top10Data,
  //   enabled: false,
  //   presetType: 'ALL',
  // },
  // {
  //   id: 2,
  //   img: Keywords,
  //   url:"T_COMPETITOR",
  //   trackerName: "Top 25 Trending",
  //   content: "This list highlights 25 influential organizers worldwide, gaining traction with new, high-impact events.",
  //   data: top10Data,
  //   enabled: false,
  //   presetType: 'All',
  // },
  // {
  //   id: 3,
  //   img: Competitor,
  //   url: "T_COMPETITOR",
  //   trackerName: "India Top 30",
  //   content: "Discover leading companies in India hosting business expos, conferences, and events.",
  //   data: top10Data,
  //   enabled: false,
  //   presetType: 'All',
  // },
  // {
  //   id: 4,
  //   img: Competitor,
  //   url: "T_COMPETITOR",
  //   trackerName: "Education & Training companies in India",
  //   content: "Discover leading Education & Training companies in India hosting business expos, conferences, and events.",
  //   data: top10Data,
  //   enabled: false,
  //   presetType: 'All',
  // },
  {
    id: 112,
    img: Speaking,
    url: "T_SPEAKING_OPPORTUNITY",
    trackerName: "Artificial Intelligence Speakers",
    content: "This list of Artificial Intelligence speakers, pioneering innovation and attracting attention with compelling talks.",
    data: top10Speakers,
    enabled: false,
    presetType: 'All',
  },
  {
    id: 113,
    img: Speaking,
    url: "T_SPEAKING_OPPORTUNITY",
    trackerName: "Biotechnology Innovations Speakers",
    content: "This list of Biotechnology Innovations speakers, pioneering innovation and attracting attention with compelling talks.",
    data: top10Speakers,
    enabled: false,
    presetType: 'All',
  },
  // {
  //   id: 7,
  //   img: Keywords,
  //   url: "T_PRODUCT_KEYWORDS",
  //   trackerName: "Mindful Matters",
  //   content: "Focuses on mental health awareness and practices.",
  //   data: keyData1,
  //   enabled: true,
  //   presetType: 'All',
  // }
];

const templates = [
  {
    name: "T_RECRUITMENT",
    templateName: "Recruitment",
    type: "disabled",
    description: "Input designations and upload job descriptions to identify relevant events effortlessly",
    inputAreas: [
      {
        type: "text",
        placeholder: "Designation",
      },
      {
        type: "text",
        placeholder: "Department"
      }
    ],
    isUploadEnable: false,
  },
  {
    name: "T_COMPETITOR",
    templateName: "Competitor",
    type: "enabled",
    description: "Track your competitor experts, influencers and where they might be participating in events",
    inputAreas: [
      {
        img: Url,
        type: "text",
        placeholder: "Competitor Name or Website",
        required: true,
        example: "facebook.com",
      }
    ],
    isUploadEnable: true,
  },
  {
    name: "T_AUDIENCE_DEPT_PROFILE",
    type: "disabled",
    templateName: "Audience Dept. & Profiles",
    description: "Track events for the specific organizational departments or audience profiles",
    inputAreas: [
      {
        type: "text",
        placeholder: "Department",
      },
      // {
      //   type: "text",
      //   placeholder: "Profile",
      // }
    ],
    isUploadEnable: false,
  },
  {
    name: "T_CUSTOMER_ICP",
    templateName: "Customer ICP",
    type: "enabled",
    description: "Input ideal customer profile details like company, location or websites to track their interests",
    inputAreas: [
      {
        img: Url,
        type: "text",
        placeholder: "Company Name or Website",
        required: true,
        example: "facebook.com",
      },
      // {
      //   img: Url,
      //   type: "text",
      //   placeholder: "Url",
      // },
      // {
      //   type: "text",
      //   placeholder: "Location",
      // }
    ],
    isUploadEnable: true,
  },
  {
    name: "T_BRAND_BUILDING",
    templateName: "Brand Building",
    type: "disabled",
    description: "Input designations and upload job descriptions to identify relevant events effortles",
    inputAreas: [
      {
        type: "text",
        placeholder: "Designation",
      },
      // {
      //   type: "text",
      //   placeholder: "Job Description",
      // }
    ],
    isUploadEnable: false,
  },
  {
    name: "T_PEOPLE_FINDER",
    templateName: "People Finder",
    type: "enabled",
    description: "Track experts, influencers and where they might be participating in various events",
    inputAreas: [
      {
        img: Name,
        type: "text",
        placeholder: "Name",
        required: true,
        example: "Mark Zuckerberg",
      },
      {
        img: Company,
        type: "text",
        placeholder: "Company Name",
        required: true,
        example: "Facebook",
      }
    ],
    isUploadEnable: true,
  },
  {
    name: "T_SPEAKING_OPPORTUNITY",
    templateName: "Speaking Opportunity",
    type: "enabled",
    description: "Input team members and their details to keep track of the events with speaking opportunities",
    inputAreas: [
      {
        img: Name,
        type: "text",
        apiValue: "userName",
        placeholder: "Speaker's Name",
        required: true,
        example: "Mark Zuckerberg",
      },
      {
        img: Company,
        type: "text",
        apiValue: "userOrgWebsite",
        placeholder: "Company Name",
        required: true,
        example: "Facebook",
      }
    ],
    isUploadEnable: true,
  },
  {
    name: "T_SOCIAL_CAUSE",
    templateName: "Social Cause",
    type: "disabled",
    description: "Track social cause events that interests audience to be socially active and enhance their reach",
    // inputAreas: [
    //   {
    //     type: "text",
    //     placeholder: "Type of event",
    //   }
    // ]
  },
  {
    name: "T_PRODUCT_KEYWORDS",
    templateName: "Product and Topics",
    description: "List all the events which belongs to given industry or associated with keywords",
    // inputAreas: [
    //   {
    //     type: "text",
    //     placeholder: "Keywords",
    //   }
    // ]
    isUploadEnable: true,
  },
  {
    name: "T_VENUE",
    templateName: "Venue",
  },
  {
    name: "T_LOCATION",
    templateName: "Location",
  },
  {
    name: "T_GEOTIME",
    templateName: "Geo-Time"
  }
]

const Pages = () => {
  const { searchParams: search } = useDefaultFilters();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { data: editData, setEditTrue, setData: setEditData, setIsNewCall } = useTrackerContext();
  const { getLocalFilterValue, setLocalFilter, setMultipleLocalFilters } = useFilterContext();
  const { enabledFilters } = useFilterContext();
  const [presetTemplateData, setPresetTemplateData] = useState<PresetJsonData[]>([])
  const { getTrackerDetail, createTracker, editTracker, error, delTracker } = useTrackerServices();
  const { theme } = useTheme();
  const type = searchParams.get('type');
  const defaultType = "T_CUSTOM";
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [opend, setOpend] = useState(false);
  const pathName = usePathname().split("/");
  const last = pathName[pathName.length - 1];
  const router = useRouter()
  const [hideSuggestion, setHideSuggestion] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    enabledFilters?.eventCategory?.enabledValue?.map((item) => item.slug) || []
  );
  const [eventSearchLoader, setEventSearchLoader] = useState(false);
  const [customData, setCustomData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("include");
  const [selectedAdvancedView, setSelectedAdvancedView] = useState("advancedDetails");
  const handleTabChange = (value: string) => {
    setSelectedAdvancedView(value);
  };
  const [trackerName, setTrackerName] = useState("");
  const [selectedPresetName, setSelectedPresetName] = useState<string>('');
  useEffect(() => {
    if (last === "editTracker") {
      const secondLast = pathName[pathName.length - 2];
      // fetchData(secondLast);
    }
  }, [last]);
  const [websites, setWebsites] = useState("");
  const [org, setOrg] = useState("");
  const [speakerName, setSpeakerName] = useState("");
  const [speakerCompany, setSpeakerCompany] = useState("");

  const [userName, setUserName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);
  const [designations, setDesignations] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);
  useEffect(() => {
    if (type === "T_COMPETITOR" || type === "T_CUSTOMER_ICP") {
      if (customData.length > 0 && Object.values(customData[0])[0]) {
        // let placeholder = template?.inputAreas?.[0]?.placeholder || "";
        const value = Object?.values(customData[0])[0];

        if (typeof value === "string") {
          const isDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
          const isURL = /^(https?:\/\/)/.test(value);

          const promptText = `List only top 5 official working domains of companies similar to ${value}. ${isDomain || isURL
              ? `Do not include ${value.replace(/https?:\/\//, "")} in the response.`
              : `Also share the official working domain of ${value}.`
            } Response should be in plain JSON format without any additional formatting or text: {"data": [ ${isDomain || isURL
              ? `"competitor domain 1", "competitor domain 2", "competitor domain 3", "competitor domain 4", "competitor domain 5"`
              : `"company domain", "competitor domain 1", "competitor domain 2", "competitor domain 3", "competitor domain 4", "competitor domain 5"`
            } ]}. Do not show example values and don't include ${isDomain || isURL
              ? `{"competitor domain 1", "competitor domain 2", "competitor domain 3", "competitor domain 4", "competitor domain 5"}` : `{"company domain", "competitor domain 1", "competitor domain 2", "competitor domain 3", "competitor domain 4", "competitor domain 5"}`} in response. If no company name or competitor domains are found, return in this format: {"data": []}`;

          if (!hideSuggestion) {
            fetchAISuggestion(promptText);
          }
        }
      }
      const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      const urls = customData
        .map((item: {}) => Object.values(item)[0] as string)
        .filter(value => regex.test(value))
        .join(',');

      const orgNames = customData
        .map((item: {}) => Object.values(item)[0] as string)
        .filter(value => !regex.test(value))
        .map(value => value.replace(/,/g, ''))
        .join(',');

      setWebsites(urls);
      setOrg(orgNames);
    }
    else if (type === "T_SPEAKING_OPPORTUNITY") {
      if (customData.length > 0 && Object.values(customData[0])[0] && Object.values(customData[0])[1]) {
        const promptText = `List the top 5 speakers with similar experience to ${Object.values(customData[0])[0]} (${Object.values(customData[0])[1]}). Not necessarily they have the same designation; instead, they must have spoken recently on the same topics. Response should be in plain JSON format without any additional formatting or text, avoid dummy data in any case: {
          "data": [
              [ "Speaker Name 1", "Company Name 1" ],
              [ "Speaker Name 2", "Company Name 2" ],
              [ "Speaker Name 3", "Company Name 3" ],
              [ "Speaker Name 4", "Company Name 4" ],
              [ "Speaker Name 5", "Company Name 5" ]
          ]
      }.  Do not show example values and don't include [
        [ "Speaker Name 1", "Company Name 1" ],
        [ "Speaker Name 2", "Company Name 2" ],
        [ "Speaker Name 3", "Company Name 3" ],
        [ "Speaker Name 4", "Company Name 4" ],
        [ "Speaker Name 5", "Company Name 5" ]
      ] in response. If no data is found, respond in this format: {\"data\": []}`;
        if (!hideSuggestion)
          fetchAISuggestion(promptText);
      }
      const speakerName = customData.map((item: {}) => Object.values(item)[0]).join(',');
      const speakerCompany = customData
        .map((item: {}) => Object.values(item)[1] as string | undefined)
        .filter((value): value is string => value !== undefined)
        .map(value => value.replace(/,/g, ''))
        .join(',');
      setSpeakerName(speakerName);
      setSpeakerCompany(speakerCompany);
      // console.log(speakerName, speakerCompany);

    }
    else if (type === "T_PEOPLE_FINDER") {
      if (customData.length > 0 && Object.values(customData[0])[0] && Object.values(customData[0])[1]) {
        const promptText = `List the top 5 people similar to ${Object.values(customData[0])[0]}(${Object.values(customData[0])[1]}). Response should be in plain JSON format without any additional formatting or text, avoid dummy data in any case: {
        "data": [
          [ "name 1", "company name 1" ],
          ["name 2", "company name 2" ],
          ["name 3", "company name 3" ],
          [ "name 4", "company name 4" ],
          [ "name 5", "company name 5" ]
        ]
      }. Do not show example values and don't include [
        [ "name 1", "company name 1" ],
        ["name 2", "company name 2" ],
        ["name 3", "company name 3" ],
        [ "name 4", "company name 4" ],
        [ "name 5", "company name 5" ]
      ] in response. If no data found then return in below format: {\"data\": []}`
        if (!hideSuggestion)
          fetchAISuggestion(promptText);
      }
      const userName = customData.map((item: {}) => Object.values(item)[0]).join(',');
      const userCompany = customData
        .map((item: {}) => Object.values(item)[1])
        .filter((value): value is string => value !== undefined && value !== null)
        .map(value => value.replace(/,/g, ''))
        .join(',');
      setUserName(userName)
      setUserCompany(userCompany)
      if (userName.length > 0 && userCompany.length > 0) {
        const promptText = `List the top 5 people similar to ${Object.values(customData[0])[0]}(${Object.values(customData[0])[1]}). Response should be in plain JSON format without any additional formatting or text, avoid dummy data in any case: {
        "data": [
          [ "name 1", "company name 1" ],
          ["name 2", "company name 2" ],
          ["name 3", "company name 3" ],
          [ "name 4", "company name 4" ],
          [ "name 5", "company name 5" ]
        ]
      }. Do not show example values and don't include [
        [ "name 1", "company name 1" ],
        ["name 2", "company name 2" ],
        ["name 3", "company name 3" ],
        [ "name 4", "company name 4" ],
        [ "name 5", "company name 5" ]
      ] in response. If no data found then return in below format: {\"data\": []}`
        if (!hideSuggestion)
          fetchAISuggestion(promptText);
      }
    } else if (type === "T_BRAND_BUILDING") {
      const designation = customData.map((item: {}) => Object.values(item)[0]).join(',');
      setDesignations(designation);
    }
    else if (type === "T_PRODUCT_KEYWORDS") {
      if (activeTab === "include") {
        const includeKeywords = customData.map((item: {}) => Object.values(item)[0]).join(',');
        setLocalFilter("includeKeywords", includeKeywords)
      } else {
        const excludeKeywords = customData.map((item: {}) => Object.values(item)[0]).join(',');
        setLocalFilter("excludeKeywords", excludeKeywords)
      }
    }
  }, [type, customData])
  const fetchAISuggestion = async (promptText: string) => {
    // console.log(val);
    try {
      let aiResponse: any = await suggestionGenerator(promptText);

      let temp = JSON.parse(aiResponse.choices[0].message.content);
      if (temp && temp?.data && Array.isArray(temp.data) && temp?.data?.length > 0) {
        setSuggestions(temp.data)
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setSuggestions([]);
    }
  }
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  function transformedData(data: Record<string, any[]>, val: string[]) {
    if (!val.length || !data[val[0]]) return []; // Handle empty cases

    const result = data[val[0]].map((_, index) =>
      val.map(key => data[key]?.[index]) // Optional chaining for safety
    );

    return result;
  }
  const handlePresetClick = (presetItem: PresetData, id: number, trackerType: string, trackerName: string) => {
    let finalResult;
    setHideSuggestion(false);
    // const filteredPresetData = presetTemplateData.filter(item => item.id === id);   

    // presetItem[]
    if (trackerType === 'T_COMPETITOR' || trackerType === 'T_SPEAKING_OPPORTUNITY' || trackerType === "T_BRAND_BUILDING") {
      if (trackerType === 'T_COMPETITOR') {
        finalResult = transformedData(presetItem.data, ["organizations"])
      }
      if (trackerType === 'T_SPEAKING_OPPORTUNITY') {
        finalResult = transformedData(presetItem.data, ["userName", "userOrgWebsite"])
      }
      const presetData: any = [];
      finalResult?.map((item: any) => {
        const temp: any = {};
        template?.inputAreas?.map((field: InputArea, index: number) => (
          temp[field.placeholder] = item[index]
        ))
        console.log(temp);

        presetData.push(temp);
      })
      setCustomData(presetData);
      setTrackerName(trackerName);
    } else if (trackerType === 'T_PRODUCT_KEYWORDS') {
      setTrackerName(trackerName);
      setLocalFilter("includeKeywords", presetItem?.data?.includeKeywords?.join(","));
      setLocalFilter("excludeKeywords", presetItem?.data?.excludeKeywords?.join(","))
    }

    setSelectedPresetName(trackerName);
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const filterValueMapping = {
    eventTypes: "eventTypes",
    categories: "categories",
    eventFormats: "eventFormats",
    locationIds: "locationIds",
    active_gte: "active_gte",
    active_lte: "active_lte",
    status: "status",
    entryType: "entryType",
    ratings: "ratings",
    maturity: "maturity",
    onlyBranded: "onlyBranded",
    onlySeries: "onlySeries",
    frequencies: "frequencies",
    includeKeywords: "includeKeywords",
    excludeKeywords: "excludeKeywords",
    estimatedVisitorRangeTag: "estimatedVisitorRangeTag",
    estimatedExhibitors: "estimatedExhibitors",
    impact_score_gte: "impact_score_gte",
    impact_score_lte: "impact_score_lte",
    inbound_score_gte: "inbound_score_gte",
    inbound_score_lte: "inbound_score_lte",
    international_score_gte: "international_score_gte",
    international_score_lte: "international_score_lte",
    top: "top",
    viewBound: "viewBound",
    designations: "designations",
    audienceSpread: "audienceSpread",
  }
  const showsData: string[] = [];
  const mapping = {
    rating: "rating",
    maturity: "maturity",
    branded: "branded,series",
    forecasted: "forecasted",
    frequency: "frequency",
    estimatedExhibitors: "estimatedExhibitors",
    scores: "scores",
    audienceZone: "audienceZone",
    rankings: "rankings"
  };
  const isViewBoundEmpty = (value: string | null) => {
    if (!value) return true;
    try {
      const parsed = JSON.parse(value);
      return Object.keys(parsed).length === 0;
    } catch {
      return true;
    }
  };
  const saveTrackerHandler = async () => {
    // console.log(new Date(selectedDateRange[0]).toISOString().split('T')[0]);
    setEditTrue(true);
    if (type === "T_COMPETITOR" && (websites.length === 0 || org.length === 0)) {
      setIsMandatory(true);
    }
    GAEvent(
      "trackers",
      "Tracker",
      "Create Tracker",
      "Save"
    );
    if (isCreating) return;
    setIsCreating(true);
    const filters = getLocalFilterValue("show").split(",");
    Object.entries(mapping).forEach(([key, value]) => {
      if (filters.includes(key)) {
        showsData.push(value);
      }
    });
    const filterValues = Object.entries(filterValueMapping as Record<keyof Filters, string>).reduce(
      (acc, [key, mappedKey]) => {
        const value = getLocalFilterValue(key as any);


        if (Array.isArray(value) && value.length > 0) {
          acc[mappedKey] = value;
        } else if (typeof value === "string" && value === "true") {
          acc[mappedKey] = value;
        } else if (value) {
          acc[mappedKey] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );
    if (websites.length > 0) {
      filterValues.orgWebsite = websites;
    }
    if (org.length > 0) {
      filterValues.orgName = org;
    }
    if (showsData.length > 0) {
      filterValues.show = showsData.join(",");
    }
    if (speakerName.length > 0) {
      filterValues.userName = speakerName;
    }
    if (speakerCompany.length > 0) {
      filterValues.userOrgWebsite = speakerCompany;
    }
    if (userName.length > 0) {
      filterValues.userName = userName;
    }
    if (userCompany.length > 0) {
      filterValues.userOrgWebsite = userCompany;
    }
    console.log(filterValues, showsData);
    const formData = {
      name: trackerName,
      ...(type && type.length > 0 && {
        type: type.toUpperCase()
      }),
      accessLevel: editData?.tracker?.accessLevel,
      filterValues
    };
    console.log(formData, defaultType);


    const secondLast = pathName[pathName.length - 2];
    if (type === "T_PRODUCT_KEYWORDS" && (trackerName.trim().length === 0 || (getLocalFilterValue("includeKeywords").length === 0 && getLocalFilterValue("excludeKeywords").length === 0))) {
      setIsCreating(false);
      setIsMandatory(true);
      return;
    }
    else if ((type === "T_LOCATION" || type === "T_VENUE") && (trackerName.trim().length === 0 || (getLocalFilterValue("locationIds").length === 0 && !getLocalFilterValue("viewBound")))) {
      setIsCreating(false);
      setIsMandatory(true);
      if (trackerName.trim().length !== 0)
        toast({
          title: "Error",
          description: "Location must be selected.",
          variant: "destructive",
        });
      return;
    }
    else if (
      type === "T_GEOTIME" &&
      (
        trackerName.trim().length === 0 ||
        (
          getLocalFilterValue("locationIds").length === 0 &&
          !getLocalFilterValue("viewBound")
        ) ||
        (getLocalFilterValue("active_gte").length === 0 &&
          getLocalFilterValue("active_lte").length === 0)
      )
    ) {
      setIsCreating(false);
      setIsMandatory(true);
      if (trackerName.trim().length !== 0)
        toast({
          title: "Error",
          description: "Location and Date must be selected.",
          variant: "destructive",
        });
      return;
    }


    else if (
      type !== defaultType &&
      type !== "T_PRODUCT_KEYWORDS" &&
      type !== "T_LOCATION" && type !== "T_VENUE" && type !== "T_GEOTIME" &&
      (trackerName.trim().length === 0 || customData.length === 0)
    ) {
      console.log("Please, Fill all the details");
      setIsCreating(false);
      setIsMandatory(true);
      return;
    }
    else if (
      type === defaultType &&
      (
        (getLocalFilterValue("locationIds")?.length===0 &&
          isViewBoundEmpty(getLocalFilterValue("viewBound")))
        ||
        trackerName.trim().length === 0
      )
    ) {
      console.log("Please, Fill all the details");
      setIsCreating(false);
      setIsMandatory(true);
      return;
    }
    if (last === "editTracker") {
      try {
        const data = await editTracker(secondLast, formData) as { error?: ApiError };
        if (data) {
          if (data?.error) {
            // toast.error((data.error as ApiError).message, {
            //   position: "bottom-right",
            //   autoClose: 2000,
            //   hideProgressBar: true,
            // });
            toast({
              title: "Error",
              description: error?.message,
              variant: "destructive",
            });
            setIsCreating(false);
            return;
          } else {
            router.replace(`/internal/trackers/${secondLast}/trackedEvents?type=${type}&eventType=${isEventeli ? "social" : "active"}&view=table`);

            // setIsNewCall(true);
          }
        } else {
          // console.log(error);
          setIsCreating(false);
        }
      } catch (error) {
        // console.log(error);
        setIsCreating(false);
      }
    } else {
      // console.log(formData);

      if (type === "T_PRODUCT_KEYWORDS" && (trackerName.trim().length === 0 || (getLocalFilterValue("includeKeywords").length === 0 && getLocalFilterValue("excludeKeywords").length === 0))) {
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      else if ((type === "T_LOCATION" || type === "T_VENUE") && (trackerName.trim().length === 0 || (getLocalFilterValue("locationIds").length === 0 && !getLocalFilterValue("viewBound")))) {
        setIsCreating(false);
        setIsMandatory(true);
        toast({
          title: "Error",
          description: "Location must be selected.",
          variant: "destructive",
        });
        return;
      }
      else if (
        type === "T_GEOTIME" &&
        (
          trackerName.trim().length === 0 ||
          (
            getLocalFilterValue("locationIds").length === 0 &&
            !getLocalFilterValue("viewBound")
          ) ||
          (getLocalFilterValue("active_gte").length === 0 &&
            getLocalFilterValue("active_lte").length === 0)
        )
      ) {
        setIsCreating(false);
        setIsMandatory(true);
        toast({
          title: "Error",
          description: "Location and Date must be selected.",
          variant: "destructive",
        });
        return;
      }
      else if (
        type !== defaultType &&
        type !== "T_PRODUCT_KEYWORDS" &&
        type !== "T_LOCATION" && type !== "T_VENUE" && type !== "T_GEOTIME" &&
        (trackerName.trim().length === 0 || customData.length === 0)
      ) {
        console.log("Please, Fill all the details");
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      else if (
        type === defaultType &&
        (
          (getLocalFilterValue("locationIds")?.length===0 &&
            isViewBoundEmpty(getLocalFilterValue("viewBound")))
          ||
          trackerName.trim().length === 0
        )
      ) {
        console.log("Please, Fill all the details");
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      
      try{
        const data= await createTracker(formData)
        if (error) {
          // console.log(error);
          setIsCreating(false);
          return;
        }
        if (data) {
          router.replace("/internal/trackers");
        }
      } catch (error) {
        // console.log(error);
        toast({
          title: "Error",
          description: (error as ApiError).message,
          variant: "destructive",
        });
        // toast.error((error as ApiError).message, {
        //   position: "bottom-right",
        //   autoClose: 2000,
        //   // closeButton: false,
        //   hideProgressBar: true,
        // });
        setIsCreating(false);
        return;
      }


    }
  };

  useEffect(() => {
    if (editData && last === "editTracker") {
      console.log(editData);

      setTrackerName(editData?.name || "");
      if (type === "T_COMPETITOR" || type == "T_CUSTOMER_ICP") {
        const orgNames = editData?.filterValues?.orgName?.
          split(',');
        const orgWebsites = editData?.filterValues?.orgWebsite?.
          split(',');
        if (Array.isArray(orgNames)) {
          setCustomData((prevData: any) => [
            ...prevData,
            ...orgNames?.map((item) => (
              { "Competitor Name or Website": item.trim() }
            ))
          ]);
        }
        if (Array.isArray(orgWebsites)) {
          setCustomData((prevData: any) => [
            ...prevData,
            ...orgWebsites?.map((item) => (
              { "Competitor Name or Website": item.trim() }
            ))
          ]);
        }
      }
      if (type === "T_SPEAKING_OPPORTUNITY") {
        const speakerOrgs = editData?.filterValues?.userOrgWebsite?.
          split(',');
        const speakerNames = editData?.filterValues?.userName?.
          split(',');
        const presentCustomData = (speakerNames ?? []).map((speakerName: string, index: number) => ({
          "Speaker's Name": speakerName.trim(),
          "Company Name": speakerOrgs?.[index]?.trim()
        }));
        setCustomData(presentCustomData);
      }
      if (type === "T_PEOPLE_FINDER") {
        const speakerOrgs = editData?.filterValues?.userOrgWebsite?.
          split(',');
        const speakerNames = editData?.filterValues?.userName?.
          split(',');
        const presentCustomData = speakerNames.map((speakerName: string, index: number) => ({
          "Name": speakerName.trim(),
          "Company Name": speakerOrgs[index]?.trim()
        }));
        setCustomData(presentCustomData);
      }
      let toggleOpend: Toggle = {};
      Object.entries(filterValueMapping).reduce((acc, [key, mappedKey]) => {
        const value = editData.filterValues[key];
        console.log(typeof value, value);
        if (Array.isArray(value)) {
          if (key === "includeKeywords" || key === "excludeKeywords") {
            const updatedValue = value.map((item) => item.replaceAll("_", " "));
            console.log(updatedValue);
            setLocalFilter(key as any, updatedValue.join(","));
          } else
            setLocalFilter(key as any, value.map(v => String(v).toLowerCase()).join(','));
        }
        else if (value !== null && typeof value === "object") {
          console.log("Object detected:", value);
          setLocalFilter(key as any, JSON.stringify(value));
        } else if (typeof value === "string") {
          setLocalFilter(key as any, value);
        } else if (typeof value === "number" || typeof value === "boolean") {
          setLocalFilter(key as any, value.toString());
        }

        return acc;
      }, {});
      Object?.entries(mapping)?.forEach(([key, value]) => {
        if (editData?.filterValues?.show?.includes(key)) {
          showsData.push(value);
        }
        // console.log(editData?.filterValues?.shows);

      });
      const eventTypes = Object.values(editData?.filterValues?.eventTypes || {}).map((eventType) => {
        return (eventType as { slug: string })?.slug;
      });
      console.log(eventTypes);

      setLocalFilter("eventTypes", eventTypes.join(","))
      if (editData?.filterValues?.designations && typeof editData.filterValues.designations === 'object') {
        const slugs = Object.values(editData.filterValues.designations as Record<string, { name: string; slug: string }>)
          .map((item) => item.slug)
          .filter(Boolean);

        setLocalFilter("designations", slugs.join(","));
      }

      if (editData?.filterValues?.locationIds) {
        const ids = Object?.keys(editData?.filterValues?.locationIds);
        setLocalFilter("locationIds", ids.join(","))
        // console.log(ids);
      }
      if (editData?.filterValues?.categories) {
        const categories = Object.values(editData?.filterValues?.categories || {}).map((category: any) => {
          return category.slug;
        }) || []
        setLocalFilter("categories", categories.join(","))
      }
      setLocalFilter("show", showsData.join(","))

      console.log(editData);


      if (typeof editData?.tracker?.filterValue?.userType === 'string') {
        toggleOpend = JSON.parse(editData.tracker.filterValue.userType) as Toggle;
      }
    }

  }, [editData, searchParams]);

  // console.log(selectedLabels);
  const [popoverState, setPopoverState] = useState<boolean>(false);
  const setMenuOpen = () => {
    setPopoverState(!popoverState);
  };

  useEffect(() => {
    const modalStatus = document.body.getAttribute("popover-status");

    if (modalStatus && modalStatus == "close") {
      document.body.setAttribute("popover-status", "open");
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    } else {
      document.body.setAttribute("popover-status", "close");
    }
    return () => {
      document.body.removeAttribute("your-attribute");
    };
  }, [popoverState]);
  // console.log(selectedEventRank);
  // console.log(type);
  const [companyUrl, setCompanyUrl] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addNew();
    }
  }
  // console.log(customData);
  const [isLoading, setIsLoading] = useState(true);
  const [template, setTemplate] = useState<Template | null | undefined>(null);
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
  useEffect(() => {
    const foundTemplate = templates.find(t => t.name === type);
    setTemplate(foundTemplate);
  }, [type])
  useEffect(() => {
    setIsLoading(false);
  }, [template])
  const handleInput = (index: number, value: string) => {
    // console.log(value);
    setInputValues(prevValues => ({
      ...prevValues,
      [index]: value
    }));
  };
  const [valid, setValid] = useState(true);
  const addNew = () => {
    setHideSuggestion(false);
    if (!template) {
      console.error('Template is not found');
      return;
    }
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    let isValid = true;
    let isPresent = false;
    if (template.type === "enabled") {
      if (template && template.inputAreas && template.inputAreas.length === Object.keys(inputValues).length) {
        const newEntry = template.inputAreas.reduce<{ [key: string]: string }>((acc, inputArea, index) => {
          const value = inputValues[index];
          if (inputArea.placeholder === 'Add Competitor Name or Website') {
            //if (regex.test(value.trim())) {
            acc[inputArea.placeholder] = value;
            isPresent = customData.some((item) => {
              return Object.values(item).includes(value.trim());
            });
            // } 
            // else {
            //   isValid = false;
            // }
          } else {
            if (value !== null && value.trim() !== '') {
              acc[inputArea.placeholder] = value;
            } else {
              isValid = false;
              setValid(false);
            }
          }
          return acc;
        }, {});

        if (isValid && template?.type === "enabled" && !isPresent) {
          setCustomData((prevData: any) => [
            newEntry,
            ...prevData,
          ]);
          setInputValues({});
        } else {
          setValid(false);
          setInputValues({});
          console.error('Invalid input or URL');
        }

      } else setValid(false);
    }
  }
  // console.log(valid);
  const truncate = (val: string) => {
    if (val.length > 24) return val.substring(0, 25) + "...";
    else return val;
  }
  const deleteEntry = (entryKey: string, itemIndex: number) => {
    // console.log(itemIndex);
    const filteredData = customData.filter((item, index) => index !== itemIndex);
    setCustomData(filteredData);
  };
  useEffect(() => {
    if (valid === false) setValid(true);
    if (isMandatory) setIsMandatory(false);
  }, [inputValues])
  const [selected, setSelected] = useState(false);
  const addCompany = (id: number, val: any) => {
    setSelected(true);
    if (!Array.isArray(val)) {
      setInputValues(prevValues => ({
        ...prevValues,
        [0]: val
      }));
    } else {
      setInputValues(val);
    }
  }
  useEffect(() => {
    if (selected) {
      addNew();
      setSelected(false);
    }
  }, [selected])
  const [isDiv, setIsDiv] = useState(false);
  useEffect(() => {
    if (type === "T_PRODUCT_KEYWORDS") setIsDiv(true);
  }, [type])

  const handleCustomData = (data: any) => {
    setHideSuggestion(true);
    setCustomData(data);
  }

  const [uploadEnabled, setUploadEnabled] = useState<boolean>(false);

  const handleUploadEnable = () => {
    setUploadEnabled(!uploadEnabled)
  }
  const commonCss = {
    input_container: `w-full border-[var(--input-border-color)] border rounded-[var(--border-radius-sm)] whitespace-nowrap p-2 px-4 text-inherit bg-inherit`,
    input: 'flex justify-between items-center'
  }
  const generateDynamicString = (item: any) => {
    if (Array.isArray(item)) {
      return `${item[0]} (${item[1]})`;
    } else return item;
  };
  const [includeKeyword, setIncludeKeyword] = useState<{ "Include Keywords": string }[]>([]);
  const [excludeKeyword, setExcludeKeyword] = useState<{ "Exclude Keywords": string }[]>([]);

  useEffect(() => {
    if (type === "T_PRODUCT_KEYWORDS") {
      const keywordData = getLocalFilterValue("excludeKeywords")?.toString()?.split(",")?.filter(keyword => keyword.trim() !== "");
      const updatedData = keywordData.map(item => ({ "Exclude Keywords": item.replace(/_/g, " ") }));
      setExcludeKeyword(updatedData);
    }
  }, [getLocalFilterValue("excludeKeywords")]);
  useEffect(() => {
    if (type === "T_PRODUCT_KEYWORDS") {
      const keywordData = getLocalFilterValue("includeKeywords")?.toString()?.split(",")?.filter(keyword => keyword.trim() !== "");
      const updatedData = keywordData.map(item => ({ "Include Keywords": item.replace(/_/g, " ") }));
      setIncludeKeyword(updatedData);
    }
  }, [getLocalFilterValue("includeKeywords")])
  const [del, setDel] = useState(false);
  const closeShareModal = () => {
    setDel(false);
    document.body.style.height = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
  };
  const deleteTracker = async () => {
    const result = await delTracker(`${pathName[pathName.length - 2]}`)
    if (result) {
      showToast("success", "Tracker deleted successfully")
      GAEvent(
        "trackers",
        "Tracker Detail",
        "Delete",
        "Delete"
      );
      router.replace(`/internal/trackers`);
    }
  }

  return (
    <>
      <div>{isLoading ? <Loading /> :
        <>
          <div
            className="flex fixed z-[5] w-[calc(100vw-134px)] mt-[36px] pt-4 bg-[var(--primary-foreground)]"
            style={{ marginTop: pathName[pathName.length - 1] === "create" ? "0px" : "36px", zIndex: '5' }}
          >
            <div className="flex first-line items-center justify-between w-[100%] bg-[var(--heading-background-color)] p-3">
              <div className="flex items-center gap-2">
                <div>
                  <Image src={userOne} alt="userOne" />
                </div>
                <div>
                  <div className="text-[var(--primary-color)] font-bold text-lg">{last === "editTracker" ? "Edit" : "Create"} {template && <span>{template.templateName}</span>} Tracker</div>
                  <div className="text-sm text-[var(--secondary-text-color)]">
                    Select from the available data filters to {last === "editTracker" ? "edit" : "create"} a tracker
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {/* <Link
        href={
          last === "create"
            ? "/internal/trackers?showTemplates=true"
            : `/internal/trackers/${pathName[pathName.length - 2]
            }/trackedConfiguration?type=${type}`
        }
        style={{ display: "flex" }}
      >
        <button className={styles.cancel}>Cancel</button>
        <Button variant="outline" className="text-[var(--primary-color)] hover:text-[var(--primary-color)] w-[100px]">Cancel</Button>
      </Link> */}
                {/* <button className={styles.save} onClick={saveTrackerHandler}>
        Save Tracker
      </button> */}
                {last === "create" ?
                  <Link
                    href={
                      last === "create"
                        ? "/internal/trackers?showTemplates=true"
                        : `/internal/trackers/${pathName[pathName.length - 2]
                        }/trackedConfiguration?type=${type}`
                    }
                    style={{ display: "flex" }}
                  >
                    <Button variant="outline" className="text-[var(--primary-color)] hover:text-[var(--primary-color)] w-[100px]">Cancel</Button>
                  </Link> :
                  <div className={styles.containerTopRightTwo} >
                    <Button variant="outline" className="text-[var(--primary-color)] hover:text-[var(--primary-color)] w-[100px]" onClick={() => setDel(true)}>Delete</Button>
                  </div>
                }
                <Button className="text-white w-[100px]" onClick={saveTrackerHandler}>Save</Button>
              </div>
            </div>
          </div>
          <div ref={scrollableDivRef} className="flex flex-col gap-2 w-[calc(100vw-134px)]" style={{ marginTop: pathName[pathName.length - 1] === "create" ? "104px" : "140px" }}>
            {/* <div className='fixed top-0 w-[calc(100vw-134px)] bg-[var(--primary-foreground)] h-[224px]' style={{ height: pathName[pathName.length - 1] === "create" ? "124px" : "224px", zIndex:"3"}}></div> */}
            <div
              className="px-6 py-1 w-full border border-[var(--input-border-color)] rounded-[var(--border-radius-sm)]"
              style={{
                border:
                  isMandatory && trackerName.trim().length === 0 ? "1px solid var(--danger-text-color)" : "",
              }}
            >
              <input
                className="bg-inherit text-inherit outline-none p-[10px] px-0 border-none w-full"
                type="text"
                placeholder="Enter Tracker Name"
                value={trackerName}
                onChange={(event) => setTrackerName(event.target.value)}
              />
            </div>
            <TeliTemplates type={type} isMandatory={isMandatory}/>
            {((template && template.inputAreas) || type === "T_PRODUCT_KEYWORDS") &&
              <div style={{ display: 'flex', gap: '25px' }}>
                <div className={`card ${styles.competitor}`}>
                  {/* <div className={styles.competitorHead}>
          <div className={styles.competitorHeading}>Upload custom data </div>
          {template?.type !== "enabled" && <div className={styles.badgeSuccess}>Comming Soon</div>}
        </div> */}
                  <div className={styles.bar}></div>
                  <div>
                    <div className="flex items-center text-[#0062D1] mb-4 font-[var(--font-weight-regular)] leading-[var(--line-height-small)]" style={{ fontSize: "var(--font-size-small)" }}>
                      <InformationFill style={{ marginBottom: "3px" }} color="var(--info-text-color)" height="12px" />
                      {" "} Please upload or manually enter the information
                    </div>
                    {type === "T_PRODUCT_KEYWORDS" &&
                      <ProductSelector type="T_PRODUCT_KEYWORDS" fetchAISuggestion={fetchAISuggestion} suggestions={suggestions} hideSuggestion={hideSuggestion} setHideSuggestion={setHideSuggestion} />
                    }
                    {((type === "T_COMPETITOR" || type === "T_SPEAKING_OPPORTUNITY" || type === "T_PEOPLE_FINDER" || type === "T_CUSTOMER_ICP" || type === "T_PRODUCT_KEYWORDS") && template) ?
                      (uploadEnabled &&
                        <CsvUploader
                          templateData={template}
                          customData={customData}
                          handleCustomData={handleCustomData}
                          setUploadEnabled={setUploadEnabled}
                        />) :
                      <></>
                    }
                  </div>
                  {(template?.inputAreas || type === "T_PRODUCT_KEYWORDS") &&
                    <div>
                      {type !== "T_PRODUCT_KEYWORDS" &&
                        <div className="flex items-stretch gap-2.5">
                          {template?.inputAreas?.map((inputArea: any, index: number) => (
                            <>
                              <div key={index} className="relative px-2.5 border flex w-full items-center gap-2.5 bg-[var(--primary-foreground)] border-[var(--border-color)] rounded-[var(--border-radius-sm)]" style={{ border: inputArea?.required === true && isMandatory === true && customData.length === 0 ? "1px solid var(--danger-text-color)" : "" }}>
                                {inputArea.img && <Image src={inputArea.img} alt="url_Icon" className="icons" width={10} />}
                                <input
                                  className={styles.textArea}
                                  type="text"
                                  placeholder={inputArea.placeholder}
                                  value={inputValues[index] || ''}
                                  onChange={(e) => handleInput(index, e.target.value)}
                                  onKeyPress={handleKeyDown}
                                />
                                {(eventSearchLoader && inputValues[0]?.length > 0) ? (
                                  <div className={styles.loader}></div>
                                ) : (
                                  inputValues[0]?.length > 0 ? (
                                    <Image src={CloseIcon} alt="close" className={iconClass} style={{ cursor: "pointer" }} onClick={() => {
                                      setInputValues(prevValues => ({
                                        ...prevValues,
                                        [index]: ""
                                      }))
                                    }} />
                                  ) : (
                                    ""
                                  )
                                )}
                                {/* {type === "T_COMPETITOR" && inputValues[0]?.length > 0 && websiteSuggestion &&
                            <div className={styles.suggestionBox}>
                              <Suggestion
                                websiteData={websiteSuggestion}
                                addCompany={addCompany}
                              />
                            </div>
                          } */}
                                {(type === "T_COMPETITOR" || type === "T_CUSTOMER_ICP" || type === "T_BRAND_BUILDING") && inputValues[0]?.length > 0 &&
                                  <SearchBar searchInput={inputValues[0]} setEventSearchLoader={setEventSearchLoader} handleSelect={addCompany} endpoint={type === "T_BRAND_BUILDING" ? 'suggestions/designations' : 'suggestions/companies'} type={type} />
                                }
                              </div>

                            </>
                          ))}
                          <div onClick={() => template?.type === "enabled" && addNew()} className="flex items-center px-3 cursor-pointer bg-[var(--primary-color)] rounded-[4px] text-white font-medium text-lg"
                            style={{ backgroundColor: template?.type !== "enabled" ? "var(--disabled-btn-color)" : "var(--primary-color)" }}
                          >+
                            {/* <Image src={Add} alt="add_Icon" className="w-[15px] h-[15px]" /> */}
                          </div>

                        </div>
                      }
                      {/* {customData.map((item:any, index:number) => (
    // <div key={index} className={styles.customDataOuterDiv}>
    // <div className={styles.singleInputBox}>{item.name}</div>
    // <div className={styles.singleInputBox}>{item.companyName}</div>
    // </div>
    {Object.entries(item).map(([key, value]) => (
      <div key={key} className="data-field">
        <strong>{key}:</strong> {value}
      </div>
    ))}
  ))} */}
                      {!valid && (
                        <div style={{ color: "var(--danger-text-color)", fontSize: "var(--font-size-small)", marginTop: "2px" }}>Enter valid input</div>
                      )}
                      {(suggestions && suggestions.length > 0 && type !== "T_PRODUCT_KEYWORDS") &&
                        <div className="p-4 bg-[var(--primary-foreground)] border border-border-color rounded-sm mt-3 w-full" >
                          <div className="text-sm font-[var(--font-weight-medium)] text-[var(--secondary-text-color)] flex gap-1.5 mb-3 items-center">
                            {/* <Image src={AiIcon} alt="AI" className={iconClass} width={14} height={14} /> */}
                            AI SUGGESTIONS {" "}
                            <span className={styles.experimental_tag} >Beta</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {suggestions.map((item: any, ind: number) => (
                              <div key={ind} className={styles.suggestion_badge} onClick={() => addCompany(0, item)} >{generateDynamicString(item)}</div>
                            ))}
                          </div>
                        </div>
                      }
                      {/* {customData && customData.length >0 &&
              <div className={styles.allCompetitors}>
                <div className={styles.remove_all_custom} onClick={() => setCustomData([])}>
                  Remove All
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                <table className={`border border-[var(--border-color)] border-collapse w-[calc(50%-45px)] ${styles.allCustomData}`}>
                  <tbody>
                    {expandTable ? customData.map((item: any, index: number) => (
                        <tr key={index}>
                          <td>
                            <div className="w-[15px] h-[15px] flex items-center justify-center text-[var(--primary-color)] border border-[var(--primary-color)] cursor-pointer" onClick={() => deleteEntry(item, index)}>-</div>
                          </td>
                          {Object.entries(item)
                            .map(([entryKey, value]) => 
                              <td key={entryKey} className={styles.dataColoumn}>{value as string}</td>
                            )
                          }
                        </tr>
                      )) :
                      customData.slice(0, 5).map((item: any, index: number) => (
                        <tr key={index}>
                          <td>
                            <div className="w-[15px] h-[15px] flex items-center justify-center text-[var(--primary-color)] border border-[var(--primary-color)] cursor-pointer" onClick={() => deleteEntry(item, index)}>-</div>
                          </td>
                          {Object.entries(item)
                            .map(([entryKey, value]) => 
                              <td key={entryKey} className={styles.dataColoumn}>{value as string}</td>
                            )
                          }
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                </div>
                {customData.length > 5 &&
                  <div className={styles.expandTableBtn} onClick={()=>setExpandTable(prev=>!prev)} >{expandTable ? 'Read Less' : 'Read More'}</div>
                }

              {/* {(type==="T_COMPETITOR" || type==="T_SPEAKING_OPPORTUNITY") && */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ position: 'relative', color: 'var(--secondary-text-color)' }}>
                          <div style={{ borderBottom: '1px solid var(--border-color)', margin: '36px 0' }}></div>
                          <span className="absolute text-[10px] -top-1.5 bg-[var(--background-secondary-color)] px-2 font-semibold">OR</span>
                        </div>
                        <div className="flex justify-center items-center h-[140px] border border-dashed rounded-[18px] bg-primary-foreground border-[var(--border-color)]">
                          <Button
                            className="text-white gap-1"
                            size="sm"
                            onClick={handleUploadEnable}
                            disabled={!template?.isUploadEnable}
                          >
                            <Share style={{ marginBottom: "3px", color: "white" }} height="15px" width="15px" />
                            {" "}Upload
                          </Button>
                        </div>
                      </div>
                      {/* } */}
                    </div>
                  }
                </div>
                <div className={`card ${styles.competitor}`} >
                  <div className="flex items-center text-[#0062D1] font-[var(--font-weight-regular)] mb-4 leading-[var(--line-height-small)]" style={{ fontSize: "var(--font-size-small)" }}>
                    <InformationFill style={{ marginBottom: "3px" }} color="var(--info-text-color)" height="12px" />
                    {" "} You can edit or remove unwanted entries from here.
                  </div>
                  {/* {type==="T_PRODUCT_KEYWORDS" && 
           <Tabs className="pb-2">
           <TabsList className="grid w-full grid-cols-2">
             <TabsTrigger value="include" onClick={()=>setActiveTab("include")}>
               Include
             </TabsTrigger>
             <TabsTrigger value="exclude" onClick={()=>setActiveTab("exclude")}>
               Exclude
             </TabsTrigger>
           </TabsList>
           </Tabs>
        } */}
                  {(type === "T_PRODUCT_KEYWORDS") &&
                    <Tabs defaultValue="include" onValueChange={(value) => setActiveTab(value as "include" | "exclude")} className="pb-2">
                      {(includeKeyword.length > 0 || excludeKeyword.length > 0) &&
                        <TabsList className="grid w-full grid-cols-2 mb-1">
                          <TabsTrigger value="include">
                            Include
                            {type === "T_PRODUCT_KEYWORDS" && includeKeyword.length > 0 && <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white ml-1">{includeKeyword.length}</span>}
                          </TabsTrigger>
                          <TabsTrigger value="exclude">
                            Exclude
                            {type === "T_PRODUCT_KEYWORDS" && excludeKeyword.length > 0 && <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white ml-1">{excludeKeyword.length}</span>}
                          </TabsTrigger>
                        </TabsList>
                      }
                      <TabsContent value="include" className="mt-0">
                        {includeKeyword.length > 0 ? (
                          <TemplateTable
                            customData={includeKeyword}
                            handleCustomData={handleCustomData}
                            presetName={selectedPresetName}
                          />
                        ) : (
                          <div className={`pt-12 ${styles.emptyTableData}`}>
                            <Image
                              src={trackerEmptyTable}
                              alt="table"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            />
                            <div className={styles.emptyTableText}>No data added</div>
                            <div className={styles.emptyTableText} style={{ maxWidth: '220px', padding: '0', fontWeight: 'unset' }}>Please upload or manually enter the information</div>
                          </div>
                        )}
                      </TabsContent>


                      <TabsContent value="exclude" className="mt-0">
                        {excludeKeyword.length > 0 ?
                          <TemplateTable
                            customData={excludeKeyword}
                            handleCustomData={handleCustomData}
                            presetName={selectedPresetName}
                          /> :
                          <div className={`pt-12 ${styles.emptyTableData}`}>
                            <Image
                              src={trackerEmptyTable}
                              alt="table"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            />
                            <div className={styles.emptyTableText}>No data added</div>
                            <div className={styles.emptyTableText} style={{ maxWidth: '220px', padding: '0', fontWeight: 'unset' }}>Please upload or manually enter the information</div>
                          </div>
                        }
                      </TabsContent>
                    </Tabs>
                  }
                  {type !== "T_PRODUCT_KEYWORDS" &&
                    (customData && customData.length > 0 ? (
                      <TemplateTable customData={customData} handleCustomData={handleCustomData} presetName={selectedPresetName} />
                    ) : (
                      <div className={styles.emptyTableData}>
                        <Image
                          src={trackerEmptyTable}
                          alt="table"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        />
                        <div className={styles.emptyTableText}>No data added</div>
                        <div className={styles.emptyTableText} style={{ maxWidth: '220px', padding: '0', fontWeight: 'unset' }}>
                          Please upload or manually enter the information
                        </div>
                      </div>
                    ))
                  }

                </div>
              </div>
            }
            {
              <div className={`${type !== defaultType ? `card ${styles.hiddenFiltersOuterContainer}` : ""}`} >
                {type !== "T_CUSTOM" &&
                  <div className={`${styles.hiddenFilters}`} onClick={() => setOpend(!opend)} style={{ cursor: "pointer" }}>
                    <div className={styles.hiddenFiltersInnerDiv}>
                      {/* <Plus style={{width:"16px", height:"16px"}} className="icons"/> */}
                      <div className={styles.hiddenFilterHeading}>Additional filters</div>
                    </div>
                    <div><ChevronDown className="icons" /></div>
                  </div>
                }
                {(type === defaultType || opend) &&
                  <Suspense fallback={<Loading />}>
                    <div className={styles.container}>
                      <div className={styles.sub_container}>
                        <div className="grid grid-cols-5 gap-3">
                          <EventTypeSelector />
                          <CategorySelector />
                          <EventFormatSelector />
                          {(type !== "T_LOCATION" && type !== "T_VENUE" && type !== "T_GEOTIME") && <LocationSelector isMandatory={isMandatory} />}

                          {/* <LocationSelector/> */}
                          {type !== "T_GEOTIME" &&
                            <DateRangeSelector />
                          }
                          <EventStatusSelector />
                          <EventEntrySelector />
                          <UserRatingSelector />
                        </div>
                      </div>

                      {/*   ADVANCE FILTER SECTION */}

                      <Tabs
                        defaultValue="list"
                        value={selectedAdvancedView}
                        onValueChange={handleTabChange}
                      >
                        <div className="flex justify-center my-6">
                          <div className="flex justify-center">
                            <TabsList className={cn(
                              "w-[570px] grid grid-cols-3 h-auto",
                              isEventeli ? "grid-cols-2 w-[386px]" : ""
                            )}>
                              <TabsTrigger value="advancedDetails" className="text-base">
                                Advanced Details
                                {/* {advancedDetailsFiltersCount ? (
                <Badge className="ml-2">{advancedDetailsFiltersCount}</Badge>
              ) : (
                ""
              )} */}
                              </TabsTrigger>
                              <TabsTrigger value="insightsAndScores" className=" text-base">
                                Insights and Scores
                                {/* {insightsAndScoresFiltersCount ? (
                <Badge className="ml-2">{insightsAndScoresFiltersCount}</Badge>
              ) : (
                ""
              )} */}
                              </TabsTrigger>
                              {!isEventeli && (
                                <TabsTrigger value="audienceIntel" className=" text-base">
                                  Audience Intel
                                  {/* {audienceInterFiltersCount ? (
                  <Badge className="ml-2">{audienceInterFiltersCount}</Badge>
                   ) : (
                  ""
                   )} */}
                                </TabsTrigger>
                              )}
                            </TabsList>
                          </div>
                        </div>
                        <TabsContent value="advancedDetails">
                          <div className="grid grid-cols-5 gap-3 pb-6">
                            <MaturitySelector />
                            <GlobalAndTouringSelector />
                            <ForecastedStatusSelector />
                            <FrequencySelector />
                            {type !== "T_PRODUCT_KEYWORDS" &&
                              <ProductSelector />
                            }
                          </div>
                        </TabsContent>
                        <TabsContent value="insightsAndScores">
                          <div className={cn("grid grid-cols-5 gap-3 pb-6", { "grid-cols-4": isEventeli, })}>
                            <EstimatedVisitorsSelector />
                            {!isEventeli && (
                              <EstimatedExhibitorsSelector />
                            )}
                            {isEventeli && <EventAnalyticsSelector />}
                            {isEventeli && <EstimatedEconomicImpactSelector />}
                            <EventRankingSelector />
                          </div>
                        </TabsContent>
                        {!isEventeli && <TabsContent value="audienceIntel">
                          <div className={cn("grid grid-cols-5 gap-3 pb-6", { "grid-cols-4": isEventeli, })}>
                            {/* <AudienceQualitySelector />
                    <ExhibitorQualitySelector /> */}
                            <AudienceZoneSelector />
                            <AudienceProfileSelector />
                            <AudienceSpreadSelector />
                          </div>
                        </TabsContent>}
                      </Tabs>
                    </div>
                  </Suspense>
                }

              </div>
            }
            {(type && ["T_COMPETITOR", "T_PRODUCT_KEYWORDS", "T_SPEAKING_OPPORTUNITY", "T_PEOPLE_FINDER"].includes(type)) &&
              <Presets template={template} handlePresetClick={handlePresetClick} />
            }
          </div>
        </>
      }</div>
      {del &&
        (
          <div className={styles.shareModal} >
            <div className={`${styles.innerModal} text-base`}>
              <div className="font-medium text-[var(--primary-color)]">Delete Tracker</div>
              {/* <div className={styles.bar}></div> */}
              <div className={styles.linkCopy}>

                <div className={styles.inviteAccess}>

                  All events tracked by tracker will be lost. Do you wish to delete tracker permanently?




                </div>
              </div>

              <div className={styles.buttons}>

                {/* <button className={styles.send} onClick={deleteTracker}>Delete</button> */}
                <Button className="text-white" onClick={deleteTracker}>Delete</Button>
                {/* <button className={styles.cancel} onClick={closeShareModal}>Cancel</button> */}
                <Button variant="outline" className="text-[var(--primary-color)] hover:text-[var(--primary-color)]" onClick={closeShareModal}>Cancel</Button>
              </div>
            </div>
          </div>


        )}
    </>
  );
};

export default Pages;