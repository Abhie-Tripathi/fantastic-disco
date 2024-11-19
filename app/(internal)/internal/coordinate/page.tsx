"use client";
import React, { useState } from "react";
import styles from "./page.style.module.css";
import Internal from "@/app/components/internal/Internal";
import EventDetail from "@/app/components/internal/eventdetail/EventDetail";
import ShortlistModal from "@/app/components/internal/eventdetail/shortlistModal";
import TypeOfEventsCount from "@/public/data/TypeOfEventsCount.json";
import { useCoordinateService } from "@/services/coordinateService";

const Page = () => {
  const coordinateService = useCoordinateService();
  const [modalOpen, setModalOpen] = useState(false);
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [shortlistModalData, setShortlistModalData] = useState({});
  const [singleEventId, setSingleEventId] = useState<string>("");
  const [enquiryId, setEnquiryId] = useState<string>("");
  const [selectedId,setSelectedId]=useState("");
  const [statusChanged,setStatusChanged]=useState<boolean>(false);
  const [cardUpdated, setCardUpdated] = useState<boolean>(false);
  const handleRefresh = () => {
    setCardUpdated(!cardUpdated);
  };
  const handleModal = (eventId: string, enquiryId: string) => {
    setModalOpen(!modalOpen);
    setSingleEventId(eventId);
    setEnquiryId(enquiryId);
  };
  const handleShortlistModal = (eventId: string, enquiryId: string = "") => {
    if (eventId && eventId != "") fetchInterestData(eventId, enquiryId);
    else setShortlistModalOpen(!shortlistModalOpen);
  };

  const fetchInterestData = async (eventId: string, enquiryId: string) => {
    try {
      const apiData: any = await coordinateService.getInterestedUsers(eventId, enquiryId);
      if (apiData) {
        apiData.eventId = eventId;
        apiData.enquiryId = enquiryId;
        setShortlistModalData(apiData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setShortlistModalOpen(!shortlistModalOpen);
    }
  };

  const totalCount = TypeOfEventsCount.reduce(
    (total, item) => total + item.count,
    0
  );
  
  return (
    <div className={`${styles.container} ${modalOpen ? styles.modalOpen : ""}`} >
      <div >
      {totalCount >= 9 && (
        <div className={styles.innerContainer}>
          {TypeOfEventsCount.map((item, key) => (
            <div className={styles.container1} key={key}>
              <div className={styles.number}>{item.count}</div>
              <div className={styles.heading}>{item.name}</div>
            </div>
          ))}
        </div>
      )}
        <Internal
        setSelectedId={setSelectedId}
        selectedId={selectedId}
        statusChanged={statusChanged}
        setStatusChanged={setStatusChanged}
        modalOpen={modalOpen}
          handleModal={handleModal}
          handleShortlistModal={handleShortlistModal}
          cardUpdated={cardUpdated}
        />
      </div>
      {modalOpen && (
        <div
          className={`${styles.modal}`}
        >
          <EventDetail
            openEventDetails={true}
            openEventRequest={false}
            openOrganiserDetails={false}
            openPocDetails={false}
            closeBtn={true}
            handleModal={handleModal}
            eventId={singleEventId}
            enquiryId={enquiryId}
          />
        </div>
      )}

      {shortlistModalOpen && (
        <div>
          <ShortlistModal
          setStatusChanged={setStatusChanged}
            handleShortlistModal={handleShortlistModal}
            shortlistModalData={shortlistModalData}
            handleRefresh={handleRefresh}
          />
        </div>
      )}
    </div>
  );
};

export default Page;