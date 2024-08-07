import styles from "./rehostscores.style.module.css";

interface ScoreProps {
  eventDetail: any;
}

const RehostScores = ({eventDetail} : ScoreProps) => {
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", gap: "24px", width: "50%" }}
    >
      <div className={`${styles.scoreCard} card`}>
        <div className={styles.cardHeading}>Rehost Score</div>
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
      <div className={`${styles.scoreCard} card`}>
        <div className={styles.cardHeading}>No of editions</div>
        <div className={styles.score}>
          {eventDetail?.totaleventEdition ? eventDetail?.totaleventEdition : '-'}
        </div>
      </div>
      <div className={`${styles.scoreCard} card`}>
        <div className={styles.cardHeading}>Maturity</div>
        {/* <div className={styles.score}>
              {eventDetail?.reputationSentiment &&
              eventDetail?.reputationSentiment > 0
                ? eventDetail?.reputationSentiment
                : "-"}
            </div> */}
        <div className={`${styles.score} ${styles.blurContent}`}>
          <div className={styles.badge_danger}>High</div>
        </div>
      </div>
      <div className={`${styles.scoreCard} card`}>
        <div className={styles.cardHeading}>Rehost month</div>
        <div className={`${styles.score} ${styles.blurContent}`} >
          March
        </div>
      </div>
    </div>
  );
};
export default RehostScores;
