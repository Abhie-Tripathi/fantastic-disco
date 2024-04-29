"use client";
import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTheme } from "@/context";
import Image from "next/image";
import styles from "./page.style.module.css";
import { myFetch } from "@/utils/myFetch";
import DropIcon1 from "/public/internal/dropdown_arrow.svg";
import upArrowIcon from "/public/internal/up_arrow.svg";
import Add from '/public/plus.svg';
import tickIcon from "/public/internal/tick.svg";
import { EventDataType } from "@/app/components/types/allevents";
// import Table from "@/app/components/Table";
// import similarEventData from '@/public/data/similarEventData.json';
import similarEventData from "@/public/data/eventDataTesting.json";
import SearchIcon from "/public/internal/SearchInput.svg";
import DropIcon from "/public/internal/arrow_drop_down.svg";
import ExportIcon from "/public/internal/ExportIcon.svg";
import { insightsScore } from "@/public/data/researchData";
import EventFee from '@/app/components/dropdown/EventFee'
import EventFormat from "@/app/components/dropdown/EventFormat";
import EventRatings from "@/app/components/dropdown/EventRatings";
import EventSize from "@/app/components/dropdown/EventSize";
import EventKeyword from "@/app/components/dropdown/EventKeyword";
import CompanySearch from "@/app/components/CompanySearch";
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
const Table=lazy(() => import("@/app/components/Table"));
interface InsightsType {
  [key: string]: boolean;
}
const Search = () => {
  //   const searchParams = useSearchParams();
  const router = useRouter();
  const {theme} = useTheme();
  const categoryDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const labelDropdownRef = useRef(null);
  const rankDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const eventStatusDropdownRef = useRef(null);
  const eventAttendanceDropdownRef = useRef(null);
  const [listView, setListView] = useState("card");
  const [selectedView, setSelectedView] = useState("list");
  const [searchInput, setSearchInput] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [eventData, setEventData] = useState<EventDataType | null>(null);
  const [isAdvancedFilter, setIsAdvancedFilter] = useState(false);
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
  const advanceFilterHandler = () => {
    setIsAdvancedFilter((prev) => !prev);
  };
  const eventFormatDropdownRef = useRef(null);
  const eventFeeDropdownRef = useRef(null);
  const eventSizeDropdownRef = useRef(null);
  const eventRatingDropdownRef = useRef(null);
  const eventKeyDropdownRef = useRef(null);
  const companySearchDropdownRef = useRef(null);
  const [selectedEventFormat, setSelectedEventFormat] = useState<string | null>(
    null
  );
  const [selectedEventFee, setSelectedEventFee] = useState<string | null>(null);
  const [selectedEventSize, setSelectedEventSize] = useState<string | null>(
    null
  );
  const [selectedEventRating, setSelectedEventRating] = useState<string | null>(
    null
  );
  const [selectedEventKeyword, setSelectedEventKeyword] = useState<string[]>(
    []
  );
  const [selectedCompanySearch, setSelectedCompanySearch] = useState<string[]>(
    []
  );
  const [selectedInsights, setSelectedInsights] = useState<InsightsType>({});

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const insightCheckHandler = (eventCode: string) => {
    setSelectedInsights((prev:any) => ({
      ...prev,
      [eventCode]: !prev[eventCode],
    }));
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
      <div style={{ paddingTop: "70px", paddingLeft : "74px"}}>
      <div className={`${styles.container} ${theme === 'light' ? styles.container_light : ""}`} >
        <div className={`${styles.inputfields_container} ${theme === 'light' ? styles.inputfields_container_light : ""}`}>
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
                  <Image src={openDropdown == "Category" ? upArrowIcon : DropIcon1} alt="dropicon" width={20} height={20}/>
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
                  <Image src={openDropdown == "Location" ? upArrowIcon : DropIcon1} alt="dropicon" width={20} height={20}/>
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
                  <Image src={openDropdown == "Labels" ? upArrowIcon : DropIcon1} alt="dropicon" width={20} height={20}/>
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

              {/* <div className={styles.input_container} ref={rankDropdownRef}>
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
              </div> */}

              <div className={styles.input_container} ref={dateDropdownRef}>
                <div
                  className={styles.input}
                  onClick={() => handleDropdownClick("Date & Time")}
                >
                  <div className={styles.input_title}>Date & Time</div>
                  <Image src={openDropdown == "Date & Time" ? upArrowIcon : DropIcon1} alt="dropicon" width={20} height={20}/>
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

              {/* <div
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
              </div> */}
              <div
                className={`${styles.advanceFilter_button} ${
                  isAdvancedFilter ? styles.active_button : ""
                }`}
                onClick={advanceFilterHandler}
              >
                <div>Advance Filters</div>
                <Image
                  src={isAdvancedFilter ? upArrowIcon : DropIcon1}
                  alt="dropicon"
                  width={20}
                  height={20}
                />
              </div>

             

            </div>

            <div className={styles.buttons_container}>
              {/* <div className={styles.createtracker_button}>Clear Filters</div> */}

              <div
                className={styles.createtracker_button}

              >
                Create Tracker
                <Image src={Add} alt="plus" width={20} height={20} style={{color:"white"}}/>
              </div>
            </div>
          </div>
          
          {showRecentSearches && (
            <RecentSearches setShowRecentSearches={setShowRecentSearches} />
          )}
           {isAdvancedFilter && (
            <div className={styles.advanceFilter_container}>
              <div className={styles.advanceFilter_subContainer1}>
                <div className={styles.advanceFilter_title}>Advance Filter</div>
                <div
                  className={`${styles.inputdropdowns_container} ${styles.advancedFilter_dropdown_container}`}
                >
                  <div
                    className={styles.input_container}
                    ref={eventFormatDropdownRef}
                  >
                    <div
                      className={styles.input}
                      onClick={() => handleDropdownClick("Event Format")}
                    >
                      <div className={styles.input_title}>
                        Format
                        <span className={styles.input_selected_title}>
                          {selectedEventFormat}
                        </span>
                      </div>
                      <Image
                        src={
                          openDropdown == "Event Format"
                            ? upArrowIcon
                            : DropIcon1
                        }
                        alt="dropicon"
                        width={20}
                        height={20}
                      />
                    </div>
                    {openDropdown == "Event Format" && (
                      <EventFormat
                        dropdownRef={eventFormatDropdownRef}
                        state={selectedEventFormat}
                        setState={setSelectedEventFormat}
                        onClose={() => setOpenDropdown("")}
                      />
                    )}
                  </div>

                  <div
                    className={styles.input_container}
                    ref={eventFeeDropdownRef}
                  >
                    <div
                      className={styles.input}
                      onClick={() => handleDropdownClick("Event Fee")}
                    >
                      <div className={styles.input_title}>
                        Entry Fee
                        <span className={styles.input_selected_title}>
                          {selectedEventFee}
                        </span>
                      </div>
                      <Image
                        src={
                          openDropdown == "Event Fee" ? upArrowIcon : DropIcon1
                        }
                        alt="dropicon"
                        width={20}
                        height={20}
                      />
                    </div>
                    {openDropdown == "Event Fee" && (
                      <EventFee
                        dropdownRef={eventFeeDropdownRef}
                        state={selectedEventFee}
                        setState={setSelectedEventFee}
                        onClose={() => setOpenDropdown("")}
                      />
                    )}
                  </div>

                  <div
                    className={styles.input_container}
                    ref={eventRatingDropdownRef}
                  >
                    <div
                      className={styles.input}
                      onClick={() => handleDropdownClick("Event Rating")}
                    >
                      <div className={styles.input_title}>
                        Ratings
                        <span className={styles.input_selected_title}>
                          {selectedEventRating}
                        </span>
                      </div>
                      <Image
                        src={
                          openDropdown == "Event Rating"
                            ? upArrowIcon
                            : DropIcon1
                        }
                        alt="dropicon"
                        width={20}
                        height={20}
                      />
                    </div>
                    {openDropdown == "Event Rating" && (
                      <EventRatings
                        dropdownRef={eventRatingDropdownRef}
                        state={selectedEventRating}
                        setState={setSelectedEventRating}
                        onClose={() => setOpenDropdown("")}
                      />
                    )}
                  </div>

                  <div
                    className={styles.input_container}
                    ref={eventSizeDropdownRef}
                  >
                    <div
                      className={styles.input}
                      onClick={() => handleDropdownClick("Event Size")}
                    >
                      <div className={styles.input_title}>
                        Size
                        <span className={styles.input_selected_title}>
                          {selectedEventSize}
                        </span>
                      </div>
                      <Image
                        src={
                          openDropdown == "Event Size" ? upArrowIcon : DropIcon1
                        }
                        alt="dropicon"
                        width={20}
                        height={20}
                      />
                    </div>
                    {openDropdown == "Event Size" && (
                      <EventSize
                        dropdownRef={eventSizeDropdownRef}
                        state={selectedEventSize}
                        setState={setSelectedEventSize}
                        onClose={() => setOpenDropdown("")}
                      />
                    )}
                  </div>

                  <div
                    className={styles.input_container}
                    ref={eventKeyDropdownRef}
                  >
                    <div
                      className={styles.input}
                      onClick={() => handleDropdownClick("Event Keyword")}
                    >
                      <div className={styles.input_title}>
                        Keywords
                        {selectedEventKeyword?.length > 1 ? (
                          <span className={styles.input_selected_no}>
                            {selectedEventKeyword.length}
                          </span>
                        ) : (
                          <span className={styles.input_selected_title}>
                            {selectedEventKeyword[0]}
                          </span>
                        )}
                      </div>
                      <Image
                        src={
                          openDropdown == "Event Keyword"
                            ? upArrowIcon
                            : DropIcon1
                        }
                        alt="dropicon"
                        width={20}
                        height={20}
                      />
                    </div>
                    {openDropdown == "Event Keyword" && (
                      <EventKeyword
                        dropdownRef={eventKeyDropdownRef}
                        state={selectedEventKeyword}
                        setState={setSelectedEventKeyword}
                        onClose={() => setOpenDropdown("")}
                      />
                    )}
                  </div>

                  <div
                    className={styles.input_container}
                    ref={companySearchDropdownRef}
                  >
                    <div
                      className={styles.input}
                      onClick={() => handleDropdownClick("Company Search")}
                    >
                      <div className={styles.input_title}>
                        Company
                        {selectedCompanySearch?.length > 1 ? (
                          <span className={styles.input_selected_no}>
                            {selectedCompanySearch.length}
                          </span>
                        ) : (
                          <span className={styles.input_selected_title}>
                            {selectedCompanySearch[0]}
                          </span>
                        )}
                      </div>
                      <Image
                        src={
                          openDropdown == "Company Search"
                            ? upArrowIcon
                            : DropIcon1
                        }
                        alt="dropicon"
                        width={20}
                        height={20}
                      />
                    </div>
                    {openDropdown == "Company Search" && (
                      <CompanySearch
                        dropdownRef={companySearchDropdownRef}
                        state={selectedCompanySearch}
                        setState={setSelectedCompanySearch}
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
                        Status
                        <span className={styles.input_selected_title}>
                          {selectedEventStatus}
                        </span>
                      </div>
                      <Image
                        src={
                          openDropdown == "Event Status"
                            ? upArrowIcon
                            : DropIcon1
                        }
                        alt="dropicon"
                        width={20}
                        height={20}
                      />
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
                </div>
              </div>
              <div className={styles.advanceFilter_subContainer1}>
                <div className={styles.advanceFilter_title}>
                  Insights & Scores
                </div>
                <div className={styles.insightsFilter_container}>
                  {insightsScore.map((item) => (
                    <div
                      className={`${styles.input_container} ${styles.input_insights}`}
                      key={item.id}
                    >
                      <div className={styles.input}>
                        {item.name}
                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={() => insightCheckHandler(item.code)}
                                checked={selectedInsights[item.code]}
                              />
                              <span className={styles.slider}>
                                {selectedInsights[item.code] && (
                                  <Image
                                    src={tickIcon}
                                    alt="tick"
                                    width={15}
                                    height={15}
                                    className={styles.slider_tick_image}
                                  />
                                )}
                              </span>
                            </label>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
            
        <div className={styles.viewContainer}>
          <div className={styles.exportedno_container}>
            <div className={styles.exportedno}>1</div>
            <div className={styles.exportedno_title}>Exported files</div>
          </div>
          <div className={styles.viewTypeButtons_container}>
            <div className={`${styles.viewTypeButtons} ${theme === 'light' ? styles.viewTypeButtons_light : ""}`}>
              <button
                onClick={() => setSelectedView("list")}
                className={`${styles.listBtn} ${selectedView === "list" ? styles.active : ""
                  }`}
              >
                List
              </button>
              <button
                onClick={() => setSelectedView("map")}
                className={`${styles.mapBtn} ${selectedView === "map" ? styles.active : ""
                  }`}
              >
                Map
              </button>
              <button
                onClick={() => setSelectedView("calendar")}
                className={`${styles.calendarBtn} ${selectedView === "calendar" ? styles.active : ""
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
            {selectedView === "list" &&
              <div className={`${theme === 'light' ? styles.listBtn_container_light : styles.listBtn_container}`}>
                <button className={`${styles.listBtn} ${listView === "card" ? styles.active : ""}`} onClick={() => setListView("card")}>Card</button>
                <button className={`${styles.listBtn} ${listView === "table" ? styles.active : ""}`} onClick={() => setListView("table")}>Table</button>
              </div>}
            {selectedView === "list" && listView === "card" && (
              <List />
            )}
            {selectedView === "list" && listView === "table" && (
              <Suspense fallback={<Loading />}>
              <Table eventData={similarEventData.data.events} showInsights={selectedInsights} />
              </Suspense>
            )}

            {selectedView === "calendar" && (
              <div style={{ padding: "32px" }}>
                <Suspense fallback={<Loading />}>

                  <Calendar />

                </Suspense>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedView === "map" && (
        <div style={{ padding: "32px" }}>
          <Suspense fallback={<Loading />}>

            <Map />

          </Suspense>
        </div>
      )}
    </div>
  );
};
export default Search;