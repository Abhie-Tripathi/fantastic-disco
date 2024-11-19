import React, { useEffect, useState } from "react";
import styles from "./yourEventCard.style.module.css";
import Image from "next/image";
import upArrowLight from '/public/internal/up_arrow_light.svg'
import { formatEventDates } from "@/utils/dateFormat";
import StatusChangeDropdown from "@/app/components/internal/eventdetail/statusDropdown";
import upArrow from "/public/internal/up_arrow.svg";
import { useTheme } from "@/context";
import UpVoteTag from "@/app/components/internal/coordinate/upVoteTag";
import { Calendar, Location } from "geist-icons";
import { AllEventsType } from "@/types/alleventtype";
import { useCoordinateService } from "@/services/coordinateService";
import UpvoteDropdown from "./eventdetail/upvoteDropdown";
import GoTo from "/public/goTo.svg";

interface YourEventCardProps {
  eventId: string;
  isDateSame?: boolean;
  enquiryId: string;
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
  currentEnquiryStatus: string;
  upvote?: any;
  enquiryActivity?: any;
  userCountPerInterest?: any;
  handleModal?: (id: string, enquiryId: string) => void;
  handleShortlistModal?: (eventId: string, enquiryId: string) => void;
  setSelectedId?:(status:string)=>void;
  geniEvent?: AllEventsType;
  handlePrefillEvent?: (value: AllEventsType) => void
  handleDeleteModal?: (id: string, name: string) => void;
  filterChanged?:boolean
}
interface VoteStatus {
  Attending: boolean;
  Speaking: boolean;
  Sponsoring: boolean;
  Exhibiting: boolean;
}
interface enquiry {
  for: string;
  like: number;
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
  userCountPerInterest,
  handleModal,
  handleShortlistModal,
  geniEvent,
  handlePrefillEvent,
  isDateSame,
  handleDeleteModal,
  filterChanged,
  setSelectedId
  
}) => {
  if (eventStartDate) {
    const formattedDate = formatDate(eventStartDate);
  }
  // const [value,setValue]=useState("");
  const { theme } = useTheme();
  const [votesCount, setVotesCount] = useState(0);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>({ Attending: enquiryActivity?.some((item: enquiry) => item.for === 'ATTENDING' && item.like===1) ? true : false,
  Speaking: enquiryActivity?.some((item: enquiry) => item.for === 'SPEAKING' && item.like===1) ? true : false,
  Sponsoring: enquiryActivity?.some((item: enquiry) => item.for === 'SPONSORING' && item.like===1) ? true : false,
  Exhibiting: enquiryActivity?.some((item: enquiry) => item.for === 'EXHIBITING'&& item.like===1) ? true : false,});
  
  const [interestedUsers, setInterestedUsers] = useState<any>({
    attendee: [],
    speakers: [],
    sponsors: [],
    exhibitors: [],
  });

  const coordinateService = useCoordinateService();

  const handleVoteClick = async (item: keyof typeof voteStatus) => {
    let payloadData = {
      enquiryId: enquiryId,
      like: !voteStatus[item] ? 1 : 0,
      type: item?.toUpperCase(),
    };
    try {
      const apiData: any = await coordinateService.upVote(payloadData);
      setVoteStatus((prevState) => ({
        ...prevState,
        [item]: !prevState[item],
      }));
      setVotesCount(apiData?.upvote?.like);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleDeleteEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (handleDeleteModal && geniEvent) {
      // handleDeleteModal(geniEvent.eventId, geniEvent.name)
    }
  }
  const handleModalOpen = () => {
    if (enquiryId && eventId && handleModal) {
      handleModal(eventId, enquiryId);
    }
    else if (geniEvent && handlePrefillEvent) {
      handlePrefillEvent(geniEvent)
    }

  };

  const handleClickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (upvote) {
      // setVoteStatus({
      //   Attending: upvote[1]["ATTENDING"] == 1 ? true : false,
      //   Speaking: upvote[1]["SPEAKING"] == 1 ? true : false,
      //   Sponsoring: upvote[1]["SPONSORING"] == 1 ? true : false,
      //   Exhibiting: upvote[1]["EXHIBITING"] == 1 ? true : false,
      // });
    }

    if(!filterChanged){      
    fetchInterestedUsers();
    setVotesCount(upvote && upvote[0].like);
    setVoteStatus({ Attending: enquiryActivity?.some((item: enquiry) => item.for === 'ATTENDING' && item.like===1) ? true : false,
    Speaking: enquiryActivity?.some((item: enquiry) => item.for === 'SPEAKING' && item.like===1) ? true : false,
    Sponsoring: enquiryActivity?.some((item: enquiry) => item.for === 'SPONSORING' && item.like===1) ? true : false,
    Exhibiting: enquiryActivity?.some((item: enquiry) => item.for === 'EXHIBITING'&& item.like===1) ? true : false,})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterChanged]);
  
  const fetchInterestedUsers = async () => {
    try {
      const apiData = await coordinateService.getInterestedUsers(eventId, enquiryId);
      if (apiData) {
        setInterestedUsers({
          attendee: apiData.participent.attendee,
          speakers: apiData.participent.speakers,
          sponsors: apiData.participent.sponsors,
          exhibitors: apiData.participent.exhibitors,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (

    <div className={styles.outerDiv} >
      <div className={`${styles.card} card`} onClick={handleModalOpen} style={{ marginTop: (!isDateSame && !geniEvent) ? "0px" : "25px" }}>
        <div className={styles.topContainer} style={{ display: "flex" }}>
          {eventImage &&
            <div className={styles.leftContainer}>

              <div style={{ display: 'flex', boxShadow: "var(--shadow-large)" }}>
                <Image
                  src={eventImage}
                  alt="eventImage"
                  width={200}
                  height={200}
                  className={styles.cardImg}
                />
              </div>

            </div>
          }
          <div className={styles.cardDetails}>
            <div className="flex gap-2 justify-between">
              <div>
                <div className={`text-lg font-semibold`}>{eventName}</div>
                <div className={styles.company}>{eventCompany}</div>
              </div>
              <div><Image  src={GoTo} alt="goTo" /></div>
            </div>

            <div className="flex gap-2 flex-col">
              {eventLocation && (
                <div className="text-sm text-[var(--secondary-text-color)] flex items-center gap-2">
                  <Location height={'14px'} width={'14px'} color="var(--secondary-text-color)" style={{display:"flex"}}/>
                  {eventLocation
                    ? eventLocation === eventCountry
                      ? eventCountry
                      : `${eventLocation}, ${eventCountry}`
                    :""
                  }
                </div>
              )}

              <div className="text-sm	text-[var(--secondary-text-color)] flex items-center gap-2	">
                <Calendar height={'14px'} width={'14px'} color="var(--secondary-text-color)" style={{display:"flex"}}/>
                {(eventStartDate && eventEndDate) && formatEventDates(eventStartDate, eventEndDate)}
              </div>
            </div>

            <div className="flex justify-between gap-2 flex-wrap">
                <div>
                  <span className="text-[var(--primary-color)] bg-[var(--primary-light-color)] h-fit font-semibold text-sm py-1 px-4 border-[#B8B7EA] rounded-sm w-fit cursor-pointer">CONFERENCE</span> 
                </div>
                
                <div className="flex gap-3">
                  <UpvoteDropdown
                    eventId={eventId}
                    enquiryId={enquiryId}
                    upvoteData={upvote}
                    userCountPerInterest={userCountPerInterest}
                    voteStatus={voteStatus}
                  />

                  <StatusChangeDropdown
                    setSelectedId={setSelectedId}
                    label=""
                    eventId={eventId}
                    enquiryId={enquiryId}
                    currentEnquiryStatus={currentEnquiryStatus}
                    handleShortlistModal={handleShortlistModal}
                  />
                </div>
            </div>

            {/* {!geniEvent && <div className="tablet_view mobile_view">
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
            </div>} */}
            {/* {!geniEvent && <div className="desktop_view">
              <div
                className={styles.allTagsOuterContainer}
                onClick={handleClickEvent}
              >
                <div className={styles.allTags} style={{cursor: 'default'}}>
                  <div className={styles.total_upvotes} title="Total upvotes count of attend, speak, sponsor, or exhibit">
                    {upvote && votesCount}
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
                  <button className={styles.notesBtn} style={{ color: "var(--coordinate-primary-color)" }}
                    onClick={handleModalOpen}
                  >View Details</button>
                </div>
              </div>
            </div>} */}
          </div>
        </div>
        {/* {!geniEvent && <div className={styles.bottomContainer}>
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
        </div>} */}
      </div>
    </div>
  );
};

export default YourEventCard;