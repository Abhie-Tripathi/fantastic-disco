import React from 'react'
import styles from './insights.style.module.css'
import ToggleBtn from '../../UI/ToggleBtn'
const index = ({ isBranded, trustScore, reputation, maturity, rank, exhibitScore, internationalScore, inboundScore, eventRank, localRank, start, end, eventSize, isTrustOpen, isExhibitOpen, eventImpactScore, globalToggle, isRankOpen, isEconomicOpen}: any) => {
  const format = ["Hybrid", "In-person", "Virtual", "Offline"]
  const freq = ["Annual", "Biannual", "Queartly"]
  const entry = ["Free", "Paid", "Invites", "Member Access"];
  // const rank=["Country Rank","Category Rank"];
  const key = ["Tags", "Airport", "Animal", "Sea", "Arson", "Cruise", "National", "Shows"];
  const isAnalyticsOpen = (internationalScore || inboundScore || eventImpactScore);
  const commonClasses={
    filter:`flex flex-col gap-[var(--spacing-sm)] p-3 border border-[var(--border-color)] rounded-[var(--border-radius-sm)]`,
    filterHeading:`text-[var(--primary-color)] font-medium`,
    toggleContainer:`p-[12px] border border-[var(--border-color)] flex justify-between items-center gap-[var(--spacing-sm)] rounded-[var(--border-radius-sm)]`,
  }
  return (
    <div className={styles.container}>
      <div className={styles.formatFreq}>
      <div className={commonClasses.filter}>
                    <div className={commonClasses.filterHeading}>Event Visitors</div>
                    {/* <div className="flex flex-wrap gap-3" style={{display:"grid", gridTemplateColumns:" repeat(2, 1fr)"}}>
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
                    </div> */}
                    <div className="gap-3 grid grid-cols-2">
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
                                    <span className={styles.item}>{`${item.charAt(0).toUpperCase()}${item.slice(1).toLowerCase()}`}</span>
                                </label>
                            </>
                        ))}
                    </div>
                </div>
      <div className={commonClasses.filter}>
                    <div className="flex justify-between items-center text-[var(--primary-color)] font-medium">
                    Estimated Exhibitor
                    <div className={styles.toggle_container}>
                    <ToggleBtn isTrue={isExhibitOpen}/>
      </div>
                    </div>
                    <div className="gap-3 grid grid-cols-2" >
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
                        <div className={commonClasses.toggleContainer}>
                    <div className="flex items-center text-[var(--primary-color)] font-medium">Event Analytics</div>
                    <div className={styles.toggle_container}>
                     <ToggleBtn isTrue={globalToggle}/>
                        </div>
            </div>
            <div className={commonClasses.toggleContainer}>
                    <div className="flex items-center text-[var(--primary-color)] font-medium">Economic Impact</div>
                    <div className={styles.toggle_container}>
                         <ToggleBtn isTrue={isEconomicOpen}/>
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
      <div className={commonClasses.toggleContainer}>
          <div className="flex items-center text-[var(--primary-color)] font-medium">
            Trust Score
            {/* {parseInt(trustScore) > 0 && <span className={styles.circle}> {trustScore}</span>} */}
          </div>
          <div className={styles.toggle_container}>
            <ToggleBtn isTrue={isTrustOpen}/>
          </div>
        </div>
        <div className={commonClasses.toggleContainer}>
          <div className="flex items-center text-[var(--primary-color)] font-medium">
            Event Ranking
          </div>
          <div className={styles.toggle_container}>
          <ToggleBtn isTrue={isRankOpen}/>
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
