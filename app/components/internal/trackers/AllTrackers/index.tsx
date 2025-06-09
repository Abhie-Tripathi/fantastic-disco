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
import { ChartTrendingUp, Globe, Location, Buildings } from "geist-icons";
import { useRouter } from "next/navigation";
import { useTrackerContext } from "@/context/tracker";
import { useFilterState } from "@/hooks/useFilterState";
import { isEventeli } from "@/config";
import { CloudAlert, NotebookPen, Settings, Share2 } from 'lucide-react';
import { useTrackerServices } from "@/services/trackerServices";
// import { useTheme } from '@/context/theme';
const AllTrackers = ({ item, setSingleTrackerData, singleTrackerData }: any) => {
  const mapping = {
    "T_COMPETITOR":"Companies",
    "T_PRODUCT_KEYWORDS":"Keywords",
    "T_PEOPLE_FINDER": "Profiles",
    "T_SPEAKING_OPPORTUNITY": "Profiles"
  }
  const [entryCount, setEntryCount] = useState<number>(0);
  const router= useRouter();
  const {  setIsNewCall, setTrackerId, isLoading:load, setSkip, trackerId, skip, searchValue } = useTrackerContext();
  const {getShareAccess, error}=useTrackerServices();
  const [eventsCount,setEventCount]=useState<{ type: string; totalCount: number; newCount: number; logo?:any }[]>([]);
  const {setFilter, getFilterValue, setMultipleFilters} = useFilterState();
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
  const formatCount = (count: number ) => {
    if (count >= 1000) {
      const value = count / 1000;
      const decimalPart = value - Math.floor(value);
        return `${Math.floor(value)}k`;
    }
    return count;
  };
  useEffect(() => {
    
    const eventLocation = Object.values(item?.filterValues?.locationIds || {}).map(
      (location: any) => location?.displayName
    );
    
    const zoneLocation = item?.filterValues?.viewBound?.properties?.name;
    
    // Build the final array before updating the state
    const updatedLocations = zoneLocation
      ? [...eventLocation, zoneLocation]
      : eventLocation;
    
    setLocations(updatedLocations);
    
    const CountValues = {
      geo : ['social','business','unattended'],
      gtm : ['active','past', 'new', 'saved']
    }
    if(isEventeli){
    const transformedData =  CountValues.geo.map((key)=>{
      return {
        type: key.charAt(0).toUpperCase() + key.slice(1),
        totalCount :  item?.groupedEventsCount[key].total || 0,
        newCount : item?.groupedEventsCount[key].new || 0
      }
    })
    setEventCount(transformedData);
  }else{
    const transformedData =  CountValues.gtm.map((key)=>{
      return {
        type: key.charAt(0).toUpperCase() + key.slice(1),
        totalCount :  item?.groupedEventsCount[key] || item?.savedEventsCount || 0,
        newCount : item?.groupedEventsCount[key]?.new || 0,
        logo: key === "active" ? Vectore7 : key === "past" ? Vectore8 : Vectore6,
      }
    })
    // const transformedData = Object.entries(item?.groupedEventsCount || {}).map(([key, value]) => {
    //   const numericValue = Number(value) || 0;
    
    //   return {
    //     type: key.charAt(0).toUpperCase() + key.slice(1),
    //     totalCount: numericValue,
    //     newCount: (key === "new" ? numericValue : 0),
    //     logo: key === "active" ? Vectore7 : key === "past" ? Vectore8 : Vectore6,
    //   };
    // });
    setEventCount(transformedData);
  }
    
  }, [item]);
  const formatType=(type:string)=>{
    if(type==="CUSTOM") return "Custom"
    return type.split("_").slice(1).map((ele)=>`${ele.charAt(0)}${ele.substring(1).toLowerCase()}`).join(' ')
  }
  const handleDoubleClick=(item:any)=>{
    
      setSingleTrackerData(item)
      router.push(`/internal/trackers/${item.id}/trackedEvents?type=${item.type}&view=table&eventType=${isEventeli? "social" :"active"}`)
      setIsNewCall(true); 
      setTrackerId(item.id);
  }
  const handleSingleClick=(item:any)=>{
    setSingleTrackerData(item)
      setSingleTrackerData(item)
     router.push(`/internal/trackers/${item.id}/trackedEvents?type=${item.type}&view=table&eventType=${isEventeli? "social" :"active"}`)
      setMultipleFilters({ 
        skip: skip,
        q: searchValue,
         id: item.id,
      })
  }
  const [userAccessData, setUserAccessData] = useState<any>(null);
  const fetchAccess = async () => {
    const result = await getShareAccess(singleTrackerData?.id, "tracker");
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setUserAccessData(result);
    }
  };
  useEffect(() => {
    if (singleTrackerData?.id) {
      fetchAccess();
    }
  }, [singleTrackerData?.id]);
 
  useEffect(() => {
    if(item?.type === "T_COMPETITOR"){
        setEntryCount(item?.filterValues.orgWebsite.split(',').length)
        console.log(item?.filterValues.orgWebsite.split(","), "entryCount");
        
      }else if(item?.type === "T_PRODUCT_KEYWORDS"){
        const keywordsLen = item?.filterValues?.includeKeywords?.length + item?.filterValues?.excludeKeywords?.length;
        setEntryCount(keywordsLen)
      }
  }, []);
   console.log(entryCount, "entryCount");
  return (
    
    <div className="card cursor-pointer sm:h-[180px] flex-col sm:flex-row w-[100%]" onClick={()=>handleSingleClick(item)}
    onDoubleClick={() => handleDoubleClick(item)} 
    style={{border: singleTrackerData?.id===item.id?"2px solid var(--primary-color)":"2px solid var(--border-color)" }}
    >
        <div className="flex justify-between gap-2 flex-col sm:flex-row h-full">
          <div className="flex gap-2 flex-col justify-between w-[100%] sm:w-[40%]">
            <div className="flex sm:gap-4 flex-col">
            <div className="font-bold break-words leading-none">
              {item?.name?.length>45? `${item.name.substring(0,45)}...`:item.name}
              </div>
            <div className="flex gap-1 w-[100%]">
        {locations?.length>0 && 
        <div className="flex gap-1">
        <div className="pt-[3px]">
        <Location style={{color:"var(--tertiary-text-color)"}} height="12px" width="12px"/>
        </div>
        <div className="flex text-small font-[var(--font-weight-medium)] text-[var(--tertiary-text-color)] w-[95%]" style={{fontSize:"12px"}}>
          {/* {locations?.length > 0 && locations[0].length<15 &&locations[0]}
          {locations?.length > 0 && locations[0].length>15 &&`${locations[0].substring(0,15)}...`} */}
          <div  className={`${
            locations?.length > 1 ? 'w-[75%]' : 'w-full'
            } text-[var(--tertiary-text-color)] break-words whitespace-normal overflow-hidden`}>{locations?.length > 0 && locations[0].length<40 &&locations[0]}
            {locations?.length > 0 && locations[0].length>40 &&`${locations[0].substring(0,40)}...`} </div>
          {locations?.length > 1 &&  (
            <div className="border w-[28px] h-[17px] flex justify-center items-center rounded-lg border-[var(--tertiary-text-color)]">+{locations.length - 1}</div>
          )}
        </div>
        </div>
}
            </div> 
            </div>
            <div className="flex gap-2 text-xs">
            <div className="badge_info w-fit border border-[var(--info-text-color))]" style={{fontSize:"var(--font-size-xs)"}}>
            {formatType(item.type)}</div>
            {entryCount>0 &&
            <div className="badge_info w-fit border border-[var(--info-text-color))]" style={{fontSize:"var(--font-size-xs)"}}>{entryCount} {mapping[`${item.type}`]}</div>
            }
            </div>
            <div className="flex gap-2 text-xs items-center"> 
              <div className="text-[var(--tertiary-text-color)] rounded px-1 py-[2px] bg-[var(--secondary-bg-light)] text-[10px] flex items-center justify-center">Admin</div>
              <div className="text-[var(--secondary-bg-light)]">|</div>
              <div>{userAccessData?.superAdmin[0]?.name}</div>
              {/* <div>{userAccessData?.others?.length} Followers</div> */}
              {/* <Link></Link> */}
              <Link href={`/internal/trackers/${item.id}/manageAccess?type=${item.type}`}>
              <div className="hover:border-b hover:border-[var(--primary-color)] text-[var(--primary-color)]">Manage</div>
              </Link> 
            </div>
             
            </div>
            <div className="flex gap-2 sm:w-[100%] h-full" style={{width:"auto"}}>
            <div className="flex w-full h-full flex-col justify-between">
            <div className="flex gap-2 w-[100%] text-sm font-medium">
            {eventsCount?.map((item,index)=>(
              <div className={`flex w-1/3 flex-col gap-1 items-center justify-center card`} style={{boxShadow:"none", padding:"10px"}} key={index}>
              <div className={`flex items-center justify-center gap-1 border-b-[0.39px] pb-[10px] text-[var(--primary-color)] ${styles.new}`}>
              {isEventeli && (
          item.type === "Business" ? (
            <Buildings height="12px" width="12px" color="var(--primary-color)" />
          ) : item.type === "Social" ? (
             <Globe height="12px" width="12px" color="var(--primary-color)" />
          ) : (
            // <Globe height="12px" width="12px" color="var(--primary-color)" />
            <CloudAlert height={12} width={12} color="var(--primary-color)" />
          )
          )}
                {!isEventeli &&
                <Image src={item.logo} alt={item.type} width={12} height={12}/>
                }
                {item.type}
                
              </div>
              <div className={styles.numberOfEvents}>
                {formatCount(item?.totalCount)}
                {/* <div className="badge_success">
                <ChartTrendingUp width="12px" height="12px" style={{color:"var(--success-text-color)"}}/>
                <span className="text-[10px]">
                5
                </span>
                </div> */}
              </div>
              <div className={styles.events}>Events</div>
            </div>
            ))}
          </div>
            <div className="flex justify-end">
              
              <div className="flex items-center justify-center text-[12px] text-[var(--primary-color)] gap-1 cursor-pointer">
                <div className="flex gap-2 items-center">
                <Link href={`/internal/trackers/${item.id}/notesDiscussion?type=${item.type}`}>
                <NotebookPen width={14} height={14} />
                </Link>
                <Link href={`/internal/trackers/${item.id}/editTracker?type=${item.type}`}>
                 <Settings
                      width={14}
                      height={14}
                    />
                </Link>
              </div>
                <Share2 className="w-4 h-4 text-[var(--primary-color)]" />
              </div>
            </div>
          {/* <div className={styles.lineChart}>
            <Line data={lineData} options={lineOptions} />
          </div> */}
        </div> 
            {/* <div><Image  src={GoTo} alt="goTo" /></div> */}
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