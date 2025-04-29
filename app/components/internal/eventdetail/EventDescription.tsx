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
import { formatEventDates } from "@/utils/dateFormat";
import { Calendar, Location } from "geist-icons";
import { GAEvent } from "@/utils/GAEvent";
import { Event } from "@/types/events";

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};

const formatLocation = (location: Event["basic"]["eventLocation"]): string => {
  if (!location) return "";

  const { name, cityName, countryName, locationType } = location;

  if (!name && !cityName && !countryName) return "";

  const type = locationType?.toLowerCase() || "";

  if (type === "city") {
    if (countryName) return `${name || cityName}, ${countryName}`;
    return name || cityName || "";
  }

  if (type === "country") {
    return countryName || "";
  }

  if (type === "state") {
    if (countryName) return `${name}, ${countryName}`;
    return name || "";
  }

  if (cityName && countryName) return `${cityName}, ${countryName}`;
  if (cityName) return cityName;
  if (countryName) return countryName;

  return name || "";
};

interface DetailsProps {
  description: string;
  open: boolean;
  speakers: boolean;
  shortlist: boolean;
  eventDetail: Event["basic"];
}

const EventDescription = ({
  description,
  open,
  speakers,
  shortlist,
  eventDetail,
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
            GAEvent(
              "Coordinate",
              "Enquiry Detail",
              "Event Details",
              "Expanded"
            );
        }}
      >
        <Image
          src={PageIcon}
          width={24}
          height={24}
          alt="page"
          className={iconClass}
        />
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
              {/* <Image src={CalendarIcon} alt="date" className={iconClass} height={18} width={18} /> */}
              <Calendar
                height={"16px"}
                width={"16px"}
                color="var(--primary-text-color)"
              />
              <div className={styles.date}>
                {formatEventDates(
                  eventDetail.startDateTime,
                  eventDetail.endDateTime
                )}
              </div>
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
              {/* <Image src={LocationIcon} alt="location" className={iconClass} height={18} width={18} /> */}
              <Location
                height={"16px"}
                width={"16px"}
                color="var(--primary-text-color)"
                style={{ display: "flex" }}
              />
              <div className={styles.location}>
                {formatLocation(eventDetail.eventLocation)}
              </div>
            </div>
            {/* <div className={styles.locationContainer_direction}>
              View Location
              <span className={styles.image_container}>
                <Image
                  src={rightDirectIcon}
                  alt="right"
                  width={15}
                  height={15}
                />
              </span>
            </div> */}
          </div>
          {description && (
            <div className={`${styles.descContainer}`}>
              {/* <div className={styles.descHeading}>Description</div> */}
              <div className={styles.description}>{description}</div>
            </div>
          )}
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
