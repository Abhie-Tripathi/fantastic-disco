"use client";
import React, { useEffect, useState } from "react";
import styles from "./eventdesc.style.module.css";
import Image from "next/image";
import PeopleIcon from "/public/user.svg";
import Placehodler from "/public/placeholder.png";
import downArrowIcon from '/public/arrow_down.svg'
import { useTheme } from "@/context";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { showToast } from "@/utils/showToast";

interface Props {
  open: boolean;
  eventId: string;
}

interface POCtypes {
  userId: string;
  name: string;
  profilePicture: null | string;
  designation: string;
}

const EventPoc = ({ open, eventId }: Props) => {
  const [accordianToggle, setAccordianToggle] = useState(open);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [pocData, setPocData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await myFetch(
        `${baseUrl}/event-follow/${eventId}`
      );

      if (data) {
        console.log(data);
        setPocData(data);
      }

      if (error) {
        console.log(error);
        showToast("error", error.message);
        return;
      }
    };
    fetchData();
  }, []);

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
        <div className={styles.eventDetail_header}>
          Event POC
          <span className={styles.image_container}>
            <Image src={downArrowIcon} alt="dropdown" width={15} height={15} />
          </span>
        </div>
      </div>
      {accordianToggle && (
        <div className={styles.accordian}>
          {pocData.length > 0 ? (
            pocData.map((poc: POCtypes) => (
              <div className={styles.organiserContainer} key={poc.userId}>
                <Image
                  src={poc.profilePicture ? poc.profilePicture : ""}
                  alt="placeholder"
                  className={styles.orgLogo}
                />
                <div className={styles.organiserNameContainer}>
                  <div style={{ fontSize: 14 }}>{poc.name}</div>
                  <div style={{ fontSize: 12 }}>{poc.designation}</div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noData_text}>No Data Found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventPoc;
