'use client'
import React, { useRef, useEffect, useState } from 'react';
import styles from './mapview.style.module.css'
import MapPointer from "/public/Marker.svg";
import ReactMapGl, { Marker } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css';
import Image from 'next/image';

interface MapProps {
    latitude: number;
    longitude: number;
    zoom: number;
}

const Mapview = ({ latitude, longitude, zoom }: MapProps) => {
    const [viewport, setViewport] = useState({
        latitude,
        longitude,
        zoom,
    });

    return (
        <div className={styles.body}>
            <div className={styles.heading}>Location</div>
            <div className={styles.line}></div>
            <div className={styles.venue}>Via Angelo della Pergola, 11/4</div>
            <div className={styles.map} style={{ width: 670, height: 200, marginTop:24}}>
                <ReactMapGl
                    {...viewport}
                    mapboxApiAccessToken='pk.eyJ1IjoiYWJoaWUiLCJhIjoiY2x0ODgycjA0MDV6czJrdDQzaWwwYmh6eCJ9.px6YQmrBFfxRPyhB1FqCkg'
                    width="100%"
                    height="100%"
                    mapStyle='mapbox://styles/mapbox/light-v11'
                    onViewportChange={(viewport)=>setViewport(viewport)
                        
                    }
                >
                    <Marker latitude={latitude} longitude={longitude}>
                        <Image src={MapPointer} alt='pointer'/>
                    </Marker>
                </ReactMapGl>
            </div>
        </div>
    )
}

export default Mapview