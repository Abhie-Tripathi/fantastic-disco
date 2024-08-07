import { useTheme } from "@/context";
import AudienceProfile from "./audienceIntelSections/AudienceProfile";
import styles from "./overview.style.module.css";

interface OverviewProps {
  eventDetail: any;
}

const AudienceIntel = ({ eventDetail }: OverviewProps) => {
  const { theme } = useTheme();
  return (
    <>
      <div className={styles.mainHeading} style={{marginTop: '24px'}}>Audience Scores</div>
      <div className={styles.headingText}>
        Understand audience demographic with comprehensive scoring metrics.
      </div>

      <div style={{display: 'flex', gap: '12px'}}>
        <div className={`${styles.audienceScoreCard} card`}>
          <div>
            <div className={styles.cardHeading}>Inbound Score</div>
            <div className={`${styles.estimatedVisitorCount} ${styles.blurContent}`}>96</div>
          </div>
          <div>
            <div className={styles.cardHeading}>International Score</div>
            {/* <div className={`${styles.internationalCount} ${ styles.badge_success}`}>{eventDetail["internationalAudience%"] !== undefined ? eventDetail["internationalAudience%"] : '-'}</div> */}
            <div className={styles.internationalCount}>
              {eventDetail["internationalAudience%"] !== undefined ? (
                eventDetail["internationalAudience%"] == "High" ? (
                  <span className={styles.badge_success}>High</span>
                ) : eventDetail["internationalAudience%"] == "Medium" ? (
                  <span className={styles.badge_primary}>Medium</span>
                ) : eventDetail["internationalAudience%"] == "Low" ? (
                  <span className={styles.badge_danger}>Low</span>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        
        <div className={`${styles.audienceSpreadCard} card`}>
          <div className={styles.cardHeading}>Audience Spread</div>
          <div className={`${styles.blurContent} card`} style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
              Local
              <div>234</div>
            </div>
            <div>National
              <div>2312</div>
            </div>
            <div>Local
              <div>1910</div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className={styles.mainHeading} style={{marginTop: '24px'}}>Audience Spread</div>
      <div className={`${styles.mapViewCard} ${styles.blurContent} card`} ></div> */}

      <div className={`${styles.estimatedVisitorCard} card`}>
        <div className={styles.cardHeading}>Estimated Visitors</div>
        <div className={styles.estimatedVisitorCount}>{eventDetail?.eventSize ? eventDetail?.eventSize : '-'}</div>
        {/* <div>Has more visitor count that 92% of the events in the same category</div> */}
      </div>

      <div className={styles.blurContent} style={{ display: "flex", gap: "12px" }}>
        <AudienceProfile />
        <AudienceProfile />
      </div>
    </>
  );
};

export default AudienceIntel;