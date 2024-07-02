import React, { useState, useEffect, Suspense } from "react";
import styles from "../AllTrackers/allTrackers.style.module.css";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import Loading from "@/app/components/UI/Loading";
import Image from "next/image";
import Location from "/public/location_on.svg";
import GoTo from "/public/goTo.svg";
import Vectore6 from "/public/newVector.svg";
import Vectore7 from "/public/lucide_timer.svg";
import Vectore8 from "/public/expired.svg";
import Link from "next/link";
import { usePathname, useSearchParams } from 'next/navigation';
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/context';
import { GAEvent } from "@/utils/GAEvent";
// import { useTheme } from '@/context/theme';
const CommonTrackerCard = () => {
  // const { theme } = useTheme();
  //   console.log(Math.floor(item?.groupedEventsCountByDate.length / 7));
  const pathName = usePathname().split('/');
  const id = pathName[pathName.length - 2];
  const [item, setItem] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      const url = `${baseUrl}/tracker/${id}`;
      try {
        const { data, error } = await myFetch(url, {
          method: 'GET'
        });
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setItem(data);

        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };

    fetchData();
  }, []);
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

    const eventCountry = item?.tracker?.filterValue?.eventCountry?.map((countryObj: {}) => Object.values(countryObj)[0]) || [];
    const eventCity = item?.tracker?.filterValue?.eventCity?.map((cityObj: {}) => Object.values(cityObj)[0]) || [];
    const eventZone = item?.tracker?.filterValue?.eventRegion?.split(",") || [];
    setLocations([...eventCountry, ...eventCity, ...eventZone]);
  }, [item]);
  return (
    <>
      {item?.tracker ? (
        <div className={styles.container} style={{ width: "100%", height: "fit-content" }}>

          <div className={styles.cardOne}>
            <div className={styles.heading}>{item?.tracker?.name}</div>
            {/* <div className={styles.heading}>one</div> */}
            {/* <Image src={GoTo} alt="goTo" /> */}
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
          <div className={styles.cardThree} style={{ height: "auto" }}>
            <div className={styles.cardThreeLeft} style={{ flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "20px" }}>
                <div className={styles.cardType} style={{ width: "50%" }}>
                  {/* <div className={styles.new}>
                <Image src={Vectore6} alt="newVector" />
                New
              </div> */}
                  <div className={`${styles.number} ${styles.numberCol}`} >
                    {item?.tracker.groupedEventsCountByStatus.groupedEventsByStatus.new}
                  </div>
                  <div className={styles.new} style={{ borderBottom: "0px" }}>
                    <Image src={Vectore6} alt="newVector" />
                    <div >New Events</div>
                  </div>
                </div>
                <div className={styles.cardType} style={{ width: "50%" }}>
                  {/* <div className={styles.new}>
                <Image src={Vectore7} alt="lucide_timer" />
                Active
              </div> */}
                  <div className={`${styles.number} ${styles.numberCol}`}>
                    {item?.tracker.groupedEventsCountByStatus.groupedEventsByStatus.active}
                  </div>
                  <div className={styles.new} style={{ borderBottom: "0px" }}>
                    <Image src={Vectore7} alt="lucide_timer" />
                    Active Events</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <div className={styles.cardType} style={{ width: "50%" }}>
                  <div className={`${styles.number} ${styles.numberCol}`}>
                    {item?.tracker.groupedEventsCountByStatus.groupedEventsByStatus.expired}
                  </div>
                  <div className={styles.new} style={{ borderBottom: "0px", alignItems: "center", justifyContent: "center" }}>
                    <Image src={Vectore8} alt="expired" />
                    Expired Events</div>
                </div>
                <div className={styles.cardType} style={{ width: "50%" }}>
                  <div className={`${styles.number} ${styles.numberCol}`}>
                    {item?.tracker.groupedEventsCountByStatus.groupedEventsByStatus.expired}
                  </div>
                  <div className={styles.new} style={{ borderBottom: "0px", alignItems: "center", justifyContent: "center" }}>
                    <Image src={Vectore8} alt="expired" />
                    Saved Events</div>
                </div>
              </div>
            </div>
            {/* <div className={styles.lineChart}>
            <Line data={lineData} options={lineOptions} />
          </div> */}
          </div>
        </div>
      ): (<div></div>)}
    </>
  );
};

export default CommonTrackerCard;
