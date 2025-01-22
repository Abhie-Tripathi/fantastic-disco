"use client";

import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

interface NestedCircularProgressProps {
  outerValue: number;
  innerValue: number;
  total: number;
  size?: number;
}

export default function NestedCircularProgress({
  outerValue,
  innerValue,
  total,
  size = 200,
}: NestedCircularProgressProps) {
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <CircularProgressbar
        value={outerValue}
        strokeWidth={8}
        styles={buildStyles({
          strokeLinecap: "round",
          pathColor: "#5055A3",
          trailColor: "#9D50A3",
        })}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span className="text-sm font-bold text-[var(--primary-text-color)]">{total}</span>
        <span className="text-[10px] text-[var(--primary-text-color)]">Events</span>
      </div>
    </div>
  );
}
