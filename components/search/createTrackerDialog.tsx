"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BaseURL } from "@/config";
import { myFetch } from "@/utils/myFetch";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "@/app/(internal)/internal/search/events/search.module.css";
import { EventsAdapter } from "@/adapters/eventsAdapter";
import { useSearchParams } from "next/navigation";

interface CreateTrackerDialog {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export default function CreateTrackerDialog({
  open,
  onOpenChange,
}: CreateTrackerDialog) {
  const [trackerName, setTrackerName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const adaptedParams = EventsAdapter.adaptRequestParams(searchParams);

  const validateName = (name: string) => {
    if (name.trim().length === 0) {
      return "Tracker name cannot be empty";
    }
    if (name.length > 50) {
      return "Tracker name must be 50 characters or less";
    }
    return "";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setTrackerName(newName);
    setError(validateName(newName));
  };

  const saveTrackerHandler = async () => {
    const validationError = validateName(trackerName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    
    const userType = {
      ...(adaptedParams.shows?.includes("eventRating") && { rating: true }),
      ...(adaptedParams.shows?.includes("estimatedExhibitScore") && { exhibit: true }),
      ...(adaptedParams.shows?.includes("trustScore") && { trust: true }),
      ...(adaptedParams.shows?.includes("maturity") && { maturity: true }),
      ...(adaptedParams.shows?.includes("eventBrand") && adaptedParams.shows.includes("eventSeries") && {brandSeries: true}),
      ...(adaptedParams.shows?.includes("eventBrand") && {
        brandedEvent: true,
      }),
      ...(adaptedParams.shows?.includes("eventSeries") && { eventSeries: true }),
      ...(adaptedParams.shows?.includes("isforecasted") && {
        forecastedStatus: true,
      }),
      // ...(adaptedParams.shows.includes("eventImpactScore") && { impactScore: true }),
      // ...(adaptedParams.shows.includes("inboundScore") && {
      //   inboundScore: true,
      // }),
      ...(adaptedParams.shows?.includes("eventImpactScore") && adaptedParams.shows.includes("inboundScore") && adaptedParams.shows.includes("internationalScore") && {
        globalToggle: true,
      }),
      ...(adaptedParams.shows?.includes("eventRank") && { eventRank: true }),
      ...(adaptedParams.shows?.includes("audienceZone") && {
        audienceZone: true,
      }),
      ...(adaptedParams.shows?.includes("audienceSpread") && {
        audienceSpread: true,
      }),
      ...(adaptedParams.shows?.includes("eventFrequency") && {
        eventFrequency: true,
      }),
    };

    const formData = {
      name: trackerName,
      filterValue: {
        userType: JSON.stringify(userType),
        ...adaptedParams,
        ...{
          shows: [
            "eventBrand",
            "eventSeries",
            "maturity",
            "eventImpactScore",
            "inboundScore",
            "internationalScore",
            "isforecasted",
            "trustScore",
            "eventRating",
            "eventRanking",
            "estimatedExhibitScore",
            "audienceSpread",
            "eventFrequency",
          ].join(),
        },
      },
    };
    
    try {
      const { data, error } = await myFetch(`${BaseURL}/tracker`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (error) {
        throw new Error(error);
      }

      if (data) {
        toast.success(
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            Tracker created successfully!{" "}
            <span
              className={styles["seeTracker-btn"]}
              onClick={() => router.push("/internal/trackers")}
            >
              See Tracker
            </span>
          </div>,
          {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
          }
        );
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error saving tracker:", error);
      toast.error("Failed to create tracker. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="tracking-normal">Create Tracker</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Input
              id="name"
              placeholder="Enter Tracker Name"
              value={trackerName}
              onChange={handleNameChange}
              aria-invalid={error ? "true" : "false"}
              aria-describedby="name-error"
            />
            {error && (
              <p id="name-error" className="text-sm text-red-500 mt-1">
                {error}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#6E56CF] hover:bg-[#644fc0]"
            onClick={saveTrackerHandler}
            disabled={isLoading || !!error}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
