import React, { useState, useRef, RefObject, useEffect } from 'react'
import Image from 'next/image'
import DropDown from './commondropdown/DropDown';
import {
    Button,
    MenuTrigger,
    Popover,
  } from "react-aria-components";
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

interface Props{
    handleModal : (id: string,enquiryId:string) => void,
    handleShortlistModal: (eventId: string, enquiryId: string) => void;
    cardUpdated: boolean;
}
const Internal = ({handleModal, handleShortlistModal, cardUpdated, } : Props) => {
    let prevDate: any = null;
    const { theme } = useTheme();
    const status=["Shortlisted", "Pending"];
    const participants=["Attend", "Exhibit", "Speak", "Sponsors"];
    const iconClass = theme === "light" ? "icons_light" : "icon";
    const [eventData1, setEventData1] = useState<eventDataType[]>([]);
    const [page, setPage] = useState(0);
    const divRef: RefObject<HTMLDivElement> = useRef(null);
    const [noMoreData, setNoMoreData] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [coordinateCount,setCoordinateCount]=useState<any>();
    const [selectedStatusType, setSelectedStatusType] = useState<string[]>([]);
    const [selectedParticipantType, setSelectedParticipantType] = useState<string[]>([]);
    const [selectedStatusTypeName, setSelectedStatusTypeName] = useState<string>('');
    const [popoverState, setPopoverState] = useState<boolean | null>(null);
    const [selectedParticipantTypeName,setSelectedParticipantTypeName]=useState<string>('');
      const setMenuOpen = () => {
          if(popoverState === null) {
            setPopoverState(false);
          }else
            setPopoverState(!popoverState);
        };
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
      const [statusType,setStatusType]=useState("PENDING");
      const [participant,setParticipant]=useState("");
      useEffect(()=>{
        if(selectedParticipantType.length>0) {
            setParticipant(selectedParticipantType[selectedParticipantType.length-1].toUpperCase());
        }else{
          // setStatusType("PENDING");
          setParticipant("");
        } 
        setPage(1);
      },[selectedParticipantType])
      useEffect(()=>{
        if(selectedStatusType.length>0) {
            setStatusType(selectedStatusType[selectedStatusType.length-1].toUpperCase());
        }else{
         setStatusType("PENDING");
        }
        setPage(1);
      },[selectedStatusType])
    const fetchData = async () => {
        console.log('fetching data... page=', page);
        if(page > 0) {
            // setIsLoaded(false);
            let apiUrl="";
            try {
            apiUrl = `${baseUrl}/userInterest?status=${statusType}&limit=10&offset=${(page-1)*10}${
              participant.length > 0 ? `&interest=${participant}` : ''
          }`;
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
        if(page == 1)
            fetchData();
        else 
            setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardUpdated]);
    useEffect(()=>{
      if(page>0)
        fetchData();
    },[statusType, participant, page])
    if (!isLoaded && page <= 1) {
        return <div style={{padding: "50px"}}><Loading /></div>;
    } else if (isLoaded && coordinateCount[0]?.totalEvent=== 0 && page <= 1) {
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
            <div className={styles.countTitle}>Exhibit</div>
        </div>
        <div className={styles.exhibitorCount}>
            <div className={styles.count}>{coordinateCount && coordinateCount[2]?.count}</div>
            <div className={styles.countTitle}>Sponsors</div>
        </div>
        <div className={styles.exhibitorCount}>
            <div className={styles.count}>{coordinateCount && coordinateCount[3]?.count}</div>
            <div className={styles.countTitle}>Speak</div>
        </div>
        <div className={styles.exhibitorCount}>
            <div className={styles.count}>{coordinateCount && coordinateCount[4]?.count}</div>
            <div className={styles.countTitle}>Attend</div>
        </div>
    </div>
    <div className={styles.filters}>
        {/* <div className={styles.searchBar}>
            <input className={styles.textArea} type='text' placeholder='Search Event'/>
        </div> */}
         <MenuTrigger onOpenChange={setMenuOpen}>
                <Button className={styles.dropdown_button}>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                        Status
                        {/* {
                          selectedStatusType?.length == 1 ? (
                            <span className={styles.input_selected_title}>
                              {selectedStatusTypeName}
                            </span>
                          ) : (
                            selectedStatusType?.length > 1 ? (
                              <span className={styles.input_selected_no}>
                                {selectedStatusType.length}
                              </span>
                            ) : <></>
                          )
                        } */}
                      </div>
                      <Image
                        src={DropIcon}
                        alt="dropicon"
                        width={20}
                        height={20}
                        className={iconClass}
                      />
                    </div>
                  </div>
                </Button>
                <Popover className={styles.filterPopover}>
                  <DropDown
                    status={status}
                    state={selectedStatusType}
                    setState={setSelectedStatusType}
                    selectedEventTypeName={selectedStatusTypeName}
                    setSelectedEventTypeName={setSelectedStatusTypeName}
                  />
                </Popover>
              </MenuTrigger>
        <div className={styles.participantDropdown}>
        <MenuTrigger onOpenChange={setMenuOpen}>
                <Button className={styles.dropdown_button}>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                       Participant Type
                        {/* {
                          selectedParticipantType?.length == 1 ? (
                            <span className={styles.input_selected_title}>
                              {selectedParticipantType}
                            </span>
                          ) : (
                            selectedParticipantType?.length > 1 ? (
                              <span className={styles.input_selected_no}>
                                {selectedParticipantType.length}
                              </span>
                            ) : <></>
                          )
                        } */}
                      </div>
                      <Image
                        src={DropIcon}
                        alt="dropicon"
                        width={20}
                        height={20}
                        className={iconClass}
                      />
                    </div>
                  </div>
                </Button>
                <Popover className={styles.filterPopover}>
                  <DropDown
                    status={participants}
                    state={selectedParticipantType}
                    setState={setSelectedParticipantType}
                    selectedEventTypeName={selectedParticipantTypeName}
                    setSelectedEventTypeName={setSelectedParticipantTypeName}
                  />
                </Popover>
              </MenuTrigger>
        </div>
        <div className={styles.dateFilter}></div>
    </div>
    <div className={styles.timelineContainer} >
    {eventData1.length===0 ? <div className={styles.noData} style={{textAlign:"center"}}>No results containing all your search terms were found.</div>:
    <>
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
  </>
    }
    
</div>
    {noMoreData ? 
        <></> : <Loading />
    }
</div>
</div>
  )
}

export default Internal
