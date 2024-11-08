import React from 'react'
import styles from './intel.style.module.css'
import ToggleBtn from '../../UI/ToggleBtn'
const index = ({internationalScore,inboundScore, exhibitScore, audienceZone, audienceSpread, audienceSpreadCount, audienceProfile}:any) => {
    const format = ["Hybrid", "In-person", "Virtual", "Offline"]
    const freq=["Annual","Biannual","Queartly"]
    const entry=["Free","Paid","Invites","Member Access"];
    const rank=["Country Rank","Category Rank"];
    const key=["Tags","Airport","Animal","Sea","Arson","Cruise","National","Shows"];
    const rate=['2-3','3-4'];
    const score=['1,000-2,000','5,000-10,000'];
    const commonClasses={
      filter:`flex flex-col gap-[var(--spacing-sm)] p-3 border border-[var(--border-color)] rounded-[var(--border-radius-sm)]`,
      filterHeading:`text-[var(--primary-color)] font-medium`,
      toggleContainer:`p-[12px] border border-[var(--border-color)] flex justify-between items-center gap-[var(--spacing-sm)] rounded-[var(--border-radius-sm)]`,
    }
    return (
        <div className="flex flex-col gap-3">
           <div className="grid grid-cols-2 gap-3" >
        <div className={commonClasses.toggleContainer}>
          <div className={commonClasses.filterHeading}>
            Audience Quality Score
          </div>
          <ToggleBtn isTrue={false}/>
        </div>
        <div className={commonClasses.toggleContainer}>
          <div className={commonClasses.filterHeading}>
          Exhibitor Quality Score
          </div>
          <ToggleBtn isTrue={false}/>
        </div>
        <div className={commonClasses.toggleContainer}>
          <div className={commonClasses.filterHeading}>
          Audience Profile
          </div>
          <ToggleBtn isTrue={audienceProfile}/>
        </div>
        <div className={commonClasses.toggleContainer}>
          <div className={commonClasses.filterHeading}>
          Audience Zone
          </div>
          <ToggleBtn isTrue={audienceZone}/>
        </div>
        <div className={commonClasses.toggleContainer}>
          <div className={commonClasses.filterHeading} style={{display:"flex", gap:"4px"}}>
          Audience Spread
            {audienceSpreadCount > 0 &&
              <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white">{audienceSpreadCount}</span>
            }
          </div>
          {/* <div className={styles.toggle_container}>
            <ToggleBtn isTrue={audienceSpread}/>
          </div> */}
        </div>
                
            </div>
        </div>
  )
}

export default index

