"use client";
import React, { RefObject, useEffect, useRef, useState } from "react";
import styles from "./pipelinecol.style.module.css";
import Loading from "../UI/Loading";
import CardTask from "./CardTask";
import useInfiniteScroll from "@/utils/useInfiniteScroll";
import { enquiryType } from "@/types/outreachEnquiryTypes";

interface taskDetailType {
  [task: string]: {
    label: string;
    data: enquiryType[];
    count: number;
    dataLoaded?: boolean;
    noMoreData?: boolean;
  };
}

interface Props {
  status: any;
  taskDetail: taskDetailType;
  handleDragOver: any;
  handleDragContainerStart: any;
  handleDrop2: any;
  handleDragStart: any;
  handleModal: any;
  openAddModalHandler: any;
  fetchPipelineData: any;
}

const PipelineCol = ({
  status,
  taskDetail,
  handleDragOver,
  handleDragContainerStart,
  handleDrop2,
  handleDragStart,
  handleModal,
  openAddModalHandler,
  fetchPipelineData,
}: Props) => {
  const [shortlistPage, setShortlistPage] = useState(1);
  const shortlistRef: RefObject<HTMLDivElement> = useRef(null);

  const handleScrollEnd = () => {
    setTimeout(() => {
      if (!taskDetail[status].noMoreData)
        setShortlistPage((prevPage) => prevPage + 1);
    }, 1000);
  };

  useInfiniteScroll(shortlistRef, handleScrollEnd);

  useEffect(() => {
    fetchPipelineData(status, taskDetail[status].label, shortlistPage);
  }, [shortlistPage]);

  return (
    <>
      <div className={`${styles.outerCard}`}>
        <div className="">
          <div className="text-white font-medium text-base p-3 bg-[var(--primary-color-active)] rounded-t">
            {taskDetail[status].label}{" "}
            <span className="bg-white/10 px-3 py-1 text-sm rounded font-semibold border border-white/10 ml-2">
              {taskDetail[status].count}
            </span>
          </div>
        </div>
        <div
          className={`${styles.card_shortlisted} ${styles.cardsContainer}  rounded-b p-3`}
          onDragOver={(event) => handleDragOver(event)}
          onDragStart={(event) => handleDragContainerStart(event, status)}
          onDrop={(event) => handleDrop2(event, status)}
          ref={shortlistRef}
        >
          {taskDetail[status]?.data?.map((task, index) => (
            <CardTask
              key={index}
              task={task}
              name={task.eventName}
              interests={task.userCountPerInterest}
              draggable={true}
              eventLocation={""}
              eventCompany={task.orgName}
              eventStartDate={task.startDate}
              eventEndDate={task.endDate}
              eventId={task.eventId}
              enquiryId={task.enquiryId}
              enquiryStatus={task.enquiryStatus}
              onDragStart={(event) => handleDragStart(event, task)}
              handleModal={handleModal}
              onClick={openAddModalHandler}
            />
          ))}
          {taskDetail[status].noMoreData ? (
            <></>
          ) : (
            <div>
              <Loading />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PipelineCol;
