import React, { useState, useEffect, Suspense } from "react";
import styles from "../AllTrackers/allTrackers.style.module.css";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import Loading from "@/app/components/UI/Loading";
import Image from "next/image";
import { Bookmark, Location } from "geist-icons";
import GoTo from "/public/goTo.svg";
import Vectore6 from "/public/newVector.svg";
import Vectore7 from "/public/lucide_timer.svg";
import Vectore8 from "/public/expired.svg";
import ShareModal from '@/app/components/internal/trackers/shareModal'
import Link from "next/link";
import { usePathname, useSearchParams } from 'next/navigation';
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/context';
import { GAEvent } from "@/utils/GAEvent";
import ShareWidget from "../ShareWidget";
import { useTrackerServices } from "@/services/trackerServices";
import { useTrackerContext } from "@/context/tracker";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
// import { useTheme } from '@/context/theme';
const CommonTrackerCard = () => {
  const {data: item}=useTrackerContext();
  // const { theme } = useTheme();
  //   console.log(Math.floor(item?.groupedEventsCountByDate.length / 7));
  const pathName = usePathname().split('/');
  const [loading,setLoading]=useState(false);
  const {getTrackerDetail, error}=useTrackerServices();
  const trackerId = pathName[pathName.length - 2];
  const [id, setId] = useState<string>("");
  // const [data, setData] = useState<any>([]);
  // const [item, setItem] = useState<any>([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     // const url = `${baseUrl}/tracker/${trackerId}`;
  //     // try {
  //     //   const { data, error } = await myFetch(url, {
  //     //     method: 'GET'
  //     //   });
  //     //   if (error) {
  //     //     console.error('Error fetching data:', error);
  //     //   } else {
  //     //     setItem(data);
  //     //     setLoading(false);
  //     //   }
  //     // } catch (err) {
  //     //   console.error('Fetch failed:', err);
  //     // }
  //     try{
  //     const data = await getTrackerDetail(trackerId);
  //     if (error) {
  //           console.error('Error fetching data:', error);
  //         } else if(data) {
  //           setItem(data);
  //           setLoading(false);
  //         }
  //     }catch(error){
  //         console.log(error);
          
  //     }
  //   };

  //   fetchData();
  // }, []);
  
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
  console.log(item);
  const [locations, setLocations] = useState<any>();
  const [share, setShare] = useState(false);
  const [accessdata, setAccessData] = useState([]);
  const [sendInvite,setSendInvite]=useState(false);
  useEffect(() => {
    console.log(item?.tracker?.eventCountry);

    const eventCountry = item?.tracker?.filterValue?.eventCountry?.map((countryObj: {}) => Object.values(countryObj)[0]) || [];
    const eventCity = item?.tracker?.filterValue?.eventCity?.map((cityObj: {}) => Object.values(cityObj)[0]) || [];
    const eventZone = item?.tracker?.filterValue?.eventRegion?.split(",") || [];
    setLocations([...eventCountry, ...eventCity, ...eventZone]);
  }, [item]);
useEffect(() => {
        const handlePopState = (event: any) => {
            if (event.state && event.state.shareOpen) {
                closeShareModal();
            } else if (share) {
                closeShareModal();
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [share, sendInvite]);
  const closeShareModal = () => {
    if(share===true)
      setShare(false);
  
    else if(sendInvite) setSendInvite(false);
      document.body.style.height = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
  };
  const closeModal = (e: any) => {
    const targetElement = e.target;
    if (targetElement.classList.contains(styles.shareModal)) {
        closeShareModal();
    }
};
const shareFunction = () => {
  if (!share) {
      window.history.pushState({ shareOpen: true }, '');
      setShare(true);
      document.body.style.height = '100vh';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
  } else {
      closeShareModal();
  }
};
console.log(item);
const formatCount = (count: number ) => {
  if (count >= 1000) {
    const value = count / 1000;
    const decimalPart = value - Math.floor(value);
      return `${Math.floor(value)}k`;
  }
  return count;
};
  return (
    <div className="flex flex-col w-full gap-6">
    {/* {
      loading && 
      <div style={{display:"flex", justifyContent:"center", width:"100%"}}>
      <Loading/>
      </div>
    } */}
      {item ? (
        <div className="flex flex-col w-full gap-2">
        <div className='card' style={{ width: "100%", height: "fit-content", padding:"16px" }}>

          <div className={styles.cardOne}>
            <div className="font-semibold">{item?.name}</div>
            {/* <div className={styles.heading}>one</div> */}
            {/* <Image src={GoTo} alt="goTo" /> */}
          </div>
          <div className="flex gap-1 items-center">
          {locations?.length>0 && 
            <>
            <Location style={{color:"var(--tertiary-text-color)"}} height="12px" width="12px"/>
            <div className="flex items-center gap-[5px] text-small font-[var(--font-weight-medium)] text-[var(--tertiary-text-color)]">
              {locations?.length > 0 && locations[0]}
              {locations?.length > 1 && (
                <span className={styles.moreBtn}>+{locations.length - 1}</span>
              )}
            </div>
            </>
          }
          </div>
          <div className="flex w-full pt-1" style={{ height: "auto" }}>
            <div className="flex gap-4 w-full flex-col">
              <div className="flex gap-5">
                <div className={`flex flex-col gap-1 items-center justify-center w-1/2 card`}>
                  {/* <div className={styles.new}>
                <Image src={Vectore6} alt="newVector" />
                New
              </div> */}
                  <div>
                    {formatCount(item?.groupedEventsCount?.new)}
                  </div>
                  <div className="flex gap-1 text-sm text-[var(--tertiary-text-color)]" style={{ borderBottom: "0px" }}>
                    <Image src={Vectore6} alt="newVector" width={10} height={10}/>
                    <div >New</div>
                  </div>
                </div>
                <div className={`flex flex-col gap-1 items-center justify-center w-1/2 card`}>
                  {/* <div className={styles.new}>
                <Image src={Vectore7} alt="lucide_timer" />
                Active
              </div> */}
                  <div>
                    {formatCount(item?.groupedEventsCount?.active)}
                  </div>
                  <div className="flex gap-1 text-sm text-[var(--tertiary-text-color)]" style={{ borderBottom: "0px" }}>
                    <Image src={Vectore7} alt="lucide_timer" width={12} height={12}/>
                    Active</div>
                </div>
              </div>
              <div className="flex gap-5">
                <div className={`flex flex-col gap-1 items-center justify-center w-1/2 card`}>
                  <div>
                    {formatCount(item?.groupedEventsCount?.past)}
                  </div>
                  <div className="flex gap-1 text-sm text-[var(--tertiary-text-color)]" style={{ borderBottom: "0px", alignItems: "center", justifyContent: "center" }}>
                    <Image src={Vectore8} alt="expired" width={12} height={12} />
                    Past</div>
                </div>
                <div className={`flex flex-col gap-1 items-center justify-center w-1/2 card`}>
                  <div>
                    {formatCount(item?.savedEventsCount)}
                  </div>
                  <div className="flex gap-1 text-sm text-[var(--tertiary-text-color)]" style={{ borderBottom: "0px", alignItems: "center", justifyContent: "center" }}>
                  <Bookmark style={{color:"var(--primary-color)"}} width="12px" height="12px"/>
                    Bookmarked</div>
                </div>
              </div>
            </div>
            {/* <div className={styles.lineChart}>
            <Line data={lineData} options={lineOptions} />
          </div> */}
          </div>
          
        </div>
        {/* <ShareWidget/> */}
        <Button variant="outline" className="flex gap-1" onClick={()=>setShare(!share)}>
          <Share2 width={16} height={16}/>
          Share 
          </Button>
        {/* <div onClick={()=>setShare(!share)} className={styles.shareTracker}>Share Tracker</div> */}
        {share && 
        <div className={styles.shareModal} onClick={closeModal}>
          <ShareModal id={id} setId={setId} closeShareModal={closeShareModal} share={share} setShare={setShare} shareFunction={shareFunction}/>
          {/* <ShareWidget/> */}
        </div>
        }
        </div>
      ): (<div></div>)}
    </div>
  );
};

export default CommonTrackerCard;