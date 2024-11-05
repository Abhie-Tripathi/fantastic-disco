import type { LayerProps } from "react-map-gl";

export const clusterLayer: LayerProps = {
  id: "clusters",
  type: "symbol",
  source: "events",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 16,
  },
  paint: {
    "text-color": "#ffffff",
  },
};

export const clusterBackgroundLayer: LayerProps = {
  id: "cluster-background",
  type: "circle",
  source: "events",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": "#6750A4",
    "circle-radius": 20,
    "circle-opacity": 0.9,
  },
};

export const unclusteredPointLayer: LayerProps = {
  id: "unclustered-point",
  type: "symbol",
  source: "events",
  filter: ["!", ["has", "point_count"]],
  layout: {
    "icon-image": ["get", "icon"], // This assumes your data has an 'icon' property with the image name
    "icon-size": 0.7,
    "icon-allow-overlap": true,
    "icon-ignore-placement": true,
  },
  paint: {
    "icon-opacity": 1,
  },
};
