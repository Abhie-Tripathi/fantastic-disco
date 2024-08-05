import React, { ElementType } from 'react'
import styles from './gridview.style.module.css';
import EventCard1 from '../../cardstyles/EventCard1';
import EventCard2 from '../../cardstyles/EventCard2';
import EventCard3 from '../../cardstyles/EventCard3';
import { AddedEventsType } from '@/types/addedwidgetevents';

interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
}

interface EditProps {
    cardBorderRadius?: number;
    cardBgColor?: string;
    selectedCard?: string;
    fontSettings?: {
        heading: FontSettings;
        subheading: FontSettings;
        body: FontSettings;
    };
    fetchedAddedEvents?: AddedEventsType[]
}

const GridView = ({ cardBgColor, cardBorderRadius, fontSettings, selectedCard,fetchedAddedEvents }: EditProps) => {

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
            {fetchedAddedEvents ? (
                fetchedAddedEvents.map((event, key) => (
                    <div className={styles.gridView}>
                    <EventCard
                        key={key}
                        cardBgColor={cardBgColor}
                        cardBorderRadius={cardBorderRadius}
                        fontSettings={fontSettings}
                        fetchedEvent={event}
                    />
                    </div>
                ))
            ) : (
                <div className={styles.gridView}>
                    <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />
                    <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />
                    <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />
                    <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />
                    <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />
                    <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} />
                </div>
            )}
        </div>
    )
}

export default GridView