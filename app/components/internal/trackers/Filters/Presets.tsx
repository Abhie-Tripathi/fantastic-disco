import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import styles from "./filters.style.module.css";
import Competitor from "/public/competitor.svg";
import Keywords from "/public/keywords.svg";
import Speaking from "/public/speaking.svg";
import Template from "/public/template.svg";
import { useTrackerServices } from '@/services/trackerServices';
import { MagnifyingGlass } from "geist-icons";
import Loading from "@/app/components/UI/Loading";
import { PresetJsonData } from "@/types/coordinateEventType";
import { PresetData } from '@/types/trackers';
import CategorySelector from "@/components/search/categorySelector";
import SortDropdown from "./presetFilters/sortDropdown";
import AudienceSpreadSelector from "@/components/search/advancedFilters/audienceSpread"
import { useFilterContext } from "@/context/filterContext";

interface Props {
  template: any;
  handlePresetClick: any;
}

const Presets = ({ template, handlePresetClick }: Props) => {
  const [presetTemplateData, setPresetTemplateData] = useState<PresetData[]>([]);
  const {getLocalFilterValue, localFilters}=useFilterContext();
  const { presetData } = useTrackerServices();
  const [inputValue, setInputValue] = useState<string>("");
  // const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [debouncedInputValue, setDebouncedInputValue] = useState<string>("");
  const [sortBy, setSortBy] = useState({ value: "eventCount", label: "desc" });
  const [page, setPage] = useState(0);
  const [limit, setLimit]= useState(10)
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [filterChanged, setFilterChanged] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [totalCount,setTotalCount]=useState(0);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const sortOptions = [
    { value: "eventCount", label: "Event Count" },
    // { value: "newEventCount", label: "New Event Count" },
    // { value: "start", label: "Rank" },
  ];
  const selectedLocation = useMemo(() =>
    getLocalFilterValue("presetCountry")?.split(',').filter(Boolean) || [],
    [localFilters.presetCountry]
  );
  const selectedCategory = useMemo(() =>
    getLocalFilterValue("presetCategory")?.split(',').filter(Boolean) || [],
    [localFilters.presetCategory]
  );
  
  // Fetch data function with pagination
  const fetchPresetJson = useCallback(async () => {
    if (!hasMore || isLoading) return;
  
    setIsLoading(true);
    
    try {
      const data = {
        trackerType: template?.name || "",
        offset: filterChanged ? 0 : page * limit,
        limit: limit,
        ...(sortBy.value === "eventCount" ? { sortAs: sortBy.label } : {}),
        ...(sortBy.value === "newEventCount" ? { sortBy: sortBy.value } : {}),
        ...(debouncedInputValue ? { keywords: debouncedInputValue } : {}),
        ...(selectedLocation.length ? { countryIds: selectedLocation.join(",") } : {}),
        ...(selectedCategory.length ? { categorySlugs: selectedCategory.join(",") } : {}),
      };
  
      const result = await presetData(data);
      setTotalCount(result.count);
      if (result?.count > 0) {
        setPresetTemplateData((prev) => [...prev, ...result.trackers]);
  
        if (result.trackers.length < limit) {
          setHasMore(false); // No more results
        }
      } else {
        setHasMore(false);
      }
      setFilterChanged(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedInputValue, selectedLocation, selectedCategory, template, sortBy, hasMore, isLoading, presetData]);
  

  // Reset pagination when filters change
  useEffect(() => {
    setPresetTemplateData([]);
    setPage(0);
    setFilterChanged(true);
    setHasMore(true);
  }, [debouncedInputValue, selectedLocation, selectedCategory, template, sortBy]);
  

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!loadingRef.current || !hasMore) return;
  
    const currentRef = loadingRef.current;
  
    const observerInstance = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: containerRef.current,
        rootMargin: "20px",
        threshold: 1.0,
      }
    );
  
    observerInstance.observe(currentRef);
  
    return () => {
      if (currentRef) observerInstance.unobserve(currentRef);
    };
  }, [hasMore, isLoading, filterChanged]);
  
  

  // Fetch data when page or filters change
  useEffect(() => {
    fetchPresetJson();
  }, [page]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 500); // 500ms debounce delay
    
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue]);
  
  return (
    <div>
      <div className="flex justify-center gap-2 items-center font-semibold">
        <span className="text-lg">Get Started with Pre-sets</span>
        <span className="text-xs bg-[var(--primary-color)] text-white py-[3px] px-2 rounded-full">
          {totalCount}
        </span>
      </div>
      
      <div className="flex justify-center items-center gap-2 mt-6 mx-auto w-[95%]">
        <div className="w-[100%]">
          <div className="border border-input rounded px-3 py-2 flex items-center gap-2">
            <MagnifyingGlass color="#9CA3AF" width="18px" height="18px" />
            <input
              value={inputValue}
              onChange={handleInputChange}
              className="outline-none w-full bg-transparent"
              placeholder="Search by Pre-sets name, Country or Category"
            />
          </div>
        </div>
        {/* <div className="w-[20%]">
        <AudienceSpreadSelector source="preset"/>
        </div>
        <div className="w-[20%]">
          <CategorySelector source="preset"/>
        </div>
        <div className="h-[42px]">
          <SortDropdown 
            sortOptions={sortOptions} 
            sortBy={sortBy} 
            setSortBy={setSortBy}
          />
        </div> */}
      </div>

      <div
        className="max-h-[calc(100vh-260px)] overflow-y-auto mt-6"
        ref={containerRef}
      >
        <div className={styles.presetContainer}>
          {presetTemplateData.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-full p-2 gap-3 flex items-center flex-col h-[280px] text-sm border border-[var(--border-color)] rounded-[12px] overflow-y-auto"
              // onClick={
              //   item.enabled
              //     ? () => handlePresetClick(item, item.id, item.url, item.trackerName)
              //     : undefined
              // }
              onClick={() => handlePresetClick(item, item.id, item.trackerType[0], item.name)}
              style={{cursor: "pointer"}}
            >
              <div className="w-full flex items-center h-[45%] rounded-md bg-[var(--tabs-background-color)] relative">
                <div className={styles.account}>
                  <Image
                    src={
                      item.trackerType[0] === "T_COMPETITOR"
                        ? Competitor
                        : item.trackerType[0] === "T_PRODUCT_KEYWORDS"
                        ? Keywords
                        : item.trackerType[0] === "T_SPEAKING_OPPORTUNITY"
                        ? Speaking
                        : Keywords
                    }
                    alt="people"
                  />
                </div>
                <div>
                  <Image src={Template} alt="template" />
                </div>
                {item?.totalEvent && item.totalEvent > 0 && (
                  <div className="p-1 px-2 bg-[var(--primary-light-color)] font-medium text-xs absolute bottom-0 right-0 rounded-br-md rounded-tl-md">
                    {item.totalEvent} events
                  </div>
                )}
              </div>
              <div className="w-full h-[60%] flex flex-col gap-3">
                <div className={styles.bottomViewTwo}>
                  {item?.name}
                </div>
                <div className={styles.text}>{item?.description}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Loading indicator that triggers infinite scroll */}
        <div ref={loadingRef} className="w-full">
            {isLoading && (
              <div className="flex justify-center p-5 w-full">
                <Loading />
              </div>
            )}
          </div>
          {(!isLoading && presetTemplateData.length ===0) && (
            <div className="text-center py-4 text-gray-500">
              We couldn&rsquo;t find any preset matching your filter criteria at the moment.
            </div>
          )}
      </div>
    </div>
  );
};

export default Presets;