import React, { ElementType } from 'react'
import styles from './gridview.style.module.css';
import EventCard1 from '../../cardstyles/EventCard1';
import EventCard2 from '../../cardstyles/EventCard2';
import EventCard3 from '../../cardstyles/EventCard3';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import { useRouter } from 'next/navigation';
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
    demoBanner:string;
    demoEventName:string
    demoLocation:string
    demoDate:string;
}

const GridView = ({ cardBgColor, cardBorderRadius, fontSettings, selectedCard, fetchedAddedOtherData, widgetId, demoBanner, demoEventName, demoLocation,demoDate  }: EditProps) => {

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
    const router = useRouter();
    const handleCardClick = (eventId: string, widgetId: string) => {
        router.push(`/detailpage?widgetId=${widgetId}&eventId=${eventId}`)
        // router.push(`/detailpage/${eventId}`)
    }
    return (
        <div className={styles.body}>
            {fetchedAddedOtherData && widgetId && fetchedAddedOtherData?.length > 0 ? (
                <div className={styles.gridView}>
                    {fetchedAddedOtherData.map((event, key) => (
                        <div onClick={() => handleCardClick(event.id, widgetId)} key={key} className={styles.listcard}>
                            <EventCard
                                key={key}
                                cardBgColor={cardBgColor}
                                cardBorderRadius={cardBorderRadius}
                                fontSettings={fontSettings}
                                fetchedEvent={event}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.gridView}>
                    <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings}  demoBanner={demoBanner} demoEventName={demoEventName} demoLocation={demoLocation} demoDate={demoDate}/>
                    <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings}  demoBanner={demoBanner} demoEventName={demoEventName} demoLocation={demoLocation} demoDate={demoDate}/>
                    <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings}  demoBanner={demoBanner} demoEventName={demoEventName} demoLocation={demoLocation} demoDate={demoDate}/>
                    <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings}  demoBanner={demoBanner} demoEventName={demoEventName} demoLocation={demoLocation} demoDate={demoDate}/>
                    <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings}  demoBanner={demoBanner} demoEventName={demoEventName} demoLocation={demoLocation} demoDate={demoDate}/>
                    <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings}  demoBanner={demoBanner} demoEventName={demoEventName} demoLocation={demoLocation} demoDate={demoDate}/>
                </div>
            )}
        </div>
    )
}

export default GridView