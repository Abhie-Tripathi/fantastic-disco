import React, { useState } from "react";
import styles from "./rankinput.module.css";
import ReactSlider from "react-slider";
import { useTheme } from "@/context";
import { InformationFillSmall } from "geist-icons";

interface RankInputProps {
  className?: string;
  selectedReputationScore: number[];
  setSelectedReputationScore: (rank: number[]) => void;
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

const RankInput = ({
  className,
  selectedReputationScore,
  setSelectedReputationScore,
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
  const handleToggleChange = (key: string) => {
    setRankToggles((prevState: any) => {
      const newState = {
        ...prevState,
        [key]: !prevState[key],
      };

      if (
        key === "ER" &&
        newState.isEventRank &&
        selectedEventRank.length === 0
      ) {
        setSelectedEventRank([0, 100]);
      } else if (
        key === "AR" &&
        newState.isAviationRank &&
        selectedAviationRank.length === 0
      ) {
        setSelectedAviationRank([0, 100]);
      } else if (
        key === "LR" &&
        newState.isLocalRank &&
        selectedLocalRank.length === 0
      ) {
        setSelectedLocalRank([0, 100]);
      }

      return newState;
    });
  };

  const handleRankSlider = (values: number[], type: string) => {
    if(values[0] !== 0 || values[1] !== 100){
      setRankToggles((prev: any) => {
        return { ...prev, [type]: true };
      });
    }
  }

  return (
    <div
      className={`${styles.container} ${className}`}
    >
      <div className={styles.header}>
        <div>Event Ranking {" "}
          <InformationFillSmall color="var(--primary-text-color)" />
        </div>
        {/* <div className={styles.header_button} onClick={() => onClose()}>
          Apply
        </div> */}
      </div>
      <div className={styles.sub_container}>

        <div className={styles.slider_container}>
          <div className={styles.checkbox_title}>Reputation Score</div>
          <>
            <ReactSlider
              onChange={(values) => {setSelectedReputationScore([values, 100])}}
              value={selectedReputationScore[0]}
              className={styles.horizontal_slider}
              thumbClassName={styles.thumb}
              trackClassName={styles.track}
              // ariaLabel={["Lower thumb", "Upper thumb"]}
              ariaLabel={"Lower thumb"}
              ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
              pearling
              minDistance={1}
            />
            <div className={styles.rank_input_container}>
              <input
                value={selectedReputationScore[0]}
                onChange={(e) =>
                  setSelectedReputationScore([
                    Number(e.target.value),
                    selectedReputationScore[1],
                  ])
                }
                className={styles.rank_input}
              />
              <span className={styles.input_gap}></span>
              <input
                value={selectedReputationScore[1]}
                onChange={(e) =>
                  setSelectedReputationScore([
                    selectedReputationScore[0],
                    Number(e.target.value),
                  ])
                }
                className={styles.rank_input}
                disabled={true}
              />
            </div>
          </>
        </div>

        <div className={styles.line}></div>
        <span className={`${styles.comingSoon_badge} badge_success`} >Coming Soon</span>

        <div className={styles.slider_container}>
          {/* <label className={styles.checkbox_label}>
            <input
              type="checkbox"
              onChange={() => handleToggleChange("isEventRank")}
              checked={rankToggles.isEventRank}
            />
            <span className={styles.checkbox}></span>
          </label> */}
          <div className={styles.checkbox_title}>Category Rank</div>
          <>
            <ReactSlider
              onChange={(values) => {setSelectedEventRank(values); handleRankSlider(values, "isEventRank")}}
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

        <div className={styles.slider_container}>
          {/* <label className={styles.checkbox_label}>
            <input
              type="checkbox"
              onChange={() => handleToggleChange("isLocalRank")}
              checked={rankToggles.isLocalRank}
            />
            <span className={styles.checkbox}></span>
          </label> */}
          <div className={styles.checkbox_title}>Country Rank</div>
          <>
            <ReactSlider
              onChange={(values) => {setSelectedLocalRank(values); handleRankSlider(values, "isLocalRank")}}
              value={selectedLocalRank}
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
                value={selectedLocalRank[0]}
                onChange={(e) =>
                  setSelectedLocalRank([
                    Number(e.target.value),
                    selectedLocalRank[1],
                  ])
                }
                className={styles.rank_input}
                type="number"
                disabled={true}
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
                disabled={true}
              />
            </div>
          </>
        </div>

        <div className={styles.slider_container}>
          {/* <label className={styles.checkbox_label}>
            <input
              type="checkbox"
              onChange={() => handleToggleChange("isAviationRank")}
              checked={rankToggles.isAviationRank}
            />
            <span className={styles.checkbox}></span>
          </label> */}
          <div className={styles.checkbox_title}>Category + Country Rank</div>
          <>
            <ReactSlider
              onChange={(values) => {setSelectedAviationRank(values); handleRankSlider(values, "isAviationRank")}}
              value={selectedAviationRank}
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
                value={selectedAviationRank[0]}
                onChange={(e) =>
                  setSelectedAviationRank([
                    Number(e.target.value),
                    selectedAviationRank[1],
                  ])
                }
                className={styles.rank_input}
                disabled={true}
              />
              <span className={styles.input_gap}></span>
              <input
                value={selectedAviationRank[1]}
                onChange={(e) =>
                  setSelectedAviationRank([
                    selectedAviationRank[0],
                    Number(e.target.value),
                  ])
                }
                className={styles.rank_input}
                disabled={true}
              />
            </div>
          </>
        </div>

        <div className={styles.line}></div>

      </div>
    </div>
  );
};

export default RankInput;
