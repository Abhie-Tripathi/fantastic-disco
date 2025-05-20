import React, {
  useState,
  useRef,
  RefObject,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import YourEventCard from "./YourEventCard";
import styles from "./internal.style.module.css";
import TimelineItem from "@/app/components/employee/listView/TimelineItem";
import { useAuthContext } from "@/context";
import { enquiryType } from "../../../types/coordinateEventType";
import Loading from "../UI/Loading";
import useInfiniteScroll from "@/utils/useInfiniteScroll";
import SearchBar from "@/components/coordinate/enquirySearchBar";
import DateRangeSelector from "@/components/search/dateRange";
import UpvoteSelector from "@/components/coordinate/upvote";
import InterestStatusSelector from "@/components/coordinate/interestStatus";
import InterestTypeSelector from "@/components/coordinate/interestType";
import { useCoordinateService } from "@/services/coordinateService";
import { useRouter, useSearchParams } from "next/navigation";
import NullState from "../trackers/nullState";
import coordinateNullState from "/public/coordinateNullState.svg";
import { Filter, Loader2, Pencil } from "lucide-react";
import { GAEvent } from "@/utils/GAEvent";
import EventDetail from "./eventdetail/EventDetail";
import ShortlistModal from "./eventdetail/shortlistModal";
import AddEventModal from "@/components/coordinate/addEvent/AddEventModal";
// import { isEventeli } from "@/config";
import { Button } from "@/components/ui/button";
import CoordinateFilters from "@/components/coordinate/CoordinateFilters";
import { Badge } from "@/components/ui/badge";
import { useFilterContext } from "@/context/filterContext";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface Props {
  coordinateActions: any;
  pipelineConfig: any;
}
const Internal = ({ coordinateActions, pipelineConfig }: Props) => {
  const searchParams = useSearchParams();
  const coordinateService = useCoordinateService();

  const { isTentimesUser } = useAuthContext();

  const isMobile = useIsMobile();

  const { localFilters, applyFilters } = useFilterContext();

  let prevDate: any = null;
  const [eventData1, setEventData1] = useState<enquiryType[]>([]);
  const [page, setPage] = useState(0);
  const divRef: RefObject<HTMLDivElement> = useRef(null);
  const [noMoreData, setNoMoreData] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [coordinateCount, setCoordinateCount] = useState<any>([]);
  const [totalCount, setTotalCount] = useState<number>();
  // const [searchInput, setSearchInput] = useState("");
  // const [showSuggestion, setShowSuggestion] = useState(false);
  // const [eventSearchLoader, setEventSearchLoader] = useState<boolean>(false);

  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);
  const router = useRouter();

  const [selectedId, setSelectedId] = useState("");
  const [statusChanged, setStatusChanged] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [shortlistModalData, setShortlistModalData] = useState({});
  const [singleEventId, setSingleEventId] = useState<string>("");
  const [currentEnquiry, setCurrentEnquiry] = useState<enquiryType>();
  const [enquiryId, setEnquiryId] = useState<string>("");
  const [showFilters, setShowFilter] = useState<boolean>(!isMobile);
  const [eventCount, setEventCount] = useState<number>(0);
  const [countLoading, setCountLoading] = useState<boolean>(false);

  const handleModal = (eventId: string, enquiryId: string) => {
    setModalOpen(!modalOpen);
    setSingleEventId(eventId);
    setEnquiryId(enquiryId);
    setCurrentEnquiry(eventData1.find((item) => item.eventId === eventId));
  };

  const handleShortlistModal = (eventId: string, enquiryId: string = "") => {
    setEnquiryId(enquiryId);
    if (eventId && eventId != "") fetchInterestData(eventId, enquiryId);
    else setShortlistModalOpen(!shortlistModalOpen);
  };

  const fetchInterestData = async (eventId: string, enquiryId: string) => {
    try {
      const apiData: any = await coordinateService.getInterestedUsers(
        eventId,
        enquiryId
      );
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

  // const { setFilter, deleteFilter } = useFilterState();
  const handleScrollEnd = () => {
    setTimeout(() => {
      if (!noMoreData && !(showFilters && isMobile))
        setPage((prevPage) => prevPage + 1);
    }, 1000);
  };

  // const handleSearchChange = (event: any) => {
  //   setSearchInput(event.target.value);
  // };

  const getCordinateList = async () => {
    try {
      const data = await coordinateService.getParticipentCount();
      setCoordinateCount(
        coordinateActions.map((item: any) => {
          const statusKey = item.status.toLowerCase();
          return { ...item, count: data?.count[statusKey] };
        })
      );
      setTotalCount(data?.count?.totalEnquiries);
    } catch (error) {
      console.error("Error while fetching cordinate list:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    if (coordinateActions?.length > 0) getCordinateList();
  }, [coordinateActions]);

  const fetchData = async () => {
    if (page > 0) {
      try {
        setCountLoading(true);
        let offset: number = (page - 1) * 10;
        const apiData = await coordinateService.getEventsWithSearchParams({
          offset,
          searchParams: new URLSearchParams(searchParams.toString()),
        });
        if (apiData?.enquiries) {
          setEventCount(apiData.count);
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
        setCountLoading(false);
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
      return item.eventId === eventId ? { ...item, status: status } : item;
    });
    setEventData1(updatedData);
  };

  // const handleSelect = (id: number, name: string) => {
  //   setSearchInput(name);
  //   setShowSuggestion(true);
  //   setFilter("eventId", id.toString());
  //   GAEvent(
  //     "Coordinate",
  //     "Filter",
  //     "Coordinate",
  //     "Coordinate | Event | Auto Applied"
  //   );
  // };

  const handleEditAction = () => {
    GAEvent(
      "Coordinate",
      "Customize Action",
      "Coordinate",
      "Coordinate | Top Card | Edit Icon"
    );
    router.push("/internal/settings/product");
  };

  const toggleFilterHandler = () => {
    if (showFilters) {
      setShowFilter(false);
    } else {
      setShowFilter(true);
    }
  };

  const searchHandler = useCallback(() => {
    applyFilters({ resetPage: true });
  }, []);

  const filterCount = useMemo(() => {
    const includeFilters = ["eventId", "type", "upvotedBy", "status"];
    return Object.keys(localFilters).filter((key) =>
      includeFilters.includes(key)
    ).length;
  }, [localFilters]);

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
    return <Loading className="p-12" />;
  } else if (isLoaded && totalCount === 0) {
    return (
      <div className="p-20">
        <NullState
          image={coordinateNullState}
          title="You haven't shortlisted any events yet."
          text="Browse through our upcoming events and shortlist here for easy access and internal coordination later."
          buttonText="Search Events"
          buttonUrl={`/internal/search/events`}
        />
      </div>
    );
  }

  return (
    <>
      <div
        className="h-[calc(100vh-80px)] overflow-y-auto relative w-full"
        ref={divRef}
      >
        {/* <div className={styles.scrollContainer} ref={divRef} style={{height:popoverState?"auto":"calc(100vh - 80px)"}}> */}
        <div className="flex flex-col w-full gap-4 md:gap-6 px-4 py-3 md:px-10 md:py-5">
          <div className="gap-4 lg:gap-10 justify-between md:mx-[80px] grid grid-cols-4">
            {coordinateCount &&
              coordinateCount.map((item: any, index: number) => (
                <div
                  className="flex flex-col bg-[var(--primary-light-color)] items-center px-6 py-2 lg:py-4 rounded-md md:rounded-xl text-primary justify-center"
                  key={index}
                >
                  <div className="text-base font-semibold lg:text-[56px] lg:leading-[63px]">
                    {item?.count}
                  </div>
                  <div
                    className="flex items-end cursor-pointer hover:underline relative group"
                    onClick={handleEditAction}
                  >
                    {item.label}
                    <div
                      className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 p-1 rounded absolute -right-7"
                      onClick={handleEditAction}
                      title="Edit"
                    >
                      <Pencil width="14px" height="14px" />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div
            className={`flex flex-col gap-4 sticky top-[117px] md:top-0  bg-background z-10 shadow-[0_1px_4px_-2px_rgba(21,34,50,0.078)] transition-padding duration-200 py-3 pt-4`}
          >
            <div className="block md:hidden">
              <SearchBar selectedData={eventData1[0]} />
            </div>
            <div className={`flex justify-between items-center md:mx-[80px]`}>
              <div className="flex items-center gap-2">
                {countLoading ? (
                  <Loader2 className="animate-spin text-primary" />
                ) : (
                  <Badge className="bg-primary text-white">
                    {new Intl.NumberFormat("en", {
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(eventCount || 0)}
                  </Badge>
                )}
                <p className="text-primary font-semibold">Events</p>
              </div>

              <div className="flex items-center justify-end gap-3">
                {isTentimesUser && <AddEventModal />}

                <Button
                  onClick={toggleFilterHandler}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 border relative"
                >
                  <Filter className="w-4 h-4" />
                  {filterCount > 0 && (
                    <span className="absolute top-[-12px] right-[-12px] bg-primary text-[10px] font-medium text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5 border-2 border-white">
                      {filterCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {showFilters && (
              <>
                {/* Mobile Filters View */}
                <div className={`block md:hidden`}>
                  <CoordinateFilters
                    type={"companies"}
                    filterCount={filterCount}
                    createTrackerHandler={() => {}}
                    searchHandler={searchHandler}
                    coordinateActions={coordinateActions}
                    pipelineConfig={pipelineConfig}
                  />
                </div>

                {/* Destop Filters View */}
                <div className={`hidden md:flex gap-4 items-end md:mx-[80px]`}>
                  <div className="hidden md:block w-[50%]">
                    <SearchBar selectedData={eventData1[0]} />
                  </div>

                  <div style={{ width: "15%" }} className={styles.outerDiv}>
                    <InterestTypeSelector
                      coordinateActions={coordinateActions}
                    />
                  </div>

                  <div style={{ width: "20%" }} className={styles.outerDiv}>
                    <InterestStatusSelector pipelineConfig={pipelineConfig} />
                  </div>

                  <div style={{ width: "20%" }} className={styles.outerDiv}>
                    <DateRangeSelector source="coordinate" />
                  </div>

                  <div style={{ width: "15%" }} className={styles.outerDiv}>
                    <UpvoteSelector />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={showFilters && isMobile ? "hidden" : "block"}>
            <div>
              {eventData1?.map((item, index) => {
                // Check if current event's date is different from previous event's date
                const showDate = item.eventData.startDateTime !== prevDate;
                // Update previous date
                prevDate = item.eventData.startDateTime;
                return (
                  <div key={item.eventId} className={styles.timeline}>
                    <TimelineItem
                      eventDate={showDate ? item.eventData.startDateTime : null}
                    />
                    <YourEventCard
                      eventId={item.eventId}
                      eventData={item.eventData}
                      setSelectedId={setSelectedId}
                      enquiryId={item.id}
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
      </div>

      {modalOpen && (
        <div className={`${styles.modal} px-5`}>
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
            modalContent={currentEnquiry}
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
