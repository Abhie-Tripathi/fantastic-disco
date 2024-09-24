"use client";
import styles from "./filters.style.module.css";
import React, { useState, useEffect, Suspense, lazy, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Url from '/public/url.svg'
import CloseIcon from "/public/internal/cross.svg";
import Add from '/public/add_Icon.svg'
import Company from '/public/company_Icon.svg'
import Name from '/public/userName_Icon.svg'
import { convertToCustomFormat, convertToYYYYMMDD } from "@/utils/dateFormat";
import { ChevronDown, Plus } from "geist-icons";
import eventVisitorsData from "../../../../../public/data/eventVisitorsData.json";
// import styles from "./search.module.css";
import { EventDataType } from "@/app/components/types/allevents";
import EventType from "@/app/components/Search/Dropdowns/EventType";
import RegularityEdition from "@/app/components/dropdown/RegularityEdition";
import GlobalTouring from "@/app/components/dropdown/GlobalTouring";
import AudienceQuality from "@/app/components/dropdown/AudienceQuality";
import EventStatusData from "@/public/data/eventType.json";
import userOne from "/public/userOne.svg";
import SearchIcon from "/public/search.svg";
import DropIcon from "/public/internal/drop_down_angle.svg";
import ExportIcon from "/public/internal/ExportIcon.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CategoryDropdown from "@/app/components/dropdown/CategoryDropwdown";
import LabelDropdown from "@/app/components/dropdown/LabelDropdown";
import LocationDropdown from "@/app/components/dropdown/LocationDropdown";
import RecentSearches from "@/app/components/Search/RecentSearches";
import RankInput from "@/app/components/Search/Dropdowns/RankInput";
import EventAttendance from "@/app/components/Search/Dropdowns/EventAttendence";
import EventStatus from "@/app/components/Search/Dropdowns/EventStatus";
import ExportModal from "@/app/components/Search/ExportModal";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import List from "@/app/components/List";
import MaturitySlider from "@/app/components/Search/ui/MaturitySlider";
import IntScoreSlider from "@/app/components/Search/ui/IntScoreSlider";
import Loading from "@/app/components/UI/Loading";
import { searchEvents } from "@/services/eventsService";
import {
  Button,
  Dialog,
  DialogTrigger,
  MenuTrigger,
  Modal,
  ModalOverlay,
  Popover,
} from "react-aria-components";
import { convertISOToOriginalFormat } from "@/utils/date";
import DateRange from "@/app/components/dropdown/DateRange";
import EventAdvFilter from "@/app/components/dropdown/EventAdvFilter";
import EventKeyword from "@/app/components/dropdown/EventKeyword";
import UserRatings from "@/app/components/Search/Dropdowns/UserRatings";
import RangeSlider from "@/app/components/UI/Slider";
import AnalyticsDropdown from "@/app/components/dropdown/AnalyticsDropdown";
// import { MapStyle } from "@/components/Map";
// const Calendar = lazy(() => import("@/components/Calendar"));
// const Map = lazy(() => import("@/components/Map"));

//JSON Data files:
import eventFormatData from "../../../../../public/data/advanceFilterFormat.json";
import eventFrequencyData from "../../../../../public/data/eventFrequency.json";
import eventEntryData from "../../../../../public/data/eventEntry.json";
import eventRankData from "../../../../../public/data/eventRank.json";
import eventExhibitScoreData from "../../../../../public/data/eventExhibitScore.json";
import { useTheme } from "@/context";
import { GAEvent } from "@/utils/GAEvent";
import SearchBar from "../../searchBar/SearchBar";
interface FilterValue {
  labels: string;
  name: string;
  category: any;
  eventFormat: string;
  eventStatus: string;
  eventFrequency: string;
  eventEntry: string;
  eventEdition: any;
  eventRanking: string;
  brandedEvent: boolean;
  trustScore: any;
  eventSeries: boolean;
  reputationScore: any;
  maturity: any;
  internationalScore: any;
  inboundScore: any;
  userRating: string;
  exhibitScore: string;
  total_attendance_gte: any;
  total_attendance_lte: any;
  location: string[];
  startDate: string;
  endDate: string;
  eventRating: string;
  eventRank: any;
  localRank: any;
  eventKeywords: any;
  eventCategory: any;
  editionRange: number;
  eventSize: any;
  eventCity: any;
  eventCountry: any;
  eventRegion: string;
  eventType: string[];
  estimatedExhibitScore: string;
  speakerOrg: string;
  speakerName: string;
  orgWebsite: string;
  orgName:string;
  userType?:Toggle
  userName?:string;
  eventAttendanceRange: any;
}
interface InputArea {
  type: string;
  placeholder: string;
}
interface Toggle{
  rating?:boolean;
  exhibit?:boolean;
  trust?:boolean;
}
interface Template {
  name: string;
  type?: string;
  templateName?: string;
  description?: string | undefined;
  inputAreas?: InputArea[] | undefined;
}
interface CategoryData {
  attendedCategories?: string[];
  nonAttendedCategories?: string[];
  unscheduledCategories?: string[];
}
interface Tracker {
  name: string;
  accessLevel?:string;
  filterValue: FilterValue;
}
interface Cat {
  name: string;
  id: string;
}
interface EditData {
  tracker: Tracker;
}
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
    ]
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
        placeholder: "Add Competitor Name or Website",
        required:true,
      }
    ]
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
    ]

  },
  {
    name: "T_CUSTOMER_ICP",
    templateName: "Customer ICP",
    type: "disabled",
    description: "Input ideal customer profile details like company, location or websites to track their interests",
    inputAreas: [
      {
        img: Company,
        type: "text",
        placeholder: "Company Name",
      },
      {
        img: Url,
        type: "text",
        placeholder: "Url",
      },
      {
        type: "text",
        placeholder: "Location",
      }
    ]
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
    ]
  },
  {
    name: "T_PEOPLE_FINDER",
    templateName: "People Finder",
    type: "disabled",
    description: "Track experts, influencers and where they might be participating in various events",
    inputAreas: [
      {
        img: Name,
        type: "text",
        placeholder: "Name",
      },
      {
        img: Company,
        type: "text",
        placeholder: "Company Name",
      }
    ]
  },
  {
    name: "T_SPEAKING_OPPORTUNITY",
    templateName: "Speaking Opportunity",
    type: "enabled",
    description: "Track your competitor experts, influencers and where they might be participating in events",
    inputAreas: [
      {
        img: Name,
        type: "text",
        placeholder: "Speaker's Name",
        required:true,
      },
      {
        img: Company,
        type: "text",
        placeholder: "Company Name",
        required:true,
      }
    ]
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
const Pages = () => {
  const searchParams = useSearchParams();
  interface SelectedLocation {
    [id: string]: string;
  }
  const [isRatingOpen, setRatingOpen] = useState<boolean>(false);
  const [isExhibitOpen, setExhibitOpen] = useState<boolean>(false);
  const { theme } = useTheme();
  const type = searchParams.get('type');

  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [selectedCity, setSelectedCity] = useState<SelectedLocation>({});
  const [selectedCountry, setSelectedCountry] = useState<SelectedLocation>({});
  const [opend,setOpend]=useState(false);
  const pathName = usePathname().split("/");
  const last = pathName[pathName.length - 1];
  const router = useRouter();
  const [selectedView, setSelectedView] = useState("list");
  const [categoryData, setCatgeoryData] = useState<CategoryData>();
  const [selectedRegularity, setSelectedRegularity] = useState([0, 100]);
  const [selectedVisitors, setSelectedVisitors] = useState<string[]>([]);
  const [selectedReputationScore, setSelectedReputationScore] = useState([0, 100]);
  const [websiteSuggestion, setWebsiteSuggestion]=useState(null);
  // const [categorySlug, setCategorySlug] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [eventData, setEventData] = useState<EventDataType | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string[]>([]);
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
  const [selectedTrustScore, setSelectedTrustScore] = useState([0, 100]);
  const [selectedAviationRank, setSelectedAviationRank] = useState([0, 100]);
  const [selectedDateRange, setSelectedDateRange] = useState<any[]>([]);
  const [selectedEventStatus, setSelectedEventStatus] = useState<string[]>(
    searchParams.get("status")?.split(",") || []
  );
  const [selectedEventAttendanceRange, setSelectedEventAttendanceRange] =
    useState<string[]>([]);
  const [selectedEventFrequency, setSelectedEventFrequency] = useState<
    string[]
  >(searchParams.get("frequency")?.split(",") || []);
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
  exhibit:false
});
  const [showAdvanceFilter, setShowAdvanceFilter] = useState(true);
  const [selectedAdvFilter, setSelectedAdvFilter] = useState("AP");
  const [selectedBrandedEvent, setSelectedBrandedEvent] = useState(false);
  const [selectedEventSeries, setSelectedEventSeries] = useState(false);
  const [selectedReptScore, setSelectedReptScore] = useState(0);
  const [selectedMaturity, setSelectedMaturity] = useState(0);
  const [maturity, setMaturity] = useState<string | null>();
  const [intScore, setIntScore] = useState<string | null>();
  const [selectedInboundScore, setSelectedInboundScore] = useState(0);
  const [selectedEventKeywords, setSelectedEventKeywords] = useState<string[]>(
    searchParams.get("eventKeywords")?.split(",") || []
  );
  const [customData, setCustomData] = useState<any[]>([]);
  const [selectedEventEdition, setSelectedEventEdition] = useState(0);
  const [selectedINScore, setSelectedINScore] = useState(0);
  const [add, setAdd] = useState(false);
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
  const [editData, setEditData] = useState<EditData | null>(null);
  useEffect(() => {
    if (last === "editTracker") {
      const secondLast = pathName[pathName.length - 2];
      fetchData(secondLast);
    }
  }, [last]);

  const fetchData = async (secondLast: string) => {
    const url = `${baseUrl}/tracker/${secondLast}?edit=true`;
    try {
      const { data, error } = await myFetch(url, {
        method: "GET",
      });
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Data fetched:", data);
        setEditData(data);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };
  const [categories, setCategories] = useState(
    searchParams.get("categories")?.split(",") || []
  );
  useEffect(() => {
    if (selectedMaturity > 0) {
      // queryString.maturity = selectedMaturity;
      if (selectedMaturity >= 1 && selectedMaturity <= 25) setMaturity("new");
      else if (selectedMaturity >= 26 && selectedMaturity <= 50)
        setMaturity("low");
      else if (selectedMaturity >= 51 && selectedMaturity <= 75)
        setMaturity("medium");
      else setMaturity("High");
    }
  }, [selectedMaturity]);
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
  const [isCreating, setIsCreating] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);
  const [designations, setDesignations] = useState("");
  useEffect(() => {
    if (type === "T_COMPETITOR") {
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
      console.log(speakerName, speakerCompany);

    } else if (type === "T_BRAND_BUILDING") {
      const designation = customData.map((item: {}) => Object.values(item)[0]).join(',');
      setDesignations(designation);
    }
  }, [type, customData])

  const saveTrackerHandler = async () => {
    // console.log(new Date(selectedDateRange[0]).toISOString().split('T')[0]);
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
    const userType = {
      ...(isRatingOpen && { rating: true }),
      ...(isExhibitOpen && { exhibit: true }),
      ...(rankToggles.isTrustScore && {trust:true}),
    }
    if (last === "editTracker") {

      const secondLast = pathName[pathName.length - 2];
      const formData = {
        name: trackerName,
        // ...(type && type.length > 0 && {
        //   type: type.toUpperCase()
        // }),
        accessLevel: editData?.tracker?.accessLevel,
        filterValue: {
            ...(userType &&{
             userType:JSON.stringify(userType)
            }),
          ...(selectedLabels?.length > 0 && {
            labels: selectedLabels.join(","),
          }),
          ...(selectedEventType?.length > 0 && {
            eventType: selectedEventTypeName
          }),
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
          ...(selectedEventType?.length > 0 && {
            eventType: selectedEventType.join(",")
          }),
          ...(selectedEventEdition > 0 && {
            editionRange: selectedEventEdition.toString(),
          }),
          // ...(
          //   type === "competitor" && customData.length > 0
          //     ? { orgWebsite: customData.map(item => item.companyUrl).join(', ') }
          //     : {}
          // )
          ...(selectedEventKeywords.length > 0 && {
            eventKeywords: selectedEventKeywords.join("+"),
          }),
          ...(selectedCategories?.length > 0 && {
            eventCategory: selectedCategories.join(","),
          }),
          ...(selectedVisitors?.length>0 && {
            eventSize: selectedVisitors.join(",")
           }),
           ...(selectedExhibitScore?.length>0 && {estimatedExhibitScore:selectedExhibitScore.join(',')}),
           ...(selectedRegularity[0] > 0 && {editionRange: selectedRegularity[0].toString()}),
          ...(selectedZone?.length > 0 && {
            eventRegion: selectedZone.join(',')
          }),
          brandedEvent: selectedBrandedEvent?.toString(),
          // labels:selectedLabels.join(','),
          // eventKeywords:selectedEventKeywords.join(','),
          ...(Object.entries(selectedCountry).length > 0 && {
            eventCountry: Object.keys(selectedCountry).join(","),
          }),
          ...(Object.entries(selectedCity).length > 0 && {
            eventCity: Object.keys(selectedCity).join(","),
          }),
          ...(selectedLabels?.length > 0 && {
            labels: selectedLabels.join(","),
          }),
          ...(selectedEventFormat?.length > 0 && {
            eventFormat: selectedEventFormat.join(","),
          }),
          eventSeries: selectedEventSeries.toString(),
          ...(selectedEventStatus?.length > 0 && {
            eventStatus: selectedEventStatus.join(","),
          }),
          ...(selectedEntry?.length > 0 && {
            eventEntry: selectedEntry.join(","),
          }),
          ...(selectedTrustScore[0] > 0 && {
            trustScore: selectedTrustScore[0].toString(),
          }),
          ...(selectedEventFrequency?.length > 0 && {
            eventFrequency: selectedEventFrequency.join(","),
          }),
          ...(selectedReptScore > 0 && {
            reputationScore: selectedReptScore.toString(),
          }),
          ...(selectedMaturity > 0 && { maturity: selectedMaturity.toString() }),
          ...(selectedDateRange?.length === 2 && {
            startDate: [
              new Date(selectedDateRange[0]).toISOString().split("T")[0],
              new Date(selectedDateRange[1]).toISOString().split("T")[0],
            ].join(","),
          }),
          ...(selectedDateRange?.length === 2 && {
            endDate: [
              new Date(selectedDateRange[0]).toISOString().split("T")[0],
              new Date(selectedDateRange[1]).toISOString().split("T")[0],
            ].join(","),
          }),
          ...(selectedUserRatings?.length > 0 && {
            eventRating: selectedUserRatings.join(","),
          }),
          ...(rankToggles?.isEventRank === true && {
            eventRank: selectedEventRank.join(",")
          }),
          ...(rankToggles?.isLocalRank === true && {
            localRank: selectedLocalRank.join(',')
          }),
          ...(selectedINScore > 0 && { internationalScore: intScore?.toLowerCase() }),
          ...(selectedInboundScore > 0 && {
            inboundScore: selectedInboundScore.toString(),
          }),
          ...(selectedEventAttendanceRange?.length === 2 && {
            eventAttendanceRange: [
              +selectedEventAttendanceRange[0],
              +selectedEventAttendanceRange[1],
            ].join(","),
          }),
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
      if(type==="T_PRODUCT_KEYWORDS" && (trackerName.length === 0 ||selectedEventKeywords.length==0)){
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      else if (type !== "CUSTOM" && type!=="T_PRODUCT_KEYWORDS" &&(trackerName.length === 0 || customData.length === 0 )) {
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      else if (type === "CUSTOM" && (selectedLocations.length === 0 || trackerName.length === 0)) {
        console.log("Please, Fill all the details");
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      const { data, error } = await myFetch(
        `${baseUrl}/tracker/${secondLast}`,
        {
          method: "PATCH",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data) {
        console.log(data);
        router.replace(`/internal/trackers/${secondLast}/trackedConfiguration?type=${type}`);
      } else {
        console.log(error);
        setIsCreating(false);
      }

      console.log(selectedCountry);
    } else {
      const formData = {
        name: trackerName,
        ...(type && type.length > 0 && {
          type: type.toUpperCase()
        }),
        filterValue: {
          
          
         ...(userType &&{
          userType:JSON.stringify(userType)
         }),
          
          ...(selectedEventRanking?.length > 0 && {
            eventRanking: selectedEventRanking.join(","),
          }),
          ...(Object.entries(selectedCountry).length > 0 && {
            eventCountry: Object.keys(selectedCountry).join(","),
          }),
          ...(speakerName.length > 0 && {
            speakerName: speakerName,
          }),
          ...(speakerCompany.length > 0 && {
            speakerOrg: speakerCompany,
          }),
          ...(designations.length > 0 && {
            userDesignation: designations,
          }),
          ...(selectedEventType?.length > 0 && {
            eventType: selectedEventType.join(",")
          }),
          ...(websites.length > 0 && {
            orgWebsite: websites,
          }),
          ...(org.length > 0 && {
            orgName : org,
          }),
          ...(Object.entries(selectedCity).length > 0 && {
            eventCity: Object.keys(selectedCity).join(","),
          }),
          ...(rankToggles?.isEventRank === true && {
            eventRank: selectedEventRank.join(",")
          }),
          ...(rankToggles?.isLocalRank === true && {
            localRank: selectedLocalRank.join(',')
          }),
          ...(selectedLabels?.length > 0 && {
            labels: selectedLabels.join(","),
          }),
          ...(selectedEventEdition > 0 && {
            editionRange: selectedEventEdition.toString(),
          }),
          ...(selectedEventKeywords.length > 0 && {
            eventKeywords: selectedEventKeywords.join("+"),
          }),
          ...(selectedCategories?.length > 0 && {
            eventCategory: selectedCategories.join(","),
          }),
          ...(selectedVisitors?.length>0 && {
            eventSize: selectedVisitors.join(",")
           }),
           ...(selectedExhibitScore?.length>0 && {estimatedExhibitScore:selectedExhibitScore.join(',')}),
           ...(selectedRegularity[0] > 0 && {editionRange: selectedRegularity[0].toString()}),
          brandedEvent: selectedBrandedEvent.toString(),
          // labels:selectedLabels.join(','),
          // eventKeywords:selectedEventKeywords.join(','),
          ...(selectedEventFormat?.length > 0 && {
            eventFormat: selectedEventFormat.join(","),
          }),
          ...(selectedZone?.length > 0 && {
            eventRegion: selectedZone.join(',')
          }),
          eventSeries: selectedEventSeries.toString(),
          ...(selectedEventStatus?.length > 0 && {
            eventStatus: selectedEventStatus.join(","),
          }),
          ...(selectedEntry?.length > 0 && {
            eventEntry: selectedEntry.join(","),
          }),
          ...(selectedTrustScore[0] > 0 && {
            trustScore: selectedTrustScore[0].toString(),
          }),
          ...(selectedEventFrequency?.length > 0 && {
            eventFrequency: selectedEventFrequency.join(","),
          }),
          ...(selectedReptScore > 0 && {
            reputationScore: selectedReptScore.toString(),
          }),
          ...(selectedMaturity > 0 && { maturity: selectedMaturity.toString() }),
          ...(selectedDateRange?.length === 2 && {
            startDate: [
              new Date(selectedDateRange[0]).toISOString().split("T")[0],
              new Date(selectedDateRange[1]).toISOString().split("T")[0],
            ].join(","),
          }),
          ...(selectedDateRange?.length === 2 && {
            endDate: [
              new Date(selectedDateRange[0]).toISOString().split("T")[0],
              new Date(selectedDateRange[1]).toISOString().split("T")[0],
            ].join(","),
          }),
          ...(selectedUserRatings?.length > 0 && {
            eventRating: selectedUserRatings.join(","),
          }),
          ...(selectedINScore > 0 && { internationalScore: intScore?.toLowerCase() }),
          ...(selectedInboundScore > 0 && {
            inboundScore: selectedInboundScore.toString(),
          }),
          ...(selectedEventAttendanceRange?.length === 2 && {
            eventAttendanceRange: [
              +selectedEventAttendanceRange[0],
              +selectedEventAttendanceRange[1],
            ].join(","),
          }),

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
      if(type==="T_PRODUCT_KEYWORDS" && (trackerName.length === 0 ||selectedEventKeywords.length==0)){
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      else if (type !== "CUSTOM" && type!=="T_PRODUCT_KEYWORDS" &&(trackerName.length === 0 || customData.length === 0 )) {
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      else if (type === "CUSTOM" && (selectedLocations.length === 0 || trackerName.length === 0)) {
        console.log("Please, Fill all the details");
        setIsCreating(false);
        setIsMandatory(true);
        return;
      }
      const { data, error } = await myFetch(`${baseUrl}/tracker`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(data);

      if (error) {
        console.log(error);
        setIsCreating(false);
        return;
      }
      if (data) {
        console.log(data);

        router.replace("/internal/trackers");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await myFetch(`${baseUrl}/category/all?take=30&skip=0`);
      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        console.log(data);
        setCatgeoryData(data);
      }
    };
    fetchData();
  }, []);
  console.log(categoryData);

  useEffect(() => {
    if (editData && editData?.tracker && last === "editTracker") {
      const newArr: string[] = [
        ...(categoryData?.attendedCategories ?? []),
        ...(categoryData?.nonAttendedCategories ?? []),
        ...(categoryData?.unscheduledCategories ?? []),
      ];
      if (editData.tracker.filterValue?.maturity == "low") {
        setSelectedMaturity(25);
      }
      if (type === "T_COMPETITOR") {
        const orgNames = editData?.tracker?.filterValue?.orgName?.
          split(',');
        const orgWebsites = editData?.tracker?.filterValue?.orgWebsite?.
          split(',');
        if (Array.isArray(orgNames)) {
          setCustomData((prevData: any) => [
            ...prevData,
            ...orgNames?.map((item) => (
              { companyUrl: item.trim() }
            ))
          ]);
        }
        if (Array.isArray(orgWebsites)) {
          setCustomData((prevData: any) => [
            ...prevData,
            ...orgWebsites?.map((item) => (
              { companyUrl: item.trim() }
            ))
          ]);
        }
      }
      if (type === "T_SPEAKING_OPPORTUNITY") {
        const speakerOrgs = editData?.tracker?.filterValue?.speakerOrg?.
          split(',');
        const speakerNames = editData?.tracker?.filterValue?.speakerName?.
          split(',');
        const presentCustomData = speakerNames.map((speakerName: string, index: number) => ({
          "Speaker's Name": speakerName.trim(),
          "Company Name": speakerOrgs[index]?.trim()
        }));
        setCustomData(presentCustomData);
        // setCustomData((prevData: any) => [
        //   ...prevData,
        //   ...newData?.map((item) => (
        //     { companyUrl: item.trim() }
        //   ))
        // ]);
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
      setExhibitOpen(toggleOpend?.exhibit ?true:false)
      setRankToggles({...rankToggles, isTrustScore:toggleOpend?.trust?true:false})
      setSelectedEventKeywords(
        editData?.tracker?.filterValue?.eventKeywords?.length > 0
          ? editData?.tracker?.filterValue?.eventKeywords?.split("+")
          : []
      );
      setTrackerName(editData?.tracker?.name || "");
      setSelectedLabels(
        editData?.tracker?.filterValue?.labels?.length > 0
          ? editData?.tracker?.filterValue?.labels?.split(",")
          : []
      );
      setSelectedCategories(
        editData?.tracker?.filterValue?.eventCategory?.length > 0
          ? editData?.tracker?.filterValue?.eventCategory?.map(
            (cat: Cat) => cat.id
          )
          : []
      );
      setSelectedEventFormat(
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
          ? editData?.tracker?.filterValue?.eventStatus?.split(",")
          : []
      );
      setSelectedDateRange(
        editData?.tracker?.filterValue?.startDate?.length > 0
          ? [
            editData?.tracker?.filterValue?.startDate?.split(",")[0],
            editData?.tracker?.filterValue?.startDate?.split(",")[1],
          ]
          : []
      );
      setCategorySlug(
        editData?.tracker?.filterValue?.eventCategory?.length > 0
          ? editData?.tracker?.filterValue?.eventCategory?.map(
            (cat: Cat) => cat.name
          )
          : []
      );
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
        editData?.tracker?.filterValue?.eventFrequency?.length > 0
          ? editData?.tracker?.filterValue?.eventFrequency?.split(",")
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
      setSelectedBrandedEvent(editData.tracker.filterValue?.brandedEvent);
      setSelectedCountry(
        editData.tracker.filterValue?.eventCountry?.length > 0
          ? editData.tracker.filterValue.eventCountry.reduce(
            (acc: any, current: any) => {
              return { ...acc, ...current };
            },
            {}
          )
          : {}
      );
      setSelectedZone(editData.tracker.filterValue?.eventRegion?.length > 0 ? editData.tracker.filterValue?.eventRegion?.split(',') : []);
      setSelectedCity(
        editData.tracker.filterValue?.eventCity?.length > 0
          ? editData.tracker.filterValue.eventCity.reduce(
            (acc: any, current: any) => {
              return { ...acc, ...current };
            },
            {}
          )
          : {}
      );
      setSelectedEventSeries(
        editData.tracker.filterValue?.eventSeries?.toString() === "true"
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
      setSelectedMaturity(
        editData.tracker.filterValue?.maturity > 0
          ? editData.tracker.filterValue?.maturity
          : 0
      );
      if (editData?.tracker?.filterValue?.eventType?.length > 0) {
        setSelectedEventType(
          editData.tracker.filterValue.eventType
        );
        setSelectedEventTypeName(EventStatusData
          ?.filter(item => editData.tracker.filterValue.eventType.includes(item.id))
          .map(item => item.name)[0]);
      }



      // setSelectedINScore(
      //   editData.tracker.filterValue?.internationalScore.length > 0
      //     ? editData.tracker.filterValue?.internationalScore
      //     : ""
      // );
      setSelectedInboundScore(
        editData.tracker.filterValue?.inboundScore > 0
          ? editData.tracker.filterValue?.inboundScore
          : 0
      );
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
      setSelectedRegularity(updatedRegularity);
      const updatedTrustScore=[...selectedTrustScore]
      updatedTrustScore[0]=
        editData.tracker.filterValue?.trustScore > 0
          ? editData.tracker.filterValue?.trustScore
          : 0;
        setSelectedTrustScore(updatedTrustScore)
      // setCategorySlug(editData.tracker.filterValue?.category?.split(',') || [])
      // setSelectedLocations(editData.tracker.filterValue?.location);
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

  console.log(selectedLabels);
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
  console.log(selectedEventRank);
  console.log(type);
  const [companyUrl, setCompanyUrl] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addNew();
    }
  }
  console.log(customData);
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
    console.log(value);
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
          ...prevData,
          newEntry
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
  console.log(valid);
  const truncate = (val: string) => {
    if (val.length > 24) return val.substring(0, 25) + "...";
    else return val;
  }
  const deleteEntry = (entryKey: string, itemIndex: number) => {
    console.log(itemIndex);
    const filteredData = customData.filter((item, index) => index !== itemIndex);
    setCustomData(filteredData);
    console.log(filteredData);

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

  return (
    <>
    <div>{isLoading?<Loading/>:
    <>
    <div
      className={`fixedNav ${styles.topContainer}`}
      style={{ top: pathName[pathName.length - 1] === "create" ? "auto" : "" }}
    >
      <div className={styles.topInnerContainerLeft}>
        <div>
          <Image src={userOne} alt="userOne" />
        </div>
        <div>
          <div className={styles.createHead}>Create {template && <span>{template.templateName}</span>} Tracker</div>
          <div className={styles.createContent}>
            Select from the available data filters to create a tracker
          </div>
        </div>
      </div>

      <div className={styles.topInnerContainerRight}>
        <Link
          href={
            last === "create"
              ? "/internal/trackers"
              : `/internal/trackers/${pathName[pathName.length - 2]
              }/trackedConfiguration?type=${type}`
          }
          style={{ display: "flex" }}
        >
          <button className={styles.cancel}>Cancel</button>
        </Link>
        <button className={styles.save} onClick={saveTrackerHandler}>
          Save Tracker
        </button>
      </div>
    </div>
    <div className={styles.allFilters} style={{ marginTop: pathName[pathName.length - 1] === "create" ? "94px" : "140px" }}>
      <div className="dummyDiv" style={{ height: pathName[pathName.length - 1] === "create" ? "120px" : "250px" }}></div>
      <div
        className={styles.searchContainer}
        style={{
          border:
            isMandatory && trackerName.length === 0 ? "1px solid var(--danger-text-color)" : "",
        }}
      >
        <input
          className={styles.textArea}
          type="text"
          placeholder="Enter Tracker Name"
          value={trackerName}
          onChange={(event) => setTrackerName(event.target.value)}
        />
      </div>
      {type==="T_PRODUCT_KEYWORDS" &&
      <div className={`card ${styles.hiddenFiltersOuterContainer}`} style={{gap:"var(--spacing-lg)"}}>
        <div className={styles.hiddenFilterHeading}>
        <div className={styles.subHeading} style={{color:"var(--primary-text-color)", marginBottom:"16px"}}>{template?.description}</div>
        <div className={`${styles.toggleDiv}`}>
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
          </div>
        </div>
      <div style={{width:"calc(50% - 5px)"}}>
      <EventKeyword state={selectedEventKeywords}
      setState={setSelectedEventKeywords}
      onClose={close} type={isDiv}
      isMandatory={isMandatory}
      setIsMandatory={setIsMandatory}
      />
      </div>
      </div>
      }
      
      {template && template.inputAreas &&
        <div className={`card ${styles.competitor}`}>
          {/* <div className={styles.competitorHead}>
            <div className={styles.competitorHeading}>Upload custom data </div>
            {template?.type !== "enabled" && <div className={styles.badgeSuccess}>Comming Soon</div>}
          </div> */}
          <div className={styles.bar}></div>
          <div>
          <div className={styles.subHeading} style={{color:"var(--primary-text-color)", marginBottom:"16px"}}>{template.description}</div>
          <div className={`${styles.toggleDiv}`}>
            <div className={`${styles.manualDiv}`} style={{ padding: "10px" }}>
              <div>
                <div className={styles.manualHeading}>Add data manually
                  {template?.inputAreas?.length === undefined && <div className={styles.badgeSuccess}>Comming Soon</div>}
                </div>
                <div className={styles.manualSubHeading}>Manually enter your custom fields to ensure all your information is personalized and accurate.</div>
              </div>
              <div>

                <span>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={template.type === "enabled"}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </span>

              </div>
            </div>
            <div className={`${styles.manualDiv}`} style={{ padding: "10px" }}>
              <div>
                <div className={styles.manualHeading}>Import CSV Data
                  {template.type === "enabled" && <div className={`${styles.comingSoon_badge} badge_success`} >Coming Soon</div>}
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
          </div>
          </div>
          {template?.inputAreas &&
                  <div className={`${styles.competitor}`}>
                    <div className={styles.allInputArea}>
                      {template?.inputAreas?.map((inputArea: any, index: number) => (
                        <>
                          <div key={index} className={styles.singleInputArea} style={{ border: inputArea?.required === true && isMandatory === true && customData.length === 0 ? "1px solid var(--danger-text-color)" : "" }}>
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
          {type === "T_COMPETITOR" && inputValues[0]?.length > 0  &&
           <SearchBar searchInput={inputValues[0]} setEventSearchLoader={setEventSearchLoader} handleSelect={addCompany} endpoint={'company/suggestion'} type={type}/>
          }
                          </div>

                        </>
                      ))}
                      <div onClick={() => template.type === "enabled" && addNew()} className={styles.addIcon}
                        style={{ backgroundColor: template.type !== "enabled" ? "var(--disabled-btn-color)" : "var(--primary-color)" }}
                      >
                        <Image src={Add} alt="add_Icon" />
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
                      <div style={{ color: "#f15050", fontSize: "12px", marginTop: "-8px" }}>Enter valid input</div>
                    )}
                    <div className={styles.allCompetitors}>
                      {customData.map((item: any, index: number) => (

                        <div key={index} className={styles.customDataOuterDiv}>
                          <div className={styles.square} onClick={() => deleteEntry(item, index)}>-</div>
                          <div className={styles.allCustomData}>
                            {Object.entries(item)
                              .map(([entryKey, value]) => Array.isArray(value) ? value.join(' - ') : value as string)
                              .join(' - ')}
                          </div>
                        </div>

                      ))}
                    </div>
                  </div>
                }
        </div>
      }
     {
     <div className={`${type !== "CUSTOM" ? `card ${styles.hiddenFiltersOuterContainer}` : ""}`}>
      {type !== "CUSTOM" &&
      <div className={`${styles.hiddenFilters}`} onClick={()=>setOpend(!opend)} style={{cursor:"pointer"}}>
      <div className={styles.hiddenFiltersInnerDiv}>
      <Plus style={{width:"16px", height:"16px"}} className="icons"/>
      <div className={styles.hiddenFilterHeading}>Additional filters</div>
      </div>
      <div><ChevronDown className="icons"/></div>
      </div>
      }
      {(type==="CUSTOM" || opend )&&
      <Suspense fallback={<Loading />}>
      <div className={styles.container}>
        <div className={styles.sub_container}>
          <div className={styles.inputdropdowns_container}>

            <MenuTrigger onOpenChange={setMenuOpen}>
              <Button className={styles.dropdown_button}>
                <div className={styles.input_container}>
                  <div className={styles.input}>
                    <div className={styles.input_title}>
                      Event Type
                      {
                        selectedEventType?.length == 1 ? (
                          <span className={styles.input_selected_title}>
                            {selectedEventType[0]}
                          </span>
                        ) : (
                          selectedEventType?.length > 1 ? (
                            <span className={styles.input_selected_no}>
                              {selectedEventType.length}
                            </span>
                          ) : <></>
                        )
                      }
                    </div>
                    <Image
                      src={DropIcon}
                      alt="dropicon"
                      width={12}
                      height={12}
                      className={iconClass}
                    />
                  </div>
                </div>
              </Button>
              <Popover className={styles.filterPopover}>
                <EventType
                  state={selectedEventType}
                  setState={setSelectedEventType}
                  selectedEventTypeName={selectedEventTypeName}
                  setSelectedEventTypeName={setSelectedEventTypeName}
                />
              </Popover>
            </MenuTrigger>

            <MenuTrigger onOpenChange={setMenuOpen}>
              <Button>
                <div className={styles.input_container}>
                  <div className={styles.input}>
                    <div className={styles.input_title}>
                      Category
                      {categorySlug?.length > 1 ? (
                        <span className={styles.input_selected_no}>
                          {categorySlug.length}
                        </span>
                      ) : (
                        <span className={styles.input_selected_title}>
                          {categorySlug[0]}
                        </span>
                      )}
                    </div>
                    <Image
                      src={DropIcon}
                      alt="dropicon"
                      width={12}
                      height={12}
                      className={iconClass}
                    />
                  </div>
                </div>
              </Button>
              <Popover>
                <Dialog className={styles.noBorder}>
                  <CategoryDropdown
                    state={selectedCategories}
                    categoryData={categoryData}
                    setState={setSelectedCategories}
                    categorySlug={categorySlug}
                    setCategorySlug={setCategorySlug}
                  />
                </Dialog>
              </Popover>
            </MenuTrigger>

            <MenuTrigger onOpenChange={setMenuOpen}>
              <Button>
                <div className={styles.input_container}>
                  <div className={styles.input}>
                    <div className={styles.input_title}>
                      Event Format
                      {selectedEventFormat?.length > 1 ? (
                        <span className={styles.input_selected_no}>
                          {selectedEventFormat.length}
                        </span>
                      ) : (
                        <span className={styles.input_selected_title}>
                          {selectedEventFormat && selectedEventFormat[0]}
                        </span>
                      )}
                    </div>
                    <Image
                      src={DropIcon}
                      alt="dropicon"
                      width={12}
                      height={12}
                      className={iconClass}
                    />
                  </div>
                </div>
              </Button>
              <Popover>
                <Dialog className={styles.noBorder}>
                  <EventAdvFilter
                    state={selectedEventFormat}
                    setState={setSelectedEventFormat}
                    data={eventFormatData}
                  />
                </Dialog>
              </Popover>
            </MenuTrigger>

            <MenuTrigger onOpenChange={setMenuOpen}>
              <Button className={styles.dropdown_button}>
                <div className={styles.input_container}
                  style={{
                    border:
                      isMandatory && type === "CUSTOM" && selectedLocations.length === 0 ? "1px solid var(--danger-text-color)" : "",
                  }}
                >
                  <div className={styles.input}>
                    <div className={styles.input_title}>
                      Location
                      {selectedLocations?.length > 1 ? (
                        <span className={styles.input_selected_no}>
                          {selectedLocations.length}
                        </span>
                      ) : (
                        <span className={styles.input_selected_title}>
                          {selectedLocations[0]}
                        </span>
                      )}
                    </div>
                    <Image
                      src={DropIcon}
                      alt="dropicon"
                      width={12}
                      height={12}
                      className={iconClass}
                    />
                  </div>
                </div>
              </Button>
              <Popover className={styles.filterPopover}>
                <Dialog className={styles.noBorder}>
                  {({ close }) => (
                    <LocationDropdown
                      state={selectedLocations}
                      setState={setSelectedLocations}
                      onClose={close}
                      selectedCity={selectedCity}
                      setSelectedCity={setSelectedCity}
                      selectedCountry={selectedCountry}
                      setSelectedCountry={setSelectedCountry}
                      selectedZone={selectedZone}
                      setSelectedZone={setSelectedZone}
                    />
                  )}
                </Dialog>
              </Popover>
            </MenuTrigger>


            <MenuTrigger onOpenChange={setMenuOpen}>
              <Button className={styles.dropdown_button}>
                <div className={styles.input_container}>
                  <div className={styles.input}>
                    <div className={styles.input_title}>
                      Dates
                      {selectedDateRange.length > 0 &&
                        selectedDateRange[0] !== null ? (
                        <span className={styles.input_selected_title}>
                          {dateShowFormatter(selectedDateRange)}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <Image
                      src={DropIcon}
                      alt="dropicon"
                      width={12}
                      height={12}
                      className={iconClass}
                    />
                  </div>
                </div>
              </Button>
              <Popover className={styles.filterPopover}>
                {/* <Dialog> */}
                <DateRange
                  state={selectedDateRange}
                  setState={setSelectedDateRange}
                />
                {/* </Dialog> */}
              </Popover>
            </MenuTrigger>

            {/* <MenuTrigger onOpenChange={setMenuOpen}>
            <Button>
              <div className={styles.input_container}>
                <div className={styles.input}>
                  <div className={styles.input_title}>
                    Labels
                    {selectedLabels?.length > 1 ? (
                      <span className={styles.input_selected_no}>
                        {selectedLabels.length}
                      </span>
                    ) : (
                      <span className={styles.input_selected_title}>
                        {selectedLabels[0]}
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
                <LabelDropdown
                  state={selectedLabels}
                  setState={setSelectedLabels}
                />
              </Dialog>
            </Popover>
          </MenuTrigger> */}
            {/* <MenuTrigger>
          <Button>
            <div className={styles.input_container}>
              <div className={styles.input}>
                <div className={styles.input_title}>
                  Labels
                  {selectedLabels?.length > 1 ? (
                    <span className={styles.input_selected_no}>
                      {selectedLabels.length}
                    </span>
                  ) : (
                    <span className={styles.input_selected_title}>
                      {selectedLabels[0]}
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
            <Dialog>
              <LabelDropdown
                state={selectedLabels}
                setState={setSelectedLabels}
              />
            </Dialog>
          </Popover>
        </MenuTrigger> */}


            <MenuTrigger onOpenChange={setMenuOpen}>
              <Button>
                <div className={styles.input_container}>
                  <div className={styles.input}>
                    <div className={styles.input_title}>
                      Event Status
                      {selectedEventStatus?.length > 1 ? (
                        <span className={styles.input_selected_no}>
                          {selectedEventStatus.length}
                        </span>
                      ) : (
                        <span className={styles.input_selected_title}>
                          {selectedEventStatus[0]}
                        </span>
                      )}
                    </div>
                    <Image
                      src={DropIcon}
                      alt="dropicon"
                      width={12}
                      height={12}
                      className={iconClass}
                    />
                  </div>
                </div>
              </Button>
              <Popover>
                <Dialog className={styles.noBorder}>
                  <EventStatus
                    state={selectedEventStatus}
                    setState={setSelectedEventStatus}
                  />
                </Dialog>
              </Popover>
            </MenuTrigger>

            <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={`${styles.dropdown_button}`}>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Event Entry
                          {selectedEntry?.length > 1 ? (
                            <span className={styles.input_selected_no}>
                              {selectedEntry.length}
                            </span>
                          ) : (
                            <span className={styles.input_selected_title}>
                              {selectedEntry[0]}
                            </span>
                          )}
                        </div>
                        <Image
                          src={DropIcon}
                          alt="dropicon"
                          width={12}
                          height={12}
                          className={iconClass}
                        />
                      </div>
                    </div>
                  </Button>
                  <Popover className={styles.filterPopover} >
                    <EventAdvFilter
                      state={selectedEntry}
                      setState={setSelectedEntry}
                      data={eventEntryData}
                    />
                  </Popover>
                </MenuTrigger>

            {/* Disabled */}
            {/* <MenuTrigger onOpenChange={setMenuOpen}>
              <Button className={styles.disabledBtn}>
                <div className={styles.input_container}>
                  <div className={styles.input}>
                    <div className={styles.input_title}>
                      Event Entry
                      {selectedEntry?.length > 1 ? (
                        <span className={styles.input_selected_no}>
                          {selectedEntry.length}
                        </span>
                      ) : (
                        <span className={styles.input_selected_title}>
                          {selectedEntry[0]}
                        </span>
                      )}
                    </div>
                    <Image
                      src={DropIcon}
                      alt="dropicon"
                      width={20}
                      height={20}
                      className={iconClass}
                    />
                  </div>
                </div>
              </Button>
              <Popover isOpen={false}>
                <Dialog className={styles.noBorder}>
                  <EventAdvFilter
                    state={selectedEntry}
                    setState={setSelectedEntry}
                    data={eventEntryData}
                  />
                </Dialog>
              </Popover>
            </MenuTrigger> */}

<MenuTrigger onOpenChange={setMenuOpen}>
                  {/* <Button className={styles.dropdown_button}> */}
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <Button className={styles.dropdown_button} >
                        <div className={styles.input_title} onClick={()=>{setIsPop(prev => ({ ...prev, rating: !prev.rating }))}}>
                          User Ratings
                          {selectedUserRatings?.length > 1 ? (
                            <span className={styles.input_selected_no}>
                              {selectedUserRatings.length}
                            </span>
                          ) : (
                            <span className={styles.input_selected_title}>
                              {selectedUserRatings[0]}
                            </span>
                          )}
                        </div>
                        </Button>

                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onClick={() => {
                                  setRatingOpen(!isRatingOpen)
                                  if(!isRatingOpen) setIsPop({...isPop, rating:true})
                                }}
                                onChange={() => {}}
                                checked={selectedUserRatings.length !== 0 || isRatingOpen}
                              />
                              <span className={styles.slider}></span>
                            </label>
                          </span>
                        </div>
                      </div>
                    </div>
                  {/* </Button> */}
                  <Popover className={styles.filterPopover} isOpen={isPop.rating} onOpenChange={() => setIsPop(prev => ({ ...prev, rating: !prev.rating }))}>
                    <UserRatings
                      state={selectedUserRatings}
                      setState={setSelectedUserRatings}
                    />
                  </Popover>
                </MenuTrigger>
          </div>

          {/* <div className={styles.buttons_container}>
      <button
        className={styles.createtracker_button}
        onClick={createTrackerHandler}
      >
        Save as Tracker
      </button>
      <button
        className={styles.clearfilter_button}
        onClick={() => {
          setShowAdvanceFilter((prev) => !prev);
        }}
      >
        Advance Filters
      </button>
    </div> */}
        </div>
        {showRecentSearches && (
          <RecentSearches setShowRecentSearches={setShowRecentSearches} />
        )}

        {/*   ADVANCE FILTER SECTION */}

        <div>
          <div
            className={`${styles.viewContainer}`}
          >
            <div className={styles.viewTypeButtons_container}>
              <div className={styles.advanceFilterBtns}>
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

<MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={styles.dropdown_button}>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Regularity & Edition
                          {selectedRegularity[0] !== 0 && (
                            <span className={styles.input_selected_title}>
                              &gt;{'='} {selectedRegularity[0]}
                            </span>
                          )}
                        </div>
                        <Image
                          src={DropIcon}
                          alt="dropicon"
                          width={12}
                          height={12}
                          className={`${iconClass} ${styles.dropIcon}`}
                        />
                      </div>
                    </div>
                  </Button>
                  {/* <Popover className={styles.filterPopover}>
                    <RangeSlider
                      state={selectedEventEdition}
                      setState={setSelectedEventEdition}
                      sliderType="reverse"
                    />
                  </Popover> */}
                  <Popover className={styles.filterPopover}>
                    <Dialog className={styles.dialogBorder}>
                      {({ close }) => (
                        <RegularityEdition
                          selectedRegularity={selectedRegularity}
                          setSelectedRegularity={setSelectedRegularity}
                          onClose={close}
                        />
                      )}
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={`${styles.dropdown_button}`}>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Global & Touring
                        </div>
                        <div className={`${styles.comingSoon_badge} badge_success`} >Coming Soon</div>
                        {/* <Image
                          src={DropIcon}
                          alt="dropicon"
                          width={20}
                          height={20}
                          className={`${iconClass} ${styles.dropIcon}`}
                        /> */}
                      </div>
                    </div>
                  </Button>
                  <Popover className={styles.filterPopover} >
                    <GlobalTouring
                      state={selectedEntry}
                      setState={setSelectedEntry}
                      data={eventEntryData}
                      selectedBrandedEvent={selectedBrandedEvent}
                      setSelectedBrandedEvent={setSelectedBrandedEvent}
                    />
                  </Popover>
                </MenuTrigger>

              {/* <MenuTrigger onOpenChange={setMenuOpen}>
              <div className={styles.disabledBtn}>
                <div className={styles.input_container}>
                  <div className={styles.input}>
                    <div className={styles.input_title}>Series Event</div>

                    <div className={styles.toggle_container}>
                      <span>
                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            onChange={() => {
                              setSelectedEventSeries((prev) => !prev);
                            }}
                            checked={selectedEventSeries}
                            disabled={true}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </MenuTrigger> */}

<MenuTrigger onOpenChange={setMenuOpen}>
                  <div>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Forecasted Status
                        </div>

                        <div className={`${styles.comingSoon_badge} badge_success`} >Coming Soon</div>

                        {/* <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={() => {
                                  setSelectedBrandedEvent((prev) => !prev);
                                }}
                                checked={selectedBrandedEvent}
                                disabled={true}
                              />
                              <span className={styles.slider}></span>
                            </label>
                          </span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={styles.dropdown_button}>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Event Frequency
                          {selectedEventFrequency?.length > 1 ? (
                            <span className={styles.input_selected_no}>
                              {selectedEventFrequency.length}
                            </span>
                          ) : (
                            <span className={styles.input_selected_title}>
                              {selectedEventFrequency[0]}
                            </span>
                          )}
                        </div>
                        <Image
                          src={DropIcon}
                          alt="dropicon"
                          width={12}
                          height={12}
                          className={`${iconClass} ${styles.dropIcon}`}
                        />
                      </div>
                    </div>
                  </Button>
                  <Popover className={styles.filterPopover}>
                    {/* <Dialog> */}
                    <EventAdvFilter
                      state={selectedEventFrequency}
                      setState={setSelectedEventFrequency}
                      data={eventFrequencyData}
                    />
                    {/* </Dialog> */}
                  </Popover>
                </MenuTrigger>

              {type!=="T_PRODUCT_KEYWORDS" &&
              <MenuTrigger onOpenChange={setMenuOpen}>
                <Button>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                        Product / Topics
                        {selectedEventKeywords?.length > 1 ? (
                          <span className={styles.input_selected_no}>
                            {selectedEventKeywords.length}
                          </span>
                        ) : (
                          <span className={styles.input_selected_title}>
                            {selectedEventKeywords[0]?.charAt(0)==="-"?selectedEventKeywords[0]?.replaceAll("_", " ").substring(1):selectedEventKeywords[0]?.replaceAll("_", " ")}
                          </span>
                        )}
                      </div>
                      <Image
                        src={DropIcon}
                        alt="dropicon"
                        width={12}
                        height={12}
                        className={iconClass}
                      />
                    </div>
                  </div>
                </Button>
                <Popover className={styles.filterPopover}>
                  <Dialog className={`${styles.dialogBorder} ${styles.noBorder}`}>
                    {({ close }) => (
                      <EventKeyword
                        state={selectedEventKeywords}
                        setState={setSelectedEventKeywords}
                        onClose={close}
                      />
                    )}
                  </Dialog>
                </Popover>
              </MenuTrigger>
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
              {/* <MenuTrigger onOpenChange={setMenuOpen}>
                <Button>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                        Event Attendance
                        {selectedEventAttendanceRange[0] !== undefined ? (
                          <span className={styles.input_selected_title}>
                            {`${selectedEventAttendanceRange[0]} - ${selectedEventAttendanceRange[1] || "Unlimited"
                              }`}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <Image
                        src={DropIcon}
                        alt="dropicon"
                        width={12}
                        height={12}
                        className={iconClass}
                      />
                    </div>
                  </div>
                </Button>
                <Popover>
                  <Dialog className={styles.noBorder}>
                    {({ close }) => (
                      <EventAttendance
                        state={selectedEventAttendanceRange}
                        setState={setSelectedEventAttendanceRange}
                        onClose={close}
                      />
                    )}
                  </Dialog>
                </Popover>
              </MenuTrigger> */}

<MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={styles.dropdown_button}>
                      <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Event Visitors
                          {selectedVisitors?.length > 1 ? (
                            <span className={styles.input_selected_no}>
                              {selectedVisitors.length}
                            </span>
                          ) : (
                            <span className={styles.input_selected_title}>
                              {selectedVisitors[0]}
                            </span>
                          )}
                        </div>
                        <Image
                          src={DropIcon}
                          alt="dropicon"
                          width={12}
                          height={12}
                          className={iconClass}
                        />
                      </div>
                    </div>
                  </Button>
                  <Popover className={styles.filterPopover}>
                    <Dialog className={styles.dialogBorder}>
                      <EventAdvFilter
                        state={selectedVisitors}
                        setState={setSelectedVisitors}
                        data={eventVisitorsData}
                      />
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  {/* <Button className={styles.dropdown_button}> */}
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <Button className={styles.dropdown_button} style={{margin: '-16px'}}>
                        <div className={styles.input_title}
                        onClick={()=>{setIsPop(prev => ({ ...prev, exhibit: !prev.exhibit }))}} 
                          style={{paddingLeft: '16px'}} >
                          Estimated Exhibitor
                          {selectedExhibitScore?.length > 1 ? (
                            <span className={styles.input_selected_no}>
                              {selectedExhibitScore.length}
                            </span>
                          ) : (
                            <span className={styles.input_selected_title}>
                              {selectedExhibitScore[0]}
                            </span>
                          )}
                        </div>
                        </Button>

                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onClick={() => {
                                  setExhibitOpen(!isExhibitOpen)
                                  if(!isExhibitOpen) setIsPop({...isPop, exhibit:true})
                                }}
                                
                                onChange={() => {}}
                                checked={selectedExhibitScore.length !== 0 || isExhibitOpen}
                              />
                              <span className={styles.slider}></span>
                            </label>
                          </span>
                        </div>
                      </div>
                    </div>
                  {/* </Button> */}
                  <Popover isOpen={isPop.exhibit} onOpenChange={() => setIsPop(prev => ({ ...prev, exhibit: !prev.exhibit }))}>
                      <EventAdvFilter
                        state={selectedExhibitScore}
                        setState={setSelectedExhibitScore}
                        data={eventExhibitScoreData}
                      />
                </Popover>
                </MenuTrigger>

              {/* <MenuTrigger onOpenChange={setMenuOpen}>
              <Button className={styles.disabledBtn}>
                <div className={styles.input_container}>
                  <div className={styles.input}>
                    <div className={styles.input_title}>
                      Inbound Score
                      {selectedInboundScore !== 0 && (
                        <span className={styles.input_selected_title}>
                          {selectedInboundScore} %
                        </span>
                      )}
                    </div>

                    <div className={styles.toggle_container}>
                      <span>
                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            onChange={() => { }}
                            checked={selectedInboundScore !== 0}
                          />
                          <span className={styles.slider}></span>
                        </label>
                      </span>
                    </div>
                  </div>
                </div>
              </Button>
              <Popover>
                <Dialog className={styles.noBorder}>
                  {({ close }) => (
                    <RangeSlider
                      state={selectedInboundScore}
                      setState={setSelectedInboundScore}
                    />
                  )}
                </Dialog>
              </Popover>
            </MenuTrigger> */}

              {/* <MenuTrigger onOpenChange={setMenuOpen}>
                <Button>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                        International Score
                        {intScore && intScore.length > 0 && (
                          <span className={styles.input_selected_title}>
                            {intScore?.charAt(0).toUpperCase()}{intScore?.substring(1)}
                          </span>
                        )}
                      </div>
                      <div className={styles.toggle_container}>
                        <span>
                          <label className={styles.switch}>
                            <input
                              type="checkbox"
                              onChange={() => { }}
                              checked={(intScore ?? [])?.length > 0}
                            />
                            <span className={styles.slider}></span>
                          </label>
                        </span>
                      </div>
                    </div>
                  </div>
                </Button>
                <Popover className={styles.filterPopover}>
                  <IntScoreSlider
                    state={selectedINScore}
                    setState={setSelectedINScore}
                  />
                </Popover>
              </MenuTrigger> */}

<MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={`${styles.dropdown_button}`} >
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Event Analytics
                          {/* {rankToggles.isEventRank && (
                            <span className={styles.input_selected_title}>
                              [{selectedEventRank[0]} , {selectedEventRank[1]}]
                            </span>
                          )}
                          {rankToggles.isLocalRank && (
                            <span className={styles.input_selected_title}>
                              [{selectedLocalRank[0]} , {selectedLocalRank[1]}]
                            </span>
                          )}
                          {rankToggles.isAviationRank && (
                            <span className={styles.input_selected_title}>
                              [{selectedAviationRank[0]} ,{selectedAviationRank[1]}]
                            </span>
                          )} */}
                        </div>
                        <div className={`${styles.comingSoon_badge} badge_success`} >Coming Soon</div>
                        {/* <Image
                          src={DropIcon}
                          alt="dropicon"
                          width={20}
                          height={20}
                          className={`${iconClass} ${styles.dropIcon}`}
                        /> */}
                      </div>
                    </div>
                  </Button>
                  <Popover className={styles.filterPopover}>
                    <Dialog className={styles.dialogBorder}>
                      {({ close }) => (
                        <AnalyticsDropdown
                          selectedEventRank={selectedEventRank}
                          setSelectedEventRank={setSelectedEventRank}
                          selectedLocalRank={selectedLocalRank}
                          setSelectedLocalRank={setSelectedLocalRank}
                          selectedAviationRank={selectedAviationRank}
                          setSelectedAviationRank={setSelectedAviationRank}
                          rankToggles={rankToggles}
                          setRankToggles={setRankToggles}
                          onClose={close}
                        />
                      )}
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  {/* <Button className={`${styles.dropdown_button}`} > */}
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Economic Impact
                        </div>
                        <div className={`${styles.comingSoon_badge} badge_success`} >Coming Soon</div>
                        {/* <Image
                          src={DropIcon}
                          alt="dropicon"
                          width={20}
                          height={20}
                          className={`${iconClass} ${styles.dropIcon}`}
                        /> */}
                      </div>
                    </div>
                  {/* </Button> */}
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={`${styles.dropdown_button}`} >
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Event Ranking
                          {selectedTrustScore[0] > 0 &&
                            <span className={styles.selected_no_filters}>1</span>
                          }
                        </div>
                        {/* <Image
                          src={DropIcon}
                          alt="dropicon"
                          width={20}
                          height={20}
                          className={`${iconClass} ${styles.dropIcon}`}
                        /> */}
                        {/* <div className={`${styles.comingSoon_badge} badge_success`} >Coming Soon</div> */}
                      </div>
                    </div>
                  </Button>
                  <Popover className={styles.filterPopover} placement="top" shouldFlip={false}>
                    <Dialog className={styles.dialogBorder}>
                      {({ close }) => (
                        <RankInput
                          selectedReputationScore={selectedReputationScore}
                          setSelectedReputationScore={setSelectedReputationScore}
                          selectedTrustScore={selectedTrustScore}
                          setSelectedTrustScore={setSelectedTrustScore}
                          selectedEventRank={selectedEventRank}
                          setSelectedEventRank={setSelectedEventRank}
                          selectedLocalRank={selectedLocalRank}
                          setSelectedLocalRank={setSelectedLocalRank}
                          selectedAviationRank={selectedAviationRank}
                          setSelectedAviationRank={setSelectedAviationRank}
                          rankToggles={rankToggles}
                          setRankToggles={setRankToggles}
                          onClose={close}
                        />
                      )}
                    </Dialog>
                  </Popover>
                </MenuTrigger>

              {/* <MenuTrigger onOpenChange={setMenuOpen}>
                <Button>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                        Reputation Score
                        {selectedReptScore !== 0 && (
                          <span className={styles.input_selected_title}>
                            &gt; {selectedReptScore} %
                          </span>
                        )}
                      </div>

                      <div className={styles.toggle_container}>
                        <span>
                          <label className={styles.switch}>
                            <input
                              type="checkbox"
                              onChange={() => { }}
                              checked={selectedReptScore !== 0}
                            />
                            <span className={styles.slider}></span>
                          </label>
                        </span>
                      </div>
                    </div>
                  </div>
                </Button>
                <Popover className={styles.filterPopover}>
                  <RangeSlider
                    state={selectedReptScore}
                    setState={setSelectedReptScore}
                    sliderType={'reverse'}
                  />
                </Popover>
              </MenuTrigger> */}

              {/* <MenuTrigger onOpenChange={setMenuOpen}>
                <Button className={`${styles.dropdown_button}`}>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                        Trust Score
                        {selectedTrustScore !== 0 && (
                          <span className={styles.input_selected_title}>
                            &gt; {selectedTrustScore} %
                          </span>
                        )}
                      </div>

                      <div className={styles.toggle_container}>
                        <span>
                          <label className={styles.switch}>
                            <input
                              type="checkbox"
                              onChange={() => { }}
                              checked={selectedTrustScore !== 0}
                            />
                            <span className={styles.slider}></span>
                          </label>
                        </span>
                      </div>
                    </div>
                  </div>
                </Button>
                <Popover className={styles.filterPopover}>
                  <RangeSlider
                    state={selectedTrustScore}
                    setState={setSelectedTrustScore}
                    sliderType={'reverse'}
                  />
                </Popover>
              </MenuTrigger> */}


            </div>
          )}

          {/* AUDIENCE INTEL */}
          {showAdvanceFilter && selectedAdvFilter === "AI" && (
            <div className={styles.inputdropdowns_container_AI}>

<MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={`${styles.dropdown_button}`} >
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                        Audience Quality Score
                          {/* {selectedEventAttendanceRange[0] !== undefined ? (
                            <span className={styles.input_selected_title}>
                              {`${selectedEventAttendanceRange[0]} - ${selectedEventAttendanceRange[1] || "Unlimited"
                                }`}
                            </span>
                          ) : (
                            ""
                          )} */}
                        </div>
                        <div className={`${styles.comingSoon_badge} badge_success`} >Coming Soon</div>
                        {/* <Image
                          src={DropIcon}
                          alt="dropicon"
                          width={12}
                          height={12}
                          className={`${iconClass} ${styles.dropIcon}`}
                        /> */}
                      </div>
                    </div>
                  </Button>
                  <Popover className={styles.filterPopover}>
                    <Dialog className={styles.dialogBorder}>
                      {({ close }) => (
                        <AudienceQuality
                          selectedEventRank={selectedEventRank}
                          setSelectedEventRank={setSelectedEventRank}
                          onClose={close}
                          type="Audience"
                        />
                      )}
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={`${styles.dropdown_button}`} >
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Exhibitor Quality Score
                        </div>
                        <div className={`${styles.comingSoon_badge} badge_success`} >Coming Soon</div>
                        {/* <Image
                          src={DropIcon}
                          alt="dropicon"
                          width={20}
                          height={20}
                          className={`${iconClass} ${styles.dropIcon}`}
                        /> */}
                      </div>
                    </div>
                  </Button>
                  <Popover className={styles.filterPopover}>
                    <Dialog className={styles.dialogBorder}>
                      {({ close }) => (
                        <AudienceQuality
                          selectedEventRank={selectedEventRank}
                          setSelectedEventRank={setSelectedEventRank}
                          onClose={close}
                          type="Exhibitor"
                        />
                      )}
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  {/* <Button className={`${styles.dropdown_button}`} > */}
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Audience Des &amp; Dept
                        </div>
                        {/* <Image
                          src={DropIcon}
                          alt="dropicon"
                          width={20}
                          height={20}
                          className={`${iconClass} ${styles.dropIcon}`}
                        /> */}
                        <div className={`${styles.comingSoon_badge} badge_success`} >Coming Soon</div>
                      </div>
                    </div>
                  {/* </Button> */}
                </MenuTrigger>

              {/* <MenuTrigger onOpenChange={setMenuOpen}>
                <Button className={styles.disabledBtn}>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                        Designation &amp; Department
                        {selectedEventAttendanceRange[0] !== undefined ? (
                          <span className={styles.input_selected_title}>
                            {`${selectedEventAttendanceRange[0]} - ${selectedEventAttendanceRange[1] || "Unlimited"
                              }`}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <Image
                        src={DropIcon}
                        alt="dropicon"
                        width={12}
                        height={12}
                        className={iconClass}
                      />
                    </div>
                  </div>
                </Button>
                <Popover>
                <Dialog className={styles.noBorder}>
                  {({ close }) => (
                    <EventAttendance
                      state={selectedEventAttendanceRange}
                      setState={setSelectedEventAttendanceRange}
                      onClose={close}
                    />
                  )}
                </Dialog>
              </Popover>
              </MenuTrigger> */}

<MenuTrigger onOpenChange={setMenuOpen}>
                  {/* <Button className={`${styles.dropdown_button}`} > */}
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                        Audience Spread
                          {/* {selectedEventAttendanceRange[0] !== undefined ? (
                            <span className={styles.input_selected_title}>
                              {`${selectedEventAttendanceRange[0]} - ${selectedEventAttendanceRange[1] || "Unlimited"
                                }`}
                            </span>
                          ) : (
                            ""
                          )} */}
                        </div>
                        {/* <Image
                          src={DropIcon}
                          alt="dropicon"
                          width={20}
                          height={20}
                          className={`${iconClass} ${styles.dropIcon}`}
                        /> */}
                        <div className={`${styles.comingSoon_badge} badge_success`} >Coming Soon</div>
                      </div>
                    </div>
                  {/* </Button> */}
                  {/* <Popover>
                    <Dialog className={styles.noBorder}>
                      {({ close }) => (
                        <EventAttendance
                          state={selectedEventAttendanceRange}
                          setState={setSelectedEventAttendanceRange}
                          onClose={close}
                        />
                      )}
                    </Dialog>
                  </Popover> */}
                </MenuTrigger>
           
            </div>
          )}
        </div>
      </div>
    </Suspense>
      }
     
    </div>
      }
    </div>
    </>
    }</div>
    
    </>
  );
};

export default Pages;