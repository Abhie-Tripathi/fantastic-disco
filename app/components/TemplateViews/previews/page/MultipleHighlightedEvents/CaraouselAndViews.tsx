import React, { ElementType, useEffect, useState } from 'react'
import CaraouselView from '../CarouselView/CaraouselView'
import ListView from '../MultipleEvents/ListView'
import styles from './style.module.css'
import GridView from '../MultipleEvents/GridView';
import ListAndGridView from '../MultipleEvents/ListAndGridView';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype';

interface FontSettings {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
}

interface Props {
  widgetId?: string;
  type: string;
  isFullScreen: boolean;
  cardBorderRadius?: number;
  cardBgColor?: string;
  selectedCard?: string;
  fontSettings?: {
    heading: FontSettings;
    subheading: FontSettings;
    body: FontSettings;
  };
  fetchedAddedOtherData?: PrefilledAddedEventsType[]
  demoBanner: string;
  demoEventName: string;
  demoDescription: string
  demoLocation: string
  demoDate: string
  smallCard : boolean;
}

const CaraouselAndViews = ({ type, selectedCard, isFullScreen, cardBgColor, cardBorderRadius, fontSettings, fetchedAddedOtherData, widgetId, demoBanner, demoEventName, demoDescription, demoLocation, demoDate, smallCard }: Props) => {

  const [promotedEvents, setPromotedEvents] = useState<PrefilledAddedEventsType[]>([])
  const [normalEvents, setNormalEvents] = useState<PrefilledAddedEventsType[]>([])

  // Filter events based on 'promoted' field and update state
  useEffect(() => {
    if (fetchedAddedOtherData && Array.isArray(fetchedAddedOtherData)) {
      const promoted = fetchedAddedOtherData.filter(event => event.promoted === "true");
      const normal = fetchedAddedOtherData.filter(event => event.promoted === "false");

      setPromotedEvents(promoted);
      setNormalEvents(normal);
    }
  }, [fetchedAddedOtherData]);

  return (
    <div className={styles.body}>
      {fetchedAddedOtherData && fetchedAddedOtherData.length > 0 ? (
        <>
          <div className={styles.carousel}>
            <CaraouselView widgetId={widgetId} fetchedAddedOtherData={promotedEvents} selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} demoDate={demoDate} />
          </div>
          {type === "list" ? <ListView smallCard={smallCard} isFullScreen={isFullScreen}  widgetId={widgetId} fetchedAddedOtherData={normalEvents} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} demoDate={demoDate} /> :
            type === "grid" ? <GridView widgetId={widgetId} fetchedAddedOtherData={normalEvents} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoLocation={demoLocation} demoDate={demoDate} /> : <ListAndGridView demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} demoDate={demoDate} />}
        </>
      )
        :
        (<>
          <div className={styles.carousel}>
            <CaraouselView selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} demoDate={demoDate} />
          </div>
          {type === "list" ? <ListView smallCard={smallCard} isFullScreen={isFullScreen} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} demoDate={demoDate} /> :
            type === "grid" ? <GridView selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoLocation={demoLocation} demoDate={demoDate} /> : <ListAndGridView demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} demoDate={demoDate} />}
        </>
        )}
    </div>
  )
}

export default CaraouselAndViews