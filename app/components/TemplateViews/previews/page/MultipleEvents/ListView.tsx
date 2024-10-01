import React, { ElementType, useState } from 'react'
import styles from './listview.style.module.css'
import EventListCard1 from '../../listcardsstyles/EventListCard1';
import EventListCard2 from '../../listcardsstyles/EventListCard2';
import EventListCard3 from '../../listcardsstyles/EventListCard3';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import { useRouter } from "next/navigation"
import crypto from 'crypto';

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
    demoBanner: string;
    demoEventName: string;
    demoDescription: string
    demoLocation: string

}
const ListView = ({ cardBgColor, cardBorderRadius, fontSettings, selectedCard, fetchedAddedOtherData, widgetId, demoBanner, demoEventName, demoDescription, demoLocation }: EditProps) => {

    console.log("normal events in list view :", fetchedAddedOtherData)
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
    // utils/hashUtils.ts
    const createHash = (widgetId: string, eventId: string): string => {
        const combinedString = `${widgetId}:${eventId}`;
        // Base64 encode and replace URL-unsafe characters
        return Buffer.from(combinedString)
            .toString('base64')
            .replace(/\+/g, '-')  // Replace '+' with '-'
            .replace(/\//g, '_')  // Replace '/' with '_'
            .replace(/=+$/, '');  // Remove padding '=' characters
    };

    const router = useRouter();
    const handleCardClick = (eventId: string, widgetId: string) => {
        // const hash = createHash(widgetId, eventId);
        // router.push(`/detailpage?widgetId=${widgetId}&eventId=${eventId}`)
        router.push(`/detailpage/${eventId}`);
    }
    return (
        <div className={styles.listView}>
            {fetchedAddedOtherData && widgetId && fetchedAddedOtherData?.length > 0 ? (
                fetchedAddedOtherData.map((event, key) => (
                    <div onClick={() => handleCardClick(event.id, widgetId)} key={key} className={styles.listcard}>
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
                        demoBanner={demoBanner}
                        demoEventName={demoEventName}
                        demoDescription={demoDescription}
                        demoLocation={demoLocation}
                    />
                    <EventListCard
                        cardBgColor={cardBgColor}
                        cardBorderRadius={cardBorderRadius}
                        fontSettings={fontSettings}
                        demoBanner={demoBanner}
                        demoEventName={demoEventName}
                        demoDescription={demoDescription}
                        demoLocation={demoLocation}
                    />
                    <EventListCard
                        cardBgColor={cardBgColor}
                        cardBorderRadius={cardBorderRadius}
                        fontSettings={fontSettings}
                        demoBanner={demoBanner}
                        demoEventName={demoEventName}
                        demoDescription={demoDescription}
                        demoLocation={demoLocation}
                    />
                </div>
            )}
        </div>
    );

}

export default ListView