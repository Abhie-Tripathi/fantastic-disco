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
import DefaultIcon from "/public/stickyWidgetDefaultIcon.svg";
import POP from "/public/stickyCardPartyPopIcon.svg";
import TradeshowIcon from "/public/stickyCardTradeShow.svg";
import WorkShopIcon from "/public/stickyCardWorkshop.svg";
import ConferenceIcon from "/public/stickyCardConference.svg";
import { LocationIcon } from "../../LocationIcon";
import { DateIcon } from "../../DateIcon";

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
  demoDate: string;
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
  demoDate,
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
    if (text?.length <= maxLength) {
      return text;
    }
    return text?.slice(0, maxLength) + "...";
  };
  const description = fetchedEvent
    ? truncateText(fetchedEvent[0]?.description, 150)
    : demoDescription;
  return (
    <div className={styles.card} style={{ backgroundColor: cardBgColor }}>
      <Image
        width={100}
        height={150}
        src={
          fetchedEvent && fetchedEvent.length > 0
            ? fetchedEvent[0]?.bannerUrl
            : demoBanner
        }
        alt="banner"
        className={`${styles.banner} shadow-md`}
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
          data-name={fetchedEvent![0]? fetchedEvent![0].name :demoEventName}
        >
          {/* {fetchedEvent && fetchedEvent.length > 0
            ? fetchedEvent[0]?.name.substring(0, 40)
            : demoEventName} */}
             {fetchedEvent && fetchedEvent.length > 0
          ? `${fetchedEvent[0].name.substring(0, 30)} ${fetchedEvent[0].name.length > 30 ? "..." : ""
          }`
          : demoEventName}
        </div>


        

        {/* Location */}
        <div className={styles.locationContainer}>
          <LocationIcon color={fontSettings.subheading.fontColor} iconSize={fontSettings.subheading.fontSize} />
          <div
            className={styles.location}
            style={{
              fontSize: fontSettings.subheading.fontSize,
              color: fontSettings.subheading.fontColor,
              fontFamily: fontSettings.subheading.fontFamily,
              fontWeight: fontSettings.subheading.fontWeight,
            }}
          >
            {fetchedEvent && fetchedEvent.length > 0
              ? fetchedEvent[0]?.eventFormat === "Virtual"
                ? "Virtual"
                : fetchedEvent[0]?.cityName +
                  ", " +
                  fetchedEvent[0]?.countryName
              : demoLocation}
          </div>
        </div>
        {/* Date */}
        <div className={styles.dateContainer}>
          <DateIcon color={fontSettings.subheading.fontColor} iconSize={fontSettings.subheading.fontSize}/>
          <div
            className={styles.date}
            style={{
              fontSize: fontSettings.subheading.fontSize,
              color: fontSettings.subheading.fontColor,
              fontFamily: fontSettings.subheading.fontFamily,
              fontWeight: fontSettings.subheading.fontWeight,
            }}
          >
            {fetchedEvent && fetchedEvent.length > 0
              ? formatDate(fetchedEvent[0]?.startDate) +
                " - " +
                formatDate(fetchedEvent[0]?.endDate)
              : demoDate}
          </div>
        </div>
        <div className={styles.icon_tags_container}>
          {fetchedEvent && fetchedEvent![0]?.eventType === "SUB" ? (
            <>
              <Image src={POP} alt="" />
            </>
          ) : fetchedEvent![0]?.eventType === "MAIN" &&
            fetchedEvent![0].event_type === "Tradeshow" ? (
            <Image src={TradeshowIcon} alt="" />
          ) : fetchedEvent![0]?.eventType === "MAIN" &&
            fetchedEvent![0].event_type === "Conference" ? (
            <Image src={ConferenceIcon} alt="" />
          ) : fetchedEvent![0]?.eventType === "MAIN" &&
            fetchedEvent![0].event_type === "Workshop" ? (
            <Image src={WorkShopIcon} alt="" />
          ) : (
            <Image src={DefaultIcon} alt="" />
          )}
          <div
            className={`${styles.pill} ${styles.type1}`}
            style={{ fontSize: fontSettings?.body.fontSize }}
          >
            {fetchedEvent![0]?.eventType === "MAIN"
              ? fetchedEvent![0].event_type
              : fetchedEvent![0]?.eventType === "SUB"
              ? fetchedEvent![0].event_type
              : "Tradeshow"}
          </div>
          <div
            className={`${styles.pill} ${styles.type2}`}
            style={{ fontSize: fontSettings?.body.fontSize }}
          >
            {fetchedEvent![0]?.eventType === "MAIN"
              ? fetchedEvent![0].eventFormat
              : fetchedEvent![0]?.eventType === "SUB"
              ? fetchedEvent![0].eventFormat
              : "In-Person"}
          </div>
        </div>
      </div>

      <div className={styles.registerButton}>
        {/* <button
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
          {selectedBtn === "primary"
            ? buttonSettings?.primary.buttonText
            : buttonSettings?.secondary.buttonText}
        </button> */}

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
            borderWidth: selectedBtn === "secondary" ? "1px" : "1px",
            borderStyle: selectedBtn === "secondary" ? "solid" : "solid",
          }}
        >
          {selectedBtn === "primary" ? buttonSettings?.primary.buttonText : buttonSettings?.secondary.buttonText}
        </button>
        {/* <div
              className={styles.detail_button}
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
                    borderWidth: selectedBtn === "secondary" ? "1px" : "1px",
                    borderStyle: selectedBtn === "secondary" ? "solid" : "solid",
              }}
            >
              VIEW DETAILS
            </div> */}
      </div>
    </div>
  );
};

export default StickyCard;

