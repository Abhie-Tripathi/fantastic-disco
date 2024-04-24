"use client";
import React, { useState } from "react";
import CircularSlider from "react-circular-slider-svg";
import styles from "./slider.style.module.css";

interface SliderProps {
  StatsName: string;
  startValue: any;
  onStartValueChange: (string: any) => void;
  endValue: any;
  onEndValueChange: (string: any) => void;
  Range: string;
  disabled?: boolean;
}

const Slider = ({
  StatsName,
  startValue,
  onStartValueChange,
  endValue,
  onEndValueChange,
  Range,
  disabled,
}: SliderProps) => {
  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ""}`}>
      <CircularSlider
        trackWidth={10}
        minValue={0}
        maxValue={100}
        startAngle={90}
        endAngle={270}
        // angleType={{ direction: "ccw", axis: "+x" }}
        handleSize={10}
        handle1={{ value: startValue, onChange: onStartValueChange }}
        handle2={{ value: endValue, onChange: onEndValueChange }}
        disabled={disabled}
        arcColor="#6750A4"
        arcBackgroundColor="#ccc"
      />

      <div className={styles.stats_container}>
        <div className={styles.stats_no}>{`${startValue.toFixed(
          0
        )}-${endValue.toFixed(0)}`}</div>
        <div className={styles.stats_name}>{StatsName}</div>
      </div>
    </div>
  );
};

export default Slider;