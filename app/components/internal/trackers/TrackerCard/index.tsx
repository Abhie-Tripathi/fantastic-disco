import React, { Suspense, lazy } from "react";
import styles from "./card.style.module.css";
import Link from "next/link";
import Loading from "@/app/components/UI/Loading";
import { useTheme } from "@/context";
const LineChart = lazy(() => import("../LineChart/LineChart"));
const PolarAreaChart = lazy(() => import("../PolarAreaChart/PolarArea"));
import { convertToCustomFormat } from "@/utils/dateFormat";

const TrackerCard = ({ trackerData }: { trackerData: any }) => {
  const { theme } = useTheme();

  return (
    <Link
      href={`/internal/trackers/${trackerData.id}`}
      className={`${styles.tracker_card} ${
        theme === "light" ? styles.tracker_card_light : ""
      }`}
    >
      <div className={styles.first_container}>
        <div className={styles.trackerinfo_container}>
          <div className={styles.tracker_title}>{trackerData.name}</div>
          <div className={styles.tracker_description}>
            {trackerData.filterValue.city.join(" , ")}
          </div>
        </div>

        <div className={styles.tags_container}>
          {trackerData.filterValue.category.map((ctg: string) => (
            <div className={styles.tag}>{ctg}</div>
          ))}
        </div>

        <div className={styles.linegraph_container}>
          <div className={styles.linegraph_title}>Tracker Overview</div>
          <div className={styles.linegraph_subtitle}>Since last visit</div>
          <div className={styles.linegraph}>
            <Suspense
              fallback={<Loading className={styles.lineGraphLoading} />}
            >
              <LineChart />
            </Suspense>
          </div>
        </div>
      </div>
      <div className={styles.second_container}>
        <div className={styles.dateRange_container}>
          <div className={styles.dateRange_title}>Date Range</div>
          <div className={styles.dateRange}>
            {convertToCustomFormat(trackerData.filterValue.active_gte)}-{" "}
            {convertToCustomFormat(trackerData.filterValue.active_lte)}
          </div>
        </div>

        <div className={styles.eventstatus_container}>
          <div className={styles.eventstatus_title}>Event Status:</div>
          <div className={styles.eventstatus}>
            {trackerData.filterValue.status.join(" , ")}
          </div>
        </div>

        <div className={styles.piechart_container}>
          <div
            className={`${styles.highlighted_stats_container} ${
              theme === "light" ? styles.highlighted_stats_container_light : ""
            }`}
          >
            <div className={styles.highlighted_stats_title}>
              Festivals Cancelled
            </div>
            <div className={styles.highlighted_stats}>
              <div className={styles.highlighted_stats_eventNo}>94 Events</div>
              <div className={styles.highlighted_stats_increase}>+ 3.4%</div>
            </div>
          </div>
          <Suspense fallback={<Loading className={styles.polarGraphLoading} />}>
            <PolarAreaChart />
          </Suspense>
        </div>
      </div>
    </Link>
  );
};

export default TrackerCard;
