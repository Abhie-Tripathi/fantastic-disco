import React, { useState, useEffect } from "react";
import Map, { Marker } from "react-map-gl";
import styles from './map.style.module.css'

const MyMap = () => {
  const [viewport, setViewport] = useState({
    latitude: 37.7833, // Initial center (adjust as needed)
    longitude: -122.4167, // Initial center (adjust as needed)
    zoom: 11, // Initial zoom level (adjust as needed)
  });

  // Demo data for markers (replace with your actual data)
  const demoMarkers = [
    { latitude: 37.7749, longitude: -122.4194, name: "Golden Gate Bridge" },
    { latitude: 37.8043, longitude: -122.4064, name: "Alcatraz Island" },
    { latitude: 37.7833, longitude: -122.4064, name: "Fisherman's Wharf" },
  ];

  useEffect(() => {
    // Optionally use geolocation to get user's location:
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewport({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        zoom: 13, // Adjust zoom level for closer view
      });
    });
  }, []);

  return (
    <div className={styles.mapContainer}>
      <Map
        {...viewport}
        mapboxAccessToken="pk.eyJ1IjoiYWJoaWUiLCJhIjoiY2x0ODgycjA0MDV6czJrdDQzaWwwYmh6eCJ9.px6YQmrBFfxRPyhB1FqCkg"
        onViewportChange={(newViewport) => setViewport(newViewport)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        className={styles.map} // Apply custom CSS classes for styling (optional)
      >
        {demoMarkers.map((marker) => (
          <Marker
            key={marker.name} // Use a unique key for each marker
            latitude={marker.latitude}
            longitude={marker.longitude}
          >
            <div className={styles.marker}>
              <p>{marker.name}</p>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MyMap;

