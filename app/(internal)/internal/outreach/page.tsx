"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./page.style.module.css";
import CardTask from "@/app/components/outreach/CardTask";
import EventDetail from "@/app/components/internal/eventdetail/EventDetail";
import { useTheme } from "@/context";
import { enquiryType } from "@/types/outreachEnquiryTypes";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useInfiniteScroll from '@/utils/useInfiniteScroll'
import Loading from "@/app/components/UI/Loading";
const Page: React.FC = () => {
  const [shortlistedTasks, setShortlistedTasks] = useState<enquiryType[]>([]);
  const [outreachTasks, setOutreachTasks] = useState<enquiryType[]>([]);
  const [preFinalisedTasks, setPreFinalisedTasks] = useState<enquiryType[]>([]);
  const [shortlistedCount,setShortlistedCount]=useState(0);
  const [inProgressCount,setInProgressCount]=useState(0);
  const [confirmedCount,setConfirmedCount]=useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [addEventModal, setAddEventModal] = useState(false);
  const { theme } = useTheme();

  const [tabsVisible, setTabsVisible] = useState<string>("shortlist");
  const [enquiryId, setEnquiryId] = useState<string>("");
  const [singleEventId, setSingleEventId] = useState<string>("");
  const [currentEnquiryStatus, setCurrentEnquiryStatus] = useState<string>("");
  const [statusChanged, setStatusChanged] = useState<boolean>(false);
  const shortlistRef: RefObject<HTMLDivElement> = useRef(null);
  const [shortlistPage,setShortlistPage]=useState(1);
  const [noMoreShortlistData,setNoMoreShortlistData]=useState(false);
  const inProgressRef: RefObject<HTMLDivElement> = useRef(null);
  const [inProgressPage,setInProgressPage]=useState(1);
  const [noMoreProgressData,setNoMoreProgressData]=useState(false);
  const handleScrollEnd = () => {
    setTimeout(() => {
        if(!noMoreShortlistData) setShortlistPage(prevPage => prevPage + 1);
    }, 1000);
};
const handleScrollProgressEnd = () => {
  setTimeout(() => {
      if(!noMoreProgressData) setInProgressPage(prevPage => prevPage + 1);
  }, 1000);
};
useInfiniteScroll(inProgressRef, handleScrollProgressEnd); 
  useInfiniteScroll(shortlistRef, handleScrollEnd); 
  const handleRefresh = () => {
    setStatusChanged(!statusChanged);
  };

  const handleVisibleTab = (item: string) => {
    setTabsVisible(item);
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    taskName: enquiryType
  ) => {
    const t_data = JSON.stringify(taskName);
    event.dataTransfer.setData("taskName", t_data);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragContainerStart = (
    event: React.DragEvent<HTMLDivElement>,
    source: string
  ) => {
    event.dataTransfer.setData("source_container", source);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    target: string
  ) => {
    event.preventDefault();
    const taskName: enquiryType = JSON.parse(
      event.dataTransfer.getData("taskName")
    );
    const source = event.dataTransfer.getData("source_container");

    // To prevent adding the task into the same container
    if (target !== source) {
      if (source === "shortlisted") {
        setShortlistedTasks(
          shortlistedTasks.filter((task) => task.eventId !== taskName.eventId)
        );
        setShortlistedCount(prev=>prev-1)
      } else if (source === "outreach") {
        setOutreachTasks(
          outreachTasks.filter((task) => task.eventId !== taskName.eventId)
        );
        setInProgressCount(prev=>prev-1);
      } else if (source === "prefinalised") {
        setPreFinalisedTasks(
          preFinalisedTasks.filter((task) => task.eventId !== taskName.eventId)
        );
        setConfirmedCount(prev=>prev-1);
      }

      if (target === "shortlisted") {
        setShortlistedTasks([...shortlistedTasks, taskName]);
        setShortlistedCount(prev=>prev+1);
        changeEnquiryStatus("SHORTLISTED", taskName.enquiryId);
      } else if (target === "outreach") {
        setOutreachTasks([...outreachTasks, taskName]);
        setInProgressCount(prev=>prev+1);
        changeEnquiryStatus("IN_NEGO", taskName.enquiryId);
      } else if (target === "prefinalised") {
        setPreFinalisedTasks([...preFinalisedTasks, taskName]);
        setConfirmedCount(prev=>prev+1)
        changeEnquiryStatus("CONFIRMED", taskName.enquiryId);
      }
    }
  };

  const handleModal = (
    eventId: string,
    enquiryId: string | null = null,
    enquiryStatus: string | null = null
  ) => {
    if (enquiryId != "") {
      setEnquiryId(enquiryId ? enquiryId : "");
      setSingleEventId(eventId);
      setCurrentEnquiryStatus(enquiryStatus ? enquiryStatus : "");
    }
    setModalOpen(!modalOpen);
  };

  const openAddModalHandler = () => {
    setAddEventModal((prev) => !prev);
  };

  const changeEnquiryStatus = async (
    changeStatusTo: string,
    enquiry_id: string
  ) => {
    if (enquiry_id && enquiry_id != "") {
      let payloadData = {
        enquiryId: enquiry_id,
        enquiryStatus: changeStatusTo,
      };
      try {
        const apiUrl = baseUrl + "/userInterest/enquiry";
        const apiData = await myFetch(apiUrl, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify(payloadData),
        });
        if (apiData.data.message === "Data updated") {
          toast.success("Enquiry status updated!", {
            position: "bottom-right",
            autoClose: 2000,
            closeButton: false,
            hideProgressBar: true,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  useEffect(() => {
    if (shortlistPage || inProgressPage) {
        fetchData();
    }
}, [shortlistPage, inProgressPage]);
  useEffect(() => {
    if (window.innerWidth > 576) {
      setTabsVisible("all");
    }
    // fetchData();
  }, [statusChanged]);
  const fetchData = async () => {
    const shortlistApiData = await myFetch(
      `${baseUrl}/userInterest/enquiry?status=SHORTLISTED&limit=10&offset=${(shortlistPage-1)*10}`,
      {
        method: "GET",
        headers: headers,
      }
    );
    const negoApiData = await myFetch(
      `${baseUrl}/userInterest/enquiry?status=IN_NEGO&limit=10&offset=${(inProgressPage-1)*10}`,
      {
        method: "GET",
        headers: headers,
      }
    );
    const confirmApiData = await myFetch(
      baseUrl + "/userInterest/enquiry?status=CONFIRMED&limit=10&offset=0",
      {
        method: "GET",
        headers: headers,
      }
    );
    if (shortlistApiData.data){
      setShortlistedTasks(prev => [...prev, ...shortlistApiData.data.enquiryData]);
      setShortlistedCount(shortlistApiData.data.totalCount);
    }
    if(shortlistApiData.data.enquiryData<10){
      setNoMoreShortlistData(true);
    }
    if (negoApiData.data) {
      setOutreachTasks(prev => [...prev, ...negoApiData.data.enquiryData]);
      setInProgressCount(negoApiData.data.totalCount);
    }
    if(negoApiData.data.enquiryData.length<10){
     setNoMoreProgressData(true);
    }
    if (confirmApiData.data){
      setPreFinalisedTasks(confirmApiData.data.enquiryData);
      setConfirmedCount(confirmApiData.data.totalCount);
    }
  };
  return (
    <div
      className={`${styles.bodyContainer} ${
        theme === "dark" ? "dark" : "light"
      } ${modalOpen && styles.bodyContainer_openModal}`}
    >
      <div>
        <div className="mobile_view">
          <div className={styles.mobileTab}>
            <div
              onClick={() => handleVisibleTab("shortlist")}
              className={`${styles.heading} ${tabsVisible == "shortlist" ? styles.tabActive : ""}`}
            >
              Shortlisted{" "}
              <span className={styles.eventSize}>
                {shortlistedCount}
              </span>
            </div>
            <span className={styles.seprator}></span>
            <div
              onClick={() => handleVisibleTab("outreach")}
              className={`${styles.heading} ${tabsVisible == "outreach" ? styles.tabActive : ""}`}
            >
              In Progress{" "}
              <span className={styles.eventSize}>{outreachTasks.length}</span>
            </div>
            <span className={styles.seprator}></span>
            <div
              onClick={() => handleVisibleTab("preFinal")}
              className={`${styles.heading} ${tabsVisible == "preFinal" ? styles.tabActive : ""}`}
            >
              Confirmed{" "}
              <span className={styles.eventSize}>
                {preFinalisedTasks.length}
              </span>
            </div>
          </div>
        </div>
        <div className={`${styles.taskBody}`}>
          {(tabsVisible == "shortlist" || tabsVisible == "all") && (
            <div className={`${styles.outerCard}`}>
              <div className="desktop_view tablet_view">
                <div
                  className={`${styles.heading}`}
                >
                  Shortlisted{" "}
                  <span className={styles.eventSize}>
                    {shortlistedCount}
                  </span>
                </div>
              </div>
              <div
                className={`${styles.card_shortlisted} ${
                  styles.cardsContainer
                }`}
                onDragOver={(event) => handleDragOver(event)}
                onDragStart={(event) =>
                  handleDragContainerStart(event, "shortlisted")
                }
                onDrop={(event) => handleDrop(event, "shortlisted")}
                ref={shortlistRef}
              >
                {shortlistedTasks.map((task, index) => (
                  <div className={styles.cards} key={index}>
                    <CardTask
                      key={index}
                      name={task.eventName}
                      interests={task.userCountPerInterest}
                      draggable={true}
                      eventLocation={""}
                      eventCompany={task.orgName}
                      eventStartDate={task.startDate}
                      eventEndDate={task.endDate}
                      eventId={task.eventId}
                      enquiryId={task.enquiryId}
                      enquiryStatus="SHORTLISTED"
                      onDragStart={(event) => handleDragStart(event, task)}
                      handleModal={handleModal}
                      onClick={openAddModalHandler}
                    />
                  </div>
                ))}
                {noMoreShortlistData ? 
        <></> : <Loading />
    }
                {/* <div
                  className={`${styles.addEvent_btn} ${
                    theme === "light" ? styles.addEvent_btn_light : ""
                  }`}
                  onClick={openAddModalHandler}
                >
                  Add Event
                </div> */}
              </div>
            </div>
          )}
          {(tabsVisible == "outreach" || tabsVisible == "all") && (
            <div className={`${styles.outerCard} `}>
              <div className="desktop_view tablet_view">
                <div
                  className={`${styles.heading}`}
                >
                  In Progress{" "}
                  <span className={styles.eventSize}>
                    {inProgressCount}
                  </span>
                </div>
              </div>
              <div
                className={`${styles.card_shortlisted} ${
                  styles.cardsContainer
                }`}
                onDragOver={(event) => handleDragOver(event)}
                onDragStart={(event) =>
                  handleDragContainerStart(event, "outreach")
                }
                onDrop={(event) => handleDrop(event, "outreach")}
                ref={inProgressRef}
              >
                {outreachTasks.map((task, index) => (
                  <div className={styles.cards} key={index}>
                    <CardTask
                      key={index}
                      name={task.eventName}
                      interests={task.userCountPerInterest}
                      draggable={true}
                      eventLocation={""}
                      eventCompany={task.orgName}
                      eventStartDate={task.startDate}
                      eventEndDate={task.endDate}
                      eventId={task.eventId}
                      enquiryId={task.enquiryId}
                      enquiryStatus="IN PROGRESS"
                      onDragStart={(event) => handleDragStart(event, task)}
                      handleModal={handleModal}
                      onClick={openAddModalHandler}
                    />
                  </div>
                ))}
                {noMoreProgressData ? 
        <></> : <Loading />
    }
                {/* <div
                  className={`${styles.addEvent_btn} ${
                    theme === "light" ? styles.addEvent_btn_light : ""
                  }`}
                  onClick={openAddModalHandler}
                >
                  Add Event
                </div> */}
              </div>
            </div>
          )}
          {(tabsVisible == "preFinal" || tabsVisible == "all") && (
            <div className={`${styles.outerCard}`}>
              <div className="desktop_view tablet_view">
                <div
                  className={`${styles.heading}`}
                >
                  Confirmed{" "}
                  <span className={styles.eventSize}>
                    {confirmedCount}
                  </span>
                </div>
              </div>
              <div
                className={`${styles.card_shortlisted} ${
                  styles.cardsContainer
                }`}
                onDragOver={(event) => handleDragOver(event)}
                onDragStart={(event) =>
                  handleDragContainerStart(event, "prefinalised")
                }
                onDrop={(event) => handleDrop(event, "prefinalised")}
              >
                {preFinalisedTasks.map((task, index) => (
                  <div className={styles.cards} key={index}>
                    <CardTask
                      key={index}
                      name={task.eventName}
                      interests={task.userCountPerInterest}
                      draggable={true}
                      eventLocation={""}
                      eventCompany={task.orgName}
                      eventStartDate={task.startDate}
                      eventEndDate={task.endDate}
                      eventId={task.eventId}
                      enquiryId={task.enquiryId}
                      enquiryStatus="CONFIRMED"
                      onDragStart={(event) => handleDragStart(event, task)}
                      handleModal={handleModal}
                      onClick={openAddModalHandler}
                    />
                  </div>
                ))}
                {/* <div
                  className={`${styles.addEvent_btn} ${
                    theme === "light" ? styles.addEvent_btn_light : ""
                  }`}
                  onClick={openAddModalHandler}
                >
                  Add Event
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
      {modalOpen && (
        <div
          className={`${styles.modal} ${
            theme === "light" ? styles.modal_light : ""
          }`}
        >
          <EventDetail
            openEventDetails={false}
            openOrganiserDetails={true}
            openPocDetails={true}
            closeBtn={true}
            handleModal={handleModal}
            eventId={singleEventId}
            enquiryId={enquiryId ? enquiryId : ""}
            handleRefresh={handleRefresh}
            currentEnquiryStatus={
              currentEnquiryStatus ? currentEnquiryStatus : ""
            }
            openEventRequest={false}
          />
        </div>
      )}
      {addEventModal && (
        <div
          className={`${styles.modal2} ${
            theme === "light" ? styles.modal_light : ""
          }`}
          onClick={(e) => {
            console.log(e);
            const targetElement = e.target as HTMLElement;
            if (
              targetElement.classList.contains(styles.modal2) ||
              targetElement.classList.contains(styles.bodyContainer)
            )
              openAddModalHandler();
          }}
        >
          {/* <AddEventForm /> */}
        </div>
      )}
    </div>
  );
};

export default Page;
