import React, { useEffect, useState } from "react";
import styles from "./stickypreview.style.module.css";
import { PrefilledAddedEventsType } from "@/types/prefilledaddedeventtype";
import StickyCard from "./sticky_card";
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

  return (
    // <div className={styles.preview}>
    //     <div className={type === "top" ? styles.stickyTop : styles.stickyFooter}>Your Event Name</div>
    //     {/* <iframe src="https://10times.com/" className={styles.website}></iframe> */}
    //     <div className={styles.website}>Your Website</div>
    // </div>

    <div className={styles.preview}>
      {fetchedAddedOtherData && fetchedAddedOtherData.length > 0 ? (
        <>
          {/* <StickyCard
            fetchedAddedOtherData={normalEvents}
            selectedCard={selectedCard}
            cardBgColor={cardBgColor}
            cardBorderRadius={cardBorderRadius}
            fontSettings={fontSettings}
            demoBanner={demoBanner}
            demoEventName={demoEventName}
            demoDescription={demoDescription}
            demoLocation={demoLocation}
          /> */}
        </>
      ) : (
        <>
          {/* <StickyCard
            fetchedAddedOtherData={normalEvents}
            selectedCard={selectedCard}
            cardBgColor={cardBgColor}
            cardBorderRadius={cardBorderRadius}
            fontSettings={fontSettings}
            demoBanner={demoBanner}
            demoEventName={demoEventName}
            demoDescription={demoDescription}
            demoLocation={demoLocation}
          /> */}
        </>
      )}
    </div>
  );
};

export default StickyPreview;
