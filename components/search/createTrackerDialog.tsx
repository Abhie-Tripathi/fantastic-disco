"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/config";
import { useBulkAction } from "@/context/bulkAction";
import { useFilterContext } from "@/context/filterContext";
import { useToast } from "@/hooks/use-toast";
import { useFilterState } from "@/hooks/useFilterState";
import { useTrackerServices } from "@/services/trackerServices";
import { Tracker } from "@/types/trackers";
import { myFetch } from "@/utils/myFetch";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
interface CreateTrackerDialog {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  trackerType?: string;
  trackerPayloadFilterValues?: any;
}

export default function CreateTrackerDialog({
  open,
  onOpenChange,
  trackerType,
  trackerPayloadFilterValues,
}: CreateTrackerDialog) {
  const [trackerName, setTrackerName] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { localFilters, getLocalFilterValue } = useFilterContext();
  const { getFilterValue } = useFilterState();
  const { createTracker } = useTrackerServices();
  const { setIsBulkActionActive, setSelectedData } = useBulkAction();

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
  const showsData: string[] = [];
  const mapping = {
    rating: "rating",
    maturity: "maturity",
    branded: "branded,series",
    forecasted: "forecasted",
    frequency: "frequency",
    estimatedExhibitors: "estimatedExhibitors",
    scores: "scores",
    audienceZone: "audienceZone",
    rankings: "rankings",
  };
  const adaptedParams = searchParams;
  const filters = getLocalFilterValue("show").split(",");
  Object.entries(mapping).forEach(([key, value]) => {
    if (filters.includes(key)) {
      showsData.push(value);
    }
  });

  const saveTrackerHandler = async () => {
    const validationError = validateName(trackerName);
    if (validationError) {
      setError(validationError);
      return;
    }
    if ("groupBy" in adaptedParams) {
      delete adaptedParams.groupBy;
    }
    setIsLoading(true);

    const locationIds = getFilterValue("locationIds");
    const viewBound = getFilterValue("viewBound");
    const formData = {
      name: trackerName,
      filterValues: {
        ...(locationIds && { locationIds: locationIds }),
        ...(viewBound && { viewBound: viewBound }),
        status: localFilters.status,
        eventTypes: localFilters.eventTypes,
        active_gte: localFilters.active_gte,
        active_lte: localFilters.active_lte,
        categories: localFilters.categories,
        eventFormats: localFilters.eventFormats,
        entryType: localFilters.entryType,
        ratings: localFilters.ratings,
        onlyBranded: localFilters.onlyBranded,
        maturity: localFilters.maturity,
        onlySeries: localFilters.onlySeries,
        frequencies: localFilters.frequencies,
        includeKeywords: localFilters.includeKeywords,
        excludeKeywords: localFilters.excludeKeywords,
        estimatedVisitorRangeTag: localFilters.estimatedVisitorRangeTag,
        impact_score_gte: localFilters.impact_score_gte,
        impact_score_lte: localFilters.impact_score_lte,
        inbound_score_gte: localFilters.inbound_score_gte,
        inbound_score_lte: localFilters.inbound_score_lte,
        international_score_gte: localFilters.international_score_gte,
        international_score_lte: localFilters.international_score_lte,
        top: localFilters.top,
        designations: localFilters.designations,
        audienceSpread: localFilters.audienceSpread,
        ...(showsData.length > 0 && { show: showsData.join(",") }),
      },
      type: locationIds ? "T_CUSTOM" : "T_VENUE",
    };

    try {
      const { data, error } = await myFetch(`${BASE_URL}/trackers`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
        });
      }
      if (data) {
        toast({
          title: "Tracker created successfully!",
          action: (
            <Button
              variant="outline"
              onClick={() => router.push("/internal/trackers")}
            >
              See Tracker
            </Button>
          ),
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error saving tracker:", error);
      toast({
        title: "Error",
        description: "Failed to create tracker. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function handleCreateTracker() {
    setIsLoading(true);
    try {
      const payload: Tracker = {
        ...trackerPayloadFilterValues,
        name: trackerName,
        type:
          trackerType === "companies"
            ? "T_COMPETITOR"
            : trackerType === "people"
            ? "T_PEOPLE_FINDER"
            : "",
      };
      await createTracker(payload);
      toast({
        title: "Tracker created successfully!",
      });
      onOpenChange(false);
      setIsBulkActionActive(false);
      setSelectedData({});
    } catch (error) {
      console.log("Tracker creation failed: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create tracker. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleTrackerCreationByType() {
    if (trackerType === "people" || trackerType === "companies") {
      return handleCreateTracker();
    } else {
      return saveTrackerHandler();
    }
  }

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
            onClick={handleTrackerCreationByType}
            disabled={isLoading || !!error}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
