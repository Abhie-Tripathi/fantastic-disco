"use client"
import React, { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Back from '/public/back.svg';
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import Settings from '/public/trackerSetting.svg';
import Manage from '/public/manageTracker.svg';
// import Link from "next/link";
import Image from "next/image";
import styles from './sideNav.style.module.css';
import Link from 'next/link';
import { GAEvent } from '@/utils/GAEvent';
import { SettingsGear, User } from 'geist-icons';
import { useTrackerServices } from '@/services/trackerServices';
import { useTrackerContext } from '@/context/tracker';
import { Button } from "@/components/ui/button";
const Index = () => {
  const pathName = usePathname().split('/');
  const last = pathName[pathName.length - 1];
  const searchParams = useSearchParams();
  const type  = searchParams.get('type');
  const typeOfView  = searchParams.get('view');
  const typeOfEvent = searchParams.get('eventType')
  const [view,setView]=useState(typeOfEvent==="table"?"table":typeOfView==="list" ?"list":typeOfView==="map"?"map":typeOfView==="calendar"?"calendar":"table");
  const secondLast = pathName[pathName.length - 2];
  const router = useRouter()
  const {data, skip, searchValue}= useTrackerContext();
  const {getTrackerDetail, error}=useTrackerServices();
  const [trackerSection, setTrackerSection] = useState("Tracked Events");
  useEffect(() => {
    if (last === "trackedEvents") setTrackerSection("Tracked Events")
    if (last === "trackedConfiguration" || last === "editTracker") {
      setTrackerSection("Tracker Configurations")
      setView('');
    }
    if (last === "notesDiscussion") {
      setTrackerSection("Notes & Discussions")
      setView("");
    }
    if (last === "savedEvents") setTrackerSection("Saved Events")
    if (last === "manageAccess") {
      setTrackerSection("Manage Access")
      setView("");
    }
  }, [last])
  console.log(trackerSection);
  // const [data, setData] = useState<any>([]);
  // useEffect(() => {
    // const fetchData = async () => {
    //   const url = `${baseUrl}/tracker/${secondLast}`;
    //   try {
    //     const { data, error } = await myFetch(url, {
    //       method: 'GET'
    //     });
    //     if (error) {
    //       console.error('Error fetching data:', error);
    //     } else {
    //       console.log('Data fetched:', data);
    //       setData(data);
    //     }
    //   } catch (err) {
    //     console.error('Fetch failed:', err);
    //   }
    // };

  //   fetchData();
  // }, [secondLast]);
  const handleClick = (view:string) => {
    setView(view);
    if(last==="savedevents"){
      router.push(`/internal/trackers/savedevents?view=${view}`);
    }else
    router.push(`/internal/trackers/${secondLast}/trackedEvents?type=${type}&view=${view}&eventType=${typeOfEvent}`);
  };
  // const fetchData=async()=>{
  //     const result = await getTrackerDetail(secondLast)
  //     if(result){
  //       setData(result);
  //     }
  //     if(error){
  //       console.error('Error fetching data:', error);
  //     }
  // }
  
  return (
    <>
      <div className="fixed h-[60px] px-[10px] flex justify-between border-b border-b-[var(--border-color)] top-[67px] w-[calc(100vw-63px)] bg-[var(--primary-foreground)] z-10 text-h6 left-[63px]">
        <div className="flex items-center w-[25%] gap-[var(--spacing-xxs)] text-[var(--primary-color)] font-bold">
          <Link className={styles.bottom} href={
             last === "editTracker"
              ? (last === "editTracker"
                ? `/internal/trackers/${secondLast}/trackedConfiguration?type=${type}`
                : `/internal/trackers/${secondLast}/trackedEvents?type=${type}`)
              : `/internal/trackers?skip=${skip}${searchValue.length > 0 ? `&q=${encodeURIComponent(searchValue)}` : ""}`
          } >
          {/* <Button
          variant="link"
          className="flex items-center gap-2 p-0"
          onClick={() => router.back()}
          > */}
            <Image style={{ display: "flex" }} src={Back} alt="back" />
            
          </Link>
          {last==="savedevents"?
          <div className={styles.tooltipContainer}>Saved Events</div>:
          <div className={styles.tooltipContainer} style={{ cursor: data?.tracker?.name?.length > 20 ? "pointer" : "default" }}>
            {data?.name?.length > 20 ? data?.name?.substring(0, 20) + '...' : data?.name}
            {data?.name?.length > 20 && <span className={styles.tooltipText}>{data?.name}</span>}

          </div>
          }
          {/* </Button> */}
        </div>

        <>
          <div className="flex justify-center items-center" >
          <div className='flex p-1 gap-2 justify-evenly bg-[var(--accent-color)] items-center border border-[var(--neutral-light-color)] rounded-md'>
            {/* <Link href={`/internal/trackers/${secondLast}/trackedEvents?type=${type}&view=${view}`}> */}
            <div onClick={()=>handleClick("table")}>
              <div className={`${styles.viewsTab} ${view === "table" ? styles.tabActive : ""} cursor-pointer`} onClick={()=>setView("table")}>Table</div></div>
            <div onClick={()=>handleClick("list")}>
              <div className={`${styles.viewsTab} ${view === "list" ? styles.tabActive : ""} cursor-pointer`} onClick={()=>setView("list")}>List</div></div>
              {/* </Link> */}
              <div className="cursor-pointer">
              {last==="savedevents"?
               <div className={`relative cursor-not-allowed disabled ${styles.tooltipContainer}`}>
               <div className={styles.viewsTab}>
                 Map
               <span className={`${styles.tooltipText}`} style={{marginLeft:"-30%"}}>Coming Soon</span>
               </div>
               </div>:
              <div className={`${styles.viewsTab} ${view === "map" ? styles.tabActive : ""}`} onClick={()=>handleClick("map")}>Map</div>
              }
             
              
              {/* <div className={`relative cursor-not-allowed disabled ${styles.tooltipContainer}`}>
              <div className={styles.viewsTab}>
                Map
              <span className={`${styles.tooltipText}`} style={{marginLeft:"-30%"}}>Coming Soon</span>
              </div>
              </div> */}
              </div>
              <div className="cursor-pointer">
              {/* <div className={`${styles.viewsTab} ${view === "calendar" ? styles.tabActive : ""}`} onClick={()=>handleClick("calendar")}>Calendar</div> */}
              <div className={`relative`}>
              <div className={`${styles.viewsTab} ${view === "calendar" ? styles.tabActive : ""}`} onClick={()=>setView("calendar")}>Calendar</div>
              {/* <div className={styles.viewsTab}>
              Calendar
              <span className={`${styles.tooltipText}`} style={{marginLeft:"-30%"}}>Coming Soon</span>
              </div> */}
              </div>

              </div>
            </div>
            {/* <Link href={`/internal/trackers/${secondLast}/trackedEvents?type=${type}`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "Tracked Events"
                )
              }}
            >
              <div className={`${styles.heading} ${trackerSection === "Tracked Events" ? styles.active : ""}`} onClick={() => setTrackerSection("Tracked Events")}>
                Tracked Events
              </div>
            </Link>

            <Link href={`/internal/trackers/${secondLast}/notesDiscussion?type=${type}`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "Notes and Discussion"
                )
              }}
            >
              <div className={`${styles.heading} ${trackerSection === "Notes & Discussions" ? styles.active : ""}`} onClick={() => setTrackerSection("Notes & Discussions")}>
                Notes & Discussions
              </div>
            </Link>
            <Link href={`/internal/trackers/${secondLast}/savedEvents?type=${type}`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "Saved Events"
                )
              }}
            >
              <div className={`${styles.heading} ${trackerSection === "Saved Events" ? styles.active : ""}`} onClick={() => setTrackerSection("Saved Events")}>
                Saved Events
              </div>
            </Link> */}

          </div>
          
          <div className={styles.configAccess}>
          {last!=="savedevents"&&
            <>
            <Link href={`/internal/trackers/${secondLast}/trackedConfiguration?type=${type}`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "Configuration"
                )
              }}>
              <div style={{ padding: "10px 5px", display: "flex" }} className={`${styles.heading} ${styles.tooltipContainer} ${trackerSection === "Tracker Configurations" ? styles.active : ""}`} onClick={() => setTrackerSection("Tracker Configurations")}>
                <SettingsGear width='12px' height='12px' style={{color: trackerSection === "Tracker Configurations" ? "var(--primary-color)" :"var(--tertiary-text-color)"}}/>
                <span>Configurations</span>
              </div>
            </Link>
            <Link href={`/internal/trackers/${secondLast}/manageAccess?type=${type}`}
              onClick={() => {
                GAEvent(
                  "trackers",
                  "Tracker Detail",
                  "View",
                  "User Access"
                )
              }}
            >
              <div style={{ padding: "10px 5px", display: "flex" }} className={`${styles.heading} ${styles.tooltipContainer} ${trackerSection === "Manage Access" ? styles.active : ""}`} onClick={() => setTrackerSection("Manage Access")}>
                <User width='12px' height='12px' style={{color: trackerSection === "Manage Access" ? "var(--primary-color)" :"var(--tertiary-text-color)"}}/>
                <span>Manage Access</span>
              </div>
            </Link>
            </>
            }
          </div>
        </>


      </div>
    </>
  )
}

export default Index