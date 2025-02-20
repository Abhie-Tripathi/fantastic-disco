"use client";
import Image from "next/image";
import styles from "./statusDropdown.style.module.css";
import crossIcon from "/public/close.svg";
import AttendeeCard from "./AttendeeCard";
import tickIcon from "/public/internal/circle_tick.svg";
import { useAuthContext, useTheme } from "@/context";
import { useState } from "react";
import { useCoordinateService } from "@/services/coordinateService";
import { Button } from "@/components/ui/button";
interface Props {
  enquiryId: string;
  handleShortlistModal: (eventId: string) => void;
  shortlistModalData: any;
  setStatusChanged: (status: boolean) => void;
  pipelineConfig: any;
  coordinateActions: any;
}

const ShortlistModal = ({
  enquiryId,
  handleShortlistModal,
  shortlistModalData,
  setStatusChanged,
  pipelineConfig,
  coordinateActions,
}: Props) => {
  const { user } = useAuthContext();
  const coordinateService = useCoordinateService();

  const closeModal = () => {
    handleShortlistModal("");
  };
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [shortlistedUsers, setShortlistedUsers] = useState<string[]>([]);

  const handleSubmit = async () => {
    try {
      let payloadData = {
        enquiryId: enquiryId,
        enquiryStatus: "SHORTLISTED",
      };

      const apiData = await coordinateService.setEnquiryStatus(payloadData);
      if (apiData) {
        setStatusChanged(true);
        closeModal();
      }
    } catch (error) {
      console.error("Error fetching data1:", error);
    }

    // if(user){
    //   if( shortlistedUsers.length > 0 ) {
    //   let payloadData = {
    //     entityId: shortlistModalData.eventId,
    //     status: "SHORTLISTED",
    //     id: shortlistedUsers.join(), // multiple userInterest id's
    //     modifiedBy: user.id,
    //     enquiryStatus: pipelineConfig?.[1]?.status,
    //   };
    //   try {
    //     const apiData = await coordinateService.shortlistUsers(payloadData);
    //     // handleRefresh();

    //   } catch (error) {
    //     console.error('Error fetching data1:', error);
    //   } finally {
    //     setStatusChanged(true);
    //     closeModal();
    //   }
    //   }else{
    //     let payloadData = {
    //       enquiryId: shortlistModalData.enquiryId,
    //       enquiryStatus: pipelineConfig?.[1]?.status,
    //     };
    //     try {
    //       const apiData = await coordinateService.setEnquiryStatus(payloadData);
    //       // handleRefresh();
    //       setStatusChanged(true);
    //       closeModal();

    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //     }
    //   }
    // }
  };

  return (
    <div className={styles["modalContainer"]}>
      <div
        className={`${styles["modal"]} ${
          theme === "light" ? styles.modal_light : ""
        }`}
      >
        <header className={styles["modal_header"]}>
          <div className={styles["modal_header-title"]}>Shortlist Event</div>
          <button className={styles["close"]} onClick={() => closeModal()}>
            <Image src={crossIcon} alt="clock" width={16} height={16} />
          </button>
        </header>
        <main
          className={styles["modal_content"]}
          style={{ padding: "0 1.8rem" }}
        >
          <div className={styles["tag_container"]}>
            {coordinateActions.map((item: any, index: number) => (
              <span key={index} className={`${styles["tag_item"]}`}>
                {item.label}
                {shortlistModalData.interestedUsers?.filter(
                  (users: any) => users.interest === item.status
                ).length > 0 && (
                  <Image
                    src={tickIcon}
                    alt=""
                    width={13}
                    height={13}
                    className={iconClass}
                  />
                )}
              </span>
            ))}
          </div>
          <div className={styles["total_attendee"]}>
            <div className={styles.moddleText}>
              {shortlistModalData.count} People have shown interest
            </div>
            <Button onClick={handleSubmit}>
              Mark as{" "}
              {pipelineConfig?.[1]?.label
                ? pipelineConfig?.[1]?.label
                : "Shortlist"}
            </Button>
          </div>
          <div className={styles.main_section}>
            {coordinateActions.map((item: any, index: number) => {
              const users = shortlistModalData.interestedUsers?.filter(
                (users: any) => users.interest === item.status
              );
              if (users.length > 0)
                return (
                  <AttendeeCard
                    key={index}
                    cardType={item.label}
                    userList={users}
                    shortlistedUsers={shortlistedUsers}
                    setShortlistedUsers={setShortlistedUsers}
                  />
                );
            })}
          </div>
        </main>
        {/* <footer className={styles.modal_footer}>
          <span className={styles.submitBtn}>Mark as Shortlisted</span>
        </footer> */}
      </div>
    </div>
  );
};

export default ShortlistModal;
