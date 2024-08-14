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
}
const ScrollView = ({ type, selectedCard, cardBgColor, cardBorderRadius, fontSettings, fetchedAddedOtherData }: Props) => {
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
               {fetchedAddedOtherData && fetchedAddedOtherData?.length>0 ? (
                fetchedAddedOtherData.map((event, key) => (
                    <div className={type === "top" ? styles.topBody : type === "left" ? styles.leftBody : styles.rightBody} key={key}>
                        <div className={type === "top" ? styles.horizontalScroll : styles.verticalScroll}>
                        <EventCard fetchedEvent = {event} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />
                        </div>
                    </div>))) : (
                <div className={type === "top" ? styles.topBody : type === "left" ? styles.leftBody : styles.rightBody}>
                    <div className={type === "top" ? styles.horizontalScroll : styles.verticalScroll}>
                        <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />
                        <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />
                        <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />
                        <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />
                        <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ScrollView