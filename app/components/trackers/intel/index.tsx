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
            Trust Score
            {parseInt(trustScore) > 0 && <span className={styles.circle}> {trustScore}</span>}
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
            Reputation Score
            {parseInt(reputation) > 0 && <span className={styles.circle}> {reputation}</span>}
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
            <div className={styles.formatFreq}>
            <div className={styles.brandeOuter} >
                <div className={styles.rate}>
                    <div className={styles.formatHead}>
                        User Ratings
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
                              <span className={`${userRating?.length>0 ? styles.sliderBranded : styles.slider}`}></span>
                            </label>
                          </span>
                        </div>
                        </div>
                        <div className={styles.allCat}>
                        {userRating?.map((item:string, id:number) => (
                            <>
                                <label style={{display:"flex"}} >
                                    <input

                                        className={styles.text}
                                        type="checkbox"
                                        // onChange={() => onChange()}
                                        checked={true}
                                        disabled
                                    />
                                    <span className={styles.item}>{item}</span>
                                </label>
                            </>
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
  )
}

export default index

