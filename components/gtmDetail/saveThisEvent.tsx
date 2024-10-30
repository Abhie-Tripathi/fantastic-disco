import styles from "@/app/components/Table/table.module.css";
import React, { useEffect, useRef, useState } from "react";
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
import { usePathname } from "next/navigation";
import { showToast } from "@/utils/showToast";
import { GAEvent } from "@/utils/GAEvent";
import { Toaster } from "@/components/ui/toaster";
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
import { GTMEventDetail } from "@/types/events";
import { Bookmark } from "lucide-react";
import { useEventsService } from "@/services/eventsService";
import { error } from "console";
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

const SaveThisEvent = ({ eventDetails }: { eventDetails: GTMEventDetail }) => {
  const { id, name } = eventDetails;
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

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
  const [totalPages, setTotalPages] = useState<number>(1);
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
  const handleChangeIntent = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, markedInterest: value });
  };
  const isInitialRender = useRef(true);
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

  // useEffect(()=>{
  //   const secondLast = path[path.length - 2];
  //   if(currPage!==1)
  //   fetchData(secondLast);
  // },[currPage])

  const handleModalOpen = (eventId: string, bookmarkedStatus: boolean) => {
    GAEvent("research", "Filters", "Saved Event | Viewed", "Saved Event");
    // setIsOpen((prev) => (prev == eventId ? null : eventId));
    setFormData({
      ...formData,
      entityId_id: eventId,
      markedInterest: bookmarkedStatus ? null : "bookmark",
    });
  };
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
  }, []);
  const [isSaved, setIsSaved] = useState(false);
  const fetchSavedData = async () => {
    setIsSaved(true);

    const secondLast = path[path.length - 2];
    const { data, error } = await myFetch(
      `${baseUrl}/tracker/${secondLast}/saved-events?max=${itemsPerPage}&offset=${
        (currPage - 1) * 10
      }`
    );
    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      console.log(data);
      setIsLoaded(true);
      GAEvent("trackers", "Tracker", "View", `Saved Event | ${currPage}`);
      // if (data?.events?.length > 0) {
      setEventPerPage(data.result);
      setTotalEvents(data.count);
      if (currPage === 1) {
        setTotalPages(Math.ceil(data.count / itemsPerPage));
        setEventPerPage(data.result);
      } else {
        setEventPerPage(data.result);
      }
      // }
      // setCatgeoryData(data);
    }
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
        setTotalPages(Math.ceil(data.count / itemsPerPage));
        setEventPerPage(data.result);
      } else {
        setEventPerPage(data.result);
      }

      // setCatgeoryData(data);
    }
  };
  // const fetchAllSavedEvent=aync()=>{

  // }
  // const [isSaving, setIsSaving] = useState(false);

  const saveEvent = async (Id: string) => {
    // if (isSaving) return;

    // setIsSaving(true);

    const secondLast = path[path.length - 2];
    const dataToSend = {
      eventId: Id,
      trackerId: secondLast,
    };

    const url = `${baseUrl}/tracker/saved-events`;

    try {
      const { data, error } = await myFetch(url, {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data) {
        showToast("success", "Event saved");
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
        showToast("error", error.message);
      }
    } catch (err) {
      console.error("Error saving event:", err);
      showToast("error", "Please try again later.");
    }
    // finally {
    //   setIsSaving(false);
    // }
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
      const { data, error } = await myFetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (data) {
        if (path[path.length - 1] === "savedEvents") {
          console.log(data);
          showToast("error", "Saved event deleted");
          const newData = eventPerPage.filter((event) => event?.id !== groupId);
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
      } else {
        console.log(error);
        showToast("error", error.message);
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      // showToast('error',err?.message);
    }
    // finally {
    //   setIsDelete(false);
    // }
  };

  const { bookmarkThisEvent } = useEventsService();

  const handleSaveEvent = () => {
    try {
      bookmarkThisEvent(id)
        .then((response) => {
          if (response) {
            toast.success("Event Saved Successfully", {
              position: "bottom-center",
              autoClose: 2000,
              closeButton: true,
              hideProgressBar: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          toast.info("Event already saved", {
            position: "bottom-center",
            autoClose: 2000,
            closeButton: true,
            hideProgressBar: true,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MenuTrigger>
      <Button
        onPress={handleSaveEvent}
        className="border border-[#6750A4] rounded-md text-[#6750A4] flex justify-center py-2 px-4 gap-2 items-center w-fit"
      >
        <Bookmark width={15} height={15} className="w-5 h-5" />
        Save this event
      </Button>
      {/* <Popover className={styles.interestPopover} placement="left">
        <Dialog className={styles.dialogBorder}>
          {({ close }) => (
            <div style={{ maxWidth: "500px" }}>
              <header className={styles["modal_header"]}>
                <div className={styles["modal_header-title"]}>
                  Do you want to participate in &quot;{name}&quot;?
                </div>
                <button className={styles["close"]} onClick={close}>
                  <Image src={closeIcon} alt="clock" width={16} height={16} />
                </button>
              </header>
              <main className={styles["modal_content"]}>
                <form onSubmit={(e) => handleSubmit(e, close)}>
                  <div id="field-1">
                    <div className={styles["form-check"]}>
                      <>
                        <input
                          className={styles["form-check-input"]}
                          type="radio"
                          defaultValue="bookmark"
                          name={"interest"}
                          id="customradio1"
                          onChange={handleChangeIntent}
                          checked={
                            formData.markedInterest === "bookmark" ||
                            formData.markedInterest === null
                          }
                        />
                        <label htmlFor="customradio1">Bookmark</label>
                      </>
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
                      <label htmlFor="customradio2">Attend</label>
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
                      <label htmlFor="customradio3">Speak</label>
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
                      <label htmlFor="customradio4">Exhibit</label>
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
                      <label htmlFor="customradio5">Sponsor</label>
                    </div>
                  </div>
                  <button className={styles["submitBtn"]}>Submit</button>
                </form>
              </main>
            </div>
          )}
        </Dialog>
      </Popover> */}
    </MenuTrigger>
  );
};
export default SaveThisEvent;
