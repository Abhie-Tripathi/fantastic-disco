import React, { useState, useRef, RefObject, useEffect } from "react";
import Image from "next/image";
import YourEventCard from "./YourEventCard";
import styles from "./internal.style.module.css";
import TimelineItem from "@/app/components/employee/listView/TimelineItem";
import CloseIcon from "/public/internal/cross.svg";
import { useTheme } from "@/context";
import { eventDataType } from "../../../types/coordinateEventType";
import Loading from "../UI/Loading";
import useInfiniteScroll from "@/utils/useInfiniteScroll";
import SearchBar from "./searchBar/SearchBar";
import DateRangeSelector from "@/components/search/dateRange";
import UpvoteSelector from "@/components/coordinate/upvote";
import InterestStatusSelector from "@/components/coordinate/interestStatus";
import InterestTypeSelector from "@/components/coordinate/interestType";
import { useCoordinateService } from "@/services/coordinateService";
import { useSearchParams } from "next/navigation";
import { useFilterState } from "@/hooks/useFilterState";
import { number } from "zod";

interface Props {
  handleModal: (id: string, enquiryId: string) => void;
  handleShortlistModal: (eventId: string, enquiryId: string) => void;
  cardUpdated: boolean;
  modalOpen: boolean;
  setStatusChanged?: (status: boolean) => void;
  statusChanged?: boolean;
  selectedId?: string;
  setSelectedId: any;
}
const Internal = ({
  handleModal,
  handleShortlistModal,
  cardUpdated,
  modalOpen,
  setSelectedId,
  setStatusChanged,
  statusChanged,
  selectedId,
}: Props) => {
  const searchParams = useSearchParams();
  const coordinateService = useCoordinateService();

  let prevDate: any = null;
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [eventData1, setEventData1] = useState<eventDataType[]>([]);
  const [page, setPage] = useState(0);
  const divRef: RefObject<HTMLDivElement> = useRef(null);
  const [noMoreData, setNoMoreData] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [coordinateCount, setCoordinateCount] = useState<any>();
  const [searchInput, setSearchInput] = useState("");
  const [eventId, setEventId] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [eventSearchLoader, setEventSearchLoader] = useState<boolean>(false);
  const [filterChanged, setFilterChanged] = useState(false);

  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);

  const { setFilter, deleteFilter } = useFilterState();
  const handleScrollEnd = () => {
    setTimeout(() => {
      if (!noMoreData) setPage((prevPage) => prevPage + 1);
    }, 1000);
  };

  const handleSearchChange = (event: any) => {
    setSearchInput(event.target.value);
  };

  useEffect(() => {
    const getCordinateList = async () => {
      try {
        const data = await coordinateService.getParticipentCount();
        setCoordinateCount(data);
      } catch (error) {
        console.error("Error while fetching cordinate list:", error);
      } finally {
        // setIsLoading(false);
      }
    };
    getCordinateList();
  }, []);

  const fetchData = async () => {
    console.log("fetching data... page=", page);

    if (page > 0) {
      let apiUrl = "";
      try {
        let offset: number = (page - 1) * 10;
        const apiData = await coordinateService.getEventsWithSearchParams({
          offset,
          searchParams,
        });
        if (apiData?.enquiryData) {
          if (apiData.enquiryData.length === 0 && page === 1) {
            setEventData1([]);
          }
          if (page == 1) {
            setEventData1(apiData.enquiryData);
          } else if (page > 1) {
            setEventData1((prevData) => [...prevData, ...apiData.enquiryData]);
          }
          if (apiData.enquiryData.length < 10) {
            setNoMoreData(true);
          }
        }
        setFilterChanged(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoaded(true);
      }
    }
  };

  useEffect(() => {
    if (page == 1) fetchData();
    else setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardUpdated]);
  useInfiniteScroll(divRef, handleScrollEnd);
  useEffect(() => {
    if (statusChanged === true) {
      const updatedData = eventData1.map((item) => {
        return item.eventId === selectedId
          ? { ...item, enquiryStatus: "Shortlisted" }
          : item;
      });

      setEventData1(updatedData);
      setSelectedId("");
      if (setStatusChanged) setStatusChanged(false);
    }
  }, [statusChanged]);

  useEffect(() => {
    setPage(1);
    setFiltersChanged((prev) => !prev);
  }, [searchParams]);

  useEffect(() => {
    if (page > 0) {
      setNoMoreData(false);
      fetchData();
      setFilterChanged(true);
    }
  }, [page, eventId, filtersChanged]);
  if (!isLoaded) {
    return (
      <div style={{ padding: "50px" }}>
        <Loading />
      </div>
    );
  } else if (isLoaded && coordinateCount[0]?.totalEvent === 0) {
    return (
      <div className={styles.noData}>
        An effective event communication and relationship management dashboard
        that keeps your team on the same page and makes coordination both
        internally and with events team easy and manageable.
      </div>
    );
  }
  const handleSelect = (id: number, name: string) => {
    setSearchInput(name);
    setEventId(id.toString());
    setShowSuggestion(true);
    setFilter("eventId", id.toString());
    console.log(id, name, 'selected item');
    
  };
  return (
    <>
      <div className={styles.scrollContainer} ref={divRef}>
        {/* <div className={styles.scrollContainer} ref={divRef} style={{height:popoverState?"auto":"calc(100vh - 80px)"}}> */}
        <div className={styles.container}>
          <div className={styles.countsContainer}>
            <div className={styles.exhibitorCount}>
              <div className={styles.count}>
                {coordinateCount && coordinateCount[1]?.count}
              </div>
              <div className={styles.countTitle}>Exhibit</div>
            </div>
            <div className={styles.exhibitorCount}>
              <div className={styles.count}>
                {coordinateCount && coordinateCount[2]?.count}
              </div>
              <div className={styles.countTitle}>Sponsor</div>
            </div>
            <div className={styles.exhibitorCount}>
              <div className={styles.count}>
                {coordinateCount && coordinateCount[3]?.count}
              </div>
              <div className={styles.countTitle}>Speak</div>
            </div>
            <div className={styles.exhibitorCount}>
              <div className={styles.count}>
                {coordinateCount && coordinateCount[4]?.count}
              </div>
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
                <span className={`${styles.search_logo} h-[10px] w-[10px]`}>
                  {eventSearchLoader && searchInput.length > 0 ? (
                    <div className={styles.loader}></div>
                  ) : searchInput.length > 0 ? (
                    <Image
                      src={CloseIcon}
                      alt="close"
                      className={iconClass}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSearchInput("");
                        setEventId("");
                        deleteFilter('eventId')
                      }}
                    />
                  ) : (
                    ""
                  )}
                </span>
              </div>
              {
                <SearchBar
                  searchInput={searchInput}
                  setEventSearchLoader={setEventSearchLoader}
                  handleSelect={handleSelect}
                  endpoint={"userInterest/enquiry/suggestion"}
                />
              }
            </div>

            <div style={{ width: "15%" }} className={styles.outerDiv}>
              <InterestTypeSelector />
            </div>

            <div style={{ width: "15%" }} className={styles.outerDiv}>
              <InterestStatusSelector />
            </div>

            <div style={{ width: "30%" }} className={styles.outerDiv}>
              <DateRangeSelector source="coordinate" />
            </div>

            <div style={{ width: "15%" }} className={styles.outerDiv}>
              <UpvoteSelector />
            </div>
          </div>

          <div className={styles.timelineContainer}>
            {eventData1?.map((item, index) => {
              // Check if current event's date is different from previous event's date
              const showDate = item.startDate !== prevDate;
              // Update previous date
              prevDate = item.startDate;
              return (
                <>
                  <div key={index} className={styles.timeline}>
                    <TimelineItem
                      eventDate={showDate ? item.startDate : null}
                    />
                    <YourEventCard
                      eventId={item.eventId}
                      setSelectedId={setSelectedId}
                      filterChanged={filterChanged}
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
                </>
              );
            })}
          </div>
          {noMoreData ? (
            eventData1?.length === 0 ? (
              <div style={{ textAlign: "center" }}>
                No results containing all your search terms were found.
              </div>
            ) : (
              <></>
            )
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
};

export default Internal;
