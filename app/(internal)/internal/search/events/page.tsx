"use client";
import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./search.module.css";
import { EventDataType } from "@/app/components/types/allevents";

import SearchIcon from "/public/search.svg";
// import DropIcon from "/public/internal/dropdown_arrow.svg";
import DropIcon from "/public/downArrow.svg";
import ExportIcon from "/public/internal/ExportIcon.svg";

import CategoryDropdown from "@/app/components/dropdown/CategoryDropwdown";
import LabelDropdown from "@/app/components/dropdown/LabelDropdown";
import LocationDropdown from "@/app/components/dropdown/LocationDropdown";
import RecentSearches from "@/app/components/Search/RecentSearches";
import RankInput from "@/app/components/Search/Dropdowns/RankInput";
import EventAttendance from "@/app/components/Search/Dropdowns/EventAttendence";
import EventStatus from "@/app/components/Search/Dropdowns/EventStatus";
import ExportModal from "@/app/components/Search/ExportModal";
// import { insightsScore } from "@/public/data/researchData";

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
import { useTheme } from "@/context";
import CloseIcon from "/public/internal/cross.svg";
import FilterIcon from "/public/internal/advanceFilter.svg";
// import { MapStyle } from "@/components/Map";
// const Calendar = lazy(() => import("@/components/Calendar"));
// const Map = lazy(() => import("@/components/Map"));
const Calendar = lazy(
  () => import("@/app/components/employee/calendarcontainer/CalendarContainer")
);
const Map = lazy(() => import("@/app/components/employee/mapview/Map"));
const Table = lazy(() => import("@/app/components/Table"));

interface InsightsType {
  [key: string]: boolean;
}

//JSON Data files:
import eventFormatData from "../../../../../public/data/advanceFilterFormat.json";
import eventFrequencyData from "../../../../../public/data/eventFrequency.json";
import eventEntryData from "../../../../../public/data/eventEntry.json";
import eventRankData from "../../../../../public/data/eventRank.json";
import eventExhibitScoreData from "../../../../../public/data/eventExhibitScore.json";
import { myFetch } from "@/utils/myFetch";
import { saveTracker } from "@/utils/saveTracker";
import { baseUrl } from "@/constants";
import IntScoreSlider from "@/app/components/Search/ui/IntScoreSlider";
import MaturitySlider from "@/app/components/Search/ui/MaturitySlider";
import { toast, ToastContainer } from "react-toastify";
import { GAEvent } from "@/utils/GAEvent";
import { Step } from "react-joyride";
import JoyRideCustom from "@/app/components/internal/walkthrough/JoyRideCustom";

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [selectedView, setSelectedView] = useState("list");
  const [searchInput, setSearchInput] = useState("");
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [eventData, setEventData] = useState<EventDataType | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",") || []
  );
  const [categorySlug, setCategorySlug] = useState<string[]>(
    searchParams.get("categories")?.split(",") || []
  );

  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    searchParams.get("location")?.split(",") || []
  );
  interface SelectedLocation {
    [id: string]: string;
  }
  const [selectedCity, setSelectedCity] = useState<SelectedLocation>({});
  const [selectedCountry, setSelectedCountry] = useState<SelectedLocation>({});
  const [selectedZone, setSelectedZone] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    searchParams.get("labels")?.split(",") || []
  );
  const [selectedEventKeywords, setSelectedEventKeywords] = useState<string[]>(
    searchParams.get("eventKeywords")?.split(",") || []
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
  const [showAdvanceFilter, setShowAdvanceFilter] = useState(false);
  const [selectedAdvFilter, setSelectedAdvFilter] = useState("AP");
  const [selectedBrandedEvent, setSelectedBrandedEvent] = useState(false);
  const [selectedEventSeries, setSelectedEventSeries] = useState(false);
  const [selectedTrustScore, setSelectedTrustScore] = useState(0);
  const [selectedReptScore, setSelectedReptScore] = useState(0);
  const [selectedMaturity, setSelectedMaturity] = useState(0);
  const [selectedInboundScore, setSelectedInboundScore] = useState(0);
  const [selectedEventEdition, setSelectedEventEdition] = useState(0);
  const [selectedINScore, setSelectedINScore] = useState(0);

  const [categoryData, setCatgeoryData] = useState([]);

  //WalkThrough
  const [steps, setSteps] = useState<Step[]>([]);

  // Refs for WalkThrough...
  const searchbarRef = useRef(null);
  const basicFilterRef = useRef(null);
  const advanceFilterRef = useRef(null);
  const [run, setRun] = useState<boolean>(true);

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
  console.log(selectedUserRatings);
  const [selectedInsights, setSelectedInsights] = useState<InsightsType>({});

  const createTrackerHandler = () => {
    GAEvent("research", "Filters", "Saved Filter | Viewed", "Saved Filter");
    const trackerFilters: any = {};
    if (selectedCategories.length > 0) {
      trackerFilters.category = selectedCategories;
    }
    if (selectedLabels.length > 0) {
      trackerFilters.labels = selectedLabels;
    }
    if (selectedEventStatus.length > 0) {
      trackerFilters.status = selectedEventStatus;
    }
    if (selectedLocations.length > 0) {
      trackerFilters.city = ["London"];
    }
    if (selectedDateRange[0] && selectedDateRange[1]) {
      trackerFilters.active_gte = new Date(selectedDateRange[0]).toISOString();
      trackerFilters.active_lte = new Date(selectedDateRange[1]).toISOString();
    }

    if (selectedEventAttendanceRange.length > 0) {
      trackerFilters.total_attendance_gte = +selectedEventAttendanceRange[0];
      trackerFilters.total_attendance_lte =
        selectedEventAttendanceRange[1] === "Unlimited"
          ? 1000000
          : +selectedEventAttendanceRange[1];
    }
    if (selectedEventRank[0] !== 0 || selectedEventRank[1] !== 100) {
      trackerFilters.event_rank_gte = Math.floor(selectedEventRank[0]);
      trackerFilters.event_rank_lte = Math.floor(selectedEventRank[1]);
    }

    if (selectedLocalRank[0] !== 0 || selectedLocalRank[1] !== 100) {
      trackerFilters.local_rank_gte = Math.floor(selectedLocalRank[0]);
      trackerFilters.local_rank_lte = Math.floor(selectedLocalRank[1]);
    }
    if (selectedAviationRank[0] !== 0 || selectedAviationRank[1] !== 100) {
      trackerFilters.aviation_rank_gte = Math.floor(selectedAviationRank[0]);
      trackerFilters.aviation_rank_lte = Math.floor(selectedAviationRank[1]);
    }

    saveTracker({
      trackerName: "Default Tracker",
      filters: trackerFilters,
    }).then((value) => {
      if (value !== undefined) {
        toast.success("Tracker created successfully!", {
          position: "bottom-right",
          autoClose: 2000,
          // closeButton: false,
          hideProgressBar: true,
        });
      } else {
        toast.error("Tracker not created!", {
          position: "bottom-right",
          autoClose: 2000,
          // closeButton: false,
          hideProgressBar: true,
        });
      }
    });
  };

  const searchHandler = () => {
    GAEvent("research", "Filters", "Filter Applied", "Apply");
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
    if (selectedEventFormat.length > 0) {
      params.set("eventFormat", selectedEventFormat.join(","));
    }
    if (selectedEntry.length > 0) {
      params.set("eventEntry", selectedEntry.join(","));
    }

    // router.push(`/search/events?${params.toString()}`);
    createQueryString();
  };

  const [urlQueryString, setUrlQueryString] = useState<string>("");

  const createQueryString = () => {
    const queryString: { [key: string]: any } = {};

    // Event Ids
    if (Object.keys(selectedEvents).length > 0) {
      queryString.eventId = Object.keys(selectedEvents);
    }

    // Category
    if (selectedCategories.length > 0) {
      queryString.eventCategory = selectedCategories;
    }

    // Location - Event Country
    if (Object.entries(selectedCountry).length > 0) {
      // queryString.eventRegion = selectedLocations;
      queryString.eventCountry = Object.keys(selectedCountry);
    }

    // Event City
    if (Object.entries(selectedCity).length > 0) {
      queryString.eventCity = Object.keys(selectedCity);
    }

    // Event zone
    if (selectedZone.length > 0) {
      queryString.eventRegion = selectedZone;
    }

    // Labels
    if (selectedLabels.length > 0) {
      queryString.labels = selectedLabels;
    }

    // Rank
    if (selectedEventRank[0] !== 0 || selectedEventRank[1] !== 100) {
      queryString.eventRank = selectedEventRank;
    }

    // Local Rank
    if (selectedLocalRank[0] !== 0 || selectedLocalRank[1] !== 100) {
      queryString.localRank = selectedLocalRank;
    }

    // Dates
    if (selectedDateRange[0]) {
      queryString.startDate = [
        new Date(selectedDateRange[0]).toISOString().split("T")[0],
        new Date(selectedDateRange[1]).toISOString().split("T")[0],
      ];
    }

    if (selectedDateRange[1]) {
      queryString.endDate = [
        new Date(selectedDateRange[0]).toISOString().split("T")[0],
        new Date(selectedDateRange[1]).toISOString().split("T")[0],
      ];
    }

    // Event Status
    if (selectedEventStatus.length > 0) {
      queryString.eventStatus = selectedEventStatus;
    }

    // Event ATTENDANCE
    if (selectedEventAttendanceRange.length > 0) {
      queryString.eventAttendanceRange = selectedEventAttendanceRange;
    }

    // Event Format
    if (selectedEventFormat.length > 0) {
      queryString.eventFormat = selectedEventFormat;
    }

    // Event Frequency
    if (selectedEventFrequency.length > 0) {
      queryString.eventFrequency = selectedEventFrequency;
    }

    // Event Entry
    if (selectedEntry.length > 0) {
      queryString.eventEntry = selectedEntry;
    }

    // Event Edition
    if (selectedEventEdition > 0) {
      queryString.editionRange = selectedEventEdition;
    }

    // Event Keywords
    if (selectedEventKeywords.length > 0) {
      queryString.eventKeywords = selectedEventKeywords.join("+");
    }

    // Event Ranking
    if (selectedEventRanking.length > 0) {
      queryString.eventRanking = selectedEventRanking;
    }

    // Branded Event
    if (selectedBrandedEvent) {
      queryString.brandedEvent = selectedBrandedEvent;
    }

    // Trust Score
    if (selectedTrustScore > 0) {
      queryString.trustScore = selectedTrustScore;
    }

    // Event Series
    if (selectedEventSeries) {
      queryString.eventSeries = selectedEventSeries;
    }

    // Reputation Score
    if (selectedReptScore > 0) {
      queryString.reputationScore = selectedReptScore;
    }

    // Maturity
    if (selectedMaturity > 0) {
      // queryString.maturity = selectedMaturity;
      if (selectedMaturity >= 1 && selectedMaturity <= 25)
        queryString.maturity = "new";
      else if (selectedMaturity >= 26 && selectedMaturity <= 50)
        queryString.maturity = "low";
      else if (selectedMaturity >= 51 && selectedMaturity <= 75)
        queryString.maturity = "medium";
      else queryString.maturity = "High";
    }

    // Int. Score
    if (selectedINScore > 0) {
      if (selectedINScore >= 1 && selectedINScore <= 25)
        queryString.internationalScore = "local";
      else if (selectedINScore >= 26 && selectedINScore <= 50)
        queryString.internationalScore = "National";
      else if (selectedINScore >= 51 && selectedINScore <= 75)
        queryString.internationalScore = "Regional";
      else queryString.internationalScore = "International";
    }

    // Inbound Score
    if (selectedInboundScore > 0) {
      queryString.inboundScore = selectedInboundScore;
    }

    // User Ratings
    if (selectedUserRatings.length > 0) {
      queryString.eventRating = selectedUserRatings;
    }

    // Estimated Exhibit Score
    if (selectedExhibitScore.length > 0) {
      queryString.eventSize = selectedExhibitScore;
    }

    let query = new URLSearchParams(queryString);
    const finalQueryString = query.toString();
    setUrlQueryString(finalQueryString);
  };

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

  console.log(selectedDateRange);
  const filters: { [key: string]: any } = {};

  if (searchInput) {
    filters.eventName = searchInput;
  }

  if (selectedCategories.length > 0) {
    filters.eventCategory = selectedCategories;
  }

  if (selectedLocations.length > 0) {
    filters.eventRegion = selectedLocations;
  }

  if (selectedEventRank[0] !== 0 || selectedEventRank[1] !== 100) {
    filters.eventRank = selectedEventRank;
  }

  if (selectedDateRange[0]) {
    filters.startDate = [
      new Date(selectedDateRange[0]).toISOString().split("T")[0],
      new Date(selectedDateRange[1]).toISOString().split("T")[0],
    ];
  }

  if (selectedDateRange[1]) {
    filters.endDate = [
      new Date(selectedDateRange[0]).toISOString().split("T")[0],
      new Date(selectedDateRange[1]).toISOString().split("T")[0],
    ];
  }

  if (selectedEventStatus.length > 0) {
    filters.eventStatus = selectedEventStatus;
  }

  if (selectedEventFormat.length > 0) {
    filters.eventFormat = selectedEventFormat;
  }

  if (selectedEntry.length > 0) {
    filters.eventEntry = selectedEntry;
  }

  if (selectedEventKeywords.length > 0) {
    filters.eventKeywords = selectedEventKeywords;
  }

  if (selectedUserRatings.length > 0) {
    filters.eventRating = selectedUserRatings;
  }

  if (selectedExhibitScore.length > 0) {
    filters.eventSize = selectedExhibitScore;
  }

  console.log(filters);

  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<{
    [key: string]: string;
  }>({});

  const [isSearchResultOpen, setSearchResultOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleSearchInput = async (text: string) => {
    if (text) {
      const { data, error } = await myFetch(
        `${baseUrl}/event/search?eventName=${text}&max=5`
      );
      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        console.log(data);
        setSearchResult(data.events);
      }
    } else {
      setSearchResult([]);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setSearchInput(event.target.value);
    setText(inputValue);
    setSearchResultOpen(true);
  };

  const eventSelectHandler = (eventId: string, eventName: string) => {
    if (!selectedEvents[eventId]) {
      setSelectedEvents((prev) => {
        if (Object.keys(prev).length + 1 > 4) {
          setShowAllEvents(true);
        }
        return { ...prev, [eventId]: eventName };
      });
    }
  };

  const removeSelectionHandler = (eventId: string) => {
    setSelectedEvents((prev) => {
      if (Object.keys(prev).length - 1 <= 4) {
        setShowAllEvents(false);
      }
      const updatedEvents = { ...prev };
      delete updatedEvents[eventId];
      return updatedEvents;
    });
  };

  useEffect(() => {
    setSelectedInsights({
      eventSize: true,
      eventKeywords: true,
      global: true,
      reptSent: true,
      eventRank: true,
      matchScore: true,
      estExhibit: true,
      growth: true,
      repeatSent: true,
      eventSeries: selectedEventSeries,
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setSearchResultOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedEventSeries]);

  // Auto apply search on filter change
  useEffect(() => {
    createQueryString();
  }, [
    selectedEventSeries,
    selectedBrandedEvent,
    selectedCategories,
    selectedLabels,
    selectedEventStatus,
    selectedDateRange,
    selectedEventFormat,
    selectedEventFrequency,
    selectedEntry,
    selectedEventEdition,
    selectedEventKeywords,
    selectedTrustScore,
    selectedReptScore,
    selectedMaturity,
    selectedINScore,
    selectedInboundScore,
    selectedUserRatings,
    selectedExhibitScore,
    selectedLocations,
  ]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearchInput(searchInput);
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [text]);

  useEffect(() => {
    if (searchbarRef.current && basicFilterRef.current && advanceFilterRef.current) {
      const newSteps: Step[] = [
        {
          target: searchbarRef.current,
          title: "Search Events",
          content: "Search for relevant events happening in any location",
          disableBeacon: true,
        },
        {
          target: basicFilterRef.current,
          title: "Search Events",
          content: "Search for relevant events happening in any location",
          disableBeacon: true,
        },
        {
          target: advanceFilterRef.current,
          title: "Search Events",
          content: "Search for relevant events happening in any location",
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
    }
  }, [searchbarRef.current, basicFilterRef.current, advanceFilterRef.current]);

  return (
    <Suspense fallback={<Loading />}>
      <div className={styles.container}>
        {steps.length > 0 && (
          <JoyRideCustom
            steps={steps}
            run={run}
            onFinish={() => setRun(false)}
          />
        )}
        <div className={styles.searchContainer}>
          <div className={styles.searchbar} ref={searchbarRef}>
            {Object.keys(selectedEvents).length > 0 && !showAllEvents && (
              <div className={styles.eventName_container}>
                {Object.entries(selectedEvents).map(
                  ([eventId, eventName], index) =>
                    index < 4 ? (
                      <div className={styles.eventName_chip} key={index}>
                        <span className={styles.eventName_chip_text}>
                          {eventName}
                        </span>
                        <Image
                          src={CloseIcon}
                          width={14}
                          height={14}
                          alt="close"
                          className={styles.closeChip}
                          onClick={() => removeSelectionHandler(eventId)}
                        />
                      </div>
                    ) : (
                      <></>
                    )
                )}
              </div>
            )}
            <input
              type="text"
              placeholder="Search Events"
              // onChange={(e) => setSearchInput(e.target.value)}
              onChange={handleSearchChange}
              value={searchInput}
            ></input>
            {/* <div
              className={styles.recentSearches_button}
              onClick={() => setShowRecentSearches(!showRecentSearches)}
            >
              Recent searches
            </div> */}
            <button onClick={searchHandler}>
              <Image src={SearchIcon} alt="search" className={iconClass} />
            </button>
          </div>

          {Object.keys(selectedEvents).length > 0 && showAllEvents && (
            <div className={styles.eventName_container2}>
              {Object.entries(selectedEvents).map(
                ([eventId, eventName], index) => (
                  <div className={styles.eventName_chip} key={0}>
                    <span className={styles.eventName_chip_text}>
                      {eventName}
                    </span>
                    <Image
                      src={CloseIcon}
                      width={14}
                      height={14}
                      alt="close"
                      className={styles.closeChip}
                      onClick={() => removeSelectionHandler(eventId)}
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>
        {isSearchResultOpen && searchResult && searchResult.length > 0 && (
          <div
            ref={triggerRef}
            className={`${styles.resultContainer} ${
              theme === "light" ? styles.resultContainer_light : ""
            }`}
          >
            <div className={styles.resultData_heading}>Suggestions</div>
            {searchResult.map((item) => (
              <div
                key={item.id}
                className={styles.resultData_list}
                onClick={() => eventSelectHandler(item.id, item.name)}
              >
                {item.name}
                <span className={styles.resultData_subHeading}>
                  {item.organizer.name}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className={styles.sub_container} ref={basicFilterRef}>
          <div className={styles.inputdropdowns_container}>
            <MenuTrigger onOpenChange={setMenuOpen}>
              <Button className={styles.dropdown_button}>
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
                      className={iconClass}
                    />
                  </div>
                </div>
              </Button>
              <Popover className={styles.filterPopover}>
                {/* <Dialog> */}
                <CategoryDropdown
                  state={selectedCategories}
                  setState={setSelectedCategories}
                  categoryData={categoryData}
                  categorySlug={categorySlug}
                  setCategorySlug={setCategorySlug}
                />
                {/* </Dialog> */}
              </Popover>
            </MenuTrigger>

            <MenuTrigger onOpenChange={setMenuOpen}>
              <Button className={styles.dropdown_button}>
                <div className={styles.input_container}>
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
                      className={iconClass}
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
                      className={iconClass}
                    />
                  </div>
                </div>
              </Button>
              <Popover className={styles.filterPopover}>
                {/* <Dialog> */}
                <LabelDropdown
                  state={selectedLabels}
                  setState={setSelectedLabels}
                />
                {/* </Dialog> */}
              </Popover>
            </MenuTrigger>

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
                      className={iconClass}
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

            <MenuTrigger onOpenChange={setMenuOpen}>
              <Button className={styles.dropdown_button}>
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
                      className={iconClass}
                    />
                  </div>
                </div>
              </Button>
              <Popover className={styles.filterPopover}>
                {/* <Dialog> */}
                <EventStatus
                  state={selectedEventStatus}
                  setState={setSelectedEventStatus}
                />
                {/* </Dialog> */}
              </Popover>
            </MenuTrigger>

            <MenuTrigger onOpenChange={setMenuOpen}>
              <Button className={styles.dropdown_button}>
                <div
                  className={styles.input_container}
                  style={{ width: "fit-content" }}
                >
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
                      className={iconClass}
                    />
                  </div>
                </div>
              </Button>
              <Popover className={styles.filterPopover}>
                <Dialog className={styles.dialogBorder}>
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

          <div className={styles.buttons_container}>
            <button
              className={styles.createtracker_button}
              onClick={createTrackerHandler}
            >
              Save as Tracker
            </button>
            <button
              onClick={() => {
                setShowAdvanceFilter((prev) => !prev);
                GAEvent(
                  "research",
                  "Filters",
                  "All Filter Modal | Viewed",
                  "More Filter Icon"
                );
              }}
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <Image src={FilterIcon} width={18} height={18} alt="filters" />
              <span className={styles.clearfilter_button}>
                {" "}
                Advanced Filters
              </span>
            </button>
          </div>
        </div>
        {/* {showRecentSearches && (
          // <RecentSearches setShowRecentSearches={setShowRecentSearches} />
        )} */}

        {/*   ADVANCE FILTER SECTION */}
        {showAdvanceFilter && (
          <div>
            <div
              className={`${styles.viewContainer} ${
                theme === "dark" ? "darkMode" : "lightMode_secondary"
              }`}
            >
              <div className={styles.viewTypeButtons_container}>
                <div
                  className={`${styles.advanceFilterBtns} ${
                    theme === "light" ? styles.advanceFilterBtns_light : ""
                  }`}
                >
                  <button
                    onClick={() => setSelectedAdvFilter("AP")}
                    className={`${styles.listBtn} ${
                      selectedAdvFilter === "AP" ? styles.active : ""
                    }`}
                  >
                    Advanced Details
                  </button>
                  <button
                    onClick={() => setSelectedAdvFilter("IS")}
                    className={`${styles.mapBtn} ${
                      selectedAdvFilter === "IS" ? styles.active : ""
                    }`}
                  >
                    Insights and Score
                  </button>
                  <button
                    onClick={() => setSelectedAdvFilter("AI")}
                    className={`${styles.calendarBtn} ${
                      selectedAdvFilter === "AI" ? styles.active : ""
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
                          Event Format
                          {selectedEventFormat?.length > 1 ? (
                            <span className={styles.input_selected_no}>
                              {selectedEventFormat.length}
                            </span>
                          ) : (
                            <span className={styles.input_selected_title}>
                              {selectedEventFormat[0]}
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
                  <Popover className={styles.filterPopover}>
                    {/* <Dialog> */}
                    <EventAdvFilter
                      state={selectedEventFormat}
                      setState={setSelectedEventFormat}
                      data={eventFormatData}
                    />
                    {/* </Dialog> */}
                  </Popover>
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
                          width={20}
                          height={20}
                          className={iconClass}
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

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={styles.dropdown_button}>
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
                  <Popover className={styles.filterPopover}>
                    {/* <Dialog> */}
                    <EventAdvFilter
                      state={selectedEntry}
                      setState={setSelectedEntry}
                      data={eventEntryData}
                    />
                    {/* </Dialog> */}
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={styles.dropdown_button}>
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
                          className={iconClass}
                        />
                      </div>
                    </div>
                  </Button>
                  <Popover className={styles.filterPopover}>
                    {/* <Dialog> */}
                    <RangeSlider
                      state={selectedEventEdition}
                      setState={setSelectedEventEdition}
                    />
                    {/* </Dialog> */}
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={styles.dropdown_button}>
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
                          className={iconClass}
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
                  <Button className={styles.dropdown_button}>
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
                          className={iconClass}
                        />
                      </div>
                    </div>
                  </Button>
                  <Popover className={styles.filterPopover}>
                    <EventAdvFilter
                      state={selectedEventRanking}
                      setState={setSelectedEventRanking}
                      data={eventRankData}
                    />
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
                  <Button className={styles.dropdown_button}>
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
                  <Popover className={styles.filterPopover}>
                    <RangeSlider
                      state={selectedTrustScore}
                      setState={setSelectedTrustScore}
                    />
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
                  <Button className={styles.dropdown_button}>
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
                  <Popover className={styles.filterPopover}>
                    <RangeSlider
                      state={selectedReptScore}
                      setState={setSelectedReptScore}
                    />
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={styles.dropdown_button}>
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
                                onChange={() => {}}
                                checked={selectedMaturity !== 0}
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
                                onChange={() => {}}
                                checked={selectedINScore !== 0}
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
                  <Button className={styles.dropdown_button}>
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
                  <Popover className={styles.filterPopover}>
                    <RangeSlider
                      state={selectedInboundScore}
                      setState={setSelectedInboundScore}
                    />
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={styles.dropdown_button}>
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
                  <Popover className={styles.filterPopover}>
                    <UserRatings
                      state={selectedUserRatings}
                      setState={setSelectedUserRatings}
                    />
                  </Popover>
                </MenuTrigger>

                <MenuTrigger onOpenChange={setMenuOpen}>
                  <Button className={styles.dropdown_button}>
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
                  <Popover className={styles.filterPopover}>
                    <EventAdvFilter
                      state={selectedExhibitScore}
                      setState={setSelectedExhibitScore}
                      data={eventExhibitScoreData}
                    />
                  </Popover>
                </MenuTrigger>
              </div>
            )}
          </div>
        )}

        <div
          className={`${styles.viewContainer} ${
            theme === "dark" ? "darkMode" : "lightMode_secondary"
          }`}
        >
          <div
            className={`${styles.viewTypeButtons_container} ${
              theme === "light" ? styles.viewTypeButtons_light : ""
            }`}
          >
            <div className={styles.viewTypeButtons}>
              <button
                onClick={() => setSelectedView("list")}
                className={`${styles.listBtn} ${
                  selectedView === "list" ? styles.active : ""
                } ${theme === "dark" ? "darkMode_secondary" : "lightMode"}`}
              >
                List
              </button>
              <button
                onClick={() => setSelectedView("map")}
                className={`${styles.mapBtn} ${
                  selectedView === "map" ? styles.active : ""
                } ${theme === "dark" ? "darkMode_secondary" : "lightMode"}`}
              >
                Map
              </button>
              <button
                onClick={() => setSelectedView("calendar")}
                className={`${styles.calendarBtn} ${
                  selectedView === "calendar" ? styles.active : ""
                } ${theme === "dark" ? "darkMode_secondary" : "lightMode"}`}
              >
                Calendar
              </button>
            </div>
          </div>

          <DialogTrigger>
            <Button
              className={styles.exportButton}
              onPress={() =>
                GAEvent("research", "Export", "Export Clicked", "Export Icon")
              }
            >
              <Image src={ExportIcon} width={20} height={20} alt="exporticon" />
              <div className={styles.exportedno_title}>Export</div>
            </Button>
            <ModalOverlay isDismissable className={styles.modalOverlay}>
              <Modal>
                <Dialog>
                  {({ close }) => (
                    <ExportModal onClose={close} filterValue={filters} />
                  )}
                </Dialog>
              </Modal>
            </ModalOverlay>
          </DialogTrigger>
        </div>
        {eventData?.events.length === 0 ? (
          <div className={styles.message}>No Events</div>
        ) : (
          <div className={styles.dataView}>
            {selectedView === "list" && (
              // <List />
              <Suspense fallback={<Loading />}>
                <Table
                  showInsights={selectedInsights}
                  queryString={urlQueryString}
                />
              </Suspense>
            )}
            {selectedView === "calendar" && (
              <Suspense fallback={<Loading />}>
                <Calendar queryString={urlQueryString} />
              </Suspense>
            )}
          </div>
        )}
      </div>
      {selectedView === "map" && (
        <Suspense fallback={<Loading />}>
          {/* <Map
            eventData={eventData}
            mapStyle={MapStyle.Light}
            style={{
              width: "calc(100vw - 97px)",
              height: "90vh",
            }}
          /> */}
          <Map queryString={urlQueryString} />
        </Suspense>
      )}
      <ToastContainer />
    </Suspense>
  );
};
export default Search;
