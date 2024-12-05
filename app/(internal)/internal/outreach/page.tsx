"use client";
import React, { useState, useEffect, useRef, RefObject } from "react";
import styles from "./page.style.module.css";
import EventDetail from "@/app/components/internal/eventdetail/EventDetail";
import { useTheme } from "@/context";
import { enquiryType } from "@/types/outreachEnquiryTypes";
import useInfiniteScroll from "@/utils/useInfiniteScroll";
import Loading from "@/app/components/UI/Loading";
import { useCoordinateService } from "@/services/coordinateService";
import NullState from "@/app/components/trackers/nullState";
import coordinateNullState from "/public/coordinateNullState.svg";
import PipelineCol from "@/app/components/outreach/pipelineCol";

interface taskDetailType {
  [task: string]: {
    label: string;
    data: enquiryType[];
    count: number;
    dataLoaded?: boolean;
    noMoreData?: boolean;
  };
}

const Page: React.FC = () => {
  const [shortlistedTasks, setShortlistedTasks] = useState<enquiryType[]>([]);
  const [outreachTasks, setOutreachTasks] = useState<enquiryType[]>([]);
  const [preFinalisedTasks, setPreFinalisedTasks] = useState<enquiryType[]>([]);
  const [data, setData] = useState([]);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [addEventModal, setAddEventModal] = useState(false);
  const { theme } = useTheme();
  // const [selectedConfirmed,setSelectedConfirmed]=useState([]);
  const [tabsVisible, setTabsVisible] = useState<string>("shortlist");
  const [enquiryId, setEnquiryId] = useState<string>("");
  const [singleEventId, setSingleEventId] = useState<string>("");
  const [currentEnquiryStatus, setCurrentEnquiryStatus] = useState<string>("");
  const [statusChanged, setStatusChanged] = useState<boolean>(false);
  const [shortlistPage, setShortlistPage] = useState(1);
  const [noMoreShortlistData, setNoMoreShortlistData] = useState(false);
  const [inProgressPage, setInProgressPage] = useState(1);
  const [noMoreProgressData, setNoMoreProgressData] = useState(false);
  const [confirmedPage, setConfirmedPage] = useState(1);
  const [noMoreConfirmData, setNoMoreConfirmData] = useState(false);

  const [dataLoaded, setDataLoaded] = useState<any>({
    shortlisted: false,
    outreach: false,
    preFinalised: false,
  });

  const coordinateService = useCoordinateService();

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

  const handleDrop2 = (
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
      taskName.enquiryStatus = target;

      // Remove from source container
      setTaskDetail(prevState => ({
        ...prevState,
        [source]: {
          ...prevState[source],
          data: prevState[source].data?.filter((task) => task.eventId !== taskName.eventId),
          count: prevState[source].count - 1,
        },
      }));

      // Add in target container
      setTaskDetail(prevState => ({
        ...prevState,
        [target]: {
          ...prevState[target],
          data: prevState[target].noMoreData ? [taskName, ...prevState[target].data] : [taskName, ...prevState[target].data.slice(0, -1)],
          count: prevState[target].count + 1,
        },
      }));
      changeEnquiryStatus(target, taskName.enquiryId, source);
    }
  };

  const singleCall2 = async (source: string) => {
    if( taskDetail[source].count > 10 && !taskDetail[source].noMoreData ) {
      const apiData = await coordinateService.getOutreachSingleEvent({
        offset:
          source === "SHORTLISTED"
            ? (shortlistPage - 1) * 10 + 9
            : source === "IN_NEGO,IN_DISCUSSION"
            ? (inProgressPage - 1) * 10 + 9
            : (confirmedPage - 1) * 10 + 9,
        status: source,
      });
      if (apiData) {
        setTaskDetail(prevState => ({
          ...prevState,
          [source]: {
            ...prevState[source],
            data: [...prevState[source].data, ...apiData.enquiryData],
          },
        }));
      }
    }
  }

  const singleCall = async (source: string) => {
    if (
      (source === "SHORTLISTED" &&
        !noMoreShortlistData &&
        shortlistedCount > 10) ||
      (source === "IN_NEGO,IN_DISCUSSION" &&
        !noMoreProgressData &&
        inProgressCount > 10) ||
      (source === "CONFIRMED" && !noMoreConfirmData && confirmedCount > 10)
    ) {
      const apiData = await coordinateService.getOutreachSingleEvent({
        offset:
          source === "SHORTLISTED"
            ? (shortlistPage - 1) * 10 + 9
            : source === "IN_NEGO,IN_DISCUSSION"
            ? (inProgressPage - 1) * 10 + 9
            : (confirmedPage - 1) * 10 + 9,
        status: source,
      });

      if (apiData) {
        source === "SHORTLISTED"
          ? setShortlistedTasks((prev) => [...prev, ...apiData.enquiryData])
          : source === "IN_NEGO,IN_DISCUSSION"
          ? setOutreachTasks((prev) => [...prev, ...apiData.enquiryData])
          : setPreFinalisedTasks((prev) => [...prev, ...apiData.enquiryData]);
      }
    }
  };
  const handleModal = (
    eventId: string,
    enquiryId: string | null = null,
    enquiryStatus: string | null = null,
    task: any
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
    source: string
  ) => {
    if (enquiry_id && enquiry_id != "") {
      let payloadData = {
        enquiryId: enquiry_id,
        enquiryStatus: changeStatusTo,
      };
      try {
        const apiData: any = await coordinateService.setEnquiryStatus(
          payloadData
        );

        if (apiData?.message === "Data updated") {
          singleCall(source);
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
  useEffect(() => {
    fetchShortlistData();
  }, [shortlistPage]);
  useEffect(() => {
    fetchInProgressData();
  }, [inProgressPage]);
  useEffect(() => {
    fetchConfirmedData();
  }, [confirmedPage]);

  // new code
  const [taskDetail, setTaskDetail] = useState<taskDetailType>({});

  const fetchPipelineData = async (status: string, label: string, page: number) => {
    const shortlistApiData = await coordinateService.getOutreachEventList({
      offset: (page - 1) * 10,
      status: status,
    });

    if (shortlistApiData && shortlistApiData !== undefined) {
      setTaskDetail(prevState => ({
        ...prevState,
        [status]: {
          ...prevState[status],
          label: label,
          data: [...prevState[status].data, ...shortlistApiData.enquiryData],
          count: shortlistApiData.totalCount,
          dataLoaded: true,
          noMoreData: (shortlistApiData.enquiryData.length < 10 ) ? true : false,
        },
      }));

      return shortlistApiData;
    }
    return [];
  };

  // const [isLoading, setIsLoading] = useState<boolean>(false);

  const [configData, setConfigData] = useState<any>();

  const getOutreachConfig = async () => {
    try {
      // setIsLoading(true);
      const apiData: any = await coordinateService.getPipelineConfig();
      setConfigData(apiData.outreach_stage.slice(1, apiData.outreach_stage.length - 1));  
      let outreachPipeLine1 = apiData.outreach_stage.slice(1, apiData.outreach_stage.length - 1);
      let temp: taskDetailType = {}
      outreachPipeLine1.map((item: any)=>{
        temp[item.status] = {
          label: item.label,
          data: [],
          count: 0,
          dataLoaded: false,
          noMoreData: false,
        }
      });
      setTaskDetail(temp);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    getOutreachConfig();
  }, []);

  // new code

  useEffect(() => {
    if (window.innerWidth > 576) {
      setTabsVisible("all");
    }
    // fetchData();
  }, [statusChanged]);
  const fetchShortlistData = async () => {
    const shortlistApiData = await coordinateService.getOutreachEventList({
      offset: (shortlistPage - 1) * 10,
      status: "SHORTLISTED",
    });

    if (shortlistApiData) {
      setDataLoaded((prevState: any) => ({
        ...prevState,
        shortlisted: true,
      }));
      setShortlistedTasks((prev) => [...prev, ...shortlistApiData.enquiryData]);
      setShortlistedCount(shortlistApiData.totalCount);

      if (shortlistApiData.enquiryData.length < 10) {
        setNoMoreShortlistData(true);
      }
    }
  };
  const fetchInProgressData = async () => {
    const negoApiData = await coordinateService.getOutreachEventList({
      offset: (inProgressPage - 1) * 10,
      status: "IN_NEGO,IN_DISCUSSION",
    });

    if (negoApiData) {
      setDataLoaded((prevState: any) => ({
        ...prevState,
        outreach: true,
      }));
      setOutreachTasks((prev) => [...prev, ...negoApiData.enquiryData]);
      setInProgressCount(negoApiData.totalCount);

      if (negoApiData.enquiryData.length < 10) {
        setNoMoreProgressData(true);
      }
    }
  };
  const fetchConfirmedData = async () => {
    const confirmApiData = await coordinateService.getOutreachEventList({
      offset: (confirmedPage - 1) * 10,
      status: "CONFIRMED",
    });

    if (confirmApiData) {
      setDataLoaded((prevState: any) => ({
        ...prevState,
        preFinalised: true,
      }));
      setPreFinalisedTasks((prev) => [...prev, ...confirmApiData.enquiryData]);
      setConfirmedCount(confirmApiData.totalCount);

      if (confirmApiData.enquiryData.length < 10 || confirmedCount === 10) {
        setNoMoreConfirmData(true);
      }
    }
  };
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
        setData: () => {},
      },
      nativeEvent: new Event("drop"),
      isDefaultPrevented: () => false,
      isPropagationStopped: () => false,
      persist: () => {},
    } as any;
    handleDrop2(mockEvent, target);
  };

  if (!Object.values(dataLoaded).every((value) => value === true)) {
    return (
      <div style={{ padding: "50px" }}>
        <Loading />
      </div>
    );
  } else if (
    shortlistedTasks.length == 0 &&
    outreachTasks.length == 0 &&
    preFinalisedTasks.length == 0
  ) {
    return (
      <div className="p-20">
        <NullState
          image={coordinateNullState}
          title="You haven't shortlisted any events yet."
          text="Browse through our upcoming events and shortlist here for easy access and internal coordination later."
          buttonText="Search Events"
          buttonUrl={`/internal/search/events`}
        />
      </div>
    );
  }
  return (
    <>
      <div style={{ width: "calc(100vw - 70px)" }}>
        {/* <div className="mobile_view">
          <div className={styles.mobileTab}>
            <div
              onClick={() => handleVisibleTab("shortlist")}
              className={`${styles.heading} ${
                tabsVisible == "shortlist" ? styles.tabActive : ""
              }`}
            >
              Shortlisted{" "}
              <span className={styles.eventSize}>{shortlistedCount}</span>
            </div>
            <span className={styles.seprator}></span>
            <div
              onClick={() => handleVisibleTab("outreach")}
              className={`${styles.heading} ${
                tabsVisible == "outreach" ? styles.tabActive : ""
              }`}
            >
              In Progress{" "}
              <span className={styles.eventSize}>{outreachTasks.length}</span>
            </div>
            <span className={styles.seprator}></span>
            <div
              onClick={() => handleVisibleTab("preFinal")}
              className={`${styles.heading} ${
                tabsVisible == "preFinal" ? styles.tabActive : ""
              }`}
            >
              Confirmed{" "}
              <span className={styles.eventSize}>
                {preFinalisedTasks.length}
              </span>
            </div>
          </div>
        </div> */}
        <div className={`${styles.taskBody}  w-full scroll overflow-x-auto`}>
          { Object.keys(taskDetail).map((status, index) => (
              <PipelineCol handleDragContainerStart={handleDragContainerStart} handleDragOver={handleDragOver} handleDragStart={handleDragStart} handleDrop2={handleDrop2} handleModal={handleModal} openAddModalHandler={openAddModalHandler} status={status} taskDetail={taskDetail} fetchPipelineData={fetchPipelineData} />
            ))
          }
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
            configData={configData}
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
