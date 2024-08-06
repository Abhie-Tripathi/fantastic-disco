import React from "react";
import styles from "./ranking.style.module.css";

const Ranking = () => {
  return (
    <div className="card">
      <div className={`${styles.rankCards} ${styles.blurContent}`}>
        <div>
          <div className={`${styles.cardItem} card`}>
            <div className={styles.rank}>03</div>
            <div className={styles.rankType}>Country Rank</div>
          </div>
          <div className={styles.rankIn}>#42 of 1000 in</div>
          <div className={styles.rankName}>Singapore</div>
        </div>
        <div>
          <div className={`${styles.cardItem} card`}>
            <div className={styles.rank}>12</div>
            <div className={styles.rankType}>Industry Rank</div>
          </div>
          <div className={styles.rankIn}>#42 of 1000 in</div>
          <div className={styles.rankName}>Education & Training</div>
        </div>
        
        <div>
          <div className={`${styles.cardItem} card`}>
            <div className={styles.rank}>31</div>
            <div className={styles.rankType}>Country + Industry Rank</div>
          </div>
          <div className={styles.rankIn}>#42 of 1000 in</div>
          <div className={styles.rankName}>
            <span>Singapore</span> Education & Training</div>
        </div>
      </div>
    </div>
  );
};
export default Ranking;
