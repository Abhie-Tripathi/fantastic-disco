"use client";

import { useState, useEffect, use } from "react";
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
import { isEventeli } from "@/config";
import { usePathname } from "next/navigation";
import { sessionService } from "@/services/sessionService";
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
  type?: string;
  isMandatory?: boolean;
}
export default function LocationSelector({ type, isMandatory }: LocationProps) {
  const pathName = usePathname();
  const { localFilters } = useFilterContext();
  const { saveLastSearchedLocation, clearLastSearchedLocation } = sessionService();
  const { getLocationName, getLocationDetails } = useLocationService();
  const [activeTab, setActiveTab] = useState("city");
  const [isOpen, setIsOpen] = useState(false);
  const [radiusUnit, setRadiusUnit] = useState<string>("km");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>();
  const { replaceLocalFilter, deleteMultipleLocalFilters } = useFilterContext();

  const fetchUrlLocation = async () => {
    const geoCoordinate = JSON.parse(localFilters.geoCoordinates || "null");
    const ids = localFilters?.locationIds?.length
      ? localFilters.locationIds.split(",")
      : null;
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
      const location = await getLocationDetails(locationIds.join(","));
      const locations = locationIds.map((id) => ({
        locationType: "LocationID",
        id,
        description: location?.formattedLocations.find((loc) => loc.id === id)
          ?.displayName,
      }));
      setSelectedLocation?.(locations as LocationItem[]);
    } else {
      setSelectedLocation?.(null);
    }
  };

  useEffect(() => {
    fetchUrlLocation();
  }, [localFilters]);

  // Add new useEffect for trends page default location
  useEffect(() => {
    if (pathName === "/internal" && !localFilters.locationIds) {
      replaceLocalFilter(
        "geoCoordinates",
        "locationIds",
        "5dc0b154-e2d8-5160-9bd6-dd8175a58c47"
      );
    }
  }, [pathName]);

  // Add cleanup effect
  useEffect(() => {
    return () => {
      if (pathName === "/internal" || pathName === "/internal/search") {
        replaceLocalFilter("geoCoordinates", "locationIds", "");
      }
    };
  }, [pathName]);

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
        "locationIds",
        (selectedLocation as LocationItem[]).map((loc) => loc.id).join(",")
      );
      saveLastSearchedLocation(selectedLocation);
    } else {
      deleteMultipleLocalFilters(["locationIds", "geoCoordinates"]);
      clearLastSearchedLocation();
    }
    setIsOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      applyHandler();
    }
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between px-3 py-5 text-base font-normal ${
            (selectedLocation === undefined ||
              (Array.isArray(selectedLocation) &&
                selectedLocation?.length === 0)) &&
            isMandatory
              ? "border-destructive"
              : isOpen
              ? "border-primary"
              : "border-input"
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
      <PopoverContent className="w-[512px] border rounded-md shadow-sm p-0">
        <div className="flex justify-between items-center p-4 py-2 border-b">
          <span className="font-medium">Location</span>
          <Button
            variant="link"
            className="text-primary pr-0"
            onClick={applyHandler}
          >
            {/* Apply */}
          </Button>
        </div>

        {isEventeli ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="city">City, State, Country</TabsTrigger>
              <TabsTrigger value="center">Center Point & Radius</TabsTrigger>
            </TabsList>
            <TabsContent value="city" className="p-4">
              <AutocompleteInput
                multiple
                type="LocationId"
                placeholder="E.g. Bangalore, Karnataka"
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
            </TabsContent>
            <TabsContent value="center" className="p-4 space-y-4">
              <AutocompleteInput
                type="GeoCoordinate"
                placeholder="E.g. Novotel, Hyderabad"
                onSelect={setSelectedLocation}
                value={
                  selectedLocation && !Array.isArray(selectedLocation)
                    ? {
                        id: Math.random().toString(),
                        description: (selectedLocation as GeoLocation)
                          .description,
                      }
                    : null
                }
              />
              <div className="grid grid-cols-10 gap-2">
                <div className="col-span-2">
                  <label htmlFor="radius" className="text-sm font-medium">
                    Radius
                  </label>
                  <Input
                    id="radius"
                    type="number"
                    className="mt-1"
                    value={(selectedLocation as GeoLocation)?.radius}
                    onChange={(e) =>
                      setSelectedLocation?.((prev) =>
                        prev
                          ? {
                              ...prev,
                              radius: Number(e.target.value),
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="unit" className="text-sm font-medium">
                    Unit
                  </label>
                  <Select
                    defaultValue="km"
                    onValueChange={(value) => setRadiusUnit(value)}
                    value={radiusUnit}
                  >
                    <SelectTrigger id="unit" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Km</SelectItem>
                      <SelectItem value="mi">Mi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3">
                  <label htmlFor="latitude" className="text-sm font-medium">
                    Latitude
                  </label>
                  <Input
                    id="latitude"
                    type="number"
                    className="mt-1"
                    value={(selectedLocation as GeoLocation)?.lat}
                    onChange={(e) =>
                      setSelectedLocation?.((prev) =>
                        prev
                          ? {
                              ...prev,
                              lat: Number(e.target.value),
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="col-span-3">
                  <label htmlFor="longitude" className="text-sm font-medium">
                    Longitude
                  </label>
                  <Input
                    id="longitude"
                    type="number"
                    className="mt-1"
                    value={(selectedLocation as GeoLocation)?.lng}
                    onChange={(e) =>
                      setSelectedLocation?.((prev) =>
                        prev
                          ? {
                              ...prev,
                              lng: Number(e.target.value),
                            }
                          : null
                      )
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <AutocompleteInput
            defaultOpen
            multiple
            type="LocationId"
            placeholder="E.g. Bangalore, Karnataka"
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
        )}
      </PopoverContent>
    </Popover>
  );
}
