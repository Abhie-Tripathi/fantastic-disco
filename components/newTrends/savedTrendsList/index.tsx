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
import _ from "lodash";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseBusiness,
  Calendar,
  Edit,
  EllipsisVerticalIcon,
  MapPin,
  Trash,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  const viewBoundDetail: ViewBound =
    (viewBound as unknown as ViewBound) || undefined;
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
    const viewBound = geoCoordinate ? JSON.parse(geoCoordinate) : undefined;
    const BaseFilterValue: BaseFilterValue = {
      groupBy: "date",
      dateView: "day",
      active_gte: active_gte || "",
      active_lte: active_lte || "",
    };
    const extractCoordinates = data.filterValues.viewBound
      ? (data.filterValues.viewBound as unknown as ViewBound).coordinates
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
      ...((viewBound && FilterValue.viewBound && FilterValue.viewBound) || ""),
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
      ...(data.filterValues.viewBound && {
        viewBound: data.filterValues.viewBound,
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
        : _.isEqual(
            normalizedParamsData.viewBound,
            normalizedPropsData.viewBound
          )) &&
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

    if (locationIds) {
      deleteMultipleLocalFilters(["viewBound"]);
    }

    if (viewBound) {
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
        ? { locationIds: Object.keys(locationIds).join(",") }
        : viewBound
        ? { viewBound: JSON.stringify(viewBound) }
        : { locationIds: "" }),
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
      className={`flex justify-between h-36 gap-3 pl-4 pr-2 py-3 border rounded-lg w-72 bg-white cursor-pointer transition-all duration-200 ${
        isActiveCard
          ? "border-primary shadow-md ring-1 ring-primary/20"
          : "border-[var(--neutral-light-color)] hover:shadow-sm hover:border-gray-300"
      } ${
        activeCard !== id && editTrend === true
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : ""
      }`}
    >
      <div
        className="flex flex-col gap-2 w-full"
        onClick={
          activeCard !== id && editTrend === true
            ? () => {}
            : () => applyFilterOnTrend(data)
        }
      >
        <div className="flex justify-between items-center">
          <p className="font-medium text-base truncate">{name}</p>
        </div>
        <div className="flex flex-col gap-2">
          {displayName && (
            <p className="text-gray-600 flex items-center gap-1.5 font-medium text-xs">
              <MapPin width={12} height={12} className="text-gray-500" />
              <Badge variant="outline" className="bg-gray-50/50">
                {displayName}
              </Badge>
              {locationCount > 0 && (
                <span className="text-gray-500">+{locationCount}</span>
              )}
            </p>
          )}
          <p className="text-gray-600 flex items-center gap-1.5 font-medium text-xs">
            <Calendar width={12} height={12} className="text-gray-500" />
            <Badge variant="outline" className="bg-gray-50/50">
              {renderFormattedDates(startDate, endDate)}
            </Badge>
          </p>
          {savedTrendEventTypes.length > 0 && (
            <p className="text-gray-600 flex items-center gap-1.5 font-medium text-xs">
              <BriefcaseBusiness
                width={12}
                height={12}
                className="text-gray-500"
              />
              {savedTrendEventTypes.length > 0 && (
                <Badge variant="outline" className="bg-gray-50/50">
                  {savedTrendEventTypes[0]}
                </Badge>
              )}
              {eventTypeCount > 0 && (
                <span className="text-gray-500">+{eventTypeCount}</span>
              )}
            </p>
          )}
        </div>
      </div>

      <DropdownMenu onOpenChange={() => setOpen(!open)} open={open}>
        <DropdownMenuTrigger
          onClick={() => setOpen(!open)}
          className="self-start p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <EllipsisVerticalIcon
            width={14}
            height={14}
            className="text-gray-500"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2 z-50 min-w-[120px] shadow-md rounded-md border border-gray-200">
          <div className="flex flex-col gap-1.5" id={"Savedtrendid"}>
            {activeCard === id && editTrend === true ? (
              <div
                className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => handleEditSavedTrend(data, "cancel")}
              >
                <X width={12} height={12} className="text-gray-600" />
                <span className="text-xs text-gray-700">Cancel</span>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => handleEditSavedTrend(data, "edit")}
              >
                <Edit width={12} height={12} className="text-gray-600" />
                <span className="text-xs text-gray-700">Edit</span>
              </div>
            )}
            <div
              className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-red-50 rounded-md transition-colors"
              onClick={() => handleDeleteSavedTrend(id)}
            >
              <Trash width={12} height={12} className="text-red-500" />
              <span className="text-xs text-red-500">Delete</span>
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
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
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
      <div className="custom-prev-ranking flex justify-center items-center absolute -left-9 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white hover:bg-gray-100 rounded-full w-7 h-7 shadow-sm transition-colors">
        <ArrowLeftIcon className="w-4 h-4 text-gray-600" />
      </div>
      <div className="custom-next-ranking flex justify-center items-center absolute -right-9 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white hover:bg-gray-100 rounded-full w-7 h-7 shadow-sm transition-colors">
        <ArrowRightIcon className="w-4 h-4 text-gray-600" />
      </div>
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.2s ease;
        }
        .swiper-pagination-bullet-active {
          background: var(--primary-color);
          width: 16px;
          border-radius: 3px;
        }
      `}</style>
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
    <SwiperCarousel
      initialSlideIndex={initialSlideIndex}
      activeCard={activeCard}
      queryParams={queryParams}
      savedTrendsList={savedTrendsList}
    />
  );
};
export default SavedTrendsList;
