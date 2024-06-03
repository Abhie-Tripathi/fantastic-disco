import React from 'react'
import styles from './allTrackers.style.module.css'
import "chart.js/auto";

import { Line } from "react-chartjs-2";
import Image from 'next/image'
import Location from '/public/location_on.svg'
import GoTo from '/public/goTo.svg'
import Vectore6 from '/public/newVector.svg'
import Link from 'next/link';
const index = () => {
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
  return (
    
      <div className={styles.container}>
        <Link href="/internal/trackers/1/trackedEvents">
        <div className={styles.cardOne}>
          <div className={styles.heading}>Events in Bangalore</div>
          <Image src={GoTo} alt="goTo" />
        </div>
        <div className={styles.cardTwo}>
          <Image src={Location} alt="location" />
          <div className={styles.location}>Bengaluru, Karnataka, India (1.34 mi radius) </div>
        </div>
        <div className={styles.cardThree}>
          <div className={styles.cardThreeLeft}>
            <div className={styles.cardType}>
              <div className={styles.new}><Image src={Vectore6} alt="vectore6" />New</div>
              <div className={styles.number}>115</div>
              <div className={styles.events}>Events</div>
            </div>
            <div className={styles.cardType}>
              <div className={styles.new}><Image src={Vectore6} alt="vectore6" />Active</div>
              <div className={styles.number}>70</div>
              <div className={styles.events}>Events</div>
            </div>
            <div className={styles.cardType}>
              <div className={styles.new}><Image src={Vectore6} alt="vectore6" />Expired</div>
              <div className={styles.number}>42</div>
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
