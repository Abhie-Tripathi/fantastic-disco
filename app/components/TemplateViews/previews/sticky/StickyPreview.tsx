import React, { useEffect, useState } from "react";
import styles from "./stickypreview.style.module.css";
import { PrefilledAddedEventsType } from "@/types/prefilledaddedeventtype";
import { ButtonSettingsState } from "@/types/buttoncustomizetypes";
import { useRouter } from "next/navigation";
import StickyCard from "./sticky_card";
import SubEventCard from "./sticky_card/SubEventcard";
interface FontSettings {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
}

interface StickyProps {
  type: string;
  widgetId?: string;
  isFullScreen: boolean;
  cardBorderRadius?: number;
  buttonSettings?: ButtonSettingsState;

  selectedBtn?: "primary" | "secondary";
  smallCard: boolean;
  cardBgColor?: string;
  selectedCard?: string;
  fontSettings?: {
    heading: FontSettings;
    subheading: FontSettings;
    body: FontSettings;
  };
  fetchedAddedOtherData?: PrefilledAddedEventsType[];
  demoBanner: string;
  demoEventName: string;
  demoDescription: string;
  demoLocation: string;
}

const StickyPreview = ({
  type,
  selectedCard,
  isFullScreen,
  cardBgColor,
  cardBorderRadius,
  fontSettings,
  fetchedAddedOtherData,
  widgetId,
  demoBanner,
  demoEventName,
  demoDescription,
  demoLocation,
  selectedBtn,
  smallCard,
  buttonSettings,
}: StickyProps) => {
  const [promotedEvents, setPromotedEvents] = useState<
    PrefilledAddedEventsType[]
  >([]);
  const [normalEvents, setNormalEvents] = useState<PrefilledAddedEventsType[]>(
    []
  );

  // Filter events based on 'promoted' field and update state
  useEffect(() => {
    if (fetchedAddedOtherData && Array.isArray(fetchedAddedOtherData)) {
      const promoted = fetchedAddedOtherData.filter(
        (event) => event.promoted === "true"
      );
      const normal = fetchedAddedOtherData.filter(
        (event) => event.promoted === "false"
      );

      setPromotedEvents(promoted);
      setNormalEvents(normal);
    }
  }, [fetchedAddedOtherData]);

  console.log("events_in_sticky_view__ceds", fetchedAddedOtherData);

  return (
    <div className={styles.preview}>
      {fetchedAddedOtherData &&
        fetchedAddedOtherData.length > 0 &&
        fetchedAddedOtherData[0].eventType === "MAIN" ? (
        <div
          className={type === "top" ? styles.stickyTop : styles.stickyFooter}
        >
          <StickyCard
            fetchedEvent={fetchedAddedOtherData}
            cardBgColor={cardBgColor}
            cardBorderRadius={cardBorderRadius}
            fontSettings={fontSettings}
            selectedBtn={selectedBtn}
            smallCard={smallCard}
            buttonSettings={buttonSettings}
            demoBanner={""}
            demoEventName={""}
            demoDescription={""}
            demoLocation={""}
          />
        </div>

      ) : fetchedAddedOtherData &&
        fetchedAddedOtherData.length > 0 &&
        fetchedAddedOtherData[0].eventType === "SUB" ? (
        <SubEventCard
          fetchedAddedOtherData={fetchedAddedOtherData}
          fetchedEvent={event}
          cardBgColor={cardBgColor}
          cardBorderRadius={cardBorderRadius}
          fontSettings={fontSettings}
          selectedBtn={selectedBtn}
          smallCard={smallCard}
          buttonSettings={buttonSettings}
          demoBanner={""}
          demoEventName={""}
          demoDescription={""}
          demoLocation={""}
        />
      ) : (
        <div
          className={type === "top" ? styles.stickyTop : styles.stickyFooter}
        >
          <StickyCard
            cardBgColor={cardBgColor}
            cardBorderRadius={cardBorderRadius}
            fontSettings={fontSettings}
            selectedBtn={selectedBtn}
            smallCard={smallCard}
            buttonSettings={buttonSettings}
            demoBanner={demoBanner}
            demoEventName={demoEventName}
            demoDescription={demoDescription}
            demoLocation={demoLocation}
          />
        </div>
      )}
    </div>
  );
};

export default StickyPreview;
