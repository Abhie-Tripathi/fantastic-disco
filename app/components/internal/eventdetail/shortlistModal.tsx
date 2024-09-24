"use client";
import Image from "next/image";
import styles from "./statusDropdown.style.module.css";
import crossIcon from "/public/close.svg";
import AttendeeCard from "./AttendeeCard";
import tickIcon from "/public/internal/circle_tick.svg";
import attendeeIcon from "/public/internal/attendee.svg";
import exhibitorIcon from "/public/internal/exhibitor.svg";
import speakerIcon from "/public/internal/speaker.svg";
import sponsorIcon from "/public/internal/sponsor.svg";
import { useAuthContext, useTheme } from "@/context";
import { useState } from "react";
import person1 from "@/public/person1.svg";
import person2 from "@/public/person2.svg";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
interface Props {
  handleShortlistModal: (eventId: string) => void;
  shortlistModalData: any;
  handleRefresh: () => void;
  setStatusChanged: (status: boolean) => void;
}

const ShortlistModal = ({ handleShortlistModal, shortlistModalData, handleRefresh, setStatusChanged }: Props) => {
  const { user } = useAuthContext();

  const closeModal = () => {
    handleShortlistModal('');
  };
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [voteStatus, setVoteStatus] = useState({
    Attending: false,
    Speaking: false,
    Sponsoring: false,
    Exhibiting: false,
  });
  const handleVoteClick = (item: keyof typeof voteStatus) => {
    setVoteStatus((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
    }));
  };

  const [shortlistedVisitors, setShortlistedVisitors] = useState<string[]>([]);
  const [shortlistedExhibitor, setShortlistedExhibitor] = useState<string[]>([]);
  const [shortlistedSpeaker, setShortlistedSpeaker] = useState<string[]>([]);
  const [shortlistedSponsor, setShortlistedSponosor] = useState<string[]>([]);
console.log(shortlistedVisitors.concat(shortlistedSpeaker, shortlistedExhibitor, shortlistedSponsor).join());

  const handleSubmit = async() => {
    if(user){
      if(shortlistedVisitors.length > 0 || shortlistedSpeaker.length > 0 || shortlistedExhibitor.length > 0 || shortlistedSponsor.length>0){
      let payloadData = {
        entityId: shortlistModalData.eventId,
        status: "SHORTLISTED",
        id: shortlistedVisitors.concat(shortlistedSpeaker, shortlistedExhibitor, shortlistedSponsor).join(), // multiple userInterest id's
        modifiedBy: user.id,
        enquiryStatus:"SHORTLISTED",
      };
      try {
        const apiUrl = baseUrl + "/userInterest";
        const apiData = await myFetch(apiUrl, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify(payloadData),
        });
        // handleRefresh();
        setStatusChanged(true);
        closeModal();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      }else{
        let payloadData = {
          enquiryId: shortlistModalData.enquiryId,
          enquiryStatus:"SHORTLISTED"
        };
        try {
          const apiUrl = baseUrl + "/userInterest/enquiry";
          const apiData = await myFetch(apiUrl, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(payloadData),
          });
          // handleRefresh();
          setStatusChanged(true);
          closeModal();
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }
  }

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
          <span className={styles["tag_item"]}>
              <Image
                src={exhibitorIcon}
                alt=""
                width={15}
                height={15}
                className={iconClass}
              />
              Exhibit
              {shortlistModalData.participent.exhibitors?.length > 0 &&
                <Image src={tickIcon} alt="" width={13} height={13} className={iconClass} />
              }
            </span>
            
            <span className={styles["tag_item"]}>
              <Image
                src={sponsorIcon}
                alt=""
                width={15}
                height={15}
                className={iconClass}
              />
              Sponsor
              {shortlistModalData.participent.sponsors?.length > 0 &&
                <Image src={tickIcon} alt="" width={13} height={13} className={iconClass} />
              }
            </span> 
            <span className={styles["tag_item"]}>
              <Image
                src={speakerIcon}
                alt=""
                width={15}
                height={15}
                className={iconClass}
              />
              Speak
              {shortlistModalData.participent.speakers?.length > 0 &&
                <Image src={tickIcon} alt="" width={13} height={13} className={iconClass} />
              }
            </span>
            <span className={styles["tag_item"]}>
              <Image
                src={attendeeIcon}
                alt=""
                width={15}
                height={15}
                className={iconClass}
              />
              Attend
              {shortlistModalData.participent.attendee?.length > 0 &&
                <Image src={tickIcon} alt="" width={13} height={13} className={iconClass} />
              }
            </span>
           
          </div>
          <div className={styles["total_attendee"]}>

            {/* <div style={{ fontSize: "12px" }}>
              <div className={styles.circles}>
                <div className={styles.circle} data-name="John Doe">
                  <Image
                    className={styles.image}
                    src={person1}
                    alt="person1"
                    width={25}
                    height={25}
                  />
                </div>
                <div
                  className={styles.circle}
                  style={{ marginLeft: "-8px", width: "25px", height: "25px" }}
                  data-name="Ravi Tripathi"
                >
                  RT
                </div>
                <div
                  className={styles.circle}
                  style={{ marginLeft: "-8px" }}
                  data-name="Jane Smith"
                >
                  <Image
                    className={styles.image}
                    src={person2}
                    alt="person2"
                    width={25}
                    height={25}
                  />
                </div>
              </div>
            </div> */}

            <div className={styles.moddleText}>
              {shortlistModalData.stats.uniqueUser} People have shown interest
            </div>
            <div className={styles.markListBtn} onClick={handleSubmit}>Mark as Shortlisted</div>
          </div>
          <div className={styles.main_section}>
          {shortlistModalData.participent.exhibitors?.length > 0 &&
              <AttendeeCard cardType={"Exhibit"} userList={shortlistModalData.participent.exhibitors} shortlistedUsers={shortlistedExhibitor} setShortlistedUsers={setShortlistedExhibitor} />
            }
             {shortlistModalData.participent.sponsors?.length > 0 &&
              <AttendeeCard cardType={"Sponsor"} userList={shortlistModalData.participent.sponsors} shortlistedUsers={shortlistedSponsor} setShortlistedUsers={setShortlistedSponosor} />
            }
             {shortlistModalData.participent.speakers?.length > 0 &&
              <AttendeeCard cardType={"Speak"} userList={shortlistModalData.participent.speakers} shortlistedUsers={shortlistedSpeaker} setShortlistedUsers={setShortlistedSpeaker} />
            }
            {shortlistModalData.participent.attendee?.length > 0 &&
              <AttendeeCard cardType={"Attend"} userList={shortlistModalData.participent.attendee} shortlistedUsers={shortlistedVisitors} setShortlistedUsers={setShortlistedVisitors}/>
            }
            
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
