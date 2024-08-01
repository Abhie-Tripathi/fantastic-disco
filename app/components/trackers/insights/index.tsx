import React from 'react'
import styles from './insights.style.module.css'
const index = ({ isBranded, trustScore, reputation, maturity, rank, exhibitScore, internationalScore, inboundScore, eventRank, localRank, start, end}: any) => {
  const format = ["Hybrid", "In-person", "Virtual", "Offline"]
  const freq = ["Annual", "Biannual", "Queartly"]
  const entry = ["Free", "Paid", "Invites", "Member Access"];
  // const rank=["Country Rank","Category Rank"];
  const key = ["Tags", "Airport", "Animal", "Sea", "Arson", "Cruise", "National", "Shows"];
  
  return (
    <div className={styles.container}>
      <div className={styles.formatFreq}>
      <div className={styles.branded}>
                    <div className={styles.formatHead}>Event Attendence</div>
                    <div className={styles.allCat}>
                    {start?.length>0 &&<div style={{color:'#696B83'}}>{start} - {end}</div>}
                    </div>
                </div>
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
      
      {/* <div className={styles.branded}>
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
                </div> */}
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
