'use client'
import React from 'react'
import styles from './page.style.module.css'
import Overview from '@/app/components/TemplateViewsNew/Events/Manage/Overview/Overview'
import { useEventContext } from '@/context/eventcontext';

const Page = () => {
    const { eventId, fetchedEvent, setAddEventModal, setDeleteModal, setDeleteModalTwo } = useEventContext();
    const handleDeleteModal = () => {
        if (fetchedEvent?.widgetTags && fetchedEvent?.widgetTags.length > 0) {
            setDeleteModalTwo(true)
        } else {
            setDeleteModal(true)
        }
    }
    return (
        <div className={styles.body}>
            <Overview waitlist={fetchedEvent?.waitlisting} approval={fetchedEvent?.approval} capacity={fetchedEvent?.capacity} registration={fetchedEvent?.registration} isPresentinWidget={fetchedEvent?.widgetTags && fetchedEvent?.widgetTags.length > 0 ? true : false} setDeleteModal={setDeleteModal} setDeleteModalTwo={setDeleteModalTwo} participationType={fetchedEvent?.participationType} setAddEventModal={setAddEventModal} eventId={eventId} imageUrl={fetchedEvent?.logoUrl} eventName={fetchedEvent?.name} startDate={fetchedEvent?.startDate} endDate={fetchedEvent?.endDate} startTime={fetchedEvent?.startTime} endTime={fetchedEvent?.endTime} hashtags={fetchedEvent?.customizationData.hashtags} timeZone={fetchedEvent?.gmtZone} pageBgColor={fetchedEvent?.customizationData.pageBgColor} pageGradient={fetchedEvent?.customizationData.pageGradient} leavesTheme={fetchedEvent?.customizationData.leavesTheme} confettiType={fetchedEvent?.customizationData.confettiType} eventFont={fetchedEvent?.customizationData.eventFont} locationCountry={fetchedEvent?.cityName} locationCity={fetchedEvent?.countryName} />
            <div className={styles.deleteContainer}>
                <div className={styles.heading}>Cancel Event</div>
                <div className={styles.subheading}>Cancel and permanently delete this event. This operation cannot be undone.</div>
                <button onClick={handleDeleteModal}><span>x</span>Cancel Event</button>
            </div>
        </div>
    )
}

export default Page