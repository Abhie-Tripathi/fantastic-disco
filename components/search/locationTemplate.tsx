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
  
  const pathName = usePathname();
  const { localFilters, setLocalFilter } = useFilterContext();
  const [isApply,setIsApply]=useState(false);
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
  const [validationErrors, setValidationErrors] = useState<{
    radius?: string;
    lat?: string;
    lng?: string;
  }>({});
  const { replaceLocalFilter, searchParams, deleteMultipleLocalFilters } =
    useFilterContext();
    const fetchUrlLocation = async () => {  
      
      const geoCoordinate = localFilters?.viewBound
        ? JSON.parse(localFilters.viewBound)
        : null;
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
       if (selectedLocation && !Array.isArray(selectedLocation)) {
         // Validate center point data first
         if (activeTab === "center") {
           if (!validateCenterPoint()) {
             return; // Don't proceed if validation fails
           }
           
           // Additional check for empty coordinates
           const geoLocation = selectedLocation as GeoLocation;
           if (geoLocation.lat === undefined || geoLocation.lng === undefined) {
             // Update validation errors for any missing coordinates
             const errors = {...validationErrors};
             if (geoLocation.lat === undefined) errors.lat = "Latitude is required";
             if (geoLocation.lng === undefined) errors.lng = "Longitude is required";
             setValidationErrors(errors);
             setIsMandatory(true);
             return; // Don't proceed with applying the filter
           }
           
           const radiusInKm =
             radiusUnit === "mi"
               ? (geoLocation.radius || 5) * 1.60934
               : geoLocation.radius;
   
           if (radiusUnit === "mi") {
             setRadiusUnit("km");
           }
           
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
         } else {
           // Non-center point case
           const geoLocation = selectedLocation as GeoLocation;
           const radiusInKm =
             radiusUnit === "mi"
               ? (geoLocation.radius || 5) * 1.60934
               : geoLocation.radius;
   
           if (radiusUnit === "mi") {
             setRadiusUnit("km");
           }
           
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
         }
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
useEffect(() => {
  fetchUrlLocation();
}, [localFilters]);

const applyHandlerClicked=()=>{
  applyHandler();
}
useEffect(()=>{
  if(applyHandlerCalled){
    applyHandler();
    setApplyHandlerCalled(false);
  }
},[applyHandlerCalled])
  


const handleRadiusChange = (value: string) => {
  const numValue = value === "" ? null : Number(value);
  setSelectedLocation?.((prev) =>
    prev
      ? {
          ...prev,
          radius: numValue,
        }
      : null
  );
  
  // Validate radius immediately
  let radiusError;
  if (numValue === null) {
    radiusError = "Radius is required";
  } else if (numValue <= 0) {
    radiusError = "Radius must be greater than 0";
  } else if (numValue > 50) {
    radiusError = "Radius cannot exceed 50";
  }
  
  setValidationErrors(prev => ({ ...prev, radius: radiusError }));
};
const validateCenterPoint = (): boolean => {
    const errors: { radius?: string; lat?: string; lng?: string } = {};
    const geo = selectedLocation as GeoLocation;
    
    if (!geo) return true;
    
    // Validate radius
    if (geo.radius === null) {
      errors.radius = "Radius is required";
    } else if (geo.radius <= 0) {
      errors.radius = "Radius must be greater than 0";
    } else if (geo.radius > 50) {
      errors.radius = "Radius cannot exceed 50";
    }
    
    // Validate latitude
    if (geo.lat === undefined) {
      errors.lat = "Latitude is required";
    } else if (geo.lat < -90 || geo.lat > 90) {
      errors.lat = "Latitude must be between -90 and 90";
    }
    
    // Validate longitude
    if (geo.lng === undefined) {
      errors.lng = "Longitude is required";
    } else if (geo.lng < -180 || geo.lng > 180) {
      errors.lng = "Longitude must be between -180 and 180";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
const handleLatChange = (value: string) => {
  // If value is empty, set to undefined rather than 0
  if (value === "") {
    setSelectedLocation?.((prev) =>
      prev
        ? {
            ...prev,
            lat: undefined,
          }
        : null
    );
    setValidationErrors(prev => ({ ...prev, lat: "Latitude is required" }));
    return;
  }
  
  const numValue = Number(value);
  setSelectedLocation?.((prev) =>
    prev
      ? {
          ...prev,
          lat: numValue,
        }
      : null
  );
  
  // Validate latitude immediately
  let latError;
  if (numValue < -90 || numValue > 90) {
    latError = "Latitude must be between -90 and 90";
  }
  
  setValidationErrors(prev => ({ ...prev, lat: latError }));
};

const handleLngChange = (value: string) => {
  // If value is empty, set to undefined rather than 0
  if (value === "") {
    setSelectedLocation?.((prev) =>
      prev
        ? {
            ...prev,
            lng: undefined,
          }
        : null
    );
    setValidationErrors(prev => ({ ...prev, lng: "Longitude is required" }));
    return;
  }
  
  const numValue = Number(value);
  setSelectedLocation?.((prev) =>
    prev
      ? {
          ...prev,
          lng: numValue,
        }
      : null
  );
  
  // Validate longitude immediately
  let lngError;
  if (numValue < -180 || numValue > 180) {
    lngError = "Longitude must be between -180 and 180";
  }
  
  setValidationErrors(prev => ({ ...prev, lng: lngError }));
};
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
                              className={`mt-1 ${validationErrors.radius ? "border-red-500" : ""}`}
                              value={(selectedLocation as GeoLocation)?.radius ?? ""}
                              onChange={(e) => handleRadiusChange(e.target.value)}
                            />
                            {validationErrors.radius && (
                              <p className="text-xs text-red-500 mt-1">{validationErrors.radius}</p>
                            )}
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
                    onChange={(e) => handleLatChange(e.target.value)}
                  />
                  {validationErrors.lat && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.lat}</p>
          )}
                </div>
                <div className="col-span-3">
                  <label htmlFor="longitude" className="text-sm font-medium">
                    Longitude
                  </label>
                  <Input
                    id="longitude"
                    type="number"
                              className={`mt-1 ${validationErrors.lng ? "border-red-500" : ""}`}
                              value={(selectedLocation as GeoLocation)?.lng ?? ""}
                              onChange={(e) => handleLngChange(e.target.value)}
                            />
                            {validationErrors.lng && (
                              <p className="text-xs text-red-500 mt-1">{validationErrors.lng}</p>
                            )}
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
