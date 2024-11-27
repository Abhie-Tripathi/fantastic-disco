"use client";
import styles from "./filters.style.module.css";
import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
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
import { useTheme } from "@/context";
import { GAEvent } from "@/utils/GAEvent";
import SearchBar from "../../searchBar/SearchBar";
import CsvUploader from "./csvUploader";
import FrequencySelector from "@/components/search/advancedFilters/frequency";
import ForecastedStatusSelector from "@/components/search/advancedFilters/forecastedStatus";
import EventAnalyticsSelector from "@/components/advancedFilters/eventAnalytics";
import EventRankingSelector from "@/components/search/advancedFilters/eventRanking";
import AudienceZoneSelector from "@/components/search/advancedFilters/audienceZone";
import AudienceQualitySelector from "@/components/advancedFilters/audienceQualityScore";
import trackerEmptyTable from "/public/internal/trackerEmptyTable.svg";
import { suggestionGenerator } from "@/utils/openAI";
import {Tracker, Toggle} from '@/types/trackers'
import ExhibitorQualitySelector from "@/components/advancedFilters/exhibitorQualityScore";
import { useTrackerContext } from "@/context/tracker";
import { Designations } from "@/types/misc";
import { newCategories } from "@/data/categories";
import kewwordPresetJson from "@/public/data/presetJson/keyword.json"
import competitorPresetJson from "@/public/data/presetJson/competitor.json"
type EventGroupType = "social" | "business";
interface InputArea {
  type: string;
  placeholder: string;
}
export interface LocationItem {
  id: string;
  description: string | undefined;
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
    id: 5,
    img: Speaking,
    url: "T_SPEAKING_OPPORTUNITY",
    trackerName: "Artificial Intelligence Speakers",
    content: "This list of Artificial Intelligence speakers, pioneering innovation and attracting attention with compelling talks.",
    data: top10Speakers,
    enabled: false,
    presetType: 'All',
  },
  {
    id: 6,
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
  }
]

const formatText = (val: string) => {
  if(val) {
    return val?.charAt(0).toUpperCase() + val?.substring(1).toLowerCase();
  }
}

const Pages = () => {
  const searchParams = useSearchParams();
  const {data: editData, setEditTrue, setData: setEditData} = useTrackerContext();
  interface SelectedLocation {
    [id: string]: string;
  }
  const [presetTemplateData, setPresetTemplateData] = useState<PresetJsonData[]>([])
  const {getTrackerDetail,createTracker,editTracker, error}=useTrackerServices();
  const [isRatingOpen, setRatingOpen] = useState<boolean>(false);
  const [isExhibitOpen, setExhibitOpen] = useState<boolean>(false);
  const [isSpreadOpen, setSpreadOpen] = useState<boolean>(false);
  const { theme } = useTheme();
  const type = searchParams.get('type');
  const [selectedLocationsData,setSelectedLocationsData]=useState<any>();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [selectedCity, setSelectedCity] = useState<SelectedLocation>({});
  const [selectedCountry, setSelectedCountry] = useState<SelectedLocation>({});
  const [opend,setOpend]=useState(false);
  const pathName = usePathname().split("/");
  const last = pathName[pathName.length - 1];
  const router = useRouter();
  const [selectedView, setSelectedView] = useState("list");
  const [categoryData, setCatgeoryData] = useState<CategoryData>();
  const [designationData,setDesignationData]=useState([]);
  const [selectedRegularity, setSelectedRegularity] = useState([0, 100]);
  const [includeKeywords, setIncludeKeywords] = useState<string[] | undefined>([]);
  const [excludeKeywords, setExcludeKeywords] = useState<string[] | undefined>([]);
  const [selectedVisitors, setSelectedVisitors] = useState<string[]>([]);
  const [selectedReputationScore, setSelectedReputationScore] = useState([0, 100]);
  const [websiteSuggestion, setWebsiteSuggestion]=useState(null);
  // const [categorySlug, setCategorySlug] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [eventData, setEventData] = useState<EventDataType | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<
  Record<EventGroupType, string[]>
>({
  social: [],
  business: [],
});
  const [selectedEventTypeName, setSelectedEventTypeName] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",") || []
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
    from: undefined,
    to: undefined,
  });
  const [selectedEventStatus, setSelectedEventStatus] = useState<string[]>(
    searchParams.get("status")?.split(",") || []
  );
  const [selectedEventAttendanceRange, setSelectedEventAttendanceRange] =
    useState<string[]>([]);
  const [selectedEventFrequency, setSelectedEventFrequency] = useState<
    string[]
  >(searchParams.get("frequency")?.split(",") || []);
  const [freqToggle,setFreqToggle]=useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<string[]>(
    searchParams.get("entry")?.split(",") || []
  );
  const [selectedEventRanking, setSelectedEventRanking] = useState<string[]>(
    searchParams.get("rank")?.split(",") || []
  );
  const [selectedEventFormat, setSelectedEventFormat] = useState<string[]>(
    searchParams.get("format")?.split(",") || []
  );
  const [selectedExhibitScore, setSelectedExhibitScore] = useState<string[]>(
    searchParams.get("exhibit")?.split(",") || []
  );
  const [selectedUserRatings, setSelectedUserRatings] = useState<string[]>(
    searchParams.get("rating")?.split(",") || []
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
  const [showAdvanceFilter, setShowAdvanceFilter] = useState(true);
  const [selectedAdvFilter, setSelectedAdvFilter] = useState("AP");
  const [selectedBrandedEvent, setSelectedBrandedEvent] = useState(false);
  const [selectedEventSeries, setSelectedEventSeries] = useState(false);
  const [selectedReptScore, setSelectedReptScore] = useState(0);
  const [selectedMaturity, setSelectedMaturity] = useState<string>('');
  const [isMaturity,setIsMaturity]=useState<boolean>(false);
  const [isBrand,setIsBrand]=useState<boolean>(false);
  const [maturity, setMaturity] = useState<string | null>();
  const [intScore, setIntScore] = useState<string | null>();
  // const [selectedInboundScore, setSelectedInboundScore] = useState(0);
  const [selectedEventKeywords, setSelectedEventKeywords] = useState<string[]>(
    searchParams.get("eventKeywords")?.split(",") || []
  );
  const [customData, setCustomData] = useState<any[]>([]);
  const [selectedEventEdition, setSelectedEventEdition] = useState(0);
  const [selectedINScore, setSelectedINScore] = useState(0);
  const [add, setAdd] = useState(false);
  const [forecastedStatus, setForecastedStatus] = useState(false);

  const [analyticsToggles, setAnalyticsToggles] = useState({
    impactScore: false,
    inboundScore: false,
    internationalScore: false,
    globalToggle: false,
  });

  const [selectedImpactScore, setSelectedImpactScore] = useState<[number,number]>([0, 100]);
  const [selectedInboundScore, setSelectedInboundScore] = useState<[number, number]>([0, 100]);
  const [selectedInternationalScore, setSelectedInternationalScore] = useState<[number,number]>([0, 100]);

  const [audienceZone, setAudienceZone] = useState<boolean>(false);
  const [audienceSpread, setAudienceSpread] = useState<boolean>(false);
  const [selectedRank, setSelectedRank] = useState<string>('');
  const [selectedCountries, setSelectedCountries] = useState<any>([]);
  const [selectedAudProfile, setSelectedAudProfile] = useState<string[]>([]);

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
  // const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [categorySlug, setCategorySlug] = useState<string[]>(
    searchParams.get("categories")?.split(",") || []
  );
  // const [editData, setEditData] = useState<EditData | null>(null);
  useEffect(() => {
    setPresetTemplateData([...staticPresetData, ...kewwordPresetJson, ...competitorPresetJson])
  }, []);

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
    const fetchAISuggestion = async (val: any) => {
      try{
        const promptText = `List only name of top 5 companies similar to ${val}. Response should be in plain JSON format without any additional formatting or text: {"data": ["company name 1","company name 2","company name 3","company name 4","company name 5"]}. Do not show example values. If no company name found then return in below format: {\"data\": []}`;
        let aiResponse: any = await suggestionGenerator(promptText);
        let temp = JSON.parse(aiResponse.choices[0].message.content);  
        if(temp && temp?.data && Array.isArray(temp.data) && temp?.data?.length > 0)
          setSuggestions(temp.data);
      } catch (err) {
        console.error("Fetch failed:", err);
        setSuggestions([]);
      }
    }  

    if (type === "T_COMPETITOR" || type === "T_CUSTOMER_ICP") {
      if(customData.length > 0 && Object.values(customData[0])[0]) {
        fetchAISuggestion(Object.values(customData[0])[0]);
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
      const speakerName = customData.map((item: {}) => Object.values(item)[0]).join(',');
      const speakerCompany = customData.map((item: {}) => Object.values(item)[1]).join(',');
      setSpeakerName(speakerName);
      setSpeakerCompany(speakerCompany);
      // console.log(speakerName, speakerCompany);

    }
    else if (type === "T_PEOPLE_FINDER") {
      setUserName(customData.map((item: {}) => Object.values(item)[0]).join(','))
      setUserCompany(customData.map((item: {}) => Object.values(item)[1]).join(','))
    } else if (type === "T_BRAND_BUILDING") {
      const designation = customData.map((item: {}) => Object.values(item)[0]).join(',');
      setDesignations(designation);
    }
  }, [type, customData])

  const handlePresetClick = (id: number, trackerType: string, trackerName: string) => {

    const filteredPresetData = presetTemplateData.filter(item => item.id === id);
    if (trackerType === 'T_COMPETITOR' || trackerType === 'T_SPEAKING_OPPORTUNITY') {
      const presetData: any = [];

      filteredPresetData?.[0]?.data.map((item: any) => {
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
      setIncludeKeywords(filteredPresetData?.[0]?.data?.[0]);
      setExcludeKeywords(filteredPresetData?.[0]?.data?.[1]);
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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
    const categoryIds = categorySlugs.map((slug) => {
      const category = newCategories.find((cat) => cat.slug === slug);
      return category ? category.id : slug;
    });

    const userType = {
      ...(isRatingOpen && { rating: true }),
      ...(isExhibitOpen && { exhibit: true }),
      ...(rankToggles.isTrustScore && {trust:true}),
      ...(isMaturity && {maturity:true}),
      ...(selectedBrandedEvent && {brandedEvent:true}),
      ...(selectedEventSeries && {eventSeries:true}),
      ...(isBrand && {brandSeries:true}),
      ...(forecastedStatus && {forecastedStatus:true}),
      ...(analyticsToggles.impactScore&& {impactScore:true}),
      ...(analyticsToggles.inboundScore&& {inboundScore:true}),
      ...(analyticsToggles.internationalScore&& {internationalScore:true}),
      ...(rankToggles.isEventRank&& {eventRank:true}),
      ...(analyticsToggles.globalToggle && {globalToggle: true}),
      ...(audienceZone && {audienceZone:true}),
      ...(audienceSpread && {audienceSpread:true}),
      ...(freqToggle && {eventFrequency:true}),
    }
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
        ...(selectedEventType?.business?.length > 0 && {
          eventType: selectedEventType.business
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
        ...(includeKeywords && includeKeywords.length>0 &&{
          // includeKeywords: includeKeywords.join(','),
          includeKeywords :includeKeywords.map((kw: string) => kw.replace(/ /g, "_")).join(','),
        }),
        ...(excludeKeywords && excludeKeywords.length>0 &&{
          // excludeKeywords: excludeKeywords.join(','),
          excludeKeywords :excludeKeywords.map((kw: string) => kw.replace(/ /g, "_")).join(','),
        }),
        ...(selectedCategories?.length > 0 && {
          eventCategory: categoryIds.join(","),
        }),
        ...(selectedVisitors?.length>0 && {
          eventSize: selectedVisitors.join(",")
         }),
         ...(selectedExhibitScore?.length>0 && {estimatedExhibitScore:selectedExhibitScore.join(',')}),
         ...(selectedRegularity[0] > 0 && {editionRange: selectedRegularity[0].toString()}),
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
        ...(selectedEventFormat?.length > 0 && {
          eventFormat: selectedEventFormat.join(","),
        }),
        // ...(selectedEventSeries && {eventSeries: selectedEventSeries.toString()}),
        ...(selectedEventStatus?.length > 0 && {
          eventStatus: selectedEventStatus.map((item) => item.toUpperCase()).join(","),
        }),
        ...(selectedEntry?.length > 0 && {
          eventEntry: selectedEntry.join(","),
        }),
        ...(selectedTrustScore[0] > 0 && {
          trustScore: selectedTrustScore[0].toString(),
        }),
        ...(selectedEventFrequency?.length > 0 && {
          eventFrequency: selectedEventFrequency.map((item)=>item[0].toUpperCase()+item.slice(1)).join(","),
        }),
        ...(selectedReptScore > 0 && {
          reputationScore: selectedReptScore.toString(),
        }),
        // ...(selectedMaturity > 0 && { maturity: selectedMaturity.toString() }),
        // ...(selectedDateRange?.length === 2 && selectedDateRange[0]!==null && selectedDateRange[1]!==null && {
        //   startDate: [
        //     new Date(selectedDateRange[0]).toISOString().split("T")[0],
        //     new Date(selectedDateRange[1]).toISOString().split("T")[0],
        //   ].join(","),
        // }),
        ...(dateRange?.from && dateRange?.to && {
          startDate: [
            dateRange.from.toLocaleDateString("en-CA"),
            dateRange.to.toLocaleDateString("en-CA"),
          ].join(","),
        }),
        ...(dateRange?.from && dateRange?.to && {
          endDate: [
            dateRange.from.toLocaleDateString("en-CA"),
            dateRange.to.toLocaleDateString("en-CA"),
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
        ...(selectedUserRatings?.length > 0 && {
          eventRating: selectedUserRatings.join(","),
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
        ...((selectedMaturity !== '' && selectedMaturity !== 'none') && { maturity: selectedMaturity }),
        ...(analyticsToggles.globalToggle && {
          eventImpactScore: selectedImpactScore.join("-")
         }),
        ...(analyticsToggles.globalToggle && {
          inboundScore: selectedInboundScore.join("-")
        }),
        ...(analyticsToggles.globalToggle && {
          internationalScore: selectedInternationalScore.join("-")
        }),
        ...(forecastedStatus && {
          isforecasted: forecastedStatus.toString()
        }),
        // ...(selectedBrandedEvent && {eventBrand:selectedBrandedEvent.toString()}),
        ...((selectedRank !== '' && selectedRank !== 'none') && {
          // globalRanking: selectedRank,
          // categoryRanking: selectedRank,
          // countryRanking: selectedRank,
          eventRanking: selectedRank,
        }),
        ...(selectedCountries?.length > 0 && {
          audienceSpread: selectedCountries.join(",")
         }),
         ...(selectedAudProfile.length > 0 && {
          designation: selectedAudProfile.join(","),
        }),
        ...{shows: ['eventBrand', 'eventSeries', 'maturity', 'eventImpactScore', 'inboundScore', 'internationalScore', 'isforecasted', 'trustScore', 'eventRating', 'estimatedExhibitScore', 'audienceSpread', 'eventFrequency'].join()}
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
   

      const secondLast = pathName[pathName.length - 2];
     
      if(type==="T_PRODUCT_KEYWORDS" && (trackerName.length === 0 ||(includeKeywords?.length==0 && excludeKeywords?.length===0))){
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
        !selectedLocationsData || 
        selectedLocationsData.length === 0 || 
        trackerName.trim().length === 0 
      )) {
        console.log("Please, Fill all the details");
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      if (last === "editTracker") {
      try{
        const data = await editTracker(secondLast, formData);
        if (data) {
          console.log(data);
          router.replace(`/internal/trackers/${secondLast}/trackedConfiguration?type=${type}`);
        } else {
          console.log(error);
          setIsCreating(false);
        }
      }catch(error){
        console.log(error);
        setIsCreating(false);
      }
    } else {
      try{
        const data= await createTracker(formData)
        if (error) {
          console.log(error);
          setIsCreating(false);
          return;
        }
        if (data) {  
          router.replace("/internal/trackers");
        }
      }catch(error){
        console.log(error);
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
  console.log(categoryData);

  useEffect(() => {
    if (editData && editData?.tracker && last === "editTracker") {
      const newArr: string[] = [
        ...(categoryData?.attendedCategories ?? []),
        ...(categoryData?.nonAttendedCategories ?? []),
        ...(categoryData?.unscheduledCategories ?? []),
      ];
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
      setRatingOpen(toggleOpend?.rating ? true : false);
      setIsMaturity(toggleOpend?.maturity ? true : false);
      setExhibitOpen(toggleOpend?.exhibit ?true:false)
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
      
      if(editData?.tracker?.filterValue?.eventImpactScore && editData?.tracker?.filterValue?.eventImpactScore !== "")
        setSelectedImpactScore(editData?.tracker?.filterValue?.eventImpactScore?.split("-"));

      if(editData?.tracker?.filterValue?.internationalScore && editData?.tracker?.filterValue?.internationalScore !== "")
        setSelectedInternationalScore(editData?.tracker?.filterValue?.internationalScore?.split("-"));

      if(editData?.tracker?.filterValue?.maturity && editData?.tracker?.filterValue?.maturity !== '')
        setSelectedMaturity(editData?.tracker?.filterValue?.maturity)

      if(editData?.tracker?.filterValue?.eventRanking && editData?.tracker?.filterValue?.eventRanking !== '')
        setSelectedRank(editData?.tracker?.filterValue?.eventRanking)

      setAudienceZone(toggleOpend?.audienceZone ? true : false);
      setAudienceSpread(toggleOpend?.audienceSpread ? true : false);

      setSelectedCountries(editData.tracker.filterValue?.audienceSpread ? editData.tracker.filterValue?.audienceSpread?.split(",") : []);
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
        setSelectedCategories(
          categorySlugs?.length > 0
            ? categorySlugs
            : []
        );
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
      setDateRange({
        to: editData?.tracker?.filterValue?.startDate
          ? new Date(editData.tracker.filterValue.startDate.split(",")[1])
          : undefined,
        from: editData?.tracker?.filterValue?.startDate
          ? new Date(editData.tracker.filterValue.startDate.split(",")[0])
          : undefined
      });
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

      console.log(selectedLocations);
      
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
      setSelectedEntry(
        editData.tracker.filterValue?.eventEntry &&
          editData.tracker.filterValue?.eventEntry?.length !== 0
          ? editData.tracker.filterValue?.eventEntry?.split(",")
          : []
      );
      setSelectedEventEdition(
        editData.tracker.filterValue?.editionRange > 0
          ? editData.tracker.filterValue?.editionRange
          : 0
      );
      setSelectedEventRanking(
        editData.tracker.filterValue?.eventRanking?.split(",") || []
      );
      setSelectedBrandedEvent(toggleOpend?.brandedEvent ? true : false);
      setIsBrand(toggleOpend?.brandSeries ? true : false);
      // setSelectedCountry(
      //   editData.tracker.filterValue?.eventCountry?.length > 0
      //     ? editData.tracker.filterValue.eventCountry.reduce(
      //       (acc: any, current: any) => {
      //         return { ...acc, ...current };
      //       },
      //       {}
      //     )
      //     : {}
      // );
      setSelectedZone(editData.tracker.filterValue?.eventRegion && editData.tracker.filterValue?.eventRegion?.length > 0 ? editData.tracker.filterValue?.eventRegion?.split(',') : []);
      // setSelectedCity(
      //   editData.tracker.filterValue?.eventCity?.length > 0
      //     ? editData.tracker.filterValue.eventCity.reduce(
      //       (acc: any, current: any) => {
      //         return { ...acc, ...current };
      //       },
      //       {}
      //     )
      //     : {}
      // );
      setSelectedEventSeries(
        toggleOpend?.eventSeries ? true : false
      );
      setMaturity(
        editData.tracker.filterValue?.maturity?.length > 0
          ? editData.tracker.filterValue?.maturity
          : ""
      );
      setSelectedEventRank(editData.tracker.filterValue?.eventRank?.length > 0
        ? editData.tracker.filterValue?.eventRank?.split(',')
        : [0, 100]);
      setSelectedLocalRank(editData.tracker.filterValue?.localRank?.length > 0
        ? editData.tracker.filterValue?.localRank?.split(',')
        : [0, 100])
      setSelectedReptScore(
        editData.tracker.filterValue?.reputationScore > 0
          ? editData.tracker.filterValue?.reputationScore
          : 0
      );
      // setSelectedMaturity(
      //   editData.tracker.filterValue?.maturity > 0
      //     ? editData.tracker.filterValue?.maturity
      //     : 0
      // );
      if (editData?.tracker?.filterValue?.eventType !== undefined) {
        const eventTypes = editData.tracker.filterValue.eventType.map((type:string) => {
          return type.charAt(0).toLowerCase() + type.slice(1) + 's';
        });
    
        if (Array.isArray(eventTypes) && eventTypes.length > 0) {
          setSelectedEventType((prev) => ({
            ...prev,
            business: [...prev.business, ...eventTypes],
          }));
    
            const selectedEventTypeNames = EventStatusData
                ?.filter(item => eventTypes.includes(item.id))
                .map(item => item.name) || [];
            setSelectedEventTypeName(selectedEventTypeNames[0] || "Default Event Name");
        }
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
      setSelectedVisitors(
        editData.tracker.filterValue?.eventSize &&
          editData.tracker.filterValue?.eventSize?.length !== 0
          ? editData.tracker.filterValue?.eventSize?.split(",")
          : []
      );
      setSelectedExhibitScore(
        editData.tracker.filterValue?.estimatedExhibitScore &&
          editData.tracker.filterValue?.estimatedExhibitScore?.length !== 0
          ? editData.tracker.filterValue?.estimatedExhibitScore?.split(",")
          : []
      )
      const updatedRegularity = [...selectedRegularity];
      updatedRegularity[0] = editData.tracker.filterValue?.editionRange > 0 ? editData.tracker.filterValue?.editionRange : 0;
      setDesignationData(editData?.tracker?.filterValue?.designation
      )
      setSelectedRegularity(updatedRegularity);
      const updatedTrustScore=[...selectedTrustScore]
      updatedTrustScore[0]=
        editData.tracker.filterValue?.trustScore > 0
          ? editData.tracker.filterValue?.trustScore
          : 0;
        setSelectedTrustScore(updatedTrustScore)
      // setCategorySlug(editData.tracker.filterValue?.category?.split(',') || [])
      // setSelectedLocations(editData.tracker.filterValue?.location);
      setIncludeKeywords(
        editData.tracker.filterValue?.includeKeywords &&
        editData.tracker.filterValue?.includeKeywords.split(",").length > 0
            ? editData.tracker.filterValue.includeKeywords.split(",").filter(Boolean).map((kw: string) => kw.replace(/_/g, " "))
            : []
    );    
      setExcludeKeywords(editData.tracker.filterValue?.excludeKeywords &&
        editData.tracker.filterValue?.excludeKeywords.split(",").length > 0
            ? editData.tracker.filterValue.excludeKeywords.split(",").filter(Boolean).map((kw: string) => kw.replace(/_/g, " "))
            : []),
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
  }, [editData]);

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
const addCompany = (id:number,val: string) => {
  setSelected(true);
  setInputValues(prevValues => ({
    ...prevValues,
    [0]: val
  }));
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
useEffect(() => {
  console.log('Selected Aviation Rank:', selectedInternationalScore);
}, [selectedInternationalScore]);
// useEffect(()=>{
//   const updatedIncludeKeywords = includeKeywords.map((keyword) => `${keyword.split(" ").join("_")}`);
//   const updatedExcludeKeywords = excludeKeywords.map((keyword) => `-${keyword.split(" ").join("_")}`);
//       setSelectedEventKeywords([...includeKeywords, ...excludeKeywords]);
// },[includeKeywords, excludeKeywords])

return (
  <>
  <div>{isLoading?<Loading/>:
  <>
  <div
    className="flex fixed w-[calc(100vw-134px)] mt-[54px] items-center justify-between bg-[var(--heading-background-color)] p-3"
    style={{ marginTop: pathName[pathName.length - 1] === "create" ? "0px" : "54px", zIndex:'5' }}
  >
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
            ? "/internal/trackers"
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
      <Button className="text-white" onClick={saveTrackerHandler}>Save Tracker</Button>
    </div>
  </div>
  <div className="flex flex-col gap-6 w-[calc(100vw-134px)]" style={{ marginTop: pathName[pathName.length - 1] === "create" ? "94px" : "140px" }}>
    <div className='fixed top-0 w-[calc(100vw-134px)] bg-[var(--primary-foreground)] h-[224px]' style={{ height: pathName[pathName.length - 1] === "create" ? "124px" : "224px", zIndex:"3"}}></div>
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
    {type==="T_PRODUCT_KEYWORDS" &&
    <div className={`card flex flex-col gap-6`} style={{gap:"var(--spacing-lg)", borderRadius:"var(--border-radius-sm)", boxShadow:"none"}}>
      <div>
      <div className="mb-4">{template?.description}
        <Button
          className={styles.uploadBtn}
          style={{ color: "white", float: "right", gap:"4px"}}
          size="sm"
          onClick={handleUploadEnable}
        >
          <Share style={{marginBottom: "3px", color: "white", display:"flex", gap:"4px"}} height="15px" width="15px" />
          {" "}Upload
        </Button>
      </div>
      {/* <div className={`${styles.toggleDiv}`}>
          <div className={`${styles.manualDiv}`} style={{ padding: "10px" }}>
            <div>
              <div className={styles.manualHeading}>Add data manually
              </div>
              <div className={styles.manualSubHeading}>Manually enter your custom fields to ensure all your information is personalized and accurate.</div>
            </div>
            <div>

              <span>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={true}
                  />
                  <span className={styles.slider}></span>
                </label>
              </span>

            </div>
          </div>
          <div className={`${styles.manualDiv}`} style={{ padding: "10px" }}>
            <div>
              <div className={styles.manualHeading}>Import CSV Data
                <div className={styles.badgeSuccess}>Coming Soon</div>
              </div>
              <div className={styles.manualSubHeading}>Upload your CSV file to quickly import and organize your data accurately.</div>
            </div>
            <div>

              <span>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={selectedExhibitScore.length !== 0}
                  />
                  <span className={styles.slider}></span>
                </label>
              </span>

            </div>
          </div>
        </div> */}
      </div>
      {template && uploadEnabled && 
        <CsvUploader
          templateData={template}
          customData={customData}
          handleCustomData={handleCustomData}
          setUploadEnabled={setUploadEnabled}
          setIncludeKeywords={setIncludeKeywords}
          setExcludeKeywords={setExcludeKeywords}
          // setSelectedEventKeywords={setSelectedEventKeywords}
        />
      }
    <div style={{width:"calc(50% - 5px)"}}>
    {/* <EventKeyword state={selectedEventKeywords}
    setState={setSelectedEventKeywords}
    onClose={close} type={isDiv}
    isMandatory={isMandatory}
    setIsMandatory={setIsMandatory}
    /> */}
    <ProductSelector type="T_PRODUCT_KEYWORDS" source="tracker" includeKeywords={includeKeywords} setIncludeKeywords={setIncludeKeywords} excludeKeywords={excludeKeywords} setExcludeKeywords={setExcludeKeywords}/>
    </div>
    </div>
    }
    
    {template && template.inputAreas &&
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
        {(type==="T_COMPETITOR" || type==="T_SPEAKING_OPPORTUNITY" || type === "T_PEOPLE_FINDER" || type === "T_CUSTOMER_ICP") ?
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
        {template?.inputAreas &&
                <div>
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
                    <div onClick={() => template.type === "enabled" && addNew()} className="flex items-center px-3 cursor-pointer bg-[var(--primary-color)] rounded-[4px] text-white font-medium text-lg"
                      style={{ backgroundColor: template.type !== "enabled" ? "var(--disabled-btn-color)" : "var(--primary-color)" }}
                    >+
                      {/* <Image src={Add} alt="add_Icon" className="w-[15px] h-[15px]" /> */}
                    </div>

                  </div>
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
            {(suggestions && suggestions.length > 0) &&
              <div className="p-4 bg-[var(--primary-foreground)] border border-border-color rounded-sm mt-3 w-full" >
                <div className="text-sm font-[var(--font-weight-medium)] text-[var(--secondary-text-color)] flex gap-1.5 mb-3 items-center">
                  {/* <Image src={AiIcon} alt="AI" className={iconClass} width={14} height={14} /> */}
                  AI SUGGESTIONS {" "}
                  <span className={styles.experimental_tag} >Beta</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((item: string, ind: number)=>(
                    <div key={ind} className={styles.suggestion_badge} onClick={()=>addCompany(0, item)} >{item}</div>
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
        {(customData && customData.length >0) ?
          <TemplateTable customData={customData} handleCustomData={handleCustomData} /> :
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
        }
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
          <EventTypeSelector source="tracker" setSelectedCategories={setSelectedEventType} selectedCategories={selectedEventType}/>
          <CategorySelector  source="tracker"  selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}/>
          <EventFormatSelector source="tracker" selectedStatuses={selectedEventFormat}
                  setSelectedStatuses={setSelectedEventFormat}/>
          <LocationSelector source="tracker" selectedLocation={selectedLocationsData} setSelectedLocation={setSelectedLocationsData} isMandatory={isMandatory}/>
          {/* <LocationSelector/> */}
          <DateRangeSelector source="tracker" dateRange={dateRange} setDateRange={setDateRange}/>
          <EventStatusSelector source="tracker" setSelectedStatuses={setSelectedEventStatus} selectedStatuses={selectedEventStatus}/>
          <EventEntrySelector source="tracker" selectedStatuses={selectedEntry} setSelectedStatuses={setSelectedEntry}/>
          <UserRatingSelector source="tracker" selectedRatings={selectedUserRatings} setSeectedRatings={setSelectedUserRatings} isEnabled={isRatingOpen} setIsEnabled={setRatingOpen}/>
        </div>
      </div>
      {showRecentSearches && (
        <RecentSearches setShowRecentSearches={setShowRecentSearches} />
      )}

      {/*   ADVANCE FILTER SECTION */}

      <div>
        <div
          className="bg-[var(--tabs-background-color)] py-2.5 mx-0 my-6 rounded-[var(--border-radius-lg)] flex items-center justify-center relative"
        >
          <div className="flex items-center">
            <div className={`flex items-center gap-2 ${styles.advanceFilterBtns}`}>
              <button
                onClick={() => setSelectedAdvFilter("AP")}
                className={`${styles.listBtn} ${selectedAdvFilter === "AP" ? styles.active : ""
                  }`}
              >
                Advance Intel
              </button>
              <button
                onClick={() => setSelectedAdvFilter("IS")}
                className={`${styles.listBtn} ${selectedAdvFilter === "IS" ? styles.active : ""
                  }`}
              >
                Insights &#x26; Score
              </button>
              <button
                onClick={() => setSelectedAdvFilter("AI")}
                className={`${styles.listBtn} ${selectedAdvFilter === "AI" ? styles.active : ""
                  }`}
              >
                Audience Intel
              </button>
            </div>
          </div>
        </div>
        
        {/* ADVANCE DETAILS SECTION */}
        {showAdvanceFilter && selectedAdvFilter === "AP" && (
          <div className={styles.inputdropdowns_container}>
              <MaturitySelector source="tracker"      selectedStatus={selectedMaturity}
              setSelectedStatus={setSelectedMaturity}
              isEnabled={isMaturity}
              setIsEnabled={setIsMaturity}
              />
              <GlobalAndTouringSelector source="tracker" selectedBrandedEvent={selectedBrandedEvent}
              setSelectedBrandedEvent={setSelectedBrandedEvent}
              selectedEventSeries={selectedEventSeries}
              setSelectedEventSeries={setSelectedEventSeries}
              isEnabled={isBrand}
              setIsEnabled={setIsBrand}
              />
              <ForecastedStatusSelector source="tracker" isEnabled={forecastedStatus} setIsEnabled={setForecastedStatus}/>
              <FrequencySelector source="tracker" selectedFrequencies={selectedEventFrequency} setSelectedFrequencies={setSelectedEventFrequency} isEnabled={freqToggle} setIsEnabled={setFreqToggle}/>

            {type!=="T_PRODUCT_KEYWORDS" &&
            <ProductSelector source="tracker" includeKeywords={includeKeywords} setIncludeKeywords={setIncludeKeywords} excludeKeywords={excludeKeywords} setExcludeKeywords={setExcludeKeywords}/>
              }



            {/* <MenuTrigger onOpenChange={setMenuOpen}>
            <Button className={styles.disabledBtn}>
              <div className={styles.input_container}>
                <div className={styles.input}>
                  <div className={styles.input_title}>
                    Maturity
                    {selectedMaturity > 0 && (
                      <span className={styles.input_selected_title}>
                        {selectedMaturity}
                      </span>
                    )}
                  </div>
                  <div className={styles.toggle_container}>
                    <span>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          onChange={() => { }}
                          checked={(maturity ?? [])?.length > 0}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </span>
                  </div>
                </div>
              </div>
            </Button>
            <Popover className={styles.filterPopover}>
              <MaturitySlider
                state={selectedMaturity}
                setState={setSelectedMaturity}
              />
            </Popover>
          </MenuTrigger> */}

            {/* <MenuTrigger onOpenChange={setMenuOpen}>
            <Button>
              <div className={styles.input_container}>
                <div className={styles.input}>
                  <div className={styles.input_title}>
                    Event Rankings
                    {selectedEventRanking?.length > 1 ? (
                      <span className={styles.input_selected_no}>
                        {selectedEventRanking.length}
                      </span>
                    ) : (
                      <span className={styles.input_selected_title}>
                        {selectedEventRanking[0]}
                      </span>
                    )}
                  </div>
                  <Image
                    src={DropIcon}
                    alt="dropicon"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            </Button>
            <Popover>
              <Dialog className={styles.noBorder}>
                <EventAdvFilter
                  state={selectedEventRanking}
                  setState={setSelectedEventRanking}
                  data={eventRankData}
                />
              </Dialog>
            </Popover>
          </MenuTrigger> */}
          </div>
        )}

        {/* INSIGHTS AND SCORES */}
        {showAdvanceFilter && selectedAdvFilter === "IS" && (
          <div className={styles.inputdropdowns_container}>
              <EstimatedVisitorsSelector source="tracker" selectedRanges={selectedVisitors} setSelectedRanges={setSelectedVisitors}
              />
              <EstimatedExhibitorsSelector selectedRanges={selectedExhibitScore}
              setSelectedRanges={setSelectedExhibitScore}
              isEnabled={isExhibitOpen}
              setIsEnabled={setExhibitOpen}
              source="tracker"/>
              <EventAnalyticsSelector source="tracker" selectedEventRank={selectedImpactScore}
              setSelectedEventRank={setSelectedImpactScore}
              selectedLocalRank={selectedInboundScore}
              setSelectedLocalRank={setSelectedInboundScore}
              selectedAviationRank={selectedInternationalScore}
              setSelectedAviationRank={setSelectedInternationalScore} 
              rankToggles={analyticsToggles}
              setRankToggles={setAnalyticsToggles}/>
              <EstimatedEconomicImpactSelector/>
              <EventRankingSelector 
              source="tracker"
              selectedTrustScore={selectedTrustScore}
              setSelectedTrustScore={setSelectedTrustScore}
              rankToggles={rankToggles}
              setRankToggles={setRankToggles}
              selectedRank={selectedRank}
              setSelectedRank={setSelectedRank}/>
          </div>
        )}

        {/* AUDIENCE INTEL */}
        {showAdvanceFilter && selectedAdvFilter === "AI" && (
          <div className={styles.inputdropdowns_container_AI}>

          <AudienceQualitySelector/>
          <ExhibitorQualitySelector/>
          <AudienceZoneSelector source="tracker" isEnabled={audienceZone} setIsEnabled={setAudienceZone}/>
          <AudienceProfileSelector source="tracker" 
          designationData={selectedAudProfile}
          setDesignationData={setSelectedAudProfile}/>
          <AudienceSpreadSelector source="tracker" selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}/>

         
          </div>
        )}
      </div>
    </div>
  </Suspense>
    }
   
  </div>
    }
    {(type !== "CUSTOM" && presetTemplateData.filter(item => item.url === template?.name).length > 0) &&
      <div>
          <div className="flex justify-center	gap-2 items-center font-semibold" >
            <span className="text-lg">Get Started with Pre-sets </span>{" "}
            <span className="text-xs bg-[var(--primary-color)] text-white py-[3px] px-2 rounded-full">{presetTemplateData.filter(item => item.url === template?.name).length}</span>
          </div>
          <div className={styles.presetContainer} >
            {presetTemplateData.filter(item => item.url === template?.name).map((item, ind) => (
              <div key={ind} className="w-full p-2 gap-2 flex items-center flex-col h-[300px] text-sm border border-[var(--border-color)] rounded-[12px]" onClick={item.enabled  ?()=>handlePresetClick(item.id, item.url, item.trackerName) : undefined} style={{cursor: item.enabled ? 'pointer' : 'unset'}}>
                <div
                  className="w-full flex items-center h-[45%] rounded-md bg-[var(--tabs-background-color)]"
                >
                  <div className={styles.account}>
                    <Image src={
                      item.url === 'T_COMPETITOR' ? Competitor :
                      item.url === 'T_PRODUCT_KEYWORDS' ? Keywords :
                      item.url === 'T_SPEAKING_OPPORTUNITY' ? Speaking :
                      Keywords} alt="people" />
                  </div>
                  <div>
                    <Image src={Template} alt="template" />
                  </div>
                </div>
                <div className="w-full h-[60%] flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex h-full items-center gap-1">
                      <Image
                        src={Vector1}
                        alt="vector1"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                      <div style={{ color: "#585871", fontSize: "12px" }}>
                        PRE-SET
                      </div>
                    </div>
                    {item.enabled ? 
                      <div className={`${styles.domain}`} >
                        {item.presetType}
                      </div> :
                      <div className="badge_success" style={{fontSize: 'var(--font-size-xs)'}}>
                        Coming Soon
                      </div>
                    }
                  </div>
                  <div className={styles.bottomViewTwo}>
                    {item?.trackerName}
                  </div>
                  <div className={styles.text}>{item?.content}</div>
                </div>
              </div>
            ))}
          </div>
      </div>
    }
  </div>
  </>
  }</div>
  
  </>
);
};

export default Pages;