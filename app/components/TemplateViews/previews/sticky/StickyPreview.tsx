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
  demoDate: string;
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
  demoDate,
}: StickyProps) => {
  const [promotedEvents, setPromotedEvents] = useState<
    PrefilledAddedEventsType[]
  >([]);
  const [normalEvents, setNormalEvents] = useState<PrefilledAddedEventsType[]>(
    []
  );
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

  const router = useRouter();
  // const handleCardClick = (eventId: string, widgetId: string) => {
  //     // const hash = createHash(widgetId, eventId);
  //     // router.push(`/detailpage?widgetId=${widgetId}&eventId=${eventId}`)
  //     router.push(`/detailpage/${eventId}`);
  // }
  if (!fetchedAddedOtherData || fetchedAddedOtherData.length === 0) {
    return (
      <div className={styles.preview}>
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
            demoBanner={demoBanner}
            demoEventName={demoEventName}
            demoDescription={demoDescription}
            demoLocation={demoLocation}
            demoDate={demoDate}
          />
        </div>
      </div>
    );
  }

  const eventType = fetchedAddedOtherData[0]?.eventType;
  return (
    <>
      {eventType === "MAIN" ? (
        <div className={styles.preview}>
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
              fetchedEvent={fetchedAddedOtherData}
              demoBanner={demoBanner}
              demoEventName={demoEventName}
              demoDescription={demoDescription}
              demoLocation={demoLocation}
              demoDate={demoDate}
            />
          </div>
        </div>
      ) : eventType === "SUB" ? (
        <div className={styles.preview}>
          <div
            className={type === "top" ? styles.stickyTop : styles.stickyFooter}
          >
            <SubEventCard
              fetchedAddedOtherData={fetchedAddedOtherData}
              fetchedEvent={fetchedAddedOtherData[0]}
              cardBgColor={cardBgColor}
              cardBorderRadius={cardBorderRadius}
              fontSettings={fontSettings}
              selectedBtn={selectedBtn}
              smallCard={smallCard}
              buttonSettings={buttonSettings}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default StickyPreview;
