"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./index.style.module.css";
// import DownArrow from "/public/arrow_drop_down.svg";
// import Check from "/public/Check.svg";
import Image from "next/image";
import PeriodicAnalytics from "@/app/components/internal/eventtrends/tableView/PeriodicAnalytics";
import TableAnalytics from "@/app/components/internal/eventtrends/tableView/TableAnalytics";
import LineChart from "@/app/components/internal/eventtrends/chart/LineChart";
import CategoryDropdown from "@/app/components/dropdown/CategoryDropwdown"
import LocationDropdown from "@/app/components/dropdown/LocationDropdown";
import DateRangeInput from "@/app/components/dropdown/DateRangeInput";
import RankInput from "@/app/components/dropdown/RankInput";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";

interface EventTrendsProps{
    activeChipY : string,
    activeChipX : string
}

const EventTrends = ({activeChipY,activeChipX} : EventTrendsProps) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedDateRange, setSelectedDateRange] = useState<string[]>([]);

    const [selectedEventRank, setSelectedEventRank] = useState([0, 100]);
    const [selectedLocalRank, setSelectedLocalRank] = useState([0, 100]);
    const [selectedAviationRank, setSelectedAviationRank] = useState([0, 100]);
    const [categoryData, setCatgeoryData] = useState([]);

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

    const handleDropdownClick = (dropdownName: string) => {
        setOpenDropdown((prevDropdown) =>
            prevDropdown === dropdownName ? null : dropdownName
        );
    };

    const categoryDropdownRef = useRef(null);
    const locationDropdownRef = useRef(null);
    const dateDropdownRef = useRef(null);
    const rankDropdownRef = useRef(null);

    return (
        <div className={styles.predictedAttendence_container}>
            <div className={styles.filters_container}>
                <div className={styles.filter_dropdowns_container}>
                    <div className={styles.filter} ref={categoryDropdownRef}>
                        <div className={styles.dropdown_title}>Categories</div>
                        <div
                            className={styles.dropdown_container}
                            onClick={() => handleDropdownClick("Categories")}
                        >
                            <div className={styles.dropdown_value}>
                                {/* {categories.length > 1 ? } */}All
                                <span className={styles.dropdown_value_stats}>7</span>
                            </div>
                            {/* <Image src={DownArrow} alt="downarrow" /> */}
                        </div>
                        {openDropdown == "Categories" && (
                            <CategoryDropdown
                                className={styles.dropdown}
                                dropdownRef={categoryDropdownRef}
                                state={selectedCategories}
                                setState={setSelectedCategories}
                                onClose={() => setOpenDropdown("")}
                                categoryData={categoryData}
                            />
                        )}
                    </div>

                    <div className={styles.filter} ref={locationDropdownRef}>
                        <div className={styles.dropdown_title}>Locations</div>
                        <div
                            className={styles.dropdown_container}
                            onClick={() => handleDropdownClick("Locations")}
                        >
                            <div className={styles.dropdown_value}>
                                Chicago
                                <span className={styles.dropdown_value_stats}>7</span>
                            </div>
                            {/* <Image src={DownArrow} alt="downarrow" /> */}
                        </div>
                        {openDropdown == "Locations" && (
                            <LocationDropdown
                                className={styles.dropdown}
                                dropdownRef={locationDropdownRef}
                                state={selectedLocations}
                                setState={setSelectedLocations}
                                onClose={() => setOpenDropdown("")}
                            />
                        )}
                    </div>

                    <div className={styles.filter} ref={dateDropdownRef}>
                        <div className={styles.dropdown_title}>Date</div>
                        <div
                            className={styles.dropdown_container}
                            onClick={() => handleDropdownClick("Date")}
                        >
                            <div className={styles.dropdown_value}>
                                Next 7 days
                                <span className={styles.dropdown_value_stats}>7</span>
                            </div>
                            {/* <Image src={DownArrow} alt="downarrow" /> */}
                        </div>
                        {openDropdown == "Date" && (
                            <DateRangeInput
                                className={styles.dropdown}
                                dropdownRef={dateDropdownRef}
                                state={selectedDateRange}
                                setState={setSelectedDateRange}
                                onClose={() => setOpenDropdown("")}
                            />
                        )}
                    </div>

                    <div className={styles.filter} ref={rankDropdownRef}>
                        <div className={styles.dropdown_title}>Rank</div>
                        <div
                            className={styles.dropdown_container}
                            onClick={() => handleDropdownClick("Rank")}
                        >
                            <div className={styles.dropdown_value}>
                                0 - 100
                                <span className={styles.dropdown_value_stats}>7</span>
                            </div>
                            {/* <Image src={DownArrow} alt="downarrow" /> */}
                        </div>
                        {openDropdown == "Rank" && (
                            <RankInput
                                className={styles.rank_dropdown}
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
                </div>

                <div className={styles.filter_buttons_container}>
                    <div className={styles.apply_button}>
                        {/* <Image src={Check} alt="check" /> */}
                        <div>Apply</div>
                    </div>
                    <div className={styles.clearfilters_button}>Clear Filters</div>
                </div>
            </div>

            <div className={styles.inner_container}>
                <div className={`${styles.predictedAttendence_container} ${styles.chartContainer}`}>
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