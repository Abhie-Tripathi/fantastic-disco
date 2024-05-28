import React, { useState, useRef, RefObject, useEffect } from 'react'
import YourEventCard from './YourEventCard'
import styles from './internal.style.module.css'
import TimelineItem from '@/app/components/employee/listView/TimelineItem'
import eventData from '@/public/data/demoEvent.json'
import { eventDataType } from "../../../types/coordinateEventType";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";

interface Props{
    handleModal : (id: string) => void,
    handleShortlistModal: (eventId: string, enquiryId: string) => void;
    cardUpdated: boolean;
}

const Internal = ({handleModal, handleShortlistModal, cardUpdated} : Props) => {
    let prevDate: any = null;

    const [eventData1, setEventData1] = useState<eventDataType[]>([]);
    const [page, setPage] = useState(0);
    const divRef: RefObject<HTMLDivElement> = useRef(null);

    const handleScrollEnd = () => {
        setTimeout(() => {
            setPage(prevPage => prevPage + 1);
        }, 1000);
    };

    const fetchData = async () => {
        console.log('fetching data... page=', page);
        if(page > 0) {
            const apiUrl = baseUrl + "/userInterest?status=PENDING&limit=10&offset=" + (page-1)*10;
            const apiData = await myFetch(apiUrl, {
                method: "GET",
                headers: headers,
            });
            if(apiData.data) {
                if(page==1){
                    setEventData1(apiData.data.enquiry);
                }else if(page>1){
                    setEventData1(prevData => [...prevData, ...apiData.data.enquiry]);
                }
            }
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
        if(page>0)
            fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        console.log('cardUpdated',cardUpdated, page);
        if(page == 1)
            fetchData();
        else 
            setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardUpdated]);

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
                    enquiryId={item.enquiryId}
                    eventName={item.name}
                    eventLocation={item.city}
                    eventImage={"https://miro.medium.com/v2/resize:fit:1400/1*nmMagIDyextUFs5J9aGnPw.jpeg"}
                    eventDate={item.startDate}
                    eventCompany={item.orgName}
                    eventDuration={item.duration}
                    userCount={item.userCount}
                    currentEnquiryStatus={item.status}
                    upvote={item.upvote}
                    enquiryActivity={item.enquiryActivity}
                    handleModal={handleModal}
                    handleShortlistModal={handleShortlistModal}
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
