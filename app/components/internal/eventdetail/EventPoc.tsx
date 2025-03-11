"use client";
import React, { useState } from "react";
import styles from "./eventdesc.style.module.css";
// import tooltip from '@/app/components/trackers/sideNav/sideNav.style.module.css'
import Image from "next/image";
import PeopleIcon from "/public/user.svg";
// import PlaceHolder from "/public/speaker1.jpeg";
import downArrowIcon from '/public/arrow_down.svg'
import { useTheme } from "@/context";
// import { Envelope, Phone } from "geist-icons";
import { pocDetail } from "@/types/coordinateEventType";
import Text from "@/components/new-ui/Text";
import { CircleSlash, MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GAEvent } from "@/utils/GAEvent";
import { usePathname } from "next/navigation";

interface Props {
  open: boolean;
  eventId: string;
  setExpandedTab: any;
  pocData: pocDetail[];
  unlockPoc: any;
}

interface POCtypes {
  id: number;
  name: string;
  profilePicture: null | string;
  designation: string | null;
  emailActive: string | null;
  email: string;
}

function lastActiveDays(givenDateStr: string): number {
  const givenDate: Date = new Date(givenDateStr);

  const today: Date = new Date();

  if (givenDate > today) {
      return -1;
  }

  const timeDifference: number = today.getTime() - givenDate.getTime();

  const daysDifference: number = Math.floor(timeDifference / (1000 * 3600 * 24));

  return daysDifference;
}

const EventPoc = ({ open, eventId, setExpandedTab, pocData, unlockPoc }: Props) => {
  const [accordianToggle, setAccordianToggle] = useState(open);
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const urlPath = usePathname().split("/")[2];
  const pageSource = urlPath.charAt(0).toUpperCase() + urlPath.slice(1);

  return (
    <div
      className={`${styles.container} card`}
    >
      <div
        className={styles.header}
        onClick={() => {
          setAccordianToggle(!accordianToggle);
          !accordianToggle && GAEvent("Event POC", "Enquiry Detail", "Event POC", "Expanded");
        }}
      >
        <Image src={PeopleIcon} alt="page" className={iconClass} />
        <div className={styles.eventDetail_header}>
          Event POC
          <span className={styles.image_container}>
            <Image src={downArrowIcon} alt="dropdown" width={15} height={15} />
          </span>
        </div>
      </div>
      {accordianToggle && (
        <div className={styles.accordian}>
          <div className={styles.allFollowerContainer}>
            {pocData?.length > 0 ? (
              pocData.slice(0, 1).map((poc) => (
                <>
                {poc!==null &&
                  <div key={poc.id} className="flex flex-row gap-3 p-2">
                    <img
                      src={
                        poc?.profilePicture
                          ?  poc?.profilePicture
                          : `https://img.10times.com/userimages/${poc?.name && poc?.name
                              .charAt(0)
                              .toLowerCase()}.jpg`
                      }
                      alt="POC Logo"
                      className="rounded-lg shadow-md h-10 w-10"
                    />
                    <div className="flex flex-col gap-2 flex-1 flex-wrap">
                      {poc?.name && (
                        <Text fontWeight="medium" variant="noMargin">
                          {poc?.name}
                        </Text>
                      )}
                      {poc?.designation !== null && (
                        <p className="text-[#666666] text-[12px]">
                          <span>{poc?.designation}</span>
                        </p>
                      )}
                      {poc?.email && (
                        <p className="text-[#666666] flex items-center gap-2 text-[12px]">
                          <MailIcon width="12px" height="12px" className="self-start mt-1"/>
                          <span className="break-all">{poc?.email}</span>

                          { poc?.emailActive &&
                            ((lastActiveDays(poc?.emailActive) > 0 && lastActiveDays(poc?.emailActive) <= 180) ?
                              <div className="h-[8px] w-[8px] bg-[var(--success-text-color)] rounded-full cursor-pointer" title="Active within last 6 months"></div> : 
                              (lastActiveDays(poc?.emailActive) > 0 && lastActiveDays(poc?.emailActive) <= 270) ?
                              <div className="h-[8px] w-[8px] bg-[var(--warning-text-color)] rounded-full cursor-pointer" title="Active within last 9 months"></div> : <></> )
                          }
                        </p>
                      )}
                      {poc?.phoneNumber && (
                        <p className="text-[#666666] flex items-center gap-2 text-[12px]">
                          <PhoneIcon width="12px" height="12px" />
                          <span>{poc?.phoneNumber}</span>
                        </p>
                      )}
                      {(poc?.email || poc?.phoneNumber) && (
                        <div>
                          <Button
                            disabled={(poc?.state && (poc.state === 1 || poc?.state === 2) ) ? true : false}
                            onClick={()=>unlockPoc(poc.id, "Side List")}
                            variant={'outline'}
                            size={"sm"}
                          >Show details</Button>
                        </div>
                      )}
                    </div>
                  </div>
                }
                </>
              ))
            ) : (
              <p className="text-[#666666] text-sm flex items-center gap-2 p-2">
                <CircleSlash width={15} height={15} />
                No POC found
              </p>
            )}
            {pocData?.length > 1 &&
              <Button
                variant="link"
                onClick={() => {
                  setExpandedTab('poc');
                  GAEvent("Event POC", "POC", `${pageSource} | Enquiry Detail`, "POC Side List | See All");
                }}
              >View All ({pocData?.length})</Button>
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPoc;