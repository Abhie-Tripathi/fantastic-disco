import React from "react";
import Image from "next/image";
import styles from './exhibitors.style.module.css'
import PlaceHolder from "/public/placeholder.png";
import { ArrowUpRight } from "geist-icons";

const Sponsors = () => {
  return (
    <div className={styles.exhibitorContainer}>
      <div className={`${styles.exhibitorCard} card`}>
        <Image
          src={PlaceHolder}
          alt="company"
          width={48}
          height={48}
          style={{ borderRadius: 4 }}
        />
        <div>
          <div>Home Accommodation Services Ltd</div>
        </div>
        <span className={styles.exhibitorWebsite}>
          Website{" "}
          <ArrowUpRight
            style={{ color: "var(--primary-color)" }}
            height="12px"
          />
        </span>
      </div>
      <div className={`${styles.exhibitorCard} card`}>
        <Image
          src={PlaceHolder}
          alt="company"
          width={48}
          height={48}
          style={{ borderRadius: 4 }}
        />
        <div>
          <div>RSS EXPRESS LTD T/A Ledbury Fuel Service Station</div>
        </div>
        <span className={styles.exhibitorWebsite}>
          Website{" "}
          <ArrowUpRight
            style={{ color: "var(--primary-color)" }}
            height="12px"
          />
        </span>
      </div>
    </div>
  );
};
export default Sponsors;
