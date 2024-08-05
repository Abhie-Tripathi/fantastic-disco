import { ArrowRight } from "geist-icons";
import styles from "./overview.style.module.css";
import { useTheme } from "@/context";
import Image from "next/image";
import relevance_background  from "/public/internal/relevance_background.svg";
import cost_background from "/public/internal/cost_background.svg";

interface OverviewProps {
  eventDetail: any;
}

const Intel = ({ eventDetail }: OverviewProps) => {
  const { theme } = useTheme();
  return (
    <>
      <div className={styles.calculatorCardContainer} >
        <div className={`${styles.relevanceCard} card`} >
          <div className={styles.cardHeading} >Event Relevance Calculator</div>
          <div>Measure the impact and relevance of events to your Goals</div>
          <div className={styles.cardCta} >Check relevance score {" "}
            <ArrowRight width="16px" />
          </div>
          <Image className={styles.cardImage} src={relevance_background} alt="background" />
        </div>
        <div className={`${styles.costCard} card`} >
          <div className={styles.cardHeading} >Cost Estimate Calculator</div>
          <div>Calculate how much it's going to cost you to attend this event.</div>
          <div className={styles.cardCta} >Check cost estimate {" "}
            <ArrowRight width="16px" />
          </div>
          <Image style={{marginRight:"10px"}} className={styles.cardImage} src={cost_background} alt="background" />
        </div>
      </div>
      <div className={styles.mainHeading}>Ranking</div>
      <div className={styles.headingText}>
        See where the event stands in industry and country rankings
      </div>
      <div className="card" >
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
      </div>
      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Rehost Score & Graph</div>
      <div className={styles.headingText}>
        Track event engagement and impact with our Rehost Score & Graph.
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", width: "50%" }}>
          <div className={`${styles.scoreCard} card`}>
            <div className={styles.cardHeading}>Rehost Score</div>
            <div className={styles.score}>{eventDetail?.eventSize}</div>
            {/* <div className={styles.scoreChange}>
              <div className={styles.pill_info}>5.2 %</div>
              <div>Since last edition</div>
            </div> */}
          </div>
          <div className={`${styles.scoreCard} card`}>
            <div className={styles.cardHeading}>No of editions</div>
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
            <div className={styles.cardHeading}>Maturity</div>
            {/* <div className={styles.score}>
              {eventDetail?.reputationSentiment &&
              eventDetail?.reputationSentiment > 0
                ? eventDetail?.reputationSentiment
                : "-"}
            </div> */}
            <div className={styles.scoreChange}>
              <div className={styles.badge_danger}>High</div>
            </div>
          </div>
          <div className={`${styles.scoreCard} card`}>
            <div className={styles.cardHeading}>Rehost month</div>
            <div className={styles.score}>
              {eventDetail?.reputationSentiment &&
              eventDetail?.reputationSentiment > 0
                ? eventDetail?.reputationSentiment
                : "-"}
            </div>
          </div>
        </div>
        <div className="card" style={{ width: "50%" }}>
          <div className={"title"}>
            Past Editions
          </div>
          <div className={styles.pastEditionCards}>
            <div className="card">
              Milano PharmaTech & LabTech Expo
            </div>
          </div>
        </div>
      </div>

      <div className={styles.line}></div>
    </>
  );
};

export default Intel;