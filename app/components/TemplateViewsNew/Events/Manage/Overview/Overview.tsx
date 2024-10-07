import React from 'react'
import styles from './overview.style.module.css'
import EventSmallDetailView from './EventSmallDetailView'
import DateTimeContainer from '@/app/components/DetailPage/DateTimeContainer'
import LocationContainer from '@/app/components/DetailPage/LocationContainer'

interface Props {
  eventId: string;
  imageUrl?: string;
  eventName?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  hashtags?: string;
  timeZone?: string;
  pageBgColor?: string;
  eventFont?: string;
  locationCity?: string;
  locationCountry?: string;
  setAddEventModal : (value : boolean)=>void
}

const Overview = ({ eventId, imageUrl, eventName, startDate, endDate, startTime, endTime, hashtags, timeZone, pageBgColor, eventFont, locationCity, locationCountry,setAddEventModal }: Props) => {
  return (
    <div className={styles.body}>
      <div className={styles.eventDetailView}>
        <EventSmallDetailView eventId={eventId} imageUrl={imageUrl} eventName={eventName} startDate={startDate} endDate={endDate} startTime={startTime} endTime={endTime} hashtags={hashtags} timeZone={timeZone} pageBgColor={pageBgColor} eventFont={eventFont} locationCity={locationCity} locationCountry={locationCountry} />
        <div className={styles.eventDetailContainer}>
          <div className={styles.locationDateContainer}>
            <div className={styles.heading}>When & Where</div>
            <div className={styles.dateTimeContainer}><DateTimeContainer endDate={endDate || ""} startDate={startDate || ""} endTime={endTime || ""} startTime={startTime || ""} timeZone={timeZone || ""} /></div>
            <div className={styles.locationContainer}><LocationContainer eventFormat="In-Person" cityName={locationCity || ""} countryName={locationCountry || ""} /></div>
          </div>
          <div className={styles.btnContainer}>
            <button className={styles.editBtn} onClick={()=>setAddEventModal(true)}>Edit Event</button>
            <button className={styles.cancelBtn}>Cancel Event</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Overview