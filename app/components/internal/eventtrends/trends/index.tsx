"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./index.style.module.css";
import styles1 from "@/app/(internal)/internal/search/events/search.module.css";
import DropIcon from "/public/internal/dropdown_arrow.svg";
import Image from "next/image";
import PeriodicAnalytics from "@/app/components/internal/eventtrends/tableView/PeriodicAnalytics";
import TableAnalytics from "@/app/components/internal/eventtrends/tableView/TableAnalytics";
import LineChart from "@/app/components/internal/eventtrends/chart/LineChart";
import CategoryDropdown from "@/app/components/dropdown/CategoryDropwdown";
import LocationDropdown from "@/app/components/dropdown/LocationDropdown";
import RankInput from "@/app/components/Search/Dropdowns/RankInput";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, baseUrl2 } from "@/constants";
import { Button, Dialog, MenuTrigger, Popover } from "react-aria-components";
import DateRange from "@/app/components/dropdown/DateRange";
import { convertToCustomFormat } from "@/utils/dateFormat";
import { convertISOToOriginalFormat } from "@/utils/date";
import { showToast } from "@/utils/showToast";
import { useSearchParams, useRouter } from "next/navigation";

interface EventTrendsProps {
  activeChip: string;
}

interface Event {
  slug: string;
  attendance: number;
  categoryName: string;
}

interface SelectedLocation {
  [id: string]: string;
}

interface GroupingByDate {
  [date: string]: Event[];
}
const EventTrends = ({ activeChip }: EventTrendsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",") || []
  );
  const [categorySlug, setCategorySlug] = useState<string[]>(
    searchParams.get("categories")?.split(",") || []
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<SelectedLocation>({});
  const [selectedCountry, setSelectedCountry] = useState<SelectedLocation>({});
  const [selectedDateRange, setSelectedDateRange] = useState<string[]>([]);

  const [selectedEventRank, setSelectedEventRank] = useState<number[]>([
    0, 100,
  ]);
  const [selectedLocalRank, setSelectedLocalRank] = useState<number[]>([
    0, 100,
  ]);
  const [selectedAviationRank, setSelectedAviationRank] = useState<number[]>([
    0, 100,
  ]);
  const [rankToggles, setRankToggles] = useState({
    isEventRank: false,
    isLocalRank: false,
    isAviationRank: false,
  });
  const [categoryData, setCatgeoryData] = useState([]);
  const [resultData, setResultData] = useState<any>();
  const [unparsedData, setUnparsedData] = useState<any>();

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

  const clearHandler = () => {
    setSelectedCategories([]);
    setCategorySlug([]);
    setSelectedLocations([]);
    setSelectedDateRange([]);
    setSelectedEventRank([]);
    setSelectedLocalRank([]);
    setSelectedAviationRank([]);
  };

  const searchHandler = () => {
    let query = "";
    const params = new URLSearchParams(searchParams);
    if (selectedCategories.length > 0) {
      query += "category=" + selectedCategories.join(",");
      params.set("category", selectedCategories.join(","));
    }
    if (
      Object.entries(selectedCity).length > 0 ||
      Object.entries(selectedCountry).length > 0
    ) {
      let cities = Object.keys(selectedCity).join(",");
      let countries = Object.keys(selectedCountry).join(",");

      query += "&city=";
      if (cities && countries) {
        query += cities + "," + countries;
        params.set("city", cities + "," + countries);
      } else if (cities) {
        query += cities;
        params.set("city", cities);
      } else if (countries) {
        query += countries;
        params.set("city", countries);
      }
    }

    if (selectedDateRange.length > 0) {
      query += "&active_gte=" + selectedDateRange[0];
      query += "&active_lte=" + selectedDateRange[1];
    }
    if (selectedEventRank.length > 0) {
      query += "&event_rank_gte=" + selectedEventRank[0];
      query += "&event_rank_lte=" + selectedEventRank[1];
      params.set("active_gte", selectedDateRange[0]);
      params.set("active_lte", selectedDateRange[1]);
    }
    console.log(query);
    fetchData(query);
    // router.push(`/internal/trends?${params.toString()}`);
  };

  console.log(selectedCity, selectedCountry);

  const fetchData = async (query: string) => {
    if (
      selectedCategories.length === 0 ||
      selectedDateRange.length === 0 ||
      selectedEventRank.length === 0 ||
      selectedLocalRank.length === 0 ||
      selectedAviationRank.length === 0
    ) {
      showToast("error", "Please select all the filters first");
      return;
    }
    const { data, error } = await myFetch(
      `${baseUrl}/trend/${
        activeChip === "Predicted Attendance"
          ? "predicted-attendance"
          : "predicted-number-of-events"
      }?${query}`
    );
    if (error) {
      console.log("Something went wrong");
      return;
    }

    if (data) {
      setUnparsedData(data);
      const updatedResult = dateFormatter(data);
      setResultData(updatedResult);
    }
  };

  const dateFormatter = (data: GroupingByDate) => {
    const { predictedAttendance } = data;
    const { groupingByDate }: any = predictedAttendance;

    const updatedGroupingByDate: any = {};

    Object.entries(groupingByDate).forEach(([dateString, events]) => {
      const formattedDate = convertToCustomFormat(dateString);
      updatedGroupingByDate[formattedDate] = events;
    });

    return {
      ...data,
      predictedAttendance: {
        ...predictedAttendance,
        groupingByDate: updatedGroupingByDate,
      },
    };
  };

  console.log(selectedLocations)

  return (
    <div className={styles.predictedAttendence_container}>
      <div className={styles.filters_container}>
        <div className={styles.inputdropdowns_container}>
          <MenuTrigger>
            <Button
              className={`${styles.input_container_btns} ${styles1.dropdown_button}`}
            >
              <div className={styles1.input_container}>
                <div className={styles1.input}>
                  <div className={styles1.input_title}>
                    Category
                    {categorySlug?.length > 1 ? (
                      <span className={styles1.input_selected_no}>
                        {categorySlug.length}
                      </span>
                    ) : (
                      <span className={styles1.input_selected_title}>
                        {categorySlug[0]}
                      </span>
                    )}
                  </div>
                  <Image src={DropIcon} alt="dropicon" width={20} height={20} />
                </div>
              </div>
            </Button>
            <Popover>
              <Dialog>
                <CategoryDropdown
                  state={selectedCategories}
                  setState={setSelectedCategories}
                  categoryData={categoryData}
                  categorySlug={categorySlug}
                  setCategorySlug={setCategorySlug}
                />
              </Dialog>
            </Popover>
          </MenuTrigger>

          <MenuTrigger>
            <Button
              className={`${styles.input_container_btns} ${styles1.dropdown_button}`}
            >
              <div className={styles1.input_container}>
                <div className={styles1.input}>
                  <div className={styles1.input_title}>
                    Location
                    {selectedLocations?.length > 1 ? (
                      <span className={styles1.input_selected_no}>
                        {selectedLocations.length}
                      </span>
                    ) : (
                      <span className={styles1.input_selected_title}>
                        {selectedLocations[0]}
                      </span>
                    )}
                  </div>
                  <Image src={DropIcon} alt="dropicon" width={20} height={20} />
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
                    setSelectedCity={setSelectedCity}
                    setSelectedCountry={setSelectedCountry}
                  />
                )}
              </Dialog>
            </Popover>
          </MenuTrigger>

          <MenuTrigger>
            <Button
              className={`${styles.input_container_btns} ${styles1.dropdown_button}`}
            >
              <div className={styles1.input_container}>
                <div className={styles1.input}>
                  <div className={styles1.input_title}>
                    Dates{" "}
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
              </div>
            </Button>
            <Popover>
              <Dialog>
                {({ close }) => (
                  <DateRange
                    state={selectedDateRange}
                    setState={setSelectedDateRange}
                  />
                )}
              </Dialog>
            </Popover>
          </MenuTrigger>

          <MenuTrigger>
            <Button
              className={`${styles.input_container_btns} ${styles1.dropdown_button}`}
            >
              <div className={styles1.input_container}>
                <div className={styles1.input}>
                  <div className={styles1.input_title}>
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
                  <Image src={DropIcon} alt="dropicon" width={20} height={20} />
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
          </MenuTrigger>
        </div>
        <div>
          {/* {activeChip === "No of Events" && (
            <MenuTrigger>
              <Button className={styles.input_container_btns}>
                <div className={styles1.input_container}>
                  <div className={styles1.input}>
                    <div className={styles1.input_title}>
                      Category
                      {categorySlug?.length > 1 ? (
                        <span className={styles1.input_selected_no}>
                          {categorySlug.length}
                        </span>
                      ) : (
                        <span className={styles1.input_selected_title}>
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
                    setState={setSelectedCategories}
                    categoryData={categoryData}
                    categorySlug={categorySlug}
                    setCategorySlug={setCategorySlug}
                  />
                </Dialog>
              </Popover>
            </MenuTrigger>
          )} */}
          <div className={styles.btn_container}>
            <div className={styles.apply_button} onClick={searchHandler}>
              Apply
            </div>
            <div className={styles.clearfilters_button} onClick={clearHandler}>
              Clear
            </div>
          </div>
        </div>
      </div>

      {unparsedData && (
        <div className={styles.inner_container}>
          <div
            className={`${styles.predictedAttendence_container} ${styles.chartContainer}`}
          >
            <LineChart
              activeChip={activeChip}
              // activeChipY={}
              groupedData={unparsedData.predictedAttendance}
            />
          </div>
        </div>
      )}

      {resultData && (
        <>
          <div className={styles.inner_container}>
            <div className={styles.predictedAttendence_container}>
              <PeriodicAnalytics
                predictedData={resultData.predictedAttendance.total}
              />
            </div>
          </div>
          <div className={styles.inner_container}>
            <div className={styles.predictedAttendence_container}>
              <TableAnalytics groupedData={resultData.predictedAttendance} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EventTrends;
