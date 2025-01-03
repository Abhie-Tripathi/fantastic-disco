"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./locationForm.module.css";
import HeroLogoText from "/public/heroLogoText.svg";
import SearchIcon from "/public/search.svg";
import Image from "next/image";
import {
  ComboBox,
  Input,
  Key,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  Selection,
  Switch,
} from "react-aria-components";
import { Button } from "@/components/ui/button";
// import SubmitButton from "@/components/onboarding/Button";
import DropdownIcon from "/public/Dropdown_Arrow.svg";
import RemoveIcon from "/public/remove.svg";
import AddIcon from "/public/plus_radius.svg";
import { useRouter, useSearchParams } from "next/navigation";
import SwitchButton from "@/components/ui/SwitchButton";
import { myFetch } from "@/utils/myFetch";
// import { EventCount, OnboardingSelection, SaveLocationDTO } from "@/types";
import { Plus } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endOfMonth, startOfMonth } from "date-fns";
import AutocompleteInput from "@/components/search/AutocompleteInput";
import { useLocationService } from "@/services/locationService";
import { useEventsService } from "@/services/eventsService";
// import { industryData, eventStatus, eventType } from "@/data/index";
// import { sessionService } from "@/services/sessionService";
import LocationSelector, {
  GeoLocation as GEO_LOCATION,
  LocationItem as LOCATION_ITEM,
} from "@/components/search/location";
import { VerificationProps } from "@/types/onboarding";
import { URLSearchParams } from "url";
import { categories, newCategories } from "@/data/categories";
import { useAuthContext } from "@/context";
import logo from "/public/croppedlogo.png";
import whr from "/public/whrai.svg";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

type GeoLocationType = "city" | "center" | "";
interface PinPointLocation {
  latitude: number;
  longitude: number;
}
type GeoLocationRadiusUnit = "miles" | "kilometers";

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

export type Location = GeoLocation | LocationItem[];

const LocationForm = () => {
  //   const { saveLocation } = useLocationService();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = React.useState(false);
  const [currentCity, setCurrenCity] = React.useState<string>();
  const [locationType, setLocationType] = React.useState<GeoLocationType>("");
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState<PinPointLocation | undefined>();
  const [radius, setRadius] = React.useState<number>(2);
  const [radiusUnit, setRadiusUnit] = React.useState<Key>("miles");
  const router = useRouter();
  //   const { saveLastSearchedLocation } = sessionService();
  const [selectedLocation, setSelectedLocation] = useState<
    LocationItem[] | null
  >([]);
  const { getEventsCount } = useEventsService();
  const user = localStorage.getItem("user");

  const urlParams = useMemo(() => {
    const currentDate = new Date();
    const startDate = new Date(
      startOfMonth(currentDate).setHours(5, 30, 0, 0)
    ).toISOString();
    const endDate = new Date(
      endOfMonth(currentDate).setHours(5, 30, 0, 0)
    ).toISOString();
    const selectedCategories =
      searchParams && searchParams.get("categories")?.split(",");
    const categories =
      selectedCategories &&
      newCategories
        .filter((category) => selectedCategories.includes(category.id))
        .map((category) => category.slug);
    const queryParams = `status=active,cancelled,postponed&view=map&groupBy=state${
      categories && categories.length > 0
        ? `&categories=${categories.join(",")}`
        : ""
    }&active_gte=${startDate}&active_lte=${endDate}&locationIds=${
      selectedLocation && selectedLocation.length > 0
        ? selectedLocation.map((location) => location.id).join(",")
        : "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef"
    }`;

    return queryParams;
  }, [selectedLocation]);

  const setDefaultParamsValue = (searchParams: string) => {
    let params = new URLSearchParams(searchParams);
    const locationIds = "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef";
    params.set("locationIds", locationIds);
    const updatedParams = params.toString();
    return updatedParams;
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (selectedLocation && selectedLocation.length === 0) {
      setSelectedLocation([
        {
          id: "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef",
          description: "New York, United States",
        },
      ]);
    }
    router.push(`/internal/search/events?${urlParams}`);
    setLoading(false);
  };

  // useEffect(() => {
  //   if (selectedLocation) {
  //     const currentDate = new Date();
  //     const startDate = new Date(
  //       startOfMonth(currentDate).setHours(5, 30, 0, 0)
  //     ).toISOString();
  //     const endDate = new Date(
  //       endOfMonth(currentDate).setHours(5, 30, 0, 0)
  //     ).toISOString();
  //     const params = `status=active%2Ccancelled%2Cpostponed%2Cpredicted&eventTypes=community%2Cconcert%2Cperforming-arts%2Csport%2Cfestival%2Cworkshops%2Ctradeshows%2Cconferences&active_gte=${new Date(
  //       startDate
  //     ).toISOString()}&active_lte=${new Date(
  //       endDate
  //     ).toISOString()}${`&locationIds=${
  //       Array.isArray(selectedLocation) &&
  //       selectedLocation.length > 0 &&
  //       selectedLocation.map((location) => location.id).join(",")
  //     }`}&view=map`;
  //     setSearchParams(params);
  //   }
  // }, [selectedLocation, radius, radiusUnit]);

  return (
    <>
      {/* <Image src={HeroLogoText} alt="herologotext" /> */}
      <div className="flex flex-col gap-6 flex-1 w-auto max-w-sm">
        <div className="text-[#242424] font-medium text-2xl flex items-center justify-center text-center">
          <Image src={logo} alt="logo" width={45} height={55} />
          <Image src={whr} alt="whr" />
        </div>
        <h3 className="text-center">Choose a location to get started !</h3>
        <section className="w-96 self-center border border-[var(--input-border-color)] px-4 py-6 rounded-sm">
          <div className="flex items-center gap-5 bg-[var(--tabs-background-color)] rounded-md py-3 px-6">
            <button className="flex-1 bg-white border border-primary rounded-sm whitespace-nowrap py-2 px-4 min-w-44 text-[#424242] cursor-auto shadow-[2px_2px_4px_2px_#0000000f]">
              City, State, Country
            </button>
          </div>
          <div className="border-b border-[#e0e0e080] w-full my-5"></div>
          {/* <AutocompleteInput
          type={"LocationId"}
          multiple={true}
          placeholder="E.g. Bengaluru, Karnataka, India"
          onSelect={setSelectedLocation}
          //   isOpen={isOpen}
          //   setIsOpen={setIsOpen}
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
        /> */}
          <AutocompleteInput
            multiple
            type="LocationId"
            placeholder="E.g. Bengaluru, Karnataka, India"
            onSelect={setSelectedLocation}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            value={
              selectedLocation && Array.isArray(selectedLocation)
                ? selectedLocation.map((loc) => ({
                    id: loc.id,
                    description: loc.description || "",
                  }))
                : null
            }
          />

          <p
            className="text-sm mt-4 flex items-center gap-2 cursor-pointer text-primary"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="w-4 h-4" /> Add Multiple Location
          </p>

          {useCurrentLocation && (
            <div className={styles.currentLocation}>
              <h4>{currentCity}</h4>
              <p>{`${currentCity}, ${currentCity} (2 mi Radius)`}</p>
            </div>
          )}
        </section>

        <Button
          className="w-3/4 bg-[var(--primary-color)] border rounded-[var(--border-radius-sm)]
        text-white text-center p-2 self-center"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Redirecting..." : "View Location Insights"}
        </Button>

        <Button
          variant={"link"}
          className="text-[var(--primary-color)] w-full"
          onClick={() => {
            setSelectedLocation([
              {
                id: "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef",
                description: "New York, United States",
              },
            ]);
            router.push(`/internal/search/events?${urlParams.toString()}`);
          }}
        >
          Skip for now
        </Button>
      </div>
    </>
  );
};

export default LocationForm;
