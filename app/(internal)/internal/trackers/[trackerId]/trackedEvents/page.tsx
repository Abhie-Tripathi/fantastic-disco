"use client"
import React, { Suspense, useEffect, useState } from 'react'
import Expand from '/public/expand_more.svg';
import { Notes } from '@/app/components/eventDetail/Notes';
import ExportModal from '@/app/components/Search/ExportModal';
import styles from './trackedEvents.style.module.css'
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import Image from 'next/image';
// import Trackers from '@/app/components/internal/trackers/CommonTrackerCard'
const Trackers = React.lazy(() => import('@/app/components/internal/trackers/CommonTrackerCard'));
import Table from '@/app/components/Table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/context';
import {
  Button,
  Dialog,
  DialogTrigger,
  MenuTrigger,
  Modal,
  ModalOverlay,
  Popover,
} from "react-aria-components";
import Loading from '@/app/components/UI/Loading';
import { GAEvent } from '@/utils/GAEvent';
// import Table from '@/app/components/Table'
const Page = () => {
  const [active, setActive] = useState("Active Events")
  const [type, setType] = useState<string | undefined>();
  const [activeValue, setActiveValue] = useState();
  const pathName = usePathname().split('/');
  const [loading,setLoading]=useState(false);
  const searchParams = useSearchParams()
  const router = useRouter();
  const token = searchParams.get('token')

  // const [showInsights,setShowInsights]=useState();
  const id = pathName[pathName.length - 2];
  console.log(active);
  const [data, setData] = useState<any>();
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState("active");

  const showInsights = {
    eventSize: true,
    eventKeywords: true,
    global: true,
    reptSent: true,
    eventRank: true,
    matchScore: true,
    estExhibit: true,
    growth: true,
    repeatSent: true,
  };
  const lineData = {
    labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"],
    datasets: [
      {
        label: "First dataset",
        data: [33, 65, 44, 85, 44, 65, 78, 50, 60, 35, 28, 96, 54],
        fill: true,
        backgroundColor: "rgba(250, 117, 157, 0.15)",
        borderColor: "#FA759D",
        tension: 0.3,
      },
    ],
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);
      const url = `${baseUrl}/tracker/${id}`;
      try {
        const { data, error } = await myFetch(url, {
          method: 'GET'
        });
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setData(data);
          setLoading(true);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };

    fetchData();
  }, []);

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
  useEffect(() => {
    setOpen(true);
  }, [])
  const [exp, setExp] = useState(false);
  const exportData = async () => {
    let dataToSend = {}
    if (active === "Active Events") {
      dataToSend = {
        type: "ACTIVE",
      }
    } else if (active === "New Events") {
      dataToSend = {
        type: "NEW",
      }
    } else {
      dataToSend = {
        type: "EXPIRED",
      }
    }
    try {
      const { data, error } = await myFetch(`${baseUrl}/tracker/${pathName[pathName.length - 2]}/export`, {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data) {
        console.log(data);
      } else {
        console.log(error);
      }
    } catch (err) {
      console.error("Error saving event:", err);
    } finally {

      // setIsSaving(false);
    }
  }
  useEffect(() => {
    if (active === "Active Events") setType('ACTIVE');
    if (active === "New Events") setType('NEW');
    if (active === "Expired Events") setType('EXPIRED')
  }, [active])
  useEffect(() => {
    console.log(activeValue);
  }, [active])
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    console.log(count);
    return count;
  };
  const saveTracker = async () => {
    const selectedEventCat = ["671b1a45-d40f-4559-959f-cd7a9b1617de", "4612db12-9084-4d61-901d-ab7bd3120ade"]
    const formData = {
      name: "one",
      filterValue: {
        eventCategory: selectedEventCat.join(',')
      }
    }
    const { data, error } = await myFetch(`${baseUrl}/tracker`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      console.log(data);

      router.replace("/internal/trackers");
    }
  }
  return (
    // <div className={styles.containerOne}>
    <div className={styles.container}>
      {/* <div className={styles.top}>
      <div className={styles.topLeft} onClick={() => setOpen(!open)}>
        <div style={{ color: "#6750A4", fontWeight: "500" }}>Tracker Trends and Analytics</div>
        <div>
          <Image
            style={{
              transform: !open ? "rotate(-90deg)" : "none",
              transition: "transform 0.3s ease-in-out"
            }}
            src={Expand}
            alt="expand_more"
          />
        </div>
      </div>
      <div className={`${styles.transition} ${open ? styles.transitionOpen : ""}`}>
        <div className={styles.topFirst}>
          <div className={styles.topFirstLeft}>
            <div className={styles.overView}>Tracker Overview</div>
            <div className={styles.overViewContent}>Have a quick overview of all trackers and addition of any new events</div>
          </div>
          <div className={styles.topFirstRight}>
            <div className={styles.totalEvent}>Total Events</div>
            <div className={styles.overView} style={{ color: "#6750A4" }}>189</div>
          </div>
        </div>
        <div className={styles.lineChart}>
          <div className={styles.data}>
            <Line style={{ height: "200px" }} data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
      <div className={styles.topRight}></div>
    </div> */}

<Suspense fallback={<p>Loading feed...</p>}>
      <div className={styles.innerRight}>
        <div className={styles.eventStatus}>
          <div className={styles.eventStatusLeft}>
            <button className={`${styles.eventStatusBtn} ${active === "Active Events" ? styles.active : ""}`} onClick={() => {
              GAEvent(
                "trackers",
                "Tracker Detail",
                "View",
                "Active Events"
              )
              setActive("Active Events")
            }}>
              Active Events
              {<div className={styles.circle}>{loading?formatCount(data?.tracker?.groupedEventsCountByStatus?.groupedEventsByStatus?.active):<div className={styles.loader}></div>}</div>}

            </button>
            <button className={`${styles.eventStatusBtn} ${active === "New Events" ? styles.active : ""}`} onClick={() => {
              GAEvent(
                "trackers",
                "Tracker Detail",
                "View",
                "New Events"
              )
              setActive("New Events")
            }}>
              New Events
              {<div className={styles.circle}>{loading ?formatCount(data?.tracker?.groupedEventsCountByStatus?.groupedEventsByStatus?.new):<div className={styles.loader}></div>}</div>}
            </button>
            <button className={`${styles.eventStatusBtn} ${active === "Expired Events" ? styles.active : ""}`} onClick={() => {
              GAEvent(
                "trackers",
                "Tracker Detail",
                "View",
                 "Expired Events"
              )
              setActive("Expired Events")}}>Expired Events
              {<div className={styles.circle}>{loading?formatCount(data?.tracker?.groupedEventsCountByStatus?.groupedEventsByStatus?.expired):<div className={styles.loader}></div>}</div>}
            </button>
          </div>
          {/* <div className={styles.eventStatusRight} onClick={exportData}>Export Data</div> */}
          {id === "1" ?
            <div onClick={() => saveTracker()} className={styles.eventStatusRight}>Save</div> :
            <DialogTrigger>
              <Button className={styles.exportButton}>

                <div className={styles.eventStatusRight}>{"Export Data"}</div>
              </Button>
              <ModalOverlay isDismissable className={styles.modalOverlay}>
                <Modal>
                  <Dialog>
                    {({ close }) => (
                      <ExportModal onClose={close} type={type} />
                    )}
                  </Dialog>
                </Modal>
              </ModalOverlay>
            </DialogTrigger>
          }


        </div>
       
        <Table showInsights={showInsights} eventType={active} setActiveValue={setActiveValue} />
        
        {/* {exp && <ModalOverlay isDismissable className={styles.modalOverlay}>
              <Modal>
                <Dialog>
                  {({ close }) => (
                    <ExportModal onClose={close} filterValue={filters} />
                  )}
                </Dialog>
              </Modal>
            </ModalOverlay>} */}

      </div>
      </Suspense>
    </div>

  )
}

export default Page;