import React from "react";
import Image from "next/image";
import styles from './sponsors.style.module.css'

const Sponsors = () => {
  return (
    <div className={styles.exhibitorContainer}>
      <div className="card">Home Accommodation Services Ltd</div>
      <div className="card">RSS EXPRESS LTD T/A Ledbury Fuel Service Station</div>
    </div>
  );
};
export default Sponsors;
