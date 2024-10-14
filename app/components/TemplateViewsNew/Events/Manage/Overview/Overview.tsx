import React from 'react'
import styles from './overview.style.module.css'
import EventSmallDetailView from './EventSmallDetailView'
import DateTimeContainer from '@/app/components/DetailPage/DateTimeContainer'
import LocationContainer from '@/app/components/DetailPage/LocationContainer'
import ShareButtons from '@/app/components/DetailPage/ShareButtons'

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
  pageGradient? : string;
  confettiType? : string;
  eventFont?: string;
  locationCity?: string;
  locationCountry?: string;
  participationType?: string;
  isPresentinWidget? : boolean;
  setAddEventModal: (value: boolean) => void
  setDeleteModal : (value: boolean) => void;
  setDeleteModalTwo : (value: boolean) => void;
}

const Overview = ({ eventId, imageUrl, eventName, startDate, endDate, startTime, endTime, hashtags, timeZone, pageBgColor,pageGradient,confettiType, eventFont, locationCity, locationCountry, setAddEventModal, participationType, setDeleteModal, setDeleteModalTwo,isPresentinWidget }: Props) => {
  const console_url = process.env.NEXT_PUBLIC_CONSOLE_PAGE_DOMAIN

  const handleDeleteModal = () => {
    if (isPresentinWidget) {
        setDeleteModalTwo(true)
    } else {
        setDeleteModal(true)
    }
}

  return (
    <div className={styles.body}>
      <div className={styles.eventDetailView}>
        <div className={styles.viewShareContainer}>
          <EventSmallDetailView participationType={participationType} eventId={eventId} imageUrl={imageUrl} eventName={eventName} startDate={startDate} endDate={endDate} startTime={startTime} endTime={endTime} hashtags={hashtags} timeZone={timeZone} pageBgColor={pageBgColor} pageGradient={pageGradient} confettiType={confettiType} eventFont={eventFont} locationCity={locationCity} locationCountry={locationCountry} />
          <div className={styles.shareContainer}>
            <div className={styles.shareHeading}>Share</div>
            <ShareButtons disabled={false} shareUrl={`${console_url}/detailpage/${eventId}`}/>
          </div>
        </div>

        <div className={styles.eventDetailContainer}>
          <div className={styles.locationDateContainer}>
            <div className={styles.heading}>When & Where</div>
            <div className={styles.dateTimeContainer}><DateTimeContainer endDate={endDate || ""} startDate={startDate || ""} endTime={endTime || ""} startTime={startTime || ""} timeZone={timeZone || ""} /></div>
            <div className={styles.locationContainer}><LocationContainer eventFormat="In-Person" cityName={locationCity || ""} countryName={locationCountry || ""} /></div>
          </div>
          <div className={styles.btnContainer}>
            <button className={styles.editBtn} onClick={() => setAddEventModal(true)}>Edit Event</button>
            <button className={styles.cancelBtn} onClick={handleDeleteModal}>Cancel Event</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview