import React from "react";
import styles from "./subevent.style.module.css";
import { AllEventsType, EventsType } from "@/types/alleventtype";
import calendarIcon from "/public/calendar.svg";
import PlaceIcon from "/public/location.svg";
import Image from "next/image";
import ClockIcon from "/public/clock.svg";
import PopperImage from "/public/widgetimages/Popper.png";
import { useRouter } from "next/navigation";

import DefaultIcon from "/public/stickyWidgetDefaultIcon.svg";
import POP from "/public/stickyCardPartyPopIcon.svg";
import TradeshowIcon from "/public/stickyCardTradeShow.svg";
import WorkShopIcon from "/public/stickyCardWorkshop.svg";
import ConferenceIcon from "/public/stickyCardConference.svg";

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
  console.log("dasdasdasd",buttonSettings,buttonSettings?.primary.fontColor)
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
              {fetchedAddedOtherData[0]?.eventFormat === "Virtual"
                ? "Virtual"
                : (fetchedAddedOtherData[0]?.cityName,
                  fetchedAddedOtherData[0]?.countryName)}
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
          {/* <div className={styles.icon_tags_container}>
          {fetchedAddedOtherData && fetchedAddedOtherData![0]?.eventType === "SUB" ? (
            <>
              <Image src={POP} alt="" />
            </>
          ) : fetchedAddedOtherData![0]?.eventType === "MAIN" &&
            fetchedAddedOtherData![0].event_type === "Tradeshow" ? (
            <Image src={TradeshowIcon} alt="" />
          ) : fetchedAddedOtherData![0]?.eventType === "MAIN" &&
            fetchedAddedOtherData![0].event_type === "Conference" ? (
            <Image src={ConferenceIcon} alt="" />
          ) : fetchedAddedOtherData![0]?.eventType === "MAIN" &&
            fetchedAddedOtherData![0].event_type === "Workshop" ? (
            <Image src={WorkShopIcon} alt="" />
          ) : (
            <Image src={DefaultIcon} alt="" />
          )}
          <div
            className={`${styles.pill} ${styles.type1}`}
            style={{ fontSize: fontSettings?.body.fontSize }}
          >
            {fetchedAddedOtherData![0]?.eventType === "MAIN"
              ? fetchedAddedOtherData![0].event_type
              : fetchedAddedOtherData![0]?.eventType === "SUB"
              ? fetchedAddedOtherData![0].participationType
              : "Tradeshow"}
          </div>
          <div
            className={`${styles.pill} ${styles.type2}`}
            style={{ fontSize: fontSettings?.body.fontSize }}
          >
            {fetchedAddedOtherData![0]?.eventType === "MAIN"
              ? fetchedAddedOtherData![0].eventFormat
              : fetchedAddedOtherData![0]?.eventType === "SUB"
              ? fetchedAddedOtherData![0].eventFormat
              : "Attending"}
          </div>
          </div> */}
          <div className={styles.button_And_tags_container}>
            <div className={styles.icon_tags_container}>
              {fetchedAddedOtherData &&
              fetchedAddedOtherData![0]?.eventType === "SUB" ? (
                <>
                  <Image src={POP} alt="" />
                </>
              ) : fetchedAddedOtherData![0]?.eventType === "PARENT" &&
                fetchedAddedOtherData![0].event_type === "Tradeshow" ? (
                <Image src={TradeshowIcon} alt="" />
              ) : fetchedAddedOtherData![0]?.eventType === "PARENT" &&
                fetchedAddedOtherData![0].event_type === "Conference" ? (
                <Image src={ConferenceIcon} alt="" />
              ) : fetchedAddedOtherData![0]?.eventType === "PARENT" &&
                fetchedAddedOtherData![0].event_type === "Workshop" ? (
                <Image src={WorkShopIcon} alt="" />
              ) : (
                <Image src={DefaultIcon} alt="" />
              )}
              <div
                className={`${styles.pill} ${styles.type1}`}
                style={{ fontSize: fontSettings?.body.fontSize }}
              >
                {fetchedEvent?.eventType === "PARENT"
                  ? fetchedEvent.event_type
                  : fetchedEvent?.eventType === "SUB"
                  ? fetchedEvent.participationType === "Brunch/Lunch/Dinner"
                    ? "Bru../Lun../Din.."
                    : fetchedEvent.participationType
                  : "Tradeshow"}
              </div>
              <div
                className={`${styles.pill} ${styles.type2}`}
                style={{ fontSize: fontSettings?.body.fontSize }}
              >
                {fetchedAddedOtherData![0]?.eventType === "PARENT"
                  ? fetchedAddedOtherData![0].eventFormat
                  : fetchedAddedOtherData![0]?.eventType === "SUB"
                  ? fetchedAddedOtherData![0].eventFormat
                  : "Attending"}
              </div>
            </div>

            <div
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
            </div>
          </div>

          {/* <div className={styles.tags_deleteContainer}></div> */}
        </div>
      </div>
    </div>
  );
};

export default SubEventCard;
