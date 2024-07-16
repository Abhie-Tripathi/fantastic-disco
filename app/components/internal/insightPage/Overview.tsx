import ProgressBar from "../../UI/progressBar";
import styles from "./overview.style.module.css";

interface OverviewProps {
    eventDetail: any;
}

const Overview = ({ eventDetail } : OverviewProps) => {
  return (
    <>
      <div className={`${styles.infoCard} card`}>
        <div className={styles.infoCardLeft}>
          <div className={styles.tagsContainer}>
            <div className={styles.badge_danger}>OFFLINE</div>
            <div className={styles.badge_success}>Upcoming Event</div>
          </div>
          <div className={styles.subHeading}>Category</div>
          <div className={styles.categoryContainer}>
            <div className={styles.catItem}>Awareness</div>
            <div className={styles.catItem}>CyberSecurity</div>
          </div>
           
          <div className={styles.rankCards}>
            <div className={`${styles.cardItem} card`}>
                <div className={styles.rank}>03</div>
                <div className={styles.rankType}>Category Rank</div>
            </div>
            <div className={`${styles.cardItem} card`}>
                <div className={styles.rank}>12</div>
                <div className={styles.rankType}>International Rank</div>
            </div>
          </div>
        </div>
        <div className={`${styles.infoCardRight} card`}>
            <div className={styles.subHeading} style={{margin: 0}}>Venue</div>
            <div className={styles.venueName}>San Antonio Space Center, Texas, Florida</div>
            <div className={styles.venueLocation}>25, Race Course Rd, Racecourse, Gandhi Nagar, Bengaluru, Karnataka 560001, India</div>
        </div>
      </div>
      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Event Intelligence</div>
      <div className={styles.headingText}>Unlock actionable insights from the events with real-time analytics and strategic intelligence</div>

      <div style={{display: 'flex', gap: '12px'}}>
        <div className={`${styles.scoreCard} card`}>
            <div className={styles.cardHeading}>Event Reputation Score</div>
            <div className={styles.score}>96</div>
            <div className={styles.scoreChange}>
                <div className={styles.pill_info}>High</div>
                <div>Since last edition</div>
            </div>
        </div>
        <div className={`${styles.scoreCard} card`}>
            <div className={styles.cardHeading}>Event Impact Score</div>
            <div className={styles.score}>2000 - 5000</div>
            <div className={styles.scoreChange}>
                <div className={styles.pill_info}>5.2 %</div>
                <div>Since last edition</div>
            </div>
        </div>
        <div className={`${styles.scoreCard} card`}>
            <div className={styles.cardHeading}>Event Relevance Score</div>
            <div className={styles.score}>56</div>
            <div className={styles.scoreChange}>
                <div className={styles.pill_info}>5.2 %</div>
                <div>Since last edition</div>
            </div>
        </div>
      </div>

      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Audience Intelligence</div>
      <div className={styles.headingText}>Gain deep understanding of the target audience with advanced data analytics and insights</div>

      <div style={{display: 'flex', gap: '12px'}}>
        <div className={`${styles.audienceCard} card`}>
            <div className={styles.cardHeading}>Audience Profile</div>
            <div className={`${styles.audienceSubCard} card`}>
                <div className={styles.cardHeading}>Most interested Dept</div>
                <ProgressBar value={95} label="Marketing"/>
            </div>
            <div className={styles.otherProfiles}>
                Other profiles
                <ProgressBar value={82} label="CEO"/>
                <ProgressBar value={55} label="Manager"/>
                <ProgressBar value={16} label="Student"/>
            </div>
        </div>
        <div className={`${styles.audienceCard} card`}>
            <div className={styles.cardHeading}>Audience Company Type</div>
            <div className={`${styles.audienceSubCard} card`}>
                <div className={styles.cardHeading}>Most interested company type</div>
                <ProgressBar value={95} label="MSME"/>
            </div>
            <div className={styles.otherProfiles}>
                Other profiles
                <ProgressBar value={82} label="SME"/>
                <ProgressBar value={55} label="Multi National"/>
                <ProgressBar value={16} label="Startups"/>
            </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
