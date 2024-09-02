import React, { useState, useRef, RefObject, useEffect } from 'react'
import Image from 'next/image'
import YourEventCard from './YourEventCard'
import Search from '/public/search.svg'
import styles from './internal.style.module.css'
import TimelineItem from '@/app/components/employee/listView/TimelineItem'
import DropIcon from "/public/downArrow.svg";
import eventData from '@/public/data/demoEvent.json'
import { useTheme } from '@/context'
import { eventDataType } from "../../../types/coordinateEventType";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import Loading from '../UI/Loading'
import useInfiniteScroll from '@/utils/useInfiniteScroll'

interface Props{
    handleModal : (id: string,enquiryId:string) => void,
    handleShortlistModal: (eventId: string, enquiryId: string) => void;
    cardUpdated: boolean;
}
const Internal = ({handleModal, handleShortlistModal, cardUpdated, } : Props) => {
    let prevDate: any = null;
    const { theme } = useTheme();
    const iconClass = theme === "light" ? "icons_light" : "icon";
    const [eventData1, setEventData1] = useState<eventDataType[]>([]);
    const [page, setPage] = useState(0);
    const divRef: RefObject<HTMLDivElement> = useRef(null);
    const [noMoreData, setNoMoreData] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [coordinateCount,setCoordinateCount]=useState<any>();
    const handleScrollEnd = () => {
        setTimeout(() => {
            if(!noMoreData) setPage(prevPage => prevPage + 1);
        }, 1000);
    };
    useEffect(() => {
        const getCordinateList = async () => {
          try {
            const data = await myFetch(`${baseUrl}/userInterest/totalParticipent`);
            setCoordinateCount(data?.data);
          } catch (error) {
            console.error("Error while fetching cordinate list:", error);
          } finally {
            // setIsLoading(false);
          }
        };
        getCordinateList();
      }, []);
    const fetchData = async () => {
        console.log('fetching data... page=', page);
        if(page > 0) {
            setIsLoaded(false);
            try {
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
                if(apiData.data.enquiry.length < 10){
                    setNoMoreData(true);}
            }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoaded(true);
            }
        }
    };

    /*
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
    */
   const scroller = useInfiniteScroll(divRef, handleScrollEnd);

    useEffect(() => {
        if(page>0)
            fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        if(page == 1)
            fetchData();
        else 
            setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardUpdated]);

    if (!isLoaded && page <= 1) {
        return <div style={{padding: "50px"}}><Loading /></div>;
    } else if (isLoaded && eventData1.length == 0 && page <= 1) {
        return (
            <div className={styles.noData}>
                An effective event communication and relationship management dashboard that keeps your team on the same page and makes coordination both internally and with events team easy and manageable.
            </div>
        );
    }
    
  return (
    <div className={styles.scrollContainer} ref={divRef} >
    <div className={styles.container} >
    <div className={styles.countsContainer}>
        <div className={styles.exhibitorCount}>
            <div className={styles.count}>{coordinateCount && coordinateCount[1]?.count}</div>
            <div className={styles.countTitle}>Exhibitors</div>
        </div>
        <div className={styles.exhibitorCount}>
            <div className={styles.count}>{coordinateCount && coordinateCount[2]?.count}</div>
            <div className={styles.countTitle}>Sponsors</div>
        </div>
        <div className={styles.exhibitorCount}>
            <div className={styles.count}>{coordinateCount && coordinateCount[3]?.count}</div>
            <div className={styles.countTitle}>Speakers</div>
        </div>
        <div className={styles.exhibitorCount}>
            <div className={styles.count}>{coordinateCount && coordinateCount[4]?.count}</div>
            <div className={styles.countTitle}>Attendee</div>
        </div>
    </div>
    {/* <div className={styles.filters}>
        <div className={styles.searchBar}>
            <input className={styles.textArea} type='text' placeholder='Search Event'/>
        </div>
        <div className={styles.statusDropdown}>
            <div>Status</div>
            <Image
                        src={DropIcon}
                        alt="dropicon"
                        width={20}
                        height={20}
                        className={iconClass}
                      />
        </div>
        <div className={styles.participantDropdown}></div>
        <div className={styles.dateFilter}></div>
    </div> */}
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
                    isDateSame={showDate}
                    enquiryId={item.enquiryId}
                    eventName={item.name}
                    eventLocation={item.city}
                    eventCountry={item.country}
                    eventImage={item?.logo}
                    eventStartDate={item.startDate}
                    eventEndDate={item.endDate}
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
    {noMoreData ? 
        <></> : <Loading />
    }
</div>
</div>
  )
}

export default Internal