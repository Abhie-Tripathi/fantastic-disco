import React, {useEffect, useRef} from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./map.module.css";
import { useState } from "react";
import eventData from "../../../../public/data/demoEvent.json";
import MapPointer from "/public/Marker.svg";
import ReactMapGL, { Marker, Popup, Source, Layer } from "react-map-gl";
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
          <div className={styles.eventListCard_label}>{event.event?.categories[0]?.slug}</div>
        </div>
        <Link href={`/detailpage`}>
          View Details
        </Link>
      </div>
    </div>
  );
};

interface MapProps {
  queryString?: string;
}

const zones = {
  "Antarctica": { lat: -82.5, lng: 0 },
  "East Asia": { lat: 35, lng: 120 },
  "Eastern Europe": { lat: 52.5, lng: 25 },
  "India Subcontinent": { lat: 22.5, lng: 82.5 },
  "Latin America": { lat: -10, lng: -60 },
  "Middle East": { lat: 25, lng: 45 },
  "North America": { lat: 40, lng: -100 },
  "Northern Africa": { lat: 20, lng: 10 },
  "Northern Europe": { lat: 55, lng: 10 },
  "Oceania": { lat: -20, lng: 150 },
  "SouthEast Asia": { lat: 10, lng: 110 },
  "Southern Africa": { lat: -25, lng: 25 },
  "UK": { lat: 55, lng: -2 },
  "Western Europe": { lat: 45, lng: 5 },
};

const Map = (props: MapProps) => {
  const { theme } = useTheme();
  const [selectedPlace, setSelectedPlace] = useState<number | string | null>(null);
  const [showList, setShowList] = useState(false);
  const [fullView, setFullView] = useState(true);
  const [eventPerPage, setEventPerPage] = useState<EventTableType[]>([]);
  const [zonePerPage, setZonePerPage] = useState<any[]>([]);
  const [countryPerPage, setCountryPerPage] = useState<any[]>([]);

  const [viewport, setViewport] = useState<any>({
    latitude: 51.50853,
    longitude: -0.076132,
    width: fullView ? "calc(100vw - 85px)" : "",
    height: fullView ? "90vh" : "350px",
    zoom: 2,
  });

  interface countryEventCounts {
    [id: string] : number
  }
  const [countryEventCounts, setCountryEventCounts] = useState<countryEventCounts>({});

  const getOpacityValue = (countryId: string) => {
    if(countryId){
      let totalCount = (countryEventCounts['totalEventCount'] && countryEventCounts['totalEventCount'] !== 0) ? countryEventCounts['totalEventCount'] : 1;
      let val = Math.round((countryEventCounts[countryId] / totalCount)*100);
      if(val == 0) return 0.1;
      else if(val < 20) return 0.2;
      else if(val > 80) return 0.8;
      else return val / 100;
    }else
      return 0.1;
  };

  const fetchEventsData = async() => {
    let mapViewType = 'world';
    if(props.queryString){
      const params = new URLSearchParams(props.queryString);
      const obj:any = {};
      params.forEach((value, key) => {
        obj[key] = decodeURIComponent(value);
      });
      if(obj['eventCountry'] || obj['eventRegion']){
        mapViewType = 'country';
      }
    }
    try {
      let apiUrl = `${baseUrl}/event/search?sortBy=score&sortType=desc&max=10&offset=0&${props.queryString}`;
      if(mapViewType == 'country')
        apiUrl = `${baseUrl}/event/search?groupBy=country&${props.queryString}`;

      const apiData = await myFetch(apiUrl, {
          method: "GET",
          headers: headers,
      });
      if(apiData.data) {
        // setZonePerPage(apiData.data);
        if(mapViewType == 'country'){
          setCountryPerPage(apiData.data);
          setEventPerPage([]);
          const totalCount = apiData.data.reduce((acc: any, current: any) => acc + current.eventCount, 0);
          const countryEventCountsObj: any = {};
          countryEventCountsObj['totalEventCount'] = totalCount;
          apiData.data.forEach((country: any) => {
            countryEventCountsObj[country.countryId] = country.eventCount;
          });
          setCountryEventCounts(countryEventCountsObj);
        }
        else{
          setEventPerPage(apiData.data.events);
          setCountryPerPage([]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    if(props.queryString)
      fetchEventsData();
  }, [props.queryString]);

  const [currPage, setCurrPage] = useState(1);
  const [loadMoreDisabled, setLoadMoreDisabled] = useState<boolean>(false);

  const handleLoadMoreEvents = async() => {
    try {
      const apiUrl = `${baseUrl}/event/search?sortBy=score&sortType=desc&max=10&offset=${(currPage - 1)*10}&${props.queryString}`;
      setLoadMoreDisabled(true);

      const apiData = await myFetch(apiUrl, {
        method: "GET",
        headers: headers,
      });
      if(apiData.data) {
        setEventPerPage((prev)=>[...prev, ...apiData.data.events]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadMoreDisabled(false);
    }
  }

  useEffect(() => {
    if(currPage>1)
      handleLoadMoreEvents();
  }, [currPage]);

  let worldviewFilter = [
    "in",
    "iso_3166_1",
    'IN',
    'CN',
    'US',
  ];

  const layerStyle = {
    id: 'country-layer',
    type: 'fill',
    source: 'country-source',
    'source-layer': 'country_boundaries',
    filter: worldviewFilter,
    paint: {
      'fill-color': '#6750a4',
      'fill-opacity': 0.4,
    },
  };

  const colors = ['#D5B1F1', '#F5B8CC', '#FFC96B', '#99CEFF', '#F8B9B9'];

  const layers = Object.keys(countryEventCounts).map((country, index) => {
    const layerStyle = {
      id: `country-layer-${country}`,
      type: 'fill',
      source: 'country-source',
      'source-layer': 'country_boundaries',
      filter: ['==', 'iso_3166_1', country],
      paint: {
        'fill-color': 'rgba(103, 80, 164, 0.5)',
        'fill-opacity': getOpacityValue(country),
        'fill-outline-color': '#6750a4',
      },
    };
    return <Layer {...layerStyle} key={country} />;
  });

  const zoneLevelProps = {zoom:1};

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
        // {...zoneLevelProps}
      >
        {eventPerPage && eventPerPage.map((event) => (
          <div key={event.id}>
            <Marker
              key={event.id}
              latitude={event.location.geoCordinates.latitude}
              longitude={event.location.geoCordinates.longitude}
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
                latitude={event.location.geoCordinates.latitude}
                longitude={event.location.geoCordinates.longitude}
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
        
        {/* {zonePerPage && 
          <>
            <Source id="country-source" type="vector" url="mapbox://mapbox.country-boundaries-v1" >
              <Layer {...layerStyle} />
            </Source>
            {zonePerPage.map((event) => (
              <div>
                <Marker
                  latitude={(zones[event.zone] && zones[event.zone].lat) ? zones[event.zone].lat:22}
                  longitude={(zones[event.zone] && zones[event.zone].lng) ? zones[event.zone].lng:82}
                >
                  <button
                    className={styles.map_event_button}
                    data-name={(event.zone == 'null' ? 'Online' :event.zone) +' - '+event.eventCount}
                  >
                    <Image src={MapPointer} alt="mapPointer" />
                  </button>
                </Marker>
              </div>
            ))}
          </>
        } */}
        { countryPerPage && 
          <>
            <Source id="country-source" type="vector" url="mapbox://mapbox.country-boundaries-v1" >
              {layers}
            </Source>
            {countryPerPage.map((event) => (
              <div key={event.countryId} >
                <Marker
                  key={event.countryId}
                  latitude={(event.geoCordinates.latitude) ? event.geoCordinates.latitude :0}
                  longitude={(event.geoCordinates.longitude) ? event.geoCordinates.longitude :0}
                >
                  <span className={styles.eventCountTag}>{event.name+' - '+event.eventCount}</span>
                </Marker>
              </div>
            ))}
          </>
        }
      </ReactMapGL>

      {(fullView && eventPerPage.length > 0) && (
        <div className={`${styles.eventList_container} ${theme === 'light' && styles.eventList_container_light}`}>
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
            <div style={{textAlign:'center', padding:'10px'}}>
                <button disabled={loadMoreDisabled} className={styles.loadMoreBtn} onClick={() => setCurrPage((page) => page + 1)} >
                  Load More
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Map;
