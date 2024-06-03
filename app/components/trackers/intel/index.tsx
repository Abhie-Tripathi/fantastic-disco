import React from 'react'
import styles from './intel.style.module.css'
const index = () => {
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
                    <div className={styles.formatHead}>International Score</div>
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
                              <span className={styles.slider}></span>
                            </label>
                          </span>
                        </div>
                </div>
                <div className={styles.branded}>
                    <div className={styles.formatHead}>Inbound Score</div>
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
                              <span className={styles.slider}></span>
                            </label>
                          </span>
                        </div>
                </div>
            </div>
            <div className={styles.formatFreq}>
            <div className={styles.brandeOne} >
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
                              <span className={styles.slider}></span>
                            </label>
                          </span>
                        </div>
                        </div>
                        <div className={styles.allCat}>
                        {rate.map((item, id) => (
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
                <div className={styles.brandeOne} >
                <div className={styles.rate}>
                    <div className={styles.formatHead}>
                    Estimated Exhibitor Score
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
                              <span className={styles.slider}></span>
                            </label>
                          </span>
                        </div>
                        </div>
                        <div className={styles.allCat}>
                        {score.map((item, id) => (
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

