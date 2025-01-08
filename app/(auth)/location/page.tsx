"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { endOfMonth, startOfMonth } from "date-fns";
import AutocompleteInput from "@/components/search/AutocompleteInput";
import { newCategories } from "@/data/categories";
import "react-toastify/dist/ReactToastify.css";

export interface LocationItem {
  id: string;
  description: string | undefined;
}

const defaultLocation: LocationItem = {
  id: "e3ef02ad-2f97-5fa6-9033-9addfad3f0ef",
  description: "New York, United States",
};

export interface GeoLocation {
  lat: number;
  lng: number;
  radius: number;
  description: string;
}

export type Location = GeoLocation | LocationItem[];

const LocationForm = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<
    LocationItem[] | null
  >([]);

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
    const queryParams = `status=active,cancelled,postponed&view=map${
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

  const generateUrlParams = useCallback(
    (locations: LocationItem[]) => {
      const currentDate = new Date();
      const startDate = new Date(
        startOfMonth(currentDate).setHours(5, 30, 0, 0)
      ).toISOString();
      const endDate = new Date(
        endOfMonth(currentDate).setHours(5, 30, 0, 0)
      ).toISOString();
      const selectedCategories =
        searchParams.get("categories")?.split(",") || [];
      const categories = newCategories
        .filter((category) => selectedCategories.includes(category.id))
        .map((category) => category.slug);

      return `status=active,cancelled,postponed&view=map${
        categories.length > 0 ? `&categories=${categories.join(",")}` : ""
      }&active_gte=${startDate}&active_lte=${endDate}&locationIds=${locations
        .map((location) => location.id)
        .join(",")}`;
    },
    [searchParams]
  );

  const handleSubmit = useCallback(() => {
    setLoading(true);

    let locationsToSend: LocationItem[] = [];
    if (selectedLocation && selectedLocation.length > 0) {
      locationsToSend = selectedLocation;
    } else {
      setSelectedLocation([defaultLocation]);
      locationsToSend = [defaultLocation];
    }

    const urlParams = generateUrlParams(locationsToSend);
    router.push(`/internal/search/events?${urlParams}`);
    setLoading(false);
  }, [selectedLocation, generateUrlParams, router]);

  const handleSkip = useCallback(() => {
    setSelectedLocation([defaultLocation]);
    const urlParams = generateUrlParams([defaultLocation]);
    router.push(`/internal/search/events?${urlParams}`);
  }, [generateUrlParams, router]);

  return (
    <div className="flex flex-col gap-6 flex-1  w-full justify-center h-[80vh]">
      <h3 className="text-center">Choose a location to get started !</h3>
      <section className="w-96 self-center border border-[var(--input-border-color)] px-4 py-6 rounded-sm">
        <div className="flex items-center gap-5 bg-[var(--tabs-background-color)] rounded-md py-3 px-6">
          <button className="flex-1 bg-white border border-primary rounded-sm whitespace-nowrap py-2 px-4 min-w-44 text-[#424242] cursor-auto shadow-[2px_2px_4px_2px_#0000000f]">
            City, State, Country
          </button>
        </div>
        <div className="border-b border-[#e0e0e080] w-full my-5"></div>
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
      </section>
      <Button
        className="bg-[var(--primary-color)] border rounded-[var(--border-radius-sm)]
        text-white text-center p-2 w-80 self-center"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "Redirecting..." : "View Location Insights"}
      </Button>

      <Button
        variant={"link"}
        className="text-[var(--primary-color)] w-full"
        onClick={handleSkip}
      >
        Skip for now
      </Button>
    </div>
  );
};

export default LocationForm;
