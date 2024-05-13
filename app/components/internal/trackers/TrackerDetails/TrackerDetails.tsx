import React, { useState } from "react";
import styles from './trackerdetails.style.module.css';
import Slider from "../Slider";
import { Line, PolarArea } from "react-chartjs-2";
import "chart.js/auto";
import EventTable from "../EventTable/EventTable";
import { useTheme } from "@/context";
import CalendarIcon from '/public/calendar.svg'
import Image from "next/image";

const eventData = [
  {
    title: "Sydney Royal Easter Show",
    organizer: "Royal Agricultural Society of NSW",
    new: true,
    startdate: "14 Nov 2024",
    enddate: "04 Apr 2024",
    location: "Sydney, Australia",
    category: "Entertainment & Media",
    est_audience: "15,000 - 25000",
    intl_audience: "Low",
  },
  {
    title: "SECO International",
    organizer: "SECO International",
    new: true,
    startdate: "16 Nov 2024",
    enddate: "05 Apr 2024",
    location: "Sydney, Australia",
    category: "Entertainment & Media",
    est_audience: "15,000 - 25000",
    intl_audience: "Low",
  },
  {
    title: "Collect Art Fair",
    organizer: "Crafts Council",
    new: true,
    startdate: "20 Nov 2024",
    enddate: "04 Apr 2024",
    location: "Sydney, Australia",
    category: "Entertainment & Media",
    est_audience: "15,000 - 25000",
    intl_audience: "Low",
  },
  {
    title: "World Spa & Wellness London Convention",
    organizer: "Professional Beauty",
    new: true,
    startdate: "22 Nov 2024",
    enddate: "04 Apr 2024",
    location: "Sydney, Australia",
    category: "Entertainment & Media",
    est_audience: "15,000 - 25000",
    intl_audience: "Low",
  },
  {
    title: "POP Cats Chicago",
    organizer: "POP Cats",
    new: true,
    startdate: "04 Nov 2024",
    enddate: "04 Apr 2024",
    location: "Sydney, Australia",
    category: "Entertainment & Media",
    est_audience: "15,000 - 25000",
    intl_audience: "Low",
  },
  {
    title: "New York Wind Band Festival",
    organizer: "World Projects South Pacific",
    new: true,
    startdate: "23 Nov 2024",
    enddate: "04 Apr 2024",
    location: "Sydney, Australia",
    category: "Entertainment & Media",
    est_audience: "15,000 - 25000",
    intl_audience: "Low",
  },
];

const TrackerDetails = () => {
  const [startEventeliRank, setStartEventeliRank] = useState(34);
  const [endEventeliRank, setEndEventeliRank] = useState(76);

  const [startPredictedRank, setStartPredictedRank] = useState(23);
  const [endPredictedRank, setEndPredictedRank] = useState(75);

  const [startLocalRank, setStartLocalRank] = useState(35);
  const [endLocalRank, setEndLocalRank] = useState(67);

  const { theme } = useTheme();

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

  const lineOptions: any = {
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
            size: 9,
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

  const polarOptions: any = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      r: {
        display: false,
      },
    },

    elements: {
      point: {
        radius: 0,
      },
    },
  };
  return (
    <>
      <div className={styles.detailsCards_container}>
        <div className={styles.detailsCard}>
          <div className={styles.card_header}>
            <div className={styles.detail_title}>Tracker Details</div>
            <div className={styles.tracker_name}>
              Events in Bangalore
            </div>
          </div>
          <div className={styles.location_dateContainer}>
            <div className={styles.locationContainer}>Bengaluru, India</div>
            <div className={styles.dateContainer}>
              <Image src={CalendarIcon} alt="cal" />
              <span className={styles.date_value}>1 Apr 2024 - 30 Apr 2024</span>
            </div>
          </div>
          <div className={styles.category_statusContainer}>
            <div className={styles.category_container}>
              <div className={styles.subcontainer_detail__title}>Event Category</div>
              <div className={styles.category_values}>
                <div className={styles.chips_value}>Hospitality</div>
                <div className={styles.chips_value}>Festivals</div>
              </div>
            </div>
            <div className={styles.statusContainer}>
              <div className={styles.subcontainer_detail__title}>
                Event Status
              </div>
              <div className={styles.status_values}>
                <div className={styles.chips_value}>Cancelled</div>
                <div className={styles.chips_value}>Postpones</div>
              </div>
            </div>
          </div>
          <div className={styles.attendance_labelContainer}>
            <div className={styles.attendanceContainer}>
              <span className={styles.subcontainer_detail__title}>
                Attendance
              </span>
              <span className={styles.detail_value}>2,00,000-5,00,000</span>
            </div>
            <div className={styles.label_container}>
              <div className={styles.label_title}>Labels</div>
              <div className={styles.labels}>
                Politics, parade, nightlife
              </div>
            </div>
          </div>
        </div>
        <div className={styles.thresholdCard}>
          <div className={styles.detail_title}>Threshold Details</div>
          <div className={styles.slider_container}>
            <div className={styles.slider_header}>Scores and Ranks</div>
            <div className={styles.sliderinput_container}>
              <Slider
                disabled
                StatsName="Eventeli Ranking"
                startValue={startEventeliRank}
                endValue={endEventeliRank}
                onEndValueChange={setEndEventeliRank}
                onStartValueChange={setStartEventeliRank}
                Range="0-100"
              />
              <Slider
                disabled
                StatsName="Local Ranking"
                startValue={startLocalRank}
                endValue={endLocalRank}
                onEndValueChange={setEndLocalRank}
                onStartValueChange={setStartLocalRank}
                Range="0-100"
              />
              <Slider
                disabled
                StatsName="Prediction Score"
                startValue={startPredictedRank}
                endValue={endPredictedRank}
                onEndValueChange={setEndPredictedRank}
                onStartValueChange={setStartPredictedRank}
                Range="0-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.overview_container} ${theme === 'light' ? styles.overview_container_light : ""}`}>
        <div className={styles.overview_header}>
          <div className={styles.overview_title_container}>
            <div className={styles.overview_title}>Tracker Overview</div>
            <div className={styles.overview_description}>
              Have a quick overview of all trackers and addition of any new
              events
            </div>
          </div>
          <div className={styles.eventStats_container}>
            <div className={styles.eventStats_title}>Total New Events</div>
            <div className={styles.eventStats}>189</div>
          </div>
        </div>
        <div className={styles.chart_container}>
          <div className={styles.firstchart}>
            <div className={styles.chart_title}>Changes since Last visit</div>
            <div className={styles.lineChart_container}>
              <div className={styles.lineChart}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
          </div>
          <div className={styles.secondchart}>
            <div className={styles.chart_title}>Event Details</div>
            <div className={styles.polarChart_container}>
              <div className={styles.polarChart}>
                <PolarArea data={polarData} options={polarOptions} />
                <div className={styles.polarChart_circle}>
                  <div className={styles.polarChart_circle_innerborder}>
                    <div className={styles.polarChart_totalNo}>206</div>
                    <div className={styles.polarChart_totalNo_title}>
                      events
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <EventTable eventData={eventData} />
      </div>
    </>
  );
};

export default TrackerDetails;