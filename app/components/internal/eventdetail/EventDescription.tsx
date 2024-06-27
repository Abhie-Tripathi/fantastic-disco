"use client";
import React, { useState } from "react";
import styles from "./eventdesc.style.module.css";
import Image from "next/image";
import PageIcon from "/public/page.svg";
import CalendarIcon from "/public/calendar.svg";
import LocationIcon from "/public/location.svg";
import rightDirectIcon from "/public/right_direction.svg";
import downArrowIcon from "/public/arrow_down.svg";
import person2 from "@/public/person2.svg";
import person1 from "@/public/person1.svg";
import { useTheme } from "@/context";

interface DetailsProps {
  description: string;
  open: boolean;
  speakers: boolean;
  shortlist: boolean;
}

const EventDescription = ({
  description,
  open,
  speakers,
  shortlist,
}: DetailsProps) => {
  const [accordianToggle, setAccordianToggle] = useState(open);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  return (
    <div
      className={`${styles.container} ${
        theme === "light" ? styles.container_light : ""
      }`}
    >
      <div
        className={styles.header}
        onClick={() => setAccordianToggle(!accordianToggle)}
      >
        <Image src={PageIcon} alt="page" className={iconClass} />
        <div className={styles.eventDetail_header}>
          Event Details
          <span className={styles.image_container}>
            <Image src={downArrowIcon} alt="dropdown" width={15} height={15} />
          </span>
        </div>
      </div>
      {accordianToggle && (
        <div className={styles.accordian}>
          <div className={styles.statusDateContainer}>
            <div
              className={`${styles.dateContainer} ${
                theme === "light" ? styles.dateContainer_light : ""
              }`}
            >
              <Image src={CalendarIcon} alt="date" className={iconClass} />
              <div className={styles.date}>1st Apr 2024 - 30th Apr 2024</div>
            </div>
            {shortlist && (
              <div className={styles.statusContainer}>
                <div className={styles.statusHeading}>Status</div>
                <div className={styles.statusValue}>Shortlisted</div>
              </div>
            )}
          </div>
          <div className={`${styles.locationContainer}`}>
            <div className={styles.locationContainer_location}>
              <Image src={LocationIcon} alt="location" className={iconClass} />
              <div className={styles.location}>Bengaluru, Karnataka</div>
            </div>
            <div className={styles.locationContainer_direction}>
              View Location
              <span className={styles.image_container}>
                <Image
                  src={rightDirectIcon}
                  alt="right"
                  width={15}
                  height={15}
                />
              </span>
            </div>
          </div>
          <div className={`${styles.descContainer}`}>
            <div className={styles.descHeading}>Description</div>
            <div className={styles.description}>{description}</div>
          </div>
          {speakers && (
            <div className={styles.speakersContainer}>
              <div className={styles.speakerHeading}>Speakers</div>
              <div className={styles.circles}>
                <div className={styles.circle} data-name="John Doe">
                  <Image className={styles.image} src={person1} alt="person1" />
                </div>
                <div
                  className={styles.circle}
                  style={{ marginLeft: "-15px", width: "45px", height: "45px" }}
                  data-name="Ravi Tripathi"
                >
                  RT
                </div>
                <div
                  className={styles.circle}
                  style={{ marginLeft: "-15px" }}
                  data-name="Jane Smith"
                >
                  <Image className={styles.image} src={person2} alt="person2" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventDescription;
