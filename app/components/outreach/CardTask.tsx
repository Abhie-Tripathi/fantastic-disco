import React from "react";
import { formatEventDates } from "@/utils/dateFormat";
import { Calendar } from "geist-icons";
import { Badge } from "@/components/ui/badge";

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
  interests?: { [name: string]: number };
}

const getInetial = (name: string) => {
  const splitedName = name.split(" ");
  if (splitedName.length === 1) {
    return splitedName[0].charAt(0).toUpperCase();
  } else {
    return (
      splitedName[0].charAt(0).toUpperCase() +
      splitedName[1].charAt(0).toUpperCase()
    );
  }
};

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
        className={`w-full cursor-pointer text-[var(--primary-text-color)] bg-[var(--primary-foreground)] p-3 rounded shadow-sm border relative flex gap-3`}
        draggable={draggable}
        onDragStart={(event) => onDragStart(event, name)}
        onClick={() => handleModal(eventId, enquiryId, enquiryStatus, task)}
      >
        {task.eventData.logoUrl && (
          <div className="">
            {task.eventData.logoUrl ? (
              <div className="w-14 h-14">
                <img
                  src={task.eventData.logoUrl}
                  alt={`logo`}
                  className="w-14 h-14 object-contain p-2 border rounded-md bg-white shadow-sm"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center">
                <span className="text-[#5055A3] text-2xl font-semibold">
                  {task.eventData.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2 h-full">
          <div className={`text-lg font-medium`}>{name}</div>
          <div className={`text-[var(--tertiary-text-color)] text-sm`}>
            {eventCompany}
          </div>
          <div
            className={`flex items-center text-sm text-gray-600 gap-2 leading-6`}
          >
            <Calendar
              height={"14px"}
              width={"14px"}
              color="var(--secondary-text-color)"
            />
            <div>{formatEventDates(eventStartDate, eventEndDate)}</div>
          </div>
          {/* <div className={`flex flex-wrap gap-2 py-[5px]`} style={{width: 'calc(100% - 40px)'}}>
          {interests && interests.EXHIBITOR > 0 && (
            <div className={`text-[#A099E0] bg-white/10 font-medium text-xs py-1 px-3 border rounded`}>Exhibit</div>
          )}
          {interests && interests.SPONSOR > 0 && (
            <div className={`text-[#A099E0] bg-white/10 font-medium text-xs py-1 px-3 border rounded`}>Sponsor</div>
          )}
          {interests && interests.SPEAKER > 0 && (
            <div className={`text-[#A099E0] bg-white/10 font-medium text-xs py-1 px-3 border rounded`}>Speak</div>
          )}
          {interests && interests.ATTENDING > 0 && (
            <div className={`text-[#A099E0] bg-white/10 font-medium text-xs py-1 px-3 border rounded`}>Attend</div>
          )}
        </div> */}
        </div>
        {task?.owner && task?.owner?.name && (
          <Badge className="bg-[var(--primary-color)] w-7 h-7 p-[6px] rounded-full justify-center hover:bg-primary absolute bottom-3 right-3">
            {task?.owner?.firstName && task?.owner?.lastname ? (
              <span
                title={
                  "Onwer: " +
                  task?.owner?.firstName +
                  " " +
                  task?.owner?.lastname
                }
              >
                {getInetial(
                  task?.owner?.firstName + " " + task?.owner?.lastname
                )}
              </span>
            ) : (
              <span title={task?.owner?.name}>
                {getInetial(task?.owner?.name)}
              </span>
            )}
          </Badge>
        )}
      </div>
    </>
  );
};

export default CardTask;
