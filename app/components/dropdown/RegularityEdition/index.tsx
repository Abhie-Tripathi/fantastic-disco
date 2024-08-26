import React, { useState } from "react";
import styles from "./regularity.style.module.css";
import ReactSlider from "react-slider";
import { InformationFillSmall } from "geist-icons";

interface RankInputProps {
  className?: string;
  selectedRegularity: number[];
  setSelectedRegularity: (rank: number[]) => void;
  onClose: () => void;
}

const RegularityEdition = ({
  className,
  selectedRegularity,
  setSelectedRegularity,
  onClose,
}: RankInputProps) => {

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div>
          Regularity & Edition{" "}
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
              <input
                type="radio"
                id="none"
                name="regularity"
                value="0"
                onChange={(e) =>
                  setSelectedRegularity([
                    Number(e.target.value),
                    selectedRegularity[1],
                  ])
                }
                checked={selectedRegularity[0] == 0}
              />
              <label htmlFor="none" className="badge_primary">
                None
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="low"
                name="regularity"
                value="1"
                onChange={(e) =>
                  setSelectedRegularity([
                    Number(e.target.value),
                    selectedRegularity[1],
                  ])
                }
                checked={selectedRegularity[0] == 1}
              />
              <label htmlFor="low" className="badge_danger">
                Low
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="medium"
                name="regularity"
                value="2"
                onChange={(e) =>
                  setSelectedRegularity([
                    Number(e.target.value),
                    selectedRegularity[1],
                  ])
                }
                checked={selectedRegularity[0] == 2}
              />
              <label htmlFor="medium" className="badge_info">
                Medium
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="high"
                name="regularity"
                value="3"
                onChange={(e) =>
                  setSelectedRegularity([
                    Number(e.target.value),
                    selectedRegularity[1],
                  ])
                }
                checked={selectedRegularity[0] == 3}
              />
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
                setSelectedRegularity(values);
              }}
              value={selectedRegularity}
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
                value={selectedRegularity[0]}
                onChange={(e) =>
                  setSelectedRegularity([
                    Number(e.target.value),
                    selectedRegularity[1],
                  ])
                }
                className={styles.rank_input}
                type="number"
              />
              <span className={styles.input_gap}></span>
              <input
                value={selectedRegularity[1]}
                onChange={(e) =>
                  setSelectedRegularity([
                    selectedRegularity[0],
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
