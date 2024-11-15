import React from 'react'
import styles from './popup2.style.module.css'
import Image from 'next/image'
import placeholder2 from '/public/placeholder2.png'
import person1 from "@/public/person1.svg";
import person2 from "@/public/person2.svg";
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import { ButtonSettingsState } from '@/types/buttoncustomizetypes'

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
  buttonSettings?: ButtonSettingsState,
  selectedBtn?: "primary" | "secondary"
  fetchedAddedEvents?: PrefilledAddedEventsType[];
  smallCard: boolean;
  demoBanner:string;
  demoEventName:string,
  demoDescription:string
  demoLocation:string
  closeButtonSetting?:ButtonSettingsState
  demoDate:string
}

const Popup2: React.FC<Props> = ({ cardBgColor = "#ffffff",
  cardBorderRadius = 2,
  fontSettings = {
    heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
    subheading: { fontFamily: "arial", fontSize: 16, fontColor: "#000000", fontWeight: "bolder" },
    body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "bolder" }
  },
  buttonSettings = {
    primary: { buttonColor: "#0072F5", fontColor: "#000000", borderRadius: 4, borderColor: "#0072F5", buttonText: "Meet Us" },
    secondary: { fontColor: "#000000", borderRadius: 4, borderColor: "#6750a4", buttonText: "Meet Us" }
  }, selectedBtn = "primary", fetchedAddedEvents, smallCard, demoBanner, demoEventName, demoDescription, demoLocation, closeButtonSetting, demoDate  }: Props) => {

  const formatDate = (date: string) => {
    const dateObj = new Date(date);

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const year = dateObj.getFullYear();

    const getDayWithSuffix = (day: number) => {
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const value = day % 100;
      return day + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
    };

    return `${getDayWithSuffix(day)} ${month} ${year}`;
  };
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };
  const description = fetchedAddedEvents && fetchedAddedEvents.length ? truncateText(fetchedAddedEvents[0].description, 250) : demoDescription;
  const truncatedDescription = description.substring(0, 150) + (description.length > 150 ? "..." : "");
  return (
    <div className={smallCard ? styles.smallCard : styles.card} style={{ backgroundColor: cardBgColor, borderRadius: cardBorderRadius }}>
      <Image width={smallCard ? 250 : 350} height={smallCard ? 285 : 385} src={fetchedAddedEvents && fetchedAddedEvents.length > 0 ? fetchedAddedEvents[0].bannerUrl : demoBanner} alt='banner' className={styles.banner} />
      <div className={styles.details}>
        <div className={styles.eventName} data-name={fetchedAddedEvents![0]? fetchedAddedEvents![0].name :demoEventName} style={{ fontSize: fontSettings.heading.fontSize, color: fontSettings.heading.fontColor, fontFamily: fontSettings.heading.fontFamily, fontWeight: fontSettings.heading.fontWeight }}>{fetchedAddedEvents && fetchedAddedEvents.length > 0 ? `${fetchedAddedEvents[0].name.substring(0, 40)} ${fetchedAddedEvents[0].name.length > 40 ? "..." : ""}` : demoEventName}</div>
        <div className={styles.location_dateContainer}>
          <div className={styles.locationContainer}>
            <LocationIcon color={fontSettings.subheading.fontColor} />
            <div className={styles.location} style={{ fontSize: fontSettings.subheading.fontSize, color: fontSettings.subheading.fontColor, fontFamily: fontSettings.subheading.fontFamily, fontWeight: fontSettings.subheading.fontWeight }}>{fetchedAddedEvents && fetchedAddedEvents.length > 0 ? fetchedAddedEvents[0].eventFormat==="Virtual"?"Virtual": fetchedAddedEvents[0].cityName + ", " + fetchedAddedEvents[0].countryName : demoLocation}</div>
          </div>
          <div className={styles.dateContainer}>
            <DateIcon color={fontSettings.subheading.fontColor} />
            <div className={styles.date} style={{ fontSize: fontSettings.subheading.fontSize, color: fontSettings.subheading.fontColor, fontFamily: fontSettings.subheading.fontFamily, fontWeight: fontSettings.subheading.fontWeight }}>{fetchedAddedEvents && fetchedAddedEvents.length ? formatDate(fetchedAddedEvents[0].startDate) + " - " + formatDate(fetchedAddedEvents[0].endDate) : demoDate}</div>
          </div>
        </div>
        <div className={styles.type_peopleContainer}>
          <div className={styles.typeContainer}>
            <div className={`${styles.pill} ${styles.type1}`} style={{ fontSize: fontSettings.body.fontSize }}>{fetchedAddedEvents![0]?.eventType ==="MAIN"?"Main Event":fetchedAddedEvents![0]?.eventType ==="SUB"?"Side Event":"Main Event"}</div>
            <div className={`${styles.pill} ${styles.type1}`} style={{ fontSize: fontSettings.body.fontSize }}>{fetchedAddedEvents![0]?.eventType === "MAIN"? fetchedAddedEvents![0].event_type: fetchedAddedEvents![0]?.eventType === "SUB" ?fetchedAddedEvents![0].event_type:"Tradeshow"}</div>
            <div className={`${styles.pill} ${styles.type2}`} style={{ fontSize: fontSettings.body.fontSize }}>{fetchedAddedEvents![0]?.eventType === "MAIN"? fetchedAddedEvents![0].eventFormat: fetchedAddedEvents![0]?.eventType==="SUB" ?fetchedAddedEvents![0].eventFormat:"In-Person"}</div>
          </div>
          {/* <div className={styles.circles}>
            <div className={styles.circle} data-name="John Doe">
              <Image className={styles.image} src={person1} alt="person1" />
            </div>
            <div
              className={styles.circle}
              style={{ marginLeft: "-5px" }}
              data-name="Jane Smith"
            >
              <Image className={styles.image} src={person2} alt="person2" />
            </div>
            <div className={styles.circle} data-name="John Doe">
              <Image className={styles.image} src={person1} alt="person1" style={{ marginLeft: "-5px" }} />
            </div>
            <div
              className={styles.circle}
              style={{ marginLeft: "-5px" }}
              data-name="Jane Smith"
            >
              <Image className={styles.image} src={person2} alt="person2" />
            </div>
          </div> */}
        </div>
        <div className={styles.description} style={{ fontSize: fontSettings.body.fontSize, color: fontSettings.body.fontColor, fontFamily: fontSettings.body.fontFamily, fontWeight: fontSettings.body.fontWeight }} dangerouslySetInnerHTML={{ __html: truncatedDescription }}></div>
       <div className={styles.btnContainer}>
       <button
          className={styles.btn}
          style={{
            fontSize: smallCard ? 12 : fontSettings?.subheading.fontSize,
            color: selectedBtn === "primary" ? buttonSettings.primary.fontColor : buttonSettings.secondary.fontColor,
            backgroundColor: selectedBtn === "primary" ? buttonSettings.primary.buttonColor : "transparent",
            borderRadius: selectedBtn === "primary" ? buttonSettings.primary.borderRadius : buttonSettings.secondary.borderRadius,
            borderColor: selectedBtn === "primary" ? buttonSettings.primary.borderColor : buttonSettings.secondary.borderColor
          }}
        >
          {selectedBtn === "primary" ? buttonSettings.primary.buttonText : buttonSettings.secondary.buttonText}
        </button>

        <button
          className={styles.btn}
          style={{
            fontSize: smallCard ? 12 : fontSettings?.subheading.fontSize,
            color: selectedBtn === "primary" ? closeButtonSetting?.primary.fontColor : closeButtonSetting?.secondary.fontColor,
            backgroundColor: selectedBtn === "primary" ? closeButtonSetting?.primary.buttonColor : "transparent",
            borderRadius: selectedBtn === "primary" ? closeButtonSetting?.primary.borderRadius : closeButtonSetting?.secondary.borderRadius,
            borderColor: selectedBtn === "primary" ? closeButtonSetting?.primary.borderColor : closeButtonSetting?.secondary.borderColor,
            border:"none"
          }}
        >
          {selectedBtn === "primary" ? closeButtonSetting?.primary.buttonText : closeButtonSetting?.secondary.buttonText}
        </button>
       </div>
     
      </div>
    </div>
  );
}

export default Popup2

interface IconProps {
  color: string;
}

function DateIcon({ color }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" fill={color} /></svg>
  )
}
function LocationIcon({ color }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill={color} /></svg>
  )
}