"use client";

import { useState, useEffect, use } from "react";
import { PlusCircle, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface GeoLocation {
  locationType: "GeoJSON";
  lat: number;
  lng: number;
  radius: number | null;
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
  filterName?: string;
  isMandatory?: boolean;
}

interface FlexibleComponentProps {
  variant?: "accordion" | "popover";
}

export default function LocationSelector({
  type,
  isMandatory,
  filterName,
  variant = "accordion",
}: LocationProps & FlexibleComponentProps) {
  const pathName = usePathname();
  const { localFilters } = useFilterContext();
  const { saveLastSearchedLocation, clearLastSearchedLocation } =
    sessionService();
  const { getLocationName, getLocationDetails } = useLocationService();
  const [activeTab, setActiveTab] = useState("city");
  const [isOpen, setIsOpen] = useState(false);
  const [radiusUnit, setRadiusUnit] = useState<string>("km");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>();
  const { replaceLocalFilter, deleteMultipleLocalFilters } = useFilterContext();

  const renderTriggerContent = (
    content: React.ReactNode,
    isOpen?: boolean,
    variant?: string
  ) => (
    <div className="flex items-center justify-between w-full">
      {content}
      {variant === "popover" && (
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      )}
    </div>
  );

  const fetchUrlLocation = async () => {
    const geoCoordinate = localFilters?.viewBound
      ? JSON.parse(localFilters.viewBound)
      : null;
    const locationIds = localFilters?.locationIds?.length
      ? localFilters.locationIds.split(",")
      : null;

    if (geoCoordinate) {
      const locationName = await getLocationName(
        geoCoordinate.coordinates.latitude,
        geoCoordinate.coordinates.longitude
      );
      
      
      setSelectedLocation?.({
        locationType: "GeoJSON",
        lat: geoCoordinate.coordinates.latitude,
        lng: geoCoordinate.coordinates.longitude,
        radius: geoCoordinate.coordinates.radius,
        description: geoCoordinate?.properties?.name || locationName,
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
  }, [localFilters]);

  // Add new useEffect for trends page default location
  useEffect(() => {
    if (pathName === "/internal" && !localFilters.locationIds) {
      replaceLocalFilter(
        "viewBound",
        "locationIds",
        "5dc0b154-e2d8-5160-9bd6-dd8175a58c47"
      );
    }
  }, [pathName]);

  // Add cleanup effect
  useEffect(() => {
    return () => {
      if (pathName === "/internal" || pathName === "/internal/search") {
        replaceLocalFilter("viewBound", "locationIds", "");
      }
    };
  }, [pathName]);

  const labels: Record<string, string> = {
    companyLocationIds: "Company Location",
    eventLocationIds: "Event Location",
  };

  const handleLocationChange = () => {
    if (selectedLocation && !Array.isArray(selectedLocation)) {
      const geoLocation = selectedLocation as GeoLocation;
      const radiusInKm =
        radiusUnit === "mi" ? (geoLocation.radius || 5) * 1.60934 : geoLocation.radius;

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
    } else if (
      selectedLocation &&
      Array.isArray(selectedLocation) &&
      selectedLocation.length > 0
    ) {
      replaceLocalFilter(
        "viewBound",
        "locationIds",
        (selectedLocation as LocationItem[]).map((loc) => loc.id).join(",")
      );
      saveLastSearchedLocation(selectedLocation);
    } else {
      deleteMultipleLocalFilters(["locationIds", "viewBound"]);
      clearLastSearchedLocation();
    }
  };

  const triggerContent = (
    <div className="flex items-center truncate">
      <span className="mr-2">
        {labels[filterName as keyof typeof labels] || "location"}
      </span>
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
  );

  const content = (
    <div className="p-4">
      {isEventeli ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="city">City, State, Country</TabsTrigger>
            <TabsTrigger value="center">Center Point & Radius</TabsTrigger>
          </TabsList>
          <TabsContent value="city" className="pt-4">
            <AutocompleteInput
              multiple
              type="LocationId"
              placeholder="E.g. Bengaluru, Karnataka"
              onSelect={(loc) => {
                setSelectedLocation(loc);
                handleLocationChange();
              }}
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
          <TabsContent value="center" className="pt-4 space-y-4">
            <AutocompleteInput
              type="GeoCoordinate"
              placeholder="E.g. Novotel, Hyderabad"
              onSelect={(loc) => {
                setSelectedLocation(loc);
                handleLocationChange();
              }}
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
          placeholder="E.g. Bengaluru, Karnataka"
          onSelect={(loc) => {
            setSelectedLocation(loc);
            handleLocationChange();
          }}
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
    </div>
  );

  if (variant === "popover") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={`w-full justify-between px-3 py-5 text-base font-normal ${
              (selectedLocation === undefined ||
                (Array.isArray(selectedLocation) &&
                  selectedLocation?.length === 0)) &&
              isMandatory
                ? "text-destructive"
                : ""
            }`}
          >
            {renderTriggerContent(triggerContent, isOpen, variant)}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="location" className="border rounded-md">
        <AccordionTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "no-underline border-none justify-between px-3 py-5 text-base font-normal"
          )}
        >
          {renderTriggerContent(triggerContent)}
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
