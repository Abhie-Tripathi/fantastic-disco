import React, { useState } from "react";
import styles from "./list.module.css";
import Link from "next/link";
import Image from "next/image";
import Circle from "/public/circle.svg";
import Festival from "/public/festival.svg";
import Plus from "/public/plus.svg";
// import { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

const EventCard = () => {
  const [showDetails, setShowDetails] = useState(false);
  const onClickHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setShowDetails(!showDetails);
  };

  const startingDate = "Fri May 05 2023";
  const endingDate = "Mon May 08 2023";

  return (
    <div className={styles.eventCard_container}>
      <div className={styles.eventCard_header}>
        <div className={styles.eventCard_info}>
          <div className={styles.eventTitle}>Vue JS</div>
          <div
            className={styles.eventLocation}
          >London, UK</div>
          <div className={styles.eventDuration}>
            {startingDate} - {endingDate}
          </div>
        </div>
        <div className={styles.eventCard_addons}>
          <div className={styles.eventCard_addons_stats}>
            <div className={styles.eventSpend_amount}>$ 111,540,813</div>
            <div className={styles.eventSpend_title}>
              Predicted Event Spend (USD)
            </div>
          </div>

          <div className={styles.eventCard_addons_stats}>
            <div className={styles.eventAttendance_amount}>2,000,000</div>
            <div className={styles.eventAttendance_title}>Event Attendance</div>
          </div>

          <div className={styles.eventCard_addons_ranks}>
            <div className={styles.rank_container}>
              <Image src={Circle} alt="circle" width={50} />
              <div className={styles.rank}>100</div>
              <div className={styles.rank_title}>EIS</div>
            </div>
            <div className={styles.rank_container}>
              <Image src={Circle} alt="circle" width={50} />
              <div className={styles.rank}>100</div>
              <div className={styles.rank_title}>Local</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.eventCard_footer}>
        <div className={styles.eventType_info}>
          <div className={styles.eventCategory}>
            <Image src={Festival} alt="festival" />
            <div>Expos</div>
          </div>
          <span>|</span>
         
            <div className={styles.eventLabel}>Technology</div>
        </div>
        <button onClick={onClickHandler}>
          <Image src={Plus} alt="plus" />
          <div>More Details</div>
        </button>
      </div>
    </div>
  );
};

const List = ({ eventData }: any) => {
  return (
    <div className={styles.container}>
     
        <EventCard />
        <EventCard />
        <EventCard />
    </div>
  );
};

export default List;