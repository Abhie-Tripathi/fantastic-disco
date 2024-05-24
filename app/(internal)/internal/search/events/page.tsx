"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./search.module.css";
import { EventDataType } from "@/app/components/types/allevents";

import SearchIcon from "/public/search.svg";
import DropIcon from "/public/internal/dropdown_arrow.svg";
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

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedView, setSelectedView] = useState("list");
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

  const [showAdvanceFilter, setShowAdvanceFilter] = useState(false);
  const [selectedAdvFilter, setSelectedAdvFilter] = useState("AP");
  const [selectedBrandedEvent, setSelectedBrandedEvent] = useState(false);
  const [selectedTrustScore, setSelectedTrustScore] = useState(0);
  const [selectedReptScore, setSelectedReptScore] = useState(0);
  const [selectedMaturity, setSelectedMaturity] = useState(0);
  const [selectedInboundScore, setSelectedInboundScore] = useState(0);
  const [selectedEventEdition, setSelectedEventEdition] = useState(0);
  const [selectedINScore, setSelectedINScore] = useState(0);

  const [selectedInsights, setSelectedInsights] = useState<InsightsType>({});

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
    });
  }, []);

  return (
    <>
      <div className={styles.container}>
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
          <button onClick={searchHandler}>
            <Image src={SearchIcon} alt="search" />
          </button>
        </div>
        <div className={styles.sub_container}>
          <div className={styles.inputdropdowns_container}>
            <MenuTrigger>
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
                    setState={setSelectedCategories}
                  />
                </Dialog>
              </Popover>
            </MenuTrigger>

            <MenuTrigger>
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

            <MenuTrigger>
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
            </MenuTrigger>

            <MenuTrigger>
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
                      onClose={close}
                    />
                  )}
                </Dialog>
              </Popover>
            </MenuTrigger>

            <MenuTrigger>
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

            <MenuTrigger>
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

            <MenuTrigger>
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
          </div>

          <div className={styles.buttons_container}>
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
          </div>
        </div>
        {showRecentSearches && (
          <RecentSearches setShowRecentSearches={setShowRecentSearches} />
        )}

        {/*   ADVANCE FILTER SECTION */}
        {showAdvanceFilter && (
          <div>
            <div className={styles.viewContainer}>
              <div className={styles.viewTypeButtons_container}>
                <div className={styles.advanceFilterBtns}>
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
                <MenuTrigger>
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
                              {selectedEventFormat[0]}
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
                      <EventAdvFilter
                        state={selectedEventFormat}
                        setState={setSelectedEventFormat}
                        data={eventFormatData}
                      />
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger>
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
                    <Dialog>
                      <EventAdvFilter
                        state={selectedEventFrequency}
                        setState={setSelectedEventFrequency}
                        data={eventFrequencyData}
                      />
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger>
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
                    <Dialog>
                      <EventAdvFilter
                        state={selectedEntry}
                        setState={setSelectedEntry}
                        data={eventEntryData}
                      />
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger>
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
                    <Dialog>
                      <RangeSlider
                        state={selectedEventEdition}
                        setState={setSelectedEventEdition}
                      />
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger>
                  <Button>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Event Keywords
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
                      <EventKeyword
                        state={selectedLabels}
                        setState={setSelectedLabels}
                      />
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger>
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
                    <Dialog>
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
                <MenuTrigger>
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

                <MenuTrigger>
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
                    <Dialog>
                      {({ close }) => (
                        <RangeSlider
                          state={selectedTrustScore}
                          setState={setSelectedTrustScore}
                        />
                      )}
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger>
                  <div>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>Event Series</div>

                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={() => {}}
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

                <MenuTrigger>
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
                    <Dialog>
                      {({ close }) => (
                        <RangeSlider
                          state={selectedReptScore}
                          setState={setSelectedReptScore}
                        />
                      )}
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger>
                  <Button>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>
                          Maturity
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
                        <div className={styles.toggle_container}>
                          <span>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                onChange={() => {}}
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
                    <Dialog>
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
                <MenuTrigger>
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
                  <Popover>
                    <Dialog>
                      {({ close }) => (
                        <RangeSlider
                          state={selectedINScore}
                          setState={setSelectedINScore}
                        />
                      )}
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger>
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
                    <Dialog>
                      {({ close }) => (
                        <RangeSlider
                          state={selectedInboundScore}
                          setState={setSelectedInboundScore}
                        />
                      )}
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger>
                  <Button>
                    <div className={styles.input_container}>
                      <div className={styles.input}>
                        <div className={styles.input_title}>User Ratings
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
                    <Dialog>
                      {({ close }) => (
                        <UserRatings
                          state={selectedUserRatings}
                          setState={setSelectedUserRatings}
                        />
                      )}
                    </Dialog>
                  </Popover>
                </MenuTrigger>

                <MenuTrigger>
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
                    <Dialog>
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
        )}

        <div className={styles.viewContainer}>
          <div className={styles.viewTypeButtons_container}>
            <div className={styles.viewTypeButtons}>
              <button
                onClick={() => setSelectedView("list")}
                className={`${styles.listBtn} ${
                  selectedView === "list" ? styles.active : ""
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
                  selectedView === "calendar" ? styles.active : ""
                }`}
              >
                Calendar
              </button>
            </div>
          </div>

          <DialogTrigger>
            <Button className={styles.exportButton}>
              <Image src={ExportIcon} width={20} height={20} alt="exporticon" />
              <div className={styles.exportedno_title}>Export</div>
            </Button>
            <ModalOverlay isDismissable className={styles.modalOverlay}>
              <Modal>
                <Dialog>
                  {({ close }) => <ExportModal onClose={close} />}
                </Dialog>
              </Modal>
            </ModalOverlay>
          </DialogTrigger>
        </div>
        {eventData?.events.length === 0 ? (
          <div className={styles.message}>No Events</div>
        ) : (
          <div className={styles.dataView}>
            {selectedView === "list" && 
              // <List />
              <Suspense fallback={<Loading />}>
                <Table
                  showInsights={selectedInsights}
                />
              </Suspense>
            }
            {selectedView === "calendar" && (
              <Suspense fallback={<Loading />}>
                <Calendar />
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
        </Suspense>
      )}
    </>
  );
};
export default Search;
