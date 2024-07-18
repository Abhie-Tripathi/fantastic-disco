"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.style.module.css";
import Link from "next/link";
import { Suspense, lazy } from "react";
import MoreIcon from "/public/dots.svg";
import Back from "/public/back.svg";
import Table from "@/app/components/Table";
import TrackerCard from "@/app/components/internal/trackers/TrackerCard";
import { baseUrl } from "@/constants";
import Add from "/public/add.svg";
import { myFetch } from "@/utils/myFetch";
import Image from "next/image";
import Expand from "/public/expand_more.svg";
import Template from "/public/template.svg";
import People from "/public/ionPeople.svg";
import PeopleFinder from "/public/peopleFinder.svg";
import Competitor from "/public/competitor.svg";
import Speaking from "/public/speaking.svg";
import Audience from "/public/audience.svg";
import Customer from "/public/customer.svg";
import Keywords from "/public/keywords.svg";
import SocialCause from "/public/socialCause.svg";
import Brand from "/public/brand.svg";
import Vector1 from "/public/vectorTemplate.svg";
import Vector3 from "/public/Vector3.svg";
import Vector4 from "/public/Vector4.svg";
import MyTracker from "@/app/components/internal/trackers/MyTrackers";
import Loading from "@/app/components/UI/Loading";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark";
function AllTrackers({ fillColor }: { fillColor: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="11"
      viewBox="0 0 18 11"
      fill={fillColor}
    >
      <path
        d="M3 6.5H15C15.55 6.5 16 6.05 16 5.5C16 4.95 15.55 4.5 15 4.5H3C2.45 4.5 2 4.95 2 5.5C2 6.05 2.45 6.5 3 6.5ZM1 10.5H13C13.55 10.5 14 10.05 14 9.5C14 8.95 13.55 8.5 13 8.5H1C0.45 8.5 0 8.95 0 9.5C0 10.05 0.45 10.5 1 10.5ZM4 1.5C4 2.05 4.45 2.5 5 2.5H17C17.55 2.5 18 2.05 18 1.5C18 0.95 17.55 0.5 17 0.5H5C4.45 0.5 4 0.95 4 1.5Z"
        fill={fillColor}
      />
    </svg>
  );
}
function CustomeTracker({ fillColor }: { fillColor: string }) {
  return (
    <svg
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.4668 4.5C4.4668 3.94188 4.57673 3.38923 4.79031 2.87359C5.00389 2.35796 5.31694 1.88945 5.71159 1.4948C6.10624 1.10015 6.57476 0.787094 7.09039 0.573512C7.60603 0.359929 8.15868 0.25 8.7168 0.25C9.27491 0.25 9.82757 0.359929 10.3432 0.573512C10.8588 0.787094 11.3274 1.10015 11.722 1.4948C12.1166 1.88945 12.4297 2.35796 12.6433 2.87359C12.8569 3.38923 12.9668 3.94188 12.9668 4.5C12.9668 5.62717 12.519 6.70817 11.722 7.5052C10.925 8.30223 9.84397 8.75 8.7168 8.75C7.58963 8.75 6.50862 8.30223 5.71159 7.5052C4.91456 6.70817 4.4668 5.62717 4.4668 4.5ZM8.7168 1.75C7.98745 1.75 7.28798 2.03973 6.77225 2.55546C6.25653 3.07118 5.9668 3.77065 5.9668 4.5C5.9668 5.22934 6.25653 5.92882 6.77225 6.44454C7.28798 6.96027 7.98745 7.25 8.7168 7.25C9.44614 7.25 10.1456 6.96027 10.6613 6.44454C11.1771 5.92882 11.4668 5.22934 11.4668 4.5C11.4668 3.77065 11.1771 3.07118 10.6613 2.55546C10.1456 2.03973 9.44614 1.75 8.7168 1.75ZM4.7168 11.75C4.12006 11.75 3.54776 11.9871 3.12581 12.409C2.70385 12.831 2.4668 13.4033 2.4668 14V15.188C2.4668 15.206 2.4798 15.222 2.4978 15.225C6.6168 15.897 10.8178 15.897 14.9358 15.225C14.9445 15.2236 14.9525 15.219 14.9582 15.2122C14.9639 15.2055 14.9669 15.1969 14.9668 15.188V14C14.9668 13.4033 14.7297 12.831 14.3078 12.409C13.8858 11.9871 13.3135 11.75 12.7168 11.75H12.3768C12.35 11.7498 12.3233 11.7538 12.2978 11.762L11.4328 12.045C9.66797 12.6212 7.76562 12.6212 6.0008 12.045L5.1348 11.762C5.10991 11.754 5.08393 11.75 5.0578 11.75H4.7168ZM0.966797 14C0.966797 13.0054 1.36189 12.0516 2.06515 11.3483C2.76841 10.6451 3.72223 10.25 4.7168 10.25H5.0568C5.2418 10.25 5.4258 10.28 5.6008 10.336L6.4668 10.619C7.92884 11.0962 9.50476 11.0962 10.9668 10.619L11.8328 10.336C12.0078 10.279 12.1918 10.25 12.3758 10.25H12.7168C13.7114 10.25 14.6652 10.6451 15.3684 11.3483C16.0717 12.0516 16.4668 13.0054 16.4668 14V15.188C16.4668 15.942 15.9208 16.584 15.1768 16.705C10.8984 17.4034 6.53515 17.4034 2.2568 16.705C1.89672 16.6464 1.56924 16.4616 1.33291 16.1837C1.09657 15.9057 0.966802 15.5528 0.966797 15.188V14Z"
        fill={fillColor}
      />
    </svg>
  );
}
function PremiumTracker({ fillColor }: { fillColor: string }) {
  return (
    <svg
      width="17"
      height="21"
      viewBox="0 0 17 21"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.16948 11.3996L7.03194 8.54316L4.7623 6.87691H7.5988L8.4668 3.99059L9.3359 6.87691H12.1713L9.89501 8.54206L10.7586 11.3996L8.4668 9.62595L6.16948 11.3996ZM2.93108 20.4616V13.1655C2.22989 12.4754 1.68555 11.6672 1.29805 10.7408C0.910547 9.81675 0.716797 8.82696 0.716797 7.77148C0.716797 5.61108 1.46818 3.7795 2.97094 2.27674C4.4737 0.773973 6.30565 0.022223 8.4668 0.0214849C10.6279 0.0207468 12.4599 0.772127 13.9627 2.27563C15.4654 3.77913 16.2168 5.61108 16.2168 7.77148C16.2168 8.82622 16.023 9.81638 15.6355 10.7419C15.248 11.6675 14.7037 12.4746 14.0025 13.1633V20.4593L8.4668 18.7986L2.93108 20.4616ZM8.4668 14.4143C10.312 14.4143 11.8805 13.7685 13.1722 12.4768C14.4638 11.1852 15.1097 9.61672 15.1097 7.77148C15.1097 5.92625 14.4638 4.35779 13.1722 3.06613C11.8805 1.77446 10.312 1.12863 8.4668 1.12863C6.62156 1.12863 5.05311 1.77446 3.76144 3.06613C2.46977 4.35779 1.82394 5.92625 1.82394 7.77148C1.82394 9.61672 2.46977 11.1852 3.76144 12.4768C5.05311 13.7685 6.62156 14.4143 8.4668 14.4143ZM4.03823 18.8916L8.4668 17.6505L12.8954 18.8916V14.0977C12.2783 14.5516 11.5923 14.9022 10.8372 15.1495C10.0836 15.3975 9.29346 15.5215 8.4668 15.5215C7.64013 15.5215 6.85 15.3979 6.0964 15.1506C5.34281 14.9033 4.65675 14.5524 4.03823 14.0977V18.8916Z"
        fill={fillColor}
      />
    </svg>
  );
}

function Bookmark({ fillColor }: { fillColor: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 -960 960 960"
      width="24"
    >
      <path
        d="M120-40v-640q0-33 23.5-56.5T200-760h400q33 0 56.5 23.5T680-680v640L400-160 120-40Zm80-122 200-86 200 86v-518H200v518Zm560 2v-680H240v-80h520q33 0 56.5 23.5T840-840v680h-80ZM200-680h400-400Z"
        fill={fillColor}
      />
    </svg>
  );
}
import { GAEvent } from "@/utils/GAEvent";
import { useTheme } from "@/context";
import { Step } from "react-joyride";
import JoyRideCustom from "@/app/components/internal/walkthrough/JoyRideCustom";

const Trackers = () => {
  const [trackers, setTrackers] = useState<any[]>([]);
  const [type, setType] = useState("All Trackers");
  const [offset, setOffset] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // WalkThrough
  const [steps, setSteps] = useState<Step[]>([]);
  const [run, setRun] = useState(true);
  const allTrackerRef = useRef(null);
  const createTrackerRef = useState(null);
  const customTrackerRef = useRef(null);
  const savedEventRef = useRef(null);

  const { theme } = useTheme();
  useEffect(() => {
    //  if(document.body.classList.contains(styles.bodyOverflowHidden))
    //   document.body.classList.remove(styles.bodyOverflowHidden);
    if (document.body.style.height === "100vh") {
      document.body.style.height = "";
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
  const data = [
    {
      type: "template",
      domain: "Human Resource",
      img: People,
      trackerName: "Recruitment",
      url: "T_RECRUITMENT",
      content:
        "Input designations and keywords, and upload job descriptions to identify relevant events effortlessly...",
    },
    {
      type: "template",
      domain: "Human Resource",
      img: PeopleFinder,
      url: "T_PEOPLE_FINDER",
      trackerName: "People Finder",
      content:
        "Track experts, influencers and where they might be participating in various events",
    },
    {
      type: "template",
      domain: "Human Resource",
      img: Competitor,
      url: "T_COMPETITOR",
      trackerName: "Competitor",
      content:
        "Track your competitor experts, influencers and where they might be participating in events",
    },
    {
      type: "template",
      domain: "Human Resource",
      img: Speaking,
      url: "T_SPEAKING_OPPORTUINITY",
      trackerName: "Speaking Opportunity",
      content:
        "Input team members and their details to keep track of the events with speaking opportunities.",
    },
    {
      type: "template",
      domain: "Sales",
      img: Audience,
      url:"T_AUDIENCE_DEPT_PROFILE",
      trackerName: "Audience Dept. & Profiles",
      content:
        "Track events for the specific organizational departments or audience profiles",
    },
    {
      type: "template",
      domain: "Sales",
      img: Customer,
      url:"T_CUSTOMER_ICP",
      trackerName: "Customer ICP",
      content:
        "Input ideal customer profile details like company, location or websites to track their interests",
    },
    {
      type: "template",
      domain: "Sales",
      img: Keywords,
      url:"T_PRODUCT_KEYWORDS",
      trackerName: "Product Keywords",
      content:
        "List all the events which belongs to given industry or associated with keywords.",
    },
    {
      type: "template",
      domain: "Sales",
      img: SocialCause,
      trackerName: "Social Cause",
      url:"T_SOCIAL_CAUSE",
      content:
        "Track social cause events that interests audience to be socially active and enhance their reach",
    },
    {
      type: "template",
      img: Brand,
      domain: "Sales",
      trackerName: "Brand Building",
      url:"T_BRAND_BUILDING",
      content:
        "Input designations and keywords, and upload job descriptions to identify relevant events effortles",
    },
  ];
  const [hide, setHide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleShowMore = () => {
    setOffset((prevOffset) => prevOffset + 5);
  };
  const modalOpen = () => {
    setShowModal(true);
    console.log(document.body.style);

    document.body.style.height = "100vh";

    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
  };

  const closeModal = (e: any) => {
    const targetElement = e.target;
    if (
      targetElement.classList.contains(styles.modalContainer) ||
      targetElement.classList.contains(styles.modalInnerContainer)
    ) {
      setShowModal(false);
      document.body.style.overflow = "auto";
    }
  };
  const [showTracker, setShowTracker] = useState(false);
  const viewTracker = () => {
    setShowTracker(true);
    setHideTemplate(!hideTemplate);
  };
  const [hideTemplate, setHideTemplate] = useState(true);
  const [dataPresent, setDataPresent] = useState(false);
  // useEffect(() => {
  //   if (dataPresent) setHideTemplate(false);
  //   console.log(dataPresent);
  // }, [dataPresent]);
  const [isData, setIsData] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await myFetch(
        `${baseUrl}/tracker/exist`
      );
      if (data) setIsLoading(false)
      if (data.trackerExists) {
        setHideTemplate(false);
        setIsData(true)
      }

    }

    fetchData();
  }, []);
  // const updateSteps = useCallback(() => {
  //   const newSteps: Step[] = [];
  //   if (allTrackerRef && allTrackerRef.current) {
  //     newSteps.push({
  //       target: allTrackerRef.current,
  //       title: "Create Tracker",
  //       content: "Discover insights on business trends filtered by geography and category, all in one glance.",
  //       disableBeacon: true,
  //     });
  //   }
  //   // if (customTrackerRef.current) {
  //   //   newSteps.push({
  //   //     target: customTrackerRef.current,
  //   //     // title: "Search Intel",
  //   //     content: "Search for relevant events happening in any location",
  //   //     disableBeacon: true,
  //   //   });
  //   // }
  //   if (savedEventRef.current) {
  //     newSteps.push({
  //       target: savedEventRef.current,
  //       // title: "Search Intel",
  //       content: "Stay informed about the latest industry events and save them to stay updated on event updates.",
  //       disableBeacon: true,
  //     });
  //   }

  //   setSteps(newSteps);
  // }, [ customTrackerRef.current, savedEventRef.current]);

  // useEffect(() => {
  //   const walkthroughCompleted: string[] = JSON.parse(
  //     localStorage.getItem("walkthroughCompleted") || "[]"
  //   );

  //   if (!walkthroughCompleted.includes("tracker")) {
  //     updateSteps();
  //     setRun(true);
  //   }
  // }, [updateSteps]);
  console.log(hideTemplate);

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
    <>{isLoading ? <Loading /> : (
      <>
        <div className={styles.outerContainer}>
          {steps?.length > 0 && (
            <JoyRideCustom
              steps={steps}
              run={run}
              onFinish={() => setRun(false)}
              pathName="tracker"
            />
          )}
          <div className={styles.header_container}>
            <div className={styles.tab_container}>

              <div className={`${styles.tab}`}>Create Your Event Tracker</div>

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
                href="/internal/trackers/create?type=CUSTOM"
                onClick={() =>
                  GAEvent(
                    "trackers",
                    "Tracker",
                    "Saved Tracker | New Tracker Created",
                    "Create New Tracker"
                  )
                }
                // ref={allTrackerRef}
                className={styles.trackers_header_newtracker_button}
              >
                Create Tracker
              </Link>
              {!hideTemplate ?
                (<div
                  className={styles.trackers_header_newtracker_button}
                  onClick={viewTracker}
                >
                  Explore Templates
                </div>) : (
                  <div
                    className={styles.trackers_header_newtracker_button}
                    onClick={viewTracker}
                  >
                    Hide Templates
                  </div>
                )

              }
              {/* <Image src={Add} alt="add" /> */}

              {/* <div
            onClick={() => setHide(!hide)}
            className={styles.trackers_header_more_button}
          >
            <Image src={MoreIcon} alt="moreicon" />
            {hide && (
              <div
                className={styles.hide}
                onClick={() => setHideTemplate(!hideTemplate)}
              >
                {hideTemplate ?
                  <div
                    onClick={() => GAEvent(
                      "trackers",
                      "Tracker",
                      "Hide Templates",
                      "Hide Templates"
                    )}
                  >Hide Templates</div> :
                  <div
                    onClick={() => GAEvent(
                      "trackers",
                      "Tracker",
                      "Show Templates",
                      "Show Templates"
                    )}
                  >Show Templates</div>}
              </div>
            )}
          </div> */}
            </div>
          </div>

          {hideTemplate && (
            <div className={`${styles.container}`}>

              {data.map((item, ind) => (
                <Link href={`/internal/trackers/create?type=${item?.url}`} key={ind}>
                  <div className={styles.innerContainerTwo}>
                    <div
                      className={`${styles.topView} ${theme === "dark" ? "darkMode" : "lightMode_secondary"
                        }`}
                    >
                      <div className={styles.account}>
                        <Image src={item.img} alt="people" />
                      </div>
                      <div>
                        <Image src={Template} alt="template" />
                      </div>
                    </div>
                    <div className={styles.bottomView}>
                      <div className={styles.bottomViewOne}>
                        <div className={styles.bottomInnerView}>
                          <Image
                            src={Vector1}
                            alt="vector1"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          />
                          <div style={{ color: "#585871", fontSize: "12px" }}>
                            Template
                          </div>
                        </div>
                        {/* <div
                      className={`${styles.domain}`}
                    >
                      Human Resources
                    </div> */}
                      </div>
                      <div className={styles.bottomViewTwo}>
                        {item?.trackerName}
                      </div>
                      <div className={styles.text}>{item?.content}</div>
                    </div>
                  </div>
                </Link>
              ))}
              <div className={styles.innerContainerOne}

              >
                <Image src={Add} alt="add" />
                <Link
                  href="/internal/trackers/create?type=CUSTOM"
                  className={styles.createUrl}
                >
                  <button
                    // onClick={() => modalOpen()}
                    className={styles.createBtn}

                  >
                    Create Custom
                  </button>
                </Link>
              </div>
            </div>
          )}



          {(
            <>
              {/* {loading ? <Loading/>:<> */}
              <div
                className={`${styles.trackers}`}
              >
                <div
                  className={`${styles.trackersHead} ${type === "All Trackers" ? styles.active : ""
                    }`}
                  onClick={() => setType("All Trackers")}

                >
                  <AllTrackers
                    fillColor={type === "All Trackers" ? "#6750A4" : "#696B83"}
                  />
                  All Trackers
                </div>
                <div
                  className={`${styles.trackersHead} ${type === "Custom Trackers" ? styles.active : ""
                    }`}
                  onClick={() => {
                    GAEvent(
                      "trackers",
                      "Tracker",
                      "View",
                      "Custom Trackers"
                    )
                    setType("Custom Trackers")
                  }}
                >
                  <CustomeTracker
                    fillColor={type === "Custom Trackers" ? "#6750A4" : "#696B83"}
                  />
                  Custom Trackers
                </div>
                {/* <div
              className={`${styles.trackersHead} ${
                type === "Premium Trackers" ? styles.active : ""
              }`}
              onClick={() => setType("Premium Trackers")}
            >
              <PremiumTracker
                fillColor={type === "Premium Trackers" ? "#6750A4" : "#696B83"}
              />
              Premium Trackers
            </div> */}
                <div
                  className={`${styles.trackersHead} ${type === "Saved Events" ? styles.active : ""
                    }`}
                  onClick={() => {
                    GAEvent(
                      "trackers",
                      "Tracker",
                      "View",
                      "Saved Events"
                    )
                    setType("Saved Events")
                  }}
                  ref={savedEventRef}
                >
                  <Bookmark
                    fillColor={type === "Saved Events" ? "#6750A4" : "#696B83"}
                  />
                  Saved Events
                </div>
              </div>
              {/* </>
    } */}
              {type === "All Trackers" && (
                <MyTracker setDataPresent={setDataPresent} dataPresent={dataPresent} isData={isData} />
              )}
              {type === "Custom Trackers" && (
                <MyTracker setDataPresent={setDataPresent} dataPresent={dataPresent} isData={isData} />
              )}
              {/* {type === "Premium Trackers" && <div style={{padding: "0px 10px",display: "flex"}}>Create your first tracker!</div>} */}
              {type === "Saved Events" && (
                <div>
                  <Table showInsights={showInsights} />
                </div>
              )}
            </>
          )}

          {showModal && (
            <div className={styles.modalContainer} onClick={(e) => closeModal(e)}>
              <div className={styles.modalInnerContainer}>
                <div className={styles.newTrackerHead}>Choose Tracker Type</div>
                <Link href="/internal/trackers/create">
                  <div className={styles.customTracker}>
                    <div style={{ display: "flex" }}>
                      <Image src={Vector3} alt="vector3" />
                    </div>
                    <div>
                      <div className={styles.head}>Custom Tracker</div>
                      <div className={styles.content}>
                        Select from the available data filters to create a tracker
                      </div>
                    </div>
                  </div>
                </Link>
                <div className={styles.customTracker}>
                  <div style={{ display: "flex" }}>
                    <Image src={Vector4} alt="vector4" />
                  </div>
                  <div>
                    <div className={styles.head}>Premium Tracker</div>
                    <div className={styles.content}>
                      Seamlessly integrate your own data to tailor your event
                      tracking experience.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    )}</>

  );
};

export default Trackers;