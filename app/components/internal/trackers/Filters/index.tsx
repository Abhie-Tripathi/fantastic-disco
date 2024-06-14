"use client";
import styles from "./filters.style.module.css";
import React, { useState, useEffect, Suspense, lazy } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
// import styles from "./search.module.css";
import { EventDataType } from "@/app/components/types/allevents";
import userOne from '/public/userOne.svg'
import SearchIcon from "/public/search.svg";
import DropIcon from "/public/internal/dropdown_arrow.svg";
import ExportIcon from "/public/internal/ExportIcon.svg";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
interface FilterValue {
  labels: string;
  name:string;
  category: any;
  eventFormat:string;
  eventStatus:string;
  eventFrequency:string;
  eventEntry:string;
  eventEdition:any;
  eventRanking:string;
  brandedEvent:boolean;
  trustScore:any;
  eventSeries:boolean;
  reputationScore:any;
  maturity:any;
  internationalScore: any;
  inboundScore:any;
  userRating:string;
  exhibitScore:string;
  total_attendance_gte:string;
  total_attendance_lte:string;
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

interface EditData {
  tracker: Tracker;
}
const Pages = () => {
  // const searchParams = useSearchParams();
  const pathName = usePathname().split('/');
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

  }, [last])

  const fetchData = async (secondLast: string) => {
    const url = `${baseUrl}/tracker/${secondLast}`;
    try {
      const { data, error } = await myFetch(url, {
        method: 'GET'
      });
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        console.log('Data fetched:', data);
        setEditData(data);
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    }
  };
  const [categories, setCategories] = useState(searchParams.get("categories")?.split(",") || []);
  const saveTrackerHandler = async () => {
    if (last === "editTracker") {


      const secondLast = pathName[pathName.length - 2];
      const formData = {

        name: trackerName,
        filterValue: {
          // labels: selectedLabels.join(','),
          category: selectedCategories.join(','),
          // labels: selectedLabels.join(','), 
          // city:selectedLocations,
          max: "100",
          // EventStatus: selectedEventStatus.join(','),
          // ...(selectedDateRange && selectedDateRange.length>0 &&{startDate: selectedDateRange[0]}),
          // ...(selectedDateRange && selectedDateRange.length>0 &&{endDate: selectedDateRange[1]}),
          // EventFormat:selectedEventFormat.join(','),
          // total_attendance_gte: +selectedEventAttendanceRange[0],
          // total_attendance_lte:
          // selectedEventAttendanceRange[1] === "Unlimited" ? 1000000 : +selectedEventAttendanceRange[1],
          // event_rank_gte: Math.floor(selectedEventRank[0]),
          // event_rank_lte: Math.floor(selectedEventRank[1]),
          // local_rank_gte: Math.floor(selectedLocalRank[0]),
          // local_rank_lte: Math.floor(selectedLocalRank[1]),
          // aviation_rank_gte: Math.floor(selectedAviationRank[0]),
          // aviation_rank_lte: Math.floor(selectedAviationRank[1]),
          // ...(selectedEventFormat && selectedEventFormat.length>0 &&{}),
          info: {
            name: trackerName,
            location:selectedLocations,
            keywords:selectedEventKeywords.join(','),
            labels: selectedLabels.join(','),
            startDate: selectedDateRange[0],
            endDate: selectedDateRange[1],
            eventFormat: selectedEventFormat.join(','),
            category: categorySlug.join(','),
            eventStatus: selectedEventStatus.join(','),
            eventFrequency: selectedEventFrequency.join(','),
            eventEntry: selectedEntry.join(','),
            eventEdition: selectedEventEdition.toString(),
            eventKeywords: selectedLabels.join(','),
            eventRanking: selectedEventRanking.join(','),
            brandedEvent: selectedBrandedEvent,
            trustScore: selectedTrustScore.toString(),
            eventSeries: selectedEventSeries,
            reputationScore: selectedReptScore.toString(),
            maturity: selectedMaturity.toString(),
            internationalScore: selectedINScore.toString(),
            inboundScore: selectedInboundScore.toString(),
            userRating: selectedUserRatings.join(','),
            exhibitScore: selectedExhibitScore.join(','),
            total_attendance_gte: selectedEventAttendanceRange[0],
            total_attendance_lte:
              selectedEventAttendanceRange[1] === "Unlimited" ? 1000000 : selectedEventAttendanceRange[1],
          }
        }
      };
      console.log(formData);
      console.log(`${baseUrl}/tracker/${secondLast}`);
      if(selectedLocations.length===0){
        console.log("Please, Fill all the details");
        return;
      }
      // if (
      //   trackerName.length===0||
      //   selectedCategories.length === 0 ||
      //   selectedLabels.length === 0 ||
      //   selectedDateRange.length === 0 ||
      //   selectedEventStatus.length === 0
      // ) {
      //   console.log("Please, Fill all the details");
      //   return;
      // }
      const { data, error } = await myFetch(`${baseUrl}/tracker/${secondLast}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (data)
        console.log(data);
      else console.log(error);


    }
    // console.log(selectedDateRange.length);
    else {
      // console.log(s);
      // const formData={
      //   "name": "hijkl",
      //   "filterValue": {
      //     "category": "7d8710f6-8f45-46c4-8287-f449cbb407d1,f98c3c88-853b-4406-9dd4-890ffd64523f,671b1a45-d40f-4559-959f-cd7a9b1617de,4612db12-9084-4d61-901d-ab7bd3120ade,8ba29ba3-e61a-42c1-b8d9-747b6cb8797e,0de9578c-ec7c-436a-8df7-19ec848a95fd,9c33f09d-f2f7-4ac6-bc56-8fbda48c97d1",
      //     "eventFormat": "online,offline,hybrid",
      //     "eventStatus": "ACTIVE,POSTPONED,PREDICTED",
      //     "labels": "one,two,three,five",
      //     "info": {
      //       "brandedEvent": true,
      //      "category": "community,concerts,conferences,expos,festivals,performing-arts,sports",
      //       "eventEdition": "51",
      //       "eventEntry": "paid,free,invite",
      //       "eventFrequency": "annual,biannual,quarterly",
      //       "eventKeywords": "",
      //       "eventRanking": "countryRank,categoryRank",
      //       "eventSeries": false,
      //       "eventStatus": "ACTIVE,POSTPONED,PREDICTED",
      //       "exhibitScore": "500-1000,100-500",
      //       "inboundScore": "45",
      //       "internationScore": "51",
      //       "labels": "",
      //       "maturity": "48",
      //       "reputationScore": "56",
      //       "total_attendance_gte": "0",
      //       "total_attendance_lte": "1000",
      //       "trustScore": "44",
      //       "userRating": "3+,4+"
      //     }
      //   },
      //   "max": "100"
      // }
      const formData = {
        name: trackerName,
        filterValue: {
          // labels: selectedLabels.join(','),
          category: selectedCategories.join(','),
          // labels: selectedLabels.join(','), 
          // city:selectedLocations,
          max: "100",
          // EventStatus: selectedEventStatus.join(','),
          // ...(selectedDateRange && selectedDateRange.length>0 &&{startDate: selectedDateRange[0]}),
          // ...(selectedDateRange && selectedDateRange.length>0 &&{endDate: selectedDateRange[1]}),
          // EventFormat:selectedEventFormat.join(','),
          // total_attendance_gte: +selectedEventAttendanceRange[0],
          // total_attendance_lte:
          // selectedEventAttendanceRange[1] === "Unlimited" ? 1000000 : +selectedEventAttendanceRange[1],
          // event_rank_gte: Math.floor(selectedEventRank[0]),
          // event_rank_lte: Math.floor(selectedEventRank[1]),
          // local_rank_gte: Math.floor(selectedLocalRank[0]),
          // local_rank_lte: Math.floor(selectedLocalRank[1]),
          // aviation_rank_gte: Math.floor(selectedAviationRank[0]),
          // aviation_rank_lte: Math.floor(selectedAviationRank[1]),
          // ...(selectedEventFormat && selectedEventFormat.length>0 &&{}),
          info: {
            name: trackerName,
            location:selectedLocations,
            keywords:selectedEventKeywords.join(','),
            labels: selectedLabels.join(','),
            startDate: selectedDateRange[0],
            endDate: selectedDateRange[1],
            eventFormat: selectedEventFormat.join(','),
            category: categorySlug.join(','),
            eventStatus: selectedEventStatus.join(','),
            eventFrequency: selectedEventFrequency.join(','),
            eventEntry: selectedEntry.join(','),
            eventEdition: selectedEventEdition.toString(),
            eventKeywords: selectedLabels.join(','),
            eventRanking: selectedEventRanking.join(','),
            brandedEvent: selectedBrandedEvent,
            trustScore: selectedTrustScore.toString(),
            eventSeries: selectedEventSeries,
            reputationScore: selectedReptScore.toString(),
            maturity: selectedMaturity.toString(),
            internationalScore: selectedINScore.toString(),
            inboundScore: selectedInboundScore.toString(),
            userRating: selectedUserRatings.join(','),
            exhibitScore: selectedExhibitScore.join(','),
            total_attendance_gte: selectedEventAttendanceRange[0],
            total_attendance_lte:
              selectedEventAttendanceRange[1] === "Unlimited" ? 1000000 : selectedEventAttendanceRange[1],
          }
        },
      };
      console.log(formData);
      // console.log(selectedCategories);

      // if (
      //   trackerName.length===0||
      //   selectedCategories.length === 0 ||
      //   selectedLabels.length === 0 ||
      //   selectedDateRange.length === 0 ||
      //   selectedEventStatus.length === 0
      // ) {
      //   console.log("Please, Fill all the details");
      //   return;
      // }
      // setIsSaving(true);

      // if (
      //   categories.length === 0 ||
      //   labels.length === 0 ||
      //   dateRange.length === 0 ||
      //   eventStatus.length === 0
      // ) {
      //   console.log("Please, Fill all the details");
      //   return;
      // }

      // setIsSaving(true);

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
        // setIsSaving(false);
        // setIsSaving(false);
        return;
      }
      if (data) {
        // setIsSaving(false);
        // setIsSaving(false);
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
    if (editData && editData?.tracker && last==="editTracker") {
      const newArr: string[] = [
        ...(categoryData?.attendedCategories ?? []),
        ...(categoryData?.nonAttendedCategories ?? []),
        ...(categoryData?.unscheduledCategories ?? [])
      ];
      const filteredArr = newArr
        .filter((item: any) => editData.tracker.filterValue?.category?.split(',').includes(item?.slug))
        .map((item: any) => item.id);
      console.log(filteredArr);

      setTrackerName(editData?.tracker?.filterValue?.name || '');
      setSelectedLabels(editData?.tracker?.filterValue?.labels.split(',') || []);
      setSelectedCategories(filteredArr|| []);
      setSelectedEventFormat(editData?.tracker?.filterValue?.eventFormat?.split(','));
      setSelectedEventStatus(editData?.tracker?.filterValue?.eventStatus.split(','));
      setCategorySlug(editData.tracker.filterValue?.category || []);
      setSelectedEventFrequency(editData?.tracker?.filterValue?.eventFrequency.split(','))
      setSelectedEntry(editData.tracker.filterValue?.eventEntry.split(',') || [])
      setSelectedEventEdition(editData.tracker.filterValue?.eventEdition.split(',') || [])
      setSelectedEventRanking(editData.tracker.filterValue?.eventRanking.split(',') || [])
      setSelectedBrandedEvent(editData.tracker.filterValue?.brandedEvent);
      setSelectedTrustScore(editData.tracker.filterValue?.trustScore>0?editData.tracker.filterValue?.trustScore:0);
      setSelectedEventSeries(editData.tracker.filterValue?.eventSeries);
      setSelectedReptScore(editData.tracker.filterValue?.reputationScore>0?editData.tracker.filterValue?.reputationScore:0);
      setSelectedMaturity(editData.tracker.filterValue?.maturity>0?editData.tracker.filterValue?.maturity:0)
      setSelectedINScore(editData.tracker.filterValue?.internationalScore>0?editData.tracker.filterValue?.internationalScore:0)
      setSelectedInboundScore(editData.tracker.filterValue?.inboundScore>0?editData.tracker.filterValue?.inboundScore :0)
      setSelectedUserRatings(editData.tracker.filterValue?.userRating.length!==0?editData.tracker.filterValue?.userRating.split(',') : [])
      setSelectedExhibitScore(editData.tracker.filterValue?.exhibitScore.length!==0?editData.tracker.filterValue?.exhibitScore.split(','): [])
      setCategorySlug(editData.tracker.filterValue?.category.split(',') || [])
      setSelectedEventAttendanceRange(prevArray => {
        const newArray = [...prevArray]; // Create a copy of the array
        newArray[0] = editData.tracker.filterValue?.total_attendance_gte;
        newArray[1] = editData.tracker.filterValue?.total_attendance_lte;
        return newArray; // Return the updated array
      });
    }


  }, [editData])

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
  return (
    <>
      <div className={styles.topContainer}>
        <div className={styles.topInnerContainerLeft}>
          <div>
            <Image src={userOne} alt="userOne" />
          </div>
          <div>
            <div className={styles.createHead}>Create Custom Tracker</div>
            <div className={styles.createContent}>Select from the available data filters to create a custom tracker</div>
          </div>
        </div>

        <div className={styles.topInnerContainerRight}>
          <Link href='/internal/trackers' style={{ display: "flex" }}>
            <button className={styles.cancel}>Cancel</button>
          </Link>
          <button className={styles.save} onClick={saveTrackerHandler}>Save Tracker</button>
        </div>

      </div>
      <div className={styles.searchContainer}>
        <input className={styles.textArea} type='text' placeholder='Enter Tracker Name'
          value={trackerName}
          onChange={(event) => setTrackerName(event.target.value)}
        />
      </div>
      <Suspense fallback={<Loading />}>
        <div className={styles.container}>
          {/* <div className={styles.searchbar}>
    <Suspense fallback={<Loading />}>
      <div className={styles.container}>
        {/* <div className={styles.searchbar}>
        <input
          type="text"
          placeholder="Search Events"
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
        ></input>
        <div
          className={styles.recentSearches_button}
          onClick={() => setShowRecentSearches(!showRecentSearches)}
        >
          Recent searches
        </div>
        <button onClick={searchHandler}>
          <Image src={SearchIcon} alt="search" />
        </button>
      </div> */}
          <div className={styles.sub_container}>
            <div className={styles.inputdropdowns_container}>
              <MenuTrigger onOpenChange={setMenuOpen}>
                <Button>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                        Category
                        {selectedCategories?.length > 1 ? (
                          <span className={styles.input_selected_no}>
                            {selectedCategories.length}
                          </span>
                        ) : (
                          <span className={styles.input_selected_title}>
                            {selectedCategories[0]}
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
                <Button>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                        Location
                        <span className={styles.input_selected_title}>
                          {selectedLocations[0]}
                        </span>
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
                      <LocationDropdown
                        state={selectedLocations}
                        setState={setSelectedLocations}
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
              </MenuTrigger>
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

              {/* <MenuTrigger>
              <Button>
                <div className={styles.input_container}>
                  <div className={styles.input}>
                    <div className={styles.input_title}>Rank</div>
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
            </MenuTrigger> */}

              <MenuTrigger onOpenChange={setMenuOpen}>
                <Button className={styles.input_container}>
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
                    <Image src={DropIcon} alt="dropicon" width={20} height={20} />
                  </div>
                </Button>
                <Popover>
                  <Dialog>
                    <DateRange
                      state={selectedDateRange}
                      setState={setSelectedDateRange}
                    />
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
              className={`${styles.viewContainer} ${theme === "light"
                  ? styles.viewContainerLight
                  : styles.viewContainerDark
                }`}
            >
              <div className={styles.viewTypeButtons_container}>
                <div className={styles.advanceFilterBtns}>
                  <button
                    onClick={() => setSelectedAdvFilter("AP")}
                    className={`${styles.listBtn} ${selectedAdvFilter === "AP" ? styles.active : ""
                      } `}
                    style={{ background: theme === "light" ? "white" : "" }}
                  >
                    Advanced Details
                  </button>
                  <button
                    onClick={() => setSelectedAdvFilter("IS")}
                    className={`${styles.mapBtn} ${selectedAdvFilter === "IS" ? styles.active : ""
                      }`}
                    style={{ background: theme === "light" ? "white" : "" }}
                  >
                    Insights and Score
                  </button>
                  <button
                    onClick={() => setSelectedAdvFilter("AI")}
                    className={`${styles.calendarBtn} ${selectedAdvFilter === "AI" ? styles.active : ""
                      }`}
                    style={{ background: theme === "light" ? "white" : "" }}
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
                          Event Format
                          {selectedEventFormat?.length > 1 ? (
                            <span className={styles.input_selected_no}>
                              {selectedEventFormat.length}
                            </span>
                          ) : (
                            <span className={styles.input_selected_title}>
                              {selectedEventFormat &&selectedEventFormat[0]}
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
                    <Dialog className={styles.noBorder} >
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

                <MenuTrigger onOpenChange={setMenuOpen}>
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
                </MenuTrigger>
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
                          {selectedEventAttendanceRange[0] !== undefined ? (
                            <span className={styles.input_selected_title}>
                              {`${selectedEventAttendanceRange[0]} - ${selectedEventAttendanceRange[1] || "Unlimited"
                                }`}
                              {`${selectedEventAttendanceRange[0]} - ${selectedEventAttendanceRange[1] || "Unlimited"
                                }`}
                            </span>
                          ) : (
                            ""
                          )}
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
                                onChange={() => { }}
                              // checked={}
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
                  <Button>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Maturity
                          {selectedMaturity !== 0 && (
                            <span className={styles.input_selected_title}>
                              {selectedMaturity} %
                            </span>
                          )}
                        </div>
                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={() => { }}
                                checked={selectedMaturity !== 0}
                              // checked={}
                              // checked={}
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
                      <RangeSlider
                        state={selectedMaturity}
                        setState={setSelectedMaturity}
                      />
                    </Dialog>
                  </Popover>
                </MenuTrigger>
              </div>
            )}

            {/* AUDIENCE INTEL */}
            {showAdvanceFilter && selectedAdvFilter === "AI" && (
              <div className={styles.inputdropdowns_container_AI}>
                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          International Score
                          {selectedINScore !== 0 && (
                            <span className={styles.input_selected_title}>
                              {selectedINScore} %
                            </span>
                          )}
                        </div>
                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={() => { }}
                                checked={selectedINScore !== 0}
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
                          state={selectedINScore}
                          setState={setSelectedINScore}
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
                                onChange={() => { }}
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
