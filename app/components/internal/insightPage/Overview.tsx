import { Location } from "geist-icons";
import ProgressBar from "../../UI/progressBar";
import styles from "./overview.style.module.css";
import { useTheme } from "@/context";
import Image from "next/image";
import PlaceHolder from '/public/placeholder.png'
import Exhibitors from "./overviewSections/Exhibitors";
import Speakers from "./overviewSections/Speakers";
import Sponsors from "./overviewSections/Sponsors";

interface OverviewProps {
  eventDetail: any;
}

function isUpcomingEvent(startDate: Date): boolean {
  startDate = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return startDate > today;
}

const Overview = ({ eventDetail }: OverviewProps) => {
  const { theme } = useTheme();
  return (
    <>
      <div className={`${styles.infoCard} card`}>
        <div className={styles.infoCardLeft}>
          <div className={styles.tagsContainer}>
            {eventDetail?.format && (
              <div className={styles.badge_danger}>{eventDetail.format}</div>
            )}
            {eventDetail?.startDate &&
              isUpcomingEvent(eventDetail.startDate) && (
                <div className={styles.badge_success}>Upcoming Event</div>
              )}
          </div>
          <div className={styles.subHeading}>Category</div>
          <div className={styles.categoryContainer}>
            {eventDetail?.categories &&
              eventDetail.categories.map((cat: any, index: number) => (
                <div key={index} className={styles.catItem}>{cat.name}</div>
              ))}
          </div>

          {/* <div className={styles.rankCards}>
            {eventDetail?.rank?.localRank && eventDetail.rank.localRank > 0 ? (
              <div className={`${styles.cardItem} card`}>
                <div className={styles.rank}>03</div>
                <div className={styles.rankType}>Category Rank</div>
              </div>
            ) : (
              <></>
            )}
            {eventDetail?.rank?.eventRank && eventDetail.rank.eventRank > 0 ? (
              <div className={`${styles.cardItem} card`}>
                <div className={styles.rank}>12</div>
                <div className={styles.rankType}>International Rank</div>
              </div>
            ) : (
              <></>
            )}
          </div> */}
        </div>
        {/* {eventDetail?.eventKeywords && eventDetail.eventKeywords.length > 0 && (
          <div className={`${styles.infoCardRight} card`}>
            <div className={styles.subHeading} style={{ margin: 0 }}>
              Products
            </div>
            <div className={styles.categoryContainer}>
              {eventDetail.eventKeywords.map((item: any) => (
                <div className={styles.catItem}>{item}</div>
              ))}
            </div>
          </div>
        )} */}
      </div>
      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Event Intelligence</div>
      <div className={styles.headingText}>
        Unlock actionable insights from the events with real-time analytics and
        strategic intelligence
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <div className={`${styles.scoreCard} card`}>
          <div className={styles.cardHeading}>Event Reputation Score</div>
          <div className={styles.score}>
            {eventDetail?.reputationSentiment &&
            eventDetail?.reputationSentiment > 0
              ? eventDetail?.reputationSentiment
              : "-"}
          </div>
          {/* <div className={styles.scoreChange}>
            <div className={styles.pill_info}>High</div>
            <div>Since last edition</div>
          </div> */}
        </div>
        <div className={`${styles.scoreCard} card`}>
          <div className={styles.cardHeading}>Event Impact Score</div>
          <div className={styles.score}>{eventDetail?.eventSize}</div>
          {/* <div className={styles.scoreChange}>
            <div className={styles.pill_info}>5.2 %</div>
            <div>Since last edition</div>
          </div> */}
        </div>
        <div className={`${styles.scoreCard} card`}>
          <div className={styles.cardHeading}>Event Trust Score</div>
          <div className={styles.score}>
            {eventDetail?.repeatSentiment && eventDetail?.repeatSentiment > 0
              ? eventDetail?.repeatSentiment + "%"
              : "-"}
          </div>
          {/* <div className={styles.scoreChange}>
            <div className={styles.pill_info}>5.2 %</div>
            <div>Since last edition</div>
          </div> */}
        </div>
      </div>

      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Event Description</div>
      <div className={styles.eventDesc}>
        {eventDetail?.description}
      </div>

      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Organizer</div>
      <div className={`${styles.infoCard} card`}>
        <div className={styles.hostDetailsContainer}>
            <Image src={PlaceHolder} alt='company' width={48} height={48} style={{ borderRadius: 12 }} />
            <div className={styles.hostDetails}>
                <div className={styles.hostname}>10 Times</div>
                <div className={styles.hostlocation}>
                  <Location color={theme === "dark" ? "white" : ""} />
                    <span>Bengaluru, Karnataka</span>
                </div>
                <div className={styles.upcoming}>Upcoming Events <span>N/A</span></div>
                <div className={styles.hosted}>Events Hosted <span>12</span></div>
            </div>
        </div>
      </div>
      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Exhibitors</div>
      <Exhibitors />
      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Speakers</div>
      <Speakers />
      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Sponsors</div>
      <Sponsors />

      
      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Audience Intelligence</div>
      <div className={styles.headingText}>
        Gain deep understanding of the target audience with advanced data
        analytics and insights
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <div className={`${styles.audienceCard} card`}>
          <div className={styles.cardHeading}>Audience Profile</div>
          <div className={`${styles.audienceSubCard} card`}>
            <div className={styles.cardHeading}>Most interested Dept</div>
            <ProgressBar value={95} label="Marketing" />
          </div>
          <div className={styles.otherProfiles}>
            Other profiles
            <ProgressBar value={82} label="CEO" />
            <ProgressBar value={55} label="Manager" />
            <ProgressBar value={16} label="Student" />
          </div>
        </div>
        <div className={`${styles.audienceCard} card`}>
          <div className={styles.cardHeading}>Audience Company Type</div>
          <div className={`${styles.audienceSubCard} card`}>
            <div className={styles.cardHeading}>
              Most interested company type
            </div>
            <ProgressBar value={95} label="MSME" />
          </div>
          <div className={styles.otherProfiles}>
            Other profiles
            <ProgressBar value={82} label="SME" />
            <ProgressBar value={55} label="Multi National" />
            <ProgressBar value={16} label="Startups" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
