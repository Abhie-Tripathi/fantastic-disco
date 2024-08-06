import React from "react";
import Image from "next/image";
import PlaceHolder from "/public/placeholder.png";
import styles from './speakers.style.module.css'
import { Plus } from "geist-icons";

const Speakers = () => {
  return (
    <div className={styles.exhibitorContainer}>
      <div className={`${styles.exhibitorCard} card`}>
        <Image
          src={PlaceHolder}
          alt="company"
          width={60}
          height={60}
          style={{ borderRadius: '8px' }}
        />
        <div>
          <div>Daneil Azar</div>
          <div className={styles.location}>Chief Design officer at Zillow</div>
        </div>
        <span className={styles.exhibitorWebsite}>
          Follow{" "}
          <Plus
            style={{ color: "var(--primary-color)" }}
            height="12px"
          />
        </span>
      </div>
      <div className={`${styles.exhibitorCard} card`}>
        <Image
          src={PlaceHolder}
          alt="company"
          width={60}
          height={60}
          style={{ borderRadius: '8px' }}
        />
        <div>
          <div>Lesa Demetrios</div>
          <div className={styles.location}>Chief curator at Eames Institute</div>
        </div>
        <span className={styles.exhibitorWebsite}>
          Follow{" "}
          <Plus
            style={{ color: "var(--primary-color)" }}
            height="12px"
          />
        </span>
      </div>
    </div>
  );
};
export default Speakers;
