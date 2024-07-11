import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./table.style.module.css";
import descSort from "/public/internal/sort_down_arrow.svg";
import ascSort from "/public/internal/sort_up_arrow.svg";
import { useTheme } from "@/context";

interface Event {
  slug: string;
  attendance: number;
  categoryName: string;
  groupingByDate: any;
}

interface GroupingByDate {
  [key: string]: any;
}

interface TableAnalyticsProps {
  groupedData: GroupingByDate;
}

const TableAnalytics: React.FC<TableAnalyticsProps> = ({ groupedData }) => {
  const [sortingKey, setSortingKey] = useState("date");
  const [sortingOrder, setSortingOrder] = useState("ASC");
  const [eventData, setEventData] = useState<any>(groupedData.groupingByDate);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  useEffect(() => {
    setEventData(groupedData.groupingByDate);
  }, [groupedData]);

  const sortDataDesc = (key: keyof typeof eventData) => {
    setSortingOrder("DESC");
    if (key === "date") {
      const sortedKeys = Object.keys(groupedData.groupingByDate).sort(
        (dateA, dateB) => {
          const parsedDateA = new Date(dateA).getTime();
          const parsedDateB = new Date(dateB).getTime();
          return parsedDateB - parsedDateA;
        }
      );

      const sortedGroupingByDate: any = {};
      sortedKeys.forEach((date: any) => {
        sortedGroupingByDate[date] = groupedData.groupingByDate[date];
      });
      setEventData(sortedGroupingByDate);
    } else {
      const sortedGroupingByDate: any = {};
      for (const date in groupedData.groupingByDate) {
        if (groupedData.groupingByDate.hasOwnProperty(date)) {
          sortedGroupingByDate[date] = groupedData.groupingByDate[date].sort(
            (a: any, b: any) => {
              return b.slug === key
                ? b.attendance - a.attendance
                : a.attendance - b.attendance;
            }
          );
        }
      }
      setEventData(sortedGroupingByDate);
    }
  };

  const sortDataAsc = (key: keyof typeof eventData) => {
    setSortingOrder("ASC");
    if (key === "date") {
      const sortedKeys = Object.keys(groupedData.groupingByDate).sort(
        (dateA, dateB) => {
          const parsedDateA = new Date(dateA).getTime();
          const parsedDateB = new Date(dateB).getTime();
          return parsedDateA - parsedDateB;
        }
      );

      const sortedGroupingByDate: typeof groupedData.groupingByDate = {};
      sortedKeys.forEach((key) => {
        sortedGroupingByDate[key] = groupedData.groupingByDate[key];
      });
      setEventData(sortedGroupingByDate);
    } else {
      const sortedGroupingByDate: typeof groupedData.groupingByDate = {};
      for (const date in groupedData.groupingByDate) {
        if (groupedData.groupingByDate.hasOwnProperty(date)) {
          sortedGroupingByDate[date] = groupedData.groupingByDate[date].sort(
            (a: any, b: any) => {
              return b.slug === key
                ? a.attendance - b.attendance
                : b.attendance - a.attendance;
            }
          );
        }
      }
      setEventData(sortedGroupingByDate);
    }
  };

  const sortHandler = (key: any) => {
    sortingOrder === "ASC" ? sortDataDesc(key) : sortDataAsc(key);
    setSortingKey(key);
  };

  const objectValues: any = Object.entries(eventData)[0][1];
  const calculateTotalAttendance = (events: any) => {
    return events.reduce(
      (total: any, event: any) => total + event.attendance,
      0
    );
  };

  return (
    <>
      <div className={styles.analytics_header}>
        <div className={styles.analytics_header_left}>
          <span style={{ fontWeight: 500, fontSize: "16px" }}>
            DAILY EVENTS
          </span>
        </div>
      </div>
      <div className={`${styles.table_container} ${styles.table_container2}`}>
        <table className={styles.table}>
          <thead className={styles.table_head}>
            <tr className={styles.table_head_row}>
              <th style={{ width: "200px" }}>
                <div
                  style={{ width: "150px" }}
                  className={styles.table_column_heading}
                  onClick={() => sortHandler("date")}
                >
                  <div>Date</div>
                  <div className={styles.sortImg}>
                    {sortingKey === "date" && (
                      <Image
                        src={sortingOrder === "ASC" ? ascSort : descSort}
                        alt="Sort"
                        className={iconClass}
                      />
                    )}
                  </div>
                </div>
              </th>
              <th>
                <div
                  className={styles.table_column_heading}
                  onClick={() => sortHandler("total")}
                >
                  <div>Total</div>
                  <div className={styles.sortImg}>
                    {sortingKey === "total" && (
                      <Image
                        src={sortingOrder === "ASC" ? ascSort : descSort}
                        alt="Sort"
                        className={iconClass}
                      />
                    )}
                  </div>
                </div>
              </th>
              {objectValues.map((item: any, index: number) => (
                <th key={index}>
                  <div
                    className={styles.table_column_heading}
                    onClick={() => sortHandler(item.slug)}
                  >
                    <div>{item.categoryName}</div>
                    <div className={styles.sortImg}>
                      {sortingKey === item.slug && (
                        <Image
                          src={sortingOrder === "ASC" ? ascSort : descSort}
                          alt="Sort"
                          className={iconClass}
                        />
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={styles.table_body}>
            {Object.entries(eventData).map(
              ([key, items]: [key: any, items: any]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{calculateTotalAttendance(items)}</td>
                  {items.map((item: any, index: number) => (
                    <td key={index}>{item.attendance}</td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableAnalytics;
