import React from 'react'
import styles from './insights.style.module.css'
const index = ({ isBranded, trustScore, reputation, maturity, rank, exhibitScore, internationalScore, inboundScore, eventRank, localRank, start, end, eventSize, isTrustOpen, isExhibitOpen}: any) => {
  const format = ["Hybrid", "In-person", "Virtual", "Offline"]
  const freq = ["Annual", "Biannual", "Queartly"]
  const entry = ["Free", "Paid", "Invites", "Member Access"];
  // const rank=["Country Rank","Category Rank"];
  const key = ["Tags", "Airport", "Animal", "Sea", "Arson", "Cruise", "National", "Shows"];
  
  return (
    <div className={styles.container}>
      <div className={styles.formatFreq}>
      <div className={styles.format}>
                    <div className={styles.formatHead}>Event Visitors</div>
                    <div className={styles.allCat} style={{display:"grid", gridTemplateColumns:" repeat(2, 1fr)"}}>
                        {eventSize?.map((item: string, id: number) => (
                            <>
                                <label style={{ display: "flex" }} >
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
      <div className={styles.format}>
                    <div className={styles.formatHead} style={{display:"flex", justifyContent:"space-between"}}>
                    Estimated Exhibitor
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
                <span className={`${isExhibitOpen ? styles.sliderBranded : styles.slider}`}></span>
              </label>
            </span>
          </div>
                    </div>
                    <div className={styles.allCat} style={{display:"grid", gridTemplateColumns:" repeat(2, 1fr)"}}>
                        {exhibitScore?.map((item: string, id: number) => (
                            <>
                                <label style={{ display: "flex" }} >
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
                        <div className={styles.branded}>
                    <div className={styles.formatHead}>Event Analytics</div>
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
                              <span className={`${styles.slider}`}></span>
                            </label>
                          </span>
                        </div>
            </div>
            <div className={styles.branded}>
                    <div className={styles.formatHead}>Economic Impact</div>
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
                               <span className={`${styles.slider}`}></span>
                            </label>
                          </span>
                        </div>
            </div>
                {/* <div className={styles.branded}>
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
            </div> */}
      {/* <div className={styles.branded}>
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
        </div> */}
      <div className={styles.branded}>
          <div className={styles.formatHead}>
            Trust Score
            {/* {parseInt(trustScore) > 0 && <span className={styles.circle}> {trustScore}</span>} */}
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
                <span className={`${isTrustOpen ? styles.sliderBranded : styles.slider}`}></span>
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
                {/* <div className={styles.branded}>
                    <div className={styles.formatHead}>Rankings</div>
                    <div className={styles.allCat}>
                        {eventRank?.length!==0 && 
                        <div className={styles.item}>Event Rank: {eventRank[0]}-{eventRank[1]}</div>
                        }
                        {localRank?.length!==0 && 
                        <div className={styles.item}>Local Rank: {localRank[0]}-{localRank[1]}</div>
                        }
                    </div>
                </div> */}
      </div>
    </div>
  )
}

export default index
