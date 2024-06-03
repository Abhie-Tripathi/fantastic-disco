'use client'
import React, { useEffect, useState } from "react";
import styles from "./page.style.module.css";
import Link from "next/link";
import MoreIcon from "/public/dots.svg";
import TrackerCard from "@/app/components/internal/trackers/TrackerCard";
import { baseUrl } from "@/constants";
import Add from '/public/add.svg';
import { myFetch } from "@/utils/myFetch";
import Image from "next/image";
import Template from '/public/template.svg';
import People from '/public/ionPeople.svg';
import Vector1 from '/public/vectorTemplate.svg';
import Vector3 from '/public/Vector3.svg';
import Vector4 from '/public/Vector4.svg';
import MyTracker from '@/app/components/internal/trackers/MyTrackers'
import Loading from "@/app/components/UI/Loading";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark";

const Trackers = () => {
  const [trackers, setTrackers] = useState<any[]>([]);
  const [type,setType]=useState("My Trackers");
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal,setShowModal]=useState(false);
  useEffect(() => {
   
    //  if(document.body.classList.contains(styles.bodyOverflowHidden))
    //   document.body.classList.remove(styles.bodyOverflowHidden);
     if(document.body.style.height==='100vh'){
      document.body.style.height="";
     }
  
  }, []);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     const { data, error } = await myFetch(
  //       `${baseUrl}/tracker?limit=5&offset=${offset}`
  //     );
  //     console.log(data);
  //     if (error) {
  //       console.log(error);
  //       setIsLoading(false);
  //       return;
  //     }

  //     if (data) {
  //       setTrackers((prevTrackers) => [...prevTrackers, ...data.trackerData]);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [offset]);
const data=[
  {
    type:'template',
    domain:'Human Resource',
    trackerName:'Recruitment',
    content:'Input designations and keywords, and upload job descriptions to identify relevant events effortlessly...'
  },
  {
    type:'template',
    domain:'Human Resource',
    trackerName:'People Finder',
    content:'Track experts, influencers and where they might be participating in various events'
  },
  {
    type:'template',
    domain:'Human Resource',
    trackerName:'Competitor',
    content:'Track your competitor experts, influencers and where they might be participating in events'
  },
  {
    type:'template',
    domain:'Human Resource',
    trackerName:'Speaking Opportunity',
    content:'Input team members and their details to keep track of the events with speaking opportunities.'
  }
]
  const handleShowMore = () => {
    setOffset((prevOffset) => prevOffset + 5);
  };
  const modalOpen = () => {
    setShowModal(true);
    document.body.style.height = '100vh';
   
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (e: any) => {
    const targetElement = e.target;
    if (
      targetElement.classList.contains(styles.modalContainer) ||
      targetElement.classList.contains(styles.modalInnerContainer)
    ) {
      setShowModal(false);
      document.body.style.overflow = 'auto';
    }
  };
  return (
    // <div className={styles.body}>
    //   <div className={styles.trackers_card_container}>
    //     {trackers.length > 0 ? (
    //       trackers.map((tracker) => <TrackerCard key={tracker.id} trackerData={tracker} />)
    //     ) : (
    //       isLoading ? (
    //         <Loading />
    //       ) : (
    //         <div>No data available</div>
    //       )
    //     )}
    //     {trackers.length > 0 && (
    //       <div className={styles.btn_showMore} onClick={handleShowMore}>
    //         Show More
    //       </div>
    //     )}
    //   </div>
    // </div>
   <div className={styles.outerContainer}>
 <div className={styles.header_container}>
        <div className={styles.tab_container}>
          <Link
            href="/internal/trackers"
            className={`${styles.tab }`}
          >
            Create Your Event Tracker
          </Link>
          {/* <Link
            href="/internal/trackers/savedevents"
            className={`${styles.tab} ${pathName == "/internal/trackers/savedevents" ? styles.active : ""
              }`}
          >
            Saved Events
          </Link> */}
        </div>
        <div className={styles.trackers_header}>
        <Link
            href="trackers/create"
            className={styles.trackers_header_newtracker_button}
          >
           
            New Tracker
            <Image src={Add} alt="add" />
          </Link>
          <div className={styles.trackers_header_more_button}>
            <Image src={MoreIcon} alt="moreicon" />
          </div>
          
        </div>
      </div>
    <div className={styles.container}>
      <div className={styles.innerContainerOne}>
      <Image src={Add} alt="add"/>
      <button className={styles.createBtn} onClick={()=>modalOpen()}>Create Tracker</button>
      </div>
      {data.map((item, ind) => (
  <div className={styles.innerContainerTwo} key={ind}>
    <div className={styles.topView}>
      <div className={styles.account}>
        <Image src={People} alt="people"/>
      </div>
      <div>
        <Image src={Template} alt="template"/>
      </div>
    </div>
    <div className={styles.bottomView}>
      <div className={styles.bottomViewOne}>
        <div className={styles.bottomInnerView}>
          <Image src={Vector1} alt="vector1" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} />
          <div style={{ color: "#585871", fontSize: "12px" }}>Template</div>
        </div>
        <div className={styles.domain}>Human Resources</div>
      </div>
      <div className={styles.bottomViewTwo}>{item?.trackerName}</div>
      <div className={styles.text}>{item?.content}</div>
    </div>
  </div>
))}

      
    </div>
    <div className={styles.trackers}>
      <div className={`${styles.trackersHead} ${type === "My Trackers" ? styles.active : ""}`} onClick={()=>setType("My Trackers")}>My Trackers</div>
      <div className={`${styles.trackersHead} ${type === "Saved Events" ? styles.active : ""}`} onClick={()=>setType("Saved Events")}>Saved Events</div>
    </div>
    {type==="My Trackers" && <MyTracker/>}
    {showModal && 
      <div className={styles.modalContainer} onClick={(e) => closeModal(e)}>
        <div className={styles.modalInnerContainer}>
          
            <div className={styles.newTrackerHead}>Choose Tracker Type</div>
            <Link href='/internal/trackers/create'>
            <div className={styles.customTracker}>
              <div style={{display:'flex'}}><Image src={Vector3} alt="vector3"/></div>
              <div>
                <div className={styles.head}>Custom Tracker</div>
                <div className={styles.content}>Select from the available data filters to create a tracker</div>
              </div>
            </div>
            </Link>
            <div className={styles.customTracker}>
              <div style={{display:'flex'}}><Image src={Vector4} alt="vector4"/></div>
              <div>
                <div className={styles.head}>Premium Tracker</div>
                <div className={styles.content}>Seamlessly integrate your own data to tailor your event tracking experience.</div>
              </div>
            </div>
        </div>
      </div>
      }
     
      </div>
  );
};

export default Trackers;
