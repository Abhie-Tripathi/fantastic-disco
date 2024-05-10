import React from "react";
import styles from "./circularLoader.module.css";

const CircularLoader = ({ numerator, denominator, text }: any) => {
  // Calculate the percentage of completion
  const percentage = (numerator / denominator) * 100;

  return (
    <div className={styles.circular_loader}>
      <svg className={styles.progress_ring} width="80" height="80">
        <circle
          className="progress-ring_circle"
          stroke="#B8B7EA"
          strokeWidth="6"
          fill="#6750A41A"
          r="32"
          cx="40"
          cy="40"
        />
        <text className={styles.number} x="50%" y="45%" textAnchor="middle" fill="#FFFFFF" dy=".3em">
          {`${numerator}/${denominator}`}
        </text>
        <text className={styles.text} x="50%" y="65%" textAnchor="middle" fill="#FFFFFF" dy=".3em">{text}</text>
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
