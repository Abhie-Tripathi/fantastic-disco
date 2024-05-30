import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./table.style.module.css";
// import diagonalArrowIcon from "/public/.svg";
import EventData from "@/public/data/trendsEventData.json";
import descSort from "/public/internal/sort_down_arrow.svg";
import ascSort from "/public/internal/sort_up_arrow.svg";

const TableAnalytics = () => {
  const [eventData, setEventData] = useState(EventData);
  const [sortingKey, setSortingKey] = useState("date");
  const [sortingOrder, setSortingOrder] = useState("ASC");

  const sortDataDesc = (key: keyof (typeof eventData)[0]) => {
    setSortingOrder("DESC");
    const sortedData = [...eventData].sort((a, b) => {
      if (key === "date") {
        return (b[key] as string).localeCompare(a[key] as string);
      }
      return (b[key] as number) - (a[key] as number);
    });
    setEventData(sortedData);
  };

  const sortDataAsc = (key: keyof (typeof eventData)[0]) => {
    setSortingOrder("ASC");
    const sortedData = [...eventData].sort((a, b) => {
      if (key === "date") {
        return (a[key] as string).localeCompare(b[key] as string);
      }
      return (a[key] as number) - (b[key] as number);
    });
    setEventData(sortedData);
  };

  const sortHandler = (key: any) => {
    sortingOrder === "ASC" ? sortDataDesc(key) : sortDataAsc(key);
    setSortingKey(key);
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
                  className={styles.table_column_heading}
                  onClick={() => sortHandler("date")}
                >
                  <span>Date</span>
                  {sortingKey === "date" && (
                    <span>
                      <Image
                        src={sortingOrder === "ASC" ? ascSort : descSort}
                        alt="Sort"
                      />
                    </span>
                  )}
                </div>
              </th>
              <th>
                <div
                  className={styles.table_column_heading}
                  onClick={() => sortHandler("total")}
                >
                  <span>Total</span>
                  {sortingKey === "total" && (
                    <span>
                      <Image
                        src={sortingOrder === "ASC" ? ascSort : descSort}
                        alt="Sort"
                      />
                    </span>
                  )}
                </div>
              </th>
              <th>
                <div
                  className={styles.table_column_heading}
                  onClick={() => sortHandler("community")}
                >
                  <span>Community</span>
                  {sortingKey === "community" && (
                    <span>
                      <Image
                        src={sortingOrder === "ASC" ? ascSort : descSort}
                        alt="Sort"
                      />
                    </span>
                  )}
                </div>
              </th>
              <th>
                <div
                  className={styles.table_column_heading}
                  onClick={() => sortHandler("concerts")}
                >
                  <span>Concerts</span>
                  {sortingKey === "concerts" && (
                    <span>
                      <Image
                        src={sortingOrder === "ASC" ? ascSort : descSort}
                        alt="Sort"
                      />
                    </span>
                  )}
                </div>
              </th>
              <th>
                <div
                  className={styles.table_column_heading}
                  onClick={() => sortHandler("conference")}
                >
                  <span>Conference</span>
                  {sortingKey === "conference" && (
                    <span>
                      <Image
                        src={sortingOrder === "ASC" ? ascSort : descSort}
                        alt="Sort"
                      />
                    </span>
                  )}
                </div>
              </th>
              <th>
                <div
                  className={styles.table_column_heading}
                  onClick={() => sortHandler("expos")}
                >
                  <span>Expos</span>
                  {sortingKey === "expos" && (
                    <span>
                      <Image
                        src={sortingOrder === "ASC" ? ascSort : descSort}
                        alt="Sort"
                      />
                    </span>
                  )}
                </div>
              </th>
              <th>
                <div
                  className={styles.table_column_heading}
                  onClick={() => sortHandler("festivals")}
                >
                  <span>Festivals</span>
                  {sortingKey === "festivals" && (
                    <span>
                      <Image
                        src={sortingOrder === "ASC" ? ascSort : descSort}
                        alt="Sort"
                      />
                    </span>
                  )}
                </div>
              </th>
              <th>
                <div
                  className={styles.table_column_heading}
                  onClick={() => sortHandler("performance")}
                >
                  <span>Performance</span>
                  <span>
                    {sortingKey === "performance" && (
                      <Image
                        src={sortingOrder === "ASC" ? ascSort : descSort}
                        alt="Sort"
                      />
                    )}
                  </span>
                </div>
              </th>
              <th>
                <div
                  className={styles.table_column_heading}
                  onClick={() => sortHandler("sports")}
                >
                  <span>Sports</span>
                  {sortingKey === "sports" && (
                    <span>
                      <Image
                        src={sortingOrder === "ASC" ? ascSort : descSort}
                        alt="Sort"
                      />
                    </span>
                  )}
                </div>
              </th>
              <th>
                <div className={styles.table_column_heading}>
                  <span>Events</span>
                  {sortingKey === "events" && (
                    <span>
                      <Image
                        src={sortingOrder === "ASC" ? ascSort : descSort}
                        alt="Sort"
                      />
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>

          <tbody className={styles.table_body}>
            {eventData &&
              eventData.map((event) => (
                <tr key={event.date}>
                  <td>{event.date}</td>
                  <td>{event.total}</td>
                  <td>{event.community}</td>
                  <td>{event.concerts}</td>
                  <td>{event.conferences}</td>
                  <td>{event.expos}</td>
                  <td>{event.festivals}</td>
                  <td>{event.performance}</td>
                  <td>{event.sports}</td>
                  <td>
                    <Link href="#" style={{ textDecoration: "none" }}>
                      <div className={styles.analytics_link}>
                        <span>{event.events}</span>
                        <span>
                          {/* <Image
                            src={diagonalArrowIcon}
                            width={10}
                            height={10}
                            alt="Arrow"
                          /> */}
                        </span>
                      </div>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* <div className={styles.analytics_footer}>
        <div className={styles.analytics_records_container}>
          <select
            name="record-select"
            id="record"
            className={styles.analytics_footer_dropdown}
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="31">31</option>
          </select>
        </div>
      </div> */}
    </>
  );
};

export default TableAnalytics;
