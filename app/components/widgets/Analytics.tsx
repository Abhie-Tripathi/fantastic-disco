import React from 'react'
import Styles from './analytics.module.css'
import TrackerChart from './TrackerChart'
import Calendar from '/public/vector.svg'
import Image from 'next/image'


type PromotedEvent = {
  name: string;
  startDate: string; // You may want to use Date type if the dates are parsed as Date objects
  endDate: string; // You may want to use Date type if the dates are parsed as Date objects
};
interface AnalyticsProps {
  promotedEvents: PromotedEvent[]
}

const Analytics = ({ promotedEvents }: AnalyticsProps) => {
  return (
    <div className={Styles.analytics}>
      <div className={Styles.analyticsLeft}>
        <div style={{ paddingLeft: "20px" }} className={Styles.eventType}>Widget Analytics</div>
        <TrackerChart />
      </div>
      <div className={Styles.analyticsRight}>
        <div style={{ paddingLeft: "20px" }} className={Styles.eventType}>Promoted events</div>
        {promotedEvents.map((event, key) => (
          <div className={Styles.rightContent}>
            <div className={Styles.rightFirst}>
              <div className={Styles.rtitle}>{event.name}</div>
              <div className={Styles.eventAnalytics}>
                <div style={{ display: "flex" }}><Image src={Calendar} alt="calendar" /></div>
                <div className={Styles.date}>{event.startDate}</div>
                <div>-</div>
                <div className={Styles.date}>{event.endDate}</div>
              </div>
            </div>
            <div className={Styles.analyticLine}></div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Analytics
