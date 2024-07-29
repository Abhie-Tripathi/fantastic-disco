import React, {useEffect, useRef} from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./map.module.css";
import { useState } from "react";
import eventData from "../../../../public/data/demoEvent.json";
import MapPointer from "/public/Marker.svg";
import {Map as Map2, Marker, Popup, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { formatDateRange } from "@/utils/dateFormat";
import FilterIcon from "/public/filterIcon.svg";
import FestivalIcon from "/public/festivalIcon.svg";
import { useTheme } from "@/context";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import {EventTableType} from "@/types/ListViewTable";
import Loading from "@/app/components/UI/Loading";

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

const EventListCard = (event: any) => {
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  return (
    <div className={'card'}>
      <div className={styles.eventListCard_title}>
        <Link href={`/internal/event/${event.event.id}`} target="_blank" >{event.event.name}</Link>
      </div>
      <div className={styles.eventListCard_location}>
        {event.event?.location?.cityName}
      </div>
      <div className={styles.eventListCard_date}>
        {formatDateRange(event?.event?.startDate, event?.event?.endDate)}
      </div>
      <div className={styles.eventListCard_footer}>
        <div className={styles.eventListCard_footer_info}>
          {/* <div className={styles.eventListCard_category}>
            <Image className={iconClass} src={FestivalIcon} alt="festival" />
            <span style={{color:"black"}}>{event?.event?.company}</span>
          </div> */}
          {/* <span style={{ color: "grey" }}>|</span> */}
          <div className={`${styles.eventListCard_label} ${styles.truncateText_1}`}>{event.event?.categories[0]?.name}</div>
          {event.event?.categories.length > 1 &&
            <small className={styles.catCount}>
              {`+${event.event?.categories.length -1}`}
            </small>
          }
        </div>
        {/* <Link href={`/detailpage`}>
          View Details
        </Link> */}
      </div>
    </div>
  );
};

const markerIcon = (type?: string, eventSize: number = 0 ) => {
  let iconColor = "#6750a4";
  let fillColor = "black";
  if(eventSize >= 500)  {
    iconColor="#52AEFF";
    fillColor = "white";
  }
  else if (eventSize >= 100 && eventSize < 500)  {
    iconColor="#99CEFF";
  }
  else iconColor="#CCE6FF"


  if(type && type == 'Conference') {
    return(
      <svg width="48" height="48" viewBox="0 0 97 129" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_2099_4733)">
        <path d="M96.75 48.375C96.75 70.3957 67.2715 109.6 54.3463 125.775C51.2473 129.63 45.5027 129.63 42.4037 125.775C29.4785 109.6 0 70.3957 0 48.375C0 21.668 21.668 0 48.375 0C75.082 0 96.75 21.668 96.75 48.375Z" fill={iconColor}/>
        <path d="M46.4375 63.375H54.25C55.0788 63.375 55.8737 63.0458 56.4597 62.4597C57.0458 61.8737 57.375 61.0788 57.375 60.25V58.6875H52.6875C52.2731 58.6875 51.8757 58.5229 51.5826 58.2299C51.2896 57.9368 51.125 57.5394 51.125 57.125C51.125 56.7106 51.2896 56.3132 51.5826 56.0201C51.8757 55.7271 52.2731 55.5625 52.6875 55.5625H57.375V50.875H52.6875C52.2731 50.875 51.8757 50.7104 51.5826 50.4174C51.2896 50.1243 51.125 49.7269 51.125 49.3125C51.125 48.8981 51.2896 48.5007 51.5826 48.2076C51.8757 47.9146 52.2731 47.75 52.6875 47.75H57.375V43.0625H52.6875C52.2731 43.0625 51.8757 42.8979 51.5826 42.6049C51.2896 42.3118 51.125 41.9144 51.125 41.5C51.125 41.0856 51.2896 40.6882 51.5826 40.3951C51.8757 40.1021 52.2731 39.9375 52.6875 39.9375H57.375V38.375C57.375 37.5462 57.0458 36.7513 56.4597 36.1653C55.8737 35.5792 55.0788 35.25 54.25 35.25H41.75C40.9212 35.25 40.1263 35.5792 39.5403 36.1653C38.9542 36.7513 38.625 37.5462 38.625 38.375V39.9375H43.3125C43.7269 39.9375 44.1243 40.1021 44.4174 40.3951C44.7104 40.6882 44.875 41.0856 44.875 41.5C44.875 41.9144 44.7104 42.3118 44.4174 42.6049C44.1243 42.8979 43.7269 43.0625 43.3125 43.0625H38.625V47.75H43.3125C43.7269 47.75 44.1243 47.9146 44.4174 48.2076C44.7104 48.5007 44.875 48.8981 44.875 49.3125C44.875 49.7269 44.7104 50.1243 44.4174 50.4174C44.1243 50.7104 43.7269 50.875 43.3125 50.875H38.625V55.5625H43.3125C43.7269 55.5625 44.1243 55.7271 44.4174 56.0201C44.7104 56.3132 44.875 56.7106 44.875 57.125C44.875 57.5394 44.7104 57.9368 44.4174 58.2299C44.1243 58.5229 43.7269 58.6875 43.3125 58.6875H38.625V60.25C38.625 61.0788 38.9542 61.8737 39.5403 62.4597C40.1263 63.0458 40.9212 63.375 41.75 63.375H46.4375ZM49.5625 66.5V72.75H58.9375C59.3519 72.75 59.7493 72.9146 60.0424 73.2076C60.3354 73.5007 60.5 73.8981 60.5 74.3125C60.5 74.7269 60.3354 75.1243 60.0424 75.4174C59.7493 75.7104 59.3519 75.875 58.9375 75.875H37.0625C36.6481 75.875 36.2507 75.7104 35.9576 75.4174C35.6646 75.1243 35.5 74.7269 35.5 74.3125C35.5 73.8981 35.6646 73.5007 35.9576 73.2076C36.2507 72.9146 36.6481 72.75 37.0625 72.75H46.4375V66.5H41.75C40.0924 66.5 38.5027 65.8415 37.3306 64.6694C36.1585 63.4973 35.5 61.9076 35.5 60.25V38.375C35.5 36.7174 36.1585 35.1277 37.3306 33.9556C38.5027 32.7835 40.0924 32.125 41.75 32.125H54.25C55.9076 32.125 57.4973 32.7835 58.6694 33.9556C59.8415 35.1277 60.5 36.7174 60.5 38.375V60.25C60.5 61.9076 59.8415 63.4973 58.6694 64.6694C57.4973 65.8415 55.9076 66.5 54.25 66.5H49.5625Z" fill={fillColor} />
        </g>
        <defs>
          <clipPath id="clip0_2099_4733">
          <rect width="96.75" height="129" fill="white"/>
          </clipPath>
          </defs>
        </svg>
    )
  }
  else
    return (
      <svg width="48" height="48" viewBox="0 0 97 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_2099_4740)">
        <path d="M96.875 48.4375C96.875 70.4866 67.3584 109.741 54.4165 125.937C51.3135 129.797 45.5615 129.797 42.4585 125.937C29.5166 109.741 0 70.4866 0 48.4375C0 21.696 21.696 0 48.4375 0C75.179 0 96.875 21.696 96.875 48.4375Z" fill={iconColor} />
        <path d="M62.4465 41.0579H56.0213C56.0213 39.013 55.209 37.0519 53.763 35.6059C52.3171 34.16 50.3559 33.3477 48.311 33.3477C46.2662 33.3477 44.305 34.16 42.8591 35.6059C41.4131 37.0519 40.6008 39.013 40.6008 41.0579H34.1756C33.4939 41.0579 32.8402 41.3287 32.3582 41.8107C31.8762 42.2927 31.6055 42.9464 31.6055 43.628V62.9037C31.6055 63.5853 31.8762 64.239 32.3582 64.721C32.8402 65.203 33.4939 65.4738 34.1756 65.4738H62.4465C63.1282 65.4738 63.7819 65.203 64.2639 64.721C64.7458 64.239 65.0166 63.5853 65.0166 62.9037V43.628C65.0166 42.9464 64.7458 42.2927 64.2639 41.8107C63.7819 41.3287 63.1282 41.0579 62.4465 41.0579ZM43.1709 47.4831C43.1709 47.824 43.0355 48.1508 42.7945 48.3918C42.5535 48.6328 42.2266 48.7682 41.8858 48.7682C41.545 48.7682 41.2182 48.6328 40.9772 48.3918C40.7362 48.1508 40.6008 47.824 40.6008 47.4831V44.9131C40.6008 44.5722 40.7362 44.2454 40.9772 44.0044C41.2182 43.7634 41.545 43.628 41.8858 43.628C42.2266 43.628 42.5535 43.7634 42.7945 44.0044C43.0355 44.2454 43.1709 44.5722 43.1709 44.9131V47.4831ZM48.311 35.9177C49.6743 35.9177 50.9817 36.4593 51.9457 37.4233C52.9097 38.3872 53.4512 39.6947 53.4512 41.0579H43.1709C43.1709 39.6947 43.7124 38.3872 44.6764 37.4233C45.6404 36.4593 46.9478 35.9177 48.311 35.9177ZM56.0213 47.4831C56.0213 47.824 55.8859 48.1508 55.6449 48.3918C55.4039 48.6328 55.0771 48.7682 54.7363 48.7682C54.3955 48.7682 54.0686 48.6328 53.8276 48.3918C53.5866 48.1508 53.4512 47.824 53.4512 47.4831V44.9131C53.4512 44.5722 53.5866 44.2454 53.8276 44.0044C54.0686 43.7634 54.3955 43.628 54.7363 43.628C55.0771 43.628 55.4039 43.7634 55.6449 44.0044C55.8859 44.2454 56.0213 44.5722 56.0213 44.9131V47.4831Z" fill={fillColor} />
        </g>
        <defs>
          <clipPath id="clip0_2099_4740">
          <rect width="96.875" height="129.167" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    );
}

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
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isListLoaded, setIsListLoaded] = useState<boolean>(true);

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
    setIsLoaded(false);
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
          // countryEventCountsObj['totalEventCount'] = totalCount;
          apiData.data.forEach((country: any) => {
            countryEventCountsObj[country.countryCode] = country.eventCount;
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
    } finally {
      setIsLoaded(true);
    }
  }

  useEffect(() => {
    if(props.queryString)
      fetchEventsData();
    else
      setIsLoaded(true);
  }, [props.queryString]);

  const [currPage, setCurrPage] = useState(1);
  const [loadMoreDisabled, setLoadMoreDisabled] = useState<boolean>(false);

  const handleLoadMoreEvents = async() => {
    try {
      const apiUrl = `${baseUrl}/event/search?sortBy=score&sortType=desc&max=10&offset=${(currPage - 1)*10}&${props.queryString}`;
      setLoadMoreDisabled(true);
      setIsListLoaded(false);

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
      setIsListLoaded(true);
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
    return (
      <Layer
        key={country}
        id={`country-layer-${country}`}
        type="fill"
        source="country-source"
        source-layer="country_boundaries"
        filter={['==', 'iso_3166_1', country]}
        maxzoom={8}
        paint={{
          'fill-color': 'rgba(130, 80, 164, 0.6)',
          'fill-opacity': getOpacityValue(country),
          "fill-outline-color": '#6750a4',
        }}
      />
    );
  });

  const getRadius = () => {
    let defaultRadius = 25;
    return defaultRadius-((viewport.zoom -8)*(defaultRadius/16));
  }

  const setNewMarkers = async(lat: number, long: number, page: number) => {
    const newMarkers = await myFetch(`${baseUrl}/event/search?mapRadius=${getRadius()*1000}&latitude=${lat}&longitude=${long}&offset=${(page-1)*20}&max=20&${props.queryString}`, {
      method: "GET",
      headers: headers,
    });
    setEventPerPage(prevIds => {
      let oldIds = prevIds.map(
        (event: any) => event.id
      );
      let tempObj = prevIds;
      newMarkers.data.events.map(
        (event: any) =>{
          if(!oldIds.includes(event.id)) {
            tempObj.push(event);}
        }
      );
      if(tempObj.length > 100){
        tempObj = tempObj.slice(tempObj.length - 100);
      }
      return tempObj;
    });
  }

  useEffect(() => {
    if(viewport.zoom >8){
      // const debounceTimeout = setTimeout(() => {
        setNewMarkers(viewport.latitude, viewport.longitude, 1);
        setTimeout(()=>setNewMarkers(viewport.latitude, viewport.longitude, 2), 200)
      // }, 300);
      // return () => clearTimeout(debounceTimeout);
    }
  }, [viewport]);

  const zoneLevelProps = {zoom:1};

  // if (!isLoaded) {
  //   return <Loading />;
  // } else if (isLoaded && (eventPerPage.length == 0 && countryPerPage.length == 0)) {
  //   return (
  //     <div className={styles.noData}>
  //       No results containing all your search terms were found.
  //     </div>
  //   );
  // }

  return (
    <div className={styles.map}>
      {/* <Suspense fallback={<div><Image src={Preloader} alt="preloader" height="50"/></div>}> */}
      <Map2
        style={{
          width: "calc(100vw - 137px)",
          height: "90vh",
        }}
        mapStyle={
          theme === "light"
            ? "mapbox://styles/mapbox/streets-v12"
            : "mapbox://styles/mapbox/dark-v11"
        }
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: -0.076132,
          latitude: 51.50853,
          zoom: 2,
        }}
        maxZoom={20}
        projection={{"name": "mercator"}}
        onZoomEnd={(zoomEvent) => {
          setViewport((prevViewport: any) => ({
            ...prevViewport,
            zoom: zoomEvent.viewState.zoom
          }));
        }}
        onDragEnd={(dragEvent) => {
          setViewport((prevViewport: any) => ({
            ...prevViewport,
            latitude: dragEvent.viewState.latitude,
            longitude: dragEvent.viewState.longitude,
          }));
        }}
        // onViewportChange={(viewport) => {
        //   setViewport(viewport);
        // }}
        // {...zoneLevelProps}
      >
        {eventPerPage && eventPerPage.map((event) => (
          <div key={event.id}>
            <Marker
              key={event.id}
              latitude={parseFloat(event.location.geoCordinates.latitude)}
              longitude={parseFloat(event.location.geoCordinates.longitude)}
            >
              <button
                className={styles.map_event_button}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedPlace(event.id);
                }}
              >
                {/* <Image src={MapPointer} alt="mapPointer" /> */}
                {markerIcon(event?.type[0], event?.stats?.eventFollower)}
              </button>
            </Marker>
            {selectedPlace == event.id ? (
              <Popup
                className={styles.popup}
                latitude={parseFloat(event.location.geoCordinates.latitude)}
                longitude={parseFloat(event.location.geoCordinates.longitude)}
                onClose={() => {
                  setSelectedPlace(null);
                }}
                closeOnClick={false}
              >
              <div className={styles.event_details_popup}>
                <div>
                  <Link
                    href={`/internal/event/${event.id}`}
                    className={styles.event_details_popup_link}
                    target="_blank"
                  >
                    {event.name}
                  </Link>
                  <div className={styles.event_country}>{event.location.countryName}</div>
                  <div className={styles.event_datetime}>
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </div>
                </div>
                <div className={styles.event_details_action}>
                  <Link
                    className={styles.event_view_details}
                    href={`/internal/event/${event.id}`}
                    target="_blank"
                  >
                    View Details
                  </Link>
                  {/* <div className={styles.event_details_category}>
                    Textile Industry
                  </div> */}
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
        { (countryPerPage && countryPerPage.length > 0) && 
          <>
            <Source id="country-source" type="vector" url="mapbox://mapbox.country-boundaries-v1" >
              {layers}
            </Source>
            {countryPerPage.map((event) => (
              <div key={event.countryId} >
                <Marker
                  key={event.countryId}
                  latitude={(event.geoCordinates.latitude) ? parseFloat(event.geoCordinates.latitude) :0}
                  longitude={(event.geoCordinates.longitude) ? parseFloat(event.geoCordinates.longitude) :0}
                >
                  <span className={styles.eventCountTag}>{event.name+' - '+event.eventCount + ' Events'}</span>
                </Marker>
              </div>
            ))}
          </>
        }
      </Map2>

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
              { !isListLoaded &&
                <div style={{paddingBottom:'10px'}}><Loading /></div>
              }
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
