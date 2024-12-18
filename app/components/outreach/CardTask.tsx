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
  interests?: { [name: string]: number; };
}

const getInetial = (name: string) => {
  const splitedName = name.split(" "); 
  if (splitedName.length === 1) {
     return splitedName[0].charAt(0).toUpperCase(); 
  } else {
      return splitedName[0].charAt(0).toUpperCase() + splitedName[1].charAt(0).toUpperCase(); 
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
        className={`w-full flex flex-col justify-evenly cursor-pointer text-[var(--primary-text-color)] bg-[var(--primary-foreground)] p-3 rounded shadow-sm border relative`}
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
        <div className={`flex flex-wrap gap-2 py-[5px]`} style={{width: 'calc(100% - 40px)'}}>
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
        </div>
        { (task?.owner && task?.owner?.firstName) &&
          <Badge className="bg-[var(--primary-color)] w-fit p-[6px] rounded-full self-end absolute bottom-[15px]" >
            {(task?.owner?.firstName && task?.owner?.lastname) ?
              (<span title={"Onwer: " + task?.owner?.firstName + " " + task?.owner?.lastname} >
                {getInetial(task?.owner?.firstName + " " + task?.owner?.lastname)}
              </span>) :
              (<span title={task?.owner?.firstName}>
                {getInetial(task?.owner?.firstName)}
              </span>)
            }
          </Badge>
        }
      </div>
    </>
  );
};

export default CardTask;
