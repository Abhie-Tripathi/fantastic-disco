import React from "react";
import Image from "next/image";
import styles from './ranking.style.module.css'

const Ranking = () => {
  return (
    <div className={styles.exhibitorContainer}>
      <div className="card"></div>
      <div className="card"></div>
      <div className="card"></div>
      <div className="card"></div>
    </div>
  );
};
export default Ranking;
