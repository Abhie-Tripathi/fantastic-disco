"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BASE_URL } from "@/config";
import { useBulkAction } from "@/context/bulkAction";
import { useFilterContext } from "@/context/filterContext";
import { useToast } from "@/hooks/use-toast";
import { useFilterState } from "@/hooks/useFilterState";
import { useTrackerServices } from "@/services/trackerServices";
import { Tracker } from "@/types/trackers";
import { myFetch } from "@/utils/myFetch";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackerUrl, setTrackerUrl] = useState("");
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
        setTrackerUrl(`${window.location.origin}/internal/trackers/${data.id}`);
        setIsSuccess(true);
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
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(trackerUrl);
      toast({
        title: "Copied!",
        description: "Tracker URL copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
      });
    }
  };

  const resetDialog = () => {
    setIsSuccess(false);
    setTrackerName("");
    setError("");
    setTrackerUrl("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto p-4 sm:p-6">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="tracking-normal text-xl">
                Create Tracker
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Input
                  id="name"
                  placeholder="Enter Tracker Name"
                  value={trackerName}
                  onChange={handleNameChange}
                  className="w-full"
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
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#6E56CF] hover:bg-[#644fc0] w-full sm:w-auto"
                onClick={saveTrackerHandler}
                disabled={isLoading || !!error}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center space-y-5 py-2">
            <div>
              <div className="bg-green-50 rounded-full p-3 sm:p-4">
                <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-semibold text-green-900">
                Tracker Created Successfully!
              </h3>
            </div>

            <div className="w-full space-y-2">
              <Label className="text-sm font-medium text-left block">
                Tracker URL
              </Label>
              <div className="flex items-center gap-2 rounded-lg border bg-gray-50 p-2 sm:p-3 hover:bg-gray-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="break-all text-xs sm:text-sm font-mono text-gray-700 line-clamp-1">
                    {trackerUrl}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-white shrink-0 transition-colors"
                  title="Copy URL"
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="sr-only">Copy URL</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 w-full pt-2">
              <Button
                className="w-full bg-[#6E56CF] hover:bg-[#644fc0]"
                onClick={() => router.push("/internal/trackers")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Tracker
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOpenChange(false)}
              >
                Continue Search
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
