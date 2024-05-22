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
import Image from "next/image";
import EventRequest from "./EventRequest";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import { number } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EventData {
  id: string;
  eventGroupId: string,
  imageUrl: string;
  name: string;
  description: string;
  enquiryId?: string;
}
interface Props {
  openEventDetails: boolean;
  openOrganiserDetails: boolean;
  openPocDetails: boolean;
  closeBtn: boolean;
  openEventRequest:boolean;
  handleModal: (id: string) => void;
  eventId: string,
  enquiryId?: string,
  currentEnquiryStatus?: string,
  handleRefresh?: () => void,
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
  handleRefresh,
}: Props) => {
  const [meet, setMeet] = useState(false);
  const leftContainerRef = useRef<HTMLDivElement>(null); // Define leftContainerRef
  const rightContainerRef = useRef<HTMLDivElement>(null); // Define rightContainerRef
  const pathName = usePathname().split("/")[2];
  const [singleEventData, setSingleEventData] = useState<EventData>();

  // const singledata: EventData = {
  //   id: 12,
  //   imageUrl:
  //     "https://i.pinimg.com/originals/0f/ab/ea/0fabead80613002cfed665309f3dd6cc.jpg",
  //   name: "Great Indian Food Festival",
  //   description:
  //     "Celebrate the rich diversity of Indian cuisine at the Great Indian Food Festival in Gurgaon. Indulge in a feast for the senses as you explore a myriad of flavors, aromas, and textures from across the subcontinent. From spicy street food to traditional delicacies, the festival showcases the best of Indian culinary heritage. Discover hidden gems, sample regional specialties, and immerse yourself in the vibrant ambiance of this culinary extravaganza. Whether you're a foodie, a gourmand, or simply curious to explore new tastes, the Great Indian Food Festival offers an unparalleled culinary experience that will leave you craving for more.",
  //     // enquiryId: singleEventData[0].enquiryId,
  // };

  const [status, setStatus] = useState<number>(1);
  const statusValues: { [key: string]: string } = {
    "1": "SHORTLISTED",
    "2": "IN_NEGO",
    "10": "CONFIRMED",
    "12": "CANCELED",
  };
  const handleStatusChange = async(changeStatusTo: number) => {
    setStatus(changeStatusTo);
    if(enquiryId && enquiryId != ''){
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
        if(apiData.data.message === "Data updated"){
          if(handleRefresh)
            handleRefresh();
          toast.success('Enquiry status updated!', {
            position: 'bottom-right',
            autoClose: 2000,
            closeButton: false,
            hideProgressBar: true,
          });
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  useEffect(() => {
    if (leftContainerRef.current && rightContainerRef.current) {
      const leftContainerHeight = leftContainerRef.current.clientHeight;
      rightContainerRef.current.style.height = leftContainerHeight + "px";
      console.log(leftContainerHeight);
    }
    const fetchEventData = async() => {
      try {
        const apiUrl = 'https://api.eventgeni.com/event/'+eventId;
        const apiData = await myFetch(apiUrl, {
          method: "GET",
          headers: headers,
        });
        if(apiData.data){
          const eventsData = apiData.data.event;
          setSingleEventData({
            id: eventsData.id,
            eventGroupId: eventsData.eventGroupId,
            imageUrl:
              "https://i.pinimg.com/originals/0f/ab/ea/0fabead80613002cfed665309f3dd6cc.jpg",
            name: eventsData.title,
            description: eventsData.description,
          });
        }
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if(eventId != '')
      fetchEventData();
  }, []);

  const handleCloseModal = () => {
    if (handleModal) {
      handleModal('');
    }
  };
  return (
    <div
      className={
        meet ? `${styles.container} ${styles.fullHeight}` : styles.container
      }
    >
      <div className={styles.closeIcon} onClick={handleCloseModal}>
        <Image src={closeIcon} alt="close" height={22} width={22} />
      </div>

      <div className={styles.modalContainer}>
        {pathName && pathName === "outreach" && <StatusBar status={status} />}
        <div className={styles.innerContainer}>
          <div className={styles.containerLeft} ref={leftContainerRef}>
            <div className={styles.containerLeftTop}>
              <OwnerList label="test" eventId={123} />
              {pathName && pathName === "outreach" &&
                <StatusChangeDropdown
                  label=""
                  eventId={123}
                  handleStatusChange={handleStatusChange}
                  currentValue={currentEnquiryStatus?currentEnquiryStatus:''}
                />
              }
            </div>
            {singleEventData &&
            <>
              <SingleEvent {...singleEventData} />
              <EventDescription
                description={singleEventData.description}
                open={openEventDetails} speakers={true} shortlist={false}
              />
            </>
            }
            <EventRequest
              open={openEventRequest}
            />
            <Organiser open={openOrganiserDetails} />
            <EventPoc open={openPocDetails} />
            <Follower />
          </div>
          <div className={styles.containerRight} ref={rightContainerRef}>
          {singleEventData &&
            <Notes eventId={singleEventData.id} eventGroupId={singleEventData.eventGroupId}/>
          }
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EventDetail;
