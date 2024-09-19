import React, { useState, useRef, RefObject, useEffect } from 'react'
import Image from 'next/image'
import YourEventCard from './YourEventCard'
import DropDown from './commondropdown/DropDown'
import styles from './internal.style.module.css'
import TimelineItem from '@/app/components/employee/listView/TimelineItem'
import { convertToCustomFormat, convertToYYYYMMDD } from "@/utils/dateFormat";
import CloseIcon from "/public/internal/cross.svg";
import DateRange from "@/app/components/dropdown/DateRange";
import {
    Button,
    MenuTrigger,
    Popover,
  } from "react-aria-components";
import DropIcon from "/public/internal/drop_down_angle.svg";
import eventData from '@/public/data/demoEvent.json'
import { useTheme } from '@/context'
import { eventDataType } from "../../../types/coordinateEventType";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import Loading from '../UI/Loading'
import useInfiniteScroll from '@/utils/useInfiniteScroll'
import SearchBar from './searchBar/SearchBar'

interface Props{
    handleModal : (id: string,enquiryId:string) => void,
    handleShortlistModal: (eventId: string, enquiryId: string) => void;
    cardUpdated: boolean;
    modalOpen:boolean;
}
const Internal = ({handleModal, handleShortlistModal, cardUpdated, modalOpen } : Props) => {
   const buttonRef = useRef(null);
    let prevDate: any = null;
    const { theme } = useTheme();
    const iconClass = theme === "light" ? "icons_light" : "icon";
    const [eventData1, setEventData1] = useState<eventDataType[]>([]);
    const [page, setPage] = useState(0);
    const divRef: RefObject<HTMLDivElement> = useRef(null);
    const [noMoreData, setNoMoreData] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [coordinateCount,setCoordinateCount]=useState<any>();
    const [selectedStatusType, setSelectedStatusType] = useState<string[]>(["Pending"]);
    const [selectedDateRange, setSelectedDateRange] = useState<any[]>([]);
    const [selectedParticipantType, setSelectedParticipantType] = useState<string[]>([]);
    const [selectedStatusTypeName, setSelectedStatusTypeName] = useState<string>('');
    const [popoverState, setPopoverState] = useState<boolean | null>(false);
    const [selectedParticipantTypeName,setSelectedParticipantTypeName]=useState<string>('');
    const status=["Pending", "Shortlisted" ];
    const participants=["Exhibitor", "Sponsor", "Speaker", "Attendee"];
    const [participant,setParticipant]=useState("");
    const [statusType,setStatusType]=useState("IN_DISCUSSION");
    const [duration,setDuration]=useState<string>('');
    const [searchInput, setSearchInput] = useState("");
    const [eventId,setEventId]=useState("");
    const [showSuggestion,setShowSuggestion]=useState(false);
    const [eventSearchLoader, setEventSearchLoader] = useState<boolean>(false);
    const handleScrollEnd = () => {
      setTimeout(() => {
          if(!noMoreData) setPage(prevPage => prevPage + 1);
      }, 1000);
  };
    
    const setMenuOpen = () => {
        setPopoverState(!popoverState);
    };
      useEffect(() => {
        const modalStatus = document.body.getAttribute("popover-status");
    
        if (modalStatus && modalStatus == "close") {
          document.body.setAttribute("popover-status", "open");
          document.documentElement.style.overflow = "";
          document.documentElement.style.paddingRight = "";
        } else {
          document.body.setAttribute("popover-status", "close");
        }
        return () => {
          document.body.removeAttribute("your-attribute");
        };
      }, [popoverState]); 
      useEffect(()=>{
        console.log(selectedParticipantType);
        if(selectedParticipantType.length>0) {
            setParticipant(selectedParticipantType[selectedParticipantType.length-1].toUpperCase());
        }else{
          // setStatusType("PENDING");
          setParticipant("");
        } 
        setPage(1);
      },[selectedParticipantType])
      const handleSearchChange = (event: any) => {
        setSearchInput(event.target.value);
      };
      useEffect(() => {
        if (selectedDateRange.length === 2) {
            setDuration([
                new Date(selectedDateRange[0]).toISOString().split("T")[0],
                new Date(selectedDateRange[1]).toISOString().split("T")[0],
            ].join(","));
            setPage(1); 
        } else {
            setDuration("");
            setPage(1); 
        }
    }, [selectedDateRange]);
      useEffect(()=>{
        if(selectedStatusType.length>0) {
          
          if(selectedStatusType[0]==="Pending") setStatusType("IN_DISCUSSION");
           else  setStatusType(selectedStatusType[selectedStatusType.length-1].toUpperCase());
            // console.log(selectedStatusType[selectedStatusType.length-1].toUpperCase());
            
        }else{
         setStatusType("IN_DISCUSSION");
        }
        setPage(1);
      },[selectedStatusType])
      const dateShowFormatter = (selectedDateRange: string[]) => {
        const [sdDay, sdMonth, sdYear] = convertToCustomFormat(
          selectedDateRange[0]
        ).split(" ");
        const [edDay, edMonth, edYear] = convertToCustomFormat(
          selectedDateRange[1]
        ).split(" ");
      
        if (sdMonth === edMonth && sdYear === edYear) {
          return `${sdDay} - ${edDay} ${sdMonth} ${sdYear}`;
        }
        if (sdYear === edYear) {
          return `${sdDay} ${sdMonth} - ${edDay} ${edMonth} ${sdYear}`;
        }
        return `${sdDay} ${sdMonth} ${sdYear} - ${edDay} ${edMonth} ${edYear}`;
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
            let apiUrl="";
            try {
            apiUrl = `${baseUrl}/userInterest/enquiry?status=${statusType}&limit=10&offset=${(page - 1) * 10}` +
            (participant.length > 0 ? `&interest=${participant.toUpperCase()}` : '') +
            (selectedDateRange.length === 2 ? `&duration=${duration}` : '') +
            `&source=internal`+(eventId ? `&eventId=${eventId}` : '');
            const apiData = await myFetch(apiUrl, {
                method: "GET",
                headers: headers,
            });
            if(apiData.data) {
                if(apiData.data.enquiryData.length===0 && page===1){
                    setEventData1([]);
                }
                if(page==1){
                    setEventData1(apiData.data.enquiryData);
                }else if(page>1){
                    setEventData1(prevData => [...prevData, ...apiData.data.enquiryData]);
                }
                if(apiData.data.enquiryData.length < 10){
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
    if(page == 1)
        fetchData();
    else 
        setPage(1);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [cardUpdated]);
console.log(modalOpen);
useInfiniteScroll(divRef, handleScrollEnd);
useEffect(()=>{
  if(page>0){
    setNoMoreData(false);
    fetchData();
    
  }
},[statusType, participant, page, duration, eventId])
 if(!isLoaded){
  return <div style={{padding: "50px"}}><Loading /></div>;
} else if (isLoaded && coordinateCount[0]?.totalEvent=== 0) {
    return (
        <div className={styles.noData}>
            An effective event communication and relationship management dashboard that keeps your team on the same page and makes coordination both internally and with events team easy and manageable.
        </div>
    );
}
 const handleSelect=(id: number, name: string)=>{
    setSearchInput(name);
    setEventId(id.toString());
    setShowSuggestion(true);
 }
  return (
    <>
    <div className={styles.scrollContainer} ref={divRef} style={{ overflow: popoverState?"hidden":"auto"}}>
    {/* <div className={styles.scrollContainer} ref={divRef} style={{height:popoverState?"auto":"calc(100vh - 80px)"}}> */}
    <div className={styles.container} >
    <div className={styles.countsContainer}>
        <div className={styles.exhibitorCount}>
            <div className={styles.count}>{coordinateCount && coordinateCount[1]?.count}</div>
            <div className={styles.countTitle}>Exhibit</div>
        </div>
        <div className={styles.exhibitorCount}>
            <div className={styles.count}>{coordinateCount && coordinateCount[2]?.count}</div>
            <div className={styles.countTitle}>Sponsor</div>
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
    <div className={styles.searchContainer}>
          <div className={styles.searchbar}>
            <input
            type="text"
          placeholder="Search by event name"
          onChange={handleSearchChange}
          value={searchInput}
            />
            <span className={styles.search_logo}>
            {(eventSearchLoader && searchInput.length>0 )? (
  <div className={styles.loader}></div>
) : (
  searchInput.length > 0 ? (
    <Image src={CloseIcon} alt="close" className={iconClass} style={{cursor:"pointer"}} onClick={()=>{setSearchInput(""); setEventId("")}} />
  ) : (
    ""
  )
)}
              
            </span>
          </div>
          {
           <SearchBar searchInput={searchInput} setEventSearchLoader={setEventSearchLoader} handleSelect={handleSelect} endpoint={'userInterest/enquiry/suggestion'}/>
          }
        </div>
          <div style={{width:"19%"}} className={styles.outerDiv}>
         <MenuTrigger onOpenChange={setMenuOpen}>
                <Button className={styles.dropdown_button}>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                        Status
                        <span className={styles.input_selected_title}>
                       {selectedStatusType[0]}
                            </span>
                      </div>
                      <Image
                        src={DropIcon}
                        alt="dropicon"
                        width={12}
                        height={12}
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
          </div>
        <div style={{width:"19%"}} className={styles.outerDiv}>
        <MenuTrigger onOpenChange={setMenuOpen}>
                <Button className={styles.dropdown_button}>
                  <div className={styles.input_container}>
                    <div className={styles.input}>
                      <div className={styles.input_title}>
                       Type
                       <span className={styles.input_selected_title}>
                       {selectedParticipantType[0]==='Attendee'?"Attend":selectedParticipantType[0]==='Exhibitor'?"Exhibit":selectedParticipantType[0]==="Speaker"? "Speak": selectedParticipantType[0]==='Sponsor'?"Sponsor":""}
                       </span>
                      </div>
                      <Image
                        src={DropIcon}
                        alt="dropicon"
                        width={12}
                        height={12}
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
        <div style={{width:"22%"}} className={styles.outerDiv}>
        <MenuTrigger onOpenChange={setMenuOpen} >
              <Button ref={buttonRef} className={styles.dropdown_button}>
                <div className={styles.input_container}>
                  <div className={styles.input}>
                    <div className={styles.input_title}>
                      Dates
                      {selectedDateRange.length > 0 &&
                        selectedDateRange[0] !== null ? (
                        <span className={styles.input_selected_title}>
                          {dateShowFormatter(selectedDateRange)}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <Image
                      src={DropIcon}
                      alt="dropicon"
                      width={12}
                      height={12}
                      className={iconClass}
                    />
                  </div>
                </div>
              </Button>
              <Popover
              className={styles.filterPopover}
              placement="left"
              style={{marginTop:"70px"}}
              >
                <DateRange
                  state={selectedDateRange}
                  setState={setSelectedDateRange}
                />
              </Popover>
            </MenuTrigger>
            </div>
    </div>
    
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
                    eventId={item.eventId}
                    isDateSame={showDate}
                    enquiryId={item.enquiryId}
                    eventName={item.eventName}
                    eventLocation={item.eventCity}
                    eventCountry={item.eventCountry}
                    eventImage={item?.logo}
                    eventStartDate={item.startDate}
                    eventEndDate={item.endDate}
                    eventCompany={item.orgName}
                    eventDuration={item.duration}
                    userCount={item.userCount}
                    currentEnquiryStatus={item.enquiryStatus}
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
        (eventData1.length===0?<div style={{textAlign:"center"}}>No results containing all your search terms were found.</div>:<></>) : <Loading />
    }
</div>
</div>
</>
  )
}

export default Internal