import React, { useState } from "react";
import styles from "./regularity.style.module.css";
import ReactSlider from "react-slider";
import { useTheme } from "@/context";
import { InformationFillSmall } from "geist-icons";

interface RankInputProps {
  className?: string;
  selectedEventRank: number[];
  setSelectedEventRank: (rank: number[]) => void;
  selectedLocalRank: number[];
  setSelectedLocalRank: (rank: number[]) => void;
  selectedAviationRank: number[];
  setSelectedAviationRank: (rank: number[]) => void;
  rankToggles: any;
  setRankToggles: any;
  onClose: () => void;
}

const RegularityEdition = ({
  className,
  selectedEventRank,
  setSelectedEventRank,
  selectedLocalRank,
  setSelectedLocalRank,
  selectedAviationRank,
  setSelectedAviationRank,
  rankToggles,
  setRankToggles,
  onClose,
}: RankInputProps) => {
  const { theme } = useTheme();

  const handleRankSlider = (values: number[], type: string) => {
    if (values[0] !== 0 || values[1] !== 100) {
      setRankToggles((prev: any) => {
        return { ...prev, [type]: true };
      });
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div>Regularity & Edition {" "}
          <InformationFillSmall color="var(--primary-text-color)" />
        </div>
        <div className={styles.header_button} onClick={() => onClose()}>
          Apply
        </div>
      </div>
      <div className={styles.sub_container}>
        <div className={styles.slider_container}>
          <div className={styles.checkbox_title}>Regularity</div>
          <div className={styles.regularity_container}>
            <div>
              <input type="radio" id="none" name="regularity" value="none" />
              <label htmlFor="none" className="badge_danger">
                None
              </label>
            </div>
            <div>
              <input type="radio" id="low" name="regularity" value="low" />
              <label htmlFor="low" className="badge_primary">
                Low
              </label>
            </div>
            <div>
              <input type="radio" id="medium" name="regularity" value="medium" />
              <label htmlFor="medium" className="badge_info">
                Medium
              </label>
            </div>
            <div>
              <input type="radio" id="high" name="regularity" value="high" />
              <label htmlFor="high" className="badge_warning">
                High
              </label>
            </div>
          </div>
        </div>
        <div className={styles.slider_container}>
          <div className={styles.checkbox_title}>Edition</div>
          <>
            <ReactSlider
              onChange={(values) => {
                setSelectedLocalRank(values);
                handleRankSlider(values, "isLocalRank");
              }}
              value={selectedLocalRank}
              className={styles.horizontal_slider}
              thumbClassName={styles.thumb}
              trackClassName={styles.track}
              ariaLabel={["Lower thumb", "Upper thumb"]}
              ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
              pearling
              minDistance={1}
            />
            <div className={styles.rank_input_container}>
              <input
                value={selectedLocalRank[0]}
                onChange={(e) =>
                  setSelectedLocalRank([
                    Number(e.target.value),
                    selectedLocalRank[1],
                  ])
                }
                className={styles.rank_input}
                type="number"
              />
              <span className={styles.input_gap}></span>
              <input
                value={selectedLocalRank[1]}
                onChange={(e) =>
                  setSelectedLocalRank([
                    selectedLocalRank[0],
                    Number(e.target.value),
                  ])
                }
                className={styles.rank_input}
                type="number"
              />
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default RegularityEdition;
