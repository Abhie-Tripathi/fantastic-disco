import React from 'react'
import styles from './advanceFilter.style.module.css'
import ToggleBtn from '../../UI/ToggleBtn';
const index = ({ freq, includeKeywords, excludeKeywords, isBranded, eventEdition, type, eventSeries, forecastedStatus, maturity, isFreqToggle,isMaturity, brandSeries}: any) => {
    // const format = ["Hybrid", "In-person", "Virtual", "Offline"]
    // const freq=["Annual","Biannual","Queartly"]
    // const entry=["Free","Paid","Invites","Member Access"];
    // const rank=["Country Rank","Category Rank"];
    const key = ["Tags", "Airport", "Animal", "Sea", "Arson", "Cruise", "National", "Shows"];
    const commonClasses={
      filter:`flex flex-col gap-[var(--spacing-sm)] p-3 border border-[var(--border-color)] rounded-[var(--border-radius-sm)]`,
      filterHeading:`text-[var(--primary-color)] font-medium`,
      toggleContainer:`p-[12px] border border-[var(--border-color)] flex justify-between gap-[var(--spacing-sm)] rounded-[var(--border-radius-sm)]`,
    }
    
    return (
        <div className='flex flex-col gap-3'>
          {type!=="Product and Topics" &&
           <div className='grid gap-3'>
           <div className={commonClasses.filter}>
               <div className={commonClasses.filterHeading}>Product / Topics</div>
               <div className={styles.allCat1}>
               {includeKeywords?.map((item: string, id: number) => (
                        (
                           <div key={id} className={`${styles.tooltipContainer} ${styles.key}`}>{item}
                           <span className={styles.tooltipText}>Included Keyword</span>
                           </div>
                       )
                   ))}
                   {excludeKeywords?.map((item: string, id: number) => (
                        (
                          <div key={id} className={`${styles.tooltipContainer} ${styles.keyNegative}`}>{item}
                          <span className={styles.tooltipText}>Excluded Keyword</span>
                          </div>
                       )
                   ))}
               </div>
           </div>
       </div>
          }
            <div className={styles.formatFreq}>
            <div className={commonClasses.toggleContainer}>
          <div className={commonClasses.filterHeading}>Maturity</div>
          <div className={styles.toggle_container}>
            <ToggleBtn isTrue={isMaturity}/>
          </div>
        </div>
        <div className={commonClasses.filter}>
        <div className='flex justify-between items-center gap-[var(--spacing-sm)]'>
          <div className={commonClasses.filterHeading}>Branded Event</div>
          <div className={styles.toggle_container}>
           <ToggleBtn isTrue={brandSeries}/>
          </div>
                  </div>
                  <div className="gap-3 grid grid-cols-2">
                        {isBranded && 
                                <label style={{ display: "flex" }} >
                                    <input

                                        className={styles.text}
                                        type="checkbox"
                                        // onChange={() => onChange()}
                                        checked={true}
                                        disabled
                                    />
                                    <span className="text-xs text-[var(--secondary-text-color)] p-1">Brand</span>
                                </label>
                          }
                          {eventSeries && 
                                <label style={{ display: "flex" }} >
                                    <input

                                        className={styles.text}
                                        type="checkbox"
                                        // onChange={() => onChange()}
                                        checked={true}
                                        disabled
                                    />
                                    <span className="text-xs text-[var(--secondary-text-color)] p-1">Series</span>
                                </label>
                          }
                    </div>
        </div>
        <div className={commonClasses.toggleContainer}>
          <div className={commonClasses.filterHeading}>Forecasted Status
            </div>
                <div className={styles.toggle_container}>
                    <ToggleBtn isTrue={forecastedStatus}/>
                </div>
        </div>
        <div className={commonClasses.filter}>
                  <div className='flex justify-between items-center'>
                    <div className={commonClasses.filterHeading}>Event Frequency</div>
                    <ToggleBtn isTrue={isFreqToggle}/>
                  </div>
                    <div className="gap-3 grid grid-cols-2">
                        {freq?.map((item: string, id: number) => (
                            <>
                                <label style={{ display: "flex" }} >
                                    <input

                                        className={styles.text}
                                        type="checkbox"
                                        // onChange={() => onChange()}
                                        checked={true}
                                        disabled
                                    />
                                    <span className="text-xs text-[var(--secondary-text-color)] p-1">{item}</span>
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
