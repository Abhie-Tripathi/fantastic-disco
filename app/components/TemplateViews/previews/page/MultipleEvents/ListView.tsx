import React, { ElementType, useState } from 'react'
import styles from './listview.style.module.css'
import EventListCard1 from '../../listcardsstyles/EventListCard1';
import EventListCard2 from '../../listcardsstyles/EventListCard2';
import EventListCard3 from '../../listcardsstyles/EventListCard3';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import { useRouter } from "next/navigation";

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
    widgetId?: string;
}
const ListView = ({ cardBgColor, cardBorderRadius, fontSettings, selectedCard, fetchedAddedOtherData, widgetId }: EditProps) => {
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
    const router = useRouter();
    const handleCardClick = (eventId: string, widgetId: string) => {
        router.push(`/detailpage?widgetId=${widgetId}&eventId=${eventId}`)
    }
    return (
        <div className={styles.listView}>
            {fetchedAddedOtherData && widgetId && fetchedAddedOtherData?.length > 0 ? (
                fetchedAddedOtherData.map((event, key) => (
                    <div onClick={() => handleCardClick(event.id, widgetId)} key={key}>
                        <EventListCard
                            fetchedAddedEvents={fetchedAddedOtherData}
                            cardBgColor={cardBgColor}
                            cardBorderRadius={cardBorderRadius}
                            fontSettings={fontSettings}
                            fetchedEvent={event}
                        />
                    </div>
                ))
            ) : (
                <div className={styles.listView}>
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