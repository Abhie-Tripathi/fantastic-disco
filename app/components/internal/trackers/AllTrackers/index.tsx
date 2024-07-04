import React, { useState, useEffect } from "react";
import styles from "./allTrackers.style.module.css";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import Image from "next/image";
import Location from "/public/location_on.svg";
import GoTo from "/public/goTo.svg";
import Vectore6 from "/public/newVector.svg";
import Vectore7 from "/public/lucide_timer.svg";
import Vectore8 from "/public/expired.svg";
import Link from "next/link";
import { GAEvent } from "@/utils/GAEvent";
// import { useTheme } from '@/context/theme';
const AllTrackers = ({ item }: any) => {
  // const { theme } = useTheme();
  console.log(Math.floor(item?.groupedEventsCountByDate.length / 7));
  const lineData = {
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    datasets: [
      {
        label: "First dataset",
        data: [33, 65, 44, 85, 44, 65, 78],
        fill: true,
        backgroundColor: "rgba(250, 117, 157, 0.15)",
        borderColor: "#FA759D",
        tension: 0.3,
      },
    ],
  };

  const lineOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#45445994",
          font: {
            size: 8,
          },
        },
      },
      y: {
        beginAtZero: true,
        stepSize: 10,
        display: false,
      },
    },

    elements: {
      point: {
        radius: 0,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  const polarData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [18, 16, 13, 14, 16, 17],
        backgroundColor: [
          "#6750A4",
          "#EADDFF",
          "#FBD7E8",
          "#D6CEE8",
          "#B1A4D1",
        ],
      },
    ],
  };
  console.log(item);
  const [locations, setLocations] = useState<any>();

  useEffect(() => {
    console.log(item?.tracker?.eventCountry);
    
    const eventCountry = item?.filterValue?.eventCountry?.map((countryObj:{}) => Object.values(countryObj)[0])||[];
    const eventCity = item?.filterValue?.eventCity?.map((cityObj:{}) => Object.values(cityObj)[0])||[];
    const eventZone=item?.filterValue?.eventRegion?.split(",")||[];
    setLocations([...eventCountry, ...eventCity, ...eventZone]);
  }, [item]);
  return (
    <div className={styles.container}>
      <Link
        href={{
          pathname: `/internal/trackers/${item.id}/trackedEvents`,
          // query: { data: JSON.stringify(item) }
        }}
        onClick={() =>
          GAEvent(
            "trackers",
            "Trackers",
            "Saved Tracker | Any Filter Applied",
            "View"
          )
        }
      >
        <div className={styles.cardOne}>
          <div className={styles.heading}>{item.name}</div>
          <Image src={GoTo} alt="goTo" />
        </div>
        <div className={styles.cardTwo}>
          <Image src={Location} alt="location" />
          <div className={styles.location}>
            {locations?.length > 0 && locations[0]}
            {locations?.length > 1 && (
              <span className={styles.moreBtn}>+{locations.length - 1}</span>
            )}
          </div>
        </div>
        <div className={styles.cardThree}>
          <div className={styles.cardThreeLeft}>
            <div className={styles.cardType}>
              <div className={styles.new}>
                <Image src={Vectore6} alt="newVector" width={12} height={12}/>
                New
              </div>
              <div className={styles.number} style={{ color: "#454459" }}>
                {item.groupedEventsCountByStatus.groupedEventsByStatus.new}
              </div>
              <div className={styles.events}>Events</div>
            </div>
            <div className={styles.cardType}>
              <div className={styles.new}>
                <Image src={Vectore7} alt="lucide_timer" width={12} height={12}/>
                Active
              </div>
              <div className={styles.number} style={{ color: "#454459" }}>
                {item.groupedEventsCountByStatus.groupedEventsByStatus.active}
              </div>
              <div className={styles.events}>Events</div>
            </div>
            <div className={styles.cardType}>
              <div className={styles.new}>
                <Image src={Vectore8} alt="expired" width={12} height={12}/>
                Expired
              </div>
              <div className={styles.number} style={{ color: "#454459" }}>
                {item.groupedEventsCountByStatus.groupedEventsByStatus.expired}
              </div>
              <div className={styles.events}>Events</div>
            </div>
          </div>

          {/* <div className={styles.lineChart}>
            <Line data={lineData} options={lineOptions} />
          </div> */}
        </div>
      </Link>
    </div>
  );
};

export default AllTrackers;
