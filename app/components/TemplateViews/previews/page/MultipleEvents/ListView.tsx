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
  previewWindowBgColor?:string;
  isDark?:boolean
  setIsDark?:(value: boolean) => void
  smallCard : boolean;
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
  previewWindowBgColor,
  setIsDark,
  isDark,
  smallCard
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
                  smallCard={smallCard}
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
              smallCard={smallCard}
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
      {/* {isFullScreen && (
        // <div className={styles.calendarMapContainer}>
        <div
        className={`${styles.calendarMapContainer} ${
          isFixed ? styles.fixed : ""
        }`}
      >
          <div className={styles.calendarContainer}>
            <MonthCalendar
              widgetId={widgetId}
              onDaySelect={handleFilteredEvents}
              handleResetEvents={handleResetEvents}
              onMonthSelect={handleFilteredEventsByMonth}
              previewWindowBgColor={previewWindowBgColor}
              isDark={isDark}
              setIsDark={setIsDark}
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
      )} */}
    </div>
  );
};

export default ListView;
