"use client"
import React,{useEffect, useState} from 'react'
import Expand from '/public/expand_more.svg';
import Table from '../savedEvent/page';
import styles from './trackedEvents.style.module.css'
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import Image from 'next/image';
// import Table from '@/app/components/Table'
const Page = () => {
  const [active,setActive]=useState("Active Events")
  console.log(active);
  const [open,setOpen]=useState(false);
  const showInsights = {
    eventSize: true,
    // eventKeywords: true,
    // global: true,
    // reptSent: true,
    // eventRank: true,
    // matchScore: true,
    // estExhibit: true,
    // growth: true,
    // repeatSent: true,
  };
  const lineData = {
    labels: ["01", "02", "03", "04", "05", "06", "07","08","09","10","11","12","13"],
    datasets: [
      {
        label: "First dataset",
        data: [33, 65, 44, 85, 44, 65, 78, 50, 60, 35, 28, 96, 54],
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
  useEffect(()=>{
      setOpen(true);
  },[])
  return (
    <div className={styles.container}>
    <div className={styles.top}>
      <div className={styles.topLeft} onClick={() => setOpen(!open)}>
        <div style={{ color: "#6750A4", fontWeight: "500" }}>Tracker Trends and Analytics</div>
        <div>
          <Image
            style={{
              transform: !open ? "rotate(-90deg)" : "none",
              transition: "transform 0.3s ease-in-out"
            }}
            src={Expand}
            alt="expand_more"
          />
        </div>
      </div>
      <div className={`${styles.transition} ${open ? styles.transitionOpen : ""}`}>
        <div className={styles.topFirst}>
          <div className={styles.topFirstLeft}>
            <div className={styles.overView}>Tracker Overview</div>
            <div className={styles.overViewContent}>Have a quick overview of all trackers and addition of any new events</div>
          </div>
          <div className={styles.topFirstRight}>
            <div className={styles.totalEvent}>Total Events</div>
            <div className={styles.overView} style={{ color: "#6750A4" }}>189</div>
          </div>
        </div>
        <div className={styles.lineChart}>
          <div className={styles.data}>
            <Line style={{ height: "200px" }} data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
      <div className={styles.topRight}></div>
    </div>
    <div className={styles.eventStatus}>
      <div className={styles.eventStatusLeft}>
        <button className={`${styles.eventStatusBtn} ${active === "Active Events" ? styles.active : ""}`} onClick={() => setActive("Active Events")}>Active Events</button>
        <button className={`${styles.eventStatusBtn} ${active === "New Events" ? styles.active : ""}`} onClick={() => setActive("New Events")}>New Events</button>
        <button className={`${styles.eventStatusBtn} ${active === "Expired Events" ? styles.active : ""}`} onClick={() => setActive("Expired Events")}>Expired Events</button>
      </div>
      <div className={styles.eventStatusRight}>Export Data</div>
    </div>
    <Table />
  </div>
  
  )
}

export default Page;
