import { ArrowRight } from "geist-icons";
import styles from "./overview.style.module.css";
import { useTheme } from "@/context";
import Image from "next/image";
import relevance_background  from "/public/internal/relevance_background.svg";
import cost_background from "/public/internal/cost_background.svg";
import Ranking from "./intelSections/Ranking";
import RehostScores from "./intelSections/RehostScores";
import PastEditions from "./intelSections/PastEditions";

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
      <Ranking />
      <div className={styles.line}></div>

      <div className={styles.mainHeading}>Rehost Score & Graph</div>
      <div className={styles.headingText}>
        Track event engagement and impact with our Rehost Score & Graph.
      </div>
      <div style={{ display: "flex", margin: "16px 0" }}>
        <RehostScores eventDetail={eventDetail} />
        <PastEditions />
      </div>
    </>
  );
};

export default Intel;