import React from 'react'
import styles from './insights.style.module.css'
const index = ({ isBranded, trustScore, reputation, maturity, rank, exhibitScore, internationalScore, inboundScore, eventRank, localRank }: any) => {
  const format = ["Hybrid", "In-person", "Virtual", "Offline"]
  const freq = ["Annual", "Biannual", "Queartly"]
  const entry = ["Free", "Paid", "Invites", "Member Access"];
  // const rank=["Country Rank","Category Rank"];
  const key = ["Tags", "Airport", "Animal", "Sea", "Arson", "Cruise", "National", "Shows"];
  console.log(rank);
  
  return (
    <div className={styles.container}>
      <div className={styles.formatFreq}>
      <div className={styles.branded} >
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
                              <span className={`${exhibitScore?.length>0 ? styles.sliderBranded : styles.slider}`}></span>
                            </label>
                          </span>
                        </div>
                        </div>
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
                              <span className={`${internationalScore?.length>0 ? styles.sliderBranded : styles.slider}`}></span>
                            </label>
                          </span>
                        </div>
            </div>
      </div>
      <div className={styles.formatFreq}>
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
                              <span className={`${parseInt(inboundScore)>0 ? styles.sliderBranded : styles.slider}`}></span>
                            </label>
                          </span>
                        </div>
                </div>
                <div className={styles.branded}>
                    <div className={styles.formatHead}>Rankings</div>
                    <div className={styles.allCat}>
                        {eventRank?.length!==0 && 
                        <div className={styles.item}>Event Rank: {eventRank[0]}-{eventRank[1]}</div>
                        }
                        {localRank?.length!==0 && 
                        <div className={styles.item}>Local Rank: {localRank[0]}-{localRank[1]}</div>
                        }
                    </div>
                </div>
      </div>
    </div>
  )
}

export default index
