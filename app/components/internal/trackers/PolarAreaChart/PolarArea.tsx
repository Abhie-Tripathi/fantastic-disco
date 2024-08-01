import React from "react";
import styles from "./polararea.style.module.css";
import { PolarArea } from "react-chartjs-2";
import "chart.js/auto";

const PolarAreaChart = ({ className }: { className?: string }) => {
  const polarData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [],
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
    <div className={`${styles.polarChart_container} ${className}`}>
      <PolarArea data={polarData} options={polarOptions} />
      <div className={styles.polarChart_circle}>
        <div className={styles.polarChart_circle_innerborder}>
          <div className={styles.polarChart_totalNo}>0</div>
          <div className={styles.polarChart_totalNo_title}>events</div>
        </div>
      </div>
    </div>
  );
};

export default PolarAreaChart;