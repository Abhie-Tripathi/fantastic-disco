import React, { useState } from "react";
import styles from "./rankinput.module.css";
import ReactSlider from "react-slider";
import { useTheme } from "@/context";

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

const RankInput = ({
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

  return (
    <div
      className={`${styles.container} ${className}`}
      style={{ background: theme === "light" ? "white" : "" }}
    >
      <div className={styles.header}>
        <div className={styles.header_button} onClick={() => onClose()}>
          Done
        </div>
      </div>
      <div className={styles.sub_container}>
        <div className={styles.slider_container}>
          <label className={styles.checkbox_label}>
            <input
              type="checkbox"
              onChange={() => handleToggleChange("isEventRank")}
              checked={rankToggles.isEventRank}
            />
            <span className={styles.checkbox}></span>
          </label>
          <div className={styles.checkbox_title}>Event Rank</div>
          <>
            <ReactSlider
              onChange={(values) => setSelectedEventRank(values)}
              value={selectedEventRank}
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
                value={selectedEventRank[0]}
                onChange={(e) =>
                  setSelectedEventRank([
                    Number(e.target.value),
                    selectedEventRank[1],
                  ])
                }
                className={styles.rank_input}
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
              />
            </div>
          </>
        </div>

        <div className={styles.slider_container}>
          <label className={styles.checkbox_label}>
            <input
              type="checkbox"
              onChange={() => handleToggleChange("isLocalRank")}
              checked={rankToggles.isLocalRank}
            />
            <span className={styles.checkbox}></span>
          </label>
          <div className={styles.checkbox_title}>Local Rank</div>
          <>
            <ReactSlider
              onChange={(values) => setSelectedLocalRank(values)}
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
              />
            </div>
          </>
        </div>

        <div className={styles.slider_container}>
          <label className={styles.checkbox_label}>
            <input
              type="checkbox"
              onChange={() => handleToggleChange("isAviationRank")}
              checked={rankToggles.isAviationRank}
            />
            <span className={styles.checkbox}></span>
          </label>
          <div className={styles.checkbox_title}>Aviation Rank</div>
          <>
            <ReactSlider
              onChange={(values) => setSelectedAviationRank(values)}
              value={selectedAviationRank}
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
                value={selectedAviationRank[0]}
                onChange={(e) =>
                  setSelectedAviationRank([
                    Number(e.target.value),
                    selectedAviationRank[1],
                  ])
                }
                className={styles.rank_input}
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
              />
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default RankInput;
