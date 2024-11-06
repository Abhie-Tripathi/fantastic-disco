import React from "react";
import styles from "./stickyCard.style.module.css";
import Image from "next/image";
// import placeholder2 from '/public/placeholder2.png'
import placeholder2 from "/public/DemoBanner.png";
import locationIcon from "/public/location_on.svg";
import person1 from "@/public/person1.svg";
import person2 from "@/public/person2.svg";
import { PrefilledAddedEventsType } from "@/types/prefilledaddedeventtype";
import { ButtonSettingsState } from "@/types/buttoncustomizetypes";
interface FontSettings {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
}
interface CardProps {
  cardBgColor?: string;
  cardBorderRadius?: number;
  fontSettings?: {
    heading: FontSettings;
    subheading: FontSettings;
    body: FontSettings;
  };
  smallCard: boolean;
  selectedBtn?: "primary" | "secondary";
  buttonSettings?: ButtonSettingsState;
  fetchedEvent?: PrefilledAddedEventsType[];
  demoBanner: string;
  demoEventName: string;
  demoDescription: string;
  demoLocation: string;
}
const StickyCard = ({
  cardBgColor = "#ffffff",
  cardBorderRadius = 20,
  fontSettings = {
    heading: {
      fontFamily: "arial",
      fontSize: 24,
      fontColor: "#000000",
      fontWeight: "bolder",
    },
    subheading: {
      fontFamily: "arial",
      fontSize: 14,
      fontColor: "#000000",
      fontWeight: "bolder",
    },
    body: {
      fontFamily: "arial",
      fontSize: 12,
      fontColor: "#000000",
      fontWeight: "bolder",
    },
  },
  fetchedEvent,
  demoBanner,
  demoEventName,
  demoDescription,
  demoLocation,
  smallCard,
  buttonSettings,
  selectedBtn,
}: CardProps) => {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("en-US", { month: "short" });
    const year = dateObj.getFullYear();

    const getDayWithSuffix = (day: number) => {
      const suffixes = ["th", "st", "nd", "rd"];
      const value = day % 100;
      return (
        day + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
      );
    };

    return `${getDayWithSuffix(day)} ${month} ${year}`;
  };
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };
  const description = fetchedEvent
    ? truncateText(fetchedEvent[0]?.description, 150)
    : demoDescription;
  return (
    <div className={styles.card} style={{ backgroundColor: cardBgColor }}>
      <Image
        width={100}
        height={150}
        src={fetchedEvent ? fetchedEvent[0].bannerUrl : demoBanner}
        alt="banner"
        className={styles.banner}
      />

      <div className={styles.details}>
        {/* Event Name */}
        <div
          className={styles.eventName}
          style={{
            fontSize: fontSettings.heading.fontSize,
            color: fontSettings.heading.fontColor,
            fontFamily: fontSettings.heading.fontFamily,
            fontWeight: fontSettings.heading.fontWeight,
          }}
        >
          {fetchedEvent ? fetchedEvent[0].name.substring(0, 40) : demoEventName}
        </div>

        {/* Location */}
        <div className={styles.locationContainer}>
          <LocationIcon color={fontSettings.subheading.fontColor} />
          <div
            className={styles.location}
            style={{
              fontSize: fontSettings.subheading.fontSize,
              color: fontSettings.subheading.fontColor,
              fontFamily: fontSettings.subheading.fontFamily,
              fontWeight: fontSettings.subheading.fontWeight,
            }}
          >
            {fetchedEvent
              ? fetchedEvent[0].cityName + ", " + fetchedEvent[0].countryName
              : demoLocation}
          </div>
        </div>

        {/* Date */}
        <div className={styles.dateContainer}>
          <DateIcon color={fontSettings.subheading.fontColor} />
          <div
            className={styles.date}
            style={{
              fontSize: fontSettings.subheading.fontSize,
              color: fontSettings.subheading.fontColor,
              fontFamily: fontSettings.subheading.fontFamily,
              fontWeight: fontSettings.subheading.fontWeight,
            }}
          >
            {fetchedEvent
              ? formatDate(fetchedEvent[0].startDate) +
                " - " +
                formatDate(fetchedEvent[0].endDate)
              : "1st April 2024 - 3rd April 2024"}
          </div>
        </div>
      </div>

      {/* Registration Button */}
      {/* <div className={styles.registerButton}>
        <button
        >
          REGISTER NOW
        </button>
      </div> */}

      <div className={styles.registerButton}>
        <button
          className={smallCard ? styles.smallBtn : styles.btn}
          style={{
            fontSize: smallCard ? 12 : fontSettings?.subheading.fontSize,
            color:
              selectedBtn === "primary"
                ? buttonSettings?.primary.fontColor
                : buttonSettings?.secondary.fontColor,
            backgroundColor:
              selectedBtn === "primary"
                ? buttonSettings?.primary.buttonColor
                : "transparent",
            borderRadius:
              selectedBtn === "primary"
                ? buttonSettings?.primary.borderRadius
                : buttonSettings?.secondary.borderRadius,
            borderColor:
              selectedBtn === "primary"
                ? buttonSettings?.primary.borderColor
                : buttonSettings?.secondary.borderColor,
          }}
        >
         {selectedBtn === "primary" ? buttonSettings?.primary.buttonText : buttonSettings?.secondary.buttonText}
        </button>
      </div>
    </div>
  );
};

export default StickyCard;

interface IconProps {
  color: string;
}

function DateIcon({ color }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="15"
      viewBox="0 -960 960 960"
      width="15"
    >
      <path
        d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"
        fill={color}
      />
    </svg>
  );
}
function LocationIcon({ color }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="14"
      viewBox="0 -960 960 960"
      width="14"
    >
      <path
        d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"
        fill={color}
      />
    </svg>
  );
}
