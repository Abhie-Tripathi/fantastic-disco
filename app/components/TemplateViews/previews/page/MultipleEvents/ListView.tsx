// import React, { ElementType, useState } from 'react'
// import styles from './listview.style.module.css'
// import EventListCard1 from '../../listcardsstyles/EventListCard1';
// import EventListCard2 from '../../listcardsstyles/EventListCard2';
// import EventListCard3 from '../../listcardsstyles/EventListCard3';
// import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
// import { useRouter } from "next/navigation"
// import crypto from 'crypto';

// interface FontSettings {
//     fontFamily: string;
//     fontSize: number;
//     fontColor: string;
//     fontWeight: string;
// }

// interface EditProps {
//     cardBorderRadius?: number;
//     cardBgColor?: string;
//     selectedCard?: string;
//     fontSettings?: {
//         heading: FontSettings;
//         subheading: FontSettings;
//         body: FontSettings;
//     };
//     fetchedAddedOtherData?: PrefilledAddedEventsType[]
//     widgetId?: string;
//     demoBanner: string;
//     demoEventName: string;
//     demoDescription: string
//     demoLocation: string
//     demoDate:string
//     isFullScreen:boolean

// }
// const ListView = ({ cardBgColor, cardBorderRadius, fontSettings, selectedCard, fetchedAddedOtherData, widgetId, demoBanner, demoEventName, demoDescription, demoLocation, demoDate,isFullScreen }: EditProps) => {

//     console.log("normal events in list view :", fetchedAddedOtherData)
//     let EventListCard: ElementType;

//     switch (selectedCard) {
//         case 'style1':
//             EventListCard = EventListCard1;
//             break;
//         case 'style2':
//             EventListCard = EventListCard2;
//             break;
//         default:
//             EventListCard = EventListCard3; // Or some default component or message
//     }
//     // utils/hashUtils.ts
//     const createHash = (widgetId: string, eventId: string): string => {
//         const combinedString = `${widgetId}:${eventId}`;
//         // Base64 encode and replace URL-unsafe characters
//         return Buffer.from(combinedString)
//             .toString('base64')
//             .replace(/\+/g, '-')  // Replace '+' with '-'
//             .replace(/\//g, '_')  // Replace '/' with '_'
//             .replace(/=+$/, '');  // Remove padding '=' characters
//     };

//     const router = useRouter();
//     const handleCardClick = (eventId: string, widgetId: string) => {
//         // const hash = createHash(widgetId, eventId);
//         router.push(`/detailpage?widgetId=${widgetId}&eventId=${eventId}`)
//         // router.push(`/detailpage/${eventId}`);
//     }
//     return (
//         <div className={styles.listView}>
//             {fetchedAddedOtherData && widgetId && fetchedAddedOtherData?.length > 0 ? (
//                 fetchedAddedOtherData.map((event, key) => (
//                     <div onClick={() => handleCardClick(event.id, widgetId)} key={key} className={styles.listcard}>
//                         <EventListCard
//                             fetchedAddedEvents={fetchedAddedOtherData}
//                             cardBgColor={cardBgColor}
//                             cardBorderRadius={cardBorderRadius}
//                             fontSettings={fontSettings}
//                             fetchedEvent={event}
//                         />
//                     </div>
//                 ))
//             ) : (
//                 <div className={styles.listView}>
//                     <EventListCard
//                         cardBgColor={cardBgColor}
//                         cardBorderRadius={cardBorderRadius}
//                         fontSettings={fontSettings}
//                         demoBanner={demoBanner}
//                         demoEventName={demoEventName}
//                         demoDescription={demoDescription}
//                         demoLocation={demoLocation}
//                         demoDate={demoDate}
//                     />
//                     <EventListCard
//                         cardBgColor={cardBgColor}
//                         cardBorderRadius={cardBorderRadius}
//                         fontSettings={fontSettings}
//                         demoBanner={demoBanner}
//                         demoEventName={demoEventName}
//                         demoDescription={demoDescription}
//                         demoLocation={demoLocation}
//                         demoDate={demoDate}
//                     />
//                     <EventListCard
//                         cardBgColor={cardBgColor}
//                         cardBorderRadius={cardBorderRadius}
//                         fontSettings={fontSettings}
//                         demoBanner={demoBanner}
//                         demoEventName={demoEventName}
//                         demoDescription={demoDescription}
//                         demoLocation={demoLocation}
//                         demoDate={demoDate}
//                     />
//                 </div>
//             )}
//         </div>
//     );

// }

// export default ListView

import React, { ElementType, useEffect, useState } from "react";
import styles from "./listview.style.module.css";
import EventListCard1 from "../../listcardsstyles/EventListCard1";
import EventListCard2 from "../../listcardsstyles/EventListCard2";
import EventListCard3 from "../../listcardsstyles/EventListCard3";
import { PrefilledAddedEventsType } from "@/types/prefilledaddedeventtype";
import { useRouter } from "next/navigation";
import MonthCalendar from "@/app/components/TemplateViewsNew/AddEventForm/Details/dateandtime/MonthsCalendar";
import { Map, Marker } from "react-map-gl";
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
  fetchedAddedOtherData?: PrefilledAddedEventsType[];
  widgetId?: string;
  demoBanner: string;
  demoEventName: string;
  demoDescription: string;
  demoLocation: string;
  demoDate: string;
  isFullScreen: boolean;
}

const ListView = ({
  cardBgColor,
  cardBorderRadius,
  fontSettings,
  selectedCard,
  fetchedAddedOtherData,
  widgetId,
  demoBanner,
  demoEventName,
  demoDescription,
  demoLocation,
  demoDate,
  isFullScreen,
}: EditProps) => {
  const router = useRouter();

  let EventListCard: ElementType;
  switch (selectedCard) {
    case "style1":
      EventListCard = EventListCard1;
      break;
    case "style2":
      EventListCard = EventListCard2;
      break;
    default:
      EventListCard = EventListCard3;
  }

  const handleCardClick = (eventId: string, widgetId: string) => {
    router.push(`/detailpage?widgetId=${widgetId}&eventId=${eventId}`);
  };
  const [filteredEvents, setFilteredEvents] = React.useState<
    PrefilledAddedEventsType[]
  >([]);
  const [isFixed, setIsFixed] = useState(true);
  React.useEffect(() => {
    if (fetchedAddedOtherData && fetchedAddedOtherData.length > 0) {
      setFilteredEvents(fetchedAddedOtherData);
    }
  }, [fetchedAddedOtherData]);

  const handleFilteredEvents = (selectedDate: string) => {
    const filtered = fetchedAddedOtherData!.filter(
      (event) => event.startDate === selectedDate
    );
    setFilteredEvents(filtered);
  };

  // Reset to show all events
  const handleResetEvents = () => {
    setFilteredEvents(fetchedAddedOtherData || []);
  };

  const handleFilteredEventsByMonth = (selectedMonth: string) => {
    const filtered = fetchedAddedOtherData!.filter((event) => {
      const eventMonth = new Date(event.startDate).toLocaleString("default", {
        month: "long",
      });
      return eventMonth === selectedMonth;
    });
    setFilteredEvents(filtered);
  };

  return (
    <div
      className={`${styles.listView} ${isFullScreen ? styles.fullScreen : ""}`}
    >
      <div className={styles.cardsContainer}>
      {filteredEvents && widgetId && filteredEvents.length > 0
          ? filteredEvents.map((event, key) => (
              <div
                onClick={() => handleCardClick(event.id, widgetId)}
                key={key}
                className={styles.listcard}
              >
                <EventListCard
                  fetchedAddedEvents={filteredEvents}
                  cardBgColor={cardBgColor}
                  cardBorderRadius={cardBorderRadius}
                  fontSettings={fontSettings}
                  fetchedEvent={event}
                />
              </div>
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <EventListCard
                key={index}
                cardBgColor={cardBgColor}
                cardBorderRadius={cardBorderRadius}
                fontSettings={fontSettings}
                demoBanner={demoBanner}
                demoEventName={demoEventName}
                demoDescription={demoDescription}
                demoLocation={demoLocation}
                demoDate={demoDate}
              />
            ))}
      </div>
      {isFullScreen && (
        // <div className={styles.calendarMapContainer}>
        <div
        className={`${styles.calendarMapContainer} ${
          isFixed ? styles.fixed : ""
        }`}
      >
          <div className={styles.calendarContainer}>
            <MonthCalendar
              cardBgColor={cardBgColor}
              widgetId={widgetId}
              onDateSelect={handleFilteredEvents}
              handleResetEvents={handleResetEvents}
              onMonthSelect={handleFilteredEventsByMonth}
            />
          </div>
          <div className={styles.mapContainer}>
            <Map
              initialViewState={{
                longitude: -100,
                latitude: 40,
                zoom: 3.5,
              }}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListView;
