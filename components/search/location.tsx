"use client";

import { useState, useEffect } from "react";
import { PlusCircle, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFilterContext } from "@/context/filterContext";
import AutocompleteInput from "./AutocompleteInput";
import { useLocationService } from "@/services/locationService";
import LocationPopOver from "./locationPopOver";
// import { getLocationByGeoCoordinates } from "@/services/searchService";

export interface GeoLocation {
  lat: number;
  lng: number;
  radius: number;
  description: string;
}

export interface LocationItem {
  id: string;
  description: string | undefined;
}

export type Location = GeoLocation | LocationItem[];
export interface LocationProps {
  type?:string;
  source: string;
  selectedLocation?: Location | null;
  setSelectedLocation?: React.Dispatch<
    React.SetStateAction<GeoLocation | LocationItem[] | null>
  >;
}
export default function LocationSelector({
  type,
  source,
  selectedLocation: parentSelectedLocation,
  setSelectedLocation: parentSetSelectedLocation,
}: LocationProps) {
  const { getLocationName, getLocationDetails } = useLocationService();
  const productType = process.env.NEXT_PUBLIC_PRODUCT_TYPE;
  const [activeTab, setActiveTab] = useState(type==="T_VENUE"?"center":"city");
  const [isOpen, setIsOpen] = useState(false);
  const [radiusUnit, setRadiusUnit] = useState<string>("km");
  const [localSelectedLocation, setLocalSelectedLocation] = useState<Location | null>(
    null
  );
  const selectedLocation = source==="tracker" ? parentSelectedLocation : localSelectedLocation;
  const setSelectedLocation = parentSetSelectedLocation || setLocalSelectedLocation;
  const { replaceLocalFilter, searchParams, deleteMultipleLocalFilters } =
    useFilterContext();

  const fetchUrlLocation = async () => {
    const geoCoordinate = JSON.parse(
      searchParams.get("geoCoordinates") || "null"
    );
    const locationIds = searchParams.get("locationIds")?.split(",");

    if (geoCoordinate) {
      const locationName = await getLocationName(
        geoCoordinate.latitude,
        geoCoordinate.longitude
      );
      setSelectedLocation?.({
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
            id,
            description: location?.formattedLocations[0].displayName,
          };
        })
      );
      setSelectedLocation?.(locations);
    } else {
      setSelectedLocation?.(null);
    }
  };

  useEffect(() => {
    if(source!=="tracker")
    fetchUrlLocation();
  }, [searchParams]);

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
    } else if (
      selectedLocation &&
      Array.isArray(selectedLocation) &&
      selectedLocation.length > 0
    ) {
      replaceLocalFilter(
        "geoCoordinates",
        "locationIds",
        (selectedLocation as LocationItem[]).map((loc) => loc.id).join(",")
      );
    } else {
      deleteMultipleLocalFilters(["locationIds", "geoCoordinates"]);
    }
    setIsOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      applyHandler();
    }
    setIsOpen(open);
  };
  useEffect(() => {
    if (type === "T_LOCATION" && !isOpen) {
      onOpenChange(true);
    }
  }, [type, isOpen]);
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      {(!type) &&
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            isOpen ? "border-primary" : "border-input"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center truncate">
            <span className="mr-2">Location</span>
            {selectedLocation && (
              <span className="truncate ml-1 text-xs text-primary font-medium">
                {Array.isArray(selectedLocation) ? (
                  selectedLocation.length > 1 ? (
                    <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">
                      {selectedLocation.length}
                    </span>
                  ) : (
                    selectedLocation.map((loc) => loc.description).join(", ")
                  )
                ) : (
                  selectedLocation.description
                )}
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      }
      {!type ?
      <PopoverContent className="w-[512px] border rounded-md shadow-sm p-0">
      <LocationPopOver type={type} source={source} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} applyHandler={applyHandler} activeTab={activeTab} setActiveTab={setActiveTab} radiusUnit={radiusUnit} setRadiusUnit={setRadiusUnit}/>
      </PopoverContent>
       :
       <LocationPopOver type={type} source={source} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} applyHandler={applyHandler} activeTab={activeTab} setActiveTab={setActiveTab} radiusUnit={radiusUnit} setRadiusUnit={setRadiusUnit}/>
      }
    </Popover>
  );
}