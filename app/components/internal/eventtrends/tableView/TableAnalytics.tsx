import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./table.style.module.css";
import descSort from "/public/internal/sort_down_arrow.svg";
import ascSort from "/public/internal/sort_up_arrow.svg";

interface Event {
  slug: string;
  attendance: number;
  categoryName: string;
}

interface GroupingByDate {
  [date: string]: Event[];
}

const TableAnalytics: React.FC<GroupingByDate> = ({ groupedData }) => {
  const [sortingKey, setSortingKey] = useState("date");
  const [sortingOrder, setSortingOrder] = useState("ASC");
  const { groupingByDate }: any = groupedData;
  const [eventData, setEventData] = useState(groupingByDate);

  const sortDataDesc = (key: keyof typeof eventData) => {
    setSortingOrder("DESC");
    if (key === "date") {
      const sortedKeys = Object.keys(groupingByDate).sort((dateA, dateB) => {
        const parsedDateA = new Date(dateA).getTime();
        const parsedDateB = new Date(dateB).getTime();
        return parsedDateB - parsedDateA;
      });

      const sortedGroupingByDate: typeof groupingByDate = {};
      sortedKeys.forEach((key) => {
        sortedGroupingByDate[key] = groupingByDate[key];
      });
      setEventData(sortedGroupingByDate);
    } else {
      const sortedGroupingByDate: typeof groupingByDate = {};
      for (const date in groupingByDate) {
        if (groupingByDate.hasOwnProperty(date)) {
          sortedGroupingByDate[date] = groupingByDate[date].sort(
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
      const sortedKeys = Object.keys(groupingByDate).sort((dateA, dateB) => {
        const parsedDateA = new Date(dateA).getTime();
        const parsedDateB = new Date(dateB).getTime();
        return parsedDateA - parsedDateB;
      });

      const sortedGroupingByDate: typeof groupingByDate = {};
      sortedKeys.forEach((key) => {
        sortedGroupingByDate[key] = groupingByDate[key];
      });
      setEventData(sortedGroupingByDate);
    } else {
      const sortedGroupingByDate: typeof groupingByDate = {};
      for (const date in groupingByDate) {
        if (groupingByDate.hasOwnProperty(date)) {
          sortedGroupingByDate[date] = groupingByDate[date].sort(
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
  const calculateTotalAttendance = (events: Event[]) => {
    return events.reduce((total, event) => total + event.attendance, 0);
  };

  return (
    <>
      <div className={styles.analytics_header}>
        <div className={styles.analytics_header_left}>
          <span style={{ fontWeight: 500, fontSize: "16px" }}>
            Daily Events
          </span>
          <span>
            <span className={styles.analytics_value_stats}>7</span>
            <span style={{ fontSize: "14px", color: "grey" }}>Events</span>
          </span>
        </div>
      </div>
      <div className={`${styles.table_container} ${styles.table_container2}`}>
        <table className={styles.table}>
          <thead className={styles.table_head}>
            <tr className={styles.table_head_row}>
              <th>
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
                        />
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={styles.table_body}>
            {Object.entries(eventData).map(([date, events]: [string, any]) => (
              <tr key={date}>
                <td>{date}</td>
                <td>{calculateTotalAttendance(events)}</td>
                {events.map((event: any, index: any) => (
                  <td key={index}>{event.attendance}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableAnalytics;
