"use client";
import React, { useEffect, useState } from "react";
import Expand from "/public/expand_more.svg";
import { Notes } from "@/app/components/eventDetail/Notes";
import ExportModal from "@/app/components/Search/ExportModal";
import Table from "@/app/components/Table";
import styles from "./trackedEvents.style.module.css";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import Image from "next/image";
import Trackers from "@/app/components/internal/trackers/CommonTrackerCard";
import { usePathname, useSearchParams } from "next/navigation";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/context";
import {
  Button,
  Dialog,
  DialogTrigger,
  MenuTrigger,
  Modal,
  ModalOverlay,
  Popover,
} from "react-aria-components";
// import Table from '@/app/components/Table'
const Page = () => {
  const [active, setActive] = useState("Active Events");
  const [type, setType] = useState<string | undefined>();
  const [activeValue, setActiveValue] = useState();
  const pathName = usePathname().split("/");
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

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
    labels: [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
    ],
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
      const url = `${baseUrl}/tracker/${id}`;
      try {
        const { data, error } = await myFetch(url, {
          method: "GET",
        });
        if (error) {
          console.error("Error fetching data:", error);
        } else {
          setData(data);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
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
  }, []);
  const [exp, setExp] = useState(false);
  const exportData = async () => {
    let dataToSend = {};
    if (active === "Active Events") {
      dataToSend = {
        type: "ACTIVE",
      };
    } else if (active === "New Events") {
      dataToSend = {
        type: "NEW",
      };
    } else {
      dataToSend = {
        type: "EXPIRED",
      };
    }
    try {
      const { data, error } = await myFetch(
        `${baseUrl}/tracker/${pathName[pathName.length - 2]}/export`,
        {
          method: "POST",
          body: JSON.stringify(dataToSend),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
  };
  useEffect(() => {
    if (active === "Active Events") setType("ACTIVE");
    if (active === "New Events") setType("NEW");
    if (active === "Expired Events") setType("EXPIRED");
  }, [active]);
  useEffect(() => {
    console.log(activeValue);
  }, [active]);

  console.log(
    data?.tracker?.groupedEventsCountByStatus.groupedEventsByStatus.active
  );
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count;
  };
  return (
    <div className={styles.containerOne}>
      <div className={styles.container}>
        <div className={styles.eventStatus}>
          <div className={styles.eventStatusLeft}>
            <button
              className={`${styles.eventStatusBtn} ${
                active === "Active Events" ? styles.active : ""
              }`}
              onClick={() => setActive("Active Events")}
            >
              Active Events
              {active !== "Active Events" && (
                <div className={styles.circle}>
                  {
                    data?.tracker?.groupedEventsCountByStatus
                      ?.groupedEventsByStatus.active
                  }
                </div>
              )}
            </button>
            <button
              className={`${styles.eventStatusBtn} ${
                active === "New Events" ? styles.active : ""
              }`}
              onClick={() => setActive("New Events")}
            >
              New Events
              {active !== "New Events" && (
                <div className={styles.circle}>
                  {
                    data?.tracker?.groupedEventsCountByStatus
                      ?.groupedEventsByStatus.new
                  }
                </div>
              )}
            </button>
            <button
              className={`${styles.eventStatusBtn} ${
                active === "Expired Events" ? styles.active : ""
              }`}
              onClick={() => setActive("Expired Events")}
            >
              Expired Events
              {active !== "Expired Events" && (
                <div className={styles.circle}>
                  {formatCount(
                    data?.tracker?.groupedEventsCountByStatus
                      ?.groupedEventsByStatus.expired
                  )}
                </div>
              )}
            </button>
          </div>
          {/* <div className={styles.eventStatusRight} onClick={exportData}>Export Data</div> */}
          <DialogTrigger>
            <Button className={styles.exportButton}>
              <div className={styles.eventStatusRight}>Export Data</div>
            </Button>
            <ModalOverlay isDismissable className={styles.modalOverlay}>
              <Modal>
                <Dialog>
                  {({ close }) => <ExportModal onClose={close} type={type} />}
                </Dialog>
              </Modal>
            </ModalOverlay>
          </DialogTrigger>
        </div>
        <div
          className={`${styles.transition} ${
            open ? styles.transitionOpen : ""
          }`}
        >
          <div className={styles.topFirst}>
            <div className={styles.topFirstLeft}>
              <div className={styles.overView}>Tracker Overview</div>
              <div className={styles.overViewContent}>
                Have a quick overview of all trackers and addition of any new
                events
              </div>
            </div>
            <div className={styles.topFirstRight}>
              <div className={styles.totalEvent}>Total Events</div>
              <div className={styles.overView} style={{ color: "#6750A4" }}>
                189
              </div>
            </div>
          </div>
          <div className={styles.lineChart}>
            <div className={styles.data}>
              <Line
                style={{ height: "200px" }}
                data={lineData}
                options={lineOptions}
              />
            </div>
          </div>
        </div>
        <div className={styles.topRight}></div>
      </div>
      <div className={styles.innerLeft}>
        <Trackers />
      </div>
      <div className={styles.innerRight}>
        <div className={styles.eventStatus}>
          <div className={styles.eventStatusLeft}>
            <button
              className={`${styles.eventStatusBtn} ${
                active === "Active Events" ? styles.active : ""
              }`}
              onClick={() => setActive("Active Events")}
            >
              Active Events
              {
                <div className={styles.circle}>
                  {
                    data?.tracker?.groupedEventsCountByStatus
                      ?.groupedEventsByStatus.active
                  }
                </div>
              }
            </button>
            <button
              className={`${styles.eventStatusBtn} ${
                active === "New Events" ? styles.active : ""
              }`}
              onClick={() => setActive("New Events")}
            >
              New Events
              {
                <div className={styles.circle}>
                  {
                    data?.tracker?.groupedEventsCountByStatus
                      ?.groupedEventsByStatus.new
                  }
                </div>
              }
            </button>
            <button
              className={`${styles.eventStatusBtn} ${
                active === "Expired Events" ? styles.active : ""
              }`}
              onClick={() => setActive("Expired Events")}
            >
              Expired Events
              {
                <div className={styles.circle}>
                  {formatCount(
                    data?.tracker?.groupedEventsCountByStatus
                      ?.groupedEventsByStatus.expired
                  )}
                </div>
              }
            </button>
          </div>
          {/* <div className={styles.eventStatusRight} onClick={exportData}>Export Data</div> */}
          <DialogTrigger>
            <Button className={styles.exportButton}>
              <div className={styles.eventStatusRight}>Export Data</div>
            </Button>
            <ModalOverlay isDismissable className={styles.modalOverlay}>
              <Modal>
                <Dialog>
                  {({ close }) => <ExportModal onClose={close} type={type} />}
                </Dialog>
              </Modal>
            </ModalOverlay>
          </DialogTrigger>
        </div>
        <Table
          showInsights={showInsights}
          eventType={active}
          setActiveValue={setActiveValue}
        />
      </div>
    </div>
  );
};

export default Page;
