"use client";

import { useState, useEffect } from "react";
import { useFilterContext } from "@/context/filterContext";
import { useLocationService } from "@/services/locationService";
import { usePathname } from "next/navigation";
import { sessionService } from "@/services/sessionService";
import AutocompleteInput from "@/components/search/AutocompleteInput";
export interface GeoLocation {
  locationType: "GeoJSON";
  lat: number;
  lng: number;
  radius: number;
  description: string;
}

export interface LocationItem {
  locationType: "LocationId";
  id: string;
  description: string | undefined;
}

export type Location = GeoLocation | LocationItem[];
export interface LocationProps {
  filterName: "companyLocationIds" | "eventLocationIds";
}
export default function LocationSelector({ filterName }: LocationProps) {
  const pathName = usePathname();
  const { localFilters } = useFilterContext();
  const { saveLastSearchedLocation, clearLastSearchedLocation } =
    sessionService();
  const { getLocationName, getLocationDetails } = useLocationService();
  const [activeTab, setActiveTab] = useState("city");
  const [isOpen, setIsOpen] = useState(false);
  const [radiusUnit, setRadiusUnit] = useState<string>("km");
  const [localSelectedLocation, setLocalSelectedLocation] =
    useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>();
  const {
    replaceLocalFilter,
    searchParams,
    deleteMultipleLocalFilters,
    setLocalFilter,
  } = useFilterContext();

  const fetchUrlLocation = async () => {
    const geoCoordinate = JSON.parse(localFilters.geoCoordinates || "null");
    const ids = localFilters?.[filterName]?.length
      ? localFilters?.[filterName]?.split(",")
      : [];
    const locationIds = ids;

    if (geoCoordinate) {
      const locationName = await getLocationName(
        geoCoordinate.latitude,
        geoCoordinate.longitude
      );
      setSelectedLocation?.({
        locationType: "GeoJSON",
        lat: geoCoordinate.latitude,
        lng: geoCoordinate.longitude,
        radius: geoCoordinate.radius,
        description: locationName,
      });
    } else if (locationIds) {
      const locations = await Promise.all(
        locationIds.map(async (id) => {
          const location = await getLocationDetails(id);
          return {
            locationType: "LocationID",
            id,
            description: location?.formattedLocations[0]?.displayName,
          };
        })
      );
      setSelectedLocation?.(locations as LocationItem[]);
    } else {
      setSelectedLocation?.(null);
    }
  };

  useEffect(() => {
    fetchUrlLocation();
  }, [localFilters[filterName]]);

  useEffect(() => {
    if (selectedLocation && Array.isArray(selectedLocation)) applyHandler();
    // setLocalFilter("locationIds", (selectedLocation as LocationItem[]).map((loc) => loc.id).join(","));
  }, [selectedLocation]);

  const applyHandler = () => {
    if (selectedLocation && !Array.isArray(selectedLocation)) {
      const geoLocation = selectedLocation as GeoLocation;
      const radiusInKm =
        radiusUnit === "mi" ? geoLocation.radius * 1.60934 : geoLocation.radius;
      replaceLocalFilter(
        "locationIds",
        "geoCoordinates",
        JSON.stringify({
          latitude: geoLocation.lat,
          longitude: geoLocation.lng,
          radius: radiusInKm,
        })
      );
      saveLastSearchedLocation(geoLocation);
    } else if (
      selectedLocation &&
      Array.isArray(selectedLocation) &&
      selectedLocation.length > 0
    ) {
      replaceLocalFilter(
        "geoCoordinates",
        filterName,
        (selectedLocation as LocationItem[]).map((loc) => loc.id).join(",")
      );
      saveLastSearchedLocation(selectedLocation);
    } else {
      deleteMultipleLocalFilters([filterName, "geoCoordinates"]);
      clearLastSearchedLocation();
    }
    setIsOpen(false);
  };

  return (
    <div className="h-[150px]">
      <AutocompleteInput
        defaultOpen
        multiple
        type="LocationId"
        placeholder="E.g. Bengaluru, Karnataka"
        onSelect={setSelectedLocation}
        value={
          selectedLocation && Array.isArray(selectedLocation)
            ? selectedLocation.map((loc) => ({
                id: loc.id,
                description: loc.description || "",
              }))
            : null
        }
      />
    </div>
  );
}
