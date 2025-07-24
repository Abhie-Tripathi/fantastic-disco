"use client"
import TableView from "@/app/components/Table/EventTable";
import { PresetData } from '@/types/trackers';
import NotFound from '@/app/not-found';
import { Event } from "@/types/events";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NullState from "@/app/components/trackers/nullState";
import { useToast } from "@/hooks/use-toast";
import styles from "@/app/(internal)/internal/trackers/[trackerId]/trackedEvents/trackedEvents.style.module.css";
import TrackerNullState from "@/public/trackerNullState.svg";
import { Button } from "@/components/ui/button";
import List from "@/components/search/list";
import Loading from "@/components/ui/Loading";
import { useTrackerServices } from '@/services/trackerServices';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import SideNav from "@/app/components/trackers/sideNav";
import { isEventeli } from "@/config";
import { useFilterState } from "@/hooks/useFilterState";
import Link from "next/link";
import {
  Badge, ListIcon, NotebookPen, Share2, CalendarIcon,
  Globe,
  ArrowDownUp,
  ArrowDown,
  Save,
  Pencil,
  ArrowUpToLine,
} from "lucide-react";
import SortDropdown from "@/components/search/sortDropdown";
import BulkImport from "@/components/bulk-import";
import { PaginationComponent } from "@/components/pagination";
import { PublicEvents } from "@/types/trackers";
import { useAuthContext } from "@/context";
import ExportModal from "@/app/components/Search/ExportModal";
// import { cookies } from "next/headers";
interface EventsData {
  count: number;
  events: Event[];
}
export default function CollectionPage() {
  const params = useParams();
  const { setFilter } = useFilterState();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthContext();
  const typeOfEvent = searchParams.get("eventType");
  const [payload, setPayload] = useState();
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [eventsData, setEventsData] = useState<EventsData | null | undefined>(null);
  const [showExport, setShowExport] = useState(false);
  const collectionId = params.collectionId;
  const [active, setActive] = useState(typeOfEvent);
  const [totalEvents, setTotalEvents] = useState(0)
  const [eventCount, setEventCount] = useState<{ type: string; totalCount: number; newCount: number }[]>([]);
  const viewType = searchParams.get("view");
  
  const { getFilterValue, setMultipleFilters } =
    useFilterState();
  const [view, setView] = useState<string | null>(
    ["table", "list", "map", "calendar"].includes(viewType || "")
      ? viewType
      : "table"
  );
  useEffect(() => {
    // if(searchParams.get("view")===)
    setIsLoading(true);
    setView(searchParams.get("view"));
  }, [searchParams.get("view")]);
  const itemsPerPage = parseInt(getFilterValue("limit") || "10");
  const currentPage =
    Math.floor(parseInt(getFilterValue("offset") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(totalEvents / itemsPerPage);
  const { presetData, createTracker, publicEvents } = useTrackerServices();
  const [isLoading, setIsLoading] = useState(true);
  const [presetTemplateData, setPresetTemplateData] = useState<PresetData | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [eventError, setEventError] = useState();
  const fetchPresetJson = useCallback(async () => {
    // if (isLoading) return;

    setIsLoading(true);

    try {
      const data = {
        presetId: collectionId
      };

      const result = await presetData(data);

      if (result) {
        setPresetTemplateData(result?.trackers[0]);
      }
      else {
        return (
          <NotFound />
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError(true);
    } finally {
      // setIsLoading(false);
    }
  }, [presetData, isLoading]);
  useEffect(() => {
    fetchPresetJson();
  }, [])
  useEffect(() => {
    // setSavedEventCount(data?.tracker?.savedEventTotalCount);
    // console.log(data);
    const CountValues = {
      geo: ["social", "business", "unattended"],
      gtm: ["active", "past", "new"],
    };
    // createQueryString();
    if (isEventeli) {
      const transformedData = CountValues.geo.map((key) => {
        return {
          type: key.charAt(0).toUpperCase() + key.slice(1),
          totalCount: 10,
          newCount: 1,
        };
      });

      // transformedData.push({
      //   type: "Bookmarked",
      //   totalCount:  0,
      //   newCount: 0,
      // });

      setEventCount(transformedData);
    } else {
      // const groupedEventsCount =
      //   (data?.groupedEventsCount as Record<string, number>) || {};

      const transformedData = CountValues.gtm.map((key) => {
        return {
          type: key.charAt(0).toUpperCase() + key.slice(1),
          totalCount: 0,
          newCount: 0,
        };
      });

      // transformedData.push({
      //   type: "Bookmarked",
      //   totalCount: 0,
      //   newCount: 0,
      // });
      setEventCount(transformedData);
    }

  }, []);
  const addQueryString = (value: string) => {
    setFilter("eventType", value.toLowerCase());
  };
  const formatCount = (count: number) => {
    if (count >= 1000) {
      const value = count / 1000;
      const decimalPart = value - Math.floor(value);
      return `${Math.floor(value)}k`;
    }
    return count;
  };
  useEffect(() => {
    if (view !== "map" && view !== "calendar") {
      setEventError(undefined);
      setIsLoading(true);
      const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      const orgName: string[] = [];
      const orgWebsite: string[] = [];

      presetTemplateData?.data?.organizations?.forEach((item: string) => {
        const value = item?.trim();
        if (!value) return;

        if (regex.test(value)) {
          orgWebsite.push(value);
        } else {
          orgName.push(value);
        }
      });
      const formData: PublicEvents = {};

      // formData.name = presetTemplateData?.name;
      if (presetTemplateData) {

        if (presetTemplateData?.trackerType?.includes("T_COMPETITOR")) {
          formData.searchByEntity = "company";
        }
        if (presetTemplateData?.trackerType?.includes("T_PRODUCT_KEYWORDS")) {
          formData.searchByEntity = "keywords";
        }
        if (presetTemplateData?.trackerType?.includes("T_PEOPLE_FINDER")) {
          formData.searchByEntity = "user";
        }
        if (presetTemplateData?.trackerType?.includes("T_SPEAKING_OPPORTUNITY")) {
          formData.searchByEntity = "speaker"
        }
        formData.view = "list";
        formData.trackerEventStatus = active || "active";
        // Include conditional filter values
        if (presetTemplateData?.data?.includeKeywords?.length > 0) {
          const updatedPositiveKeywords = presetTemplateData.data.includeKeywords.map((item: string) => item.replaceAll(" ", "_"))
          formData.includeKeywords = updatedPositiveKeywords.slice(0, 100).join(",");
        }

        if (presetTemplateData?.data?.excludeKeywords?.length > 0) {
          const updatedNegativeKeywords = presetTemplateData.data.excludeKeywords.map((item: string) => item.replaceAll(" ", "_"))
          formData.excludeKeywords = updatedNegativeKeywords.slice(0, 100).join(",");
        }

        if (presetTemplateData?.data?.userName?.length > 0) {
          formData.userName = presetTemplateData.data.userName.slice(0, 100).join(",");
        }

        if (presetTemplateData?.data?.userOrgWebsite?.length > 0) {
          formData.userOrgWebsite = presetTemplateData.data.userOrgWebsite.slice(0, 100).join(",");
        }
        if (active === "past") {
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);

          const formatted = yesterday.toISOString().split('T')[0];
          formData.active_lte = formatted;
        }
        if (active === "active") {
          const today = new Date();
          const formatted = today.toISOString().split('T')[0];
          formData.active_gte = formatted;
        }
        if (active === "new") {
          const today = new Date();
          const formatted = today.toISOString().split('T')[0];
          formData.createdAt = formatted;
        }
        if (orgWebsite.length > 0) {
          formData.orgWebsite = orgWebsite.slice(0, 100).join(",");
        }
        if (orgName.length > 0) {
          formData.orgName = orgName.slice(0, 100).join(",");
        }
        formData.limit = searchParams.get("limit") || "10";
        formData.offset = searchParams.get("offset") || "0";
        // setPayload(formData);
        getData(formData);
      }
    }
  }, [presetTemplateData, searchParams])
  // useEffect(()=>{
  //     setIsLoading(true)
  //     getData(formData);
  // },[active, currentPage])
  const getData = async (formData: PublicEvents) => {
    try {
      const response: EventsData | undefined = await publicEvents(formData)
      //  if(response){
      //   setIsLoading(false);
      //  }
      setTotalEvents(response?.count || 0);
      setEventsData(response);
    } catch (error) {
      setEventError(error as any)
    } finally {
      setIsLoading(false)
    }


  }
  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    toast({
      title: "URL Copied",
      description: "Link copied to clipboard",
      duration: 2000,
    });
  };

  const onTabsChange = (tab: string) => {
    // if(tab==="map"){
    //     router.push(
    //   `/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`
    //   );

    // }
    setView(tab);
    setShowViewDropdown(false);
  };
  const exportModalHandler = () => {
    setShowExport(false);
  };
  return (
    <div className="flex flex-col gap-3 md:gap-6 w-full">
      <SideNav name={presetTemplateData?.name} isPublic={!user ? true : false} />

      <div className="px-0 md:px-8 flex flex-col gap-3 md:gap-6 -mt-5 md:mt-0">
        <div className="hidden md:flex bg-[var(--heading-background-color)] width-[100%] h-[65px] rounded-[12px] items-center justify-between px-[10px] py-[5px]">
          {/* <div className={styles.new}></div> */}
          <div className="flex gap-2">
            {eventCount?.map((item, index) => (
              <button
                key={index}
                className={`${styles.eventStatusBtn} h-10 ${item.type.toLowerCase() === active ? styles.active : ""
                  }`}
                onClick={() => {
                  // GAEvent("trackers", "Tracker Detail", "View", `${item.type} Events`);
                  // deleteFilter("skip")
                  setActive(item.type.toLowerCase());
                  addQueryString(item.type);
                }}
              >
                {item.type} Events
                {/* {
                        <div className={styles.circle}>
                          
                           { formatCount(item.totalCount)}
                          
                        </div>
                      } */}
              </button>
            ))}
          </div>
          <div className="flex gap-2" >
            <div>
              <Link
                href={
                  user
                    ? `/internal/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`
                    : `/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`
                }
                onClick={() => {
                  // GAEvent(
                  //   "trackers",
                  //   "Tracker Detail",
                  //   "View",
                  //   "Notes and Discussion"
                  // );
                }}
                className="flex items-center"
              >
                <Button variant="outline" className="flex gap-1">
                  <Save width={16} height={16} />
                  Save

                </Button>
              </Link>
            </div>
            {!user && <div>
              <Link
                href={`/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`}
                onClick={() => {
                  // GAEvent(
                  //   "trackers",
                  //   "Tracker Detail",
                  //   "View",
                  //   "Notes and Discussion"
                  // );
                }}
                className="flex items-center"
              >
                <Button variant="outline" className="flex gap-1">
                  <ArrowUpToLine width={16} height={16} />
                  Export

                </Button>
              </Link>
            </div>}
            {user &&
              <div>
                <Button variant="outline" className="flex gap-1" onClick={() => setShowExport(true)}>
                  <ArrowUpToLine width={16} height={16} />
                  Export

                </Button>
              </div>
            }
            <div>
              <Link
                href={user ?
                  `/internal/trackers/create?type=${presetTemplateData?.trackerType[0]}&collectionId=${presetTemplateData?.id}`
                  :
                  `/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`}
                onClick={() => {
                  // GAEvent(
                  //   "trackers",
                  //   "Tracker Detail",
                  //   "View",
                  //   "Notes and Discussion"
                  // );
                }}
                className="flex items-center"
              >
                <Button variant="outline" className="flex gap-1">
                  <Pencil width={16} height={16} />
                  Edit

                </Button>
              </Link>
            </div>
            {/* <Link href={`/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`}> */}
            <Button
              variant="outline"
              className="flex gap-1"
              onClick={handleShare}
            // onClick={() => setShare(!share)}
            // ref={!isMobile?refs.shareRef:null}
            >
              <Share2 width={16} height={16} />
              Share
            </Button>
            {/* </Link> */}
          </div>

        </div>
        <div className="md:hidden flex items-center justify-between gap-2 px-4 py-1">
          {/* Badge for event count */}

          <div className="flex-1 flex items-center gap-2 ">
            {/* <Badge className="bg-primary  text-white text-xs whitespace-nowrap font-medium md:font-semibold">
                                {new Intl.NumberFormat("en", {
                                  notation: "compact",
                                  maximumFractionDigits: 1,
                                }).format(activeCount)}
                              </Badge> */}
            <p className="text-primary font-medium md:font-semibold text-sm md:text-base whitespace-nowrap">
              Events
            </p>
          </div>
          {/* Event type select */}

          <Select
            value={active || undefined}
            onValueChange={(val) => {
              setActive(val);
              addQueryString(val);
            }}
          >
            <div>
              <SelectTrigger className="w-full max-w-[130px] border-gray-300">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>

                {eventCount?.map((item) => (
                  <SelectItem key={item.type} value={item.type.toLowerCase()}>
                    {item.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </div>
          </Select>
          <Link href={
            user
              ? `/internal/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`
              : `/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`
          }>
            <Button variant="outline" className="flex gap-1">
              <Save width={16} height={16} />
              Save
            </Button>
          </Link>
          <div>
            {!user &&
              <Link href={`/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 border p-2"
                >
                  {view === "list" ? (
                    <ListIcon className="w-4 h-4" />
                  ) : view === "table" ? (
                    <ListIcon className="w-4 h-4" />
                  ) : view === "map" ? (
                    <Globe className="w-4 h-4" />
                  ) : (
                    <CalendarIcon className="w-4 h-4" />
                  )}
                </Button>
              </Link>}

          </div>

          {(view === "list" && !user) &&
            <Link href={`/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`}>
              <Button
                id="sorting-dropdown-mobile"
                variant="ghost"
                size="xs"
                className="h-8 w-8 flex items-center gap-2 border"
              >
                {/* {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />} */}
                <ArrowDownUp className="w-4 h-4" />
              </Button>
            </Link>}

          {/* {view==="list" && <BulkImport bulkActions={bulkActions} setShowCheckBox={setShowCheckBox}/>} */}
        </div>
        {/* <PublicEventTable  presetTemplateData={presetTemplateData} active={active}/> */}
        {isLoading ? <Loading /> :
          eventError ? (
            user?
              <NullState
              image={TrackerNullState}
              // title="We couldn't find any events matching your tracker criteria at the moment."
              text="Save the tracker to view more events"
              buttonUrl={`/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`}
            />
              :
            <NullState
              image={TrackerNullState}
              // title="We couldn't find any events matching your tracker criteria at the moment."
              text="Browse all events or tailor your collections with basic and advanced filters to suit your needs."
              buttonText={!user?"Sign Up":""}
              buttonUrl={`/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`}
            />
          ) :
            eventsData?.events.length === 0 ?
              <NullState
                image={TrackerNullState}
                title="Don’t miss out on events made just for you—sign up now to get personalized recommendations."
                text={
                  <>
                    Instantly narrow your search with <strong>basic filters</strong> (category, date, location), then unlock <strong>advanced options</strong> for deeper, targeted insights.
                    <br />
                    Join today and discover your next must-attend event!
                  </>
                }
                buttonText={!user?"Sign Up":""}
                buttonUrl={`/preset?presetId=${presetTemplateData?.id}&type=${presetTemplateData?.trackerType[0]}`}
              />
              :
              <>
                {(eventsData && view === "table") &&
                  <TableView source="public" eventsData={eventsData} />
                }
                {(eventsData && view === "list") &&
                  <List source="public" eventsData={eventsData} />}
              </>}
      </div>
      {(showExport && user) &&
        <ExportModal onClose={exportModalHandler} source={"tracker"} />
      }
    </div>
  )

}