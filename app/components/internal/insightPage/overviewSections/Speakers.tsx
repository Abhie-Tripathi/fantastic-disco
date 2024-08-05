import React from "react";
import Image from "next/image";
import styles from './speakers.style.module.css'

const Speakers = () => {
  return (
    <div className={styles.exhibitorContainer}>
      <div className="card">Daneil Azar</div>
      <div className="card">Lesa Demetrios</div>
    </div>
  );
};
export default Speakers;
