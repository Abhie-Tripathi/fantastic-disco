import React from "react";
import styles from "./eventCard.module.css";
import Link from "next/link";
const index = ({ width, top, background, name, styleClass, singleDayEvent, eventId}: any) => {
  return (
    <div
      className={`${styleClass === "stylesClass_A" ? styles.event : styles.event_new} ${singleDayEvent ? styles.singleDayEvent: ''}`}
      style={{
        width: width,
        top: top,
        backgroundColor: background,
      }}
    >
      <Link href={`/internal/event/${eventId}`} target="_blank" >{name}</Link>
    </div>
  );
};

export default index;
