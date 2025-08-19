"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import styles from "./filters.style.module.css";
import Competitor from "/public/competitor.svg";
import Keywords from "/public/keywords.svg";
import Speaking from "/public/speaking.svg";
import Template from "/public/template.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTrackerServices } from '@/services/trackerServices';
import { MagnifyingGlass } from "geist-icons";
import Loading from "@/app/components/UI/Loading";
import { PresetJsonData } from "@/types/coordinateEventType";
import { PresetData } from '@/types/trackers';
import CategorySelector from "@/components/search/categorySelector";
import SortDropdown from "./presetFilters/sortDropdown";
import AudienceSpreadSelector from "@/components/search/advancedFilters/audienceSpread"
import { useRouter, useSearchParams } from "next/navigation";
// import { useFilterContext } from "@/context/filterContext";
import Link from "next/link";
import { useIsMobile } from "@/hooks/useMediaQuery";
import CollectionTypeSelector from "./collectionTypeSelector";
import { Button } from "@/components/ui/button";
import { Filter, FilterX } from "lucide-react";

interface Props {
  isPublic?: boolean;
  selectedLocation?: string[];
  selectedCategory?: string[];
  template?: any;
  handlePresetClick?: (item: any, id: string, trackerType: string, name: string) => void;
  setShowTemplate?:(val:boolean)=>void;
  isFull?:boolean;
  containerRef?:any;
}

const Presets = ({ template, handlePresetClick, setShowTemplate, isPublic=false,  selectedLocation, selectedCategory, isFull, containerRef}: Props) => {
  const [presetTemplateData, setPresetTemplateData] = useState<PresetData[]>([]);
  const [showFilters,setShowFilter] = useState(false);
  const [presetCategories,setPresetCategories] = useState<string[]>([]);
  const [filterCount,setFilterCount] = useState(0);
  const { presetData } = useTrackerServices();
  const searchParams = useSearchParams();
const [initialized, setInitialized] = useState(false);
  const isMobile = useIsMobile();
  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedInputValue, setDebouncedInputValue] = useState<string>("");
  const [sortBy, setSortBy] = useState({ value: "eventCount", label: "desc" });
  const [page, setPage] = useState(0);
  const [limit, setLimit]= useState(10)
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [filterChanged, setFilterChanged] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
    const [presetCountries, setPresetCountries] = useState<string[]>([]);
    const [presetType, setPresetType] = useState<string[]>([]);
  // const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [totalCount,setTotalCount]=useState(0);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const router = useRouter();
  const sortOptions = [
    { value: "eventCount", label: "Event Count" },
    // { value: "newEventCount", label: "New Event Count" },
    // { value: "start", label: "Rank" },
  ];
  
    useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    console.log("pages are",page);
    
    setInputValue(params.get('search') || '');
    setDebouncedInputValue(params.get('search') || '');
    setPresetCountries(params.get('countryIds')?.split(',') || []);
    setPresetType(params.get('collectionType')?.split(',') || []);
    setPresetCategories(params.get("categories")?.split(",") || []);
    // setPage(Number(params.get('page')) || 0);
    setPage(0)
    // const sortValue = params.get('sort') || 'eventCount';
    // const sortOrder = params.get('order') || 'desc';
    // setSortBy({ value: sortValue, label: sortOrder });
    setInitialized(true);
  }, [searchParams]);
  // Fetch data function with pagination
 const fetchPresetJson = useCallback(
  async (pageParam = page, reset = false) => {
    console.log("pageParam",);
    
    if (!hasMore || isLoading) return;

    let collectionType: string[] = [];
    const type = searchParams.get("collectionType")?.split(",") || [];

    if (!(type.includes("people") && type.includes("prospect") && type.includes("purpose"))) {
      if (presetType.includes("people")) {
        collectionType.push("T_PEOPLE_FINDER", "T_SPEAKING_OPPORTUNITY");
      }
      if (presetType.includes("prospect")) {
        collectionType.push("T_COMPETITOR");
      }
      if (presetType.includes("purpose")) {
        collectionType.push("T_PRODUCT_KEYWORDS");
      }
    }

    const trackerType =
      collectionType.length > 0
        ? collectionType.join(",")
        : (template?.name === "T_PEOPLE_FINDER" ? "T_SPEAKING_OPPORTUNITY" : template?.name) || "";

    const data = {
      trackerType,
      offset: filterChanged ? 0 : pageParam * limit,
      limit,
      ...(sortBy.value === "eventCount" ? { sortAs: sortBy.label } : {}),
      ...(sortBy.value === "newEventCount" ? { sortBy: sortBy.value } : {}),
      ...(debouncedInputValue ? { keywords: debouncedInputValue } : {}),
      ...(presetCountries?.length ? { countryIds: presetCountries.join(",") } : {}),
      ...(presetCategories?.length ? { categorySlugs: presetCategories.join(",") } : {}),
      ...(selectedCategory?.length ? { categorySlugs: selectedCategory.join(",") } : {}),
    };

    setIsLoading(true);
    try {
      const result = await presetData(data);
      setTotalCount(result.count);

      if (result?.count > 0) {
        setPresetTemplateData(prev =>
          reset ? result.trackers : [...prev, ...result.trackers]
        );
        if (result.trackers.length < limit) setHasMore(false);
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
  },
  [page, presetType, debouncedInputValue, selectedLocation, selectedCategory, template, sortBy, hasMore, presetData, presetCategories]
);

  
 useEffect(() => {
  if (!initialized) return; 

  const params = new URLSearchParams(searchParams.toString());

  if (debouncedInputValue) {
    params.set("search", debouncedInputValue);
  } else {
    params.delete("search");
  }

  if (presetCategories?.length > 0) {
    params.set("categories", presetCategories.join(","));
  } else {
    params.delete("categories");
  }

  if (presetCountries?.length > 0) {
    params.set("countryIds", presetCountries.join(","));
  } else {
    params.delete("countryIds");
  }

  if (presetType?.length > 0) {
    params.set("collectionType", presetType.join(","));
  } else {
    params.delete("collectionType");
  }

  const newQuery = params.toString();
  const currentQuery = searchParams.toString();

  if (newQuery !== currentQuery) {
    router.replace(`?${newQuery}`, { scroll: false });
  }
  let count=0;
  if(presetType.length>0) count++;
  if(presetCategories.length>0) count++;
  if(presetCountries.length>0) count++;
  setFilterCount(count)
}, [
  initialized, 
  debouncedInputValue,
  presetCountries,
  presetType,
  presetCategories,
  searchParams,
  router
]);

  

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
  if (!initialized) return;
  setPresetTemplateData([]);
  // setPage(0);
  setFilterChanged(true);
  setHasMore(true);
  console.log("this effect is calling twice");
  
  fetchPresetJson(0, true); 
}, [debouncedInputValue, selectedLocation, selectedCategory, template, sortBy, presetCountries, presetType]);

useEffect(() => {
  if (page > 0) {
    fetchPresetJson(page, false);
  }
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
  const formatCount = (count: number) => {
    if (count >= 1000) {
      const value = count / 1000;
      const decimalPart = value - Math.floor(value);
      return `${Math.floor(value)}k`;
    }
    return count;
  };
  
const handlePresetClicked = (item:PresetData, id:string, trackerType:string, name:string) => {
  if (!isPublic) {
    handlePresetClick?.(item, id, trackerType, name);
  }
};
const redirectUrl=(item:PresetData, id:string, trackerType:string, name:string, index:number)=>{
  sessionStorage.setItem("redirect", `/preset?presetId=${item?.id}&type=${trackerType}`)
 return encodeURIComponent(`/preset?presetId=${item?.id}&type=${trackerType}`);
}
const getCompFilterdData = (data: string[]) => {
  const res: string[] = [];
  const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  data?.forEach((item: string) => {
    const value = item?.trim();
    if (!value) return;
    if (regex.test(value)) {
    try {
      const url = new URL(value.startsWith("http") ? value : `https://${value}`);
      const domain = url.hostname.replace(/^www\./, ""); // remove www.
      res.push(domain);
    } catch {
      res.push(value);
    }
  }else{
    res.push(value)
  }
  });

  return res;
};

const structured=(obj:any, type:string[])=>{


const limit=3;
 if(type.includes("T_PRODUCT_KEYWORDS")){
  const resArray= [...obj.includeKeywords, ...obj.excludeKeywords]
  return resArray.slice(0,limit).join(", ")
 }else if(type.includes("T_COMPETITOR")){
   const resArray = [...obj.organizations.slice(0,limit)]
   return getCompFilterdData(resArray).join(", ");
 }else if (type.includes("T_PEOPLE_FINDER") || type.includes("T_SPEAKING_OPPORTUNITY")) {
  const keys = Object.keys(obj);
  const maxLength = limit;

  const result = Array.from({ length: maxLength }).map((_, i) => {
    const values = keys.map(key => obj[key]?.[i]).filter(Boolean); // safely access

    return values
      .map((val, index) => (index === 0 ? val : `(${val})`))
      .join(" ");
  });
  return result.join(", ");
}


}
const toggleFilterHandler=()=>{
  setShowFilter(!showFilters);
}
console.log("template", presetCategories);

  return (
    <div className="w-full">
      {!isFull &&
      <div className="flex justify-between md:justify-center gap-2 items-center font-semibold">
        <div className="flex items-center gap-1">
        <span className="text-lg">Get Started with Collections</span>
        <span className="text-xs bg-[var(--primary-color)] text-white py-[3px] px-2 rounded-full">
          {totalCount}
        </span>
        </div>
        <div className="block md:hidden" onClick={()=>setShowTemplate?.(false)}>X</div>
      </div>}
      
      <div className={`flex mx-auto w-full md:w-[95%] gap-4 sticky pt-2 bg-background ${isPublic?"pt-2":"pt-4"}`}>
        <div className="w-full bg-background">
          <div className="border border-input rounded px-3 py-2 flex items-center gap-2 ml-2.5 mr-0 md:mr-2.5">
            <MagnifyingGlass color="#9CA3AF" width="18px" height="18px" />
            <input
              value={inputValue}
              onChange={handleInputChange}
              className="outline-none w-full bg-transparent"
              placeholder="Search by Collection name, Country or Category"
            />
          </div>
        </div>
        <Button
                    onClick={toggleFilterHandler}
                    // variant={filtersCount > 0 ? "secondary" : "ghost"}
                    variant={"secondary"}
                    size="icon"
                    className="w-10 border relative  md:hidden h-auto mr-3"
                  >
                    <Filter className="w-4 h-4" />
                    {filterCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                        {filterCount}
                      </div>
                    )}
                  </Button>
        {(template?.name === "T_COMPETITOR" || template===undefined) &&
        <div className="hidden md:w-[30%] md:block">
        <AudienceSpreadSelector source="preset" presetCountries={presetCountries}
  setPresetCountries={setPresetCountries}/>
        </div>
        }
        {template===undefined &&
        <div className="hidden md:w-[30%] md:block">
        <CollectionTypeSelector
        presetType={presetType}
        setPresetType={setPresetType}
      />
      </div>}
        {(template?.name === "T_PRODUCT_KEYWORDS" || template===undefined) &&
        <div className="hidden md:w-[30%] md:block">
          <CategorySelector source="preset" presetCategories={presetCategories}setPresetCategories={setPresetCategories}/>
        </div>}
        {/* <div className="w-[20%]">
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
      <div className="block">
      <div
      className={`pb-6 md:pb-0 md:h-[calc(100vh-260px)] overflow-y-auto mt-4`}
      // ref={containerRef}
       style={{
    height: (isPublic || isFull)
      ? "auto"
      : "calc(100vh - 313px)", // Default for mobile
      // scrollbarWidth:"none",
    // Override on medium screens and up (optional - can't do media queries in inline styles, so use JS breakpoint logic if needed)
  }}
          >
        <div className={styles.presetContainer}>
          {presetTemplateData.map((item, index) => (
            <Link 
                  href={isFull 
      ? `/collections/${item.id}/events?view=${isMobile ? "list" : "table"}&eventType=active&type=${item.trackerType[0]}`
      : `/internal/trackers/create?type=${item.trackerType[0]}&collectionId=${item.id}`}
                  key={index}>
            <div
              key={`${item.id}-${index}`}
              className="w-full p-2 gap-3 flex items-center flex-col h-[350px] text-sm border border-[var(--border-color)] rounded-[12px] overflow-y-auto hide-scrollbar"
              // onClick={
              //   item.enabled
              //     ? () => handlePresetClick(item, item.id, item.url, item.trackerName)
              //     : undefined
              // }
              onClick={() => handlePresetClicked(item, item.id, item.trackerType[0], item.name)}
              style={{cursor: "pointer"}}
            >
              
              <div className="w-full flex items-center min-h-[110px] rounded-md bg-[var(--tabs-background-color)] relative">
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
                    {formatCount(item.totalEvent)} events
                  </div>
                )}
              </div>
              <div className="w-full h-[60%] flex flex-col gap-3">
                <div className="h-[80%]">
  <div className={styles.bottomViewTwo}>
    {item?.name}
  </div>

  <div className={styles.text}>
    {item?.description}
  </div>
  </div>
  {/* <div className="border-t border-gray-200 -m-1" /> */}

  <div className="text-[var(--secondary-text-color)] h-auto">
  <div className="flex flex-wrap items-center">
    {structured(item?.data, item?.trackerType)
      ?.split(",")
      ?.map((entry, i) => {
        const isLong = entry.length > 35;
        const truncated = isLong ? `${entry.substring(0, 35)}...` : entry;

        return (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mr-1 mb-1 cursor-default"
                >
                  {truncated}
                </div>
              </TooltipTrigger>
              {isLong && (
                <TooltipContent>
                  <p>{entry}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        );
      })}

    {/* 👇 Make this inline with the tags */}
    <span
      className="text-[var(--secondary-text-color)] hover:underline cursor-pointer text-[12px] inline-block mb-1"
    >
      +Show More
    </span>
  </div>
</div>

</div>

                
                
            </div>
            </Link>
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
      {showFilters && (
      <div className="w-full sticky bottom-0 bg-background z-10 block md:hidden">
                  <div className="p-4 pb-0 border-t bg-background/80 backdrop-blur-sm space-y-3">
            {/* <div className="border rounded-lg bg-background shadow-sm transition-all duration-200 hover:shadow-md p-2"> */}
                  <div className="flex flex-col gap-3">
                         <AudienceSpreadSelector source="preset" presetCountries={presetCountries}
  setPresetCountries={setPresetCountries}/>
  <CollectionTypeSelector
        presetType={presetType}
        setPresetType={setPresetType}
      />
      <CategorySelector source="preset" presetCategories={presetCategories}setPresetCategories={setPresetCategories}/>
      </div>
      {/* </div> */}
                  </div>
                </div>
                )}
    </div>
  );
};

export default Presets;