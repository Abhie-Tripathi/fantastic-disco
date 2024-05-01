import React, { Suspense, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./map.module.css";
import { useState } from "react";
import eventData from "../../../../public/data/demoEvent.json";
import MapPointer from "/public/Marker.svg";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { formatDateRange } from "@/utils/dateFormat";
import FilterIcon from "/public/filterIcon.svg";
import FestivalIcon from "/public/festivalIcon.svg";
interface Event {
  id: number;
  venue: { lat: number; lng: number }[];
  eventUrl: string;
  name: string;
  country: string;
}
// const ReactMapGL = React.lazy(() => import('react-map-gl'));

const EventListCard = (event: any) => {
  return (
    <div className={styles.eventListCard}>
      <div className={styles.eventListCard_title}>{event.event.name}</div>
      <div className={styles.eventListCard_location}>
        {event?.event?.location}
      </div>
      <div className={styles.eventListCard_date}>
        {formatDateRange(event?.event?.startDate, event?.event?.endDate)}
      </div>
      <div className={styles.eventListCard_footer}>
        <div className={styles.eventListCard_footer_info}>
          <div className={styles.eventListCard_category}>
            <Image src={FestivalIcon} alt="festival" />
            {/* <span style={{color:"black"}}>{event?.event?.company}</span> */}
          </div>
          <span style={{ color: "grey" }}>|</span>
          <div className={styles.eventListCard_label}>Parade</div>
        </div>
        <Link href={`/search/${event.id}`} target="_blank">
          View Details
        </Link>
      </div>
    </div>
  );
};

const Map: React.FC = ({}) => {
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const [showList, setShowList] = useState(false);
  const [fullView, setFullView] = useState(true);

  const [viewport, setViewport] = useState<any>({
    latitude: 51.50853,
    longitude: -0.076132,
    width: fullView ? "calc(100vw - 85px)" : "",
    height: fullView ? "80vh" : "350px",
    zoom: 2,
  });
  return (
    <div className={styles.map}>
      {/* <Suspense fallback={<div><Image src={Preloader} alt="preloader" height="50"/></div>}> */}
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxApiAccessToken="pk.eyJ1IjoiYWJoaWUiLCJhIjoiY2x0ODgycjA0MDV6czJrdDQzaWwwYmh6eCJ9.px6YQmrBFfxRPyhB1FqCkg"
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        {eventData.map((event) => (
          <div key={event.id}>
            <Marker
              key={event.id}
              latitude={event.venue[0].lat}
              longitude={event.venue[0].lng}
            >
              <button
                className={styles.map_event_button}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedPlace(event.id);
                }}
              >
                <Image src={MapPointer} alt="mapPointer" />
              </button>
            </Marker>
            {selectedPlace == event.id ? (
              <Popup
                className={styles.popup}
                latitude={event.venue[0].lat}
                longitude={event.venue[0].lng}
                onClose={() => {
                  setSelectedPlace(null);
                }}
              >
                <div className={styles.event_details_popup}>
                  <Link
                    href={event.imageUrl}
                    className={styles.event_details_popup_link}
                  >
                    {event.name}
                  </Link>
                  <div className={styles.event_country}>{event.location}</div>
                  <div className={styles.event_datetime}>
                    Wed, 6 Mar 2024 (1 day)
                  </div>
                </div>
                <div className={styles.event_details_action}>
                  <Link
                    className={styles.event_view_details}
                    href={event.imageUrl}
                  >
                    View Full Details
                  </Link>
                  <div className={styles.event_details_category}>
                    Textile Industry
                  </div>
                </div>
              </Popup>
            ) : null}
          </div>
        ))}
      </ReactMapGL>

      {fullView && (
        <div className={styles.eventList_container}>
          <button
            onClick={() => setShowList(!showList)}
            className={styles.event_list_button}
          >
            EVENTS LIST
          </button>
          <div
            className={`${styles.eventList} ${showList ? styles.active : ""}`}
          >
            <div className={styles.eventList_header}>
              <span>Results</span>
              <button>
                <Image src={FilterIcon} alt="filter" />
              </button>
            </div>

            <div className={styles.eventList_list}>
              {eventData?.map((event) => (
                <EventListCard event={event} />
              ))}
            </div>
          </div>
        </div>
      )}
      {/* </Suspense> */}
    </div>
  );
};

export default Map;
