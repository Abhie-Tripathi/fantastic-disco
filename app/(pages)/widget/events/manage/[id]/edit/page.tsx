'use client'
import React from 'react'
import Overview from '@/app/components/TemplateViewsNew/Events/Manage/Overview/Overview'
import { useEventContext } from '@/context/eventcontext';

const Page = () => {
    const { eventId, fetchedEvent, setAddEventModal, setDeleteModal, setDeleteModalTwo } = useEventContext();
    return (
        <div>
            <Overview isPresentinWidget={fetchedEvent?.widgetTags && fetchedEvent?.widgetTags.length > 0 ? true : false } setDeleteModal={setDeleteModal} setDeleteModalTwo={setDeleteModalTwo} participationType = {fetchedEvent?.participationType} setAddEventModal={setAddEventModal} eventId={eventId} imageUrl={fetchedEvent?.logoUrl} eventName={fetchedEvent?.name} startDate={fetchedEvent?.startDate} endDate={fetchedEvent?.endDate} startTime={fetchedEvent?.startTime} endTime={fetchedEvent?.endTime} hashtags={fetchedEvent?.customizationData.hashtags} timeZone={fetchedEvent?.gmtZone} pageBgColor={fetchedEvent?.customizationData.pageBgColor} pageGradient={fetchedEvent?.customizationData.pageGradient} confettiType={fetchedEvent?.customizationData.confettiType} eventFont={fetchedEvent?.customizationData.eventFont} locationCountry={fetchedEvent?.cityName} locationCity={fetchedEvent?.countryName} />
        </div>
    )
}

export default Page