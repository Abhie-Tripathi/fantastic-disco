import React from "react";
import Image from "next/image";
import styles from './exhibitors.style.module.css'

const Exhibitors = () => {
  return (
    <div className={styles.exhibitorContainer}>
      <div className="card"></div>
      <div className="card"></div>
      <div className="card"></div>
      <div className="card"></div>
    </div>
  );
};
export default Exhibitors;
