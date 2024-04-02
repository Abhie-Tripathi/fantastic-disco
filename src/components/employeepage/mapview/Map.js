import { Loader } from '@googlemaps/js-api-loader';
import React, { useEffect, useRef } from 'react';
import styles from './map.style.module.css'
import { useState } from 'react';
import ReactMapGL from "react-map-gl";
const Map = () => {
    // const mapRef = useRef(null);

    // useEffect(() => {
    //     const initMap = async () => {
    //         const loader = new Loader({
    //             apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    //             version: "weekly"
    //         })
    //         const markerPositions = [
    //             { lat: 40.65, lng: -74.10 },
    //             { lat: 40.67, lng: -74.12 },
    //             { lat: 40.63, lng: -74.14 }
    //         ];
    //         const { Map } = await loader.importLibrary('maps')

    //         const { AdvancedMarkerElement } = await loader.importLibrary('marker')

    //         const position = {
    //             lat: 40.64459161223717,
    //             lng: -74.1129827795072
    //         }

    //         const mapOptions = {
    //             center: position,
    //             zoom: 12,
    //             mapId: 'MY_MAP_ID'
    //         }
    //         const map = new Map(mapRef.current, mapOptions)
    //         markerPositions.map((position) => {
    //             new AdvancedMarkerElement({
    //                 map,
    //                 position: { lat: position.lat, lng: position.lng }
    //             });
    //         });

    //     }
    //     initMap()
    // }, []);


    let [viewport,setViewport]=useState({
        latitude: 51.508530,
        longitude: -0.076132,
        width: "calc(100vw - 85px)",
        height: "350px" ,
        zoom: 12
    })
    return (
        <div className={styles.map}>
            {/* <div ref={mapRef} style={{ height: '50vh', width: '100%' }} /> */}
            <ReactMapGL
           {...viewport}
           mapStyle="mapbox://styles/mapbox/streets-v11"
           mapboxApiAccessToken=''
           onViewportChange={(viewport) => {
            setViewport(viewport);
          }}
            />
        </div>

    )
};

export default Map;