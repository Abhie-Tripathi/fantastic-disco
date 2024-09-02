import React, { useEffect, useState } from "react";
import styles from "./yourEventCard.style.module.css";
import UserIcon from "/public/user.svg";
import calendarIcon from "/public/calendar.svg";
import festIcon from "/public/festivalIcon.svg";
import person1 from "@/public/person1.svg";
import place from "@/public/internal/place.svg";
import person2 from "@/public/person2.svg";
import Image from "next/image";
import upArrowLight from '/public/internal/up_arrow_light.svg'
import Link from "next/link";
import ClockIcon from "/public/clock.svg";
import StatusChangeDropdown from "@/app/components/internal/eventdetail/statusDropdown";
import upArrow from "/public/internal/up_arrow.svg";
import { useTheme } from "@/context";
import UpVoteTag from "@/app/components/internal/coordinate/upVoteTag";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import { AllEventsType } from "@/types/alleventtype";

interface YourEventCardProps {
  eventId?: string;
  isDateSame?:boolean;
  enquiryId?: string;
  eventName?: string;
  eventCtas?: string[];
  eventCountry?: string;
  eventLocation?: string;
  eventImage?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  eventCompany?: string;
  eventDuration?: string;
  userCount?: number;
  currentEnquiryStatus?: string;
  upvote?: any;
  enquiryActivity?: any;
  handleModal?: (id: string, enquiryId: string) => void;
  handleShortlistModal?: (eventId: string, enquiryId: string) => void;
  geniEvent?: AllEventsType;
  handlePrefillEvent?: (value: AllEventsType) => void
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: {} = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
};

const YourEventCard: React.FC<YourEventCardProps> = ({
  eventId,
  enquiryId,
  eventName,
  eventCtas,
  eventLocation,
  eventCountry,
  eventImage,
  eventStartDate,
  eventEndDate,
  eventCompany,
  eventDuration,
  userCount,
  currentEnquiryStatus,
  upvote,
  enquiryActivity,
  handleModal,
  handleShortlistModal,
  geniEvent,
  handlePrefillEvent,
  isDateSame
}) => {
  if (eventStartDate) {
    const formattedDate = formatDate(eventStartDate);
  }
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [voteStatus, setVoteStatus] = useState({
    Attending: false,
    Speaking: false,
    Sponsoring: false,
    Exhibiting: false,
  });

  const [interestedUsers, setInterestedUsers] = useState<any>({
    attendee: [],
    speakers: [],
    sponsors: [],
    exhibitors: [],
  });

  const handleVoteClick = async (item: keyof typeof voteStatus) => {
    let payloadData = {
      source: "GTM",
      like: !voteStatus[item] ? 1 : 0,
      for: item.toUpperCase(),
    };
    try {
      const apiUrl = baseUrl + "/userInterest/" + enquiryId + "/activity";
      const apiData = await myFetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payloadData),
      });
      setVoteStatus((prevState) => ({
        ...prevState,
        [item]: !prevState[item],
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleModalOpen = () => {
    if (enquiryId && eventId && handleModal){
      handleModal(eventId, enquiryId);
    }
    else if(geniEvent && handlePrefillEvent){
      handlePrefillEvent(geniEvent)
    }
      
  };

  const handleClickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (upvote) {
      setVoteStatus({
        Attending: upvote[1]["ATTENDING"] == 1 ? true : false,
        Speaking: upvote[1]["SPEAKING"] == 1 ? true : false,
        Sponsoring: upvote[1]["SPONSORING"] == 1 ? true : false,
        Exhibiting: upvote[1]["EXHIBITING"] == 1 ? true : false,
      });
    }

    const fetchInterestedUsers = async () => {
      try {
        const apiUrl = `${baseUrl}/userInterest/${eventId}`;
        const apiData = await myFetch(apiUrl, {
          method: "GET",
          headers: headers,
        });
        if (apiData.data) {
          setInterestedUsers({
            attendee: apiData.data.participent.attendee,
            speakers: apiData.data.participent.speakers,
            sponsors: apiData.data.participent.sponsors,
            exhibitors: apiData.data.participent.exhibitors,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchInterestedUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function formatEventDates(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.getFullYear() === end.getFullYear()) {
      if (start.getMonth() === end.getMonth()) {
        if (start.getDate() === end.getDate()) {
          return new Date(startDate).toLocaleDateString("en-GB", {
            weekday: 'long',
            month: "short",
            day: "2-digit",
            year: "numeric",
          });
        } else {
          return (
            new Date(startDate).toLocaleDateString("en-GB", {
              weekday: 'long',
            }) + ', ' +
            new Date(startDate).toLocaleDateString("en-GB", {
              day: "2-digit",
            }) + ' - ' +
            new Date(endDate).toLocaleDateString("en-GB", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          );
        }
      } else {
        return (
          new Date(startDate).toLocaleDateString("en-GB", {
            weekday: 'long',
            month: "short",
            day: "2-digit",
          }) + ' - ' +
          new Date(endDate).toLocaleDateString("en-GB", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        );
      }
    } else {
      return (
        new Date(startDate).toLocaleDateString("en-GB", {
          weekday: 'long',
          month: "short",
          day: "2-digit",
          year: "numeric",
        }) + ' - ' +
        new Date(endDate).toLocaleDateString("en-GB", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      );
    }
  }

  return (
  
     <div className={styles.outerDiv} >
    <div className={`${styles.card} card`} onClick={handleModalOpen} style={{marginTop: (!isDateSame && !geniEvent) ?"0px":"25px"}}>
    {/* <div className={styles.cardBefore}></div> */}
      <div className={styles.topContainer} style={{ display: "flex" }}>
        {eventImage &&
          <div className={styles.leftContainer}>
            <div className="tablet_view mobile_view">
              <StatusChangeDropdown
                label=""
                eventId={eventId}
                enquiryId={enquiryId}
                currentEnquiryStatus={currentEnquiryStatus}
                handleShortlistModal={handleShortlistModal}
              />
            </div>

            <div style={{ display: 'flex', boxShadow: "var(--shadow-large)" }}>
              <Image
                src={eventImage}
                alt="eventImage"
                width={238}
                height={192}
                className={styles.cardImg}
              />
            </div>

          </div>
        }
        <div className={styles.cardDetails}>
          <div className={styles.eventNameComp}>
            <div>
              <div className={styles.eventName}>{geniEvent?.name || eventName}</div>
              <div className={styles.company}>{geniEvent?.cityName || eventCompany}</div>
            </div>
            {!geniEvent && <div className="desktop_view">
              <StatusChangeDropdown
                label=""
                eventId={eventId}
                enquiryId={enquiryId}
                currentEnquiryStatus={currentEnquiryStatus}
                handleShortlistModal={handleShortlistModal}
              />
            </div>}
          </div>
          <div className={styles.locationAndDateContainer}>
          {(eventLocation || geniEvent) && (
  <div className={styles.eventLocation}>
    <div className={styles.circle1}>
      <Image
        src={place}
        alt="locationIcon"
        width={24}
        height={24}
        style={{ marginRight: "3px" }}
        className="icons"
      />
    </div>
    <div style={{ marginLeft: "-4px" }}>
      {eventLocation 
        ? eventLocation === eventCountry
          ? eventCountry
          : `${eventLocation}, ${eventCountry}`
        : `${geniEvent?.cityName}, ${geniEvent?.countryName}`}
    </div>
  </div>
)}

            <div className={styles.eventDate}>
              <Image
                src={calendarIcon}
                alt="calendarIcon"
                width={14}
                height={14}
                className='icons'
              />
              <div>
                {(eventStartDate && eventEndDate) && formatEventDates(eventStartDate, eventEndDate)}
                {geniEvent && formatEventDates(geniEvent.startDate, geniEvent.endDate)}
              </div>
            </div>
            {geniEvent && <div className={styles.eventTime}>
              <Image
                src={ClockIcon}
                alt="clockIcon"
                width={14}
                height={14}
                className='icons'
              />
              <div>{geniEvent.startTime}{" - "}{geniEvent.endTime}{", "}{geniEvent.gmtZone}</div>
            </div>}
          </div>
          {geniEvent && <div className={styles.description}>
            {geniEvent.description.substring(0, 100)}{geniEvent.description.length > 100 && "..."}
          </div>}
          {geniEvent && <div className={styles.tags_deleteContainer}>
            <div className={styles.tags}>
              <div className={styles.tag1}>Tradeshow</div>
              <div className={styles.tag2}>In-Person</div>
            </div>
            <button className={styles.deleteBtn}>Delete</button>
          </div>}

          {!geniEvent && <div className="tablet_view mobile_view">
            <div>
              <div className={styles.total_upvotes}>
                {upvote && upvote[0].like}
                <div style={{ display: "flex", paddingTop: "5px" }}>
                  <Image
                    src={theme === "light" ? upArrowLight : upArrow}
                    alt="up"
                    width={16}
                    height={16}
                  />
                  &nbsp;Upvotes
                </div>
              </div>
            </div>
          </div>}
          {!geniEvent && <div className="desktop_view">
            <div
              className={styles.allTagsOuterContainer}
              onClick={handleClickEvent}
            >
              <div className={styles.allTags}>
                <div className={styles.total_upvotes}>
                  {upvote && upvote[0].like}
                  <div style={{ display: "flex", paddingTop: "10px" }}>
                    <Image
                      src={theme === "light" ? upArrowLight : upArrow}
                      alt="up"
                      width={16}
                      height={16}
                      className="icons"
                    />
                    &nbsp;Upvotes
                  </div>
                </div>
                <UpVoteTag
                  type="Attending"
                  status={voteStatus.Attending ? "voted" : ""}
                  handleVoteClick={handleVoteClick}
                  userList={interestedUsers.attendee}
                />
                <UpVoteTag
                  type="Speaking"
                  status={voteStatus.Speaking ? "voted" : ""}
                  handleVoteClick={handleVoteClick}
                  userList={interestedUsers.speakers}
                />
                <UpVoteTag
                  type="Sponsoring"
                  status={voteStatus.Sponsoring ? "voted" : ""}
                  handleVoteClick={handleVoteClick}
                  userList={interestedUsers.sponsors}
                />
                <UpVoteTag
                  type="Exhibiting"
                  status={voteStatus.Exhibiting ? "voted" : ""}
                  handleVoteClick={handleVoteClick}
                  userList={interestedUsers.exhibitors}
                />
              </div>
              <div className={styles.viewCtas}>
                {/* <button className={styles.notesBtn} onClick={handleModalOpen}>Notes</button> */}
                <button className={styles.notesBtn} style={{ color: "var(--coordinate-primary-color)" }}
                  onClick={handleModalOpen}
                >View Details</button>
              </div>
            </div>
          </div>}
          {/* 
        <div className={styles.circles}>
          <div className={styles.circle} data-name="John Doe">
            <Image className={styles.image} src={person1} alt="person1" />
          </div>
          <div className={styles.circle} style={{ marginLeft: "-15px", width: "45px", height: "45px" }} data-name="Ravi Tripathi">
            RT
          </div>
          <div className={styles.circle} style={{ marginLeft: "-15px" }} data-name="Jane Smith">
            <Image className={styles.image} src={person2} alt="person2" />
          </div>
        </div>
        <div className={styles.eventDetails}>
          <div className={styles.detailContainer}>
            <Image src={UserIcon} alt="user" width={50} height={24} />
            <div>I&apos;m Interested</div>
          </div>
        </div>
         */}
        </div>
      </div>
      {!geniEvent && <div className={styles.bottomContainer}>
        <div className="tablet_view mobile_view">
          <div
            style={{ display: "flex", gap: "6px", paddingTop: "20px", justifyContent: "center" }}
            onClick={handleClickEvent}
          >
            <UpVoteTag
              type="Attending"
              status={voteStatus.Attending ? "voted" : ""}
              handleVoteClick={handleVoteClick}
              userList={interestedUsers.attendee}
            />
            <UpVoteTag
              type="Speaking"
              status={voteStatus.Speaking ? "voted" : ""}
              handleVoteClick={handleVoteClick}
              userList={interestedUsers.speakers}
            />
            <UpVoteTag
              type="Sponsoring"
              status={voteStatus.Sponsoring ? "voted" : ""}
              handleVoteClick={handleVoteClick}
              userList={interestedUsers.sponsors}
            />
            <UpVoteTag
              type="Exhibiting"
              status={voteStatus.Exhibiting ? "voted" : ""}
              handleVoteClick={handleVoteClick}
              userList={interestedUsers.exhibitors}
            />
          </div>
        </div>
      </div>}
    </div>
    </div>
  );
};

export default YourEventCard;
