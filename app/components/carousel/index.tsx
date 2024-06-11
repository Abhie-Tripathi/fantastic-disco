import React,{useState, useEffect} from 'react'
import Image from 'next/image';
import Visibility from "../../../public/visibility.svg";
import IntelligentEventTracking from "/public/intelligent_Event_Tracking.png";
import SmartEventDiscovery from "/public/smart_Event_Discovery.png";
import IntelligentNotification from "/public/intelligent_Notification.png";
import styles from './carousel.style.module.css'
import DynamicEventTrends from "/public/dynamic_Event_Trends.png";
const Carousel = () => {
    const carousels = [
        {
          title: "Intelligent Event Tracking",
          image: IntelligentEventTracking,
          description:
            "Stay ahead with continuous insights and trends. Monitor your interests with effortless precision.",
        },
        {
          title: "Smart Event Discovery",
          image: SmartEventDiscovery,
          description:
            "Search and visualise events with interactive maps, lists and calendar views.",
        },
        {
          title: "Intelligent Notifications",
          image: IntelligentNotification,
          description:
            "Never miss a beat with real-time alerts. Stay informed with timely notifications.",
        },
        {
          title: "Dynamic Event Trends",
          image: DynamicEventTrends,
          description:
            "Leverage our analytics to understand upcoming events and trends that can impact your business.",
        },
      ];
      const [index, setIndex] = useState(0);
      useEffect(() => {
          const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % carousels?.length);
          }, 6000); 
      
          return () => clearInterval(interval); // Cleanup interval on component unmount
        }, [carousels?.length]);
  return (
    <>
     {carousels.map((carousel, ind) => (
            ind === index && (
              <div key={ind} className={styles.leftContent}>
                <div className={styles.heading}>{carousel.title}</div>
                <div style={{height:"60%", width:"100%", display:"flex", justifyContent:"center"}}>
                <Image
                      src={carousel.image}
                      alt={carousel.title}
                      // height={60%}
                      style={{height:"350px", width:"80%"}}
                      // layout="responsive"
                    />
                    </div>
                    <div className={styles.content}>{carousel.description}</div>
                <div className={styles.circles}>
                  <div className={`${styles.circle} ${index === 0 ? styles.active : ""}`} onClick={()=>setIndex(0)}></div>
                  <div className={`${styles.circle} ${index === 1 ? styles.active : ""}`} onClick={()=>setIndex(1)}></div>
                  <div className={`${styles.circle} ${index === 2 ? styles.active : ""}`} onClick={()=>setIndex(2)}></div>
                  <div className={`${styles.circle} ${index === 3 ? styles.active : ""}`} onClick={()=>setIndex(3)}></div>
                </div>
                {/* Render content for the specific index */}
              </div>
            )
          ))}</>
  )
}

export default Carousel;
