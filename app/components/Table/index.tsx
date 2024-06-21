import React, { useEffect, useState } from "react";
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
import closeIcon from "/public/close.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@/context";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import { EventTableType } from "@/types/ListViewTable";
import { usePathname } from "next/navigation";

interface FormDataType {
  entityId_id?: string | number | null;
  markedInterest?: string | null;
  eventGroupId: string;
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

function getEventRank(rank: number) {
  let rankString = "";
  if (rank == 1) rankString = "st";
  else if (rank == 2) rankString = "nd";
  else if (rank == 3) rankString = "rd";
  else rankString = "th";
  return (
    <div style={{ textAlign: "center" }}>
      {rank}
      <sup>{rankString}</sup>
    </div>
  );
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

function getEstimatedExhibitors(item: estimatedExhibitorType): string {
  let result: string = "";

  if (item.type === "Tradeshow") {
    if (
      (item.stats.follows && item.stats.follows > 100) ||
      (item.stats.estimatedVisitors && item.stats.estimatedVisitors > 100)
    ) {
      result = "500+";
    } else if (
      (item.stats.follows &&
        item.stats.follows >= 1 &&
        item.stats.follows <= 100) ||
      (item.stats.estimatedVisitors &&
        item.stats.estimatedVisitors >= 1 &&
        item.stats.estimatedVisitors <= 100)
    ) {
      result = "100-500";
    } else {
      result = "20-100";
    }
  } else if (item.type === "Conference" || item.type === "Workshop") {
    if (item.stats.estimatedExhibitors && item.stats.estimatedExhibitors > 0) {
      result = item.stats.estimatedExhibitors.toString();
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
  eventType
}: {
  eventData?: any;
  showInsights: any;
  queryString?: string;
  eventType?:string;
}) => {
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const [currPage, setCurrPage] = useState(1);
  const [eventPerPage, setEventPerPage] = useState<EventTableType[]>([]);
  const path = usePathname().split('/')
  // const itemsPerPage = 10;
  // const totalPages = Math.ceil(eventData.length / itemsPerPage);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [pinEvent, setPinEvent] = useState<string>("1b27ff90-1a46-4f49-85eb-607b4d510eb1");
  const [bookmarkedEvent, setBookmarkedEvent] = useState<string[]>([]);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [formData, setFormData] = useState<FormDataType>({
    entityId_id: null,
    markedInterest: null,
    eventGroupId: '',
  });
  const handleChangeIntent = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, markedInterest: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.entityId_id && formData.markedInterest && formData.eventGroupId) {
      if (formData.markedInterest == 'bookmark') {
        let payloadData = {
          "eventGroupId":formData.eventGroupId,
        };
        try {
          const { data, error } = await myFetch(`${baseUrl}/tracker/saved-events`, {
            method: "POST",
            body: JSON.stringify(payloadData),
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (error) {
            console.log(error);
            return;
          }
          if (data) {
            toast.success('Event bookmarked successfully!', {
              position: 'bottom-right',
              autoClose: 2000,
              closeButton: false,
              hideProgressBar: true,
            });
            setBookmarkedEvent(prev => [...prev, formData.eventGroupId]);
          }
        } catch (error) {
          console.error('Error saving data:', error);
        } finally {
          setIsOpen(null);
        }
      } else if (formData.markedInterest == 'unbookmark') {
        try {
          let payloadData = {
            "eventGroupIds":[formData.eventGroupId],
          };
          const response = await myFetch(`${baseUrl}/tracker/saved-events`, {
            method: "DELETE",
            body: JSON.stringify(payloadData),
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response) {
            setBookmarkedEvent(prev => prev.filter(id => id !== formData.eventGroupId));
            toast.success('Bookmarked event removed!', {
              position: 'bottom-right',
              autoClose: 2000,
              closeButton: false,
              hideProgressBar: true,
            });
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsOpen(null);
        }
      } else {
        let payloadData = {
          source: "GTM",
          entityId: formData?.entityId_id,
          interest: formData?.markedInterest,
        };
        try {
          const apiUrl = baseUrl + "/userInterest";
          const apiData = await myFetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payloadData),
          });

          if (apiData.data.message == "Entry Created") {
            toast.success("Interest marked successfully!", {
              position: "bottom-right",
              autoClose: 2000,
              closeButton: false,
              hideProgressBar: true,
            });
            setIsOpen(null);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }
  };

  useEffect(() => {
    fetchEventsData();
    const startInd = (currPage - 1) * itemsPerPage;
    const endInd = startInd + itemsPerPage;
    // setEventPerPage(eventData.slice(startInd, endInd));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currPage, itemsPerPage, queryString]);

  useEffect(() => {
    const fetchBookmarkData = async () => {
      const { data, error } = await myFetch(`${baseUrl}/tracker/saved-events`);
      if (error) {
        console.log(error);
        return;
      }
      if (data) {
        let bookmarkGroupIds = data.result.map((event: any) => event.eventGroupId);
        setBookmarkedEvent(bookmarkGroupIds);
      }
    };
    fetchBookmarkData();
  }, []);

  const handleModalOpen = (eventId: string, eventGroupId: string) => {
    setIsOpen((prev) => (prev == eventId ? null : eventId));
    if (isOpen != eventId) {
      setFormData({ ...formData, entityId_id: eventId, eventGroupId: eventGroupId });
    } else {
      setFormData({ entityId_id: null, markedInterest: null, eventGroupId: '' });
    }
  };

  const handlePinEvent = (eventId: string) => {
    setPinEvent(eventId);
    toast.success('Event pinned successfully!', {
      position: 'bottom-right',
      autoClose: 2000,
      closeButton: false,
      hideProgressBar: true,
    });
  };

  const handlePageItems = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setItemsPerPage(parseInt(event.target.value));
  }
  const [isSaved,setIsSaved]=useState(false);
  const fetchSavedData=async()=>{
    setIsSaved(true);
    
    const secondLast = path[path.length - 2];
    const { data, error } = await myFetch(`${baseUrl}/tracker/${secondLast}/saved-events?max=${itemsPerPage}&offset=${(currPage - 1) * 10}`);
    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      console.log(data);
      // if (data?.events?.length > 0) {
        setEventPerPage(data.result);
        if (currPage === 1) {
          setTotalPages(Math.ceil(data.count / itemsPerPage));
          setEventPerPage(data.result);
        } else {
          setEventPerPage(data.result);
        
      }
      // }
      // setCatgeoryData(data);
    }
  }
  const fetchAllSavedEvent=async()=>{
    const { data, error } = await myFetch(`${baseUrl}/tracker/saved-events?max=${itemsPerPage}&offset=${(currPage - 1) * 10}`);
    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      // console.log(data);
      
      
        setEventPerPage(data.result);
      
          if (currPage === 1) {
            setTotalPages(Math.ceil(data.count / itemsPerPage));
            setEventPerPage(data.result);
          } else {
            setEventPerPage(data.result);
          
        }
      
      // setCatgeoryData(data);
    }
  }
  // const fetchAllSavedEvent=aync()=>{

  // }
  const fetchEventsData = async () => {
    if (path[path.length - 1] === 'trackedEvents') {
      const secondLast = path[path.length - 2];
      
      fetchData(secondLast);
      setIsLoaded(true);
    } 
    else if(path[path.length-1]==="trackers"){
      
      fetchAllSavedEvent();
      setIsLoaded(true);
    }
    else if(path[path.length - 1] === 'savedEvents'){
      console.log(1);
      
      fetchSavedData();
      setIsLoaded(true);
    }
    else {
      try {
        setIsLoaded(false);
        const apiUrl = `${baseUrl}/event/search?sortBy=score&sortType=desc&max=${itemsPerPage}&offset=${(currPage - 1) * 10}&${queryString}`;
        // const apiUrl = 'https://api.eventgeni.com/event/search?eventId=46e52e7e-1e0d-4422-a2dd-6033fe279ba6';
        const apiData = await myFetch(apiUrl, {
            method: "GET",
            headers: headers,
        });
        if(apiData.data) {
          if(currPage === 1) {
            setTotalPages(Math.ceil(apiData.data.stats.totalEvents / itemsPerPage));
            setEventPerPage(apiData.data.events);
          }else{
            setEventPerPage(apiData.data.events);
          }
        }else
          setEventPerPage([]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoaded(true);
      }
    }
  }
  useEffect(()=>{
    const secondLast = path[path.length - 2];
    if(path[path.length-1]==="trackedEvents")
    fetchData(secondLast);
  },[eventType])
  const fetchData = async (secondLast: string) => {
    var url=`${baseUrl}/tracker/${secondLast}/events?max=${itemsPerPage}&offset=${(currPage - 1) * 10}&type=active`;
    if(eventType==="New Events")
      url=`${baseUrl}/tracker/${secondLast}/events?max=${itemsPerPage}&offset=${(currPage - 1) * 10}`;
    else if(eventType==="Expired Events")
      url=`${baseUrl}/tracker/${secondLast}/events?max=${itemsPerPage}&offset=${(currPage - 1) * 10}&type=expired`;
    const { data, error } = await myFetch(url);
    if (error) {
      console.log(error);
      return;
    }
    if (currPage === 1) {
      setTotalPages(Math.ceil(data.totalEvents / itemsPerPage));
      setEventPerPage(data.events);
    } else {
      setEventPerPage(data.events);
    
  }
    if (data) {
      console.log(data);
      if (data?.events?.length > 0) {
        setEventPerPage(data.events);
      }
      // setCatgeoryData(data);
    }
  };

  // if (eventPerPage.length === 0) {
  //   return <Loading />;
  // }
  const [isSaving, setIsSaving] = useState(false);

  const saveEvent = async (groupId: string) => {
    if (isSaving) return;
  
   
    setIsSaving(true);
  
    const secondLast = path[path.length - 2];
    const dataToSend = {
      eventGroupId: groupId,
      trackerId: secondLast
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
        console.log(data);
      } else {
        console.log(error);
      }
    } catch (err) {
      console.error("Error saving event:", err);
    } finally {
      
      setIsSaving(false);
    }
  };
  
   const [isDelete, setIsDelete] = useState(false);

const deleteEvent = async (groupId: string) => {
  if (isDelete) return;
  setIsDelete(true);

  const url = `${baseUrl}/tracker/saved-events`;
  let dataToSend = {};

  if (path[path.length - 1] === "savedEvents") {
    const secondLast = path[path.length - 2];
    dataToSend = {
      eventGroupIds: [groupId],
      trackerId: secondLast,
    };
  } else {
    dataToSend = {
      eventGroupIds: [groupId],
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
      console.log(data);
      const newData = eventPerPage.filter(event => event?.eventGroupId !== groupId);
      setEventPerPage(newData);
    } else {
      console.log(error);
    }
  } catch (err) {
    console.error("Error deleting event:", err);
  } finally {
    setIsDelete(false);
  }
};

  if(!isLoaded) {
    return <Loading />;
  }else if(isLoaded && eventPerPage.length == 0){
    return (<div className={styles.noData} >No results containing all your search terms were found.</div>);
  }

  return (
    <div className={styles.table_container}>
      <div
        className={`${styles.table_wrapper} ${theme === "light" ? styles.table_wrapper_light : ""
          }`}
      >
        <table className={styles.table}>
          <thead
            className={`${styles.table_head} ${theme === "light" ? styles.table_head_light : ""
              }`}
          >
            <tr className={styles.table_head_row}>
              <th className={styles.table_firstColumn}>Event</th>
              <th>Date</th>
              <th>Venue</th>
              <th>City</th>
              <th>Country</th>
              {showInsights.eventKeywords && <th>Keywords</th>}
              <th>Category</th>
              {showInsights.eventSeries || eventPerPage[0]?.series  && <th>Event Series</th>}
              {showInsights.eventRank && <th>Rank</th>}
              {showInsights.growth && <th>Growth</th>}
              {showInsights.reptSent && <th>Rept. Sentiment</th>}
              {showInsights.repeatSent && <th>Repeat Sentiment</th>}
              {showInsights.eventSize && <th>Event Size</th>}
              {showInsights.estExhibit && <th>Est. Exhibitor</th>}
              {showInsights.global && <th>Global</th>}
              <th
                className={`${styles.table_actionColumn} ${styles.table_actionColumn_header
                  } ${theme === "light" ? styles.table_actionColumn_light : ""}`}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className={styles.table_body}>
            {eventPerPage.map((event: EventTableType) => (
              <tr key={event.id}>
                <td>
                  <Link
                    href={`/detailpage`}
                    style={{
                      textDecoration: "none",
                      color: theme === "light" ? "black" : "white",
                    }}
                  >
                    {event.name.length > 80
                      ? event.name.slice(0, 80) + "..."
                      : event.name}
                  </Link>
                  <div className={styles.event_organizer}>
                    {event.organizer.name}
                  </div>
                </td>
                <td>
                  <span
                    {...((event.status && event.status === "CANCELED")
                      ? { "data-toggle": "tooltip", title: "Cancelled" }
                      : null)}
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
                  </span>
                </td>
                <td>
                  {event.location.cityId !== '1' && event.format === 'ONLINE' ? (
                    event.location.venueName !== undefined &&
                      event.location.venueName !== null ? (
                      event.location.venueName.length > 15 ? (
                        <span
                          data-toggle="tooltip"
                          title={`${event.location.venueName} & Online`}
                        >
                          {event.location.venueName.slice(0, 15) + "…"}
                        </span>
                      ) : (
                        event.location.venueName + " & Online"
                      )
                    ) : (
                      <span data-toggle="tooltip" title="To be announced">
                        Online
                      </span>
                    )
                  ) : event.location.venueName !== undefined &&
                    event.location.venueName !== null ? (
                    event.location.venueName.length > 25 ? (
                      <span
                        data-toggle="tooltip"
                        title={event.location.venueName}
                      >
                        {event.location.venueName.slice(0, 15) + "…"}
                      </span>
                    ) : (
                      event.location.venueName
                    )
                  ) : event.location.cityId === '1' &&
                    (event.format === 'ONLINE' ||
                      event.location.venueName !== undefined) ? (
                    "Online"
                  ) : event.location.cityId !== '1' &&
                    event.location.venueName !== undefined ? (
                    <span data-toggle="tooltip" title="To be announced">
                      TBA
                    </span>
                  ) : null}
                </td>
                <td>{event.location.cityName}</td>
                <td>{event.location.countryName}</td>
                {showInsights.eventKeywords && (
                  <td>
                    {event.eventKeywords.length == 0 ? (
                      <>-</>
                    ) : event.eventKeywords.length == 1 ? (
                      event.eventKeywords[0]
                    ) : (
                      <>
                        {event.eventKeywords[0]}&nbsp;
                        <a
                          className={styles["products-list"]}
                          href="javascript:void(0)"
                          data-toggle="tooltip"
                          title={listProducts(event.eventKeywords)}
                        >
                          +{event.eventKeywords.length - 1}
                        </a>
                      </>
                    )}
                  </td>
                )}
                <td>
                  {/* Finance & Banking */}
                  {event.categories !== undefined && event.categories.length > 0 ? (
                    <span style={{ textTransform: "capitalize" }}>
                      {event.categories[0].name}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                {showInsights.eventSeries || event?.series && (
                  <td>
                    {event.series ? (
                      event.series

                    ) : (
                      "-"
                    )}
                  </td>
                )}
                {showInsights.eventRank && (
                  <td>
                    {event.rank?.globalRank ? (
                      <>
                        {getEventRank(event.rank.globalRank)}
                        <span className={styles.rank_tag}>
                          Global
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                )}
                {showInsights.growth && (
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
                      event.interestsGrowthRange
                    }
                    {(event.interestsGrowth == undefined || event.interestsGrowth == 0) &&
                      (event.interestsGrowthRange == undefined ||
                        event.interestsGrowthRange == 0) &&
                      "-"}
                  </td>
                )}
                {showInsights.reptSent && (
                  <td>
                    {event.stats.rating !== undefined &&
                      event.stats.rating !== null &&
                      event.stats.rating > '0' && (
                        <>
                          {getEventRating(event.stats.rating)}
                          &nbsp;
                          <Image src={StarIcon} alt="star" width={14} />
                        </>
                      )}
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
                    ) : event.stats.rating == undefined ? (
                      <>-</>
                    ) : (
                      <></>
                    )}
                  </td>
                )}
                {showInsights.repeatSent && (
                  <td>
                    {event.repeatSentiment && event.repeatSentiment != 0
                      ? event.repeatSentiment + "%"
                      : "-"}
                  </td>
                )}
                {showInsights.eventSize && <td>
                  {/* {getEventSize(event)} */}
                  {event.eventSize ? event.eventSize : '-'}
                </td>}
                {showInsights.estExhibit && (
                  <td>
                    {/* {getEstimatedExhibitors(event)} */}
                    {event.stats?.estimatedExhibitor ? event.stats?.estimatedExhibitor : '-'}
                  </td>
                )}
                {showInsights.global && (
                  <td>
                    {event["internationalAudience%"] !== undefined ? (
                      event["internationalAudience%"] == 'High' ? (
                        <span className={styles.badge_success}>High</span>
                      ) : event["internationalAudience%"] == 'Medium' ? (
                        <span className={styles.badge_primary}>Medium</span>
                      ) : event["internationalAudience%"] == 'Low' ? (
                        <span className={styles.badge_danger}>Low</span>
                      ) : <></>
                    ) : <></>}
                  </td>
                )}
                <td
                  className={`${styles.table_actionColumn} ${theme === "light" ? styles.table_actionColumn_light : ""
                    }`}
                >
                  {path[path.length - 1] === "trackedEvents" || path[path.length - 1] === "savedEvents" || path[path.length - 1] === "trackers" ? (
                    path[path.length - 1] === "trackedEvents" ? (
                      <button onClick={()=>saveEvent(event?.eventGroupId)} className={`${styles.table_saveBtn} ${theme === "light" ? styles.table_saveBtn_light : ""
                    }`}>Save</button>
                    ) : (
                      <button onClick={()=>deleteEvent(event?.eventGroupId)}  className={`${styles.table_saveBtn} ${theme === "light" ? styles.table_saveBtn_light : ""
                    }`}>Delete</button>
                    )
                  ) : (
                    <span
                      className={styles.save_image_container}
                      onClick={() => handleModalOpen(event.id, event.eventGroupId)}
                    >
                      {bookmarkedEvent?.includes(event.eventGroupId) ? (
                        <BookmarkIcon fillColor={"#ff851b"} />
                      ) : (
                        <BookmarkIcon fillColor={theme === "light" ? "#000000" : "#ffffff"} />
                      )}
                    </span>
                  )}

                  {/* <span onClick={() => handlePinEvent(event.id)}>
                    {event.id == pinEvent ? (
                      <PinIcon fillColor={"#ff851b"} />
                    ) : (
                      <PinIcon
                        fillColor={theme === "light" ? "#000000" : "#ffffff"}
                      />
                    )}
                  </span> */}
                  {isOpen == event.id && (
                    <div className={styles.modal}>
                      <header className={styles["modal_header"]}>
                        <div className={styles["modal_header-title"]}>
                          Do you want to participate in &quot;{event.name}&quot;
                          ?
                        </div>
                        <button
                          className={styles["close"]}
                          onClick={() =>
                            handleModalOpen(event.id, event.eventGroupId)
                          }
                        >
                          <Image src={closeIcon} alt="clock" width={16} height={16} />
                        </button>
                      </header>
                      <main className={styles["modal_content"]}>
                        <form onSubmit={handleSubmit}>
                          <div id="field-1">
                            <div className={styles["form-check"]}>
                              {bookmarkedEvent?.includes(event.eventGroupId) ?
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
                                </> :
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
                              }
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
                          <button className={styles["submitBtn"]}>
                            Submit
                          </button>
                        </form>
                      </main>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className={`${styles.pagination_container} ${theme === "light" ? styles.pagination_container_light : ""
          }`}
      >
        <div
          className={`${styles.pagination_control_button} ${currPage === 1 ? styles.disabled : ""
            }`}
          onClick={() => setCurrPage((page) => page - 1)}
        >
          Previous
        </div>

        <div className={styles.pagination_info_container}>
          <div>Showing</div>
          <Image src={ExpandAll} alt="expandall" className={iconClass} />
          <div className={styles.pagination_current_pageno}>
            <select onChange={handlePageItems} name="" id="" className={styles.pagination_noOfPage}>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
          <div>results/Page</div>
        </div>

        <div className={styles.pagination_page_control_container}>
          <div>Page</div>
          <div className={styles.pagination_current_page}>{currPage}</div>
          <div>of {totalPages}</div>
        </div>

        <div
          className={`${styles.pagination_control_button} ${currPage === totalPages ? styles.disabled : ""
            }`}
          onClick={() => setCurrPage((page) => page + 1)}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default Table;
