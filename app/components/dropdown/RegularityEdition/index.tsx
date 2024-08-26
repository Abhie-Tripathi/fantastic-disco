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

    const [regularity, setRegularity] = useState<number>(selectedRegularity[0]);
    const [editionRange, setEditionRange] = useState(selectedRegularity);

    const handleRegularityChange = (e: any) => {
        setEditionRange([0, 100]);
        setRegularity(Number(e.target.value));
        setSelectedRegularity([Number(e.target.value), 100]);
    }
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div>
          Regularity & Edition{" "}
          <InformationFillSmall color="var(--primary-text-color)" />
        </div>
        {/* <div className={styles.header_button} onClick={() => onClose()}>
          Apply
        </div> */}
      </div>
      <div className={styles.sub_container}>
        <div className={styles.slider_container}>
          <div className={styles.checkbox_title}>Edition</div>
          <>
            <ReactSlider
              onChange={(values) => {
                setEditionRange([values, 100]);
                setRegularity(0);
                setSelectedRegularity([values, 100]);
              }}
              value={editionRange[0]}
              className={styles.horizontal_slider}
              thumbClassName={styles.thumb}
              trackClassName={styles.track}
              ariaLabel={"Lower thumb"}
              ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
              pearling
              minDistance={1}
            />
            <div className={styles.rank_input_container}>
              <input
                value={editionRange[0]}
                onChange={(e) =>{
                    setEditionRange([
                    Number(e.target.value),
                    editionRange[1],
                  ]);
                  setRegularity(0);
                  setSelectedRegularity([Number(e.target.value), editionRange[1]]);
                }
                }
                className={styles.rank_input}
                type="number"
              />
              <span className={styles.input_gap}></span>
              <input
                value={editionRange[1]}
                onChange={(e) =>{
                    setEditionRange([
                    editionRange[0],
                    Number(e.target.value),
                  ]);
                  setRegularity(0);
                  setSelectedRegularity([editionRange[0], Number(e.target.value)]);
                }
                }
                className={styles.rank_input}
                type="number"
                disabled={true}
              />
            </div>
          </>
        </div>
        <div className={styles.line}></div>
        
        <span className={`${styles.comingSoon_badge} badge_success`} >Coming Soon</span>    
        <div className={styles.slider_container}>
          <div className={styles.checkbox_title}>Regularity</div>
          <div className={styles.regularity_container}>
            <div>
              <input
                type="radio"
                id="none"
                name="regularity"
                value="0"
                onChange={handleRegularityChange}
                checked={regularity == 0}
                disabled={true}
              />
              <label htmlFor="none" className="badge_primary" style={{color: 'var(--primary-text-color)', backgroundColor: 'var(--heading-background-color)'}}>
                None
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="low"
                name="regularity"
                value="1"
                onChange={handleRegularityChange}
                checked={regularity == 1}
                disabled={true}
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
                onChange={handleRegularityChange}
                checked={regularity == 2}
                disabled={true}
              />
              <label htmlFor="medium" className="badge_primary">
                Medium
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="high"
                name="regularity"
                value="3"
                onChange={handleRegularityChange}
                checked={regularity == 3}
                disabled={true}
              />
              <label htmlFor="high" className="badge_success">
                High
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegularityEdition;
