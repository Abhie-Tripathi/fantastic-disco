import { GeoLocation } from "@/components/search/location";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useFilterContext } from "@/contexts/filterContext";
import { sessionService } from "@/services/sessionService";
import { useTrendsService } from "@/services/trendsService";
import {
  BaseFilterValue,
  CreateFilterValue,
  CreateSaveTrendData,
  EditSaveTrendData,
} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Error from "next/error";
import { ReadonlyURLSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const SaveTrendModal = ({
  searchParams,
  handleEditTrend,
  handleSaveTrend,
  isLoading,
}: {
  searchParams: ReadonlyURLSearchParams;
  handleEditTrend: (trackerName: string, id: string) => void;
  handleSaveTrend: (trackerName: string) => void;
  isLoading: boolean;
}) => {
  const [trackerName, setTrackerName] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const enableEdit = searchParams.get("editTrend");
  const activeCardId = searchParams.get("activeCard");
  const activeCardName = searchParams.get("activeCardName");
  const maxLength = 20;

  useEffect(() => {
    if (enableEdit && activeCardName) {
      setTrackerName(activeCardName);
    }
  }, [enableEdit, activeCardName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > maxLength) {
      setError(`Trend name should be less than ${maxLength} characters`);
      return;
    }
    setTrackerName(e.target.value);
    setError("");
  };

  const handleSave = () => {
    if (!trackerName.trim()) {
      setError("Trend name is required.");
      return;
    }

    if (enableEdit && activeCardId) {
      handleEditTrend(trackerName, activeCardId);
    } else {
      handleSaveTrend(trackerName);
    }

    setTrackerName("");
    setOpen(false);
  };

  const handleOpenChange = () => {
    if (!enableEdit) {
      setTrackerName("");
    }
    setOpen(!open);
    setError("");
  };
  return (
    <Dialog open={open} onOpenChange={() => handleOpenChange()}>
      <DialogTrigger asChild>
        <Button
          disabled={isLoading}
          variant="outline"
          className="flex-1 border-primary text-primary font-semibold"
        >
          Save
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="tracking-normal">Save Trend</DialogTitle>
        </DialogHeader>
        <div className="grid gap-1 py-4">
          <Input
            id="name"
            type="text"
            // maxLength={maxLength}
            placeholder="Save trends as..."
            value={trackerName}
            onChange={handleNameChange}
            aria-invalid={!!error}
            aria-describedby="name-error"
          />
          {error && (
            <p id="name-error" className="text-sm text-red-500 mt-1">
              {error}
            </p>
          )}
        </div>
        <DialogFooter className="flex !justify-center">
          <div className="flex self-center gap-3 w-2/5">
            <Button
              className="bg-primary w-full"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SaveTrend = ({
  searchParams,
  isLoading,
  setShowNotificationForm,
}: {
  searchParams: ReadonlyURLSearchParams;
  isLoading: boolean;
  setShowNotificationForm: Dispatch<SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const { getLastSearchedLocation } = sessionService();
  const queryClient = useQueryClient();
  const { setSaveTrend, editSavedTrend } = useTrendsService();
  const {
    localFilters,
    deleteMultipleLocalFilters,
    setLocalFilter,
    applyFilters,
  } = useFilterContext();

  const editSavedTrendMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditSaveTrendData }) =>
      editSavedTrend(id, data),
    onSuccess: (result, variables) => {
      deleteMultipleLocalFilters(["editTrend", "activeCardName"]);
      setLocalFilter("activeCard", variables.id);
      applyFilters();
      toast({
        variant: "default",
        title: "Trend Edited Successfully !",
      });
      queryClient.invalidateQueries({ queryKey: ["getSavedTrends"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        description: "Failed to edit the trend.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const saveTrendMutation = useMutation({
    mutationFn: async (data: CreateSaveTrendData) => {
      const response = await setSaveTrend(data);
      setLocalFilter("activeCard", (response as { id: string }).id);
      applyFilters();
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Trend Saved !",
      });
      queryClient.invalidateQueries({ queryKey: ["getSavedTrends"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        description:
          error.errors[0].message === "Invalid columns option"
            ? "All fields are mandatory"
            : "",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const handleSaveTrend = (trackerName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const streetName = getLastSearchedLocation();
    if (!params) return;
    const active_gte = params.get("active_gte");
    const active_lte = params.get("active_lte");
    const eventTypes = params.get("eventTypes");
    const columns = params.get("columns");
    const locationIds = params.get("locationIds");
    const geoCoordinate = params.get("geoCoordinates");
    const viewBound = geoCoordinate
      ? JSON.stringify({
          boundType: "point",
          ...(geoCoordinate && { coordinates: geoCoordinate }),
          ...(streetName && {
            properties: { name: (streetName as GeoLocation).description },
          }),
        })
      : undefined;
    const BaseFilterValue: BaseFilterValue = {
      groupBy: "date",
      dateView: "day",
      active_gte: active_gte || "",
      active_lte: active_lte || "",
    };
    const FilterValue: CreateFilterValue = {
      ...BaseFilterValue,
      eventTypes: eventTypes || "",
      columns: columns || "",
      ...(locationIds ? { locationIds } : geoCoordinate ? { viewBound } : {}),
    };
    const data: CreateSaveTrendData = {
      name: trackerName,
      filterValue: FilterValue,
      type: "TR_CUSTOM",
    };
    saveTrendMutation.mutate(data);
  };

  const handleEditTrend = (trackerName: string, id: string) => {
    const streetName = getLastSearchedLocation();
    const viewBound = localFilters.geoCoordinates
      ? JSON.stringify({
          boundType: "point",
          coordinates: localFilters.geoCoordinates,
          ...(streetName && {
            properties: { name: (streetName as GeoLocation).description },
          }),
        })
      : undefined;
    const BaseFilterValue: BaseFilterValue = {
      groupBy: "date",
      dateView: "day",
      active_gte: localFilters.active_gte || "",
      active_lte: localFilters.active_lte || "",
    };
    const FilterValue: CreateFilterValue = {
      ...BaseFilterValue,
      eventTypes: localFilters.eventTypes || "",
      columns: localFilters.columns || "",
      ...(localFilters.locationIds
        ? { locationIds: localFilters.locationIds }
        : localFilters.geoCoordinates
        ? { viewBound: viewBound }
        : {}),
    };
    const data: EditSaveTrendData = {
      name: trackerName,
      filterValue: FilterValue,
      type: "TR_CUSTOM",
      accessLevel: "ADMIN",
    };
    editSavedTrendMutation.mutate({ id: id, data: data });
  };
  return (
    <SaveTrendModal
      searchParams={searchParams}
      handleEditTrend={handleEditTrend}
      handleSaveTrend={handleSaveTrend}
      isLoading={saveTrendMutation.isPending || isLoading}
    />
  );
};

export default SaveTrend;
