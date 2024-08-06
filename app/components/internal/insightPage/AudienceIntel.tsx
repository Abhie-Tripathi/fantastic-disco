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
            <div className={`${styles.estimatedVisitorCount} ${styles.blurContent}`}>74</div>
          </div>
        </div>
        
        <div className={`${styles.audienceSpreadCard} card`}>
          <div className={styles.cardHeading}>Audience Spread</div>
          <div>-</div>
        </div>
      </div>

      <div className={styles.mainHeading} style={{marginTop: '24px'}}>Map View of Audience Spread</div>
      <div className={`${styles.mapViewCard} ${styles.blurContent} card`} ></div>

      <div className={`${styles.estimatedVisitorCard} card`}>
        <div className={styles.cardHeading}>Estimated Visitors</div>
        <div className={styles.estimatedVisitorCount}>{eventDetail?.stats?.estimatedVisitor ? eventDetail?.stats?.estimatedVisitor : '-'}</div>
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