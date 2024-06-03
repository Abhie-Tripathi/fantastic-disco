import React from "react";
import styles from "./eventCard.module.css";
const index = ({ width, top, background, name, styleClass, singleDayEvent}: any) => {
  return (
    <div
      className={`${styleClass === "stylesClass_A" ? styles.event : styles.event_new} ${singleDayEvent ? styles.singleDayEvent: ''}`}
      style={{
        width: width,
        top: top,
        backgroundColor: background,
      }}
    >
      {name}
    </div>
  );
};

export default index;
