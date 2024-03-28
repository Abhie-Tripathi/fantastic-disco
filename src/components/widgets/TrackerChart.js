import React from 'react'
import "chart.js/auto";
import Styles from './trackerChart.style.module.css'
import { Line, PolarArea } from "react-chartjs-2";
const TrackerChart = () => {
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
    
      const lineOptions= {
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
    
      const polarOptions= {
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
    <div className={Styles.charts}>
        <div className={Styles.lineChart}>
        <Line data={lineData} options={lineOptions} />
        </div>
        <div className={Styles.lineChart}>
        <PolarArea data={polarData} options={polarOptions} />
        </div>
    </div>
  )
}

export default TrackerChart
