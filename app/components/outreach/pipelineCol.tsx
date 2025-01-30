"use client";
import React, { RefObject, useEffect, useRef, useState } from "react";
import styles from "./pipelinecol.style.module.css";
import Loading from "../UI/Loading";
import CardTask from "./CardTask";
import useInfiniteScroll from "@/utils/useInfiniteScroll";
import { enquiryType } from "@/types/outreachEnquiryTypes";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { GAEvent } from "@/utils/GAEvent";

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

  const router = useRouter();

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScrollEnd = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (!taskDetail[status].noMoreData)
        setShortlistPage((prevPage) => prevPage + 1);
    }, 1000);
  };

  const handleEditAction = () => {
    GAEvent("Outreach", "Pipeline Edit", "Outreach", "Outreach | Column Heading | Edit Icon");
    router.push("/internal/settings/product");
  }

  useInfiniteScroll(shortlistRef, handleScrollEnd);

  useEffect(() => {
    if(shortlistPage > 1)
      fetchPipelineData(status, taskDetail[status].label, shortlistPage);
    GAEvent("Outreach", "Pagination", "Outreach", `Outreach | ${status} | ${shortlistPage}`);
  }, [shortlistPage]);

  return (
    <>
      <div className={`${styles.outerCard}`}>
        <div className="group relative">
          <div className="text-white font-medium text-base p-3 bg-[var(--primary-color)] rounded-t flex items-center justify-between">
            <div>
              <span className="cursor-pointer hover:underline" onClick={handleEditAction}>
                {taskDetail[status].label}
              </span>
              <span className="bg-white/10 px-3 py-1 text-sm rounded font-semibold border border-white/10 ml-2">
                {taskDetail[status].count}
              </span>
            </div>
            <div className="mr-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 p-1 px-2 rounded" onClick={handleEditAction} title="Edit">
              <Pencil color="white" width="14px" height="14px" />
            </div>
          </div>
        </div>
        <div
          className={`${styles.card_shortlisted} ${styles.cardsContainer}  rounded-b p-3`}
          onDragOver={(event) => handleDragOver(event)}
          onDragStart={(event) => handleDragContainerStart(event, status)}
          onDrop={(event) => handleDrop2(event, status, 'Drag Drop')}
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
