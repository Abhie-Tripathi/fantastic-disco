
import React, { useEffect, useRef, useState } from "react";
import styles from "./table.module.css";
import ExpandAll from "/public/expandAll.svg";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/components/UI/Loading";
import UpArrow from "/public/internal/arrow_up.svg";
import StarIcon from "/public/internal/rating_star.svg";
import DownArrow from "/public/internal/arrow_down.svg";
import PinIcon from "@/app/components/Table/icons/pin";
import BookmarkIcon from "@/app/components/Table/icons/bookmark";
import BookmarkFilled from "@/app/components/Table/icons/bookmarkFilled";
import closeIcon from "/public/close.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@/context";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import { EventTableType } from "@/types/ListViewTable";
import { usePathname, useRouter } from "next/navigation";
import { showToast } from "@/utils/showToast";
import { GAEvent } from "@/utils/GAEvent";
import NullState from "../trackers/nullState";
import TrackerNullState from "@/public/trackerNullState.svg";
import {
  TooltipTrigger,
  Button,
  Tooltip,
  OverlayArrow,
  MenuTrigger,
  Popover,
  Dialog,
} from "react-aria-components";
import { useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp } from "geist-icons";
import { useTrackerServices } from "@/services/trackerServices";
// import { AllEventsType } from '@/types/ListViewTable';
import ZeroState from "../zerostate";
import { useTrackerContext } from "@/context/tracker";
import { useCoordinateService } from "@/services/coordinateService";
import { PaginationComponent } from "@/components/pagination";
import { useFilterState } from "@/hooks/useFilterState";
import { formatEstimatedSpend } from "@/utils/formater";
interface FormDataType {
  entityId_id: string;
  markedInterest?: string | null;
  // eventGroupId: string;
}

interface ProductsType {
  name: string;
}

interface estimatedExhibitorType {
  type: string;
  stats: {
    follows?: number;
    estimatedVisitors?: number;
    estimatedExhibitors?: number;
  };
}

interface ratingItemType {
  stats: {
    rating?: number | null;
  };
}

interface eventSizeItemType {
  type: string;
  stats: {
    follows: number;
    estimatedVisitors: number | null;
  };
}

function listProducts(data: string[]) {
  // const names = data.map((item) => item.name);
  const formattedString = data.join(" | ");
  return formattedString;
}

function getGrowthRange(ex_ed_leads_following: number) {
  let lead_reange: string = "";
  if (ex_ed_leads_following >= 0 && ex_ed_leads_following <= 100)
    lead_reange = "0-100";
  else if (ex_ed_leads_following > 100 && ex_ed_leads_following <= 250)
    lead_reange = "100-250";
  else if (ex_ed_leads_following > 250 && ex_ed_leads_following <= 500)
    lead_reange = "250-500";
  else if (ex_ed_leads_following > 500 && ex_ed_leads_following <= 1000)
    lead_reange = "500-1000";
  else if (ex_ed_leads_following > 1000 && ex_ed_leads_following <= 5000)
    lead_reange = "1000-5000";
  else if (ex_ed_leads_following > 5000 && ex_ed_leads_following <= 10000)
    lead_reange = "5000-10000";
  else if (ex_ed_leads_following > 10000 && ex_ed_leads_following <= 50000)
    lead_reange = "10000-50000";
  else if (ex_ed_leads_following > 50000) lead_reange = "50000+";

  return lead_reange;
}

interface CategoryRank {
  [key: string]: number;
}

interface RankingResponse {
  countryRank?: number;
  categoryRank?: CategoryRank;
  globalRank?: number;
  countryCategoryRank?: CategoryRank;
}

function getLeastRank(response: RankingResponse) {
  let minRank = {
    rank: Infinity,
    name: "",
    type: "",
  };

  if (response?.globalRank !== undefined) {
    minRank.rank = response.globalRank;
    minRank.name = "";
    minRank.type = "Global";
  } else if (response?.countryRank !== undefined) {
    minRank.rank = response.countryRank;
    minRank.name = "";
    minRank.type = "Country";
  } else if (response?.categoryRank) {
    const c_ranks = response.categoryRank;
    for (const category in c_ranks) {
      if (c_ranks[category] < minRank.rank) {
        minRank.rank = c_ranks[category];
        minRank.name = category;
        minRank.type = "Category";
      }
    }
  } else if (response?.countryCategoryRank) {
    const c_ranks = response.countryCategoryRank;
    for (const category in c_ranks) {
      if (c_ranks[category] < minRank.rank) {
        minRank.rank = c_ranks[category];
        minRank.name = category;
        minRank.type = "Country Category";
      }
    }
  }

  if (minRank.type === "") {
    return "-";
  }
  return getEventRank(minRank);
}

interface rankTag {
  rank: number;
  type: string;
  name: string;
}

function getEventRank(prop: rankTag) {
  let rankString = "";
  if (prop.rank == 1) rankString = "st";
  else if (prop.rank == 2) rankString = "nd";
  else if (prop.rank == 3) rankString = "rd";
  else rankString = "th";
  return (
    <>
      <div style={{ textAlign: "center", fontWeight: "500" }}>
        {prop.rank}
        <sup>{rankString}</sup>
      </div>
      <span
        title={prop.name}
        className={`${styles.truncateText_1} badge_warning`}
        style={{ textTransform: "capitalize", padding: "1px 10px" }}
      >
        {prop.type}
      </span>
    </>
  );
}

function getForecastedStatus(data: any) {
  if (!data && data === "") return "-";

  const forecastDate = new Date(data);
  const today = new Date();

  if (forecastDate >= today) {
    return forecastDate.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  } else return "-";
}

function getEventSize(item: eventSizeItemType) {
  let result;
  if (item.type === "Tradeshow") {
    if (item.stats.follows > 5000) {
      result = "200000+";
    } else if (item.stats.follows >= 501 && item.stats.follows <= 5000) {
      result = "50000-200000";
    } else if (item.stats.follows >= 101 && item.stats.follows <= 500) {
      result = "20000-50000";
    } else if (item.stats.follows >= 26 && item.stats.follows <= 100) {
      result = "5000-20000";
    } else if (item.stats.follows >= 1 && item.stats.follows <= 25) {
      result = "1000-5000";
    } else {
      result = "Upto 1000";
    }
  } else if (item.type === "Conference" || item.type === "Workshop") {
    if (item.stats.follows && item.stats.estimatedVisitors) {
      if (item.stats.follows > 500 || item.stats.estimatedVisitors > 500) {
        result = "5000+";
      } else if (
        (item.stats.follows >= 101 && item.stats.follows <= 500) ||
        (item.stats.estimatedVisitors >= 101 &&
          item.stats.estimatedVisitors <= 500)
      ) {
        result = "2000-5000";
      } else if (
        (item.stats.follows >= 26 && item.stats.follows <= 100) ||
        (item.stats.estimatedVisitors >= 26 &&
          item.stats.estimatedVisitors <= 100)
      ) {
        result = "500-1000";
      } else if (
        (item.stats.follows >= 1 && item.stats.follows <= 25) ||
        (item.stats.estimatedVisitors >= 1 &&
          item.stats.estimatedVisitors <= 25)
      ) {
        result = "100-500";
      } else {
        result = "Upto 100";
      }
    } else {
      result = "Upto 100";
    }
  }
  return result;
}

function getEstimatedExhibitors(item: any): string {
  let result: string = "";

  if (item.type.includes("Tradeshow")) {
    if (
      (item.stats.eventFollower && item.stats.eventFollower > 100) ||
      (item.stats.estimatedVisitor && item.stats.estimatedVisitor > 100)
    ) {
      result = "500+";
    } else if (
      (item.stats.eventFollower &&
        item.stats.eventFollower >= 1 &&
        item.stats.eventFollower <= 100) ||
      (item.stats.estimatedVisitor &&
        item.stats.estimatedVisitor >= 1 &&
        item.stats.estimatedVisitor <= 100)
    ) {
      result = "100-500";
    } else {
      result = "20-100";
    }
  } else {
    if (item.stats.estimatedExhibitor && item.stats.estimatedExhibitor > 0) {
      result = item.stats.estimatedExhibitor.toString();
    } else {
      result = "-";
    }
  }

  return result;
}

function getEventRating(item: string) {
  let averageRating = parseFloat(item);
  if (averageRating !== undefined && averageRating !== null) {
    if (averageRating >= 4.5) {
      return "4.5 - 5.0";
    } else if (averageRating >= 4 && averageRating < 4.5) {
      return "4.0 - 4.5";
    } else if (averageRating >= 3 && averageRating < 4) {
      return "3.0 - 4.0";
    } else if (averageRating < 3 && averageRating > 0) {
      return "<3";
    }
  }
  return "";
}

const Table = ({
  // eventData,
  showInsights,
  queryString,
  eventType,
  setActiveValue,
  setRequestExhausted,
  handleButtonLoading,
  savedEventCount,
  setSavedEventCount,
  source,
}: {
  savedEventCount?: number;
  setSavedEventCount?: any;
  eventData?: any;
  showInsights: any;
  queryString?: string;
  eventType?: string;
  setActiveValue?: any;
  setRequestExhausted?: any;
  source?: string;
  handleButtonLoading?: (val: boolean) => void;
}) => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const {
    getTrackerEvents,
    getSavedEvents,
    saveNewEvent,
    deleteNewEvent,
    error,
  } = useTrackerServices();
  const { setData, data } = useTrackerContext();
  const { setFilter, getFilterValue } = useFilterState();
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const [currPage, setCurrPage] = useState(1);
  const [eventPerPage, setEventPerPage] = useState<EventTableType[]>([]);
  const path = usePathname().split("/");
  // const itemsPerPage = 10;
  // const totalPages = Math.ceil(eventData.length / itemsPerPage);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [initialRender, setInitialRender] = useState<boolean>(false);
  const [zeroStateHeading, setZeroStateHeading] = useState(``);
  const [zeroStateText, setZeroStateText] = useState(
    `Discover insights on business trends filtered by geography and category, all in one glance.`
  );
  const [zeroStateBtnText, setZeroStateBtnText] = useState(
    "Manage Configurations"
  );
  // const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const userMaxLimit = 100;
  const [pinEvent, setPinEvent] = useState<string>(
    "1b27ff90-1a46-4f49-85eb-607b4d510eb1"
  );
  const [totalEvents, setTotalEvents] = useState(0);
  const [saved, setSaved] = useState("");
  const [bookmarkedEvent, setBookmarkedEvent] = useState<string[]>([]);
  const [appliedKeywords, setAppliedKeywords] = useState<String[]>([]);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [formData, setFormData] = useState<FormDataType>({
    entityId_id: "",
    markedInterest: null,
    // eventGroupId: "",
  });
  const take = getFilterValue("take") || 20;
  const skip = getFilterValue("skip") || 0;
  const coordinateService = useCoordinateService();

  const [coordinateActions, setCoordinateActions] = useState<any>([]);

  const router = useRouter();

  const handleChangeIntent = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, markedInterest: value });
  };
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      if (currPage === 1) fetchEventsData();
      setCurrPage(1);
    }
  }, [eventType]);
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    callback: any
  ) => {
    e.preventDefault();
    if (formData?.entityId_id !== "" && formData.markedInterest) {
      if (formData.markedInterest == "bookmark") {
        if (path[path.length - 1] !== "events") {
          saveEvent(formData.entityId_id);
          callback();
          return;
        }
        let payloadData = {
          eventId: formData.entityId_id,
        };
        try {
          const { data, error } = await myFetch(
            `${baseUrl}/tracker/saved-events`,
            {
              method: "POST",
              body: JSON.stringify(payloadData),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (error) {
            console.log(error);
            return;
          }
          if (data) {
            showToast("success", "Event saved");
            setBookmarkedEvent((prev) => [...prev, formData.entityId_id]);
          }
        } catch (error) {
          console.error("Error saving data:", error);
        } finally {
          setIsOpen(null);
          callback();
        }
      } else if (formData.markedInterest == "unbookmark") {
        if (path[path.length - 1] !== "events") {
          deleteEvent(formData.entityId_id);
          callback();
          return;
        }
        try {
          let payloadData = {
            eventIds: [formData.entityId_id],
          };
          const response = await myFetch(`${baseUrl}/tracker/saved-events`, {
            method: "DELETE",
            body: JSON.stringify(payloadData),
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response) {
            setBookmarkedEvent((prev) =>
              prev.filter((id) => id !== formData.entityId_id)
            );
            showToast("error", "Saved event deleted");
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsOpen(null);
          callback();
        }
      } else {
        let payloadData = {
          source: "GTM",
          entityId: formData?.entityId_id,
          interest: formData?.markedInterest,
        };
        try {
          const apiUrl = baseUrl + "/userInterest";
          const { data, error } = await myFetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payloadData),
          });

          if (data && data.message == "Entry Created") {
            showToast("success", "Interest marked successfully!");
            setIsOpen(null);
          }
          if (error) {
            if (error?.status === 300)
              showToast("success", "Interest marked successfully!");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          callback();
        }
      }
    }
  };

  const getInterestConfig = async () => {
    try {
      const apiData: any = await coordinateService.getInterestConfig();
      setCoordinateActions(apiData.slice(1));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [val, setVal] = useState(1);
  useEffect(() => {
    // setCurrPage(val);
    const startInd = (currPage - 1) * itemsPerPage;
    const endInd = startInd + itemsPerPage;
    const secondLast = path[path.length - 2];
    // if(currPage===1 && prev){
    //   fetchEventsData();
    //   setPrev(false);
    // }
    // if(currPage!==1)
    fetchEventsData();
  }, [currPage, itemsPerPage, skip, take]);

  useEffect(() => {
    if (queryString) {
      if (currPage == 1) fetchEventsData();
      else setCurrPage(1);
    }
  }, [queryString]);

  // useEffect(()=>{
  //   const secondLast = path[path.length - 2];
  //   if(currPage!==1)
  //   fetchData(secondLast);
  // },[currPage])

  useEffect(() => {
    if (path[2] === "search") setInitialRender(true);
    const fetchBookmarkData = async () => {
      const { data, error } = await myFetch(`${baseUrl}/tracker/saved-events`);
      if (error) {
        console.log(error);
        return;
      }
      if (data) {
        let bookmarkGroupIds = data.result.map((event: any) => event.id);
        setBookmarkedEvent(bookmarkGroupIds);
      }
    };
    if (path[2] !== "trackers") {
      fetchBookmarkData();
    }
    getInterestConfig();
  }, []);

  const handleModalOpen = (eventId: string, bookmarkedStatus: boolean) => {
    GAEvent("research", "Filters", "Saved Event | Viewed", "Saved Event");
    // setIsOpen((prev) => (prev == eventId ? null : eventId));
    setFormData({
      ...formData,
      entityId_id: eventId,
      markedInterest: bookmarkedStatus ? null : "bookmark",
    });
  };

  const handlePinEvent = (eventId: string) => {
    setPinEvent(eventId);
    toast.success("Event pinned successfully!", {
      position: "bottom-right",
      autoClose: 2000,
      closeButton: false,
      hideProgressBar: true,
    });
  };

  const handlePageItems = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setItemsPerPage(parseInt(event.target.value));
  };
  const [isSaved, setIsSaved] = useState(false);
  const fetchSavedData = async () => {
    setIsSaved(true);

    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for the new request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const secondLast = path[path.length - 2];

    try {
      const result = (await getSavedEvents(
        secondLast,
        `max=${itemsPerPage}&offset=${(currPage - 1) * 10}`,
        abortController.signal // Pass the signal here
      )) as { result: EventTableType[]; count: number };

      if (result) {
        setIsLoaded(true);
        GAEvent("trackers", "Tracker", "View", `Saved Event | ${currPage}`);
        setEventPerPage(result.result);
        setTotalEvents(result.count);

        if (result.count === 0) {
          setZeroStateHeading(
            `No events saved yet! Start saving events to easily track and revisit them here.`
          );
          setZeroStateText("");
          setZeroStateBtnText("");
        }

        if (currPage === 1) {
          // setTotalPages(Math.ceil(result.count / itemsPerPage));
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Saved events request was aborted");
      } else {
        console.error("Fetch saved data error: ", error);
      }
    } finally {
      // Reset the controller after request completes or is aborted
      abortControllerRef.current = null;
    }
  };
  const currentPage =
    Math.floor(Number(getFilterValue("skip") || "0") / itemsPerPage) + 1;
  const totalPages = Math.ceil(totalEvents / itemsPerPage);

  const handlePageChange = (page: number) => {
    setFilter("skip", ((page - 1) * itemsPerPage).toString());
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);

    setFilter("take", newItemsPerPage.toString());
  };

  const fetchAllSavedEvent = async () => {
    const { data, error } = await myFetch(
      `${baseUrl}/tracker/saved-events?max=${itemsPerPage}&offset=${
        (currPage - 1) * 10
      }`
    );
    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      // console.log(data);
      setIsLoaded(true);

      setEventPerPage(data.result);
      setTotalEvents(data.count);
      if (currPage === 1) {
        // setTotalPages(Math.ceil(data.count / itemsPerPage));
        setEventPerPage(data.result);
      } else {
        setEventPerPage(data.result);
      }

      // setCatgeoryData(data);
    }
  };
  // const fetchAllSavedEvent=aync()=>{

  // }
  useEffect(() => {
    if (showInsights?.includeKeywords || showInsights?.excludeKeywords) {
      const includeKeywords: [] = showInsights?.includeKeywords
        ? showInsights?.includeKeywords?.split(",")
        : [];
      const excludeKeywords: [] = showInsights?.excludeKeywords
        ? showInsights?.excludeKeywords?.split(",")
        : [];

      setAppliedKeywords([...includeKeywords, ...excludeKeywords]);
    }
  }, [showInsights.includeKeywords, showInsights.excludeKeywords]);

  const fetchEventsData = async () => {
    if (path[path.length - 1] === "trackedEvents") {
      const secondLast = path[path.length - 2];

      fetchData(secondLast);
      setIsLoaded(false);
    } else if (path[path.length - 1] === "trackers") {
      fetchAllSavedEvent();
      setIsLoaded(false);
    } else if (path[path.length - 1] === "savedEvents") {
      console.log(1);

      fetchSavedData();
      setIsLoaded(false);
    } else {
      if (queryString) {
        try {
          setIsLoaded(false);
          setInitialRender(false);

          const apiUrl = `${baseUrl}/event/search?sortBy=score&sortType=desc&max=${itemsPerPage}&${queryString}`;
          // const apiUrl = 'https://api.eventgeni.com/event/search?eventId=46e52e7e-1e0d-4422-a2dd-6033fe279ba6';
          const { data, error } = await myFetch(apiUrl, {
            method: "GET",
            headers: headers,
          });
          if (data) {
            if (data.stats.totalEvents === 0) {
              setZeroStateHeading("No Events Found");
              setZeroStateText(
                "Try using alternative or related industry/keywords to broaden your search."
              );
            }
            // setTotalPages(Math.ceil(data.stats.totalEvents / itemsPerPage));
            setTotalEvents(data.stats.totalEvents);

            setEventPerPage(data.events);
          }
          if (error) {
            if (error.status === 429) {
              setRequestExhausted(true);
              setZeroStateHeading("");
              setZeroStateText(
                "You have reached the maximum limit to view data. Please get in touch with us."
              );
            }
            if (error.status === 406) {
              setRequestExhausted(true);
              setZeroStateHeading(error?.message);
              setZeroStateText("");
              setEventPerPage([]);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoaded(true);
          handleButtonLoading?.(false);
        }
      } else {
        setIsLoaded(true);
        setEventPerPage([]);
      }
    }
  };
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchData = async (secondLast: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      if (eventType === "Saved Events") return fetchSavedData();

      const result = (await getTrackerEvents(
        secondLast,
        `limit=${take}&offset=${skip}`,
        eventType === "Active Events"
          ? "active"
          : eventType === "Expired Events"
          ? "expired"
          : "",
        abortController.signal
      )) as { events: EventTableType[]; totalEvents: number };

      if (!result) {
        console.error("No data returned from getTrackerEvents");
        return;
      }
      setEventPerPage(result.events);

      if (currPage === 1) {
        // setTotalPages(Math.ceil(result.totalEvents / itemsPerPage));
      }

      if (result.totalEvents === 0) {
        setZeroStateHeading(
          `We couldn't find any events matching your tracker criteria at the moment.`
        );
        setZeroStateText(
          "Try adjusting your filters or checking back later, as new events are added frequently."
        );
        setZeroStateBtnText("Manage Configurations");
      }

      if (result.events.length > 0) {
        setActiveValue(result.totalEvents);
        GAEvent("trackers", "Tracker", "View", `${eventType} | ${currPage}`);
        setTotalEvents(result.totalEvents);
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Saved events request was aborted");
      } else {
        setZeroStateHeading(error?.message);
        setZeroStateText("");
        // setEventPerPage([]);
        setZeroStateBtnText("");
      }
    } finally {
      // Reset the controller after the request completes or is aborted
      abortControllerRef.current = null;
    }
    setIsLoaded(true);
  };

  // const [isSaving, setIsSaving] = useState(false);

  const saveEvent = async (Id: string) => {
    // if (isSaving) return;

    // setIsSaving(true);

    const secondLast = path[path.length - 2];
    const dataToSend = {
      eventId: Id,
      trackerId: secondLast,
    };

    try {
      const result = await saveNewEvent(dataToSend);
      if (result) {
        showToast("success", "Event saved");
        setSavedEventCount((prev: number) => prev + 1);
        setData({
          ...data,
          tracker: {
            ...data.tracker,
            savedEventTotalCount: data.tracker.savedEventTotalCount + 1,
          },
        });
        let updatedData = eventPerPage?.find((event) => event.id === Id);

        if (updatedData) {
          const newUpdatedData = { ...updatedData, isSaved: true };
          const updatedEventPerPage = eventPerPage.map((event) =>
            event.id === Id ? newUpdatedData : event
          );
          setEventPerPage(updatedEventPerPage);
        }

        setSaved(Id);
      } else {
        console.log(error);
        showToast("error", error?.message);
      }
    } catch (error) {
      console.error("Error saving event:", error);
      showToast("error", "Please try again later.");
    }
  };

  // const [isDelete, setIsDelete] = useState(false);

  const deleteEvent = async (groupId: string) => {
    // if (isDelete) return;
    // setIsDelete(true);

    const url = `${baseUrl}/tracker/saved-events`;
    let dataToSend = {};
    if (path[path.length - 1] === "savedEvents") {
      const secondLast = path[path.length - 2];
      dataToSend = {
        eventIds: [groupId],
        trackerId: secondLast,
      };
    } else {
      dataToSend = {
        eventIds: [groupId],
        global: true,
      };
    }

    try {
      // const { data, error } = await myFetch(url, {
      //   method: "DELETE",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(dataToSend),
      // });
      const result = await deleteNewEvent(dataToSend);
      if (result) {
        if (eventType === "Saved Events") {
          console.log(result);
          showToast("error", "Saved event deleted");
          const newData = eventPerPage.filter((event) => event?.id !== groupId);
          console.log(newData);

          setEventPerPage(newData);
        } else {
          let updatedData = eventPerPage?.find((event) => event.id === groupId);

          if (updatedData) {
            const newUpdatedData = { ...updatedData, isSaved: false };
            const updatedEventPerPage = eventPerPage.map((event) =>
              event.id === groupId ? newUpdatedData : event
            );
            setEventPerPage(updatedEventPerPage);
          }
          showToast("error", "Saved event deleted");
        }
        setSavedEventCount((prev: number) => prev - 1);
        setData({
          ...data,
          tracker: {
            ...data.tracker,
            savedEventTotalCount: data.tracker.savedEventTotalCount - 1,
          },
        });
      } else if (error) {
        console.log(error);
        showToast("error", error?.response);
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      // showToast('error',err?.message);
    }
    // finally {
    //   setIsDelete(false);
    // }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center">
        <Loading className="w-[200px] h-[100px]" />
      </div>
    );
  } else if (isLoaded && eventPerPage.length == 0) {
    return (
      <div className={styles.noData}>
        {path[2] === "trackers" ? (
          <div className="px-10 py-5">
            <NullState
              image={TrackerNullState}
              title={zeroStateHeading}
              text={zeroStateText}
              buttonText={zeroStateBtnText}
              buttonUrl={`/internal/trackers/${
                path[path.length - 2]
              }/trackedConfiguration?type=${type}`}
            />
          </div>
        ) : (
          <ZeroState title={zeroStateHeading} text={zeroStateText} />
        )}
      </div>
    );
  }

  const loadMoreHandler = () => {
    if ((currPage + 1) * itemsPerPage - userMaxLimit >= itemsPerPage) {
      showToast("error", "Please contact us to increase the limit.");
      return;
    }
    setCurrPage((page) => page + 1);
    GAEvent("research", "Filters", "Load More Clicked", "Load More");
  };

  return (
    <div className={styles.table_container}>
      <div
        className={`${styles.table_wrapper} ${
          theme === "light" ? styles.table_wrapper_light : ""
        }`}
      >
        <table className={styles.table}>
          <thead className={`${styles.table_head}`}>
            <tr className={styles.table_head_row}>
              <th
                className={`${styles.table_firstColumn} ${styles.table_actionColumn}`}
                style={{
                  left: "0",
                  boxShadow: "10px 0 15px -5px rgba(0, 0, 0, 0.3)",
                }}
              >
                Event
              </th>
              <th>Date</th>
              <th>Venue</th>
              <th>City</th>
              <th>Country</th>
              {showInsights.eventKeywords && <th>Keywords</th>}
              <th>Category</th>
              {showInsights.eventSize && <th>Event Size</th>}
              {showInsights.estExhibit && <th>Est. Exhibitor</th>}
              {/* {showInsights.eventSeries ||
                (eventPerPage[0]?.series && <th>Event Series</th>)} */}
              {showInsights.eventRank && (
                <th style={{ textAlign: "center" }}>Rank</th>
              )}
              {/* {showInsights.growth && <th>Growth</th>} */}
              {showInsights.reptSent && <th>Reputation</th>}
              {showInsights.eventRating && (
                <th style={{ textAlign: "center" }}>Rating</th>
              )}
              {showInsights.repeatSent && (
                <th style={{ textAlign: "center" }}>Trust</th>
              )}
              {showInsights.eventFrequency && (
                <th className="text-center">Frequency</th>
              )}
              {showInsights.forecasted && <th>Forecasted</th>}
              {/* {showInsights.eventSize && <th>Event Size</th>} */}
              {/* {showInsights.global && <th>International</th>} */}
              {(type === null || type === "CUSTOM") &&
                appliedKeywords?.length > 0 && <th>Matched</th>}
              {(type === null || type === "CUSTOM") &&
                appliedKeywords?.length >= 5 && <th>Score</th>}

              {(type === "T_SPEAKING_OPPORTUNITY" ||
                type === "T_COMPETITOR" ||
                type === "T_PEOPLE_FINDER" ||
                type === "T_CUSTOMER_ICP" ||
                type === "T_RECRUITMENT") &&
                path[path.length - 1] !== "savedEvents" && (
                  <>
                    <th
                      className={`${styles.table_actionColumn} ${styles.table_actionColumn_header}`}
                      style={{ right: "150px", minWidth: "60px" }}
                    >
                      Matched
                    </th>
                    <th
                      className={`${styles.table_actionColumn} ${styles.table_actionColumn_header}`}
                      style={{
                        right: "50px",
                        minWidth: "100px",
                        textAlign: "center",
                      }}
                    >
                      Score
                    </th>
                  </>
                )}

              {type === "T_PRODUCT_KEYWORDS" &&
                path[path.length - 1] !== "savedEvents" && (
                  <>
                    <th
                      className={`${styles.table_actionColumn} ${styles.table_actionColumn_header}`}
                      style={{
                        right: appliedKeywords?.length >= 5 ? "150px" : "50px",
                        minWidth: "60px",
                      }}
                    >
                      Matched
                    </th>
                    {appliedKeywords?.length >= 5 && (
                      <th
                        className={`${styles.table_actionColumn} ${styles.table_actionColumn_header}`}
                        style={{
                          right: "50px",
                          minWidth: "100px",
                          textAlign: "center",
                        }}
                      >
                        Score
                      </th>
                    )}
                  </>
                )}
              {showInsights.maturity && <th>Maturity</th>}
              {showInsights.impactScore && <th title="Event Impact Score">EIS</th>}
              {showInsights.inboundScore && <th title="Inbound Score">Inbound</th>}
              {showInsights.internationalScore && <th title="International Score">International</th>}
              {showInsights.economicImpact && <th title="Estimated Economic Impact">Est. Impact ($)</th>}
              {showInsights.audienceZone && <th title="Audience Zone">Audience Zone</th>}

              {showInsights.audienceSpread && <th>Audience Spread</th>}
              <th
                className={`${styles.table_actionColumn} ${styles.bookmarkColumn}`}
                style={{ display: "flex" }}
              >
                {/* Actions */}
              </th>
            </tr>
          </thead>

          <tbody className={styles.table_body}>
            {eventPerPage.map((event: EventTableType) => (
              <tr key={event.id}>
                <td
                  className={`${styles.table_actionColumn}`}
                  style={{
                    left: "0",
                    textAlign: "left",
                    boxShadow: "10px 0 15px -5px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <div className={styles.event_badge_container}>
                    {showInsights.brandedEvent &&
                      event?.eventBrand &&
                      event?.eventBrand !== "" && (
                        <span
                          className={`${styles.branded_tag} badge_success`}
                          data-toggle="tooltip"
                          title={event.eventBrand}
                        >
                          Brand
                        </span>
                      )}
                    {showInsights.eventSeries && event?.isEventSeries && (
                      <span className={`${styles.branded_tag} badge_info`}>
                        Series
                      </span>
                    )}
                  </div>
                  <div className={styles.truncateText_1}>
                    <Link href={`/internal/event/${event.id}`}>
                      {event.name}
                    </Link>
                  </div>
                  <div className={styles.event_organizer}>
                    {event?.organizer?.name}
                  </div>
                </td>
                <td>
                  {event.status &&
                  (event.status === "CANCELLED" ||
                    event.status === "POSTPONED") ? (
                    <del
                      data-toggle="tooltip"
                      title={event.status}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {new Date(event.startDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}
                      <br />
                      {new Date(event.startDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      }) !==
                      new Date(event.endDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })
                        ? new Date(event.endDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit",
                          })
                        : null}
                    </del>
                  ) : (
                    <span style={{ whiteSpace: "nowrap" }}>
                      {new Date(event.startDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}
                      <br />
                      {new Date(event.startDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      }) !==
                      new Date(event.endDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })
                        ? new Date(event.endDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit",
                          })
                        : null}
                    </span>
                  )}
                </td>
                <td>
                  {event.format === "HYBRID" && (
                    <div
                      className={styles.hybridTag}
                      data-toggle="tooltip"
                      title="Happening virtually and offline at given venue"
                    >
                      Hybrid
                    </div>
                  )}
                  {event?.location?.cityId !== "1" &&
                  event.format === "ONLINE" ? (
                    event.location.venueName !== undefined &&
                    event.location.venueName !== null ? (
                      event.location.venueName.length > 15 ? (
                        <div
                          data-toggle="tooltip"
                          title={`${event.location.venueName}`}
                        >
                          {event.location.venueName.slice(0, 15) + "…"}
                        </div>
                      ) : (
                        <div>{event.location.venueName}</div>
                      )
                    ) : (
                      <div data-toggle="tooltip" title="To be announced">
                        Online
                      </div>
                    )
                  ) : event.location.venueName !== undefined &&
                    event.location.venueName !== null ? (
                    event.location.venueName.length > 25 ? (
                      <div
                        data-toggle="tooltip"
                        title={event.location.venueName}
                      >
                        {event.location.venueName.slice(0, 15) + "…"}
                      </div>
                    ) : (
                      <div>{event.location.venueName}</div>
                    )
                  ) : event.location.cityId === "1" &&
                    (event.format === "ONLINE" ||
                      event.location.venueName !== undefined) ? (
                    "Online"
                  ) : event.location.cityId !== "1" &&
                    event.location.venueName !== undefined ? (
                    <div data-toggle="tooltip" title="To be announced">
                      TBA
                    </div>
                  ) : null}
                </td>
                <td>{event.location.cityName}</td>
                <td>{event?.location?.countryName}</td>
                {showInsights.eventKeywords && (
                  <td>
                    {event?.eventKeywords?.length == 0 ? (
                      <>-</>
                    ) : event?.eventKeywords?.length == 1 ? (
                      event.eventKeywords[0]
                    ) : (
                      <>
                        {event?.eventKeywords[0]}&nbsp;
                        {/* <a
                          className={styles["products-list"]}
                          href="javascript:void(0)"
                          data-toggle="tooltip"
                          title={listProducts(event.eventKeywords)}
                        >
                          +{event.eventKeywords.length - 1}
                        </a> */}
                        <TooltipTrigger>
                          <Button className={styles["products-list"]}>
                            +{event.eventKeywords.length - 1}
                          </Button>
                          <Tooltip className={styles["react-aria-Tooltip"]}>
                            {listProducts(event.eventKeywords)}
                          </Tooltip>
                        </TooltipTrigger>
                      </>
                    )}
                  </td>
                )}
                <td>
                  {/* Finance & Banking */}
                  {event.categories !== undefined &&
                  event.categories.filter((item) => item.isGroup === true)
                    .length == 1 ? (
                    event.categories.find((item) => item.isGroup === true)?.name
                  ) : event.categories.filter((item) => item.isGroup === true)
                      .length > 0 ? (
                    <span style={{ textTransform: "capitalize" }}>
                      {
                        event.categories.find((item) => item.isGroup === true)
                          ?.name
                      }
                      &nbsp;
                      <TooltipTrigger>
                        <Button className={styles["products-list"]}>
                          +
                          {event.categories.filter(
                            (item) => item.isGroup === true
                          ).length - 1}
                        </Button>
                        <Tooltip className={styles["react-aria-Tooltip"]}>
                          {event.categories
                            .filter((item) => item.isGroup === true)
                            .map((item) => item.name)
                            .join(" | ")}
                        </Tooltip>
                      </TooltipTrigger>
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                {showInsights.eventSize && (
                  <td>
                    {/* {getEventSize(event)} */}
                    {event.eventSize ? event.eventSize : "-"}
                  </td>
                )}

                {showInsights.estExhibit && (
                  <td>
                    {/* {getEstimatedExhibitors(event)} */}
                    {event.stats?.estimatedExhibitor &&
                    event.stats?.estimatedExhibitor !== "" &&
                    event.stats?.estimatedExhibitor !== "null"
                      ? event.stats?.estimatedExhibitor
                      : "-"}
                  </td>
                )}

                {/* {showInsights.eventSeries ||
                  (event?.series && (
                    <td>{event.series ? event.series : "-"}</td>
                  ))} */}
                {showInsights.eventRank && (
                  <td style={{ textAlign: "center", width: "fit-content" }}>
                    {event?.ranking ? (
                      <div>
                        {/* {getEventRank(event.ranking?.globalRank)} */}
                        {getLeastRank(event.ranking)}
                        {/* <span className="badge_warning" style={{display: 'inline-block'}}>Global</span> */}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                )}
                {/* {showInsights.growth && (
                  <td>
                    {event.interestsGrowth && event.interestsGrowth != 0 ? (
                      event.interestsGrowth > 0 ? (
                        <div className={styles.text_green}>
                          {event.interestsGrowth}%{" "}
                          <Image src={UpArrow} alt="up" width={10} />
                        </div>
                      ) : (
                        <div className={styles.text_red}>
                          {event.interestsGrowth}%{" "}
                          <Image src={DownArrow} alt="down" width={10} />
                        </div>
                      )
                    ) : (
                      <></>
                    )}
                    {event.interestsGrowthRange &&
                      // <>{getGrowthRange(event.interestsGrowthRange)}</>
                      event.interestsGrowthRange}
                    {(event.interestsGrowth == undefined ||
                      event.interestsGrowth == 0) &&
                      (event.interestsGrowthRange == undefined ||
                        event.interestsGrowthRange == 0) &&
                      "-"}
                  </td>
                )} */}
                {showInsights.reptSent && (
                  <td>
                    {/* {event.stats.rating !== undefined &&
                      event.stats.rating !== null &&
                      event.stats.rating > "0" && (
                        <>
                          {getEventRating(event.stats.rating)}
                          &nbsp;
                          <Image src={StarIcon} alt="star" width={14} />
                        </>
                      )} */}
                    {event.reputationSentiment !== undefined &&
                    event.reputationSentiment !== null &&
                    (event.reputationSentiment > 1 ||
                      event.reputationSentiment < -1) ? (
                      event.reputationSentiment > 0 ? (
                        <div className={styles.text_green}>
                          {event.reputationSentiment}%{" "}
                          <Image src={UpArrow} alt="up" width={10} />{" "}
                        </div>
                      ) : (
                        <div className={styles.text_red}>
                          {event.reputationSentiment}%{" "}
                          <Image src={DownArrow} alt="down" width={10} />{" "}
                        </div>
                      )
                    ) : (
                      <>-</>
                    )}
                  </td>
                )}
                {showInsights.eventRating && (
                  <td style={{ textAlign: "center" }}>
                    {event.stats.rating !== undefined &&
                    event.stats.rating !== null &&
                    event.stats.rating > "0" ? (
                      <>
                        {event.reputationSentiment > 10 && (
                          <span
                            style={{
                              borderRadius: "50%",
                              backgroundColor:
                                "var(--success-background-color)",
                              padding: "4px",
                            }}
                          >
                            <ArrowUp
                              style={{
                                width: "14px",
                                height: "14px",
                                color: "var(--success-text-color)",
                                marginBottom: "5px",
                                display: "inline",
                              }}
                            />
                          </span>
                        )}
                        {event.reputationSentiment < -10 && (
                          <span
                            style={{
                              borderRadius: "50%",
                              backgroundColor: "var(--danger-background-color)",
                              padding: "4px",
                            }}
                          >
                            <ArrowDown
                              style={{
                                width: "14px",
                                height: "14px",
                                color: "var(--danger-text-color)",
                                marginBottom: "5px",
                                display: "inline",
                              }}
                            />
                          </span>
                        )}
                        &nbsp;
                        {getEventRating(event.stats.rating)}
                        &nbsp;
                        <Image
                          src={StarIcon}
                          alt="star"
                          width={14}
                          className="inline"
                        />
                      </>
                    ) : (
                      <>-</>
                    )}
                  </td>
                )}
                {showInsights.repeatSent && (
                  <td style={{ textAlign: "center" }}>
                    {event?.repeatSentiment !== undefined &&
                    event?.repeatSentiment > 0 ? (
                      <>
                        {event["trustScore%"] !== undefined &&
                          event["trustScore%"] !== null && (
                            <>
                              {event["trustScore%"] > 10 && (
                                <span
                                  style={{
                                    borderRadius: "50%",
                                    backgroundColor:
                                      "var(--success-background-color)",
                                    padding: "4px",
                                  }}
                                >
                                  <ArrowUp
                                    style={{
                                      width: "14px",
                                      height: "14px",
                                      color: "var(--success-text-color)",
                                      marginBottom: "5px",
                                      display: "inline",
                                    }}
                                  />
                                </span>
                              )}
                              {event["trustScore%"] < -10 && (
                                <span
                                  style={{
                                    borderRadius: "50%",
                                    backgroundColor:
                                      "var(--danger-background-color)",
                                    padding: "4px",
                                  }}
                                >
                                  <ArrowDown
                                    style={{
                                      width: "14px",
                                      height: "14px",
                                      color: "var(--danger-text-color)",
                                      marginBottom: "5px",
                                      display: "inline",
                                    }}
                                  />
                                </span>
                              )}
                            </>
                          )}
                        &nbsp;
                        {event.repeatSentiment}%
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                )}

                {/* {(event?.repeatSentiment && event?.repeatSentiment !== 0)
                      ? <>
                          {event["trustScore%"] && event["trustScore%"] > 10 &&
                            <span style={{borderRadius:"50%", backgroundColor: "var(--success-background-color)", padding:"4px"}}>
                              <ArrowUp style={{width:"14px", height:"14px", color:"var(--success-text-color)", marginBottom:"5px"}}/>
                            </span>
                          }
                          {event["trustScore%"] && event["trustScore%"] < -10 &&
                            <span style={{borderRadius:"50%", backgroundColor: "var(--danger-background-color)", padding:"4px"}}>
                              <ArrowDown style={{width:"14px", height:"14px", color:"var(--danger-text-color)", marginBottom:"5px"}}/>
                            </span>
                          }
                          &nbsp;
                          {event.repeatSentiment}
                        </> + "%"
                      : "-"} */}

                {showInsights.eventFrequency && (
                  <td className="text-center">
                    {event?.frequency && event?.frequency !== "" ? (
                      <span
                        style={{ textTransform: "capitalize" }}
                        className="badge_primary"
                      >
                        {event?.frequency}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                )}

                {showInsights.forecasted && (
                  <td>{getForecastedStatus(event.futureExpectedStartDate)}</td>
                )}

                {/* {showInsights.global && (
                  <td>
                    {event["internationalAudience%"] !== undefined ? (
                      event["internationalAudience%"] == "high" ? (
                        <span className={styles.badge_success}>High</span>
                      ) : event["internationalAudience%"] == "medium" ? (
                        <span className={styles.badge_primary}>Medium</span>
                      ) : event["internationalAudience%"] == "low" ? (
                        <span className={styles.badge_danger}>Low</span>
                      ) : (
                        <></>
                      )
                    ) : (
                      <></>
                    )}
                  </td>
                )} */}
                {(type === null || type === "CUSTOM") &&
                  appliedKeywords?.length > 0 && (
                    <>
                      <td>
                        {event.matchedKeywords.length == 0 ? (
                          <>-</>
                        ) : event.matchedKeywords.length == 1 ? (
                          event.matchedKeywords[0]
                        ) : (
                          <>
                            {event.matchedKeywords[0]}&nbsp;
                            {/* <a
                            className={styles["products-list"]}
                            href="javascript:void(0)"
                            data-toggle="tooltip"
                            title={listProducts(event.matchedKeywords)}
                          >
                            +{event.matchedKeywords.length - 1}
                          </a> */}
                            <TooltipTrigger>
                              <Button className={styles["products-list"]}>
                                +{event.matchedKeywords.length - 1}
                              </Button>
                              <Tooltip className={styles["react-aria-Tooltip"]}>
                                {listProducts(event.matchedKeywords)}
                              </Tooltip>
                            </TooltipTrigger>
                          </>
                        )}
                      </td>
                      {(type === null || type === "CUSTOM") &&
                        appliedKeywords?.length >= 5 && (
                          <td>
                            {event.keywordsMatchedScore > 20 ? (
                              <span className={styles.badge_success}>High</span>
                            ) : event.keywordsMatchedScore >= 10 &&
                              event.keywordsMatchedScore <= 20 ? (
                              <span className={styles.badge_primary}>
                                Medium
                              </span>
                            ) : event.keywordsMatchedScore > 0 &&
                              event.keywordsMatchedScore < 10 ? (
                              <span className={styles.badge_danger}>Low</span>
                            ) : (
                              "-"
                            )}
                          </td>
                        )}
                    </>
                  )}

                {(type === "T_COMPETITOR" || type === "T_CUSTOMER_ICP") &&
                  path[path.length - 1] !== "savedEvents" && (
                    <>
                      <td
                        style={{
                          textAlign: "center",
                          right: "150px",
                          boxShadow: "-10px 0 15px -5px rgba(0, 0, 0, 0.3)",
                          minWidth: "60px",
                        }}
                        className={`${styles.table_actionColumn}`}
                      >
                        {event?.competitorDomainOrName &&
                        event?.competitorDomainOrName.length > 0 ? (
                          <>
                            <span
                              title={
                                event?.competitorDomainOrName?.[0].split("_")[1]
                              }
                              className={styles.capitalizeText}
                            >
                              {event?.competitorDomainOrName?.[0].split("_")[0]}
                            </span>
                            &nbsp;
                            {event?.competitorDomainOrName.length > 1 && (
                              <TooltipTrigger>
                                <Button className={styles["products-list"]}>
                                  +{event.competitorDomainOrName.length - 1}
                                </Button>
                                <Tooltip
                                  className={styles["react-aria-Tooltip"]}
                                >
                                  {event?.competitorDomainOrName.map((item) => (
                                    <div key={item}>
                                      {item.split("_")[1]}
                                      <span className={styles.capitalizeText}>
                                        {" "}
                                        ({item.split("_")[0]})
                                      </span>
                                    </div>
                                  ))}
                                </Tooltip>
                              </TooltipTrigger>
                            )}
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          right: "50px",
                          minWidth: "100px",
                        }}
                        className={`${styles.table_actionColumn}`}
                      >
                        {event?.competitorPercentage == "High" ? (
                          <span className={styles.badge_success}>High</span>
                        ) : event?.competitorPercentage == "Medium" ? (
                          <span className={styles.badge_primary}>Medium</span>
                        ) : event?.competitorPercentage == "Low" ? (
                          <span className={styles.badge_danger}>Low</span>
                        ) : (
                          "-"
                        )}
                      </td>
                    </>
                  )}

                {type === "T_SPEAKING_OPPORTUNITY" &&
                  path[path.length - 1] !== "savedEvents" && (
                    <>
                      <td
                        style={{
                          textAlign: "center",
                          right: "150px",
                          boxShadow: "-10px 0 15px -5px rgba(0, 0, 0, 0.3)",
                          minWidth: "60px",
                        }}
                        className={`${styles.table_actionColumn}`}
                      >
                        {event?.speakerPersonAssociation ? (
                          event?.speakerPersonAssociation.length == 1 ? (
                            event.speakerPersonAssociation[0]
                          ) : (
                            <>
                              {event.speakerPersonAssociation[0]}&nbsp;
                              <TooltipTrigger>
                                <Button className={styles["products-list"]}>
                                  +{event.speakerPersonAssociation.length - 1}
                                </Button>
                                <Tooltip
                                  className={styles["react-aria-Tooltip"]}
                                >
                                  {listProducts(event.speakerPersonAssociation)}
                                </Tooltip>
                              </TooltipTrigger>
                            </>
                          )
                        ) : (
                          "-"
                        )}
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          right: "50px",
                          minWidth: "100px",
                        }}
                        className={`${styles.table_actionColumn}`}
                      >
                        {event?.speakerPersonAssociationPercentage == "High" ? (
                          <span className={styles.badge_success}>High</span>
                        ) : event?.speakerPersonAssociationPercentage ==
                          "Medium" ? (
                          <span className={styles.badge_primary}>Medium</span>
                        ) : event?.speakerPersonAssociationPercentage ==
                          "Low" ? (
                          <span className={styles.badge_danger}>Low</span>
                        ) : (
                          "-"
                        )}
                      </td>
                    </>
                  )}

                {type === "T_PRODUCT_KEYWORDS" &&
                  path[path.length - 1] !== "savedEvents" && (
                    <>
                      <td
                        style={{
                          textAlign: "center",
                          right:
                            appliedKeywords?.length >= 5 ? "150px" : "50px",
                          boxShadow: "-10px 0 15px -5px rgba(0, 0, 0, 0.3)",
                          minWidth: "60px",
                        }}
                        className={`${styles.table_actionColumn}`}
                      >
                        {event.matchedKeywords.length == 0 ? (
                          <>-</>
                        ) : event.matchedKeywords.length == 1 ? (
                          event.matchedKeywords[0]
                        ) : (
                          <>
                            {event.matchedKeywords[0]}&nbsp;
                            {/* <a
                            className={styles["products-list"]}
                            href="javascript:void(0)"
                            data-toggle="tooltip"
                            title={listProducts(event.matchedKeywords)}
                          >
                            +{event.matchedKeywords.length - 1}
                          </a> */}
                            <TooltipTrigger>
                              <Button className={styles["products-list"]}>
                                +{event.matchedKeywords.length - 1}
                              </Button>
                              <Tooltip className={styles["react-aria-Tooltip"]}>
                                {listProducts(event.matchedKeywords)}
                              </Tooltip>
                            </TooltipTrigger>
                          </>
                        )}
                      </td>
                      {appliedKeywords?.length >= 5 && (
                        <td
                          style={{
                            textAlign: "center",
                            right: "50px",
                            minWidth: "100px",
                          }}
                          className={`${styles.table_actionColumn}`}
                        >
                          {event.keywordsMatchedScore > 20 ? (
                            <span className={styles.badge_success}>High</span>
                          ) : event.keywordsMatchedScore >= 10 &&
                            event.keywordsMatchedScore <= 20 ? (
                            <span className={styles.badge_primary}>Medium</span>
                          ) : event.keywordsMatchedScore > 0 &&
                            event.keywordsMatchedScore < 10 ? (
                            <span className={styles.badge_danger}>Low</span>
                          ) : (
                            "-"
                          )}
                        </td>
                      )}
                    </>
                  )}

                {type === "T_PEOPLE_FINDER" &&
                  path[path.length - 1] !== "savedEvents" && (
                    <>
                      <td
                        style={{
                          textAlign: "center",
                          right: "150px",
                          boxShadow: "-10px 0 15px -5px rgba(0, 0, 0, 0.3)",
                          minWidth: "60px",
                        }}
                        className={`${styles.table_actionColumn}`}
                      >
                        {event?.peopleFinderPersonAssociation &&
                        event?.peopleFinderPersonAssociation.length > 0 ? (
                          <>
                            <span
                              title={
                                `${event?.peopleFinderPersonAssociation?.[0].split(
                                  "_"
                                )[1]} - ${event?.peopleFinderPersonAssociation?.[0].split(
                                  "_"
                                )[2]}`
                              }
                              className={styles.capitalizeText}
                            >
                              {
                                event?.peopleFinderPersonAssociation?.[0].split(
                                  "_"
                                )[0]
                              }
                            </span>
                            &nbsp;
                            {event?.peopleFinderPersonAssociation.length >
                              1 && (
                              <TooltipTrigger>
                                <Button className={styles["products-list"]}>
                                  +
                                  {event.peopleFinderPersonAssociation.length -
                                    1}
                                </Button>
                                <Tooltip
                                  className={styles["react-aria-Tooltip"]}
                                >
                                  {event?.peopleFinderPersonAssociation.map(
                                    (item) => (
                                      <div key={item}>
                                        {item.split("_")[1]} ({item.split("_")[0]}) -
                                        <span className={styles.event_organizer}>{item.split("_")[2]}</span>
                                      </div>
                                    )
                                  )}
                                </Tooltip>
                              </TooltipTrigger>
                            )}
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          right: "50px",
                          minWidth: "100px",
                        }}
                        className={`${styles.table_actionColumn}`}
                      >
                        {event?.peopleFinderPersonAssociationPercentage ==
                        "High" ? (
                          <span className={styles.badge_success}>High</span>
                        ) : event?.peopleFinderPersonAssociationPercentage ==
                          "Medium" ? (
                          <span className={styles.badge_primary}>Medium</span>
                        ) : event?.peopleFinderPersonAssociationPercentage ==
                          "Low" ? (
                          <span className={styles.badge_danger}>Low</span>
                        ) : (
                          "-"
                        )}
                      </td>
                    </>
                  )}

                {type === "T_RECRUITMENT" &&
                  path[path.length - 1] !== "savedEvents" && (
                    <>
                      <td
                        style={{
                          textAlign: "center",
                          right: "150px",
                          boxShadow: "-10px 0 15px -5px rgba(0, 0, 0, 0.3)",
                          minWidth: "60px",
                        }}
                        className={`${styles.table_actionColumn}`}
                      >
                        {event?.recruitmentAssociation ? (
                          event?.recruitmentAssociation.length == 1 ? (
                            event.recruitmentAssociation[0]
                          ) : (
                            <>
                              {event.recruitmentAssociation[0]}&nbsp;
                              <TooltipTrigger>
                                <Button className={styles["products-list"]}>
                                  +{event.recruitmentAssociation.length - 1}
                                </Button>
                                <Tooltip
                                  className={styles["react-aria-Tooltip"]}
                                >
                                  {listProducts(event.recruitmentAssociation)}
                                </Tooltip>
                              </TooltipTrigger>
                            </>
                          )
                        ) : (
                          "-"
                        )}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          right: "50px",
                          minWidth: "100px",
                        }}
                        className={`${styles.table_actionColumn}`}
                      >
                        {event?.recruitmentAssociationPercentage == "High" ? (
                          <span className={styles.badge_success}>High</span>
                        ) : event?.recruitmentAssociationPercentage ==
                          "Medium" ? (
                          <span className={styles.badge_primary}>Medium</span>
                        ) : event?.recruitmentAssociationPercentage == "Low" ? (
                          <span className={styles.badge_danger}>Low</span>
                        ) : (
                          "-"
                        )}
                      </td>
                    </>
                  )}

                {showInsights.maturity && (
                  <td>
                    {event?.maturity && event?.maturity !== "" ? (
                      <span
                        style={{ textTransform: "capitalize" }}
                        className="badge_primary"
                      >
                        {event?.maturity}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                )}

                {showInsights.impactScore && (
                  <td>
                    {event?.eventImpactScore && event?.eventImpactScore !== 0
                      ? event.eventImpactScore
                      : "-"}
                  </td>
                )}
                {showInsights.inboundScore && (
                  <td>
                    {event?.eventInboundScore && event?.eventInboundScore !== 0
                      ? event.eventInboundScore
                      : "-"}
                  </td>
                )}
                {showInsights.internationalScore && (
                  <td>
                    {/* {event["internationalAudience%"] !== undefined ? (
                      event["internationalAudience%"] == "high" ? (
                        <span className={styles.badge_success}>High</span>
                      ) : event["internationalAudience%"] == "medium" ? (
                        <span className={styles.badge_primary}>Medium</span>
                      ) : event["internationalAudience%"] == "low" ? (
                        <span className={styles.badge_danger}>Low</span>
                      ) : (
                        <></>
                      )
                    ) : (
                      <></>
                    )} */}
                    {event?.internationalScore &&
                    event?.internationalScore !== 0
                      ? event.internationalScore
                      : "-"}
                  </td>
                )}

                {showInsights.economicImpact && (
                  <td className="text-right">{formatEstimatedSpend(event.economicImpact)}</td>
                )}

                {showInsights.audienceZone && (
                  <td>
                    {event?.audienceZone && event?.audienceZone !== "" ? (
                      <span className={styles.badge_primary}>
                        {event.audienceZone}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                )}

                {showInsights.audienceSpread && (
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {event?.audienceSpread &&
                      Object.entries(event?.audienceSpread).length > 0
                        ? Object.entries(event?.audienceSpread).map(
                            ([key, { iso, name, count, percentage }]) => (
                              <span
                                key={key}
                                className={styles.country_badge}
                                title={name}
                              >
                                <Image
                                  src={`https://img.10times.com/img/flag/${iso.toLowerCase()}.jpg`}
                                  alt="flag"
                                  width={25}
                                  height={18}
                                />
                                {/* &nbsp;{Math.round(percentage * 10) / 10}% */}
                              </span>
                            )
                          )
                        : "-"}
                    </div>
                  </td>
                )}

                <td
                  className={`${styles.table_actionColumn} ${styles.bookmarkColumn}`}
                >
                  {/* {path[path.length - 1] === "trackedEvents" ||
                    path[path.length - 1] === "savedEvents" ||
                    path[path.length - 1] === "trackers" ? (
                    path[path.length - 1] === "trackedEvents" ? (
                      <>
                        {event?.isSaved ? (
                          <button
                          onClick={() => deleteEvent(event?.id)}
                          >
                           <BookmarkFilled fillColor={"var(--primary-color)"} />
                          </button>
                        ) : (
                          <button
                            onClick={() => saveEvent(event?.id)}
                            
                          >
                             <BookmarkIcon fillColor={"var(--secondary-text-color)"} />
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => deleteEvent(event?.id)}
                      >
                        <BookmarkFilled fillColor={"var(--primary-color)"} />
                      </button>
                    )
                  ) : (
                    <span
                      className={styles.save_image_container}
                      style={{cursor:"pointer"}}
                      onClick={() => handleModalOpen(event.id, event.eventGroupId)}
                    >
                      {bookmarkedEvent?.includes(event.id) ? (
                        <BookmarkFilled fillColor={"var(--primary-color)"} />
                      ) : (
                        <BookmarkIcon fillColor={"var(--secondary-text-color)"} />
                      )}
                    </span>
                  )} */}

                  {/* Optional Pin Section */}
                  {/* {isOpen == event.id && (
                    <div className={styles.modal}>
                      <header className={styles["modal_header"]}>
                        <div className={styles["modal_header-title"]}>
                          Do you want to participate in &quot;{event.name}&quot;?
                        </div>
                        <button
                          className={styles["close"]}
                          onClick={() => handleModalOpen(event.id, event.eventGroupId)}
                        >
                          <Image src={closeIcon} alt="clock" width={16} height={16} />
                        </button>
                      </header>
                      <main className={styles["modal_content"]}>
                        <form onSubmit={handleSubmit}>
                          <div id="field-1">
                            <div className={styles["form-check"]}>
                              {bookmarkedEvent?.includes(event.id) ? (
                                <>
                                  <input
                                    className={styles["form-check-input"]}
                                    type="radio"
                                    defaultValue="unbookmark"
                                    name={"interest"}
                                    id="customradio1"
                                    onChange={handleChangeIntent}
                                  />
                                  <label htmlFor="customradio1">Un-Bookmark</label>
                                </>
                              ) : (
                                <>
                                  <input
                                    className={styles["form-check-input"]}
                                    type="radio"
                                    defaultValue="bookmark"
                                    name={"interest"}
                                    id="customradio1"
                                    onChange={handleChangeIntent}
                                  />
                                  <label htmlFor="customradio1">Bookmark</label>
                                </>
                              )}
                            </div>
                            <div className={styles["form-check"]}>
                              <input
                                className={styles["form-check-input"]}
                                type="radio"
                                defaultValue="ATTENDEE"
                                name={"interest"}
                                id="customradio2"
                                onChange={handleChangeIntent}
                              />
                              <label htmlFor="customradio2">Attending</label>
                            </div>
                            <div className={styles["form-check"]}>
                              <input
                                className={styles["form-check-input"]}
                                type="radio"
                                defaultValue="SPEAKER"
                                name={"interest"}
                                id="customradio3"
                                onChange={handleChangeIntent}
                              />
                              <label htmlFor="customradio3">Speaking</label>
                            </div>
                            <div className={styles["form-check"]}>
                              <input
                                className={styles["form-check-input"]}
                                type="radio"
                                defaultValue="EXHIBITOR"
                                name={"interest"}
                                id="customradio4"
                                onChange={handleChangeIntent}
                              />
                              <label htmlFor="customradio4">Exhibiting</label>
                            </div>
                            <div className={styles["form-check"]}>
                              <input
                                className={styles["form-check-input"]}
                                type="radio"
                                defaultValue="SPONSOR"
                                name={"interest"}
                                id="customradio5"
                                onChange={handleChangeIntent}
                              />
                              <label htmlFor="customradio5">Sponsoring</label>
                            </div>
                          </div>
                          <button className={styles["submitBtn"]}>Submit</button>
                        </form>
                      </main>
                    </div>
                  )} */}

                  <MenuTrigger
                    onOpenChange={() =>
                      handleModalOpen(
                        event?.id,
                        event?.isSaved || bookmarkedEvent?.includes(event.id)
                          ? true
                          : false
                      )
                    }
                  >
                    <Button className={styles.dropdown_button}>
                      {path[path.length - 1] === "trackedEvents" ||
                      path[path.length - 1] === "savedEvents" ||
                      path[path.length - 1] === "trackers" ? (
                        path[path.length - 1] === "trackedEvents" ? (
                          <>
                            {event?.isSaved ? (
                              <BookmarkFilled
                                fillColor={"var(--primary-color)"}
                              />
                            ) : (
                              <BookmarkIcon
                                fillColor={"var(--secondary-text-color)"}
                              />
                            )}
                          </>
                        ) : (
                          <BookmarkFilled fillColor={"var(--primary-color)"} />
                        )
                      ) : bookmarkedEvent?.includes(event.id) ? (
                        <BookmarkFilled fillColor={"var(--primary-color)"} />
                      ) : (
                        <BookmarkIcon
                          fillColor={"var(--secondary-text-color)"}
                        />
                      )}
                    </Button>
                    <Popover
                      className={styles.interestPopover}
                      placement="left"
                    >
                      <Dialog className={styles.dialogBorder}>
                        {({ close }) => (
                          <div style={{ maxWidth: "500px" }}>
                            <header className={styles["modal_header"]}>
                              <div className={styles["modal_header-title"]}>
                                Choose an{" "}
                                <Link
                                  href="/internal/settings/product"
                                  className="text-primary hover:underline"
                                >
                                  Action
                                </Link>{" "}
                                to Proceed
                              </div>
                              <button
                                className={styles["close"]}
                                onClick={close}
                              >
                                <Image
                                  src={closeIcon}
                                  alt="clock"
                                  width={16}
                                  height={16}
                                />
                              </button>
                            </header>
                            <main className={styles["modal_content"]}>
                              <form onSubmit={(e) => handleSubmit(e, close)}>
                                <div id="field-1">
                                  {source === "trackers" && (
                                    <div className={styles["form-check"]}>
                                      {path[path.length - 1] ===
                                        "savedEvents" ||
                                      path[path.length - 1] === "trackers" ||
                                      event?.isSaved ||
                                      bookmarkedEvent?.includes(event.id) ? (
                                        <>
                                          <input
                                            className={
                                              styles["form-check-input"]
                                            }
                                            type="radio"
                                            defaultValue="unbookmark"
                                            name={"interest"}
                                            id="customradio1"
                                            onChange={handleChangeIntent}
                                          />
                                          <label htmlFor="customradio1">
                                            Un-Bookmark
                                          </label>
                                        </>
                                      ) : (
                                        <>
                                          <input
                                            className={
                                              styles["form-check-input"]
                                            }
                                            type="radio"
                                            defaultValue="bookmark"
                                            name={"interest"}
                                            id="customradio1"
                                            onChange={handleChangeIntent}
                                            checked={
                                              formData.markedInterest ===
                                                "bookmark" ||
                                              formData.markedInterest === null
                                            }
                                          />
                                          <label htmlFor="customradio1">
                                            Bookmark
                                          </label>
                                        </>
                                      )}
                                    </div>
                                  )}
                                  {coordinateActions.map(
                                    (item: any, index: number) => (
                                      <div
                                        className={styles["form-check"]}
                                        key={index}
                                      >
                                        <input
                                          className={styles["form-check-input"]}
                                          type="radio"
                                          defaultValue={item.status}
                                          name={"interest"}
                                          id={`radio-${item.status}`}
                                          onChange={handleChangeIntent}
                                        />
                                        <label htmlFor={`radio-${item.status}`}>
                                          {item.label}
                                        </label>
                                      </div>
                                    )
                                  )}
                                </div>
                                <button className={styles["submitBtn"]}>
                                  Submit
                                </button>
                              </form>
                            </main>
                          </div>
                        )}
                      </Dialog>
                    </Popover>
                  </MenuTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div
        className={`${styles.pagination_container} ${
          theme === "light" ? styles.pagination_container_light : ""
        }`}
      >
        <div className={styles.pagination_info_container}>
          <div>Showing</div>
          <Image src={ExpandAll} alt="expandall" className={iconClass} />
          <div className={styles.pagination_current_pageno}>
            <select
              onChange={handlePageItems}
              value={itemsPerPage}
              className={styles.pagination_noOfPage}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div>
            {totalEvents > 0 ? (
              <>
                {(currPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(totalEvents, currPage * itemsPerPage)}{" "}
                of {totalEvents} entries
              </>
            ) : (
              "0 entries"
            )}
          </div>
        </div>

        <div className={styles.pagination_page_control_container}>
          <div>Page</div>
          <div className={styles.pagination_current_page}>{currPage}</div>
          <div>of {totalPages}</div>
        </div>

        <div className={styles.pagination_buttons}>
          <button
            className={`${styles.pagination_control_button} ${
              currPage === 1 ? styles.disabled : ""
            }`}
            onClick={() => currPage > 1 && setCurrPage((page) => page - 1)}
            disabled={currPage === 1}
          >
            Previous
          </button>
          <button
            className={`${styles.pagination_control_button} ${
              currPage === totalPages ? styles.disabled : ""
            }`}
            onClick={() => currPage < totalPages && loadMoreHandler()}
            disabled={currPage === totalPages}
          >
            Next
          </button>
        </div>
      </div> */}

      {totalPages > 1 && (
        <div className="sticky bottom-0 bg-background py-4">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            count={totalEvents}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
