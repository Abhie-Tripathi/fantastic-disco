import React from 'react'
import Styles from './analytics.style.module.css'
import TrackerChart from './TrackerChart'
import Calendar from '../../icons/vector.svg'
const Analytics = () => {
  return (
    <div className={Styles.analytics}>
      <div className={Styles.analyticsLeft}>
        <div style={{paddingLeft:"20px"}} className={Styles.eventType}>Widget Analytics</div>
        <TrackerChart/>
      </div>
      <div className={Styles.analyticsRight}>
        <div style={{paddingLeft:"20px"}} className={Styles.eventType}>Promoted events</div>
        <div className={Styles.rightContent}>
            <div className={Styles.rightFirst}>
                <div className={Styles.rtitle}>Sydney Royal Easter show</div>
                <div className={Styles.rsubTitle}>Royal Agricultural Society of NSW</div>
                <div className={Styles.eventAnalytics}>
                <div style={{display:"flex"}}><img src={Calendar} alt="calendar"/></div>
                <div className={Styles.date}>1st Apr 2024</div>
                <div>-</div>
                <div className={Styles.date}>30th Apr 2024</div>      
                </div>
                <div className={Styles.analyticLine}></div>
            </div>
            <div className={Styles.rightFirst}>
                <div className={Styles.rtitle}>National Restaurant Association Show</div>
                <div className={Styles.rsubTitle}>Restaurant</div>
                <div className={Styles.eventAnalytics}>
                <div style={{display:"flex"}}><img src={Calendar} alt="calendar"/></div>
                <div className={Styles.date}>1st Apr 2024</div>
                <div>-</div>
                <div className={Styles.date}>30th Apr 2024</div>      
                </div>
                <div className={Styles.analyticLine}></div>
            </div>
            <div className={Styles.rightFirst}>
                <div className={Styles.rtitle}>University of Illinois At Chicago - Spring Graduation</div>
                <div className={Styles.rsubTitle}>Chicago</div>
                <div className={Styles.eventAnalytics}>
                <div style={{display:"flex"}}><img src={Calendar} alt="calendar"/></div>
                <div className={Styles.date}>1st Apr 2024</div>
                <div>-</div>
                <div className={Styles.date}>30th Apr 2024</div>      
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
