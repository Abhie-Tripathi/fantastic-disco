"use client";
import React, { useState } from "react";
import styles from "./page.style.module.css";
import CardTask from "@/app/components/outreach/CardTask";
import EventDetail from "@/app/components/internal/eventdetail/EventDetail";
import { useTheme } from "@/context";
import AddEventModal from "@/app/components/AddEventModal";
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

  return (
    <div
      className={`${styles.bodyContainer} ${
        theme === "light" ? styles.bodyContainer_light : ""
      } ${modalOpen && styles.bodyContainer_openModal}`}
    >
      <div className={`${styles.taskBody}`}>
        <div className={`${styles.outerCard}`}>
          <div
            className={`${styles.heading} ${
              theme === "light" ? styles.heading_light : ""
            }`}
          >
            Shortlisted{" "}
            <span className={styles.eventSize}>{shortlistedTasks.length}</span>
          </div>
          <div
            className={`${styles.card_shortlisted} ${styles.cardsContainer} ${
              theme === "light" ? styles.cardsContainer_light : ""
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
              className={`${styles.addEvent_btn} ${
                theme === "light" ? styles.addEvent_btn_light : ""
              }`}
              onClick={openAddModalHandler}
            >
              Add Event
            </div>
          </div>
        </div>
        <div className={`${styles.outerCard} `}>
          <div
            className={`${styles.heading} ${
              theme === "light" ? styles.heading_light : ""
            }`}
          >
            Out Reach{" "}
            <span className={styles.eventSize}>{outreachTasks.length}</span>
          </div>
          <div
            className={`${styles.card_shortlisted} ${styles.cardsContainer} ${
              theme === "light" ? styles.cardsContainer_light : ""
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
              className={`${styles.addEvent_btn} ${
                theme === "light" ? styles.addEvent_btn_light : ""
              }`}
              onClick={openAddModalHandler}
            >
              Add Event
            </div>
          </div>
        </div>
        <div className={`${styles.outerCard}`}>
          <div
            className={`${styles.heading} ${
              theme === "light" ? styles.heading_light : ""
            }`}
          >
            Pre Finalised{" "}
            <span className={styles.eventSize}>{preFinalisedTasks.length}</span>
          </div>
          <div
            className={`${styles.card_shortlisted} ${styles.cardsContainer} ${
              theme === "light" ? styles.cardsContainer_light : ""
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
              className={`${styles.addEvent_btn} ${
                theme === "light" ? styles.addEvent_btn_light : ""
              }`}
              onClick={openAddModalHandler}
            >
              Add Event
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <div
          className={`${styles.modal} ${
            theme === "light" ? styles.modal_light : ""
          }`}
        >
          <EventDetail
            openEventDetails={false}
            openOrganiserDetails={true}
            openPocDetails={true}
            closeBtn={true}
            handleModal={handleModal}
          />
        </div>
      )}
      {addEventModal && (
        <div
          className={`${styles.modal2} ${
            theme === "light" ? styles.modal_light : ""
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
