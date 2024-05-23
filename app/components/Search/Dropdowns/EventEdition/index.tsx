import React, { useState } from "react";
import ReactSlider from "react-slider";
import styles from "./EventEdition.module.css";

const EventEdition = () => {
  const [value, setValue] = useState([20, 80]);
  return (
    <div className={styles.container}>
      <ReactSlider
        className={styles.horizontal_slider}
        thumbClassName={styles.example_thumb}
        trackClassName={styles.example_track}
      
        pearling
        minDistance={10}
        onChange={(event) => {}}
      />
      <div className={styles.range}>
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
};

export default EventEdition;
