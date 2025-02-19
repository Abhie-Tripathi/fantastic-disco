import React, { useEffect, useState } from "react";
import styles from "./yourEventCard.style.module.css";
import Image from "next/image";
import upArrowLight from "/public/internal/up_arrow_light.svg";
import { formatEventDates } from "@/utils/dateFormat";
import StatusChangeDropdown from "@/app/components/internal/eventdetail/statusDropdown";
import upArrow from "/public/internal/up_arrow.svg";
import { useTheme } from "@/context";
import UpVoteTag from "@/app/components/internal/coordinate/upVoteTag";
import { Calendar, Location } from "geist-icons";
import { useCoordinateService } from "@/services/coordinateService";
import { GAEvent } from "@/utils/GAEvent";

interface YourEventCardProps {
  eventId: string;
  isDateSame?: boolean;
  enquiryId: string;
  eventName?: string;
  eventCountry?: string | null;
  eventLocation?: string | null;
  eventImage?: string | null;
  eventStartDate?: string;
  eventEndDate?: string;
  eventCompany?: string;
  currentEnquiryStatus: string;
  upvote?: any;
  enquiryActivity?: any;
  coordinateActions: { [status: string]: string }[];
  pipelineConfig: any;
  handleModal?: (id: string, enquiryId: string) => void;
  handleShortlistModal?: (eventId: string, enquiryId: string) => void;
  setSelectedId?: (status: string) => void;
  enquiryStatusUpdate: (eventId: string, status: string) => void;
}
interface VoteStatus {
  [name: string]: string | null;
}

const YourEventCard: React.FC<YourEventCardProps> = ({
  eventId,
  enquiryId,
  eventName,
  eventLocation,
  eventCountry,
  eventImage,
  eventStartDate,
  eventEndDate,
  eventCompany,
  currentEnquiryStatus,
  upvote,
  enquiryActivity,
  coordinateActions,
  pipelineConfig,
  handleModal,
  handleShortlistModal,
  isDateSame,
  setSelectedId,
  enquiryStatusUpdate,
}) => {
  // const [value,setValue]=useState("");
  const { theme } = useTheme();
  const [votesCount, setVotesCount] = useState(0);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>({});

  const [interestedUsers, setInterestedUsers] = useState<any>([]);

  const coordinateService = useCoordinateService();

  const statusLabel = pipelineConfig?.filter(
    (item: any) => item.status === currentEnquiryStatus
  )?.[0]?.label;

  const handleVoteClick = async (myActivityId: string | null, item: string) => {
    if (item && myActivityId === null) {
      let payloadData = {
        enquiryId: enquiryId,
        activityType: "UPVOTE",
        activitySubType: item,
      };

      try {
        const createUpvote: any = await coordinateService.upVote(payloadData);

        setVoteStatus((prevState) => ({
          ...prevState,
          [item]: createUpvote?.id,
        }));
        setVotesCount((prev) => prev + 1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (item && myActivityId !== null) {
      const deleteIntent: any =
        await coordinateService.deleteEnquiryActivityIntent(myActivityId);

      if (deleteIntent) {
        setVoteStatus((prevState) => ({
          ...prevState,
          [item]: null,
        }));
        setVotesCount((prev) => prev - 1);
      }
    }
  };

  const handleModalOpen = () => {
    if (enquiryId && eventId && handleModal) {
      handleModal(eventId, enquiryId);
    }
  };

  const handleClickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (interestedUsers.length === 0) fetchInterestedUsers();

    setVotesCount(upvote?.total || 0);

    setVoteStatus(
      coordinateActions.reduce((acc: any, item: any) => {
        const temp = enquiryActivity.filter(
          (myActivity: any) =>
            myActivity.activityType === "UPVOTE" &&
            myActivity.activitySubType === item.status
        );
        acc[item.status] = temp.length > 0 ? temp[0].id : null;
        return acc;
      }, {})
    );
  }, []);

  const fetchInterestedUsers = async () => {
    try {
      const apiData: any = await coordinateService.getInterestedUsers(
        eventId,
        enquiryId
      );
      if (apiData) {
        setInterestedUsers(apiData.interestedUsers);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div className={styles.outerDiv}>
      <div
        className={`${styles.card} card`}
        onClick={() => {
          handleModalOpen();
          GAEvent(
            "Coordinate",
            "Coordinate",
            "Enquiry",
            "Card Clicked | View Detail"
          );
        }}
        style={{ marginTop: !isDateSame ? "0px" : "25px" }}
      >
        {/* <div className={styles.cardBefore}></div> */}
        <div className={styles.topContainer} style={{ display: "flex" }}>
          {eventImage && (
            <div className={styles.leftContainer}>
              <div className="tablet_view mobile_view">
                <StatusChangeDropdown
                  setSelectedId={setSelectedId}
                  label={statusLabel}
                  eventId={eventId}
                  enquiryId={enquiryId}
                  currentEnquiryStatus={currentEnquiryStatus}
                  handleShortlistModal={handleShortlistModal}
                  pipelineConfig={pipelineConfig}
                  enquiryStatusUpdate={enquiryStatusUpdate}
                />
              </div>

              <div
                style={{ display: "flex", boxShadow: "var(--shadow-large)" }}
              >
                <Image
                  src={eventImage}
                  alt="eventImage"
                  width={238}
                  height={192}
                  className={styles.cardImg}
                />
              </div>
            </div>
          )}
          <div className={styles.cardDetails}>
            <div className={styles.eventNameComp}>
              <div>
                <div className={styles.eventName}>{eventName}</div>
                <div className={styles.company}>{eventCompany}</div>
              </div>
              <div className="desktop_view">
                <StatusChangeDropdown
                  setSelectedId={setSelectedId}
                  label={statusLabel}
                  eventId={eventId}
                  enquiryId={enquiryId}
                  currentEnquiryStatus={currentEnquiryStatus}
                  handleShortlistModal={handleShortlistModal}
                  pipelineConfig={pipelineConfig}
                  enquiryStatusUpdate={enquiryStatusUpdate}
                />
              </div>
            </div>
            <div className={styles.locationAndDateContainer}>
              {eventLocation && (
                <div className={styles.eventLocation}>
                  <div>
                    <Location
                      height={"12px"}
                      width={"12px"}
                      color="var(--primary-text-color)"
                      style={{ display: "flex" }}
                    />
                  </div>
                  <div>
                    {eventLocation
                      ? eventLocation === eventCountry
                        ? eventCountry
                        : `${eventLocation}, ${eventCountry}`
                      : ""}
                  </div>
                </div>
              )}

              <div className={styles.eventDate}>
                <Calendar
                  height={"12px"}
                  width={"12px"}
                  color="var(--primary-text-color)"
                />
                <div>
                  {eventStartDate &&
                    eventEndDate &&
                    formatEventDates(eventStartDate, eventEndDate)}
                </div>
              </div>
            </div>

            <div className="tablet_view mobile_view">
              <div>
                <div className={styles.total_upvotes}>
                  {upvote && votesCount}
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
            </div>
            <div className="desktop_view">
              <div
                className={styles.allTagsOuterContainer}
                onClick={handleClickEvent}
              >
                <div className={styles.allTags} style={{ cursor: "default" }}>
                  <div
                    className={styles.total_upvotes}
                    title={`Total upvotes count of ${coordinateActions
                      .map((item) => item.label)
                      .join(", ")}`}
                  >
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

                  {coordinateActions.map((item: any) => (
                    <UpVoteTag
                      key={item.status}
                      type={item.status}
                      label={item.label}
                      status={voteStatus[item.status] ? "voted" : ""}
                      myActivityId={voteStatus[item.status]}
                      handleVoteClick={handleVoteClick}
                      userList={interestedUsers?.filter(
                        (users: any) => users.interest === item.status
                      )}
                    />
                  ))}
                </div>
                <div className={styles.viewCtas}>
                  <button
                    className={styles.notesBtn}
                    style={{ color: "var(--coordinate-primary-color)" }}
                    onClick={() => {
                      handleModalOpen();
                      GAEvent(
                        "Coordinate",
                        "Coordinate",
                        "Enquiry",
                        "View Detail"
                      );
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tablet_view mobile_view">
          <div
            style={{
              display: "flex",
              gap: "6px",
              paddingTop: "20px",
              justifyContent: "center",
            }}
            onClick={handleClickEvent}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default YourEventCard;
