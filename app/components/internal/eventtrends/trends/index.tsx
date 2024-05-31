"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./index.style.module.css";
import styles1 from "@/app/(internal)/internal/search/events/search.module.css";
import DropIcon from "/public/internal/dropdown_arrow.svg";
// import DownArrow from "/public/arrow_drop_down.svg";
// import Check from "/public/Check.svg";
import Image from "next/image";
import PeriodicAnalytics from "@/app/components/internal/eventtrends/tableView/PeriodicAnalytics";
import TableAnalytics from "@/app/components/internal/eventtrends/tableView/TableAnalytics";
import LineChart from "@/app/components/internal/eventtrends/chart/LineChart";
import CategoryDropdown from "@/app/components/dropdown/CategoryDropwdown";
import LocationDropdown from "@/app/components/dropdown/LocationDropdown";
import DateRangeInput from "@/app/components/dropdown/DateRangeInput";
import RankInput from "@/app/components/Search/Dropdowns/RankInput";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, baseUrl2 } from "@/constants";
import { Button, Dialog, MenuTrigger, Popover } from "react-aria-components";
import DateRange from "@/app/components/dropdown/DateRange";
import { useSearchParams } from "next/navigation";

interface EventTrendsProps {
  activeChipY: string;
  activeChipX: string;
}

const EventTrends = ({ activeChipY, activeChipX }: EventTrendsProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categorySlug, setCategorySlug] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<string[]>([]);

  const [selectedEventRank, setSelectedEventRank] = useState<number[]>([]);
  const [selectedLocalRank, setSelectedLocalRank] = useState<number[]>([]);
  const [selectedAviationRank, setSelectedAviationRank] = useState<number[]>(
    []
  );
  const [categoryData, setCatgeoryData] = useState([]);
  // const searchParams = useSearchParams();

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

  //   Params : {
  //     category : 'expos,festivals', // comma separated category slug
  //     city : 'London,Chicago', // comma separated city names
  //     active_gte : '2024-04-01T00:00:00.000Z', // event start date in iso format
  //     active_lte : '2024-04-30T23:59:59.999Z', // event end date in iso format
  //     event_rank_gte : 0, // event rank lower bound
  //     event_rank_lte : 100, // event rank upper bound
  //    }

  // console.log("EventRank", activeChipX,activeChipY);
  const searchHandler = () => {
    let query = "?";
    if (selectedCategories.length > 0) {
      query += "category=" + selectedCategories.join(",");
    }
    if (selectedLocations.length > 0) {
      query += "&city=" + selectedLocations.join(",");
    }
    if (selectedDateRange.length > 0) {
      query += "&active_gte=" + selectedDateRange[0];
      query += "&active_lte=" + selectedDateRange[1];
    }
    if (selectedEventRank.length > 0) {
      query += "&event_rank_gte=" + selectedEventRank[0];
      query += "&event_rank_lte=" + selectedEventRank[1];
    }
    console.log(query);
    fetchData(query);
  };

  const fetchData = async (query: string) => {
    console.log(baseUrl2);
    const { data, error } = await myFetch(
      `https://api.eventeli.com/trend/${
        activeChipY === "Predicted Attendance"
          ? "predicted-attendance"
          : "predicted-number-of-events"
      }/${query}`
    );
    if (error) {
      console.log("Something went wrong");
      return;
    }

    if (data) {
      console.log(data);
    }
  };

  return (
    <div className={styles.predictedAttendence_container}>
      <div className={styles.filters_container}>
        <div className={styles.inputdropdowns_container}>
          <MenuTrigger>
            <Button>
              <div className={styles1.input_container}>
                <div className={styles1.input}>
                  <div className={styles1.input_title}>
                    Category
                    {selectedCategories?.length > 1 ? (
                      <span className={styles1.input_selected_no}>
                        {selectedCategories.length}
                      </span>
                    ) : (
                      <span className={styles1.input_selected_title}>
                        {selectedCategories[0]}
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
            <Button>
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
                  />
                )}
              </Dialog>
            </Popover>
          </MenuTrigger>

          <MenuTrigger>
            <Button>
              <div className={styles1.input_container}>
                <div className={styles1.input}>
                  <div className={styles1.input_title}>Dates</div>
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
            <Button>
              <div className={styles1.input_container}>
                <div className={styles1.input}>
                  <div className={styles1.input_title}>Rank</div>
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
                    onClose={close}
                  />
                )}
              </Dialog>
            </Popover>
          </MenuTrigger>
          <div className={styles.apply_button} onClick={searchHandler}>
            <div>Apply</div>
          </div>
          <div className={styles.clearfilters_button}>Clear</div>
        </div>
        {/* <div className={styles.filter_buttons_container}>
          <div className={styles.apply_button} onClick={searchHandler}>
            <div>Apply</div>
          </div>
          <div className={styles.clearfilters_button}>Clear Filters</div>
        </div> */}
      </div>

      <div className={styles.inner_container}>
        <div
          className={`${styles.predictedAttendence_container} ${styles.chartContainer}`}
        >
          <LineChart activeChipX={activeChipX} activeChipY={activeChipY} />
        </div>
      </div>

      <div className={styles.inner_container}>
        <div className={styles.predictedAttendence_container}>
          <PeriodicAnalytics />
        </div>
      </div>
      <div className={styles.inner_container}>
        <div className={styles.predictedAttendence_container}>
          <TableAnalytics />
        </div>
      </div>
    </div>
  );
};

export default EventTrends;
