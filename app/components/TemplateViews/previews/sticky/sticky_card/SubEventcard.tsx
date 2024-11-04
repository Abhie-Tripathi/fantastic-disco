import React from "react";
import styles from "./subevent.style.module.css";
import { AllEventsType, EventsType } from "@/types/alleventtype";
import calendarIcon from "/public/calendar.svg";
import PlaceIcon from "/public/location.svg";
import Image from "next/image";
import ClockIcon from "/public/clock.svg";
import PopperImage from "/public/widgetimages/Popper.png";
import { useRouter } from "next/navigation";

interface Props {
  normalEvent?: AllEventsType;
  subEvent?: EventsType;
  fetchEvents?: (value: void) => void;
  handleDeleteModal: (
    id: string,
    name: string,
    isPresentinWidget: boolean
  ) => void;
  handlePrefillEvent?: (value: EventsType) => void;
  width: string;
  handlePrefillSubEvent?: (value: EventsType) => void;
  setSelectedEventType?: (value: string) => void;
}

// const SubEventCard = ({ normalEvent, subEvent, fetchEvents, handleDeleteModal, handlePrefillEvent,handlePrefillSubEvent, width,setSelectedEventType }: Props) => {
const SubEventCard = ({
  mainEvent,
  subEvent,
  normalEvent,
  fetchedEvent,
  cardBgColor,
  cardBorderRadius,
  fontSettings,
  selectedBtn,
  smallCard,
  buttonSettings,
  demoBanner,
  demoEventName,
  demoDescription,
  demoLocation,
  fetchedAddedOtherData,
}: any) => {
  console.log("sdasdasd", fetchedEvent);
  function formatEventDates(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start.getFullYear() === end.getFullYear()) {
      if (start.getMonth() === end.getMonth()) {
        if (start.getDate() === end.getDate()) {
          return new Date(startDate).toLocaleDateString("en-GB", {
            weekday: "long",
            month: "short",
            day: "2-digit",
            year: "numeric",
          });
        } else {
          return (
            new Date(startDate).toLocaleDateString("en-GB", {
              weekday: "long",
            }) +
            ", " +
            new Date(startDate).toLocaleDateString("en-GB", {
              day: "2-digit",
            }) +
            " - " +
            new Date(endDate).toLocaleDateString("en-GB", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          );
        }
      } else {
        return (
          new Date(startDate).toLocaleDateString("en-GB", {
            weekday: "long",
            month: "short",
            day: "2-digit",
          }) +
          " - " +
          new Date(endDate).toLocaleDateString("en-GB", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        );
      }
    } else {
      return (
        new Date(startDate).toLocaleDateString("en-GB", {
          weekday: "long",
          month: "short",
          day: "2-digit",
          year: "numeric",
        }) +
        " - " +
        new Date(endDate).toLocaleDateString("en-GB", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      );
    }
  }
  const router = useRouter();
 
  const width = "small";

  return (
    <div
      className={
        width === "small" && normalEvent
          ? styles.smallMainOuterDiv
          : width === "small" && subEvent
          ? styles.smallSubOuterDiv
          : styles.bigouterDiv
      }
    >
      <div className={styles.smallCard}>
        <Image src={PopperImage} alt="Popper" className={styles.popperImg} />
        {width === "small" && (
          <div className={styles.imageContainer}>
            <Image
              src={
                normalEvent?.mainEvent.logoUrl ||
                fetchedAddedOtherData[0]?.bannerUrl ||
                PlaceIcon
              }
              alt="Banner"
              height={130}
              width={130}
            />
            <div className={styles.squareOne}></div>
            <div className={styles.squareTwo}></div>
          </div>
        )}
        <div className={styles.details}>
          <div
            className={width === "small" ? styles.bigName : styles.smallName}
          >
            {normalEvent?.mainEvent.name || fetchedAddedOtherData[0]?.name}
          </div>
          <div className={styles.eventDataField} style={{ marginTop: 10 }}>
            <Image
              src={PlaceIcon}
              alt="locationIcon"
              width={14}
              height={14}
              className="icons"
            />
            <div>
              {
                (fetchedAddedOtherData[0]?.cityName,
                fetchedAddedOtherData[0]?.countryName)
              }
            </div>
          </div>
          <div className={styles.eventDateTimeContainer}>
            <div className={styles.eventDataField}>
              <Image
                src={calendarIcon}
                alt="calendarIcon"
                width={14}
                height={14}
                className="icons"
              />
              <div>
                {formatEventDates(
                  fetchedAddedOtherData[0]?.startDate,
                  fetchedAddedOtherData[0]?.endDate
                )}
              </div>
            </div>
            <div className={styles.eventDataField}>
              <Image
                src={ClockIcon}
                alt="clockIcon"
                width={14}
                height={14}
                className="icons"
              />
              <div>
                {fetchedAddedOtherData[0]?.startTime}-$
                {fetchedAddedOtherData[0]?.endTime},$
                {fetchedAddedOtherData[0]?.gmtZone}
              </div>
            </div>
          </div>
          <div className={styles.detail_button}
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
          >VIEW DETAILS</div>

          <div className={styles.tags_deleteContainer}></div>
        </div>
      </div>
    </div>
  );
};

export default SubEventCard;
