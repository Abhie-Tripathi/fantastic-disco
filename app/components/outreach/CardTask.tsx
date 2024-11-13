import React from "react";
import { formatEventDates } from "@/utils/dateFormat";
import { Calendar } from "geist-icons";

interface CardTaskProps {
  task: any;
  name: string;
  draggable: boolean;
  eventLocation: string;
  eventCompany: string;
  eventStartDate: string;
  eventEndDate: string;
  eventId: string;
  enquiryId: string;
  enquiryStatus: string;
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    taskName: string
  ) => void;
  handleModal: (
    id: string,
    enquiryId: string,
    enquiryStatus: string,
    task: any
  ) => void;
  onClick: () => void;
  interests?: {
    EXHIBITOR: number;
    SPONSOR: number;
    SPEAKER: number;
    ATTENDING: number;
  };
}

const CardTask: React.FC<CardTaskProps> = ({
  name,
  draggable,
  eventLocation,
  eventCompany,
  eventStartDate,
  eventEndDate,
  eventId,
  enquiryId,
  enquiryStatus,
  onDragStart,
  handleModal,
  onClick,
  interests,
  task,
}) => {
  return (
    <>
      <div
        className={`w-full flex flex-col justify-evenly cursor-pointer text-[var(--primary-text-color)] bg-[var(--primary-foreground)] card`}
        draggable={draggable}
        onDragStart={(event) => onDragStart(event, name)}
        onClick={() => handleModal(eventId, enquiryId, enquiryStatus, task)}
        style={{ gap: "4px" }}
      >
        <div className={`text-lg`}>{name}</div>
        <div className={`text-[var(--tertiary-text-color)] text-sm font-[var(--font-weight-regular)] leading-[var(--line-height-default)]`}>{eventCompany}</div>
        <div className={`flex text-xs items-center bg-inherit w-fit gap-[5px] leading-5`}>
          <Calendar
            height={"12px"}
            width={"12px"}
            color="var(--primary-text-color)"
          />
          <div style={{ marginTop: "3px" }}>
            {formatEventDates(eventStartDate, eventEndDate)}
          </div>
        </div>
        <div className={`flex gap-2 pt-[5px]`}>
          {interests && interests.EXHIBITOR > 0 && (
            <div className={`bg-[var(--primary-color)] py-1 px-2 text-white font-medium text-xs rounded`}>Exhibit</div>
          )}
          {interests && interests.SPONSOR > 0 && (
            <div className={`bg-[var(--primary-color)] py-1 px-2 text-white font-medium text-xs rounded`}>Sponsor</div>
          )}
          {interests && interests.SPEAKER > 0 && (
            <div className={`bg-[var(--primary-color)] py-1 px-2 text-white font-medium text-xs rounded`}>Speak</div>
          )}
          {interests && interests.ATTENDING > 0 && (
            <div className={`bg-[var(--primary-color)] py-1 px-2 text-white font-medium text-xs rounded`}>Attend</div>
          )}
        </div>
      </div>
    </>
  );
};

export default CardTask;
