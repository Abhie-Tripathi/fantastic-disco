import React, { useState, useEffect } from "react";
import styles from "./allTrackers.style.module.css";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import Image from "next/image";
import GoTo from "/public/goTo.svg";
import Vectore6 from "/public/newVector.svg";
import Vectore7 from "/public/lucide_timer.svg";
import Vectore8 from "/public/expired.svg";
import Link from "next/link";
import { GAEvent } from "@/utils/GAEvent";
import { Location } from "geist-icons";
// import { useTheme } from '@/context/theme';
const AllTrackers = ({ item, setSingleTrackerData, singleTrackerData }: any) => {
  // const { theme } = useTheme();
  // console.log(Math.floor(item?.groupedEventsCountByDate.length / 7));
  const lineData = {
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    datasets: [
      {
        label: "First dataset",
        data: [33, 65, 44, 85, 44, 65, 78],
        fill: true,
        backgroundColor: "rgba(250, 117, 157, 0.15)",
        borderColor: "#FA759D",
        tension: 0.3,
      },
    ],
  };

  const lineOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#45445994",
          font: {
            size: 8,
          },
        },
      },
      y: {
        beginAtZero: true,
        stepSize: 10,
        display: false,
      },
    },

    elements: {
      point: {
        radius: 0,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  const polarData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [18, 16, 13, 14, 16, 17],
        backgroundColor: [
          "#6750A4",
          "#EADDFF",
          "#FBD7E8",
          "#D6CEE8",
          "#B1A4D1",
        ],
      },
    ],
  };
  const [locations, setLocations] = useState<any>();

  useEffect(() => {
    
    const eventCountry = item?.filterValue?.eventCountry?.map((countryObj:{}) => Object.values(countryObj)[0])||[];
    const eventCity = item?.filterValue?.eventCity?.map((cityObj:{}) => Object.values(cityObj)[0])||[];
    const eventState = item?.filterValue?.eventState?.map((stateObj: any) => Object.values(stateObj)[0]) || [];
    const eventZone=item?.filterValue?.eventRegion?.split(",")||[];
    setLocations([...eventCountry, ...eventCity, ...eventZone, ...eventState]);
  }, [item]);
  const formatType=(type:string)=>{
    if(type==="CUSTOM") return "Custom"
    return type.split("_").slice(1).map((ele)=>`${ele.charAt(0)}${ele.substring(1).toLowerCase()}`).join(' ')
  }
  return (
    <div className="card cursor-pointer" onClick={()=>setSingleTrackerData(item)}
    style={{border: singleTrackerData?.id===item.id?"1px solid var(--primary-color)":"" }}
    >
     
        <div className="flex justify-between">
          <div className="flex gap-2 flex-col justify-between">
            <div className="font-semibold">
              {item?.name?.length>16? `${item.name.substring(0,16)}...`:item.name}
              </div>
            <div className="flex items-center gap-1 mt-[-30px]">
        {locations?.length>0 && 
        <>
        <Location style={{color:"var(--tertiary-text-color)"}} height="12px" width="12px"/>
        <div className="flex items-center gap-[5px] text-small font-[var(--font-weight-medium)] text-[var(--tertiary-text-color)]" style={{fontSize:"12px"}}>
          {locations?.length > 0 && locations[0].length<15 &&locations[0]}
          {locations?.length > 0 && locations[0].length>15 &&`${locations[0].substring(0,15)}...`}
          {locations?.length > 1 &&  (
            <span className="border w-[28px] h-[17px] flex justify-center items-center rounded-lg border-[var(--tertiary-text-color)]">+{locations.length - 1}</span>
          )}
        </div>
        </>
}
      </div> 
      <div className="badge_info w-fit border border-[var(--info-text-color))]" style={{fontSize:"var(--font-size-xs)"}}>{formatType(item.type)}</div>
          </div>
          <div className="flex gap-2">
          <div className="flex w-full h-[100px]">
          <div className="flex gap-2 w-[100%] text-xs">
            <div className={`flex w-1/3 flex-col gap-1 items-center justify-center card`}>
              <div className={`flex items-center justify-center gap-1 border-b-[0.39px] pb-[10px] text-[var(--primary-color)] ${styles.new}`}>
                <Image src={Vectore6} alt="newVector" width={12} height={12}/>
                New
              </div>
              <div className={styles.numberOfEvents} style={{ color: "#454459" }}>
                {item?.groupedEventsCountByStatus?.groupedEventsByStatus?.new.toLocaleString('en-US')}
              </div>
              <div className={styles.events}>Events</div>
            </div>
            <div className={`flex w-1/3 flex-col gap-1 items-center justify-center card`}>
              <div className={`flex items-center justify-center gap-1 border-b-[0.39px] pb-[10px] text-[var(--primary-color)] ${styles.new}`}>
                <Image src={Vectore7} alt="lucide_timer" width={12} height={12}/>
                Active
              </div>
              <div className={styles.numberOfEvents} style={{ color: "#454459" }}>
                {item?.groupedEventsCountByStatus?.groupedEventsByStatus?.active.toLocaleString('en-US')}
              </div>
              <div className={styles.events}>Events</div>
            </div>
            <div className={`flex w-1/3 flex-col gap-1 items-center justify-center card`}>
              <div className={`flex items-center justify-center gap-1 border-b-[0.39px] pb-[10px] text-[var(--primary-color)] ${styles.new}`}>
                <Image src={Vectore8} alt="expired" width={12} height={12}/>
                Expired
              </div>
              <div className={styles.numberOfEvents} style={{ color: "#454459" }}>
                {item?.groupedEventsCountByStatus?.groupedEventsByStatus?.expired.toLocaleString('en-US')}
              </div>
              <div className={styles.events}>Events</div>
            </div>
          </div>

          {/* <div className={styles.lineChart}>
            <Line data={lineData} options={lineOptions} />
          </div> */}
        </div> 
            <div><Image  src={GoTo} alt="goTo" /></div>
          </div>
        </div>
        {/* <div className={styles.cardOne}>
          <div className={styles.heading}>{item.name}</div>
          <Image  src={GoTo} alt="goTo" />
        </div> */}
        
        {/* <div className={styles.cardTwo}>
        {locations?.length>0 && 
        <>
        <Image src={Location} alt="location" />
        <div className={styles.location}>
          {locations?.length > 0 && locations[0]}
          {locations?.length > 1 && (
            <span className={styles.moreBtn}>+{locations.length - 1}</span>
          )}
        </div>
        </>
}
      </div> */}
        
        
        {/* <div className={styles.cardThree}>
          <div className={styles.cardThreeLeft}>
            <div className={`${styles.cardType} card`}>
              <div className={styles.new}>
                <Image src={Vectore6} alt="newVector" width={12} height={12}/>
                New
              </div>
              <div className={styles.numberOfEvents} style={{ color: "#454459" }}>
                {item?.groupedEventsCountByStatus?.groupedEventsByStatus?.new.toLocaleString('en-US')}
              </div>
              <div className={styles.events}>Events</div>
            </div>
            <div className={`${styles.cardType} card`}>
              <div className={styles.new}>
                <Image src={Vectore7} alt="lucide_timer" width={12} height={12}/>
                Active
              </div>
              <div className={styles.numberOfEvents} style={{ color: "#454459" }}>
                {item?.groupedEventsCountByStatus?.groupedEventsByStatus?.active.toLocaleString('en-US')}
              </div>
              <div className={styles.events}>Events</div>
            </div>
            <div className={`${styles.cardType} card`}>
              <div className={styles.new}>
                <Image src={Vectore8} alt="expired" width={12} height={12}/>
                Expired
              </div>
              <div className={styles.numberOfEvents} style={{ color: "#454459" }}>
                {item?.groupedEventsCountByStatus?.groupedEventsByStatus?.expired.toLocaleString('en-US')}
              </div>
              <div className={styles.events}>Events</div>
            </div>
          </div>

          <div className={styles.lineChart}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div> */}
    </div>
  );
};

export default AllTrackers;
