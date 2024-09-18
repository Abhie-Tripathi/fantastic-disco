"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.style.module.css";
import Internal from "@/app/components/internal/Internal";
import EventDetail from "@/app/components/internal/eventdetail/EventDetail";
import ShortlistModal from "@/app/components/internal/eventdetail/shortlistModal";
import TypeOfEventsCount from "@/public/data/TypeOfEventsCount.json";
import { useTheme } from "@/context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";

const Page = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [shortlistModalData, setShortlistModalData] = useState({});
  const { theme } = useTheme();
  const [singleEventId, setSingleEventId] = useState<string>("");
  const [enquiryId, setEnquiryId] = useState("");

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
      const apiUrl = baseUrl + "/userInterest/" + eventId;
      const apiData = await myFetch(apiUrl, {
        method: "GET",
        headers: headers,
      });
      console.log("FetchUserInterest",apiData)
      if (apiData.data) {
        apiData.data.eventId = eventId;
        apiData.data.enquiryId = enquiryId;
        setShortlistModalData(apiData.data);
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
  const [scrollY, setScrollY] = useState(0);

  // const handleScroll = () => {
  //   if(!modalOpen)
  //     setScrollY(window.scrollY);
  // };

  // useEffect(() => {
  //     window.addEventListener('scroll', handleScroll);
      
  //     // Cleanup the event listener on component unmount
  //     return () => {
  //         window.removeEventListener('scroll', handleScroll);
  //     };
  // }, []);
  useEffect(()=>{

  },[modalOpen])
 
  // useEffect(() => {
  //   if (modalOpen) {
  //     // Save current scroll position when modal is opened
      
  //     // window.scrollTo(0, scrollY)
  //     setScrollY(window.scrollY);
  //     // Disable scrolling by locking the body's scroll position
  //     document.body.style.overflow = "hidden";
  //     document.body.style.position = "fixed";
  //   } else {
  //     console.log(scrollY);
      
  //     // Restore scrolling and scroll to the saved position
  //     document.body.style.overflow = "auto";
  //     document.body.style.position = "static";
  //   }
  
  //   // Cleanup: Restore the styles when modal is closed or component unmounts
  //   return () => {
  //     document.body.style.overflow = "auto";
  //     document.body.style.position = "static";
  //   };
  // }, [modalOpen]);
  
  useEffect(()=>{
    console.log(scrollY);
  },[scrollY])
//  console.log(scrollY);
 
  
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
        modalOpen={modalOpen}
          handleModal={handleModal}
          handleShortlistModal={handleShortlistModal}
          cardUpdated={cardUpdated}
        />
      </div>
      {modalOpen && (
        // <div className={styles.mod}>
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
        //  </div>
      )}

      {shortlistModalOpen && (
        <div>
          <ShortlistModal
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