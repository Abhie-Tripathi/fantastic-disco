import React from "react";
import styles from "./circularLoader.module.css";

const CircularLoader = ({ numerator, denominator }: any) => {
  // Calculate the percentage of completion
  const percentage = (numerator / denominator) * 100;

  return (
    <div className={styles.circular_loader}>
      <svg className={styles.progress_ring} width="80" height="80">
        <circle
          className="progress-ring_circle"
          stroke="#B8B7EA"
          strokeWidth="6"
          fill="transparent"
          r="32"
          cx="40"
          cy="40"
        />
        <text className={styles.text} x="50%" y="50%" textAnchor="middle" fill="#A48BE6" dy=".3em">
          {`${numerator}/${denominator}`}
        </text>
      </svg>
      <style jsx>{`
        .progress-ring_circle {
          stroke-dasharray: 201;
          stroke-dashoffset: calc(201 - (${percentage} / 100) * 201);
          transition: stroke-dashoffset 0.3s;
        }
      `}</style>
    </div>
  );
};

export default CircularLoader;
