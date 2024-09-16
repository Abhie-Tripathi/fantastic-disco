import React from "react";
import styles from "./analyticsdropdown.module.css";
import ReactSlider from "react-slider";
// import { InformationFillSmall } from "geist-icons";

interface RankInputProps {
  className?: string;
  selectedEventRank: number[];
  setSelectedEventRank: (rank: number[]) => void;
  onClose: () => void;
  type: string;
}

const AudienceQuality = ({
  className,
  selectedEventRank,
  setSelectedEventRank,
  onClose,
  type,
}: RankInputProps) => {

  return (
    <div
      className={`${styles.container} ${className}`}
    >
      <div className={styles.header}>
        <div>{type} Quality Score {" "}
          {/* <InformationFillSmall color="var(--primary-text-color)" /> */}
        </div>
        {/* <div className={styles.header_button} onClick={() => onClose()}>
          Apply
        </div> */}
      </div>
      <div className={styles.sub_container}>
        <div className={styles.slider_container}>
          <div className={styles.checkbox_title}>{type} Quality Score</div>
          <>
            <ReactSlider
              onChange={(values) => {setSelectedEventRank(values)}}
              value={selectedEventRank}
              className={styles.horizontal_slider}
              thumbClassName={styles.thumb}
              trackClassName={styles.track}
              ariaLabel={["Lower thumb", "Upper thumb"]}
              ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
              pearling
              minDistance={1}
              disabled={true}
            />
            <div className={styles.rank_input_container}>
              <input
                value={selectedEventRank[0]}
                onChange={(e) =>
                  setSelectedEventRank([
                    Number(e.target.value),
                    selectedEventRank[1],
                  ])
                }
                className={styles.rank_input}
                type="number"
                disabled={true}
              />
              <span className={styles.input_gap}></span>
              <input
                value={selectedEventRank[1]}
                onChange={(e) =>
                  setSelectedEventRank([
                    selectedEventRank[0],
                    Number(e.target.value),
                  ])
                }
                className={styles.rank_input}
                type="number"
                disabled={true}
              />
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default AudienceQuality;
