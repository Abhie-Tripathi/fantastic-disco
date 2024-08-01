import React from 'react'
import styles from './intel.style.module.css'
const index = ({internationalScore,inboundScore, userRating, exhibitScore, trustScore, reputation}:any) => {
    const format = ["Hybrid", "In-person", "Virtual", "Offline"]
    const freq=["Annual","Biannual","Queartly"]
    const entry=["Free","Paid","Invites","Member Access"];
    const rank=["Country Rank","Category Rank"];
    const key=["Tags","Airport","Animal","Sea","Arson","Cruise","National","Shows"];
    const rate=['2-3','3-4'];
    const score=['1,000-2,000','5,000-10,000'];
    return (
        <div className={styles.container}>
           <div className={styles.formatFreq}>
        <div className={styles.branded}>
          <div className={styles.formatHead}>
            Audience Quality Score
          </div>
          <div className={styles.toggle_container}>
            <span>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  // onChange={() => {}}
                  // checked={}
                  defaultChecked
                  disabled
                />
                <span className={`${parseInt(trustScore) > 0 ? styles.sliderBranded : styles.slider}`}></span>
              </label>
            </span>
          </div>
        </div>
        <div className={styles.branded}>
          <div className={styles.formatHead}>
          Designation &amp; Department
          </div>
          <div className={styles.toggle_container}>
            <span>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  // onChange={() => {}}
                  // checked={}
                  defaultChecked
                  disabled
                />
                <span className={`${parseInt(reputation) > 0 ? styles.sliderBranded : styles.slider}`}></span>
              </label>
            </span>
          </div>
        </div>
        <div className={styles.branded}>
          <div className={styles.formatHead}>
          Audience Spread
          </div>
          <div className={styles.toggle_container}>
            <span>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  // onChange={() => {}}
                  // checked={}
                  defaultChecked
                  disabled
                />
                <span className={`${parseInt(reputation) > 0 ? styles.sliderBranded : styles.slider}`}></span>
              </label>
            </span>
          </div>
        </div>
      
                
            </div>
        </div>
  )
}

export default index

