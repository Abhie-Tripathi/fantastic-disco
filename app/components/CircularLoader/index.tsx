import React from "react";
import styles from "./circularLoader.module.css";

const CircularLoader = ({ numerator, denominator, text }: any) => {
  const percentage = (numerator / denominator) * 100;

  return (
    <div className={styles.circular_loader}>
      <svg className={styles.progress_ring} width="100" height="100">
        <circle
          className="progress-ring_remaining"
          stroke="#3A3152"
          strokeWidth="10"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className="progress-ring_circle"
          stroke="#B8B7EA"
          strokeWidth="10"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          strokeDasharray="283" //  according to the circumference of the circle (2 * π * r)
          strokeDashoffset={`calc(283 - (${percentage} / 100) * 283)`}
          // transition="stroke-dashoffset 0.3s"
        />
        <text
          className={styles.number}
          x="50%"
          y="45%"
          textAnchor="middle"
          fill="#FFFFFF"
          dy=".3em"
        >
          {`${numerator}/${denominator}`}
        </text>
        <text
          className={styles.text}
          x="50%"
          y="65%"
          textAnchor="middle"
          fill="#FFFFFF"
          dy=".3em"
        >
          {text}
        </text>
      </svg>
      <style jsx>{`
        .progress-ring_circle {
          stroke-linecap: round; // Ensures smooth edges
        }
      `}</style>
    </div>
  );
};

export default CircularLoader;
