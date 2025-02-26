import React, { useState, useRef, RefObject, useEffect } from "react";
import Image from "next/image";
import YourEventCard from "./YourEventCard";
import styles from "./internal.style.module.css";
import TimelineItem from "@/app/components/employee/listView/TimelineItem";
import CloseIcon from "/public/internal/cross.svg";
import { useTheme } from "@/context";
import { enquiryType, eventDataType } from "../../../types/coordinateEventType";
import Loading from "../UI/Loading";
import useInfiniteScroll from "@/utils/useInfiniteScroll";
// import SearchBar from "./searchBar/SearchBar";
import SearchBar from "@/components/coordinate/enquirySearchBar";
import DateRangeSelector from "@/components/search/dateRange";
import UpvoteSelector from "@/components/coordinate/upvote";
import InterestStatusSelector from "@/components/coordinate/interestStatus";
import InterestTypeSelector from "@/components/coordinate/interestType";
import { useCoordinateService } from "@/services/coordinateService";
import { useRouter, useSearchParams } from "next/navigation";
import { useFilterState } from "@/hooks/useFilterState";
import NullState from "../trackers/nullState";
import coordinateNullState from "/public/coordinateNullState.svg"
import { Pencil } from "lucide-react";
import { GAEvent } from "@/utils/GAEvent";
import EventDetail from "./eventdetail/EventDetail";
import ShortlistModal from "./eventdetail/shortlistModal";
import { endpoints } from "@/config/endpoints";

interface Props {
  coordinateActions: any;
  pipelineConfig: any;
}
const Internal = ({
  coordinateActions,
  pipelineConfig,
}: Props) => {
  const searchParams = useSearchParams();
  const coordinateService = useCoordinateService();

  let prevDate: any = null;
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [eventData1, setEventData1] = useState<enquiryType[]>([]);
  const [page, setPage] = useState(0);
  const divRef: RefObject<HTMLDivElement> = useRef(null);
  const [noMoreData, setNoMoreData] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [coordinateCount, setCoordinateCount] = useState<any>([]);
  const [totalCount, setTotalCount] = useState<number>();
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [eventSearchLoader, setEventSearchLoader] = useState<boolean>(false);

  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);
  const router = useRouter();
  
  const [selectedId,setSelectedId]=useState("");
  const [statusChanged,setStatusChanged]=useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [shortlistModalData, setShortlistModalData] = useState({});
  const [singleEventId, setSingleEventId] = useState<string>("");
  const [enquiryId, setEnquiryId] = useState<string>("");

  const handleModal = (eventId: string, enquiryId: string) => {
    setModalOpen(!modalOpen);
    setSingleEventId(eventId);
    setEnquiryId(enquiryId);
  };

  const handleShortlistModal = (eventId: string, enquiryId: string = "") => {
    setEnquiryId(enquiryId);
    if (eventId && eventId != "") fetchInterestData(eventId, enquiryId);
    else setShortlistModalOpen(!shortlistModalOpen);
  };

  const fetchInterestData = async (eventId: string, enquiryId: string) => {
    try {
      const apiData: any = await coordinateService.getInterestedUsers(eventId, enquiryId);
      if (apiData) {
        apiData.eventId = eventId;
        apiData.enquiryId = enquiryId;
        setShortlistModalData(apiData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setShortlistModalOpen(!shortlistModalOpen);
    }
  };

  const { setFilter, deleteFilter } = useFilterState();
  const handleScrollEnd = () => {
    setTimeout(() => {
      if (!noMoreData) setPage((prevPage) => prevPage + 1);
    }, 1000);
  };

  const handleSearchChange = (event: any) => {
    setSearchInput(event.target.value);
  };

  const getCordinateList = async () => {
    try {
      const data = await coordinateService.getParticipentCount();
      setCoordinateCount(coordinateActions.map((item: any) => {
        const statusKey = item.status.toLowerCase();
        return { ...item, count: data?.count[statusKey] };
      }));
      setTotalCount(data?.count?.totalEnquiries);
    } catch (error) {
      console.error("Error while fetching cordinate list:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    if (coordinateActions?.length > 0)
      getCordinateList();
  }, [coordinateActions]);

  const fetchData = async () => {
    if (page > 0) {
      try {
        let offset: number = (page - 1) * 10;
        const apiData = await coordinateService.getEventsWithSearchParams({
          offset,
          searchParams,
        });
        if (apiData?.enquiries) {
          if (apiData.enquiries.length === 0 && page === 1) {
            setEventData1([]);
          }
          if (page == 1) {
            setEventData1(apiData.enquiries);
          } else if (page > 1) {
            setEventData1((prevData) => [...prevData, ...apiData.enquiries]);
          }
          if (apiData.enquiries.length < 10) {
            setNoMoreData(true);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoaded(true);
      }
    }
  };

  // useEffect(() => {
  //   if (page == 1) fetchData();
  //   else setPage(1);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cardUpdated]);
  useInfiniteScroll(divRef, handleScrollEnd);
  useEffect(() => {
    if (statusChanged === true) {
      const updatedData = eventData1.map((item) => {
        return item.eventId === selectedId
          ? { ...item, status: pipelineConfig?.[1]?.status }
          : item;
      });

      setEventData1(updatedData);
      setSelectedId("");
      if (setStatusChanged) setStatusChanged(false);
    }
  }, [statusChanged]);

  const enquiryStatusUpdate = (eventId: string, status: string) => {    
    const updatedData = eventData1.map((item) => {
      return item.eventId === eventId
        ? { ...item, enquiryStatus: status }
        : item;
    });
    setEventData1(updatedData);
  }

  const handleSelect = (id: number, name: string) => {
    setSearchInput(name);
    setShowSuggestion(true);
    setFilter("eventId", id.toString());
    GAEvent("Coordinate", "Filter", "Coordinate", "Coordinate | Event | Auto Applied");
  };

  const handleEditAction = () => {
    GAEvent("Coordinate", "Customize Action", "Coordinate", "Coordinate | Top Card | Edit Icon");
    router.push("/internal/settings/product");
  }

  useEffect(() => {
    setPage(1);
    setFiltersChanged((prev) => !prev);
  }, [searchParams]);

  useEffect(() => {
    if (page > 0) {
      setNoMoreData(false);
      fetchData();
      GAEvent("Coordinate", "Pagination", "Coordinate", `Coordinate | ${page}`);
    }
  }, [page, filtersChanged]);
  if (!isLoaded) {
    return (
      <Loading className="p-12" />
    );
  } 
  else if (isLoaded && totalCount === 0) {
    return (
      <div className="p-20">
        <NullState image={coordinateNullState}  title="You haven't shortlisted any events yet." text="Browse through our upcoming events and shortlist here for easy access and internal coordination later." buttonText="Search Events" buttonUrl={`/internal/search/events`} />
      </div>
    );
  }

  return (
    <>
      <div className={styles.scrollContainer} ref={divRef}>
        {/* <div className={styles.scrollContainer} ref={divRef} style={{height:popoverState?"auto":"calc(100vh - 80px)"}}> */}
        <div className={styles.container}>
          <div className={styles.countsContainer}>
            {coordinateCount && coordinateCount.map((item: any, index: number) => (
              <div className={`${styles.exhibitorCount}`} key={index}>
                <div className={styles.count}>
                  {item?.count}
                </div>
                <div className="flex items-end cursor-pointer hover:underline relative group" onClick={handleEditAction}>
                  {item.label}
                    <div className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 p-1 rounded absolute -right-7" onClick={handleEditAction} title="Edit">
                      <Pencil width="14px" height="14px" />
                    </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.filters}>
            {/* <div className={styles.searchContainer}>
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
                  endpoint={endpoints.coordinate.enquiry}
                />
              }
            </div> */}

            <div className="w-1/2">
              <SearchBar selectedData={eventData1[0]} />
            </div>

            <div style={{ width: "15%" }} className={styles.outerDiv}>
              <InterestTypeSelector coordinateActions={coordinateActions} />
            </div>

            <div style={{ width: "15%" }} className={styles.outerDiv}>
              <InterestStatusSelector pipelineConfig={pipelineConfig} />
            </div>

            <div style={{ width: "25%" }} className={styles.outerDiv}>
              <DateRangeSelector source="coordinate" />
            </div>

            <div style={{ width: "15%" }} className={styles.outerDiv}>
              <UpvoteSelector />
            </div>
          </div>

          <div className={styles.timelineContainer}>
            {eventData1?.map((item, index) => {
              // Check if current event's date is different from previous event's date
              const showDate = item.eventData.startDate !== prevDate;
              // Update previous date
              prevDate = item.eventData.startDate;
              return (
                  <div key={item.eventId} className={styles.timeline}>
                    <TimelineItem
                      eventDate={showDate ? item.eventData.startDate : null}
                    />
                    <YourEventCard
                      eventId={item.eventId}
                      setSelectedId={setSelectedId}
                      isDateSame={showDate}
                      enquiryId={item.id}
                      eventName={item.eventData.name}
                      eventLocation={item.eventData.location.cityName}
                      eventCountry={item.eventData.location.countryName}
                      eventImage={item.eventData.logoUrl}
                      eventStartDate={item.eventData.startDate}
                      eventEndDate={item.eventData.endDate}
                      eventCompany={item.eventData.organizerName}
                      currentEnquiryStatus={item.status}
                      upvote={item.activityCount} // upvote activity data
                      enquiryActivity={item.myActivity}
                      coordinateActions={coordinateActions}
                      pipelineConfig={pipelineConfig}
                      handleModal={handleModal}
                      handleShortlistModal={handleShortlistModal}
                      enquiryStatusUpdate={enquiryStatusUpdate}
                    />
                  </div>
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

      {modalOpen && (
        <div
          className={`${styles.modal} px-5`}
        >
          <EventDetail
            openEventDetails={true}
            openEventRequest={false}
            openOrganiserDetails={false}
            openPocDetails={false}
            closeBtn={true}
            handleModal={handleModal}
            eventId={singleEventId}
            enquiryId={enquiryId}
            coordinateActions={coordinateActions}
          />
        </div>
      )}

      {shortlistModalOpen && (
        <div>
          <ShortlistModal
            enquiryId={enquiryId}
            setStatusChanged={setStatusChanged}
            handleShortlistModal={handleShortlistModal}
            shortlistModalData={shortlistModalData}
            coordinateActions={coordinateActions}
            // handleRefresh={handleRefresh}
            pipelineConfig={pipelineConfig}
          />
        </div>
      )}

    </>
  );
};

export default Internal;
