"use client";
import React, { useState } from "react";
import styles from "./eventRequest.module.css";
import Image from "next/image";
import { useTheme } from "@/context";
import PeopleIcon from "/public/people.svg";
import AttendeeCard from "./AttendeeCard";
import downArrowIcon from "/public/arrow_down.svg";
interface DetailsProps {
  open: boolean;
}

const EventRequest = ({ open }: DetailsProps) => {
  console.log("openene", open);
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
        <Image src={PeopleIcon} alt="page" className={iconClass} />
        <div className={styles.eventRequest_header}>
          Event Request
          <span className={styles.image_container}>
            <Image src={downArrowIcon} alt="dropdown" width={15} height={15} />
          </span>
        </div>
      </div>
      {accordianToggle && (
        <div className={styles.accordian}>
          <div className={styles.main_section}>
            <AttendeeCard cardType={"Attendee"} />
            <AttendeeCard cardType={"Speaker"} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRequest;
