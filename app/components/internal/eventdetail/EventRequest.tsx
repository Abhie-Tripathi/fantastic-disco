"use client";
import React, { useState } from "react";
import styles from "./eventRequest.module.css";
import Image from "next/image";
import { useTheme } from "@/context";
import PeopleIcon from "/public/people.svg";
import AttendeeCard from "./AttendeeCard";
import downArrowIcon from "/public/arrow_down.svg";
import { GAEvent } from "@/utils/GAEvent";
interface DetailsProps {
  open: boolean;
  participentData: any;
  coordinateActions: any;
}

const EventRequest = ({
  open,
  participentData,
  coordinateActions,
}: DetailsProps) => {
  const [accordianToggle, setAccordianToggle] = useState(open);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  return (
    <div className={`${styles.container} card`}>
      <div
        className={styles.header}
        onClick={() => {
          setAccordianToggle(!accordianToggle);
          !accordianToggle &&
            GAEvent("Coordinate", "Enquiry Detail", "Team Request", "Expanded");
        }}
      >
        <Image src={PeopleIcon} alt="page" className={iconClass} />
        <div className={styles.eventRequest_header}>
          Team Request
          <span className={styles.image_container}>
            <Image src={downArrowIcon} alt="dropdown" width={15} height={15} />
          </span>
        </div>
      </div>
      {accordianToggle && (
        <div className={styles.accordian}>
          <div className={styles.main_section}>
            {coordinateActions.map(
              (item: any) =>
                participentData.filter(
                  (users: any) => users.interest === item.status
                ).length > 0 && (
                  <AttendeeCard
                    key={item.status}
                    cardType={item.label}
                    userList={participentData.filter(
                      (users: any) => users.interest === item.status
                    )}
                  />
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRequest;
