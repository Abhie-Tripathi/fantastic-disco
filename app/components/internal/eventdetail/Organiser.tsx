"use client";
import React, { useState } from "react";
import styles from "./eventdesc.style.module.css";
import Image from "next/image";
import OrganiserIcon from "/public/organiser.svg";
import ClockIcon from "/public/clock.svg";
import LocationIcon from "/public/location.svg";
import Placehodler from "/public/placeholder.png";
import { useTheme } from "@/context";
import downArrowIcon from "/public/arrow_down.svg";
import rightDirectIcon from "/public/right_direction.svg";

interface Props {
  open: boolean;
}

const Organiser = ({ open }: Props) => {
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
        <Image src={OrganiserIcon} alt="page" className={iconClass} />
        <div className={styles.eventDetail_header}>
          Organiser
          <span className={styles.image_container}>
            <Image src={downArrowIcon} alt="dropdown" width={15} height={15} />
          </span>
        </div>
      </div>
      {accordianToggle && (
        <div className={styles.accordian}>
          <div className={styles.organiserContainer}>
            <Image
              src={Placehodler}
              alt="placeholder"
              className={styles.orgLogo}
            />
            <div className={styles.organiserNameContainer}>
              <div style={{ fontSize: 14 }}>GooCampus</div>
              <div style={{ fontSize: 12, color: "#999999" }}>
                Supercharge your online meetings
              </div>
            </div>
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
          <div className={styles.eventStats}>
            <div className={styles.upcomingEvent}>
              <Image
                src={ClockIcon}
                alt="clock"
                height={17}
                width={17}
                className={iconClass}
              />
              <div>Upcoming Events : NA</div>
            </div>
            <div className={styles.eventsHosted}>
              <Image
                src={ClockIcon}
                alt="clock"
                height={17}
                width={17}
                className={iconClass}
              />
              <div>Events Hosted : 12</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organiser;
