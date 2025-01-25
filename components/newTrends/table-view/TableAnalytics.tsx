// @ts-nocheck
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./TableAnalytics.module.css";
import sortIcon from "/public/sort.png";
import ArrowOutwards from "/public/arrow_outward.svg";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Workshop from "/public/trendsSubCategoryIcons/workshops.svg";
import Arts from "/public/trendsSubCategoryIcons/arts.svg";
import Festival from "/public/trendsSubCategoryIcons/festivals.svg";
import Concert from "/public/trendsSubCategoryIcons/concerts.svg";
import Sport from "/public/trendsSubCategoryIcons/sport.svg";
import Community from "/public/trendsSubCategoryIcons/community.svg";
import Tradeshow from "/public/trendsSubCategoryIcons/tradeshow.svg";
import Conferences from "/public/trendsSubCategoryIcons/conference.svg";
import SmartInsights from "/public/smartInsights.svg";
import { Switch } from "@/components/ui/switch";
import Text from "@/components/new-ui/Text";
import { categoriesTrends } from "@/data";
import { Ttabs, Ttrends } from "@/types/trends";
import { tableHeaderConfig, tableDataConfig } from "@/data/trendsTableColHead";
import CategoriesTrendsData from "@/data/categoriesTrends.json";
import { getCountryCode } from "@/data/getCountryCode";
import { format } from "date-fns";

interface IProps {
  startDate?: string;
  endDate?: string;
  data: any;
  isevents?: boolean;
  activeTab: Ttabs;
  isSmartInsightsEnabled: boolean;
  handleToggle: () => void;
}

function convertDateFormatToISO(dateString) {
  console.log(dateString);
  const [day, month, year] = dateString.split(" ");
  const monthNames = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const monthNumber = monthNames[month];
  const dateObject = new Date(`${year}-${monthNumber}-${day}`);
  return dateObject;
}

function transformData(data) {
  const transformedData = [];
  const allCategories = Object.keys(data.total);

  for (const date in data.groupingByDate) {
    const dateData = data.groupingByDate[date];
    const total = Object.values(dateData).reduce(
      (acc, attendance) => acc + attendance,
      0
    );
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const transformedItem = {
      date: formattedDate,
      total: total,
      events: "View All",
    };

    allCategories.forEach((category) => {
      transformedItem[category] = dateData[category] || 0;
    });

    transformedData.push(transformedItem);
  }

  return transformedData;
}

const TableAnalytics = ({
  startDate,
  endDate,
  data,
  isevents = false,
  activeTab,
  isSmartInsightsEnabled,
  handleToggle,
}: IProps) => {
  const [eventData, setEventData] = useState([]);
  const [sortingKey, setSortingKey] = useState("date");
  const [sortingOrder, setSortingOrder] = useState("ASC");

  useEffect(() => {
    setEventData(isevents ? formatData(data) : transformData(data));
  }, [data, isevents]);

  const sortDataDesc = (key) => {
    setSortingOrder("DESC");
    const sortedData = [...eventData].sort((a, b) => {
      if (key === "date") {
        return b[key].localeCompare(a[key]);
      }
      return b[key] - a[key];
    });
    setEventData(sortedData);
  };

  const sortDataAsc = (key) => {
    setSortingOrder("ASC");
    const sortedData = [...eventData].sort((a, b) => {
      if (key === "date") {
        return a[key].localeCompare(b[key]);
      }
      return a[key] - b[key];
    });
    setEventData(sortedData);
  };

  const sortHandler = (key) => {
    sortingOrder === "ASC" ? sortDataDesc(key) : sortDataAsc(key);
    setSortingKey(key);
  };
  const countryName = "India";

  interface TableProps {
    headers: string[];
    data: (string | number)[][];
    smartInsights: boolean; // To track if Smart Insights is enabled
  }

  const getMaxIndexInRow = (row: any) => {
    let maxIndex = -1;
    let maxValue = Number.MIN_SAFE_INTEGER;

    const values = Object.values(row).slice(2); // Skip 'month' and 'total'

    values.forEach((cell, index) => {
      const cellValue = typeof cell === "number" ? cell : parseFloat(cell);
      if (!isNaN(cellValue) && cellValue > maxValue) {
        maxValue = cellValue;
        maxIndex = index;
      }
    });
    return {
      maxIndex: maxIndex + 2,
      backgroundColor: "#DA2F35",
      textColor: "#DA2F35",
      borderColor: "#DA2F35",
    }; // Adjust index to account for 'month' and 'total'
  };

  function convertToLongDate(isoDateString: string): string {
    const date = new Date(isoDateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date
      .toLocaleDateString("en-US", options)
      .toLocaleUpperCase()
      .replace(",", "");
  }

  const getMaximumAttendance = (thresholdValue, predictedAttendanceValue) => {
    let maxIndex = -1;
    if (predictedAttendanceValue > thresholdValue) {
      return {
        maxIndex: 2,
        backgroundColor: "#398E4A",
        borderColor: "",
        textColor: "#398E4A",
      };
    } else if (predictedAttendanceValue < thresholdValue) {
      return {
        maxIndex: 2,
        backgroundColor: "#FF990A",
        borderColor: "",
        textColor: "#FF990A",
      };
    } else {
      return;
    }
  };

  const getCellStyle = (
    cell: any,
    index: number,
    maxIndex: object,
    activeTab: string,
    isSmartInsightsEnabled: boolean
  ) => {
    // Common styles
    let style = "text-center font-semibold p-6 ";

    // Time Trends or Location Trends Logic
    if (activeTab === "Time Trends" || activeTab === "Location Trends") {
      if (cell.slug === "threshold" && isSmartInsightsEnabled) {
        style += `bg-[#DA2F35] bg-opacity-5 text-[#DF2670]`;
      } else if (
        cell.slug === "predictedAttendance" &&
        index === maxIndex.maxIndex &&
        isSmartInsightsEnabled
      ) {
        style += `bg-[${maxIndex.backgroundColor}] bg-opacity-5 text-[${maxIndex.textColor}]`;
      } else {
        style += "bg-[#fff] border-solid border text-[#1C1B1F]";
      }
    }

    // Category Trends Logic
    else if (activeTab === "Category Trends") {
      if (index === maxIndex.maxIndex && isSmartInsightsEnabled) {
        style += `bg-[${maxIndex.backgroundColor}] border-2 bg-opacity-10 border-[var(--negative-color)] text-[${maxIndex.textColor}]`;
      } else {
        style += "bg-[#fff] border-solid border text-[#1C1B1F]";
      }
    }

    // Conditional text color for specific slugs
    if (["month", "total", "events", "city"].includes(cell.slug)) {
      style += " text-[#6750a4]";
    } else if (index !== maxIndex || activeTab !== "Category Trends") {
      style += " text[#1C1B1F]";
    }

    return style;
  };

  // Optional: Helper function for cell content (if needed)
  const getCellContent = (rowData: any, cell: any) => {
    return rowData[cell.slug as keyof typeof rowData] || "N/A";
  };
  return (
    <>
      <div className={styles.analytics_header}>
        {/* {activeTab !== "Location Trends" ? (
          
          <div className={styles.analytics_header_left}>
            <span className="font-medium text-[16px]">
              PREDICTED ATTENDANCE
            </span>
            <span>
              <span className={styles.analytics_value_stats}>12</span>
              <span className="text-[var(--primary-color)] font-medium text-sm">
                Months
              </span>
            </span>
          </div>
        ) : (
          <div className="flex gap-4 py-2 px-4 text-sm rounded-sm border border-[var(--neutral-light-color)]">
            COUNTRY
            <div className="flex gap-2">
              <Image
                src={`https://flagcdn.com/48x36/${getCountryCode(
                  countryName
                )}.png`}
                alt="Flag"
                width={25}
                height={16}
              />
              <p className="text-[var(--primary-color)] font-semibold">
                {countryName}
              </p>
            </div>
          </div>
        )} */}
        <div className={styles.analytics_header_title}>
          {`FOR THE SELECTED TIME PERIOD ( ${format(
            startDate,
            "d MMM yyyy"
          ).toUpperCase()} - ${format(endDate, "d MMM yyyy").toUpperCase()} )`}
        </div>

        <div className="flex gap-2 items-center px-3 py-3 border border-[var(--neutral-light-color)] rounded-sm">
          <Image src={SmartInsights} width={18} height={18} />
          <Text color="primary" variant="noMargin" fontWeight="regular">
            Smart Insights
          </Text>
          <Switch
            checked={isSmartInsightsEnabled}
            onCheckedChange={handleToggle}
            className="w-9 h-5"
          ></Switch>
        </div>
      </div>
      <div className={styles.table_container}>
        <Table className="border border-[var(--neutral-light-color)]">
          <TableHeader>
            <TableRow>
              {tableHeaderConfig[activeTab].map((cell) => (
                <TableHead
                  key={cell.name}
                  className={
                    "bg-[rgb(250,250,250)] w-40 text-center border border-[var(--neutral-light-color)]"
                  }
                >
                  <div
                    className={`flex items-center font-${
                      cell.fontWeight ?? "normal"
                    } justify-center text-[var(${cell.color})] gap-2`}
                  >
                    {cell.icon && (
                      <Image
                        src={cell.icon}
                        alt="Arts"
                        width={18}
                        height={18}
                      />
                    )}
                    <p
                      className="truncate max-w-[80px] hover:overflow-visible hover:max-w-none relative group"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={cell.name}
                    >
                      {cell.name.toUpperCase()}
                    </p>
                    <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block p-2 bg-gray-700 text-white text-sm rounded-lg whitespace-nowrap">
                      {cell.name}
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableDataConfig[activeTab].map((rowData, rowIndex) => {
              const thresholdValue = rowData.threshold;
              const predictedAttendanceValue = rowData.predictedAttendance;
              const maxIndex = isSmartInsightsEnabled
                ? activeTab === "Category Trends"
                  ? getMaxIndexInRow(rowData)
                  : getMaximumAttendance(
                      thresholdValue,
                      predictedAttendanceValue
                    )
                : -1;
              return (
                // <TableRow key={rowIndex}>
                //   {tableHeaderConfig[activeTab].map((cell, index) => (
                //     <TableCell
                //       key={cell.slug}
                //       className={`text-center font-semibold p-6
                //         ${
                //           activeTab === "Time Trends" ||
                //           activeTab === "Location Trends"
                //             ? cell.slug === "threshold" &&
                //               isSmartInsightsEnabled
                //               ? "bg-[#DA2F35] bg-opacity-10 text-[#DA2F35]"
                //               : "bg-[#fff] border-solid border text-[#1C1B1F]"
                //             : activeTab === "Category Trends"
                //             ? index === maxIndex && isSmartInsightsEnabled
                //               ? "bg-[#DA2F35] border-2 bg-opacity-10 border-[var(--negative-color)]"
                //               : "bg-[#fff] border-solid border"
                //             : null
                //         }
                //         ${
                //           index === maxIndex &&
                //           activeTab === "Category Trends" &&
                //           isSmartInsightsEnabled
                //             ? "text-[#DA2F35]"
                //             : cell.slug === "month" ||
                //               cell.slug === "total" ||
                //               cell.slug === "events" ||
                //               cell.slug === "city"
                //             ? "text-[#6750a4]"
                //             : "text[#1C1B1F]"
                //         }`}
                //     >
                //       {rowData[cell.slug as keyof typeof rowData] || "N/A"}
                //     </TableCell>
                //   ))}
                // </TableRow>
                <TableRow key={rowIndex}>
                  {tableHeaderConfig[activeTab].map((cell, index) => (
                    <TableCell
                      key={cell.slug}
                      className={getCellStyle(
                        cell,
                        index,
                        maxIndex,
                        activeTab,
                        isSmartInsightsEnabled
                      )}
                    >
                      {getCellContent(rowData, cell)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TableAnalytics;
