import React from "react";
import Image from "next/image";
import styles from './exhibitors.style.module.css'

const Exhibitors = () => {
  return (
    <div className={styles.exhibitorContainer}>
      <div className="card">Future Software</div>
      <div className="card">Future Software</div>
      <div className="card">Claremont Group Interiors Ltd</div>
      <div className="card">Claremont Group Interiors Ltd</div>
    </div>
  );
};
export default Exhibitors;
