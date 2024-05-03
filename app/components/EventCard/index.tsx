import React from "react";
import styles from "./eventCard.module.css";

const index = ({ width, top, background, name }: any) => {
  return (
    <div
      className={styles.event}
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
