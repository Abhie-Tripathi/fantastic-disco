"use client";
import styles from "./filters.style.module.css";
import React, { useState, useEffect, Suspense, lazy } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
// import styles from "./search.module.css";
import { EventDataType } from "@/app/components/types/allevents";
import userOne from "/public/userOne.svg";
import SearchIcon from "/public/search.svg";
import DropIcon from "/public/internal/dropdown_arrow.svg";
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
import { convertToYYYYMMDD } from "@/utils/dateFormat";
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
  eventRank:any;
  localRank:any;
  eventKeywords: any;
  eventCategory: any;
  editionRange: number;
  eventSize: any;
  eventCity: any;
  eventCountry: any;
  eventRegion:string;
  eventAttendanceRange: any;
}
interface CategoryData {
  attendedCategories?: string[];
  nonAttendedCategories?: string[];
  unscheduledCategories?: string[];
}
interface Tracker {
  name: string;
  filterValue: FilterValue;
}
interface Cat {
  name: string;
  id: string;
}
interface EditData {
  tracker: Tracker;
}
const Pages = () => {
  // const searchParams = useSearchParams();
  interface SelectedLocation {
    [id: string]: string;
  }
  const [selectedCity, setSelectedCity] = useState<SelectedLocation>({});
  const [selectedCountry, setSelectedCountry] = useState<SelectedLocation>({});
  const pathName = usePathname().split("/");
  const last = pathName[pathName.length - 1];
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [selectedView, setSelectedView] = useState("list");
  const [categoryData, setCatgeoryData] = useState<CategoryData>();
  // const [categorySlug, setCategorySlug] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [eventData, setEventData] = useState<EventDataType | null>(null);
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
  const [selectedEventRank, setSelectedEventRank] = useState([0, 100]);
  const [selectedLocalRank, setSelectedLocalRank] = useState([0, 100]);
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
  });
  const [showAdvanceFilter, setShowAdvanceFilter] = useState(true);
  const [selectedAdvFilter, setSelectedAdvFilter] = useState("AP");
  const [selectedBrandedEvent, setSelectedBrandedEvent] = useState(false);
  const [selectedEventSeries, setSelectedEventSeries] = useState(false);
  const [selectedTrustScore, setSelectedTrustScore] = useState(0);
  const [selectedReptScore, setSelectedReptScore] = useState(0);
  const [selectedMaturity, setSelectedMaturity] = useState(0);
  const [maturity, setMaturity] = useState<string | null>();
  const [intScore, setIntScore] = useState<string | null>();
  const [selectedInboundScore, setSelectedInboundScore] = useState(0);
  const [selectedEventKeywords, setSelectedEventKeywords] = useState<string[]>(
    searchParams.get("eventKeywords")?.split(",") || []
  );
  const [selectedEventEdition, setSelectedEventEdition] = useState(0);
  const [selectedINScore, setSelectedINScore] = useState(0);

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
      if (selectedINScore >= 1 && selectedINScore <= 25) setIntScore("local");
      else if (selectedINScore >= 26 && selectedINScore <= 50)
        setIntScore("National");
      else if (selectedINScore >= 51 && selectedINScore <= 75)
        setIntScore("Regional");
      else setIntScore("International");
    }
  }, [selectedINScore]);
  const [isCreating, setIsCreating] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);
  const saveTrackerHandler = async () => {
    // console.log(new Date(selectedDateRange[0]).toISOString().split('T')[0]);

    GAEvent(
      "trackers",
      "Trackers",
      "Saved Tracker | New Tracker Created",
      "Create"
    );
    if (isCreating) return;
    setIsCreating(true);

    if (last === "editTracker") {
      console.log(1);

      const secondLast = pathName[pathName.length - 2];
      const formData = {
        name: trackerName,
        filterValue: {
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
          ...(selectedExhibitScore?.length > 0 && {
            eventSize: selectedExhibitScore.join(","),
          }),
         ...(selectedZone?.length>0 && {
            eventRegion:selectedZone.join(',')
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
          ...(selectedTrustScore > 0 && {
            trustScore: selectedTrustScore.toString(),
          }),
          ...(selectedEventFrequency?.length > 0 && {
            eventFrequency: selectedEventFrequency.join(","),
          }),
          ...(selectedReptScore > 0 && {
            reputationScore: selectedReptScore.toString(),
          }),
          ...(selectedMaturity > 0 && { maturity: maturity }),
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
          ...(rankToggles?.isEventRank===true && {
            eventRank: selectedEventRank.join(",")
          }),
          ...(rankToggles?.isLocalRank===true && {
            localRank:selectedLocalRank.join(',')
          }),
          ...(selectedINScore > 0 && { internationalScore: intScore }),
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
      console.log(formData);
      console.log(`${baseUrl}/tracker/${secondLast}`);
      if (selectedLocations.length === 0 || trackerName.length === 0) {
        console.log("Please, Fill all the details");
        setIsMandatory(true);
        setIsCreating(false);
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
        router.replace(`/internal/trackers/${secondLast}/trackedConfiguration`);
      } else {
        console.log(error);
        setIsCreating(false);
      }

      console.log(selectedCountry);
    } else {
      const formData = {
        name: trackerName,
        filterValue: {
          ...(selectedEventRanking?.length > 0 && {
            eventRanking: selectedEventRanking.join(","),
          }),
          ...(Object.entries(selectedCountry).length > 0 && {
            eventCountry: Object.keys(selectedCountry).join(","),
          }),
          ...(Object.entries(selectedCity).length > 0 && {
            eventCity: Object.keys(selectedCity).join(","),
          }),
          ...(rankToggles?.isEventRank===true && {
            eventRank: selectedEventRank.join(",")
          }),
          ...(rankToggles?.isLocalRank===true && {
            localRank:selectedLocalRank.join(',')
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
          ...(selectedExhibitScore?.length > 0 && {
            eventSize: selectedExhibitScore.join(","),
          }),
          brandedEvent: selectedBrandedEvent.toString(),
          // labels:selectedLabels.join(','),
          // eventKeywords:selectedEventKeywords.join(','),
          ...(selectedEventFormat?.length > 0 && {
            eventFormat: selectedEventFormat.join(","),
          }),
          ...(selectedZone?.length>0 && {
            eventRegion:selectedZone.join(',')
         }),
          eventSeries: selectedEventSeries.toString(),
          ...(selectedEventStatus?.length > 0 && {
            eventStatus: selectedEventStatus.join(","),
          }),
          ...(selectedEntry?.length > 0 && {
            eventEntry: selectedEntry.join(","),
          }),
          ...(selectedTrustScore > 0 && {
            trustScore: selectedTrustScore.toString(),
          }),
          ...(selectedEventFrequency?.length > 0 && {
            eventFrequency: selectedEventFrequency.join(","),
          }),
          ...(selectedReptScore > 0 && {
            reputationScore: selectedReptScore.toString(),
          }),
          ...(selectedMaturity > 0 && { maturity: maturity }),
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
          ...(selectedINScore > 0 && { internationalScore: intScore }),
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
      console.log(selectedCountry);

      if (selectedLocations.length === 0 || trackerName.length === 0) {
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
      const { data, error } = await myFetch(`${baseUrl}/category/all`);
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
      setSelectedZone(editData.tracker.filterValue?.eventRegion?.length > 0?  editData.tracker.filterValue?.eventRegion?.split(','):[]);
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
      setSelectedTrustScore(
        editData.tracker.filterValue?.trustScore > 0
          ? editData.tracker.filterValue?.trustScore
          : 0
      );
      setSelectedEventSeries(
        editData.tracker.filterValue?.eventSeries?.toString() === "true"
      );
      setMaturity(
        editData.tracker.filterValue?.maturity?.length > 0
          ? editData.tracker.filterValue?.maturity
          : ""
      );
      setSelectedEventRank(editData.tracker.filterValue?.eventRank?.length>0
        ? editData.tracker.filterValue?.eventRank?.split(',')
        : [0,100]);
        setSelectedLocalRank( editData.tracker.filterValue?.localRank?.length>0
          ? editData.tracker.filterValue?.localRank?.split(',')
          : [0,100])
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
      setSelectedINScore(
        editData.tracker.filterValue?.internationalScore > 0
          ? editData.tracker.filterValue?.internationalScore
          : 0
      );
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
      setSelectedExhibitScore(
        editData.tracker.filterValue?.eventSize &&
          editData.tracker.filterValue?.eventSize?.length !== 0
          ? editData.tracker.filterValue?.eventSize?.split(",")
          : []
      );
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

  return (
    <>
      <div
        className={`${styles.topContainer} ${
          theme === "dark" ? "darkMode" : "lightMode_secondary"
        }`}
      >
        <div className={styles.topInnerContainerLeft}>
          <div>
            <Image src={userOne} alt="userOne" />
          </div>
          <div>
            <div className={styles.createHead}>Create Custom Tracker</div>
            <div className={styles.createContent}>
              Select from the available data filters to create a custom tracker
            </div>
          </div>
        </div>

        <div className={styles.topInnerContainerRight}>
          <Link
            href={
              last === "create"
                ? "/internal/trackers"
                : `/internal/trackers/${
                    pathName[pathName.length - 2]
                  }/trackedConfiguration`
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
      <div
        className={styles.searchContainer}
        style={{
          border:
            isMandatory && trackerName.length === 0 ? "2px solid red" : "",
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
      <Suspense fallback={<Loading />}>
        <div className={styles.container}>
          <div className={styles.sub_container}>
            <div className={styles.inputdropdowns_container}>
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
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                </Button>
                <Popover>
                  <Dialog>
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
                <Button className={styles.dropdown_button}>
                  <div className={styles.input_container}
                  style={{
                    border:
                      isMandatory && selectedLocations.length === 0 ? "2px solid red" : "",
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
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                </Button>
                <Popover className={styles.filterPopover}>
                  <Dialog className={styles.dialogBorder}>
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
                            {`${convertISOToOriginalFormat(
                              selectedDateRange[0]
                            )} - ${convertISOToOriginalFormat(
                              selectedDateRange[1]
                            )}`}
                          </span>
                        ) : (
                          ""
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
                <Button className={styles.dropdown_button}>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                        Rank
                        {rankToggles.isEventRank && (
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
                <Popover className={styles.filterPopover}>
                  <Dialog className={styles.dialogBorder}>
                    {({ close }) => (
                      <RankInput
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
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                </Button>
                <Popover>
                  <Dialog>
                    <EventStatus
                      state={selectedEventStatus}
                      setState={setSelectedEventStatus}
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
                          width={20}
                          height={20}
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
              className={`${styles.viewContainer} ${
                theme === "dark" ? "darkMode" : "lightMode_secondary"
              }`}
            >
              <div className={styles.viewTypeButtons_container}>
                <div className={styles.advanceFilterBtns}>
                  <button
                    onClick={() => setSelectedAdvFilter("AP")}
                    className={`${styles.listBtn} ${
                      selectedAdvFilter === "AP" ? styles.active : ""
                    } ${theme === "dark" ? "darkMode_secondary" : "lightMode"}`}
                  >
                    Advanced Details
                  </button>
                  <button
                    onClick={() => setSelectedAdvFilter("IS")}
                    className={`${styles.mapBtn} ${
                      selectedAdvFilter === "IS" ? styles.active : ""
                    } ${theme === "dark" ? "darkMode_secondary" : "lightMode"}`}
                  >
                    Insights and Score
                  </button>
                  <button
                    onClick={() => setSelectedAdvFilter("AI")}
                    className={`${styles.calendarBtn} ${
                      selectedAdvFilter === "AI" ? styles.active : ""
                    } ${theme === "dark" ? "darkMode_secondary" : "lightMode"} `}
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
                <Button>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                        Event Attendance
                        {selectedEventAttendanceRange[0] !== undefined ? (
                          <span className={styles.input_selected_title}>
                            {`${selectedEventAttendanceRange[0]} - ${
                              selectedEventAttendanceRange[1] || "Unlimited"
                            }`}
                          </span>
                        ) : (
                          ""
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
                    {({ close }) => (
                      <EventAttendance
                        state={selectedEventAttendanceRange}
                        setState={setSelectedEventAttendanceRange}
                        onClose={close}
                      />
                    )}
                  </Dialog>
                </Popover>
              </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button>
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
                          width={20}
                          height={20}
                        />
                      </div>
                    </div>
                  </Button>
                  <Popover>
                    <Dialog className={styles.noBorder}>
                      <EventAdvFilter
                        state={selectedEventFrequency}
                        setState={setSelectedEventFrequency}
                        data={eventFrequencyData}
                      />
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button>
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
                        />
                      </div>
                    </div>
                  </Button>
                  <Popover>
                    <Dialog className={styles.noBorder}>
                      <EventAdvFilter
                        state={selectedEntry}
                        setState={setSelectedEntry}
                        data={eventEntryData}
                      />
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Event Edition
                          {selectedEventEdition !== 0 && (
                            <span className={styles.input_selected_title}>
                              {selectedEventEdition} %
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
                      <RangeSlider
                        state={selectedEventEdition}
                        setState={setSelectedEventEdition}
                      />
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Event Keywords
                          {selectedEventKeywords?.length > 1 ? (
                            <span className={styles.input_selected_no}>
                              {selectedEventKeywords.length}
                            </span>
                          ) : (
                            <span className={styles.input_selected_title}>
                              {selectedEventKeywords[0]}
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
                  <Popover className={styles.filterPopover}>
                    <Dialog className={styles.dialogBorder}>
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
                <MenuTrigger onOpenChange={setMenuOpen}>
                  <div>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Branded Event
                          {/* {selectedEventAttendanceRange[0] !== undefined ? (
                            <span className={styles.input_selected_title}>
                              {`${selectedEventAttendanceRange[0]} - ${selectedEventAttendanceRange[1] || "Unlimited"
                                }`}
                              {`${selectedEventAttendanceRange[0]} - ${selectedEventAttendanceRange[1] || "Unlimited"
                                }`}
                            </span>
                          ) : (
                            ""
                          )} */}
                        </div>

                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={() => {
                                  setSelectedBrandedEvent((prev) => !prev);
                                }}
                                checked={selectedBrandedEvent}
                              />
                              <span className={styles.slider}></span>
                            </label>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Trust Score
                          {selectedTrustScore !== 0 && (
                            <span className={styles.input_selected_title}>
                              {selectedTrustScore} %
                            </span>
                          )}
                        </div>

                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={() => {}}
                                checked={selectedTrustScore !== 0}
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
                          state={selectedTrustScore}
                          setState={setSelectedTrustScore}
                        />
                      )}
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <div>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>Event Series</div>

                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={() => {
                                  setSelectedEventSeries((prev) => !prev);
                                }}
                                checked={selectedEventSeries}
                              />
                              <span className={styles.slider}></span>
                            </label>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Reputation Score
                          {selectedReptScore !== 0 && (
                            <span className={styles.input_selected_title}>
                              {selectedReptScore} %
                            </span>
                          )}
                        </div>

                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={() => {}}
                                checked={selectedReptScore !== 0}
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
                          state={selectedReptScore}
                          setState={setSelectedReptScore}
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
                          Maturity
                          {maturity && maturity?.length > 0 && (
                            <span className={styles.input_selected_title}>
                              {maturity}
                            </span>
                          )}
                        </div>
                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={() => {}}
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
                    {/* <Dialog> */}
                    <MaturitySlider
                      state={selectedMaturity}
                      setState={setSelectedMaturity}
                    />
                    {/* </Dialog> */}
                  </Popover>
                </MenuTrigger>
              </div>
            )}

            {/* AUDIENCE INTEL */}
            {showAdvanceFilter && selectedAdvFilter === "AI" && (
              <div className={styles.inputdropdowns_container_AI}>
                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={styles.dropdown_button}>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          International Score
                          {intScore && intScore?.length > 0 && (
                            <span className={styles.input_selected_title}>
                              {intScore}
                            </span>
                          )}
                        </div>
                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={() => {}}
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
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button>
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
                                onChange={() => {}}
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
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
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

                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={() => {}}
                                checked={selectedUserRatings.length !== 0}
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
                        <UserRatings
                          state={selectedUserRatings}
                          setState={setSelectedUserRatings}
                        />
                      )}
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Estimated Exhibit Score
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

                        <div className={styles.toggle_container}>
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
                  </Button>
                  <Popover>
                    <Dialog className={styles.noBorder}>
                      {({ close }) => (
                        <EventAdvFilter
                          state={selectedExhibitScore}
                          setState={setSelectedExhibitScore}
                          data={eventExhibitScoreData}
                        />
                      )}
                    </Dialog>
                  </Popover>
                </MenuTrigger>
              </div>
            )}
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default Pages;
