import Table from "@/app/components/Table/EventTable";
import EventCalendar from "@/components/eventCalendar";
import Alerts from "@/components/search/alerts";
import EventCount from "@/components/search/eventCount";
import List from "@/components/search/list";
import SortDropdown from "@/components/search/sortDropdown";
import Loading from "@/components/ui/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isEventeli } from "@/config";
import { useFilterContext } from "@/context/filterContext";
import { useToast } from "@/hooks/use-toast";
import { useDefaultFilters } from "@/hooks/useDefaultFilters";
import { useFilterState } from "@/hooks/useFilterState";
import {
  CalendarIcon,
  Globe,
  ListIcon,
  TableIcon
} from "lucide-react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState
} from "react";
const Map = lazy(() => import("@/components/map"));

const Events = () => {
  const { getFilterValue, setFilter } = useFilterState();
  const { searchParams } = useDefaultFilters();
  const selectedView = getFilterValue("view") || "list";
  const { applyFilters, localFilters, clearLocalFilters, enabledFilters } =
    useFilterContext();
  const [view, setView] = useState<string>(searchParams.get("view") || "");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [trackerModalOpen, setTrackerModalOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const searchHandler = useCallback(() => {
    applyFilters({ resetPage: true });
  }, []);

  const onTabsChange = (value: string) => {
    setFilter("view", value);
  };

  const filtersCount = (function () {
    let count = 0;
    if (
      localFilters.onlyBranded === "true" ||
      localFilters.onlySeries === "true"
    )
      count++;
    if (localFilters.frequencies) count++;
    if (localFilters.includeKeywords || localFilters.excludeKeywords) count++;
    if (localFilters.maturity) count++;
    if (localFilters.estimatedVisitors) count++;
    if (localFilters.impact_score_gte) count++;
    if (localFilters.top) count++;
    return count;
  })();
  useEffect(() => {
    setView(searchParams.get("view") || "");
  }, [searchParams]);

  return (
    <div className="flex-1 relative">
      <div className={`px-6 transition-all duration-300`}>
        <Tabs
          defaultValue="list"
          value={selectedView}
          onValueChange={onTabsChange}
          className="mt-0"
        >
          <div
            className={`flex justify-between items-center sticky top-0 bg-background z-50 shadow-[0_1px_4px_-2px_rgba(21,34,50,0.078)] transition-padding duration-200 py-3 pt-4`}
          >
            <div className="flex items-center gap-2">
              <EventCount view="events" />
            </div>
            <div id="research-view" className="flex justify-center">
              <TabsList className="grid w-[500px] grid-cols-4 h-auto bg-muted/50 p-1 rounded-lg">
                <TabsTrigger
                  value="table"
                  className="flex items-center gap-2 py-2 px-4"
                >
                  <TableIcon className="h-4 w-4" />
                  <span>Table</span>
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="flex items-center gap-2 py-2 px-4"
                >
                  <ListIcon className="h-4 w-4" />
                  <span>List</span>
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="flex items-center gap-2 py-2 px-4"
                >
                  <Globe className="h-4 w-4" />
                  <span>Map</span>
                </TabsTrigger>
                <TabsTrigger
                  value="calendar"
                  className="flex items-center gap-2 py-2 px-4"
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span>Calendar</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <div id="sorting-dropdown" className="flex justify-end gap-2">
              {/* <Button
                variant="outline"
                className="flex items-center gap-2"
                disabled
              >
                <span className="flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" />
                  Export
                </span>
              </Button> */}
              {(selectedView === "list" ||
                selectedView === "table" ||
                selectedView == "") && <SortDropdown />}
            </div>
          </div>

          <TabsContent value="list" className="flex-grow overflow-hidden mt-0">
            {isEventeli && <Alerts />}
            <List />
          </TabsContent>
          <TabsContent value="table" className="flex-grow overflow-hidden">
            {isEventeli && <Alerts />}
            <Table />
          </TabsContent>
          <TabsContent value="map">
            <Map />
          </TabsContent>
          <TabsContent value="calendar">
            <Suspense fallback={<Loading />}>
              <EventCalendar />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
