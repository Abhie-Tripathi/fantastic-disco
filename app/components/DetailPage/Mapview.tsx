'use client'
import React from 'react';
import styles from './mapview.style.module.css'
import MapPointer from "/public/Marker.svg";
import { Map, Marker } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import Image from 'next/image';
import { useTheme } from "@/context";

interface MapProps {
    latitude: number;
    longitude: number;
    // width: number;
    zoom: number;
    venue?: string;
    height : number;
}

const Mapview = ({ latitude, longitude, zoom, venue, height }: MapProps) => {
      const {theme} = useTheme()
    return (
        <div className={styles.body}>
            {venue &&
                <div style={{marginBottom: 24 }}>
                    <div className={styles.heading}>Location</div>
                    <div className={styles.line}></div>
                    <div className={styles.venue}>{venue ? venue : "Via Angelo della Pergola, 11/4"}</div>
                </div>
            }

            <div className={styles.map} style={{ width: '100%', height: height}}>
                <Map
                    initialViewState={{
                        longitude: longitude,
                        latitude: latitude,
                        zoom: zoom,
                    }}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    mapStyle={`mapbox://styles/mapbox/${theme === "dark" ? "dark" : "streets"}-${theme === "dark" ? "v11" : "v12"}`}
                    // mapStyle={`mapbox://styles/mapbox/streets-v12`}
                >
                    <Marker latitude={latitude} longitude={longitude}>
                        <Image src={MapPointer} alt='pointer' />
                    </Marker>
                </Map>
            </div>
        </div>
    )
}

export default Mapview