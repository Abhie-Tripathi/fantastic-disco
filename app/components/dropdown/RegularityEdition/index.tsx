import React, { useState } from "react";
import styles from "./regularity.style.module.css";
// import ReactSlider from "react-slider";
// import { InformationFillSmall } from "geist-icons";

interface RankInputProps {
  className?: string;
  selectedMaturity: string;
  setSelectedMaturity: (maturity: string) => void;
  // selectedRegularity: number[];
  // setSelectedRegularity: (rank: number[]) => void;
  onClose: () => void;
}

const RegularityEdition = ({
  className,
  selectedMaturity,
  setSelectedMaturity,
  onClose,
}: RankInputProps) => {

    // const [regularity, setRegularity] = useState<number>(selectedRegularity[0]);
    // const [editionRange, setEditionRange] = useState(selectedRegularity);

    const [maturity, setMaturity] = useState<string>('none');

    const handleRegularityChange = (e: any) => {
        // setEditionRange([0, 100]);
        // setRegularity(Number(e.target.value));
        // setSelectedRegularity([Number(e.target.value), 100]);
        console.log('e.target.value', e.target.value);
        setSelectedMaturity(e.target.value);
    }
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div>
          Maturity{" "}
          {/* <InformationFillSmall color="var(--primary-text-color)" /> */}
        </div>
        {/* <div className={styles.header_button} onClick={() => onClose()}>
          Apply
        </div> */}
      </div>
      <div className={styles.sub_container}>
        {/* <div className={styles.slider_container}>
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
                    const value = Number(e.target.value);
                    if (value <= 100) {
                    setEditionRange([
                    Number(e.target.value),
                    editionRange[1],
                  ]);
                  setRegularity(0);
                  setSelectedRegularity([Number(e.target.value), editionRange[1]]);
                }
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
        <div className={styles.line}></div> */}

        {/* <span className={`${styles.comingSoon_badge} badge_success`} >Coming Soon</span>    
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
        </div> */}

        <div className={styles.slider_container}>
          {/* <div className={styles.checkbox_title}>Maturity</div> */}
          <div className={styles.regularity_container}>
            <div>
              <input
                type="radio"
                id="none"
                name="maturity"
                value="none"
                onChange={handleRegularityChange}
                checked={selectedMaturity === 'none'}
                // disabled={true}
              />
              <label htmlFor="none">
                None
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="low"
                name="maturity"
                value="new"
                onChange={handleRegularityChange}
                checked={selectedMaturity === 'new'}
                // disabled={true}
              />
              <label htmlFor="low">
                New
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="growing"
                name="maturity"
                value="growing"
                onChange={handleRegularityChange}
                checked={selectedMaturity === 'growing'}
                // disabled={true}
              />
              <label htmlFor="growing">
                Growing
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="established"
                name="maturity"
                value="established"
                onChange={handleRegularityChange}
                checked={selectedMaturity === 'established'}
                // disabled={true}
              />
              <label htmlFor="established">
                Established
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="flagship"
                name="maturity"
                value="flagship"
                onChange={handleRegularityChange}
                checked={selectedMaturity === 'flagship'}
                // disabled={true}
              />
              <label htmlFor="flagship">
                Flagship
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegularityEdition;
