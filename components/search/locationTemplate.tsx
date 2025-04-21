// @ts-nocheck
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
  filterName?: string;
}
export default function LocationSelector({ type, isMandatory, filterName="locationIds" }: LocationProps) {
  console.log(filterName);
  
  const pathName = usePathname();
  const { localFilters, setLocalFilter } = useFilterContext();
  const [isApply,setIsApply]=useState(true);
  const { saveLastSearchedLocation, clearLastSearchedLocation } =
    sessionService();
  const { getLocationName, getLocationDetails } = useLocationService();
  const [activeTab, setActiveTab] = useState(type==="T_VENUE"?"center":"city");
  const [isOpen, setIsOpen] = useState(false);
  const [radiusUnit, setRadiusUnit] = useState<string>("km");
  const [applyHandlerCalled, setApplyHandlerCalled]=useState(false);
  const [localSelectedLocation, setLocalSelectedLocation] =
    useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>();
  const { replaceLocalFilter, searchParams, deleteMultipleLocalFilters } =
    useFilterContext();
    const fetchUrlLocation = async () => {
      const geoCoordinate = localFilters?.viewBound
        ? JSON.parse(localFilters.viewBound)
        : null;
        console.log(geoCoordinate);
      const locationIds = localFilters?.[filterName as keyof Filters]?.length
        ? localFilters[filterName as keyof Filters].split(",")
        : null;
  
      if (geoCoordinate) {
        const locationName = await getLocationName(
          geoCoordinate.coordinates.latitude,
          geoCoordinate.coordinates.longitude
        );
        console.log(locationName);
        
        
        setSelectedLocation?.({
          locationType: "GeoJSON",
          lat: geoCoordinate.coordinates.latitude,
          lng: geoCoordinate.coordinates.longitude,
          radius: geoCoordinate.coordinates.radius,
          description: (isApply)?locationName:(geoCoordinate?.properties?.name || locationName)
        });
        setIsApply(false);
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
    const applyHandler = () => {
      console.log(selectedLocation);
      if (selectedLocation && !Array.isArray(selectedLocation)) {
        const geoLocation = selectedLocation as GeoLocation;
        const radiusInKm =
          radiusUnit === "mi" ? (geoLocation.radius || 5) * 1.60934 : geoLocation.radius;
  
        if (radiusUnit === "mi") {
          setRadiusUnit("km");
        }
        console.log(selectedLocation)
        replaceLocalFilter(
          "locationIds",
          "viewBound",
          JSON.stringify({
            boundType: "point",
            coordinates: {
              latitude: geoLocation.lat,
              longitude: geoLocation.lng,
              radius: radiusInKm,
            },
            properties: {
              name: geoLocation.description,
            },
          })
        );
        saveLastSearchedLocation(geoLocation);
      } else if (
        selectedLocation &&
        Array.isArray(selectedLocation) &&
        selectedLocation.length > 0
      ) {
        replaceLocalFilter(
          "viewBound",
          filterName,
          (selectedLocation as LocationItem[]).map((loc) => loc.id).join(",")
        );
        saveLastSearchedLocation(selectedLocation);
      } else {
        deleteMultipleLocalFilters([filterName, "viewBound"]);
        clearLastSearchedLocation();
      }
      setIsOpen(false);
    };
//  useEffect(()=>{
//   console.log(selectedLocation);
//   if (selectedLocation && (Array.isArray(selectedLocation) || typeof selectedLocation === "object"))
//   applyHandler();
// //   if (selectedLocation && Array.isArray(selectedLocation)){
// //     console.log(selectedLocation);
// //     setLocalFilter(
// //       "locationIds",
// //       (selectedLocation as LocationItem[]).map((loc) => loc.id).join(",")
// //     )
// //     }
//  },[selectedLocation])
console.log(selectedLocation);
useEffect(() => {
  console.log(localFilters);
  
  fetchUrlLocation();
}, [localFilters]);

const applyHandlerClicked=()=>{
  // setIsApply(true);
  applyHandler();
}
useEffect(()=>{
  if(applyHandlerCalled){
    // setLocalFilter("viewBound",)
    applyHandler();
    setApplyHandlerCalled(false);
  }
},[applyHandlerCalled])
  
  return (
   <>
          {/* <div className="flex items-center truncate">
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
          </div> */}
          {/* <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          /> */}
        <div className="flex justify-between items-center p-4 py-2 border-b h-[41px]">
          <span className="font-medium">Location</span>
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
                setApplyHandlerCalled={setApplyHandlerCalled}
                type="LocationId"
                multiple
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
            </TabsContent>
            <TabsContent value="center" className="p-4 space-y-4">
              <AutocompleteInput
              setApplyHandlerCalled={setApplyHandlerCalled}
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
                    onChange={(e) => {
                      setSelectedLocation?.((prev) =>
                        prev
                          ? {
                              ...prev,
                              radius: Number(e.target.value),
                            }
                          : null
                      );
                      setIsApply(true);
                    }}
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
                    onChange={(e) => {
                      setSelectedLocation?.((prev) =>
                        prev
                          ? {
                              ...prev,
                              lat: Number(e.target.value),
                            }
                          : null
                      );
                      setIsApply(true);
                    }}
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
                    onChange={(e) => {
                      setSelectedLocation?.((prev) =>
                        prev
                          ? {
                              ...prev,
                              lng: Number(e.target.value),
                            }
                          : null
                      );
                      setIsApply(true);
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end">
              <Button
            variant="link"
            className="text-primary pr-0"
            onClick={applyHandlerClicked}
          > 
           Apply
          </Button>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
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
        )}
     </>
  );
}
