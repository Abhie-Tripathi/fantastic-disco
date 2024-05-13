import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./map.style.module.css";
import { useState } from "react";
import MapPointer from "/public/Marker.svg";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { useTheme } from "@/context";

interface MapProps{
    lat : number;
    long : number;
    // containerWidth : number;
}
const Map = ({ lat, long} :MapProps ) => {
  const { theme } = useTheme();
  // const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  // const [fullView, setFullView] = useState(false);

  // useEffect(()=>{
  //   console.log("container width is ",containerWidth)
  // },[containerWidth])
  const [viewport, setViewport] = useState<any>({
    latitude: 40.7128,
    longitude: -74.0060,
    width: "calc(100%-0px)" ,
    height: "350px",
    zoom: 2,
  });
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
          <div >
            <Marker
              latitude={lat}
              longitude={long}
            >
              <button
                className={styles.map_event_button}
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Image src={MapPointer} alt="mapPointer" />
              </button>
            </Marker>
            {/* {selectedPlace == event.id ? (
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
            ) : null} */}
          </div>
      </ReactMapGL>

    </div>
  );
};

export default Map;
