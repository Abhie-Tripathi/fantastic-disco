import React, { useState, useRef, RefObject, useEffect } from 'react'
import YourEventCard from './YourEventCard'
import styles from './internal.style.module.css'
import TimelineItem from '@/app/components/employee/listView/TimelineItem'
import eventData from '@/public/data/demoEvent.json'
import { eventDataType } from "../../../types/coordinateEventType";

interface Props{
    handleModal : () => void,
    handleShortlistModal: () => void
    handleRejectClick: () => void
}

const Internal = ({handleModal, handleShortlistModal, handleRejectClick} : Props) => {
    let prevDate: any = null;

    const [eventData1, setEventData1] = useState<eventDataType[]>([]);
    const [page, setPage] = useState(1);
    const divRef: RefObject<HTMLDivElement> = useRef(null);

    const handleScrollEnd = () => {
        setPage(prevPage => prevPage + 1);
    };

    const fetchData = async () => {
        console.log('fetching data... page=', page);
        if(page==1){
            setEventData1(eventData);
        }
        else if(page>1){
            // setEventData1(prevData => [...prevData, ...eventData]);
            setEventData1(prevData => {
                const newData = eventData.filter(newEvent => {
                    return !prevData.some(prevEvent => prevEvent.id === newEvent.id);
                });
                return [...prevData, ...newData];
            });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentDiv = divRef.current;
            if (currentDiv) {
                const { scrollTop, scrollHeight, clientHeight } = currentDiv;
                if (scrollTop + clientHeight >= (scrollHeight - 2)) {
                    handleScrollEnd();
                }
            }
        };

        const currentDiv = divRef.current;
        if (currentDiv) {
            currentDiv.addEventListener('scroll', handleScroll);
        }

        return () => {
            const currentDiv = divRef.current;
            if (currentDiv) {
                currentDiv.removeEventListener('scroll', handleScroll);
            }
        };
    }, [handleScrollEnd]);

    useEffect(() => {
        // if(page>0)
            fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

  return (
    <div className={styles.scrollContainer} ref={divRef} >
    <div className={styles.container} >
    <div className={styles.timelineContainer} >
    {eventData1.map((item, index) => {
        // Check if current event's date is different from previous event's date
        const showDate = item.startDate !== prevDate;
        // Update previous date
        prevDate = item.startDate;
        return (
            <div key={index} className={styles.timeline}>
                <TimelineItem eventDate={showDate ? item.startDate : null} />
                <YourEventCard
                    eventId={item.id}
                    eventName={item.name}
                    eventCtas={item.ctas}
                    eventLocation={item.location}
                    eventImage={item.imageUrl}
                    eventDate={item.startDate}
                    eventCompany={item.company}
                    handleModal={handleModal}
                    handleShortlistModal={handleShortlistModal}
                    handleRejectClick={handleRejectClick}
                />
            </div>
        );
    })}
</div>
</div>
</div>
  )
}

export default Internal
