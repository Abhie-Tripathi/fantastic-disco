"use client";
import React, { useEffect, useState } from "react";
import styles from "./eventdesc.style.module.css";
import Image from "next/image";
import PeopleIcon from "/public/user.svg";
// import Placehodler from "/public/placeholder.png";
import PlaceHolder from "/public/speaker1.jpeg";
import downArrowIcon from '/public/arrow_down.svg'
import { useTheme } from "@/context";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
// import { showToast } from "@/utils/showToast";
import { formatEventDates } from "@/utils/dateFormat";

interface Props {
  open: boolean;
  eventId: string;
}

interface POCtypes {
  id: number;
  name: string;
  profilePicture: null | string;
  designation: string | null;
  emailActive: string | null;
}

const EventPoc = ({ open, eventId }: Props) => {
  const [accordianToggle, setAccordianToggle] = useState(open);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [pocData, setPocData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const {data, error} = await myFetch(
        `${baseUrl}/event-poc/${eventId}`
      );

      // const data = await apiData.json();
      if (data) {
        setPocData(data.eventPoc);
      }

      if (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className={`${styles.container} card`}
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
          <div className={styles.allFollowerContainer}>
            {pocData?.length > 0 ? (
              pocData.map((poc: POCtypes) => (
                <div className={styles.followerContainer} key={poc.id}>
                  <Image
                    src={ poc?.profilePicture === null ? PlaceHolder : poc?.profilePicture }
                    alt="banner"
                    width={80}
                    height={80}
                    className={styles.followerProfilePhoto}
                  />
                  <div className={styles.followerDetails}>
                    <div className={styles.followerName}>
                      {poc?.name}
                      {/* <span className={styles.username}>{item.username}</span> */}
                    </div>
                    <div className={styles.followerPosition}>{poc?.designation}</div>
                    {poc?.emailActive &&
                      <div className={styles.emailActiveStatus}>Last Active: {formatEventDates(poc?.emailActive, poc?.emailActive)}</div>
                    }
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noData_text}>No Data Found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPoc;
