import React, { useEffect, useState, useRef, RefObject } from "react";
import Image from "next/image";
import styles from "./shortlistem.style.module.css";
import Link from 'next/link';
import { enquiryType } from "../../../types/outreachEnquiryTypes";

function getLocation(cityName: string | null = null, countryName: string | null = null): string {
    let eventLocation: string = '';

    if (cityName !== null && countryName !== null) {
        if (cityName === countryName) {
            eventLocation = cityName;
        } else {
            eventLocation = `${cityName}, ${countryName}`;
        }
    } else {
        if (cityName !== null) {
            eventLocation = cityName;
        } else if (countryName !== null) {
            eventLocation = countryName;
        }
    }
    return eventLocation;
}

function getEventDate(startDate: string, endDate: string): string {
    let startDateObj = new Date(startDate);
    let endDateObj = new Date(endDate);
    let result: string = '';

    if (endDate === null) {
        endDateObj = startDateObj;
    }

    if (startDateObj.getFullYear() === endDateObj.getFullYear()) {
        if (startDateObj.getMonth() === endDateObj.getMonth()) {
            if (startDateObj.getDate() === endDateObj.getDate()) {
                result = startDateObj.getDate() + ' ' +
                    startDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            } else {
                result = startDateObj.getDate() + ' - ' +
                    endDateObj.getDate() + ' ' +
                    endDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            }
        } else {
            result = startDateObj.getDate() + ' ' +
                startDateObj.toLocaleDateString('en-US', { month: 'short' }) + ' - ' +
                endDateObj.getDate() + ' ' +
                endDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
    } else {
        result = startDateObj.getDate() + ' ' +
            startDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) + ' - ' +
            endDateObj.getDate() + ' ' +
            endDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return result;
}

interface ShortListedItemProps {
    key: string;
    listType: string;
    intentStatus: number;
    statusChange: boolean;
    openNotesModal: (id: number, name: string, enquiryStatus: string, item: enquiryType)  => void;
}

export default function ShortListedItem (props: ShortListedItemProps) {
    const customStyle = {
        s1: {
            marginBottom: "0.75rem",
            padding: "1.4rem",
            fontWeight: "400",
        },
        s2: {
            height: "calc(70vh - 60px)",
            overflowY: "auto",
        },
        s3: {
            marginBottom: "1rem",
        },
        s11: {
            fontSize: "12px",
            fontWeight: "300",
            marginRight: "10px",
        },
        s33:{
            color: "#3B69C3",
            fontWeight: "500",
            fontSize: "18px",
        }
    };

    const [outreachData, setOutreachData] = useState<enquiryType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const listType = props.listType;
    const listStatus = props.intentStatus;

    const [eventCount, setEventCount] = useState(0);

    const [statusChange] = [props.statusChange];

    // /* pagination

    const [page, setPage] = useState(0);
    const divRef: RefObject<HTMLDivElement> = useRef(null);
    const handleScrollEnd = () => {
        // fetchData();
        setPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentDiv = divRef.current;
            if (currentDiv) {
                const { scrollTop, scrollHeight, clientHeight } = currentDiv;
                if (scrollTop + clientHeight >= scrollHeight) {
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
    
    // */ pagination ends

    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/coordinate/outreach/getData?status=${listStatus}&page=${page}`
        );
        const apiData = await response.json();
        // const apiData = (data.data)?data.data:[];
        const finalData = (apiData.data)?apiData.data:[];
        if(finalData.length == 0) return;
        if(page==1){
            const ev_count = (apiData.overallStats) ? apiData.overallStats.totalEventCount : 0;
            setEventCount(ev_count);
            setOutreachData(finalData);
        }
        else if(page>1){
            setOutreachData(prevData => [...prevData, ...finalData]);
        }
      } catch (err) {
        console.log('ERROR:',err);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
        if(page == 1)
            fetchData();
        else 
            setPage(1);
    }, [statusChange]);

    useEffect(() => {
        if(page>0)
            fetchData();
    }, [page]);

    return (
        <>
        <div className={styles["grid-4"]} >
            <div className={`${styles['card']}`} style={customStyle.s1}>{props.listType} ({eventCount})</div>
            <div className={styles.card} style={customStyle.s3} >
                <div ref={divRef} className={`${styles["no-scroller"]} ${styles["event-card-container"]}`} >
                { !isLoading && 
                (eventCount>0) ? (outreachData.map((item: enquiryType) => (   
                    <div className={styles.itemCard} key={item.id}>
                        <div className={styles['event-name']} >
                            <Link 
                                href={`/event-analytics/${item.id}`}
                                target="_blank" >{item.name}
                            </Link>
                        </div>
                        <div className={styles['organizer-name']}>{item.organizer.name}</div>
                        <div>
                            <span className={styles['date-location']} >
                                <Image
                                    src="/location-pin.svg"
                                    alt="pin"
                                    width={14}
                                    height={14}
                                    priority
                                />&nbsp;
                                {getLocation(item.location.cityName,item.location.countryShortName)}
                            </span>
                            <span style={{float:'right'}} className={styles['date-location']} >
                                <Image
                                    src="/calendar.svg"
                                    alt="pin"
                                    width={14}
                                    height={14}
                                    priority
                                />&nbsp;
                                {getEventDate(item.startDate,item.endDate)}
                            </span>
                        </div>
                        <div className={styles['interested-tags']} >
                            { item.stats.exhibitingCount > 0 && 
                                <>
                                <span>{item.stats.exhibitingCount}&nbsp;Exhibit</span>
                                {(item.stats.sponsoringCount > 0 || item.stats.speakingCount > 0) && 
                                    <span>&nbsp;•&nbsp;</span>
                                }
                                </>
                            }
                            { item.stats.sponsoringCount > 0 && 
                                <>
                                <span> {item.stats.sponsoringCount}&nbsp;Sponsor</span>
                                {(item.stats.speakingCount > 0) && 
                                    <span>&nbsp;•&nbsp;</span>
                                }
                                </>
                            }
                            { item.stats.speakingCount > 0 && 
                                <>
                                <span> {item.stats.speakingCount}&nbsp;Speaker</span>
                                </>
                            }
                        </div>
                        <div className={styles['notes-section']}>
                            <p 
                                className={styles['notes-item']}
                                onClick={()=> props.openNotesModal(item.id, item.name, props.listType, item)}
                            >Hi! can you please let me know about my status for the following events li, Hi! can you please let me know about my status for the following events li, Hi! can you please let me know about my status for the following events li</p>
                        </div>
                        {/* <hr className={styles['divider-line']} /> */}
                    </div>        
                ))) : <></>
                }
                </div>
            </div>
        </div>
        </>
    );
}