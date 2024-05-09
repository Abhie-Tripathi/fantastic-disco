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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@/context";

interface FormDataType {
  edition_id?: string | number | null;
  markedInterest?: string | null;
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

function listProducts(data: ProductsType[]) {
  const names = data.map((item) => item.name);
  const formattedString = names.join(" | ");
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

function getEventRating(item: ratingItemType): string {
  let averageRating = item.stats.rating;
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
  eventData,
  showInsights,
}: {
  eventData: any;
  showInsights: any;
}) => {
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const [currPage, setCurrPage] = useState(1);
  const [eventPerPage, setEventPerPage] = useState([]);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(eventData.length / itemsPerPage);
  const [pinEvent, setPinEvent] = useState<string | number>(918);
  const [bookmarkedEvent, setBookmarkedEvent] = useState<number[]>([
    1685, 5175,
  ]);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [formData, setFormData] = useState<FormDataType>({
    edition_id: null,
    markedInterest: null,
  });
  const handleChangeIntent = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, markedInterest: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let payloadData = {
      edition_id: formData?.edition_id,
      markedInterest: formData?.markedInterest,
      userId: "15602471",
      companyId: 1725,
    };
    const response = await fetch(`/api/research/markInterest`, {
      method: "POST",
      body: JSON.stringify(payloadData),
    });
    const apiResponse = await response.json();

    if (apiResponse.status.code == 1) {
      if (formData.markedInterest == "bookmark") {
        toast.success("Event bookmarked successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
      } else
        toast.success("Interest marked successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
      setIsOpen(null);
    }
  };

  useEffect(() => {
    const startInd = (currPage - 1) * itemsPerPage;
    const endInd = startInd + itemsPerPage;
    setEventPerPage(eventData.slice(startInd, endInd));
  }, [currPage]);

  const handleModalOpen = (eventId: string, editionId: string) => {
    setIsOpen((prev) => (prev == eventId ? null : eventId));
    if (isOpen != eventId) {
      setFormData({ ...formData, edition_id: editionId });
    } else {
      setFormData({ edition_id: null, markedInterest: null });
    }
  };

  const handlePinEvent = (eventId: string) => {
    setPinEvent(eventId);
    toast.success("Event pinned successfully!", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  if (eventPerPage.length === 0) {
    return <Loading />;
  }

  return (
    <div className={styles.table_container}>
      <div
        className={`${styles.table_wrapper} ${
          theme === "light" ? styles.table_wrapper_light : ""
        }`}
      >
        <table className={styles.table}>
          <thead
            className={`${styles.table_head} ${
              theme === "light" ? styles.table_head_light : ""
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
              {showInsights.eventRank && <th>Rank</th>}
              {showInsights.growth && <th>Growth</th>}
              {showInsights.reptSent && <th>Rept. Sentiment</th>}
              {showInsights.repeatSent && <th>Repeat Sentiment</th>}
              {showInsights.eventSize && <th>Event Size</th>}
              {showInsights.estExhibit && <th>Est. Exhibitor</th>}
              {showInsights.global && <th>Global</th>}
              <th
                className={`${styles.table_actionColumn} ${
                  styles.table_actionColumn_header
                } ${theme === "light" ? styles.table_actionColumn_light : ""}`}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className={styles.table_body}>
            {eventPerPage.map((event: any) => (
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
                    {...(event.status === "Cancelled"
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
                  {event.location.cityId !== 1 && event.onlineEvent === 1 ? (
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
                  ) : event.location.cityId === 1 &&
                    (event.onlineEvent === 1 ||
                      event.location.venueId === null) ? (
                    "Online"
                  ) : event.location.cityId !== 1 &&
                    event.location.venueId === null ? (
                    <span data-toggle="tooltip" title="To be announced">
                      TBA
                    </span>
                  ) : null}
                </td>
                <td>{event.location.cityName}</td>
                <td>{event.location.countryName}</td>
                {showInsights.eventKeywords && (
                  <td>
                    {event.product.length == 0 ? (
                      <>-</>
                    ) : event.product.length == 1 ? (
                      event.product[0].name
                    ) : (
                      <>
                        {event.product[0].name}&nbsp;
                        <a
                          className={styles["products-list"]}
                          href="javascript:void(0)"
                          data-toggle="tooltip"
                          title={listProducts(event.product)}
                        >
                          +{event.product.length - 1}
                        </a>
                      </>
                    )}
                  </td>
                )}
                <td>
                  {/* Finance & Banking */}
                  {event.category && event.category.length > 0 ? (
                    <span style={{ textTransform: "capitalize" }}>
                      {event.category[0].name}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                {showInsights.eventRank && (
                  <td>
                    {event.eventRank ? (
                      <>
                        {getEventRank(event.eventRank)}
                        <span className={styles.rank_tag}>
                          {event.rankType}
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                )}
                {showInsights.growth && (
                  <td>
                    {event.yoyGrowth && event.yoyGrowth != 0 ? (
                      event.yoyGrowth > 0 ? (
                        <div className={styles.text_green}>
                          {event.yoyGrowth}%{" "}
                          <Image src={UpArrow} alt="up" width={10} />
                        </div>
                      ) : (
                        <div className={styles.text_red}>
                          {event.yoyGrowth}%{" "}
                          <Image src={DownArrow} alt="down" width={10} />
                        </div>
                      )
                    ) : (
                      <></>
                    )}
                    {event.ex_ed_leads_following && (
                      <>{getGrowthRange(event.ex_ed_leads_following)}</>
                    )}
                    {(event.yoyGrowth == undefined || event.yoyGrowth == 0) &&
                      (event.ex_ed_leads_following == undefined ||
                        event.ex_ed_leads_following == 0) &&
                      "-"}
                  </td>
                )}
                {showInsights.reptSent && (
                  <td>
                    {event.stats.rating !== undefined &&
                      event.stats.rating !== null &&
                      event.stats.rating > 0 && (
                        <>
                          {getEventRating(event)}
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
                {showInsights.eventSize && <td>{getEventSize(event)}</td>}
                {showInsights.estExhibit && (
                  <td>{getEstimatedExhibitors(event)}</td>
                )}
                {showInsights.global && (
                  <td>
                    {event.internationalAudience !== undefined &&
                    event.internationalAudience !== null ? (
                      event.internationalAudience > 90 ? (
                        <span className={styles.badge_success}>High</span>
                      ) : event.internationalAudience >= 60 &&
                        event.internationalAudience <= 90 ? (
                        <span className={styles.badge_primary}>Medium</span>
                      ) : (
                        <span className={styles.badge_danger}>Low</span>
                      )
                    ) : (
                      <span className={styles.badge_danger}>Low</span>
                    )}
                  </td>
                )}
                <td
                  className={`${styles.table_actionColumn} ${
                    theme === "light" ? styles.table_actionColumn_light : ""
                  }`}
                >
                  <span
                    className={styles.save_image_container}
                    onClick={() => handleModalOpen(event.id, event.edition)}
                  >
                    {bookmarkedEvent.includes(event.id) ? (
                      <BookmarkIcon fillColor={"#ff851b"} />
                    ) : (
                      <BookmarkIcon
                        fillColor={theme === "light" ? "#000000" : "#ffffff"}
                      />
                    )}
                  </span>
                  <span onClick={() => handlePinEvent(event.id)}>
                    {event.id == pinEvent ? (
                      <PinIcon fillColor={"#ff851b"} />
                    ) : (
                      <PinIcon
                        fillColor={theme === "light" ? "#000000" : "#ffffff"}
                      />
                    )}
                  </span>
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
                            handleModalOpen(event.id, event.edition)
                          }
                        >
                          <Image src="/close.svg" alt="close" />
                        </button>
                      </header>
                      <main className={styles["modal_content"]}>
                        <form onSubmit={handleSubmit}>
                          <div id="field-1">
                            <div className={styles["form-check"]}>
                              <input
                                className={styles["form-check-input"]}
                                type="radio"
                                defaultValue="bookmark"
                                name={"interest"}
                                id="customradio1"
                                onChange={handleChangeIntent}
                              />
                              <label htmlFor="customradio1">Bookmark</label>
                            </div>
                            <div className={styles["form-check"]}>
                              <input
                                className={styles["form-check-input"]}
                                type="radio"
                                defaultValue="visitor"
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
                                defaultValue="speaker"
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
                                defaultValue="exhibitor"
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
                                defaultValue="sponsor"
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
        className={`${styles.pagination_container} ${
          theme === "light" ? styles.pagination_container_light : ""
        }`}
      >
        <div
          className={`${styles.pagination_control_button} ${
            currPage === 1 ? styles.disabled : ""
          }`}
          onClick={() => setCurrPage((page) => page - 1)}
        >
          Previous
        </div>

        <div className={styles.pagination_info_container}>
          <div>Showing</div>
          <Image src={ExpandAll} alt="expandall" className={iconClass} />
          <div className={styles.pagination_current_pageno}>
            <select name="" id="" className={styles.pagination_noOfPage}>
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
          className={`${styles.pagination_control_button} ${
            currPage === totalPages ? styles.disabled : ""
          }`}
          onClick={() => setCurrPage((page) => page + 1)}
        >
          Next
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Table;
