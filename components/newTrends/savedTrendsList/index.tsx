import { Cross, Edit, EllipsisVerticalIcon, Trash, X } from "lucide-react";
import CILSearch from "/public/cil_search.svg";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CreateFilterValue,
  GetSaveTrendData,
  TrackerData,
  ViewBound,
  BaseFilterValue,
} from "@/types";
import { useTrendsService } from "@/services/trendsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useFilterState } from "@/hooks/useFilterState";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFilterContext } from "@/context/filterContext";
import { sessionService } from "@/services/sessionService";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { GeoLocation } from "@/components/search/location";

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
  const { name, filterValue, id } = data;
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
  const { locationIds, viewBound } = filterValue;
  const locationDetail = locationIds && Object.values(locationIds);
  const viewBoundDetail: ViewBound = viewBound && JSON.parse(viewBound);
  const displayName =
    (locationDetail && locationDetail[0].displayName) ||
    (viewBoundDetail &&
      viewBoundDetail.properties &&
      viewBoundDetail.properties.name) ||
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
    const geoCoordinate = params.get("geoCoordinates");
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
    const extractCoordinates = data.filterValue.viewBound
      ? (JSON.parse(data.filterValue.viewBound) as ViewBound).coordinates
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
      ...(viewBound && JSON.parse(FilterValue.viewBound || "")),
    };
    const normalizedPropsData = {
      ...data.filterValue,
      columns: (data.filterValue.columns || []).sort(),
      eventTypes: Object.values(data.filterValue.eventTypes || {})
        .map((type) => type.slug)
        .sort(),
      ...(locationIds && {
        locationIds: Object.keys(data.filterValue.locationIds || {}).join(","),
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
    const { filterValue, id } = data;
    const {
      active_gte,
      active_lte,
      columns,
      eventTypes,
      locationIds,
      viewBound,
    } = filterValue;

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
      deleteMultipleLocalFilters(["geoCoordinates"]);
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
      className={`flex justify-between h-28 gap-4 pl-6 pr-1 py-3 border rounded-sm w-60 bg-white cursor-pointer marker ${
        isActiveCard ? "border-primary" : "border-[var(--neutral-light-color)]"
      } hover:border-primary ${
        activeCard !== id && editTrend === true
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : ""
      }`}
    >
      <div
        className="flex flex-col gap-4"
        onClick={
          activeCard !== id && editTrend === true
            ? () => {}
            : () => applyFilterOnTrend(data)
        }
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Image src={CILSearch} width={15} height={15} alt="CIL Search" />
            <p className="text-sm text-primary font-bold">Analyse Trend</p>
          </div>
        </div>
        <div>
          <p className="font-bold">{name}</p>
          <span className="text-[#696B83] font-medium text-sm line-clamp-1">
            {displayName}
          </span>
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
  savedTrendsList: GetSaveTrendData["trackerData"];
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
          <SwiperSlide key={savedTrend.id} className="max-w-60 w-full">
            <SavedTrendCard
              activeCard={activeCard}
              data={savedTrend}
              queryParams={queryParams}
            />
          </SwiperSlide>
        ))}

        {/* <div className="custom-pagination flex justify-center mt-4"></div> */}
      </Swiper>
      <div className="custom-prev-ranking flex justify-center items-center absolute -left-9 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-300 rounded-full w-7 h-7">
        &#8592;
      </div>
      <div className="custom-next-ranking flex justify-center items-center absolute -right-9 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-300 rounded-full w-7 h-7">
        &#8594;
      </div>
    </div>
  );
};

const SavedTrendsList = ({
  savedTrendsList,
}: {
  savedTrendsList: GetSaveTrendData["trackerData"];
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
      {/* <ul className="flex gap-4 w-full overflow-x-auto scrollbar pb-4">
        {savedTrendsList.map((savedTrend) => (
          <SavedTrendCard
            activeCard={activeCard}
            key={savedTrend.id}
            data={savedTrend}
            queryParams={queryParams}
          />
        ))}
      </ul> */}
    </div>
  );
};
export default SavedTrendsList;
