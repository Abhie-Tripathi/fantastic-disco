import React from "react";
import Image from "next/image";
import PlaceHolder from "/public/placeholder.png";
import styles from "./exhibitors.style.module.css";
import { ArrowUpRight } from "geist-icons";

const Exhibitors = () => {
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
          <div>Future Software</div>
          <div className={styles.location}>Stand - 4/C54 </div>
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
          <div>Claremont Group Interiors Ltd</div>
          <div className={styles.location}>Stand - 4/C54 </div>
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
          <div>Future Software</div>
          <div className={styles.location}>Stand - 4/C54 </div>
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
          <div>Claremont Group Interiors Ltd</div>
          <div className={styles.location}>Stand - 4/C54 </div>
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
export default Exhibitors;
