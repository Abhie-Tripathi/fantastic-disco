"use client";

import AutocompleteInput from "@/components/search/AutocompleteInput";
import { LocationItem as LOCATION_ITEM } from "@/components/search/location";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToastAction } from "@/components/ui/toast";
import { isEventeli } from "@/config";
import { industryData } from "@/data/onboardingDropdownsData";
import { useToast } from "@/hooks/use-toast";
import { useEventsService } from "@/services/eventsService";
import { useLocationService } from "@/services/locationService";
import { sessionService } from "@/services/sessionService";
import { useTrackerServices } from "@/services/trackerServices";
import { EventCount } from "@/types/events";
import { EventQuery } from "@/types/events/dto/event-query.dto";
import { SaveLocationDTO } from "@/types/locations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endOfMonth, startOfMonth } from "date-fns";
import { Plus } from "lucide-react";
import Image from "next/image";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./locationForm.module.css";
import AddIcon from "/public/plus_radius.svg";
import RemoveIcon from "/public/remove.svg";

type GeoLocationType = "city" | "center" | "";
interface PinPointLocation {
  latitude: number;
  longitude: number;
}

export interface LocationItem {
  id: string;
  description: string | undefined;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  radius: number;
  description: string;
}

export type EventCountPartial = Pick<EventCount, "count">;

export type Location = GeoLocation | LocationItem[];

const getDefaultDates = (): { startDate: string; endDate: string } => {
  const currentDate = new Date();
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getUTCMonth();

  const startDate = new Date(
    Date.UTC(currentYear, currentMonth, 1, 0, 0, 0, 0)
  );
  const endDate = new Date(
    Date.UTC(currentYear, currentMonth + 3, 1, 0, 0, 0, 0)
  );
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

const getViewBoundString = (
  lat: number,
  long: number,
  radius: number
): string => {
  const viewBound = {
    boundType: "point",
    coordinates: {
      latitude: lat,
      longitude: long,
      radius: radius,
    },
  };
  return JSON.stringify(viewBound);
};

const radiusOption = {
  kilometers: "Kilometers",
  miles: "Miles",
};

const LocationForm = () => {
  const router = useRouter();
  const searchParamsOnboarding = useSearchParams();
  const [loading, setLoading] = React.useState(false);
  const queryClient = useQueryClient();
  const { createTracker } = useTrackerServices();
  const [currentCity, setCurrenCity] = React.useState<string>();
  const [locationType, setLocationType] = React.useState<GeoLocationType>("");
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState<PinPointLocation | undefined>();
  const [radius, setRadius] = React.useState<number>(2);
  const [radiusUnit, setRadiusUnit] = useState<string>("miles");
  const { saveLastSearchedLocation } = sessionService();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const { getEventsCount } = useEventsService();

  const { getLocationName, getDatabaseLocationAutocomplete } =
    useLocationService();

  const [searchParams, setSearchParams] = useState<string>();

  const defaultLocation: LocationItem = {
    id: "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef",
    description: "New York, United States",
  };

  const defaultGeoLocation: GeoLocation = useMemo(() => {
    return {
      lat: 40.7127281,
      lng: -74.0060152,
      radius: radius,
      description:
        "New York City Hall, 260, Broadway, Lower Manhattan, Manhattan, New York County, New York, 10000, United States",
    };
  }, [radius]);

  const defaultSavedLocationDTO = {
    name: defaultLocation.description,
    type: "T_CUSTOM",
    filterValues: {
      active_gte: getDefaultDates().startDate,
      active_lte: getDefaultDates().endDate,
      locationIds: defaultLocation.id,
    },
  };

  const { data: cityStateAndCountryData, isLoading: isCityLoading } = useQuery({
    queryKey: ["city", currentCity],
    queryFn: () => getDatabaseLocationAutocomplete(currentCity!),
    enabled: !!currentCity && !!locationType && locationType === "city",
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const { data: centrePointAndRadiusData, isLoading: isCenterLoading } =
    useQuery({
      queryKey: ["center", location],
      queryFn: () => getLocationName(location?.latitude!, location?.longitude!),
      enabled: !!location && !!locationType && locationType === "center",
      refetchOnWindowFocus: false,
      gcTime: 0,
      staleTime: 0,
    });

  const { data: eventCount } = useQuery({
    queryKey: ["mapEventCount", searchParams],
    queryFn: () => getEventsCount((searchParams as EventQuery) ?? ""),
    enabled: locationType === "center",
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const saveLocationMutation = useMutation({
    mutationFn: (values: any) => createTracker(values),
    onSuccess: () => {
      router.push(`internal/search/events?${searchParams}`);
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem saving your location",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  // useEffect(() => {
  //   if (eventCount) {
  //     if (Array.isArray(eventCount)) {
  //       const count = eventCount.length;
  //       console.log("EventCount array length:", count);
  //     } else if ("count" in eventCount) {
  //       const count = eventCount.count;
  //       if (count === 0) {
  //         console.log("count");
  //         setRadius((prev) => prev + 30);
  //       }
  //     }
  //   }
  // }, [eventCount]);

  useEffect(() => {
    if (
      !isCityLoading &&
      cityStateAndCountryData &&
      cityStateAndCountryData?.formattedLocations &&
      cityStateAndCountryData.formattedLocations.length > 0
    ) {
      setSelectedLocation([
        {
          id:
            cityStateAndCountryData.formattedLocations[0].id ||
            "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef",
          description:
            cityStateAndCountryData.formattedLocations[0].displayName ||
            "New York, United States",
        },
      ]);
    }
  }, [cityStateAndCountryData, isCityLoading]);

  useEffect(() => {
    if (
      centrePointAndRadiusData &&
      centrePointAndRadiusData !== "" &&
      !isCenterLoading
    ) {
      const updatedSelectedLocation = {
        lat: location?.latitude || 40.7127281,
        lng: location?.longitude || -74.0060152,
        radius: radius || 20,
        description: centrePointAndRadiusData || "New York, United States",
      };
      setSelectedLocation(updatedSelectedLocation);
    }
  }, [centrePointAndRadiusData, isCenterLoading, radius]);

  const getIpLocation = async () => {
    const response = await fetch("http://ip-api.com/json/?fields=61439");
    const data = await response.json();
    setCurrenCity(data.city);
  };

  useEffect(() => {
    const industrySlug = sessionStorage && sessionStorage.getItem("industry");
    const subIndustrySlug =
      sessionStorage && sessionStorage.getItem("subIndustry");
    const selectedIndustry = industryData.find(
      (industry) => industry.slug === industrySlug
    );
    const selectedType = subIndustrySlug
      ? selectedIndustry?.subIndustries?.find(
          (sub) => sub.slug === subIndustrySlug
        )
      : selectedIndustry && { ...selectedIndustry };
    if (selectedType) {
      const { radius, type, unit } = selectedType;
      setLocationType(type as GeoLocationType);
      setRadius(radius || 0);
      setRadiusUnit(unit || "");
    }
  }, [searchParamsOnboarding]);

  useEffect(() => {
    if ("geolocation" in navigator && locationType === "center") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ latitude: latitude, longitude: longitude });
        },
        (error) => {
          setLocation({ latitude: 40.7127281, longitude: -74.0060152 });
          setSelectedLocation([
            {
              id: "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef",
              description: "New York, United States",
            },
          ]);
          console.error("Error getting location:", error);
        }
      );
    } else {
      return;
    }
  }, [locationType]);

  const setDefaultParamsValue = (
    defaultLocation?: GeoLocation | LocationItem[]
  ) => {
    const locationToUse = defaultLocation;
    if (locationToUse) {
      const currentDate = new Date();
      const startDate = new Date(
        startOfMonth(currentDate).setHours(5, 30, 0, 0)
      ).toISOString();
      const endDate = new Date(
        endOfMonth(currentDate).setHours(5, 30, 0, 0)
      ).toISOString();
      const latitude = !Array.isArray(locationToUse) && locationToUse.lat;
      const longitude = !Array.isArray(locationToUse) && locationToUse.lng;
      const viewBound = {
        latitude: Number(latitude),
        longitude: Number(longitude),
        radius: Number(radiusUnit === "miles" ? radius * 1.60934 : radius),
      };
      const viewBoundString = encodeURIComponent(JSON.stringify(viewBound));
      const params = `status=active%2Ccancelled%2Cpostponed%2Cpredicted&eventTypes=community%2Cconcert%2Cperforming-arts%2Csport%2Cfestival%2Cworkshops%2Ctradeshows%2Cconferences&active_gte=${new Date(
        startDate
      ).toISOString()}&active_lte=${new Date(endDate).toISOString()}${
        locationType === "city"
          ? `&locationIds=${
              Array.isArray(locationToUse) &&
              locationToUse.length > 0 &&
              locationToUse.map((location) => location.id).join(",")
            }`
          : locationType === "center"
          ? `&geoCoordinates=${viewBoundString}`
          : ""
      }&view=map`;
      setSearchParams(params);
    }
  };

  const handleSubmit = () => {
    if (searchParams) {
      saveSelectionLocalStorage();
      saveOnboardingLocation();
    } else {
      handleSkip();
    }
  };

  const handleSkip = () => {
    if (locationType === "city") {
      setSelectedLocation([defaultLocation]);
      saveLastSearchedLocation([defaultLocation] as LOCATION_ITEM[]);
      defaultLocation && saveLocationMutation.mutate(defaultSavedLocationDTO);
      setDefaultParamsValue([defaultLocation]);
    } else {
      setLocation({ latitude: 40.7127281, longitude: -74.0060152 });
      saveLastSearchedLocation(defaultGeoLocation as any);
      saveOnboardingLocation(defaultGeoLocation);
      setDefaultParamsValue(defaultGeoLocation);
    }
  };

  const saveOnboardingLocation = (
    defaultLocation?: GeoLocation | LocationItem[]
  ) => {
    const locationToUse = defaultLocation || selectedLocation;
    if (locationToUse) {
      let savedLocationDTOData: SaveLocationDTO[] | [] | any = [];
      Array.isArray(locationToUse) && locationType === "city"
        ? (savedLocationDTOData = {
            name: "Custom Tracker",
            type: "T_CUSTOM",
            filterValues: {
              active_gte: getDefaultDates().startDate,
              active_lte: getDefaultDates().endDate,
              locationIds: locationToUse
                .map((location) => location.id)
                .join(","),
            },
          })
        : !Array.isArray(locationToUse) && locationType === "center"
        ? (savedLocationDTOData = {
            name: locationToUse.description || "",
            type: "T_CUSTOM",
            filterValues: {
              active_gte: getDefaultDates().startDate,
              active_lte: getDefaultDates().endDate,
              viewBound: getViewBoundString(
                locationToUse.lat,
                locationToUse.lng,
                Number(
                  radiusUnit === "miles"
                    ? locationToUse.radius * 1.60934
                    : locationToUse.radius
                )
              ),
            },
          })
        : null;
      savedLocationDTOData && saveLocationMutation.mutate(savedLocationDTOData);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      const currentDate = new Date();
      const startDate = new Date(
        startOfMonth(currentDate).setHours(5, 30, 0, 0)
      ).toISOString();
      const endDate = new Date(
        endOfMonth(currentDate).setHours(5, 30, 0, 0)
      ).toISOString();
      const latitude = !Array.isArray(selectedLocation) && selectedLocation.lat;
      const longitude =
        !Array.isArray(selectedLocation) && selectedLocation.lng;
      const viewBound = {
        latitude: Number(latitude),
        longitude: Number(longitude),
        radius: Number(radiusUnit === "miles" ? radius * 1.60934 : radius),
      };
      const viewBoundString = encodeURIComponent(JSON.stringify(viewBound));
      const params = `status=active%2Ccancelled%2Cpostponed%2Cpredicted&eventTypes=community%2Cconcert%2Cperforming-arts%2Csport%2Cfestival%2Cworkshops%2Ctradeshows%2Cconferences&active_gte=${new Date(
        startDate
      ).toISOString()}&active_lte=${new Date(endDate).toISOString()}${
        locationType === "city"
          ? `&locationIds=${
              Array.isArray(selectedLocation) &&
              selectedLocation.length > 0 &&
              selectedLocation.map((location) => location.id).join(",")
            }`
          : locationType === "center"
          ? `&geoCoordinates=${viewBoundString}`
          : ""
      }&view=map`;
      setSearchParams(params);
    }
  }, [selectedLocation, radius, radiusUnit]);

  const saveSelectionLocalStorage = () => {
    if (selectedLocation) {
      locationType === "center"
        ? saveLastSearchedLocation({ ...(selectedLocation as any) })
        : locationType === "city"
        ? saveLastSearchedLocation(selectedLocation as LOCATION_ITEM[])
        : null;
    }
  };

  if (!isEventeli) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <h3>Choose a location to get started !</h3>
      <section className="w-96">
        <div className={styles.tab_container}>
          <button className={locationType == "city" ? styles.active : ""}>
            {locationType === "city"
              ? "City, State, Country"
              : " Centre Point & Radius"}
          </button>
        </div>
        <div className={styles.line}></div>
        <AutocompleteInput
          type={locationType === "city" ? "LocationId" : "GeoCoordinate"}
          multiple={locationType === "city"}
          placeholder="E.g. Bengaluru, Karnataka, India"
          onSelect={setSelectedLocation}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          value={
            locationType === "center"
              ? selectedLocation && !Array.isArray(selectedLocation)
                ? {
                    id: Math.random().toString(),
                    description: (selectedLocation as GeoLocation).description,
                  }
                : null
              : locationType === "city"
              ? selectedLocation && Array.isArray(selectedLocation)
                ? selectedLocation.map((loc) => ({
                    id: loc.id,
                    description: loc.description || "",
                  }))
                : null
              : null
          }
        />
        {locationType == "center" && (
          <div className="mt-4">
            <label className={styles.radius_label}>Radius</label>
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center border rounded-md border-[#e0e1e4]">
                <button
                  onClick={() => setRadius(radius - 1)}
                  className="flex w-10 h-10 items-center justify-center"
                >
                  <Image src={RemoveIcon} alt="remove icon" />
                </button>
                <input
                  className="outline-none px-2 text-center text-inherit font-inherit w-24 border-l border-r border-[#e0e1e4] h-10"
                  value={radiusUnit === "miles" ? radius * 1.60934 : radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                />
                <button
                  onClick={() => setRadius(radius + 1)}
                  className="flex w-10 h-10 items-center justify-center"
                >
                  <Image src={AddIcon} alt="add icon" />
                </button>
              </div>
              <Select value={radiusUnit} onValueChange={setRadiusUnit}>
                <SelectTrigger className="w-[180px] h-10">
                  <SelectValue
                    placeholder={
                      radiusUnit &&
                      radiusOption[radiusUnit as keyof typeof radiusOption]
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="kilometers">Kilometres</SelectItem>
                    <SelectItem value="miles">Miles</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {locationType === "city" && (
          <p
            className="mt-4 flex items-center gap-2 cursor-pointer text-[#6750a4]"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="w-4 h-4" /> Add Multiple Location
          </p>
        )}
      </section>

      <Button
        type="submit"
        className="w-80 self-center"
        disabled={loading}
        // loading={loading}
        onClick={handleSubmit}
        // onSubmit={() => handleSubmit()}
      >
        View Location Insights
      </Button>

      <p className={styles.skip_button} onClick={handleSkip}>
        Skip for now
      </p>
    </div>
  );
};

export default LocationForm;
