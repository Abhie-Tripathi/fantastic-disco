"use client";
import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.style.module.css";
import { myFetch } from "@/utils/myFetch";
import { EventDataType } from "@/app/components/types/allevents";

import SearchIcon from "/public/internal/SearchInput.svg";
import DropIcon from "/public/internal/arrow_drop_down.svg";
import ExportIcon from "/public/internal/ExportIcon.svg";

import CategoryDropdown from "@/app/components/dropdown/CategoryDropwdown";
import LabelDropdown from "@/app/components/dropdown/LabelDropdown";
import LocationDropdown from "@/app/components/dropdown/LocationDropdown";
import RecentSearches from "@/app/components/Search/RecentSearches";
import DateRangeInput from "@/app/components/dropdown/DateRangeInput";
import RankInput from "@/app/components/Search/Dropdowns/RankInput";
import EventAttendance from "@/app/components/Search/Dropdowns/EventAttendence";
import EventStatus from "@/app/components/Search/Dropdowns/EventStatus";
import ExportModal from "@/app/components/Search/ExportModal";

import List from "@/app/components/List";
import Loading from "@/app/components/UI/Loading";
// import { searchEvents } from "@/services/eventsService";
const Calendar = lazy(() => import("@/app/components/employee/calendarcontainer/CalendarContainer"));
const Map = lazy(() => import("@/app/components/employee/mapview/Map"));

const Search = () => {
//   const searchParams = useSearchParams();
  const router = useRouter();
  const categoryDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const labelDropdownRef = useRef(null);
  const rankDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const eventStatusDropdownRef = useRef(null);
  const eventAttendanceDropdownRef = useRef(null);

  const [selectedView, setSelectedView] = useState("list");
  const [searchInput, setSearchInput] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [eventData, setEventData] = useState<EventDataType | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedEventRank, setSelectedEventRank] = useState([0, 100]);
  const [selectedLocalRank, setSelectedLocalRank] = useState([0, 100]);
  const [selectedAviationRank, setSelectedAviationRank] = useState([0, 100]);
  const [selectedDateRange, setSelectedDateRange] = useState<string[]>([]);
  const [selectedEventStatus, setSelectedEventStatus] = useState<string[]>([]);
  const [selectedEventAttendanceRange, setSelectedEventAttendanceRange] =
    useState<string[]>([]);

  const handleDropdownClick = (dropdownName: string) => {
    setOpenDropdown((prevDropdown) =>
      prevDropdown === dropdownName ? null : dropdownName
    );
    console.log(dropdownName);
  };

//   const createTrackerHandler = () => {
//     const params = new URLSearchParams(searchParams);
//     params.set("categories", selectedCategories?.join(","));
//     params.set("location", selectedLocations?.join(","));
//     params.set("status", "Active,Postponed,Predicted");
//     // params.set(
//     //   "date_range",
//     //   `${selectedCategories?.startingDateTime},${selectedCategories?.endingDateTime}`
//     // );
//     router.push(`/trackers/create?${params.toString()}`);
//   };

//   const searchHandler = () => {
//     const params = new URLSearchParams(searchParams);
//     // params.set("categories", ) : ""
//     // params.set("location", selectedLocations?.join(",")) : ""
//     params.set("status", "ACTIVE,POSTPONED,PREDICTED");
//     // params.set(
//     //   "date_range",
//     //   `${selectedCategories?.startingDateTime},${selectedCategories?.endingDateTime}`
//     // );
//     router.push(`/search/events?${params.toString()}`);
//   };

//   useEffect(() => {
//     setSelectedCategories([
//       "community",
//       "concerts",
//       "conferences",
//       "expos",
//       "festivals",
//       "performing-arts",
//       "sports",
//       "academic",
//       "daylight-savings",
//       "observances",
//       "politics",
//       "public-holidays",
//       "school-holidays",
//       "disasters",
//       "health-warnings",
//       "severe-weather",
//       "terror",
//     ]);

//     setSelectedEventStatus(["Active", "Cancelled", "Postponed", "Predicted"]);

//     // searchEvents(searchParams).then((data) => setEventData(data.data));
//   }, [searchParams]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.inputfields_container}>
          <div className={styles.searchbar}>
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
            <button >
              <Image src={SearchIcon} alt="search" />
            </button>
          </div>
          <div className={styles.sub_container}>
            <div className={styles.inputdropdowns_container}>
              <div className={styles.input_container} ref={categoryDropdownRef}>
                <div
                  className={styles.input}
                  onClick={() => handleDropdownClick("Category")}
                >
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
                  <Image src={DropIcon} alt="dropicon" />
                </div>
                {openDropdown == "Category" && (
                  <CategoryDropdown
                    dropdownRef={categoryDropdownRef}
                    state={selectedCategories}
                    setState={setSelectedCategories}
                    onClose={() => setOpenDropdown("")}
                  />
                )}
              </div>

              <div className={styles.input_container} ref={locationDropdownRef}>
                <div
                  className={styles.input}
                  onClick={() => handleDropdownClick("Location")}
                >
                  <div className={styles.input_title}>
                    Location
                    <span className={styles.input_selected_title}>
                      {selectedLocations[0]}
                    </span>
                  </div>
                  <Image src={DropIcon} alt="dropicon" />
                </div>
                {openDropdown == "Location" && (
                  <LocationDropdown
                    dropdownRef={locationDropdownRef}
                    state={selectedLocations}
                    setState={setSelectedLocations}
                    onClose={() => setOpenDropdown("")}
                  />
                )}
              </div>

              <div className={styles.input_container} ref={labelDropdownRef}>
                <div
                  className={styles.input}
                  onClick={() => handleDropdownClick("Labels")}
                >
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
                  <Image src={DropIcon} alt="dropicon" />
                </div>
                {openDropdown == "Labels" && (
                  <LabelDropdown
                    dropdownRef={labelDropdownRef}
                    state={selectedLabels}
                    setState={setSelectedLabels}
                    onClose={() => setOpenDropdown("")}
                  />
                )}
              </div>

              <div className={styles.input_container} ref={rankDropdownRef}>
                <div
                  className={styles.input}
                  onClick={() => handleDropdownClick("Rank")}
                >
                  <div className={styles.input_title}>Rank</div>
                  <Image src={DropIcon} alt="dropicon" />
                </div>
                {openDropdown == "Rank" && (
                  <RankInput
                    dropdownRef={rankDropdownRef}
                    selectedEventRank={selectedEventRank}
                    setSelectedEventRank={setSelectedEventRank}
                    selectedLocalRank={selectedLocalRank}
                    setSelectedLocalRank={setSelectedLocalRank}
                    selectedAviationRank={selectedAviationRank}
                    setSelectedAviationRank={setSelectedAviationRank}
                    onClose={() => setOpenDropdown("")}
                  />
                )}
              </div>

              <div className={styles.input_container} ref={dateDropdownRef}>
                <div
                  className={styles.input}
                  onClick={() => handleDropdownClick("Date & Time")}
                >
                  <div className={styles.input_title}>Date & Time</div>
                  <Image src={DropIcon} alt="dropicon" />
                </div>
                {openDropdown == "Date & Time" && (
                  <DateRangeInput
                    dropdownRef={dateDropdownRef}
                    state={selectedDateRange}
                    setState={setSelectedDateRange}
                    onClose={() => setOpenDropdown("")}
                  />
                )}
              </div>

              <div
                className={styles.input_container}
                ref={eventStatusDropdownRef}
              >
                <div
                  className={styles.input}
                  onClick={() => handleDropdownClick("Event Status")}
                >
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
                  <Image src={DropIcon} alt="dropicon" />
                </div>
                {openDropdown == "Event Status" && (
                  <EventStatus
                    dropdownRef={eventStatusDropdownRef}
                    state={selectedEventStatus}
                    setState={setSelectedEventStatus}
                    onClose={() => setOpenDropdown("")}
                  />
                )}
              </div>

              <div
                className={styles.input_container}
                ref={eventAttendanceDropdownRef}
              >
                <div
                  className={styles.input}
                  onClick={() => handleDropdownClick("Event Attendance")}
                >
                  <div className={styles.input_title}>Event Attendance</div>
                  <Image src={DropIcon} alt="dropicon" />
                </div>
                {openDropdown == "Event Attendance" && (
                  <EventAttendance
                    dropdownRef={eventAttendanceDropdownRef}
                    state={selectedEventAttendanceRange}
                    setState={setSelectedEventAttendanceRange}
                    onClose={() => setOpenDropdown("")}
                  />
                )}
              </div>
            </div>

            <div className={styles.buttons_container}>
              <div className={styles.createtracker_button}>Clear Filters</div>

              <div
                className={styles.createtracker_button}
                
              >
                Create Tracker
              </div>
            </div>
          </div>
          {showRecentSearches && (
            <RecentSearches setShowRecentSearches={setShowRecentSearches} />
          )}
        </div>

        <div className={styles.viewContainer}>
          <div className={styles.exportedno_container}>
            <div className={styles.exportedno}>1</div>
            <div className={styles.exportedno_title}>Exported files</div>
          </div>
          <div className={styles.viewTypeButtons_container}>
            <div className={styles.viewTypeButtons}>
              <button
                onClick={() => setSelectedView("list")}
                className={`${styles.listBtn} ${
                  selectedView === "list" ? styles.active  : ""
                }`}
              >
                List
              </button>
              <button
                onClick={() => setSelectedView("map")}
                className={`${styles.mapBtn} ${
                  selectedView === "map" ? styles.active : ""
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setSelectedView("calendar")}
                className={`${styles.calendarBtn} ${
                  selectedView === "calendar" ? styles.active  : ""
                }`}
              >
                Calendar
              </button>
            </div>
          </div>

          <div
            className={styles.exportButton}
            onClick={() => setShowExportModal(true)}
          >
            <Image src={ExportIcon} width={20} height={20} alt="exporticon" />
            <div className={styles.exportedno_title}>Export</div>
          </div>

          {showExportModal && (
            <ExportModal onClose={() => setShowExportModal(false)} />
          )}
        </div>
        {eventData?.events.length === 0 ? (
          <div className={styles.message}>No Events</div>
        ) : (
          <div className={styles.dataView}>
            {selectedView === "list" && (
              <List />
            )}
            {selectedView === "calendar" && (
                 <div style={{padding:"32px"}}>
              <Suspense fallback={<Loading />}>
               
                <Calendar />
               
              </Suspense>
              </div>
            )}
          </div>
        )}
      </div>
      
      {selectedView === "map" && (
        <div style={{padding:"32px"}}>
        <Suspense fallback={<Loading />}>
            
          <Map/>
          
        </Suspense>
        </div>
      )}
    </>
  );
};
export default Search;