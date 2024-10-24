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
// import { useFilterState } from "@/hooks/useFilterState";
import AutocompleteInput from "./AutocompleteInput";
// import { useLocationService } from "@/services/locationService";
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
interface LocationProps{
  source:string;
  selectedLocation?: any;
  setSelectedLocation?:any;
}
export type Location = GeoLocation | LocationItem[];

export default function LocationSelector({
  source,
  selectedLocation: parentSelectedLocation,
  setSelectedLocation: parentSetSelectedLocation,
}: LocationProps) {
//   const { getLocationName, getLocationDetails } = useLocationService();
const [localSelectedLocation, setLocalSelectedLocation] = useState<Location | null>(null);
  const [activeTab, setActiveTab] = useState("city");
  const [isOpen, setIsOpen] = useState(false);
  const [radiusUnit, setRadiusUnit] = useState<string>("km");
  const selectedLocation = source==="tracker" ? parentSelectedLocation : localSelectedLocation;
  const setSelectedLocation = source==="tracker" ? parentSetSelectedLocation : setLocalSelectedLocation;
  // const [selectedLocation, setSelectedLocation] = useState<Location | null>(
  //   null
  // );
//   const { replaceFilter, searchParams, deleteMultipleFilters } =
//     useFilterState();

//   const fetchUrlLocation = async () => {
//     const geoCoordinate = JSON.parse(
//       searchParams.get("geoCoordinates") || "null"
//     );
//     const locationIds = searchParams.get("locationIds")?.split(",");

//     if (geoCoordinate) {
//       const locationName = await getLocationName(
//         geoCoordinate.latitude,
//         geoCoordinate.longitude
//       );
//       setSelectedLocation({
//         lat: geoCoordinate.latitude,
//         lng: geoCoordinate.longitude,
//         radius: geoCoordinate.radius,
//         description: locationName,
//       });
//     } else if (locationIds) {
//       const locations = await Promise.all(
//         locationIds.map(async (id) => {
//           const location = await getLocationDetails(id);
//           return {
//             id,
//             description: location?.formattedLocations[0].displayName,
//           };
//         })
//       );
//       setSelectedLocation(locations);
//     }
//   };

//   useEffect(() => {
//     fetchUrlLocation();
//   }, [searchParams]);

//   const applyHandler = () => {
//     if (selectedLocation && !Array.isArray(selectedLocation)) {
//       const geoLocation = selectedLocation as GeoLocation;
//       const radiusInKm =
//         radiusUnit === "mi" ? geoLocation.radius * 1.60934 : geoLocation.radius;
//       replaceFilter(
//         "locationIds",
//         "geoCoordinates",
//         JSON.stringify({
//           latitude: geoLocation.lat,
//           longitude: geoLocation.lng,
//           radius: radiusInKm,
//         })
//       );
//     } else if (
//       selectedLocation &&
//       Array.isArray(selectedLocation) &&
//       selectedLocation.length > 0
//     ) {
//       replaceFilter(
//         "geoCoordinates",
//         "locationIds",
//         (selectedLocation as LocationItem[]).map((loc) => loc.id).join(",")
//       );
//     } else {
//       deleteMultipleFilters(["locationIds", "geoCoordinates"]);
//     }
//     setIsOpen(false);
//   };

  const onOpenChange = (open: boolean) => {
    if (!open) {
    //   applyHandler();
    }
    setIsOpen(open);
  };
console.log(selectedLocation);

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
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
      <PopoverContent className="w-[512px] border rounded-md shadow-sm p-0">
        <div className="flex justify-between items-center p-4 py-2 border-b">
          <span className="font-medium">Location</span>
          <Button
            variant="link"
            className="text-primary pr-0"
            // onClick={applyHandler}
          >
            Apply
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="city">City, State, Country</TabsTrigger> */}
            {/* <TabsTrigger value="center">Center Point & Radius</TabsTrigger> */}
          {/* </TabsList> */}
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
          {/* <TabsContent value="center" className="p-4 space-y-4">
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
                    setSelectedLocation((prev) =>
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
                    setSelectedLocation((prev) =>
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
                    setSelectedLocation((prev) =>
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
          </TabsContent> */}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}