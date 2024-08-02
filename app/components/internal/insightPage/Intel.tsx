import styles from "./overview.style.module.css";
import { useTheme } from "@/context";

interface OverviewProps {
  eventDetail: any;
}

const Intel = ({ eventDetail }: OverviewProps) => {
  const { theme } = useTheme();
  return (
    <>
      <div className={styles.mainHeading}>Ranking</div>
      <div className={styles.headingText}>
        See where the event stands in industry and country rankings
      </div>
    <div className={styles.rankCards}>
        {/* {eventDetail?.rank?.localRank && eventDetail.rank.localRank > 0 ? ( */}
            <div className={`${styles.cardItem} card`}>
                <div className={styles.rank}>03</div>
                <div className={styles.rankType}>Country Rank</div>
            </div>
        {/* ) : (
            <></>
        )} */}
        {/* {eventDetail?.rank?.eventRank && eventDetail.rank.eventRank > 0 ? ( */}
            <div className={`${styles.cardItem} card`}>
                <div className={styles.rank}>12</div>
                <div className={styles.rankType}>Industry Rank</div>
            </div>
        {/* ) : (
            <></>
        )} */}
            <div className={`${styles.cardItem} card`}>
                <div className={styles.rank}>31</div>
                <div className={styles.rankType}>Country + Industry Rank</div>
            </div>
    </div>


      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Rehost Score & Graph</div>
      <div className={styles.headingText}>
        Track event engagement and impact with our Rehost Score & Graph.
      </div>
      {/* <div className={styles.eventDesc}>{eventDetail?.description}</div> */}

      <div className={styles.line}></div>
    </>
  );
};

export default Intel;
