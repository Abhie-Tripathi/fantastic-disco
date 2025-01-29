"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.style.module.css";
import EventDetail from "@/app/components/internal/eventdetail/EventDetail";
import { useTheme } from "@/context";
import { enquiryType } from "@/types/outreachEnquiryTypes";
import { useCoordinateService } from "@/services/coordinateService";
import NullState from "@/app/components/trackers/nullState";
import coordinateNullState from "/public/coordinateNullState.svg";
import PipelineCol from "@/app/components/outreach/pipelineCol";
import { useSearchParams } from "next/navigation";
import { GAEvent } from "@/utils/GAEvent";

interface taskDetailType {
  [task: string]: {
    label: string;
    data: enquiryType[];
    count: number;
    dataLoaded?: boolean;
    noMoreData?: boolean;
    page: number;
  };
}

const Page: React.FC = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [addEventModal, setAddEventModal] = useState(false);
  const { theme } = useTheme();
  const [tabsVisible, setTabsVisible] = useState<string>("shortlist");
  const [enquiryId, setEnquiryId] = useState<string>("");
  const [singleEventId, setSingleEventId] = useState<string>("");
  const [currentEnquiryStatus, setCurrentEnquiryStatus] = useState<string>("");
  const [statusChanged, setStatusChanged] = useState<boolean>(false);

  const coordinateService = useCoordinateService();

  const searchParams = useSearchParams()

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
    target: string,
    initiator: string = "",
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
          noMoreData: prevState[source].count - 1 <= 10 ? true : false,
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
      changeEnquiryStatus(target, taskName.enquiryId, source, initiator);
    }
  };

  const singleCall = async (source: string) => {
    if( taskDetail[source].count > 10 && !taskDetail[source].noMoreData ) {
      const apiData = await coordinateService.getOutreachSingleEvent({
        offset: (taskDetail[source].page - 1) * 10 + 9,
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
    source: string,
    initiator: string,
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
          GAEvent("Outreach", "Enquiry Detail", `Outreach | Enquiry Status Change`, `Change | ${initiator} | ${changeStatusTo}`);
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
          page: page,
        },
      }));

      return shortlistApiData;
    }
    return [];
  };

  const [configData, setConfigData] = useState<any>();

  // const getOutreachConfig = async () => {
  //   try {
  //     const apiData: any = await coordinateService.getPipelineConfig();
  //     setConfigData(apiData.outreach_stage.slice(1, apiData.outreach_stage.length - 1));  
  //     let outreachPipeLine1 = apiData.outreach_stage.slice(1, apiData.outreach_stage.length - 1);
  //     let temp: taskDetailType = {}
  //     outreachPipeLine1.map((item: any)=>{
  //       temp[item.status] = {
  //         label: item.label,
  //         data: [],
  //         count: 0,
  //         dataLoaded: false,
  //         noMoreData: false,
  //         page: 0,
  //       }
  //     });
  //     setTaskDetail(temp);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }

  // useEffect(() => {
  //   getOutreachConfig();
  //   const modalValue = searchParams.get("modalOpen")
  //   const eventEnquiryId = searchParams.get("enquiryId")
  //   const eventId = searchParams.get("eventId")
  //   if(modalValue === "true" && eventEnquiryId && eventId ){
  //       setEnquiryId(eventEnquiryId)
  //       setSingleEventId(eventId)
  //       setModalOpen(true)
  //   }
  // }, []);
  const getOutreachConfig = async () => {
    try {
      const apiData: any = await coordinateService.getPipelineConfig();
      const outreachPipeLine1 = apiData.outreach_stage.slice(1, apiData.outreach_stage.length - 1);
  
      setConfigData(outreachPipeLine1); // Set the configuration data
  
      // Prepare taskDetail object
      let temp: taskDetailType = {};
      outreachPipeLine1.forEach((item: any) => {
        temp[item.status] = {
          label: item.label,
          data: [],
          count: 0,
          dataLoaded: false,
          noMoreData: false,
          page: 0,
        };
      });
      setTaskDetail(temp);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const initializeModalState = async () => {
    const modalValue = searchParams.get("modalOpen");
    const eventEnquiryId = searchParams.get("enquiryId");
    const eventId = searchParams.get("eventId");
    const eventenquiryStatus = searchParams.get("status");
  
    if (modalValue === "true" && eventEnquiryId && eventId && eventenquiryStatus) {
      setEnquiryId(eventEnquiryId);
      setSingleEventId(eventId);
      setModalOpen(true);
      setCurrentEnquiryStatus(eventenquiryStatus);
    }
  };
  
  useEffect(() => {
    const fetchAndInitialize = async () => {
      await getOutreachConfig(); // Wait for configuration data to be set
      await initializeModalState(); // Then proceed with modal initialization
    };
  
    fetchAndInitialize();
  }, []);
  

  useEffect(() => {
    if (window.innerWidth > 576) {
      setTabsVisible("all");
    }
    // fetchData();
  }, [statusChanged]);

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
    handleDrop2(mockEvent, target, 'Status Pipeline');
  };

  if (Object.values(taskDetail).length > 0 && Object.values(taskDetail).every((value) => (value.dataLoaded === true && value.count === 0)) ) {
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
      <div>
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
              <PipelineCol key={index} handleDragContainerStart={handleDragContainerStart} handleDragOver={handleDragOver} handleDragStart={handleDragStart} handleDrop2={handleDrop2} handleModal={handleModal} openAddModalHandler={openAddModalHandler} status={status} taskDetail={taskDetail} fetchPipelineData={fetchPipelineData} />
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