import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './map.module.css'
import { useState } from 'react';
import eventData from '../../../../public/data/demoEvent.json'
import MapPointer from '/public/Marker.svg'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'

interface Event {
  id: number;
  venue: { lat: number; lng: number }[];
  eventUrl: string;
  name: string;
  country: string;
}

const Map: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const [viewport, setViewport] = useState<any>({
    latitude: 51.50853,
    longitude: -0.076132,
    width: '100%',
    height: '350px',
    zoom: 12,
  });
  return (
    <div className={styles.map}>
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
                  <div className={styles.event_country}>
                    {event.location}
                  </div>
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

    </div>

  )
};

export default Map;
