import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToastAction } from "@/components/ui/toast";
import { useFilterContext } from "@/context/filterContext";
import { useToast } from "@/hooks/use-toast";
import { useFilterState } from "@/hooks/useFilterState";
import { sessionService } from "@/services/sessionService";
import { useTrendsService } from "@/services/trendsService";
import {
  BaseFilterValue,
  CreateFilterValue,
  GetSaveTrendData,
  TrackerData,
  ViewBound,
} from "@/types";
import { renderFormattedDates } from "@/utils/dateFormat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseBusiness,
  Calendar,
  Edit,
  EllipsisVerticalIcon,
  MapPin,
  Trash,
  X
} from "lucide-react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const SavedTrendCard = ({
  activeCard,
  data,
  queryParams,
}: {
  activeCard: string;
  data: TrackerData;
  queryParams: ReadonlyURLSearchParams;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { name, filterValues, id } = data;
  const [open, setOpen] = useState<boolean>(false);
  const { searchParams } = useFilterState();
  const editTrend = Boolean(queryParams.get("editTrend") || "");
  const {
    applyFilters,
    setMultipleLocalFilters,
    deleteMultipleLocalFilters,
    setLocalFilter,
  } = useFilterContext();
  const { deleteSavedTrend } = useTrendsService();
  const { getLastSearchedLocation } = sessionService();
  const { locationIds, viewBound, active_gte, active_lte, eventTypes } =
    filterValues;
  const locationDetail = locationIds && Object.values(locationIds);
  const viewBoundDetail: ViewBound = viewBound && JSON.parse(viewBound);
  const displayName =
    (locationDetail && locationDetail[0].name) ||
    (viewBoundDetail &&
      viewBoundDetail.properties &&
      viewBoundDetail.properties.name) ||
    "";
  const locationCount =
    locationDetail && locationDetail.length > 1 ? locationDetail.length - 1 : 0;
  const startDate = active_gte
    ? format(new Date(active_gte), "dd MMM yyyy")
    : "";

  const endDate = active_lte ? format(new Date(active_lte), "dd MMM yyyy") : "";
  const eventTypeCount =
    eventTypes && Object.keys(eventTypes).length > 1
      ? Object.keys(eventTypes).length - 1
      : 0;

  const savedTrendEventTypes =
    (eventTypes &&
      Object.keys(eventTypes).length &&
      Object.values(eventTypes).map((eventType) => eventType.name)) ||
    "";

  const isActiveCard = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const streetName = getLastSearchedLocation();
    if (!params) return;
    const activeCard = params.get("activeCard");
    const active_gte = params.get("active_gte");
    const active_lte = params.get("active_lte");
    const eventTypes = params.get("eventTypes");
    const columns = params.get("columns");
    const locationIds = params.get("locationIds");
    const geoCoordinate = params.get("viewBound");
    const viewBound = geoCoordinate
      ? JSON.stringify({
          ...(geoCoordinate && { coordinates: JSON.parse(geoCoordinate) }),
        })
      : undefined;
    const BaseFilterValue: BaseFilterValue = {
      groupBy: "date",
      dateView: "day",
      active_gte: active_gte || "",
      active_lte: active_lte || "",
    };
    const extractCoordinates = data.filterValues.viewBound
      ? (JSON.parse(data.filterValues.viewBound) as ViewBound).coordinates
      : null;
    const normalizedViewBound = extractCoordinates
      ? JSON.stringify({
          ...(extractCoordinates && {
            coordinates: extractCoordinates,
          }),
        })
      : undefined;
    const FilterValue: CreateFilterValue = {
      ...BaseFilterValue,
      eventTypes: eventTypes || "",
      columns: columns || "",
      ...(locationIds ? { locationIds } : geoCoordinate ? { viewBound } : {}),
    };
    const normalizedParamsData = {
      ...FilterValue,
      columns: FilterValue.columns ? FilterValue.columns.split(",").sort() : [],
      eventTypes: FilterValue.eventTypes
        ? FilterValue.eventTypes.split(",").sort()
        : [],
      ...(FilterValue.locationIds && { locationIds: FilterValue.locationIds }),
      ...(viewBound &&
        FilterValue.viewBound &&
        JSON.parse(FilterValue.viewBound || "")),
    };
    const normalizedPropsData = {
      ...data.filterValues,
      columns: (data.filterValues.columns || []).sort(),
      eventTypes: Object.values(data.filterValues.eventTypes || {})
        .map((type) => type.slug)
        .sort(),
      ...(locationIds && {
        locationIds: Object.keys(data.filterValues.locationIds || {}).join(","),
      }),
      ...(normalizedViewBound && {
        viewBound: normalizedViewBound,
      }),
    };

    const fieldsMatch =
      normalizedParamsData.active_gte === normalizedPropsData.active_gte &&
      normalizedParamsData.active_lte === normalizedPropsData.active_lte &&
      JSON.stringify(normalizedParamsData.eventTypes) ===
        JSON.stringify(normalizedPropsData.eventTypes) &&
      JSON.stringify(normalizedParamsData.columns) ===
        JSON.stringify(normalizedPropsData.columns) &&
      (normalizedParamsData.locationIds
        ? normalizedParamsData.locationIds === normalizedPropsData.locationIds
        : normalizedParamsData.viewBound === normalizedPropsData.viewBound) &&
      activeCard === data.id;
    return fieldsMatch;
  }, [queryParams]);

  const deleteSaveTrendMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteSavedTrend(id);
      deleteMultipleLocalFilters(["editTrend", "activeCardName"]);
      applyFilters();
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Trend Deleted !",
      });
      queryClient.invalidateQueries({ queryKey: ["getSavedTrends"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        description: "Failed to Delete Trend.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const applyFilterOnTrend = (data: TrackerData) => {
    const { filterValues, id } = data;
    const {
      active_gte,
      active_lte,
      columns,
      eventTypes,
      locationIds,
      viewBound,
    } = filterValues;

    const parsedViewBoundData: ViewBound | null = viewBound
      ? JSON.parse(viewBound)
      : null;
    const { coordinates } = parsedViewBoundData || {};

    const geoCoordinates =
      coordinates && Object.keys(coordinates).length > 0
        ? {
            ...(coordinates.latitude && { latitude: coordinates.latitude }),
            ...(coordinates.longitude && { longitude: coordinates.longitude }),
            ...(coordinates.radius && { radius: coordinates.radius }),
          }
        : null;

    if (locationIds) {
      deleteMultipleLocalFilters(["viewBound"]);
    }

    if (geoCoordinates) {
      deleteMultipleLocalFilters(["locationIds"]);
    }

    setMultipleLocalFilters({
      ...(active_gte ? { active_gte } : {}),
      ...(active_lte ? { active_lte } : {}),
      ...(columns && columns.length > 0 && { columns: columns.join(",") }),
      ...(eventTypes &&
        Object.keys(eventTypes).length > 0 && {
          eventTypes: Object.values(eventTypes)
            .map((eventType) => eventType.slug)
            .join(","),
        }),
      ...(locationIds && Object.keys(locationIds).length > 0
        ? {
            locationIds: Object.keys(locationIds)
              .map((location) => location)
              .join(","),
          }
        : geoCoordinates
        ? { geoCoordinates: JSON.stringify(geoCoordinates) }
        : {}),
      ...(id && { activeCard: id }),
    });
    applyFilters();
  };

  const handleDeleteSavedTrend = (id: string) => {
    deleteSaveTrendMutation.mutate(id);
    setOpen(false);
  };

  const handleEditSavedTrend = (data: TrackerData, mode: "edit" | "cancel") => {
    const { id, name } = data;
    if (mode === "edit") {
      setLocalFilter("activeCardName", name);
      setLocalFilter("activeCard", id);
      setLocalFilter("editTrend", "true");
      applyFilterOnTrend(data);
    } else {
      deleteMultipleLocalFilters(["editTrend", "activeCardName"]);
      applyFilters();
    }
    setOpen(false);
  };
  return (
    <li
      className={`flex justify-between h-36 gap-4 pl-6 pr-1 py-3 border rounded-sm w-72 bg-white cursor-pointer marker ${
        isActiveCard ? "border-primary" : "border-[var(--neutral-light-color)]"
      } hover:border-primary ${
        activeCard !== id && editTrend === true
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : ""
      }`}
    >
      <div
        className="flex flex-col gap-3"
        onClick={
          activeCard !== id && editTrend === true
            ? () => {}
            : () => applyFilterOnTrend(data)
        }
      >
        <div className="flex justify-between items-center">
          <p className="font-bold">{name}</p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-[#696B83] flex items-center gap-2 font-medium text-sm line-clamp-1">
            <MapPin width={14} height={14} color="#000000" />
            <span className="rounded-full border-primary bg-white text-primary font-medium">
              {displayName}
            </span>
            {locationCount > 0 && <span>+{locationCount}</span>}
          </p>
          <p className="text-[#696B83] flex items-center gap-2 font-medium text-sm line-clamp-1">
            <Calendar width={13} height={13} color="#000000" />
            <span className="rounded-full border-primary bg-white text-primary font-medium">
              {renderFormattedDates(startDate, endDate)}
            </span>
          </p>
          <p className="text-[#696B83] flex items-center gap-2 font-medium text-sm line-clamp-1">
            <BriefcaseBusiness width={13} height={13} color="#000000" />
            {savedTrendEventTypes.length > 0 && (
              <span className="rounded-full border-primary bg-white text-primary font-medium">
                {savedTrendEventTypes[0]}
              </span>
            )}
            {eventTypeCount > 0 && <span>+{eventTypeCount}</span>}
          </p>
        </div>
      </div>

      <DropdownMenu onOpenChange={() => setOpen(!open)} open={open}>
        <DropdownMenuTrigger
          onClick={() => setOpen(!open)}
          className="self-start"
        >
          <EllipsisVerticalIcon width={15} height={15} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2 z-50">
          <div className="flex flex-col gap-2" id={"Savedtrendid"}>
            {activeCard === id && editTrend === true ? (
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleEditSavedTrend(data, "cancel")}
              >
                <X width={14} height={14} />
                <span className="text-sm">Cancel</span>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleEditSavedTrend(data, "edit")}
              >
                <Edit width={14} height={14} />
                <span className="text-sm">Edit</span>
              </div>
            )}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleDeleteSavedTrend(id)}
            >
              <Trash width={14} height={14} />
              <span className="text-sm">Delete</span>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
};

const SwiperCarousel = ({
  initialSlideIndex,
  savedTrendsList,
  queryParams,
  activeCard,
}: {
  initialSlideIndex: number;
  savedTrendsList: GetSaveTrendData["trackers"];
  queryParams: ReadonlyURLSearchParams;
  activeCard: string;
}) => {
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (swiperRef.current && initialSlideIndex >= 0) {
      swiperRef.current.slideTo(initialSlideIndex, 200);
    }
  }, [initialSlideIndex]);
  return (
    <div className="relative">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full h-full"
        modules={[Pagination, Navigation]}
        initialSlide={0}
        grabCursor={true}
        slidesPerView="auto"
        spaceBetween={20}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        navigation={{
          nextEl: ".custom-next-ranking",
          prevEl: ".custom-prev-ranking",
        }}
      >
        {savedTrendsList.map((savedTrend) => (
          <SwiperSlide key={savedTrend.id} className="max-w-72 w-full">
            <SavedTrendCard
              activeCard={activeCard}
              data={savedTrend}
              queryParams={queryParams}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-prev-ranking flex justify-center items-center absolute -left-9 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-300 rounded-full w-7 h-7">
        <ArrowLeftIcon className="w-4 h-4" />
      </div>
      <div className="custom-next-ranking flex justify-center items-center absolute -right-9 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-300 rounded-full w-7 h-7">
        <ArrowRightIcon className="w-4 h-4" />
      </div>
    </div>
  );
};

const SavedTrendsList = ({
  savedTrendsList,
}: {
  savedTrendsList: GetSaveTrendData["trackers"];
}) => {
  const queryParams = useSearchParams();
  const activeCard = queryParams.get("activeCard") || "";
  const initialSlideIndex = savedTrendsList.findIndex(
    (trend) => trend.id === activeCard
  );
  return (
    <div className="flex flex-col gap-4 w-full bg-[#FAFAFA] p-6">
      <h1 className="font-medium">SAVED TRENDS</h1>
      <SwiperCarousel
        initialSlideIndex={initialSlideIndex}
        activeCard={activeCard}
        queryParams={queryParams}
        savedTrendsList={savedTrendsList}
      />
    </div>
  );
};
export default SavedTrendsList;
