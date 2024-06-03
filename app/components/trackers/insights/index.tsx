import React from 'react'
import styles from './insights.style.module.css'
const index = () => {
    const format = ["Hybrid", "In-person", "Virtual", "Offline"]
    const freq=["Annual","Biannual","Queartly"]
    const entry=["Free","Paid","Invites","Member Access"];
    const rank=["Country Rank","Category Rank"];
    const key=["Tags","Airport","Animal","Sea","Arson","Cruise","National","Shows"];
    return (
        <div className={styles.container}>
            <div className={styles.formatFreq}>
                <div className={styles.branded}>
                    <div className={styles.formatHead}>Branded Event</div>
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
                    <div className={styles.formatHead}>Event Series</div>
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
            <div className={styles.branded}>
                    <div className={styles.formatHead}>
                        Trust Score
                        <span className={styles.circle}>20</span>
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
                <div className={styles.branded}>
                    <div className={styles.formatHead}>
                        Reputation Score
                        <span className={styles.circle}>40</span>
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
            </div>
            <div className={styles.formatFreq}>
            <div className={styles.branded}>
                    <div className={styles.formatHead}>
                        Maturity
                        <span className={styles.newBtn}>New</span>
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
            </div>
        </div>
  )
}

export default index
