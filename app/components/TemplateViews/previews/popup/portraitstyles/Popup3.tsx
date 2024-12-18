import React from "react";
import Image from "next/image";
import placeholder2 from "/public/placeholder2.png";
import locationIcon from "/public/location_on.svg";
import styles from "./popup3.style.module.css";
import { PrefilledAddedEventsType } from "@/types/prefilledaddedeventtype";
import { ButtonSettingsState } from "@/types/buttoncustomizetypes";
import { useRouter } from "next/navigation";
import { LocationIcon } from "../../LocationIcon";
import { DateIcon } from "../../DateIcon";

interface FontSettings {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
}

interface Props {
  cardBgColor?: string;
  cardBorderRadius?: number;
  fontSettings?: {
    heading: FontSettings;
    subheading: FontSettings;
    body: FontSettings;
  };
  buttonSettings?: ButtonSettingsState;
  closeButtonSetting?: ButtonSettingsState;
  selectedBtn?: "primary" | "secondary";
  fetchedAddedEvents?: PrefilledAddedEventsType[];
  smallCard: boolean;
  demoBanner: string;
  demoEventName: string;
  demoDescription: string;
  demoLocation: string;
  demoDate: string
  widgetId?: string;
}

const Popup3: React.FC<Props> = ({
  cardBgColor = "#ffffff",
  cardBorderRadius = 2,
  fontSettings = {
    heading: {
      fontFamily: "arial",
      fontSize: 24,
      fontColor: "#000000",
      fontWeight: "bolder",
    },
    subheading: {
      fontFamily: "arial",
      fontSize: 16,
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
  buttonSettings = {
    primary: {
      buttonColor: "#0072F5",
      fontColor: "#000000",
      borderRadius: 4,
      borderColor: "#0072F5",
      buttonText: "Meet Us",
    },
    secondary: {
      fontColor: "#000000",
      borderRadius: 4,
      borderColor: "#6750a4",
      buttonText: "Meet Us",
    },
  },
  selectedBtn = "primary",
  fetchedAddedEvents,
  smallCard,
  demoBanner,
  demoEventName,
  demoDescription,
  demoLocation,
  closeButtonSetting,
  demoDate,widgetId
}: Props) => {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("en-US", { month: "short" });
    const year = dateObj.getFullYear();

    // Function to get the appropriate suffix for the day
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
  const description =
    fetchedAddedEvents && fetchedAddedEvents.length
      ? truncateText(fetchedAddedEvents[0].description, 250)
      : demoDescription;
  const truncatedDescription =
    description.substring(0, 100) + (description.length > 100 ? "..." : "");
  const router = useRouter();
  const handleCardClick = (eventId: string, widgetId: string) => {
    router.push(`/detailpage?widgetId=${widgetId}&eventId=${eventId}`);
  };

  return (
    <div
      className={smallCard ? styles.smallCard : styles.card}
      style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}
    >
      <div className={styles.bannerContainer}>
        <Image
          // height={smallCard ? 150 : 220}
          src={
            fetchedAddedEvents && fetchedAddedEvents.length > 0
              ? fetchedAddedEvents[0].bannerUrl
              : demoBanner
          }
          alt="banner"
          width={350}
          height={smallCard ? 170 : 220}
          className={`w-full ${styles.banner} ${smallCard ? 'h-[170px]' : 'h-[220px]'} rounded-b-[50px] shadow-md`}
        />

        <div className={styles.event_type}>{fetchedAddedEvents![0]?.eventType === "MAIN" ? "Main Event" : fetchedAddedEvents![0]?.eventType === "SUB" ? "Side Event" : "Main Event"}</div>
        <div className={styles.type}>{fetchedAddedEvents![0]?.eventType === "MAIN" ? fetchedAddedEvents![0].event_type : fetchedAddedEvents![0]?.eventType === "SUB" ? fetchedAddedEvents![0].participationType : "Workshop"}</div>
      </div>


      <div className={styles.event_name_cont}>
        <div
          className={smallCard ? styles.smallName : styles.eventName}
          style={{
            fontSize: fontSettings.heading.fontSize,
            color: fontSettings.heading.fontColor,
            fontFamily: fontSettings.heading.fontFamily,
            fontWeight: fontSettings.heading.fontWeight,
          }}
          data-name={fetchedAddedEvents![0] ? fetchedAddedEvents![0].name : demoEventName}
        >
          {fetchedAddedEvents && fetchedAddedEvents.length > 0
            ? `${fetchedAddedEvents[0].name.substring(0, 30)} ${fetchedAddedEvents[0].name.length > 30 ? "..." : ""
            }`
            : demoEventName}
        </div>
      </div>
      <div className={styles.location_dateContainer}>
        <div className={styles.locationContainer}>
          <LocationIcon color={fontSettings?.subheading.fontColor || "black"} iconSize={fontSettings?.subheading.fontSize || 14}/>
          <div
            className={styles.location}
            style={{
              fontSize: fontSettings.subheading.fontSize,
              color: fontSettings.subheading.fontColor,
              fontFamily: fontSettings.subheading.fontFamily,
              fontWeight: fontSettings.subheading.fontWeight,
            }}
          >
            {fetchedAddedEvents && fetchedAddedEvents.length > 0
              ? fetchedAddedEvents[0].eventFormat === "Virtual" ? "Virtual" : (
                fetchedAddedEvents[0].cityName +
                ", " +
                fetchedAddedEvents[0].countryName
              ).substring(0, 30)
              : demoLocation}
          </div>
        </div>
        <div className={styles.dateContainer}>
          <DateIcon color={fontSettings?.subheading.fontColor || "black"} iconSize={fontSettings?.subheading.fontSize || 14}/>
          <div
            className={styles.date}
            style={{
              fontSize: fontSettings.subheading.fontSize,
              color: fontSettings.subheading.fontColor,
              fontFamily: fontSettings.subheading.fontFamily,
              fontWeight: fontSettings.subheading.fontWeight,
            }}
          >
            {fetchedAddedEvents && fetchedAddedEvents.length
              ? formatDate(fetchedAddedEvents[0].startDate) +
              " - " +
              formatDate(fetchedAddedEvents[0].endDate)
              : demoDate}
          </div>
        </div>
      </div>
      <div
        className={smallCard ? styles.smallDesc : styles.desc}
        style={{
          fontSize: fontSettings.body.fontSize,
          color: fontSettings.body.fontColor,
          fontFamily: fontSettings.body.fontFamily,
          fontWeight: fontSettings.body.fontWeight,
        }}
        dangerouslySetInnerHTML={{ __html: truncatedDescription }}
      ></div>

      <div className={styles.btnContainer}>
        <button
          onClick={() => handleCardClick(fetchedAddedEvents ? fetchedAddedEvents[0].id : "", widgetId ? widgetId : "")}
          className={smallCard ? styles.smallBtn : styles.btn}
          style={{
            fontSize: smallCard ? 12 : fontSettings?.subheading.fontSize,
            color:
              selectedBtn === "primary"
                ? buttonSettings.primary.fontColor
                : buttonSettings.secondary.fontColor,
            backgroundColor:
              selectedBtn === "primary"
                ? buttonSettings.primary.buttonColor
                : "transparent",
            borderRadius:
              selectedBtn === "primary"
                ? buttonSettings.primary.borderRadius
                : buttonSettings.secondary.borderRadius,
            borderColor:
              selectedBtn === "primary"
                ? buttonSettings.primary.borderColor
                : buttonSettings.secondary.borderColor,
          }}
        >
          {selectedBtn === "primary"
            ? buttonSettings.primary.buttonText
            : buttonSettings.secondary.buttonText}
        </button>

        <button
          className={smallCard ? styles.smallBtn : styles.btn}
          style={{
            fontSize: smallCard ? 12 : fontSettings?.subheading.fontSize,
            color:
              selectedBtn === "primary"
                ? closeButtonSetting?.primary.fontColor
                : closeButtonSetting?.secondary.fontColor,
            backgroundColor:
              selectedBtn === "primary"
                ? closeButtonSetting?.primary.buttonColor
                : "transparent",
            borderRadius:
              selectedBtn === "primary"
                ? closeButtonSetting?.primary.borderRadius
                : closeButtonSetting?.secondary.borderRadius,
            border: "none",
          }}
        >
          {selectedBtn === "primary"
            ? closeButtonSetting?.primary.buttonText
            : closeButtonSetting?.secondary.buttonText}
        </button>
      </div>
    </div>
  );
};

export default Popup3;
