"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./eventdetail.style.module.css";
import { Notes } from "@/app/components/eventDetail/Notes";
import SingleEvent from "./SingleEvent";
import EventDescription from "./EventDescription";
import Organiser from "./Organiser";
import EventPoc from "./EventPoc";
import Follower from "./Follower";
import StatusBar from "./StatusBar";
import OwnerList from "./ownerList";
import StatusChangeDropdown from "./statusChangeDropdown";
import { usePathname } from "next/navigation";
import closeIcon from "/public/close.svg";
import backIcon from "/public/back.svg"
import Image from "next/image";
import EventRequest from "./EventRequest";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import { number } from "zod";
import { toast } from "react-toastify";
import { showToast } from "@/utils/showToast";
// import "react-toastify/dist/ReactToastify.css";

interface EventData {
  id: string;
  eventGroupId: string;
  imageUrl: string;
  name: string;
  description: string;
  enquiryId: string;
}
interface Props {
  openEventDetails: boolean;
  openOrganiserDetails: boolean;
  openPocDetails: boolean;
  closeBtn: boolean;
  openEventRequest: boolean;
  handleModal: (id: string, enquiryId: string) => void;
  eventId: string;
  enquiryId: string;
  currentEnquiryStatus?: string;
  handleRefresh?: () => void;
}

const EventDetail = ({
  openEventDetails,
  openOrganiserDetails,
  openPocDetails,
  closeBtn,
  openEventRequest,
  handleModal,
  eventId,
  enquiryId,
  currentEnquiryStatus,
  handleRefresh
}: Props) => {
  const [meet, setMeet] = useState(false);
  const leftContainerRef = useRef<HTMLDivElement>(null); // Define leftContainerRef
  const rightContainerRef = useRef<HTMLDivElement>(null); // Define rightContainerRef
  const pathName = usePathname().split("/")[2];
  const [stage, setStage] = useState<string>("");
  const [singleEventData, setSingleEventData] = useState<EventData | any>();
  const urlPath = usePathname().split("/")[2];
  const [participentData, setParticipentData] = useState({
    attendee: [],
    speakers: [],
    sponsors: [],
    exhibitors: [],
  });

  useEffect(() => {
    if (urlPath === "outreach") setStage("OUTREACH");
    else if (urlPath === "coordinate") setStage("INTERNAL");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [status, setStatus] = useState<number>(currentEnquiryStatus==="IN PROGRESS"?2:currentEnquiryStatus==="CONFIRMED"?10:currentEnquiryStatus==="CANCELED"?12:1);
  const statusValues: { [key: string]: string } = {
    "1": "SHORTLISTED",
    "2": "IN_NEGO",
    "10": "CONFIRMED",
    "12": "CANCELED",
  };
  const handleStatusChange = async (changeStatusTo: number) => {
    setStatus(changeStatusTo);
    if (enquiryId && enquiryId != "") {
      let payloadData = {
        enquiryId: enquiryId,
        enquiryStatus: statusValues[changeStatusTo],
      };
      try {
        const apiUrl = baseUrl + "/userInterest/enquiry";
        const apiData = await myFetch(apiUrl, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify(payloadData),
        });
        if (apiData.data.message === "Data updated") {
          if (handleRefresh) handleRefresh();
          // toast.success("Enquiry status updated!", {
          //   position: "bottom-right",
          //   autoClose: 2000,
          //   closeButton: false,
          //   hideProgressBar: true,
          // });
          showToast("success","Enquiry status updated!")
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    if (leftContainerRef.current && rightContainerRef.current) {
      const leftContainerHeight = leftContainerRef.current.clientHeight;
      rightContainerRef.current.style.height = leftContainerHeight + "px";
      console.log(leftContainerHeight);
    }
    const fetchEventData = async () => {
      try {
        const { data, error } = await myFetch(
          `${baseUrl}/event/search?eventId=${eventId}`
        );
        if (data) {
          const eventsData = data.events[0];
          setSingleEventData(eventsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (eventId != "") fetchEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseModal = () => {
    if (handleModal) {
      handleModal("", "");
    }
  };

  useEffect(() => {
    const fetchInterestData = async () => {
      const { data, error } = await myFetch(
        `${baseUrl}/userInterest/${eventId}`
      );

      if (data) {
        setParticipentData({
          attendee: data.participent.attendee,
          speakers: data.participent.speakers,
          sponsors: data.participent.sponsors,
          exhibitors: data.participent.exhibitors,
        });
      }
      if (error) {
        showToast("error", error.message);
        return;
      }
    };
    fetchInterestData();
  }, [eventId]);

  return (
    <div
      className={
        meet ? `${styles.container} ${styles.fullHeight}` : styles.container
      }
    >
      <div className={styles.closeIcon} onClick={handleCloseModal}>
        <Image src={backIcon} alt="close" height={22} width={22} />
        Back
      </div>

      <div className={styles.modalContainer}>
        {pathName && pathName === "outreach" && <StatusBar status={status} handleStatusChange={handleStatusChange}/>}
        <div className={styles.innerContainer}>
          <div className={styles.containerLeft} ref={leftContainerRef}>
            <div className={styles.containerLeftTop}>
              <OwnerList label="test" eventId={123} enquiryId={enquiryId} />
              {/* {pathName && pathName === "outreach" && (
                <StatusChangeDropdown
                  label=""
                  eventId={123}
                  handleStatusChange={handleStatusChange}
                  currentValue={
                    currentEnquiryStatus ? currentEnquiryStatus : ""
                  }
                />
              )} */}
            </div>
            {singleEventData && (
              <>
                <SingleEvent {...singleEventData} />
                <EventDescription
                  description={singleEventData.description}
                  open={openEventDetails}
                  speakers={false}
                  shortlist={false}
                  eventDetail={singleEventData}
                />
              </>
            )}
            <EventRequest open={openEventRequest} participentData={participentData} />
            <Organiser
              open={openOrganiserDetails}
              organizerData={singleEventData?.organizer}
            />
            <EventPoc open={openPocDetails} eventId={eventId} />
            <Follower eventId={eventId} enquiryId={enquiryId} />
          </div>
          <div className={styles.containerRight} ref={rightContainerRef}>
            {singleEventData && (
              <Notes
                eventId={singleEventData.id}
                eventGroupId={singleEventData.eventGroupId}
                stage={stage}
              />
            )}
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default EventDetail;