import React, { ElementType } from 'react'
import styles from './scrollview.style.module.css'
import EventCard1 from '../cardstyles/EventCard1';
import EventCard2 from '../cardstyles/EventCard2';
import EventCard3 from '../cardstyles/EventCard3';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'

interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
}

interface Props {
    type: string;
    cardBorderRadius?: number;
    cardBgColor?: string;
    selectedCard?: string;
    fontSettings?: {
        heading: FontSettings;
        subheading: FontSettings;
        body: FontSettings;
    };
    fetchedAddedOtherData?: PrefilledAddedEventsType[]
    fetchedEvent?: PrefilledAddedEventsType
    demoEventName:string;
    demoBanner:string
    demoDescription:string
    demoLocation:string
    demoDate:string

}
const ScrollView = ({ type, selectedCard, cardBgColor, cardBorderRadius, fontSettings, fetchedAddedOtherData, demoEventName, demoBanner, demoDescription, demoLocation, demoDate }: Props) => {
    let EventCard: ElementType;

    switch (selectedCard) {
        case 'style1':
            EventCard = EventCard1;
            break;
        case 'style2':
            EventCard = EventCard2;
            break;
        default:
            EventCard = EventCard3; // Or some default component or message
    }
    return (
        <div className={styles.body}>
            {fetchedAddedOtherData && fetchedAddedOtherData.length > 0 ? (
                <div
                    className={
                        type === "top"
                            ? styles.topBody
                            : type === "left"
                                ? styles.leftBody
                                : styles.rightBody
                    }
                >
                    <div
                        className={type === "top" ? styles.horizontalScroll : styles.verticalScroll}
                    >
                        {fetchedAddedOtherData.map((event, key) => (
                            <EventCard
                                key={key}
                                fetchedEvent={event}
                                cardBgColor={cardBgColor}
                                cardBorderRadius={cardBorderRadius}
                                fontSettings={fontSettings}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div
                    className={
                        type === "top"
                            ? styles.topBody
                            : type === "left"
                                ? styles.leftBody
                                : styles.rightBody
                    }
                >
                    <div
                        className={type === "top" ? styles.horizontalScroll : styles.verticalScroll}
                    >
                        <EventCard
                            cardBgColor={cardBgColor}
                            cardBorderRadius={cardBorderRadius}
                            fontSettings={fontSettings}
                            demoEventName={demoEventName}
                            demoBanner={demoBanner} 
                            demoDescription={demoDescription}
                            demoLocation={demoLocation}
                            demoDate={demoDate}
                        />
                        <EventCard
                            cardBgColor={cardBgColor}
                            cardBorderRadius={cardBorderRadius}
                            fontSettings={fontSettings}
                            demoEventName={demoEventName}
                            demoBanner={demoBanner} 
                            demoDescription={demoDescription}
                            demoLocation={demoLocation}
                            demoDate={demoDate}
                        />
                        <EventCard
                            cardBgColor={cardBgColor}
                            cardBorderRadius={cardBorderRadius}
                            fontSettings={fontSettings}
                            demoEventName={demoEventName}
                            demoBanner={demoBanner} 
                            demoDescription={demoDescription}
                            demoLocation={demoLocation}
                            demoDate={demoDate}
                        />
                        <EventCard
                            cardBgColor={cardBgColor}
                            cardBorderRadius={cardBorderRadius}
                            fontSettings={fontSettings}
                            demoEventName={demoEventName}
                            demoBanner={demoBanner} 
                            demoDescription={demoDescription}
                            demoLocation={demoLocation}
                            demoDate={demoDate}
                        />
                        <EventCard
                            cardBgColor={cardBgColor}
                            cardBorderRadius={cardBorderRadius}
                            fontSettings={fontSettings}
                            demoEventName={demoEventName}
                            demoBanner={demoBanner} 
                            demoDescription={demoDescription}
                            demoLocation={demoLocation}
                            demoDate={demoDate}
                        />
                    </div>
                </div>
            )}
        </div>

    )
}

export default ScrollView