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
      <div>
        <div style={{ display: "flex", gap: "12px" }}>
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
      </div>

      <div className={styles.line}></div>
    </>
  );
};

export default Intel;


function getSvg() {
  return (
    <svg width="90" height="92" viewBox="0 0 90 92" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M42.3742 0.37326C38.3293 1.86576 36.1633 5.93207 37.2258 10.0387C38.7256 15.8339 45.9369 17.9953 50.3789 13.9809C54.6356 10.1341 53.621 3.22945 48.4316 0.725947C47.2955 0.177885 46.9498 0.10401 45.2804 0.0516973C43.7579 0.0038848 43.2116 0.0642598 42.3742 0.37326ZM36.0485 20.1588C32.6536 20.8964 29.8629 23.75 29.1316 27.2315C28.6634 29.4601 29.1022 30.8446 30.5311 31.6477L31.2689 32.0624H44.9186C58.3409 32.0624 58.5817 32.0561 59.3705 31.6741C60.8604 30.9528 61.3458 29.5117 60.8668 27.2315C60.1259 23.7044 57.3391 20.8873 53.8623 20.1504C52.0923 19.7754 37.7825 19.7821 36.0485 20.1588ZM19.5048 36.2075C16.1788 37.5425 16.1169 42.2096 19.4054 43.7116C19.9415 43.9565 20.6116 44.0553 21.7554 44.0583L23.3551 44.0624L24.6343 56.1093C25.3378 62.735 25.9963 68.5595 26.0979 69.0523C26.4491 70.7557 27.8568 71.8023 30.0044 71.9564L31.2284 72.0444L31.5594 70.6657C33.1678 63.9646 39.8043 59.3439 46.6066 60.1891C52.4081 60.9101 57.2827 65.3126 58.5155 70.9445L58.7564 72.0453L59.9872 71.957C62.1397 71.8025 63.5328 70.7503 63.908 68.9958C64.0066 68.534 64.6625 62.735 65.3652 56.1093L66.6432 44.0624L68.243 44.0583C70.7923 44.0518 72.2866 43.0974 72.8654 41.1063C73.3678 39.3783 72.7736 37.7148 71.2784 36.6641L70.4669 36.0937L45.2174 36.0577C28.88 36.0343 19.8044 36.0871 19.5048 36.2075ZM11.4519 68.1624C10.1714 68.5198 9.40869 68.99 8.52744 69.9654C7.39907 71.2145 7.034 72.2167 7.03494 74.0624C7.0355 75.4348 7.10694 75.7921 7.54869 76.6344C8.20025 77.8766 9.12257 78.7989 10.3648 79.4504C11.2059 79.8914 11.5664 79.9638 12.9367 79.9661C14.3058 79.9683 14.681 79.8946 15.5998 79.4437C20.117 77.2254 20.1684 70.817 15.6862 68.6315C14.2563 67.9342 12.8345 67.7767 11.4519 68.1624ZM43.6368 68.0681C40.9471 68.7434 39.1629 70.9211 39.0326 73.6874C38.9431 75.5857 39.4584 76.9769 40.7165 78.2351C42.041 79.5596 43.0426 79.9646 44.9992 79.9668C46.3964 79.9685 46.7283 79.9001 47.6909 79.4124C49.9019 78.2921 51.0853 76.2236 50.9658 73.6874C50.8874 72.0236 50.4095 70.9036 49.2824 69.7423C47.9204 68.3386 45.4619 67.6096 43.6368 68.0681ZM75.5484 68.1209C74.3992 68.4448 73.091 69.2317 72.4578 69.9806C69.8598 73.0526 70.8091 77.6808 74.3986 79.4437C75.3174 79.8946 75.6926 79.9683 77.0617 79.9661C78.4319 79.9638 78.7925 79.8914 79.6336 79.4504C80.8758 78.7989 81.7981 77.8766 82.4497 76.6344C82.8907 75.7933 82.9631 75.4327 82.9653 74.0624C82.9676 72.6933 82.8939 72.3181 82.4429 71.3994C81.1912 68.8503 78.1287 67.3942 75.5484 68.1209ZM7.30963 84.3451C4.21532 85.3528 1.77763 88.0715 1.11744 91.2511C0.682255 93.347 1.08107 94.6567 2.43482 95.5781L3.05469 95.9999H13.0304H23.0062L23.6433 95.5766C23.9938 95.3437 24.4762 94.7741 24.7154 94.3109C25.0833 93.599 25.1336 93.2904 25.0406 92.3171C24.7207 88.9728 22.8031 86.2533 19.7298 84.7858L18.2804 84.0937L13.3117 84.0513C8.96601 84.014 8.21338 84.0509 7.30963 84.3451ZM39.3363 84.362C37.2116 85.0413 35.6131 86.2413 34.4594 88.0233C33.4597 89.5679 32.9386 91.3661 33.0288 92.9621C33.1102 94.4004 33.4509 95.0017 34.5333 95.6171C35.2132 96.0037 35.372 96.0088 45.2208 95.9578L55.2179 95.9062L55.8202 95.4543C56.6446 94.8358 56.9992 93.9963 56.9992 92.6632C56.9992 90.5941 55.7756 87.8017 54.2591 86.4095C53.3471 85.5723 51.902 84.7548 50.6514 84.3682C49.6016 84.0438 48.9208 84.0011 44.9326 84.0101C41.0866 84.0185 40.2446 84.0716 39.3363 84.362ZM71.5205 84.263C68.0609 85.3466 65.5396 88.2854 65.0218 91.8382C64.8161 93.2504 64.8268 93.3579 65.2621 94.2361C65.5173 94.7508 65.9984 95.3414 66.3551 95.5779L66.9922 95.9999H76.9679H86.9437L87.5636 95.5781C88.9173 94.6567 89.3161 93.347 88.8809 91.2511C88.2086 88.0121 85.6501 85.2194 82.5119 84.2986C81.1934 83.9118 72.7295 83.8844 71.5205 84.263Z" fill="#99CEFF"/>
    </svg>
  )
}