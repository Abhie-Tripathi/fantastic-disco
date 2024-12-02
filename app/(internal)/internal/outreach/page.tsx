"use client";
import React, { useState, useEffect, useRef, RefObject } from "react";
import styles from "./page.style.module.css";
import CardTask from "@/app/components/outreach/CardTask";
import EventDetail from "@/app/components/internal/eventdetail/EventDetail";
import { useTheme } from "@/context";
import { enquiryType } from "@/types/outreachEnquiryTypes";
import "react-toastify/dist/ReactToastify.css";
import useInfiniteScroll from '@/utils/useInfiniteScroll'
import Loading from "@/app/components/UI/Loading";
import { useCoordinateService } from "@/services/coordinateService";
import NullState from "@/app/components/trackers/nullState";
import coordinateNullState from "/public/coordinateNullState.svg"

const Page: React.FC = () => {
  const [shortlistedTasks, setShortlistedTasks] = useState<enquiryType[]>([]);
  const [outreachTasks, setOutreachTasks] = useState<enquiryType[]>([]);
  const [preFinalisedTasks, setPreFinalisedTasks] = useState<enquiryType[]>([]);
  const [data,setData]=useState([]);
  const [shortlistedCount,setShortlistedCount]=useState(0);
  const [inProgressCount,setInProgressCount]=useState(0);
  const [confirmedCount,setConfirmedCount]=useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [addEventModal, setAddEventModal] = useState(false);
  const { theme } = useTheme();
  // const [selectedConfirmed,setSelectedConfirmed]=useState([]);
  const [tabsVisible, setTabsVisible] = useState<string>("shortlist");
  const [enquiryId, setEnquiryId] = useState<string>("");
  const [singleEventId, setSingleEventId] = useState<string>("");
  const [currentEnquiryStatus, setCurrentEnquiryStatus] = useState<string>("");
  const [statusChanged, setStatusChanged] = useState<boolean>(false);
  const shortlistRef: RefObject<HTMLDivElement> = useRef(null);
  const [shortlistPage,setShortlistPage]=useState(1);
  const [noMoreShortlistData,setNoMoreShortlistData]=useState(false);
  const [shortlistSent,setShortlistSent]=useState([]);
  const inProgressRef: RefObject<HTMLDivElement> = useRef(null);
  const [inProgressPage,setInProgressPage]=useState(1);
  const [noMoreProgressData,setNoMoreProgressData]=useState(false);
  const confirmedRef: RefObject<HTMLDivElement> = useRef(null);
  const [confirmedPage,setConfirmedPage]=useState(1);
  const [noMoreConfirmData,setNoMoreConfirmData]=useState(false);

  const [dataLoaded, setDataLoaded] = useState<any>({
    shortlisted: false,
    outreach: false,
    preFinalised: false,
  });

  const coordinateService = useCoordinateService();

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
const handleScrollConfirmedEnd = () => {
  setTimeout(() => {
      if(!noMoreConfirmData) setConfirmedPage(prevPage => prevPage + 1);
  }, 1000);
};
useInfiniteScroll(inProgressRef, handleScrollProgressEnd); 
  useInfiniteScroll(shortlistRef, handleScrollEnd); 
  useInfiniteScroll(confirmedRef, handleScrollConfirmedEnd);
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
    
    // if(selectedShortlisted.length===10) setShortlistPage(prev=>prev+1);
    
    event.preventDefault();
    const taskName: enquiryType = JSON.parse(
      event.dataTransfer.getData("taskName")
    );
    const source = event.dataTransfer.getData("source_container");

    // To prevent adding the task into the same container
    if (target !== source) {
      
      if (target === 'shortlisted')
        taskName.enquiryStatus = 'SHORTLISTED'
      else if (target === 'outreach')
        taskName.enquiryStatus = 'IN_DISCUSSION'
      else if (target === 'nego')
        taskName.enquiryStatus = 'IN_NEGO'
      else if (target === 'prefinalised')
        taskName.enquiryStatus = 'CONFIRMED'
      
      if (source === "shortlisted") {
        
        setShortlistedTasks(
          shortlistedTasks.filter((task) => task.eventId !== taskName.eventId)
        );
        // setShortlistSent([...shortlistSent, taskName.enquiryId]);
        // setShortlistPage(1);
        // fetchShortlistData();
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
        // console.log(taskName.eventId, selectedConfirmed);
        // setSelectedConfirmed(selectedConfirmed.filter((item)=>item!==taskName.enquiryId))
        // setSelectedShortlisted([...selectedShortlisted, taskName.eventId]);
        setConfirmedCount(prev=>prev-1);
      }

      if (target === "shortlisted") {
        if(noMoreShortlistData){
          setShortlistedTasks([taskName,...shortlistedTasks]);
        }else{
            setShortlistedTasks([taskName,...shortlistedTasks.slice(0,-1)]);
        }
        setShortlistedCount(prev=>prev+1);
        changeEnquiryStatus("SHORTLISTED", taskName.enquiryId,source==="outreach"?"IN_NEGO,IN_DISCUSSION":source==="prefinalised"?"CONFIRMED":source==="canceled"?"CANCELED":"SHORTLISTED");
        setCurrentEnquiryStatus("SHORTLISTED");
        // setShortlistPage(1);
        // setShortlistedTasks([]);
        // fetchShortlistData();
      } else if (target === "outreach" || target === "nego") {
        if(noMoreProgressData){
          setOutreachTasks([taskName,...outreachTasks]);
        }else{
          setOutreachTasks([taskName,...outreachTasks.slice(0,-1)])
        }
        setInProgressCount(prev=>prev+1);
        changeEnquiryStatus(
          target === "outreach" ? "IN_DISCUSSION" : "IN_NEGO",
          taskName.enquiryId,
          source === "outreach"
            ? "IN_NEGO,IN_DISCUSSION"
            : source === "prefinalised"
            ? "CONFIRMED"
            : source === "canceled"
            ? "CANCELED"
            : "SHORTLISTED"
        );
        setCurrentEnquiryStatus("IN_NEGO")
      } else if (target === "prefinalised") {
        if(noMoreConfirmData){
          setPreFinalisedTasks([taskName,...preFinalisedTasks]);
        }else
        setPreFinalisedTasks([taskName,...preFinalisedTasks.slice(0,-1)]);
        setConfirmedCount(prev=>prev+1)
        changeEnquiryStatus("CONFIRMED", taskName.enquiryId,source==="outreach"?"IN_NEGO,IN_DISCUSSION":source==="prefinalised"?"CONFIRMED":source==="canceled"?"CANCELED":"SHORTLISTED");
        setCurrentEnquiryStatus("CONFIRMED")
      }else if(target==="canceled"){
        changeEnquiryStatus("CANCELLED", taskName.enquiryId,source==="outreach"?"IN_NEGO,IN_DISCUSSION":source==="prefinalised"?"CONFIRMED":source==="canceled"?"CANCELED":"SHORTLISTED");
        setCurrentEnquiryStatus("CANCELLED")
      }
    }
  };
  const singleCall=async(source:string)=>{
    if(source==="SHORTLISTED" && !noMoreShortlistData && shortlistedCount>10 || source==="IN_NEGO,IN_DISCUSSION" && !noMoreProgressData && inProgressCount>10 || source==="CONFIRMED" && !noMoreConfirmData && confirmedCount>10){

      const apiData = await coordinateService.getOutreachSingleEvent({
        offset: source === "SHORTLISTED" ? (shortlistPage-1)*10+9 : source==="IN_NEGO,IN_DISCUSSION" ? (inProgressPage - 1) * 10 + 9 : (confirmedPage-1)*10+9,
        status: source,
      });

    if (apiData) {
      source==="SHORTLISTED"?setShortlistedTasks(prev => [...prev, ...apiData.enquiryData]):source==="IN_NEGO,IN_DISCUSSION"?setOutreachTasks(prev => [...prev, ...apiData.enquiryData]): setPreFinalisedTasks(prev => [...prev, ...apiData.enquiryData])
    }
  }
  }
  const handleModal = (
    eventId: string,
    enquiryId: string | null = null,
    enquiryStatus: string | null = null,
    task:any
  ) => {
    if (enquiryId != "") {
      setEnquiryId(enquiryId ? enquiryId : "");
      setSingleEventId(eventId);
      setCurrentEnquiryStatus(enquiryStatus ? enquiryStatus : "");
    }
    setData(task);
    setModalOpen(!modalOpen);
  };

  const openAddModalHandler = () => {
    setAddEventModal((prev) => !prev);
  };

  const changeEnquiryStatus = async (
    changeStatusTo: string,
    enquiry_id: string,
    source:string
  ) => {
    if (enquiry_id && enquiry_id != "") {
      let payloadData = {
        enquiryId: enquiry_id,
        enquiryStatus: changeStatusTo,
      };
      try {
        const apiData: any = await coordinateService.setEnquiryStatus(payloadData);

        if (apiData?.message === "Data updated") {

          singleCall(
            source === "outreach"
              ? "IN_NEGO,IN_DISCUSSION"
              : source === "prefinalised"
              ? "CONFIRMED"
              : source === "canceled"
              ? "CANCELED"
              : "SHORTLISTED"
          );
          // toast.success("Enquiry status updated!", {
          //   position: "bottom-right",
          //   autoClose: 2000,
          //   closeButton: false,
          //   hideProgressBar: true,
          // });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  useEffect(()=>{
      fetchShortlistData();
  },[shortlistPage])
  useEffect(()=>{
    fetchInProgressData();
  },[inProgressPage])
  useEffect(()=>{
    fetchConfirmedData();
  },[confirmedPage])
  // useEffect(()=>{
  //   if(shortlistSent.length===8  && !noMoreShortlistData){
  //       setShortlistPage(prev=>prev+1);
  //   }
  // },[shortlistSent])
//   useEffect(() => {
//     if (shortlistPage>1 || inProgressPage>1 || confirmedPage>1 ) {
//         fetchData();
//     }
// }, [shortlistPage, inProgressPage, confirmedPage]);
  useEffect(() => {
    if (window.innerWidth > 576) {
      setTabsVisible("all");
    }
    // fetchData();
  }, [statusChanged]);
  const fetchShortlistData=async()=>{
    const shortlistApiData = await coordinateService.getOutreachEventList({
      offset: (shortlistPage-1) * 10,
      status: 'SHORTLISTED',
    });

    if (shortlistApiData) {
      setDataLoaded((prevState: any) => ({
        ...prevState,
        shortlisted: true,
      }));
      setShortlistedTasks(prev => [...prev, ...shortlistApiData.enquiryData]);
      setShortlistedCount(shortlistApiData.totalCount);
    
      if(shortlistApiData.enquiryData.length < 10 ) {
        setNoMoreShortlistData(true);
      }
    }
  }
  const fetchInProgressData=async()=>{
    const negoApiData = await coordinateService.getOutreachEventList({
      offset: (inProgressPage-1) * 10,
      status: 'IN_NEGO,IN_DISCUSSION',
    });

    if (negoApiData) {
      setDataLoaded((prevState: any) => ({
        ...prevState,
        outreach: true,
      }));
      setOutreachTasks(prev => [...prev, ...negoApiData.enquiryData]);
      setInProgressCount(negoApiData.totalCount);
    
      if(negoApiData.enquiryData.length<10){
      setNoMoreProgressData(true);
      }
    }
  }
  const fetchConfirmedData=async()=>{
      const confirmApiData = await coordinateService.getOutreachEventList({
        offset: (confirmedPage-1) * 10,
        status: 'CONFIRMED',
      });

      if (confirmApiData) {
        setDataLoaded((prevState: any) => ({
          ...prevState,
          preFinalised: true,
        }));
        setPreFinalisedTasks(prev => [...prev, ...confirmApiData.enquiryData]);
        setConfirmedCount(confirmApiData.totalCount);

        if(confirmApiData.enquiryData.length < 10 || confirmedCount===10) {
          setNoMoreConfirmData(true);
        }
      }
      
  }
  const handleDropdownSelect = (target: string, source: string) => {
    const mockEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: {
        getData: (key: string) => {
          if (key === "taskName") return JSON.stringify(data);
          if (key === "source_container") return source;
          return "";
        },
        setData: () => {}
      },
      nativeEvent: new Event("drop"),
      isDefaultPrevented: () => false,
      isPropagationStopped: () => false,
      persist: () => {}
    } as any;
    handleDrop(mockEvent, target);
  };

  useEffect(()=>{
    if(Math.ceil(shortlistedCount/10)===shortlistPage) setNoMoreShortlistData(true);
  },[shortlistedTasks])
  useEffect(()=>{
    if(Math.ceil(inProgressCount/10)===inProgressPage) setNoMoreProgressData(true);
  },[outreachTasks])

  if(!Object.values(dataLoaded).every(value => value === true)) {
    return (
      <div style={{ padding: "50px" }}>
        <Loading />
      </div>
    );
  }
  else if(shortlistedTasks.length == 0 &&  outreachTasks.length == 0 &&  preFinalisedTasks.length == 0) {
    return (
      <div className="p-20" >
        <NullState image={coordinateNullState}  title="You haven't shortlisted any events yet." text="Browse through our upcoming events and shortlist here for easy access and internal coordination later." buttonText="Search Events" buttonUrl={`/internal/search/events`} />
      </div>
    )
  }
  return (
    <>
      <div style={{width: 'calc(100vw - 70px)'}}>
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
                <div className="text-white font-medium text-base p-3 bg-[var(--primary-color-active)] rounded-t" >
                  Shortlisted{" "}
                  <span className="bg-white/10 px-3 py-1 text-sm rounded font-semibold border border-white/10 ml-2">{shortlistedCount}</span>
                </div>
              </div>
              <div
                className={`${styles.card_shortlisted} ${
                  styles.cardsContainer
                }  rounded-b p-3`}
                onDragOver={(event) => handleDragOver(event)}
                onDragStart={(event) =>
                  handleDragContainerStart(event, "shortlisted")
                }
                onDrop={(event) => handleDrop(event, "shortlisted")}
                ref={shortlistRef}
              >
                {shortlistedTasks.map((task, index) => (
                    <CardTask
                      key={index}
                      task={task}
                      name={task.eventName}
                      interests={task.userCountPerInterest}
                      draggable={true}
                      eventLocation={""}
                      eventCompany={task.orgName}
                      eventStartDate={task.startDate}
                      eventEndDate={task.endDate}
                      eventId={task.eventId}
                      enquiryId={task.enquiryId}
                      enquiryStatus={task.enquiryStatus}
                      onDragStart={(event) => handleDragStart(event, task)}
                      handleModal={handleModal}
                      onClick={openAddModalHandler}
                    />
                ))}
                {(noMoreShortlistData)  ? 
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
                <div className="text-white font-medium text-base p-3 bg-[var(--primary-color-active)] rounded-t" >
                  In Progress{" "}
                  <span className="bg-white/10 px-3 py-1 text-sm rounded font-semibold border border-white/10 ml-2">{inProgressCount}</span>
                </div>
              </div>
              <div
                className={`${styles.card_shortlisted} ${
                  styles.cardsContainer
                } rounded-b p-3`}
                onDragOver={(event) => handleDragOver(event)}
                onDragStart={(event) =>
                  handleDragContainerStart(event, "outreach")
                }
                onDrop={(event) => handleDrop(event, "outreach")}
                ref={inProgressRef}
              >
                {outreachTasks.map((task, index) => (
                    <CardTask
                      key={index}
                      name={task.eventName}
                      task={task}
                      interests={task.userCountPerInterest}
                      draggable={true}
                      eventLocation={""}
                      eventCompany={task.orgName}
                      eventStartDate={task.startDate}
                      eventEndDate={task.endDate}
                      eventId={task.eventId}
                      enquiryId={task.enquiryId}
                      enquiryStatus={task.enquiryStatus}
                      onDragStart={(event) => handleDragStart(event, task)}
                      handleModal={handleModal}
                      onClick={openAddModalHandler}
                    />
                ))}
                {(noMoreProgressData) ? 
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
              {/* <div className="desktop_view tablet_view">
                <div
                  className={`${styles.heading}`}
                >
                  Confirmed{" "}
                  <span className={styles.eventSize}>
                    {confirmedCount}
                  </span>
                </div>
              </div> */}
              <div className="desktop_view tablet_view">
                <div className="text-white font-medium text-base p-3 bg-[var(--primary-color-active)] rounded-t" >
                  Confirmed{" "}
                  <span className="bg-white/10 px-3 py-1 text-sm rounded font-semibold border border-white/10 ml-2">{confirmedCount}</span>
                </div>
              </div>
              <div
                className={`${styles.card_shortlisted} ${
                  styles.cardsContainer
                } rounded-b p-3`}
                onDragOver={(event) => handleDragOver(event)}
                onDragStart={(event) =>
                  handleDragContainerStart(event, "prefinalised")
                }
                onDrop={(event) => handleDrop(event, "prefinalised")}
                ref={confirmedRef}
              >
                {preFinalisedTasks.map((task, index) => (
                    <CardTask
                      key={index}
                      task={task}
                      name={task.eventName}
                      interests={task.userCountPerInterest}
                      draggable={true}
                      eventLocation={""}
                      eventCompany={task.orgName}
                      eventStartDate={task.startDate}
                      eventEndDate={task.endDate}
                      eventId={task.eventId}
                      enquiryId={task.enquiryId}
                      enquiryStatus={task.enquiryStatus}
                      onDragStart={(event) => handleDragStart(event, task)}
                      handleModal={handleModal}
                      onClick={openAddModalHandler}
                    />
                ))}
                {(noMoreConfirmData) ? 
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
            handleDropdownSelect={handleDropdownSelect}
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
    </>
  );
};

export default Page;
