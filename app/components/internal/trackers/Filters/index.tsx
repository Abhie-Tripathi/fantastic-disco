"use client";
import styles from "./filters.style.module.css";
import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import EstimatedEconomicImpactSelector from "@/components/advancedFilters/estimatedEconomicImpact";
import AudienceProfileSelector from "@/components/search/advancedFilters/audienceDes&Dep";
import ProductSelector from "@/components/search/advancedFilters/product&Topics"
import AudienceSpreadSelector from "@/components/search/advancedFilters/audienceSpread"
import {useTrackerServices} from '@/services/trackerServices'
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
import {Tracker, Toggle} from '@/types/trackers'
import ExhibitorQualitySelector from "@/components/advancedFilters/exhibitorQualityScore";
import { useTrackerContext } from "@/context/tracker";
import { Designations } from "@/types/misc";
import { useFilterContext } from "@/context/filterContext";
import { categories, newCategories } from "@/data/categories";
import Presets from "./Presets";
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
export type Location =  LocationItem[];
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
        required:true,
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
        required:true,
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
        required:true,
        example: "Mark Zuckerberg",
      },
      {
        img: Company,
        type: "text",
        placeholder: "Company Name",
        required:true,
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
        placeholder: "Speaker's Name",
        required:true,
        example: "Mark Zuckerberg",
      },
      {
        img: Company,
        type: "text",
        placeholder: "Company Name",
        required:true,
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
  }
]

const formatText = (val: string) => {
  if(val) {
    return val?.charAt(0).toUpperCase() + val?.substring(1).toLowerCase();
  }
}

const formatCount = (count: number ) => {
  if (count >= 1000) {
    const value = count / 1000;
    const decimalPart = value - Math.floor(value);
      return `${Math.floor(value)}k`;
  }
  return count;
};

const Pages = () => {
  const {searchParams: search} = useDefaultFilters();
  const searchParams = useSearchParams();
  
  const {data: editData, setEditTrue, setData: setEditData} = useTrackerContext();
  const { getLocalFilterValue, setLocalFilter, setMultipleLocalFilters} = useFilterContext();
  const {enabledFilters } = useFilterContext();
  
  interface SelectedLocation {
    [id: string]: string;
  }
  const eventTypes = getLocalFilterValue("eventTypes")
      .split(",")
      .filter(Boolean);
      
  const [presetTemplateData, setPresetTemplateData] = useState<PresetJsonData[]>([])
  const {getTrackerDetail,createTracker,editTracker, error}=useTrackerServices();
  const { theme } = useTheme();
  const type = searchParams.get('type');
  const [selectedLocationsData,setSelectedLocationsData]=useState<any>(enabledFilters?.locationIds?.enabledValue);
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [opend,setOpend]=useState(false);
  const pathName = usePathname().split("/");
  const last = pathName[pathName.length - 1];
  const router = useRouter();
  const [includeKeywords, setIncludeKeywords] = useState<string[] |undefined>([]);
  const [excludeKeywords, setExcludeKeywords] = useState<string[] | undefined>([]);
  // const [categorySlug, setCategorySlug] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  // const [selectedCategories, setSelectedCategories] = useState<string[]>(
  //   enabledFilters?.eventCategory?.enabledValue?.map((item) => item.slug) || []
  // );
  const [hideSuggestion,setHideSuggestion]=useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
      enabledFilters?.eventCategory?.enabledValue?.map((item) => item.slug) || []
    );
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    searchParams.get("location")?.split(",") || []
  );
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    searchParams.get("labels")?.split(",") || []
  );
  const [eventSearchLoader,setEventSearchLoader]=useState(false);
  const [selectedEventRank, setSelectedEventRank] = useState([0, 100]);
  const [selectedLocalRank, setSelectedLocalRank] = useState([0, 100]);
  const [selectedTrustScore, setSelectedTrustScore] = useState<any>([0, 100]);
  const [selectedAviationRank, setSelectedAviationRank] = useState([0, 100]);
  const [selectedDateRange, setSelectedDateRange] = useState<any[]>([]);
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: enabledFilters?.durations?.startDate
      ? new Date(enabledFilters.durations.startDate.split(",")[0])
      : undefined,
    to: enabledFilters?.durations?.startDate
      ? new Date(enabledFilters.durations.startDate.split(",")[1])
      : undefined,
  });
  const [selectedEventStatus, setSelectedEventStatus] = useState<string[]>(
    enabledFilters?.eventStatus?.enabledValue?.map((item)=>item.toLowerCase()) || []
  );
  const [selectedEventAttendanceRange, setSelectedEventAttendanceRange] =
    useState<string[]>([]);
  const [selectedEventFrequency, setSelectedEventFrequency] = useState<
    string[]
  >(enabledFilters?.eventFrequency?.enabledValue?.map((item)=>item.toLowerCase())|| []);
  const [freqToggle,setFreqToggle]=useState<boolean>(enabledFilters?.eventFrequency?.isFreqEnabled || false);
  const [selectedEntry, setSelectedEntry] = useState<string[]>(
    enabledFilters?.eventEntry?.enabledValue?.map((item)=>item.toLowerCase()) || []
  );
  const [selectedEventRanking, setSelectedEventRanking] = useState<string[]>(
    searchParams.get("rank")?.split(",") || []
  );
  const [selectedEventFormat, setSelectedEventFormat] = useState<string[]>(
    enabledFilters?.eventFormat?.enabledValue || []
  );
  const [selectedExhibitScore, setSelectedExhibitScore] = useState<string[]>(
    enabledFilters?.estimatedExhibitScore?.enabledValue || []
  );
  const [selectedUserRatings, setSelectedUserRatings] = useState<string[]>(
    enabledFilters?.eventRating?.enabledValue || []
  );
  const [rankToggles, setRankToggles] = useState({
    isEventRank: false,
    isLocalRank: false,
    isAviationRank: false,
    isTrustScore: false,
  });
  const [isPop,setIsPop]=useState({
  rating:false,
  exhibit:false,
  audienceSpread: false,
});
  // const [showAdvanceFilter, setShowAdvanceFilter] = useState(true);
  // const [selectedAdvFilter, setSelectedAdvFilter] = useState("AP");
  // const [selectedBrandedEvent, setSelectedBrandedEvent] = useState(enabledFilters?.branded?.enabledValue?.eventBrand||false);
  
  // const [selectedEventSeries, setSelectedEventSeries] = useState(enabledFilters?.branded?.enabledValue?.eventSeries || false);
  // const [selectedReptScore, setSelectedReptScore] = useState(0);
  // const [selectedMaturity, setSelectedMaturity] = useState<string>(enabledFilters?.maturity?.enabledValue?.[0] || "");
  // const [isMaturity,setIsMaturity]=useState<boolean>(enabledFilters?.maturity?.isMaturityEnabled||false);
  // const [isBrand,setIsBrand]=useState<boolean>(enabledFilters?.branded?.isBrandedEnabled|| false);
  // const [maturity, setMaturity] = useState<string | null>();
  const [intScore, setIntScore] = useState<string | null>();
  // const [selectedInboundScore, setSelectedInboundScore] = useState(0);
  const [selectedEventKeywords, setSelectedEventKeywords] = useState<string[]>(
    searchParams.get("eventKeywords")?.split(",") || []
  );
  const [customData, setCustomData] = useState<any[]>([]);
  const [activeTab,setActiveTab]=useState("include");
  const [selectedEventEdition, setSelectedEventEdition] = useState(0);
  const [selectedINScore, setSelectedINScore] = useState(0);
  const [add, setAdd] = useState(false);
  const [forecastedStatus, setForecastedStatus] = useState(enabledFilters?.isForecasted?.isForecastedEnabled || false);

  const [analyticsToggles, setAnalyticsToggles] = useState({
    impactScore: false,
    inboundScore: false,
    internationalScore: false,
    globalToggle: false
  });

  const [selectedImpactScore, setSelectedImpactScore] = useState<[number,number]>([0, 100]);
  const [selectedInboundScore, setSelectedInboundScore] = useState<[number, number]>([0, 100]);
  const [selectedInternationalScore, setSelectedInternationalScore] = useState<[number,number]>([0, 100]);

  const [audienceZone, setAudienceZone] = useState<boolean>(enabledFilters?.audienceZone?.isZoneEnabled || false);
  const [audienceSpread, setAudienceSpread] = useState<boolean>(false);
  const [selectedRank, setSelectedRank] = useState<string>('');
  const [selectedCountries, setSelectedCountries] = useState<any>([]);
  const [selectedAudProfile, setSelectedAudProfile] = useState<string[]>([]);
  const [selectedAdvancedView, setSelectedAdvancedView] = useState("advancedDetails");
  const handleTabChange = (value: string) => {
    setSelectedAdvancedView(value);
  };
  const createTrackerHandler = () => {
    const params = new URLSearchParams(searchParams);
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }
    if (selectedLocations.length > 0) {
      params.set("locations", selectedLocations?.join(","));
    }
    if (selectedEventStatus.length > 0) {
      params.set("status", selectedEventStatus?.join(","));
    }
    if (selectedLabels.length > 0) {
      params.set("labels", selectedLabels?.join(","));
    }
    if (selectedDateRange[0] !== null) {
      params.set("active_gte", convertToYYYYMMDD(selectedDateRange[0]));
      params.set("active_lte", convertToYYYYMMDD(selectedDateRange[1]));
    }
    if (selectedEventAttendanceRange.length > 0) {
      params.set("event_attendance_gte", selectedEventAttendanceRange[0]);
      params.set("event_attendance_lte", selectedEventAttendanceRange[1]);
    }
    router.push(`/trackers/create?${params.toString()}`);
  };

  const searchHandler = () => {
    const params = new URLSearchParams(searchParams);
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }
    if (selectedLocations.length > 0) {
      params.set("city", selectedLocations?.join(","));
    }
    if (selectedEventStatus.length > 0) {
      params.set("status", selectedEventStatus?.join(","));
    }
    if (selectedLabels.length > 0) {
      params.set("labels", selectedLabels?.join(","));
    }
    if (selectedDateRange[0] !== null) {
      params.set("active_gte", selectedDateRange[0]);
      params.set("active_lte", selectedDateRange[1]);
    }
    if (selectedEventAttendanceRange.length > 0) {
      params.set("event_attendance_gte", selectedEventAttendanceRange[0]);
      params.set("event_attendance_lte", selectedEventAttendanceRange[1]);
    }
    router.push(`/search/events?${params.toString()}`);
  };
  const [trackerName, setTrackerName] = useState("");
  const [selectedPresetName, setSelectedPresetName] = useState<string>('');
  // const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [categorySlug, setCategorySlug] = useState<string[]>(
    searchParams.get("categories")?.split(",") || []
  );
  // const [editData, setEditData] = useState<EditData | null>(null);

  useEffect(() => {
    if (last === "editTracker") {
      const secondLast = pathName[pathName.length - 2];
      // fetchData(secondLast);
    }
  }, [last]);

//   const fetchData = async (secondLast: string) => {
//    // const url = `${baseUrl}/tracker/${secondLast}?edit=true`;
//     try {
//       // const { data, error } = await myFetch(url, {
//       //   method: "GET",
//       // });
//       // const data= await getTrackerDetail(secondLast, "edit=true");

// if (data) {
//   // setEditData(data || null);
//   console.log(data);
  
// }
//       if (error) {
//         console.error("Error fetching data:", error);
//       }
//     } catch (err) {
//       console.error("Fetch failed:", err);
//     }
//   };
  const [categories, setCategories] = useState(
    searchParams.get("categories")?.split(",") || []
  );
  // useEffect(() => {
  //   if (selectedMaturity > 0) {
  //     // queryString.maturity = selectedMaturity;
  //     if (selectedMaturity >= 1 && selectedMaturity <= 25) setMaturity("new");
  //     else if (selectedMaturity >= 26 && selectedMaturity <= 50)
  //       setMaturity("low");
  //     else if (selectedMaturity >= 51 && selectedMaturity <= 75)
  //       setMaturity("medium");
  //     else setMaturity("High");
  //   }
  // }, [selectedMaturity]);
  useEffect(() => {
    if (selectedINScore > 0) {
      if (selectedINScore > 0 && selectedINScore <= 33) setIntScore("Low");
      else if (selectedINScore >= 33 && selectedINScore <= 66)
        setIntScore("Medium");
      // else if (selectedINScore >= 51 && selectedINScore <= 75)
      //   setIntScore("Regional");
      else setIntScore("High");
    }
  }, [selectedINScore]);
  const [websites, setWebsites] = useState("");
  const [org,setOrg]=useState("");
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
      if(customData.length > 0 && Object.values(customData[0])[0]) {
        let placeholder = template?.inputAreas?.[0]?.placeholder || "";
        const promptText=`List only name of top 5 companies similar to ${Object.values(customData[0])[0]}. Response should be in plain JSON format without any additional formatting or text: {"data": [ "company name 1" ,
        "company name 2" , "company name 3" ,
         "company name 4" ,
        "company name 5" ]}. Do not show example values. If no company name found then return in below format: {\"data\": []}`
        if(!hideSuggestion)
          fetchAISuggestion(promptText);
      }
      const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      const urls = customData
      .map((item: {}) => Object.values(item)[0] as string)
      .filter(value => regex.test(value))
      .join(',');
  
    const orgNames = customData
      .map((item: {}) => Object.values(item)[0] as string)
      .filter(value => !regex.test(value))
      .join(',');
  
    setWebsites(urls);
    setOrg(orgNames);
    }
    else if (type === "T_SPEAKING_OPPORTUNITY") {
      if(customData.length>0 && Object.values(customData[0])[0] && Object.values(customData[0])[1]){
        const promptText = `List the top 5 speakers with similar experience to ${Object.values(customData[0])[0]} (${Object.values(customData[0])[1]}). Not necessarily they have the same designation; instead, they must have spoken recently on the same topics. Response should be in plain JSON format without any additional formatting or text: {
          "data": [
              [ "Speaker Name 1", "Company Name 1" ],
              [ "Speaker Name 2", "Company Name 2" ],
              [ "Speaker Name 3", "Company Name 3" ],
              [ "Speaker Name 4", "Company Name 4" ],
              [ "Speaker Name 5", "Company Name 5" ]
          ]
      }. If no data is found, respond in this format: {\"data\": []}`; 
        if(!hideSuggestion)
          fetchAISuggestion(promptText);
      }
      const speakerName = customData.map((item: {}) => Object.values(item)[0]).join(',');
      const speakerCompany = customData.map((item: {}) => Object.values(item)[1]).join(',');
      setSpeakerName(speakerName);
      setSpeakerCompany(speakerCompany);
      // console.log(speakerName, speakerCompany);

    }
    else if (type === "T_PEOPLE_FINDER") {
      if(customData.length>0 && Object.values(customData[0])[0] && Object.values(customData[0])[1]){
        const promptText = `List the top 5 people similar to ${Object.values(customData[0])[0]}(${Object.values(customData[0])[1]}). Response should be in plain JSON format without any additional formatting or text: {
        "data": [
          [ "name 1", "company name 1" ],
          ["name 2", "company name 2" ],
          ["name 3", "company name 3" ],
          [ "name 4", "company name 4" ],
          [ "name 5", "company name 5" ]
        ]
      }. Do not show example values. If no data found then return in below format: {\"data\": []}`
      if(!hideSuggestion)
        fetchAISuggestion(promptText);
      }
      const userName = customData.map((item: {}) => Object.values(item)[0]).join(',');
      const userCompany = customData.map((item: {}) => Object.values(item)[1]).join(',')
      setUserName(userName)
      setUserCompany(userCompany)
      if(userName.length>0 && userCompany.length>0){
        const promptText = `List the top 5 people similar to ${Object.values(customData[0])[0]}(${Object.values(customData[0])[1]}). Response should be in plain JSON format without any additional formatting or text: {
        "data": [
          [ "name 1", "company name 1" ],
          ["name 2", "company name 2" ],
          ["name 3", "company name 3" ],
          [ "name 4", "company name 4" ],
          [ "name 5", "company name 5" ]
        ]
      }. Do not show example values. If no data found then return in below format: {\"data\": []}`
      if(!hideSuggestion)
        fetchAISuggestion(promptText);
      }
    } else if (type === "T_BRAND_BUILDING") {
      const designation = customData.map((item: {}) => Object.values(item)[0]).join(',');
      setDesignations(designation);
    }
    else if(type === "T_PRODUCT_KEYWORDS"){
      if(activeTab==="include"){
        const includeKeywords = customData.map((item: {}) => Object.values(item)[0]).join(',');
        setLocalFilter("includeKeywords", includeKeywords)
      }else{
        const excludeKeywords = customData.map((item: {}) => Object.values(item)[0]).join(',');
        setLocalFilter("excludeKeywords", excludeKeywords)
      }
    }
  }, [type, customData])
  const fetchAISuggestion = async(promptText:string)=>{
    // console.log(val);
    try{
      let aiResponse: any = await suggestionGenerator(promptText);
      
      let temp = JSON.parse(aiResponse.choices[0].message.content);  
      if(temp && temp?.data && Array.isArray(temp.data) && temp?.data?.length > 0){
        setSuggestions(temp.data)
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setSuggestions([]);
    }
  }
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  const handlePresetClick = (presetItem: PresetJsonData, id: number, trackerType: string, trackerName: string) => {
    setHideSuggestion(false);
    // const filteredPresetData = presetTemplateData.filter(item => item.id === id);    
    if (trackerType === 'T_COMPETITOR' || trackerType === 'T_SPEAKING_OPPORTUNITY') {
      const presetData: any = [];

      presetItem?.data.map((item: any) => {
        const temp: any = {};
        template?.inputAreas?.map((field: InputArea, index: number)=>(
          temp[field.placeholder] = item[index]
        ))
        presetData.push(temp);
      })      
      setCustomData(presetData);
      setTrackerName(trackerName);
    } else if (trackerType === 'T_PRODUCT_KEYWORDS') {
      setTrackerName(trackerName);
      setLocalFilter("includeKeywords",presetItem?.data?.[0].join(","));
      setLocalFilter("excludeKeywords",presetItem?.data?.[1].join(","))
    }

    setSelectedPresetName(trackerName);
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  const saveTrackerHandler = async () => {
    // console.log(new Date(selectedDateRange[0]).toISOString().split('T')[0]);
    setEditTrue(true);
    if (type === "T_COMPETITOR" && (websites.length===0 || org.length===0)){
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
    
    const categorySlugs = selectedCategories;
    const categoryIds = getLocalFilterValue("categories")
    .split(",")
    .filter(Boolean).map((slug) => {
      const category = newCategories.find((cat) => cat.slug === slug);
      return category ? category.id : slug;
    });
    const showsData: string[] = [];

    const mapping = {
      rating: "eventRating",
      maturity: "maturity",
      forecasted: "isforecasted",
      frequency: "eventFrequency",
      estimatedExhibitors: "estimatedExhibitScore",
      scores: "eventImpactScore,inboundScore,internationalScore",
      audienceZone: "audienceSpread",
      branded: "eventBrand",
      series: "eventSeries",
      rankings: "eventRanking,trustScore"
    };
    
    const filters = getLocalFilterValue("show").split(",");
    Object.entries(mapping).forEach(([key, value]) => {
      if (filters.includes(key)) {
        showsData.push(value);
      }
    });
    
    const userType = {
      ...(getLocalFilterValue("show").split(",").includes("rating") && { rating: true }),
      ...(getLocalFilterValue("show").split(",").includes("estimatedExhibitors") && { exhibit: true }),
      ...(rankToggles.isTrustScore && {trust:true}),
      ...(getLocalFilterValue("show").split(",").includes("maturity")&& {maturity:true}),
      ...(getLocalFilterValue("onlyBranded")==="true" && {brandedEvent:true}),
      ...(getLocalFilterValue("onlySeries")==="true" && {eventSeries:true}),
      ...((getLocalFilterValue("show").split(",").includes("branded") && getLocalFilterValue("show").split(",").includes("series"))&& {brandSeries:true}),
      ...((getLocalFilterValue("show").split(",").includes("forecasted")) && {forecastedStatus:true}),
      ...(analyticsToggles.impactScore&& {impactScore:true}),
      ...(analyticsToggles.inboundScore&& {inboundScore:true}),
      ...(analyticsToggles.internationalScore&& {internationalScore:true}),
      ...((getLocalFilterValue("show").split(",").includes("rankings"))&& {eventRank:true}),
      ...(getLocalFilterValue("show").split(",").includes("scores") && {globalToggle: true}),
      ...(getLocalFilterValue("show").split(",").includes("audienceZone") && {audienceZone:true}),
      ...(audienceSpread && {audienceSpread:true}),
      ...(getLocalFilterValue("show").split(",").includes("frequency") && {eventFrequency:true}),
      ...(getLocalFilterValue("trust_score_gte") && {
        trust: true
      }),
    }
     const eventType1=getLocalFilterValue("eventTypes")
      .split(",")
      .filter(Boolean);
    const formData = {
      name: trackerName,
      ...(type && type.length > 0 && {
        type: type.toUpperCase()
      }),
      accessLevel: editData?.tracker?.accessLevel,
      filterValue: {
          ...(userType &&{
           userType:JSON.stringify(userType)
          }),
        ...(selectedLabels?.length > 0 && {
          labels: selectedLabels.join(","),
        }),
        // ...(selectedEventType?.length > 0 && {
        //   eventType: selectedEventTypeName
        // }),
        ...(websites.length > 0 && {
          orgWebsite: websites,
        }),
        ...(org.length > 0 && {
          orgName : org,
        }),
        ...(designations.length > 0 && {
          userDesignation: designations,
        }),
        ...(speakerName.length > 0 && {
          speakerName: speakerName,
        }),
        ...(speakerCompany.length > 0 && {
          speakerOrg: speakerCompany,
        }),
        ...(getLocalFilterValue("eventTypes")?.length > 0 && {
          eventType: eventType1
            .map(eventType => eventType.charAt(0).toUpperCase() + eventType.slice(1).replace(/s$/, ""))
            .join(","),
        }),
        ...(userName.length > 0 && {
          userName: userName,
        }),
        ...(userCompany.length > 0 && {
          speakerOrg: userCompany,
        }),
        ...(selectedEventEdition > 0 && {
          editionRange: selectedEventEdition.toString(),
        }),
        // ...(
        //   type === "competitor" && customData.length > 0
        //     ? { orgWebsite: customData.map(item => item.companyUrl).join(', ') }
        //     : {}
        // )
        // ...(selectedEventKeywords.length > 0 && {
        //   eventKeywords: selectedEventKeywords.join("+"),
        // }),
        ...(getLocalFilterValue("includeKeywords").length > 0 && {
          includeKeywords: getLocalFilterValue("includeKeywords")
            .split(",")
            .map((keyword) => keyword.replaceAll(" ", "_")).join(",")
        }),
        ...(getLocalFilterValue("excludeKeywords").length > 0 && {
          excludeKeywords: getLocalFilterValue("excludeKeywords")
            .split(",")
            .map((keyword) => keyword.replaceAll(" ", "_")).join(",")
        }),
        ...(getLocalFilterValue("estimatedVisitorRangeTag")?.length>0 && {
          estimatedVisitorRangeTag: getLocalFilterValue("estimatedVisitorRangeTag")
         }),
         ...(getLocalFilterValue("estimatedExhibitors")?.length>0 && {estimatedExhibitScore:getLocalFilterValue("estimatedExhibitors")}),
        // ...(selectedZone?.length > 0 && {
        //   eventRegion: selectedZone.join(',')
        // }),
        // brandedEvent: selectedBrandedEvent?.toString(),
        // labels:selectedLabels.join(','),
        // eventKeywords:selectedEventKeywords.join(','),
        // ...(Object.entries(selectedCountry).length > 0 && {
        //   eventCountry: Object.keys(selectedCountry).join(","),
        // }),
        // ...(Object.entries(selectedCity).length > 0 && {
        //   eventCity: Object.keys(selectedCity).join(","),
        // }),
        ...(selectedLabels?.length > 0 && {
          labels: selectedLabels.join(","),
        }),
        ...(getLocalFilterValue("categories")?.length>0 &&{
          eventCategory: categoryIds.join(",")
        }),
        ...(getLocalFilterValue("eventFormats")?.length > 0 && {
          eventFormat: getLocalFilterValue("eventFormats"),
        }),
        ...(getLocalFilterValue("onlySeries")==="true" && {eventSeries: getLocalFilterValue("onlySeries")}),
        ...(getLocalFilterValue("status")?.length > 0 && {
          eventStatus: getLocalFilterValue("status").split(',').map((item)=>item.toUpperCase()).join(","),
        }),
        ...(getLocalFilterValue("entryType")?.length > 0 && {
          eventEntry: getLocalFilterValue("entryType"),
        }),
        ...(getLocalFilterValue("trust_score_gte") && {
          trustScore: getLocalFilterValue("trust_score_gte"),
        }),
        ...(getLocalFilterValue("frequencies")?.length > 0 && {
          eventFrequency: getLocalFilterValue("frequencies").split(",").map((item)=>item[0].toUpperCase()+item.slice(1)).join(","),
        }),
        // ...(selectedMaturity > 0 && { maturity: selectedMaturity.toString() }),
        // ...(selectedDateRange?.length === 2 && selectedDateRange[0]!==null && selectedDateRange[1]!==null && {
        //   startDate: [
        //     new Date(selectedDateRange[0]).toISOString().split("T")[0],
        //     new Date(selectedDateRange[1]).toISOString().split("T")[0],
        //   ].join(","),
        // }),
        ...(getLocalFilterValue("active_gte") && getLocalFilterValue("active_lte") && {
          startDate: [
            getLocalFilterValue("active_gte"),
            getLocalFilterValue("active_lte"),
          ].join(","),
        }),
        ...(getLocalFilterValue("active_gte") && getLocalFilterValue("active_lte") &&{
          endDate: [
            getLocalFilterValue("active_gte"),
            getLocalFilterValue("active_lte"),
          ].join(","),
        }),
        // ...(selectedDateRange?.length === 2 && selectedDateRange[0]!==null && selectedDateRange[1]!==null && {
        //   endDate: [
        //     new Date(selectedDateRange[0]).toISOString().split("T")[0],
        //     new Date(selectedDateRange[1]).toISOString().split("T")[0],
        //   ].join(","),
        // }),
        ...(selectedLocationsData && selectedLocationsData?.length > 0
    ? { locationIds: selectedLocationsData.map((item:LocationItem) => item.id).join(',') }
    : {}),
          ...(getLocalFilterValue("locationIds").length>0 && {
            locationIds: getLocalFilterValue("locationIds")
          }),
        ...(getLocalFilterValue("ratings")?.length > 0 && {
          eventRating: getLocalFilterValue("ratings"),
        }),
        // ...(rankToggles?.isEventRank === true && {
        //   eventRank: selectedEventRank.join(",")
        // }),
        ...(rankToggles?.isLocalRank === true && {
          localRank: selectedLocalRank.join(',')
        }),
        ...(selectedINScore > 0 && { internationalScore: intScore?.toLowerCase() }),
        // ...(selectedInboundScore > 0 && {
        //   inboundScore: selectedInboundScore.toString(),
        // }),
        ...(selectedEventAttendanceRange?.length === 2 && {
          eventAttendanceRange: [
            +selectedEventAttendanceRange[0],
            +selectedEventAttendanceRange[1],
          ].join(","),
        }),
        ...(getLocalFilterValue("maturity").length>0 && { maturity: getLocalFilterValue("maturity") }),
        ...(getLocalFilterValue("show").split(",").includes("scores") && {
          eventImpactScore: `${getLocalFilterValue("impact_score_gte")|| 0}-${getLocalFilterValue("impact_score_lte")|| 100}`,
          inboundScore: `${getLocalFilterValue("inbound_score_gte")|| 0}-${getLocalFilterValue("inbound_score_lte")|| 100}`,
          internationalScore: `${getLocalFilterValue("international_score_gte")||0}-${getLocalFilterValue("international_score_lte")|| 100}`,
        }),
        ...(forecastedStatus && {
          isforecasted: forecastedStatus.toString()
        }),
        ...(getLocalFilterValue("onlyBranded")==="true" && {eventBrand:getLocalFilterValue("onlyBranded").toString()}),
        ...(getLocalFilterValue("top") && {
          // globalRanking: selectedRank,
          // categoryRanking: selectedRank,
          // countryRanking: selectedRank,
          eventRanking: `0-${getLocalFilterValue("top")}`,
        }),
        ...(getLocalFilterValue("audienceSpread") && {
          audienceSpread: getLocalFilterValue("audienceSpread")
         }),
         ...(getLocalFilterValue("designations") && {
          designation: getLocalFilterValue("designations"),
        }),
        ...{
          
        },
        ...{shows: showsData.join(",")}
        // ...{shows: ['eventBrand', 'eventSeries', 'maturity', 'eventImpactScore', 'inboundScore', 'internationalScore', 'isforecasted', 'trustScore', 'eventRating', 'estimatedExhibitScore', 'audienceSpread', 'eventFrequency'].join()}
        // info: {
        //   name: trackerName,
        //   location:selectedLocations,
        //   keywords:selectedEventKeywords.join(','),
        //   labels: selectedLabels.join(','),
        //   startDate: selectedDateRange[0],
        //   endDate: selectedDateRange[1],
        //   eventFormat: selectedEventFormat.join(','),
        //   category: categorySlug.join(','),
        //   eventStatus: selectedEventStatus.join(','),
        //   eventFrequency: selectedEventFrequency.join(','),
        //   eventEntry: selectedEntry.join(','),
        //   eventEdition: selectedEventEdition.toString(),
        //   eventKeywords: selectedLabels.join(','),
        //   eventRanking: selectedEventRanking.join(','),
        //   brandedEvent: selectedBrandedEvent,
        //   trustScore: selectedTrustScore.toString(),
        //   eventSeries: selectedEventSeries,
        //   reputationScore: selectedReptScore.toString(),
        //   maturity: selectedMaturity.toString(),
        //   internationalScore: selectedINScore.toString(),
        //   inboundScore: selectedInboundScore.toString(),
        //   userRating: selectedUserRatings.join(','),
        //   exhibitScore: selectedExhibitScore.join(','),
        //   total_attendance_gte: selectedEventAttendanceRange[0],
        //   total_attendance_lte:
        //     selectedEventAttendanceRange[1] === "Unlimited" ? 1000000 : selectedEventAttendanceRange[1],
        // }
      },
    };
    // console.log(formData);
    

      const secondLast = pathName[pathName.length - 2];
     
      if(type==="T_PRODUCT_KEYWORDS" && (trackerName.length === 0 ||(getLocalFilterValue("includeKeywords").length === 0 && getLocalFilterValue("excludeKeywords").length===0))){
        // console.log(getLocalFilterValue("includeKeywords"), getLocalFilterValue("excludeKeywords"));
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      else if (type !== "CUSTOM" && type!=="T_PRODUCT_KEYWORDS" &&(trackerName.length === 0 || customData.length === 0 )) {
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      else if (type === "CUSTOM" && ( 
        !getLocalFilterValue("locationIds") || 
        getLocalFilterValue("locationIds").length === 0 || 
        trackerName.trim().length === 0 
      )) {
        console.log("Please, Fill all the details");
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      if (last === "editTracker") {
      try{
        const data = await editTracker(secondLast, formData) as { error?: ApiError };
        if (data) {
          if(data?.error){
            toast.error((data.error as ApiError).message, {
              position: "bottom-right",
              autoClose: 2000,
              hideProgressBar: true,
            });
            setIsCreating(false);
            return;
          }else{
          router.replace(`/internal/trackers/${secondLast}/trackedConfiguration?type=${type}`);
          }
        } else {
          // console.log(error);
          setIsCreating(false);
        }
      }catch(error){
        // console.log(error);
        setIsCreating(false);
      }
    } else {
      // console.log(formData);
      
      if(type==="T_PRODUCT_KEYWORDS" && (trackerName.length === 0 ||(getLocalFilterValue("includeKeywords").length === 0 && getLocalFilterValue("excludeKeywords").length===0))){
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      else if (type !== "CUSTOM" && type!=="T_PRODUCT_KEYWORDS" &&(trackerName.length === 0 || customData.length === 0 )) {
        console.log("Please, Fill all the details");
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      else if (type === "CUSTOM" && (getLocalFilterValue("locationIds") && getLocalFilterValue("locationIds").length === 0 || trackerName.length === 0)){
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
      }catch(error){
        // console.log(error);
        toast.error((error as ApiError).message, {
          position: "bottom-right",
          autoClose: 2000,
          // closeButton: false,
          hideProgressBar: true,
        });
        setIsCreating(false);
        return;
      }
     

    }
  };
  const extractLocations = (locations: Record<string, any> | undefined) => {
    return locations
      ? Object.entries(locations).map(([id, descriptionObj]) => {
          const [locationId, description] = Object.entries(descriptionObj)[0];
          return {
            id: locationId,
            description: description as string,
          };
        })
      : [];
  };

  useEffect(() => {
    if (editData && editData?.tracker && last === "editTracker") {

      
      // if (editData.tracker.filterValue?.maturity == "low") {
      //   setSelectedMaturity(25);
      // }
      if (type === "T_COMPETITOR" || type == "T_CUSTOMER_ICP") {
        const orgNames = editData?.tracker?.filterValue?.orgName?.
          split(',');
        const orgWebsites = editData?.tracker?.filterValue?.orgWebsite?.
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
        const speakerOrgs = editData?.tracker?.filterValue?.speakerOrg?.
          split(',');
        const speakerNames = editData?.tracker?.filterValue?.speakerName?.
          split(',');
        const presentCustomData = (speakerNames ?? []).map((speakerName: string, index: number) => ({
          "Speaker's Name": speakerName.trim(),
          "Company Name": speakerOrgs?.[index]?.trim()
        }));
        setCustomData(presentCustomData);
        // setCustomData((prevData: any) => [
        //   ...prevData,
        //   ...newData?.map((item) => (
        //     { companyUrl: item.trim() }
        //   ))
        // ]);
      }
      if (type === "T_PEOPLE_FINDER") {
        const speakerOrgs = editData?.tracker?.filterValue?.speakerOrg?.
          split(',');
        const speakerNames = editData?.tracker?.filterValue?.userName?.
          split(',');
        const presentCustomData = speakerNames.map((speakerName: string, index: number) => ({
          "Name": speakerName.trim(),
          "Company Name": speakerOrgs[index]?.trim()
        }));
        setCustomData(presentCustomData);
      }
      if (editData.tracker.filterValue?.localRank?.length > 0 || editData.tracker.filterValue?.eventRank?.length > 0) {
        const newToggles = { ...rankToggles };
        if (editData?.tracker?.filterValue?.localRank?.length > 0) {
          newToggles.isLocalRank = true;
        }
        if (editData?.tracker?.filterValue?.eventRank?.length > 0) {
          newToggles.isEventRank = true;
        }
        setRankToggles(newToggles);
      }
      // const filteredArr = newArr
      //   .filter((item: any) => editData.tracker.filterValue?.eventCategory?.split(',').includes(item.id))
      //   .map((item: any) => item.id);
      // console.log(filteredArr);
      let toggleOpend: Toggle = {};
      
     
      if (typeof editData?.tracker?.filterValue?.userType === 'string') {
          toggleOpend = JSON.parse(editData.tracker.filterValue.userType) as Toggle;
      }
      const value = getLocalFilterValue("shows" as any);
      const showFilters = value ? [...value.split(",")] : [];
      if (toggleOpend?.rating) {
        
        showFilters.push("rating");
      }
      if (toggleOpend?.maturity) {
        showFilters.push("maturity");
      }
      if (toggleOpend?.brandSeries) {
        showFilters.push("branded");
        showFilters.push("series");
      }
      if(toggleOpend?.forecastedStatus){
        showFilters.push("forecasted");
      }
      if(toggleOpend?.eventFrequency){
        showFilters.push("frequency");
      }
      if(toggleOpend?.exhibit){
        showFilters.push("estimatedExhibitors");
      }
      if(toggleOpend?.globalToggle){
        showFilters.push("scores")
      }
      if(toggleOpend?.eventRank){
        showFilters.push("rankings")
      }
      if(toggleOpend?.audienceZone){
        showFilters.push("audienceZone")
      }
      setLocalFilter("show",showFilters.join(","));
      setRankToggles({
        ...rankToggles,
        isTrustScore : toggleOpend?.trust?true:false,
        isEventRank: toggleOpend?.eventRank ? true : false,
      })
      setForecastedStatus(toggleOpend?.forecastedStatus ? true : false);
      setFreqToggle(toggleOpend?.eventFrequency ? true : false);
      setAnalyticsToggles({
        ...analyticsToggles,
        impactScore: (toggleOpend?.impactScore ? true : false),
        inboundScore: (toggleOpend?.inboundScore ? true : false),
        internationalScore: (toggleOpend?.internationalScore ? true : false),
        globalToggle: toggleOpend?.globalToggle? true: false,
      });
      
      if(editData?.tracker?.filterValue?.inboundScore && editData?.tracker?.filterValue?.inboundScore !== "")
        setSelectedInboundScore(editData?.tracker?.filterValue?.inboundScore?.split("-"));
      if(editData?.tracker?.filterValue?.trustScore){
      setLocalFilter("trust_score_gte",editData?.tracker?.filterValue?.trustScore )
      setLocalFilter("trust_score_lte","100")
      }
      if(toggleOpend.globalToggle){
        setLocalFilter("impact_score_gte", (editData?.tracker?.filterValue?.eventImpactScore?.split("-")[0])?.toString() || "0")
        setLocalFilter("impact_score_lte", (editData?.tracker?.filterValue?.eventImpactScore?.split("-")[1])?.toString() || "100")
        setLocalFilter("inbound_score_gte", (editData?.tracker?.filterValue?.inboundScore?.split("-")[0])?.toString() || "0")
        setLocalFilter("inbound_score_lte", (editData?.tracker?.filterValue?.inboundScore?.split("-")[1])?.toString() || "100")
        setLocalFilter("international_score_gte", (editData?.tracker?.filterValue?.internationalScore?.split("-")[0])?.toString() || "0")
        setLocalFilter("international_score_lte", (editData?.tracker?.filterValue?.internationalScore?.split("-")[1])?.toString() || "100")
      }
      if(editData?.tracker?.filterValue?.estimatedVisitorRangeTag && editData?.tracker?.filterValue?.estimatedVisitorRangeTag !== ""){
        setLocalFilter("estimatedVisitorRangeTag", editData?.tracker?.filterValue?.estimatedVisitorRangeTag)
      }
      if(editData?.tracker?.filterValue?.eventImpactScore && editData?.tracker?.filterValue?.eventImpactScore !== "")
        setSelectedImpactScore(editData?.tracker?.filterValue?.eventImpactScore?.split("-"));

      if(editData?.tracker?.filterValue?.internationalScore && editData?.tracker?.filterValue?.internationalScore !== "")
        setSelectedInternationalScore(editData?.tracker?.filterValue?.internationalScore?.split("-"));

      if(editData?.tracker?.filterValue?.maturity && editData?.tracker?.filterValue?.maturity !== ''){
        setLocalFilter("maturity",editData?.tracker?.filterValue?.maturity)
      }
      if(editData?.tracker?.filterValue?.eventBrand){
        setLocalFilter("onlyBranded","true")
      }
      if(editData?.tracker?.filterValue?.eventSeries){
        setLocalFilter("onlySeries","true")
      }
      if(editData?.tracker?.filterValue?.eventRanking && editData?.tracker?.filterValue?.eventRanking !== '')
        setLocalFilter("top",editData?.tracker?.filterValue?.eventRanking?.split("-")[1]?.toString())
      
      setAudienceZone(toggleOpend?.audienceZone ? true : false);
      setAudienceSpread(toggleOpend?.audienceSpread ? true : false);

      setSelectedCountries(editData.tracker.filterValue?.audienceSpread ? editData.tracker.filterValue?.audienceSpread?.split(",") : []);
      setLocalFilter("audienceSpread",editData.tracker.filterValue?.audienceSpread);
      if (Array.isArray(editData.tracker.filterValue.designation)) {
        const designationIds = editData.tracker.filterValue.designation
            .filter((item: Designations) => item.id !== undefined)
            .map((item: Designations) => item.id)
            .join(",");
    
        setLocalFilter("designations", designationIds);
    }
      setSelectedAudProfile(
        editData.tracker.filterValue?.designation
          ? editData.tracker.filterValue.designation
              .filter((item: Designations) => item.id !== undefined)
              .map((item: Designations) => item.id)
          : []
      );

      setSelectedEventKeywords(
        editData?.tracker?.filterValue?.eventKeywords?.length > 0
          ? editData?.tracker?.filterValue?.eventKeywords?.split("+")
          : []
      );
      setTrackerName(editData?.tracker?.name || "");
      setSelectedLabels(editData?.tracker?.filterValue?.labels && 
        editData?.tracker?.filterValue?.labels?.length > 0
          ? editData?.tracker?.filterValue?.labels?.split(",")
          : []
      );
      if(editData?.tracker?.filterValue?.eventCategory?.length > 0) {
        const categories = editData?.tracker?.filterValue?.eventCategory;
        const categorySlugs = categories.map((item: any) => {
          const category = newCategories.find((cat) => cat.id === item.id);
          return category ? category.slug : item.id;
        });
        
        setLocalFilter("categories", categorySlugs.join(","));
      }
      // setSelectedCategories(
      //   editData?.tracker?.filterValue?.eventCategory?.length > 0
      //     ? editData?.tracker?.filterValue?.eventCategory?.filter((cat: Cat) => cat.id !== 'all').map(
      //       (cat: Cat) => cat.id
      //     )
      //     : []
      // );
      setSelectedEventFormat(
        editData?.tracker?.filterValue?.eventFormat &&
        editData?.tracker?.filterValue?.eventFormat?.length > 0
          ? editData?.tracker?.filterValue?.eventFormat?.split(",")
          : []
      );
      setLocalFilter("eventFormats", editData?.tracker?.filterValue?.eventFormat);

      setIntScore(
        editData?.tracker?.filterValue?.internationalScore?.length > 0
          ? editData?.tracker?.filterValue?.internationalScore
          : ""
      );
      setSelectedEventStatus(
        editData?.tracker?.filterValue?.eventStatus &&
          editData?.tracker?.filterValue?.eventStatus?.length !== 0
          ? editData?.tracker?.filterValue?.eventStatus?.split(",").map((item:string) => item.toLowerCase())
          : []
      );
      setLocalFilter(
        "status",
        editData?.tracker?.filterValue?.eventStatus?.split(",")?.map((item: string) => item.toLowerCase()).join(",")
      );
      setLocalFilter("active_gte",editData?.tracker?.filterValue?.startDate?.split(",")[0]);
      setLocalFilter("active_lte",editData?.tracker?.filterValue?.startDate?.split(",")[1]);
      setDateRange({
        to: editData?.tracker?.filterValue?.startDate
          ? new Date(editData.tracker.filterValue.startDate.split(",")[1])
          : undefined,
        from: editData?.tracker?.filterValue?.startDate
          ? new Date(editData.tracker.filterValue.startDate.split(",")[0])
          : undefined
      });
      // setMultipleLocalFilters({
      //   active_gte: new Date(enabledFilters?.durations?.startDate?.split(",")[0]?.trim())?.toISOString(),
      //   active_lte: new Date(enabledFilters?.durations?.endDate?.split(",")[0]?.trim())?.toISOString(),
      // });
      // setDateRange({
      //   ...dateRange,
      //   to: editData?.tracker?.filterValue?.startDate
      //     ? new Date(editData.tracker.filterValue.startDate.split(",")[1])
      //     : undefined
      // });
      // setSelectedDateRange(
      //   editData?.tracker?.filterValue?.startDate && 
      //   editData?.tracker?.filterValue?.startDate?.length > 0
      //     ? [
      //       editData?.tracker?.filterValue?.startDate?.split(",")[0],
      //       editData?.tracker?.filterValue?.startDate?.split(",")[1],
      //     ]
      //     : []
      // );
      setCategorySlug(
        editData?.tracker?.filterValue?.eventCategory?.length > 0
          ? editData?.tracker?.filterValue?.eventCategory?.filter((cat: Cat) => cat.id !== 'all')?.map(
            (cat: Cat) => cat.name
          )
          : []
      );
      const selectedCountrie = 
      typeof editData?.tracker?.filterValue?.locationIds === 'object'
        ? extractLocations(editData.tracker.filterValue.locationIds.country)
        : [];
    
    // const selectedZone = 
    //   typeof editData?.tracker?.filterValue?.locationIds === 'object'
    //     ? extractLocations(editData.tracker.filterValue.locationIds.zone)
    //     : [];
    
    const selectedCity = 
      typeof editData?.tracker?.filterValue?.locationIds === 'object'
        ? extractLocations(editData.tracker.filterValue.locationIds.city)
        : [];
    const selectedState = 
      typeof editData?.tracker?.filterValue?.locationIds === 'object'
        ? extractLocations(editData.tracker.filterValue.locationIds.state)
        : [];
    setSelectedLocationsData([...selectedCountrie,...selectedCity,...selectedState]);
    const ids = [
      ...(editData?.tracker?.filterValue?.locationIds?.city || []),
      ...(editData?.tracker?.filterValue?.locationIds?.state || []),
      ...(editData?.tracker?.filterValue?.locationIds?.country || []),
    ]
      .flatMap((location) => Object.keys(location));
      // console.log(selectedLocations);
      setLocalFilter("locationIds", ids.join(","));
      const eventCountry =
        editData?.tracker?.filterValue?.eventCountry?.map(
          (countryObj: {}) => Object.values(countryObj)[0]
        ) || [];
      const eventCity =
        editData?.tracker?.filterValue?.eventCity?.map(
          (cityObj: {}) => Object.values(cityObj)[0]
        ) || [];

      setSelectedLocations([...eventCountry, ...eventCity]);
      setSelectedEventFrequency(
        editData?.tracker?.filterValue?.eventFrequency && 
        editData?.tracker?.filterValue?.eventFrequency?.length > 0
          ? editData?.tracker?.filterValue?.eventFrequency?.split(",").map((item:string)=>item[0].toLowerCase()+item.slice(1))
          : []
      );
      setLocalFilter("frequencies",editData?.tracker?.filterValue?.eventFrequency)
      setSelectedEntry(
        editData.tracker.filterValue?.eventEntry &&
          editData.tracker.filterValue?.eventEntry?.length !== 0
          ? editData.tracker.filterValue?.eventEntry?.split(",")
          : []
      );
      if (editData?.tracker?.filterValue?.eventType !== undefined) {
        const eventTypes = editData.tracker.filterValue.eventType.map((type:string) => {
          return type.charAt(0).toLowerCase() + type.slice(1)+"s";
        });
        console.log("");
        
         setLocalFilter("eventTypes",eventTypes.join(","))
    }



      // setSelectedINScore(
      //   editData.tracker.filterValue?.internationalScore.length > 0
      //     ? editData.tracker.filterValue?.internationalScore
      //     : ""
      // );
      // setSelectedInboundScore(
      //   editData.tracker.filterValue?.inboundScore > 0
      //     ? editData.tracker.filterValue?.inboundScore
      //     : 0
      // );
      setSelectedUserRatings(
        editData.tracker.filterValue?.eventRating &&
          editData.tracker.filterValue?.eventRating?.length !== 0
          ? editData.tracker.filterValue?.eventRating?.split(",")
          : []
      );
      setLocalFilter("ratings", editData.tracker.filterValue?.eventRating);
      setLocalFilter("estimatedVisitors",editData.tracker.filterValue?.eventSize);
      setLocalFilter("estimatedExhibitors",editData.tracker.filterValue?.estimatedExhibitScore);
      if(editData.tracker.filterValue?.trustScore){
        setLocalFilter("trust_score_gte", editData.tracker.filterValue?.trustScore)
        setLocalFilter("trust_score_lte","100")
      }
      const updatedTrustScore=[...selectedTrustScore]
      updatedTrustScore[0]=
        editData.tracker.filterValue?.trustScore > 0
          ? editData.tracker.filterValue?.trustScore
          : 0;
        setSelectedTrustScore(updatedTrustScore)
      // setCategorySlug(editData.tracker.filterValue?.category?.split(',') || [])
      // setSelectedLocations(editData.tracker.filterValue?.location);
    setLocalFilter("includeKeywords",editData.tracker.filterValue?.includeKeywords
    ?.split(",")
    .map((keyword:string) => keyword.replaceAll("_", " "))
    .join(","));
    setLocalFilter("excludeKeywords",editData.tracker.filterValue?.excludeKeywords
    ?.split(",")
    .map((keyword:string) => keyword.replaceAll("_", " "))
    .join(","));
      setSelectedEventAttendanceRange((prevArray) => {
        const gte =
          editData.tracker.filterValue?.eventAttendanceRange?.split(",")[0];
        const lte =
          editData.tracker.filterValue?.eventAttendanceRange?.split(",")[1];

        if (!isNaN(gte) && !isNaN(lte)) {
          const newArray = [...prevArray];
          newArray[0] = gte;
          newArray[1] = lte;
          return newArray;
        } else {
          return prevArray;
        }
      });
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
  const [isLoading,setIsLoading]=useState(true);
  const [template, setTemplate] = useState<Template | null | undefined>(null);
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
  useEffect(() => {
    const foundTemplate = templates.find(t => t.name === type);
    setTemplate(foundTemplate);
  }, [type])
  useEffect(()=>{
    setIsLoading(false);
  },[template])
  const handleInput = (index: number, value: string) => {
    // console.log(value);
    setInputValues(prevValues => ({
      ...prevValues,
      [index]: value
    }));
  };
  const [valid,setValid]=useState(true);
  const addNew = () => {
    setHideSuggestion(false);
    if (!template) {
      console.error('Template is not found');
      return;
    }
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    let isValid = true;
    let isPresent = false;
    if(template.type==="enabled"){
    if (template && template.inputAreas && template.inputAreas.length === Object.keys(inputValues).length) {
      const newEntry = template.inputAreas.reduce<{ [key: string]: string }>((acc, inputArea, index) => {
        const value = inputValues[index];
        if (inputArea.placeholder === 'Add Competitor Name or Website') {
          //if (regex.test(value.trim())) {
            acc[inputArea.placeholder] = value;
            isPresent=customData.some((item) => {
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

    }else setValid(false);
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
    // console.log(filteredData);

    // setCustomData((prevData) => 
    //   prevData.map((item, index) => {
    //     if (index === itemIndex) {
    //       const { [entryKey]: _, ...rest } = item;
    //       return rest;
    //     }
    //     return item;
    //   }).filter(item => Object.keys(item).length > 0)
    // );
  };
  useEffect(() => {
    if (intScore === "low") setSelectedINScore(1);
    if (intScore === "medium") setSelectedINScore(50);
    if (intScore === "high") setSelectedINScore(100);
  }, [intScore])
useEffect(()=>{
  if(valid===false) setValid(true);
  if(isMandatory) setIsMandatory(false);
},[inputValues])
const dateShowFormatter = (selectedDateRange: string[]) => {
  const [sdDay, sdMonth, sdYear] = convertToCustomFormat(
    selectedDateRange[0]
  ).split(" ");
  const [edDay, edMonth, edYear] = convertToCustomFormat(
    selectedDateRange[1]
  ).split(" ");

  if (sdMonth === edMonth && sdYear === edYear) {
    return `${sdDay} - ${edDay} ${sdMonth} ${sdYear}`;
  }
  if (sdYear === edYear) {
    return `${sdDay} ${sdMonth} - ${edDay} ${edMonth} ${sdYear}`;
  }
  return `${sdDay} ${sdMonth} ${sdYear} - ${edDay} ${edMonth} ${edYear}`;
};
const abortControllerRef = useRef<AbortController | null>(null);
const [selected,setSelected]=useState(false);
const addCompany = (id:number,val: any) => {
  setSelected(true);
  if(!Array.isArray(val)){
  setInputValues(prevValues => ({
    ...prevValues,
    [0]: val
  }));  
  }else{
    setInputValues(val);
  }
}
useEffect(()=>{
  if(selected) {
    addNew();
    setSelected(false);
  }
},[selected])
const [isDiv,setIsDiv]=useState(false);
useEffect(()=>{
  if(type==="T_PRODUCT_KEYWORDS") setIsDiv(true);
}, [type])

  const handleCustomData = (data: any) => {
    setHideSuggestion(true);
    setCustomData(data);
  }

  const [uploadEnabled, setUploadEnabled] = useState<boolean>(false);

  const handleUploadEnable = () => {
    setUploadEnabled(!uploadEnabled)
  }
const commonCss={
  input_container:`w-full border-[var(--input-border-color)] border rounded-[var(--border-radius-sm)] whitespace-nowrap p-2 px-4 text-inherit bg-inherit`,
  input:'flex justify-between items-center'
}
// useEffect(()=>{
//   const updatedIncludeKeywords = includeKeywords.map((keyword) => `${keyword.split(" ").join("_")}`);
//   const updatedExcludeKeywords = excludeKeywords.map((keyword) => `-${keyword.split(" ").join("_")}`);
//       setSelectedEventKeywords([...includeKeywords, ...excludeKeywords]);
// },[includeKeywords, excludeKeywords])
// console.log(enabledFilters.userRating.isRatingEnabled);
// useEffect(()=>{
//   if(last!=="editTracker"){
//   setRatingOpen(enabledFilters?.eventRating?.isRatingEnabled|| false);
//   setExhibitOpen(enabledFilters?.estimatedExhibitScore?.isExhibitorsEnabled|| false);
//   setSelectedLocationsData(enabledFilters?.locationIds?.enabledValue);
//   // setSelectedEventType({...selectedEventType,  business: enabledFilters?.eventType?.enabledValue?.map((item)=> `${item.toLowerCase()}s`) || []});
//   setSelectedEventType({...selectedEventType,  business: enabledFilters?.eventType?.enabledValue?.map((item)=> `${item.toLowerCase()}s`) || []});
//   setIncludeKeywords(enabledFilters?.keywords?.positiveKeywords);
//   setExcludeKeywords(enabledFilters?.keywords?.negativeKeywords);
//   setSelectedVisitors(enabledFilters?.eventSize?.enabledValue || []);
//   setSelectedCategories( enabledFilters?.eventCategory?.enabledValue?.map((item) => item.slug) || []);
  
//   setDateRange({
//     from: enabledFilters?.durations?.startDate
//       ? new Date(enabledFilters.durations.startDate.split(",")[0])
//       : undefined,
//     to: enabledFilters?.durations?.startDate
//       ? new Date(enabledFilters.durations.startDate.split(",")[1])
//       : undefined,
//   });
//   setIsMaturity(enabledFilters?.maturity?.isMaturityEnabled||false);
//   setSelectedEventStatus(enabledFilters?.eventStatus?.enabledValue?.map((item)=>item.toLowerCase()) || []);
//   setSelectedEventFrequency(enabledFilters?.eventFrequency?.enabledValue?.map((item)=>item.toLowerCase())|| []);
//   setFreqToggle(enabledFilters?.eventFrequency?.isFreqEnabled || false);
//   setSelectedEntry(enabledFilters?.eventEntry?.enabledValue?.map((item)=>item.toLowerCase()) || []);
//   setSelectedEventFormat(enabledFilters?.eventFormat?.enabledValue || []);
//   setSelectedExhibitScore(enabledFilters?.estimatedExhibitScore?.enabledValue || []);
//   setSelectedUserRatings(enabledFilters?.eventRating?.enabledValue || []);
//   setSelectedBrandedEvent(enabledFilters?.branded?.enabledValue?.eventBrand||false);
//   setSelectedEventSeries(enabledFilters?.branded?.enabledValue?.eventSeries || false);
//   setSelectedMaturity(enabledFilters?.maturity?.enabledValue?.[0] || "" || "");
//   setIsBrand(enabledFilters?.branded?.isBrandedEnabled|| false);
//   setForecastedStatus(enabledFilters?.isForecasted?.isForecastedEnabled || false);
//   setAnalyticsToggles({
//     ...analyticsToggles,
//     globalToggle: enabledFilters?.analytics?.isAnalyticsEnabled?true:false,
//   });
//   setAudienceZone(enabledFilters?.audienceZone?.isZoneEnabled || false);
//   }
  
// },[enabledFilters])
// console.log(template?.inputAreas[0]?.placeholder);
const generateDynamicString = (item: any) => {
  if(Array.isArray(item)){
    return `${item[0]} (${item[1]})`;
  }else return item;
};
const [includeKeyword, setIncludeKeyword] = useState<{ "Include Keywords": string }[]>([]);
const [excludeKeyword, setExcludeKeyword] = useState<{ "Exclude Keywords": string }[]>([]);

useEffect(() => {
  if (type === "T_PRODUCT_KEYWORDS") {
      const keywordData = getLocalFilterValue("excludeKeywords")?.toString()?.split(",")?.filter(keyword => keyword.trim() !== "");
      const updatedData = keywordData.map(item => ({ "Exclude Keywords": item }));
      console.log(updatedData);
      setLocalFilter("excludeKeywords", keywordData.join(","));
      setExcludeKeyword(updatedData);
  }
}, [getLocalFilterValue("excludeKeywords")]);
useEffect(()=>{
  if (type === "T_PRODUCT_KEYWORDS") {
      const keywordData = getLocalFilterValue("includeKeywords")?.toString()?.split(",")?.filter(keyword => keyword.trim() !== "");
      const updatedData = keywordData.map(item => ({ "Include Keywords": item }));
      setIncludeKeyword(updatedData);
  }
},[getLocalFilterValue("includeKeywords")])
return (
  <>
  <div>{isLoading?<Loading/>:
  <>
  <div
    className="flex fixed z-[5] w-[calc(100vw-134px)] mt-[36px] pt-4 bg-[var(--primary-foreground)]"
    style={{ marginTop: pathName[pathName.length - 1] === "create" ? "0px" : "36px", zIndex:'5' }}
  >
    <div className="flex first-line items-center justify-between w-[100%] bg-[var(--heading-background-color)] p-3">
    <div className="flex items-center gap-2">
      <div>
        <Image src={userOne} alt="userOne" />
      </div>
      <div>
        <div className="text-[var(--primary-color)] font-bold text-lg">{last==="editTracker"?"Edit":"Create"} {template && <span>{template.templateName}</span>} Tracker</div>
        <div className="text-sm text-[var(--secondary-text-color)]">
          Select from the available data filters to {last==="editTracker"?"edit":"create"} a tracker
        </div>
      </div>
    </div>

    <div className="flex gap-3">
      <Link
        href={
          last === "create"
            ? "/internal/trackers?showTemplates=true"
            : `/internal/trackers/${pathName[pathName.length - 2]
            }/trackedConfiguration?type=${type}`
        }
        style={{ display: "flex" }}
      >
        {/* <button className={styles.cancel}>Cancel</button> */}
        <Button variant="outline" className="text-[var(--primary-color)] hover:text-[var(--primary-color)] w-[100px]">Cancel</Button>
      </Link>
      {/* <button className={styles.save} onClick={saveTrackerHandler}>
        Save Tracker
      </button> */}
      <Button className="text-white w-[100px]" onClick={saveTrackerHandler}>Save</Button>
    </div>
    </div>
  </div>
  <div ref={scrollableDivRef} className="flex flex-col gap-6 w-[calc(100vw-134px)]" style={{ marginTop: pathName[pathName.length - 1] === "create" ? "104px" : "140px" }}>
    {/* <div className='fixed top-0 w-[calc(100vw-134px)] bg-[var(--primary-foreground)] h-[224px]' style={{ height: pathName[pathName.length - 1] === "create" ? "124px" : "224px", zIndex:"3"}}></div> */}
    <div
      className="px-6 py-1 w-full border border-[var(--input-border-color)] rounded-[var(--border-radius-sm)]"
      style={{
        border:
          isMandatory && trackerName.length === 0 ? "1px solid var(--danger-text-color)" : "",
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

    
    {((template && template.inputAreas) || type==="T_PRODUCT_KEYWORDS") &&
    <div style={{display: 'flex', gap: '25px'}}>
      <div className={`card ${styles.competitor}`}>
        {/* <div className={styles.competitorHead}>
          <div className={styles.competitorHeading}>Upload custom data </div>
          {template?.type !== "enabled" && <div className={styles.badgeSuccess}>Comming Soon</div>}
        </div> */}
        <div className={styles.bar}></div>
        <div>
        <div className="flex items-center text-[#0062D1] mb-4 font-[var(--font-weight-regular)] leading-[var(--line-height-small)]" style={{fontSize:"var(--font-size-small)"}}>
          <InformationFill style={{marginBottom: "3px"}} color="var(--info-text-color)" height="12px" />
          {" "} Please upload or manually enter the information
        </div>
        {type==="T_PRODUCT_KEYWORDS" && 
          <ProductSelector type="T_PRODUCT_KEYWORDS" fetchAISuggestion={fetchAISuggestion} suggestions={suggestions} hideSuggestion={hideSuggestion} setHideSuggestion={setHideSuggestion}/>
        }
        {((type==="T_COMPETITOR" || type==="T_SPEAKING_OPPORTUNITY" || type === "T_PEOPLE_FINDER" || type === "T_CUSTOMER_ICP" || type==="T_PRODUCT_KEYWORDS") && template) ?
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
        {(template?.inputAreas || type==="T_PRODUCT_KEYWORDS") &&
                <div>
                {type!=="T_PRODUCT_KEYWORDS"&&
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
                           {(eventSearchLoader && inputValues[0]?.length>0)? (
                    <div className={styles.loader}></div>
                    ) : (
                      inputValues[0]?.length > 0 ? (
                      <Image src={CloseIcon} alt="close" className={iconClass} style={{cursor:"pointer"}} onClick={()=>{setInputValues(prevValues => ({
                      ...prevValues,
                      [index]: ""
                      }))}} />
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
        {(type === "T_COMPETITOR" || type === "T_CUSTOMER_ICP") && inputValues[0]?.length > 0  &&
         <SearchBar searchInput={inputValues[0]} setEventSearchLoader={setEventSearchLoader} handleSelect={addCompany} endpoint={'company/suggestion'} type={type}/>
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
              <div style={{ color: "var(--danger-text-color)", fontSize:"var(--font-size-small)", marginTop:"2px" }}>Enter valid input</div>
            )}
            {(suggestions && suggestions.length > 0 && type!=="T_PRODUCT_KEYWORDS") &&
              <div className="p-4 bg-[var(--primary-foreground)] border border-border-color rounded-sm mt-3 w-full" >
                <div className="text-sm font-[var(--font-weight-medium)] text-[var(--secondary-text-color)] flex gap-1.5 mb-3 items-center">
                  {/* <Image src={AiIcon} alt="AI" className={iconClass} width={14} height={14} /> */}
                  AI SUGGESTIONS {" "}
                  <span className={styles.experimental_tag} >Beta</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((item: any, ind: number)=>(
                      <div key={ind} className={styles.suggestion_badge} onClick={()=>addCompany(0, item)} >{generateDynamicString(item)}</div>
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
              <div style={{textAlign: 'center'}}>
                <div style={{position: 'relative', color: 'var(--secondary-text-color)'}}>
                  <div style={{borderBottom: '1px solid var(--border-color)', margin: '36px 0'}}></div>
                  <span className="absolute text-[10px] -top-1.5 bg-[var(--background-secondary-color)] px-2 font-semibold">OR</span>
                </div>
                <div className="flex justify-center items-center h-[140px] border border-dashed rounded-[18px] bg-primary-foreground border-[var(--border-color)]">
                  <Button
                    className="text-white gap-1"
                    size="sm"
                    onClick={handleUploadEnable}
                      disabled={!template?.isUploadEnable}
                  >
                    <Share style={{marginBottom: "3px", color: "white"}} height="15px" width="15px" />
                    {" "}Upload
                  </Button>
                </div>
              </div>
              {/* } */}
          </div>
        }
      </div>
      <div className={`card ${styles.competitor}`} >
        <div className="flex items-center text-[#0062D1] font-[var(--font-weight-regular)] mb-4 leading-[var(--line-height-small)]" style={{fontSize:"var(--font-size-small)"}}>
          <InformationFill style={{marginBottom: "3px"}} color="var(--info-text-color)" height="12px" />
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
        {(type==="T_PRODUCT_KEYWORDS") &&
        <Tabs defaultValue="include" onValueChange={(value) => setActiveTab(value as "include" | "exclude")} className="pb-2">
        {(getLocalFilterValue("includeKeywords").length > 0 || getLocalFilterValue("excludeKeywords").length >0)&&
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="include">
            Include
            {/* Display count if there are included keywords */}
          </TabsTrigger>
          <TabsTrigger value="exclude">
            Exclude
            {/* Display count if there are excluded keywords */}
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
            <div className={styles.emptyTableText} style={{maxWidth: '220px', padding: '0', fontWeight: 'unset'}}>Please upload or manually enter the information</div>
          </div>
  )}
</TabsContent>

       
        <TabsContent value="exclude" className="mt-0">
        {excludeKeyword.length>0 ?
          <TemplateTable
            customData={excludeKeyword}
            handleCustomData={handleCustomData}
            presetName={selectedPresetName}
          />:
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
         <div className={styles.emptyTableText} style={{maxWidth: '220px', padding: '0', fontWeight: 'unset'}}>Please upload or manually enter the information</div>
       </div>
        }
        </TabsContent>
      </Tabs>
        }
        {/* {(customData && customData.length >0)?
          <TemplateTable customData={customData} handleCustomData={handleCustomData} presetName={selectedPresetName} /> 
          :          
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
            <div className={styles.emptyTableText} style={{maxWidth: '220px', padding: '0', fontWeight: 'unset'}}>Please upload or manually enter the information</div>
          </div>
        } */}
      </div>
    </div>
    }
   {
   <div className={`${type !== "CUSTOM" ? `card ${styles.hiddenFiltersOuterContainer}` : ""}`} >
    {type !== "CUSTOM" &&
    <div className={`${styles.hiddenFilters}`} onClick={()=>setOpend(!opend)} style={{cursor:"pointer"}}>
    <div className={styles.hiddenFiltersInnerDiv}>
    {/* <Plus style={{width:"16px", height:"16px"}} className="icons"/> */}
    <div className={styles.hiddenFilterHeading}>Additional filters</div>
    </div>
    <div><ChevronDown className="icons"/></div>
    </div>
    }
  {(type==="CUSTOM" || opend )&&
    <Suspense fallback={<Loading />}>
    <div className={styles.container}>
      <div className={styles.sub_container}>
        <div className="grid grid-cols-5 gap-3">
          <EventTypeSelector/>
          <CategorySelector/>
          <EventFormatSelector/>
          <LocationSelector isMandatory={isMandatory}/>
          {/* <LocationSelector/> */}
          <DateRangeSelector/>
          <EventStatusSelector/>
          <EventEntrySelector/>
          <UserRatingSelector/>
        </div>
      </div>
      {showRecentSearches && (
        <RecentSearches setShowRecentSearches={setShowRecentSearches} />
      )}

      {/*   ADVANCE FILTER SECTION */}

          <Tabs
           defaultValue="list"
           value={selectedAdvancedView}
           onValueChange={handleTabChange}
          >
            <div className="flex justify-center my-6">
            <div className="flex justify-center">
                <TabsList className="w-[570px] grid grid-cols-3 h-auto">
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
                    <MaturitySelector/>
                    <GlobalAndTouringSelector/>
                    <ForecastedStatusSelector/>
                    <FrequencySelector/>
                    {type !== "T_PRODUCT_KEYWORDS" &&
                    <ProductSelector/>
                    }
                  </div>
                </TabsContent>
                <TabsContent value="insightsAndScores">
                  <div className={cn("grid grid-cols-5 gap-3 pb-6", { "grid-cols-4": isEventeli,})}>
                  <EstimatedVisitorsSelector/>
                  {!isEventeli && (
                  <EstimatedExhibitorsSelector/>
                  )}
                  <EventAnalyticsSelector/>
                  <EstimatedEconomicImpactSelector/>
                  <EventRankingSelector/>
                  </div>
                </TabsContent>
                <TabsContent value="audienceIntel">
                  <div className={cn("grid grid-cols-5 gap-3 pb-6", {"grid-cols-4": isEventeli,})}>
                    <AudienceQualitySelector />
                    <ExhibitorQualitySelector />
                    <AudienceZoneSelector/>
                    <AudienceProfileSelector/>
                    <AudienceSpreadSelector/>
                    </div>
                </TabsContent>
          </Tabs>
    </div>
  </Suspense>
    }
   
  </div>
    }
      {(type && ["T_COMPETITOR", "T_PRODUCT_KEYWORDS", "T_SPEAKING_OPPORTUNITY"].includes(type)) &&
        <Presets template={template} handlePresetClick={handlePresetClick} /> 
      }
  </div>
  </>
  }</div>
  
  </>
);
};

export default Pages;