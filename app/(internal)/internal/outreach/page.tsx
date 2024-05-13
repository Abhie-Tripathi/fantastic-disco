"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.style.module.css";
import CardTask from "@/app/components/outreach/CardTask";
import EventDetail from "@/app/components/internal/eventdetail/EventDetail";
import { useTheme } from "@/context";
import AddEventForm from "@/app/components/outreach/AddEventForm";

const Page: React.FC = () => {
  const [shortlistedTasks, setShortlistedTasks] = useState<string[]>([
    "How to Practice as an International Doctor in Australia?",
    "How to Practice as an International Doctor in Usa?",
    "How to Practice as an International Doctor in India?",
    "How to Practice as an International Doctor in Canada?",
  ]);
  const [outreachTasks, setOutreachTasks] = useState<string[]>([]);
  const [preFinalisedTasks, setPreFinalisedTasks] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [addEventModal, setAddEventModal] = useState(false);
  const { theme } = useTheme();

  const [tabsVisible, setTabsVisible] =useState<string>('shortlist');

  const handleVisibleTab = (item: string) => {
    setTabsVisible(item);
  }

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    taskName: string
  ) => {
    event.dataTransfer.setData("taskName", taskName);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragContainerStart = (
    event: React.DragEvent<HTMLDivElement>,
    source: string
  ) => {
    event.dataTransfer.setData("source_container", source);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    target: string
  ) => {
    event.preventDefault();
    const taskName = event.dataTransfer.getData("taskName");
    const source = event.dataTransfer.getData("source_container");

    // To prevent adding the task into the same container
    if (target !== source) {
      if (source === "shortlisted") {
        setShortlistedTasks(
          shortlistedTasks.filter((task) => task !== taskName)
        );
      } else if (source === "outreach") {
        setOutreachTasks(outreachTasks.filter((task) => task !== taskName));
      } else if (source === "prefinalised") {
        setPreFinalisedTasks(
          preFinalisedTasks.filter((task) => task !== taskName)
        );
      }

      if (target === "shortlisted") {
        setShortlistedTasks([...shortlistedTasks, taskName]);
      } else if (target === "outreach") {
        setOutreachTasks([...outreachTasks, taskName]);
      } else if (target === "prefinalised") {
        setPreFinalisedTasks([...preFinalisedTasks, taskName]);
      }
    }
  };

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  const openAddModalHandler = () => {
    setAddEventModal((prev) => !prev);
  };

  useEffect(() => {
    if(window.innerWidth > 768){
      setTabsVisible('all');
    }
  },[])

  return (
    <div
      className={`${styles.bodyContainer} ${theme === "light" ? styles.bodyContainer_light : ""
        } ${modalOpen && styles.bodyContainer_openModal}`}
    >
    <div style={{paddingTop:"10px"}}>
      <div className='mobile_view'>
        <div className={styles.mobileTab} >
            <div
              onClick={()=>handleVisibleTab('shortlist')}
              className={`${styles.heading} ${theme === "light" ? styles.heading_light : ""
                } ${tabsVisible == 'shortlist' ? styles.tabActive : ""}`}>
              Shortlisted{" "}
              <span className={styles.eventSize}>{shortlistedTasks.length}</span>
            </div>
            <span className={styles.seprator}></span>
            <div
              onClick={()=>handleVisibleTab('outreach')}
              className={`${styles.heading} ${theme === "light" ? styles.heading_light : ""
                } ${tabsVisible == 'outreach' ? styles.tabActive : ""}`}
            >
              Out Reach{" "}
              <span className={styles.eventSize}>{outreachTasks.length}</span>
            </div>
            <span className={styles.seprator}></span>
            <div
              onClick={()=>handleVisibleTab('preFinal')}
              className={`${styles.heading} ${theme === "light" ? styles.heading_light : ""
                } ${tabsVisible == 'preFinal' ? styles.tabActive : ""}`}
            >
              Pre Finalised{" "}
              <span className={styles.eventSize}>{preFinalisedTasks.length}</span>
            </div>
        </div>
      </div>
      <div className={`${styles.taskBody}`}>
        {(tabsVisible == 'shortlist' || tabsVisible == 'all') &&
        <div className={`${styles.outerCard}`}>
          <div className='desktop_view'>
            <div
              className={`${styles.heading} ${theme === "light" ? styles.heading_light : ""
                }`}>
              Shortlisted{" "}
              <span className={styles.eventSize}>{shortlistedTasks.length}</span>
            </div>
          </div>
          <div
            className={`${styles.card_shortlisted} ${styles.cardsContainer} ${theme === "light" ? styles.cardsContainer_light : ""
              }`}
            onDragOver={(event) => handleDragOver(event)}
            onDragStart={(event) =>
              handleDragContainerStart(event, "shortlisted")
            }
            onDrop={(event) => handleDrop(event, "shortlisted")}
          >
            {shortlistedTasks.map((task, index) => (
              <div className={styles.cards} key={index}>
                <CardTask
                  key={index}
                  name={task}
                  draggable={true}
                  onDragStart={(event) => handleDragStart(event, task)}
                  handleModal={handleModal}
                  onClick={openAddModalHandler}
                />
              </div>
            ))}
            <div
              className={`${styles.addEvent_btn} ${theme === "light" ? styles.addEvent_btn_light : ""
                }`}
              onClick={openAddModalHandler}
            >
              Add Event
            </div>
          </div>
        </div>
        }
        {(tabsVisible == 'outreach' || tabsVisible == 'all') &&
        <div className={`${styles.outerCard} `}>
          <div className='desktop_view'>
            <div
              className={`${styles.heading} ${theme === "light" ? styles.heading_light : ""
                }`}
            >
              Out Reach{" "}
              <span className={styles.eventSize}>{outreachTasks.length}</span>
            </div>
          </div>
          <div
            className={`${styles.card_shortlisted} ${styles.cardsContainer} ${theme === "light" ? styles.cardsContainer_light : ""
              }`}
            onDragOver={(event) => handleDragOver(event)}
            onDragStart={(event) => handleDragContainerStart(event, "outreach")}
            onDrop={(event) => handleDrop(event, "outreach")}
          >
            {outreachTasks.map((task, index) => (
              <div className={styles.cards} key={index}>
                <CardTask
                  key={index}
                  name={task}
                  draggable={true}
                  onDragStart={(event) => handleDragStart(event, task)}
                  handleModal={handleModal}
                  onClick={openAddModalHandler}
                />
              </div>
            ))}
            <div
              className={`${styles.addEvent_btn} ${theme === "light" ? styles.addEvent_btn_light : ""
                }`}
              onClick={openAddModalHandler}
            >
              Add Event
            </div>
          </div>
        </div>
        }
        {(tabsVisible == 'preFinal'  || tabsVisible == 'all') &&
        <div className={`${styles.outerCard}`}>
          <div className='desktop_view'>
            <div
              className={`${styles.heading} ${theme === "light" ? styles.heading_light : ""
                }`}
            >
              Pre Finalised{" "}
              <span className={styles.eventSize}>{preFinalisedTasks.length}</span>
            </div>
          </div>
          <div
            className={`${styles.card_shortlisted} ${styles.cardsContainer} ${theme === "light" ? styles.cardsContainer_light : ""
              }`}
            onDragOver={(event) => handleDragOver(event)}
            onDragStart={(event) =>
              handleDragContainerStart(event, "prefinalised")
            }
            onDrop={(event) => handleDrop(event, "prefinalised")}
          >
            {preFinalisedTasks.map((task, index) => (
              <div className={styles.cards} key={index}>
                <CardTask
                  key={index}
                  name={task}
                  draggable={true}
                  onDragStart={(event) => handleDragStart(event, task)}
                  handleModal={handleModal}
                  onClick={openAddModalHandler}
                />
              </div>
            ))}
            <div
              className={`${styles.addEvent_btn} ${theme === "light" ? styles.addEvent_btn_light : ""
                }`}
              onClick={openAddModalHandler}
            >
              Add Event
            </div>
          </div>
        </div>
        }
      </div>
    </div>
      {modalOpen && (
        <div
          className={`${styles.modal} ${theme === "light" ? styles.modal_light : ""
            }`}
        >
          <EventDetail
            openEventDetails={false}
            openOrganiserDetails={true}
            openPocDetails={true}
            closeBtn={true}
            handleModal={handleModal}
            openEventRequest={false}
          />
        </div>
      )}
      {addEventModal && (
        <div
          className={`${styles.modal2} ${theme === "light" ? styles.modal_light : ""
            }`}
          onClick={(e) => {
            console.log(e);
            const targetElement = e.target as HTMLElement;
            if (
              targetElement.classList.contains(styles.modal2) ||
              targetElement.classList.contains(styles.bodyContainer)
            )
              openAddModalHandler();
          }}
        >
          <AddEventForm />
        </div>
      )}
    </div>
  );
};

export default Page;
