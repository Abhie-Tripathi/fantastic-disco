import React, { ElementType, useState } from 'react'
import styles from './listview.style.module.css'
import EventListCard1 from '../../listcardsstyles/EventListCard1';
import EventListCard2 from '../../listcardsstyles/EventListCard2';
import EventListCard3 from '../../listcardsstyles/EventListCard3';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype' 

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
    fetchedAddedOtherData?: PrefilledAddedEventsType[]
}


const ListView = ({ cardBgColor, cardBorderRadius, fontSettings, selectedCard, fetchedAddedOtherData }: EditProps) => {
    let EventListCard: ElementType;

    switch (selectedCard) {
        case 'style1':
            EventListCard = EventListCard1;
            break;
        case 'style2':
            EventListCard = EventListCard2;
            break;
        default:
            EventListCard = EventListCard3; // Or some default component or message
    }
    return (
        <div className={styles.listView}>
            {fetchedAddedOtherData && fetchedAddedOtherData?.length>0 ? (
                fetchedAddedOtherData.map((event, key) => (
                    <EventListCard
                        key={key}
                        fetchedAddedEvents={fetchedAddedOtherData}
                        cardBgColor={cardBgColor}
                        cardBorderRadius={cardBorderRadius}
                        fontSettings={fontSettings}
                        fetchedEvent = {event}
                    />
                ))
            ) : (
                <div>
                    <EventListCard
                        cardBgColor={cardBgColor}
                        cardBorderRadius={cardBorderRadius}
                        fontSettings={fontSettings}
                    />
                     <EventListCard
                        cardBgColor={cardBgColor}
                        cardBorderRadius={cardBorderRadius}
                        fontSettings={fontSettings}
                    />
                    <EventListCard
                        cardBgColor={cardBgColor}
                        cardBorderRadius={cardBorderRadius}
                        fontSettings={fontSettings}
                    />
                </div>
            )}
        </div>
    );
    
}

export default ListView