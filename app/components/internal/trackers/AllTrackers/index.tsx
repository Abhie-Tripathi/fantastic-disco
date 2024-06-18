import React from 'react'
import styles from './allTrackers.style.module.css'
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import Image from 'next/image'
import Location from '/public/location_on.svg'
import GoTo from '/public/goTo.svg'
import Vectore6 from '/public/newVector.svg'
import Link from 'next/link';
// import { useTheme } from '@/context/theme';
const index = ({ item }: any) => {
  // const { theme } = useTheme();
  console.log(Math.floor(item?.groupedEventsCountByDate.length/7));
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

  return (

    <div className={styles.container}>
      <Link href={{
        pathname: `/internal/trackers/${item.id}/trackedEvents`,
        // query: { data: JSON.stringify(item) }
      }}>
        <div className={styles.cardOne}>
          <div className={styles.heading}>{item.name}</div>
          <Image src={GoTo} alt="goTo" />
        </div>
        <div className={styles.cardTwo}>
          <Image src={Location} alt="location" />
          <div className={styles.location}>{item?.filterValue
            ?.
            location
             && item?.filterValue
              ?.
              location
            [0]} {item?.filterValue
              ?.
              location && item?.filterValue
              ?.
              location.length>1 &&<span className={styles.moreBtn}>+{item?.filterValue
                ?.
                location.length-1}</span>}</div>
        </div>
        <div className={styles.cardThree}>
          <div className={styles.cardThreeLeft}>
            <div className={styles.cardType}>
              <div className={styles.new}><Image src={Vectore6} alt="vectore6" />New</div>
              <div className={styles.number} style={{color: "black"}}>{item.groupedEventsCountByStatus.groupedEventsByStatus.new}</div>
              <div className={styles.events}>Events</div>
            </div>
            <div className={styles.cardType}>
              <div className={styles.new}><Image src={Vectore6} alt="vectore6" />Active</div>
              <div className={styles.number} style={{color: "black"}}>{item.groupedEventsCountByStatus.groupedEventsByStatus.active}</div>
              <div className={styles.events}>Events</div>
            </div>
            <div className={styles.cardType}>
              <div className={styles.new}><Image src={Vectore6} alt="vectore6" />Expired</div>
              <div className={styles.number} style={{color: "black"}}>{item.groupedEventsCountByStatus.groupedEventsByStatus.expired}</div>
              <div className={styles.events}>Events</div>
            </div>
          </div>

          <div className={styles.lineChart}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </Link>
    </div>

  )
}

export default index
