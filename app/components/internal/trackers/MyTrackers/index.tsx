import React, { useState, useEffect, useRef } from "react";
import styles from "./myTrackers.style.module.css";
import Trackers from ".././AllTrackers";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { useTrackerServices } from "@/services/trackerServices";
import { Tracker } from "@/types/trackers";
import Loading from "@/app/components/UI/Loading";
import { AllTrackerTypes } from "@/types/trackers";
import { useFilterState } from "@/hooks/useFilterState";
import { PaginationComponent } from "@/components/pagination";
import { useSearchParams } from "next/navigation";
import { useTrackerContext } from "@/context/tracker";
import { Search } from "lucide-react";
import {
  MagnifyingGlass,
 
} from "geist-icons";
import SortDropdown from "@/components/search/sortDropdown";
interface MyTrackersProps {
  searchValue:string;
  dataPresent: boolean;
  setDataPresent: React.Dispatch<React.SetStateAction<boolean>>;
  singleTrackerData: Tracker | undefined;
  setSingleTrackerData: React.Dispatch<React.SetStateAction<Tracker | undefined>>;
  isData: boolean;
  trackerId: string;
  setSearchValue:any;
  hideTemplates: any;
}
const Index = ({setDataPresent, dataPresent, isData, setSingleTrackerData, singleTrackerData, trackerId, hideTemplates, setSearchValue}:MyTrackersProps) => {
  const [trackerType, setTrackerType] = useState("All Trackers");
  const [isInetialRender,setIsInetialRender]=useState(false);
  const [allTracker, setAllTracker] = useState<AllTrackerTypes[]>([]);
  const {setFilter, getFilterValue, setMultipleFilters}=useFilterState();
  const {setSkip, skip:w, searchValue} = useTrackerContext();
  const skip = w || 0;
  const take =Number(getFilterValue("take")) || 4;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [trackerPerPage, setTrackerPerPage] = useState(4);
  const [page, setPage] = useState( Math.floor(Number(w || "0") / 4) + 1);
  const searchParams = useSearchParams();
  const [totalPage, setTotalPage] = useState<number>(0);
  const [totalCount,setTotalCount]=useState(0);
  const [loadOne,setLoadOne]=useState(false);
  const [loadTwo,setLoadTwo]=useState(false);
  const {getTrackers, isLoading}=useTrackerServices();
  const endOfListRef = useRef(null);
    const handlePageChange = (page: number) => {
    setPage(page);
    setSkip(((page-1) * trackerPerPage));
    setMultipleFilters({
      skip:((page-1) * trackerPerPage).toString(),
      id:allTracker[0].id,
      q: searchValue
    })
   
    // setFilter("skip", ((page-1) * trackerPerPage).toString());
  };
  useEffect(() => {
      if(searchValue.length === 0 || searchValue.length >= 3){
             setAllTracker([]);
             setIsInetialRender(true); 
             fetchData(true);  
             }
    }, [skip, take, searchValue]);
  useEffect(()=>{
    // if(!isInetialRender)
    if(searchValue.length >= 3 || searchValue.length === 0){
      if(isInetialRender){
          setSkip('0');
          setPage(1);
      }
      setMultipleFilters({
        skip: !isInetialRender? ((page-1) * trackerPerPage).toString(): "",
        q: searchValue,
        id: trackerId,
      })
  }
  },[searchValue])
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const fetchData=async(isInetialRender:boolean)=>{
    setLoadOne(true);
    const result= await getTrackers(`${searchValue && `name=${searchValue}`}&offset=${skip}&limit=${take}&type=trackers&refresh=true`);
    
    if(result && isMounted.current){
      console.log(result);
      setDataPresent(true);
        setAllTracker(result?.trackers);   
            
      setSingleTrackerData(result.trackers[0]);
      setMultipleFilters({ 
          skip: skip,
          q: searchValue,
          id: result?.trackers[0]?.id,
        })
    setTotalPage(Math.ceil(result.count / trackerPerPage));
    setTotalCount(result.count)
    if(result.count===0){
      console.log(result.count);
      
      setSingleTrackerData(undefined);
       setDataPresent(false);
    }
    setLoading(false);
    setLoadOne(false);
            }
  }
  useEffect(()=>{
    if(totalPage>0){
    setDataPresent(true);
  }
  },[totalPage])
  const [openSearchBar,setOpenSearchBar]=useState(false);
  console.log(allTracker);
  
  return (
    <div className={styles.container} ref={endOfListRef}>
      <div className={styles.containerLeft}>
        {/* <div className={styles.leftContainer}>
          <div className={`${styles.heading} ${trackerType === "All Trackers" ? styles.active : ""}`} onClick={() => setTrackerType("All Trackers")}>
            <AllTrackers fillColor={trackerType === "All Trackers" ? "#6750A4" : "#696B83"} /> All Trackers
          </div>
          <div
            className={`${styles.heading} ${
              trackerType === "Custom Trackers" ? styles.active : ""
            }`}
            onClick={() => setTrackerType("Custom Trackers")}
          >
            <CustomeTracker
              fillColor={
                trackerType === "Custom Trackers" ? "#6750A4" : "#696B83"
              }
            />{" "}
            Custom Trackers
          </div>
          <div className={`${styles.heading} ${trackerType === "Premium Trackers" ? styles.active : ""}`} onClick={() => setTrackerType("Premium Trackers")}>
            <PremiumTracker fillColor={trackerType === "Premium Trackers" ? "#6750A4" : "#696B83"} /> Premium Trackers
          </div>       
           </div> */}
      </div>
          
        <div>
        <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2 pt-4 pl-6 pb-4">
              <div className="font-medium">Trackers</div>
              <span className="bg-[#E6E6F9] rounded-full font-medium w-7 h-7 flex items-center justify-center text-sm" style={{ color: "var(--primary-color)" }}>
               {totalCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
            <Button variant="default" onClick={()=>hideTemplates(false)}>Create</Button>
            <Button variant="outline" onClick={()=>setOpenSearchBar(!openSearchBar)}>
            <Search width={16} height={16} />
            </Button>
            </div>
          </div>
          <div
  className={`transition-all duration-300 ease-in-out overflow-hidden ${
    openSearchBar
      ? "max-h-20 opacity-100 scale-y-100 bg-white"
      : "max-h-0 opacity-0 scale-y-95 bg-white absolute"
  }`}
>
  <div className="border border-gray-300 rounded px-3 py-2 flex items-center gap-2 mx-6 mb-3">
    <MagnifyingGlass color="#9CA3AF" width="18px" height="18px" />
    <input
      className="outline-none w-full bg-transparent"
      placeholder="Enter tracker name"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    />
  </div>
</div>
        <div className={`${
    openSearchBar?"h-[calc(100vh-307px)]": "h-[calc(100vh-252px)]"} overflow-auto pl-6 pr-5 flex flex-col gap-[var(--spacing-md)]`}>
          {(allTracker.length===0 && !loadOne) &&
            <div className="flex justify-center text-[var(--secondary-text-color)] font-semibold">Tracker with the search result is not created yet.</div>
          }
          {/* {error && <div>{error}</div>} */}
          {allTracker.length > 0 &&
            (trackerType === "All Trackers" ||
              trackerType === "Custom Trackers") &&
            allTracker.map((item, id) => <Trackers key={id} item={item} setSingleTrackerData={setSingleTrackerData} singleTrackerData={singleTrackerData}/>)}
          {loadOne &&  <div className={`${styles.loadingContainer} loadingIndicator`}>
          <div className={styles.loadingBar}></div>
        </div>}
            <div
              className="flex item-center justify-center"
            >
              {totalCount!==0 &&
              <div className="sticky bottom-0 bg-background py-4">
              <PaginationComponent currentPage={page} totalPages={totalPage} itemsPerPage={trackerPerPage} onPageChange={handlePageChange} count={totalCount} showEntriesCount={false}/>
              </div>
              }
            </div>
          {/* )} */}
          </div>
          </div>
    </div>
  );
};
export default Index;