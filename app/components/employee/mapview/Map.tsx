import React, {useEffect} from "react";
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
import { useTheme } from "@/context";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import {EventTableType} from "@/types/ListViewTable";

const EventListCard = (event: any) => {
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  return (
    <div className={styles.eventListCard}>
      <div className={styles.eventListCard_title}>{event.event.name}</div>
      <div className={styles.eventListCard_location}>
        {event.event?.location?.cityName}
      </div>
      <div className={styles.eventListCard_date}>
        {formatDateRange(event?.event?.startDate, event?.event?.endDate)}
      </div>
      <div className={styles.eventListCard_footer}>
        <div className={styles.eventListCard_footer_info}>
          <div className={styles.eventListCard_category}>
            <Image className={iconClass} src={FestivalIcon} alt="festival" />
            {/* <span style={{color:"black"}}>{event?.event?.company}</span> */}
          </div>
          <span style={{ color: "grey" }}>|</span>
          <div className={styles.eventListCard_label}>Parade</div>
        </div>
        <Link href={`/detailpage`}>
          View Details
        </Link>
      </div>
    </div>
  );
};

interface MapProps {
  queryString: string;
}

const Map = (props: MapProps) => {
  const { theme } = useTheme();
  const [selectedPlace, setSelectedPlace] = useState<number | string | null>(null);
  const [showList, setShowList] = useState(false);
  const [fullView, setFullView] = useState(true);
  const [eventPerPage, setEventPerPage] = useState<EventTableType[]>([]);

  const [viewport, setViewport] = useState<any>({
    latitude: 51.50853,
    longitude: -0.076132,
    width: fullView ? "calc(100vw - 85px)" : "",
    height: fullView ? "80vh" : "350px",
    zoom: 2,
  });

  const fetchEventsData = async() => {
    try {
      const apiUrl = `${baseUrl}/event/search?sortBy=score&sortType=desc&max=20&offset=0&${props.queryString}`;
      const apiData = await myFetch(apiUrl, {
          method: "GET",
          headers: headers,
      });
      if(apiData.data) {
        setEventPerPage(apiData.data.events);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchEventsData();
  }, [props.queryString]);


  return (
    <div className={styles.map}>
      {/* <Suspense fallback={<div><Image src={Preloader} alt="preloader" height="50"/></div>}> */}
      <ReactMapGL
        {...viewport}
        mapStyle={
          theme === "light"
            ? "mapbox://styles/mapbox/light-v10"
            : "mapbox://styles/mapbox/dark-v11"
        }
        mapboxApiAccessToken="pk.eyJ1IjoiYWJoaWUiLCJhIjoiY2x0ODgycjA0MDV6czJrdDQzaWwwYmh6eCJ9.px6YQmrBFfxRPyhB1FqCkg"
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        {eventPerPage && eventPerPage.map((event) => (
          <div key={event.id}>
            <Marker
              key={event.id}
              latitude={event.location.geoCordinates.longitude}
              longitude={event.location.geoCordinates.latitude}
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
                latitude={event.location.geoCordinates.longitude}
                longitude={event.location.geoCordinates.latitude}
                onClose={() => {
                  setSelectedPlace(null);
                }}
              >
                <div className={styles.event_details_popup}>
                  <Link
                    href={event.url}
                    className={styles.event_details_popup_link}
                  >
                    {event.name}
                  </Link>
                  <div className={styles.event_country}>{event.location.countryName}</div>
                  <div className={styles.event_datetime}>
                    Wed, 6 Mar 2024 (1 day)
                  </div>
                </div>
                <div className={styles.event_details_action}>
                  <Link
                    className={styles.event_view_details}
                    href={event.url}
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
              {eventPerPage?.map((event, key) => (
                <EventListCard key={key} event={event} />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Map;
