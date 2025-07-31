import { baseUrl, useTheme } from '@/context';
import { myFetch } from '@/utils/myFetch';
import React,{useState, useEffect, useRef} from 'react'
import styles from './searchBar.style.module.css'
import Image from 'next/image';
import SearchIcon from "/public/search.svg";
import { formatEventDates } from "@/utils/dateFormat";
import DropdownRef from '../../employee/listView/DropdownRef';
import { Item } from '@radix-ui/react-select';
import { Event } from '@/types/events';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import DesDep from "@/public/data/desDep.json";
import { formattedDateRange } from "@/utils/date";
import { formatLocationParts } from "@/utils/locationFormat";
interface EventSuggestionItem {
  key: string | number;
  id?:any;
  name: string;
  location?: Event["basic"]["eventLocation"];
  eventStartDate?: string;
  eventEndDate?: string;
  city?: string;
  country?: string;
  host?:string;
  website?:string;
  tableEntry?: string;
  eventLocation?: string | null;
  eventCountry?: string | null;
}

  interface SearchBarProps {
    searchInput: string;
    setEventSearchLoader: (loading: boolean) => void;
    handleSelect: (id: number, name: string, index: number) => void;
    endpoint: string; 
    type?: string;
     index?: number;
     isFocused?: boolean;
      onOptionSelected?: () => void;
  }
const SearchBar = ({searchInput, setEventSearchLoader, handleSelect, endpoint, type, index, isFocused, onOptionSelected}:SearchBarProps) => {
  const [focusedIndex,setFocusedIndex] = useState<number | null>(null);
  const { isOpen, toggleDropdown, dropdownRef, setIsOpen } = DropdownRef();
  const [selectionMade, setSelectionMade] = useState(false);
  useEffect(() => {
    if (isFocused && !selectionMade) {
      setIsOpen(true);
    } else if (!isFocused) {
      const timer = setTimeout(() => setIsOpen(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isFocused, selectionMade]);
    
    const { theme } = useTheme();
    
    const abortControllerRef = useRef<AbortController | null>(null);
    const [restructureData, setRestructureData] = useState<EventSuggestionItem[]>([]);
    const [eventSuggestion,setEventSuggestion]=useState<any>([]);
    const [previousInput, setPreviousInput] = useState<string>(""); 
    const fetchSearchSuggestion = async () => {
      
      // if(searchInput!==previousInput){
        if (type === "T_AUDIENCE_DEPT_PROFILE") {
  let filterDesValue;
  
  if (index === 0) {
    filterDesValue = searchInput?.length > 0
      ? DesDep.data.designation.filter((item: any) =>
          item.name?.toLowerCase()?.includes(searchInput?.toLowerCase())
        )
      : DesDep.data.designation;
  }
  else if (index === 1) {
    filterDesValue = searchInput?.length > 0
      ? DesDep.data.role.filter((item: any) =>
          item.name?.toLowerCase()?.includes(searchInput?.toLowerCase())
        )
      : DesDep.data.role;
  }
  else if (index === 2) {
    filterDesValue = searchInput?.length > 0
      ? DesDep.data.department.filter((item: any) =>
          item.name?.toLowerCase()?.includes(searchInput?.toLowerCase())
        )
      : DesDep.data.department;
  }
  setEventSuggestion(filterDesValue);
  setEventSearchLoader(false);
  return;
}
if (searchInput?.length > 0) {
        let url; 
        // if(type==="T_EVENT_PARTICIPATIONS"){
        //   url=`${baseUrl}/${endpoint}?query=${searchInput}&limit=5&offset=0`;
        // }else 
        url=`${baseUrl}/${endpoint}?query=${searchInput}&${type==="T_EVENT_PARTICIPATION"?"limit=10":"limit=5"}&offset=0`;
        
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
    
          const controller = new AbortController();
          abortControllerRef.current = controller;
      
        try {
          const { data, error } = await myFetch(url, {
            method: 'GET',
            signal: controller.signal,
          })
          if (!controller.signal.aborted) {
            if (data) {
              if(type==="T_BRAND_BUILDING"){
                setEventSuggestion(data.designations);
              }
              else if(type==="T_COMPETITOR" || type==="T_CUSTOMER_ICP"){
                
                setEventSuggestion(data.companies);
              }else if(type === "T_EVENT_PARTICIPATION"){
                setEventSuggestion(data.events)
              }
              else
              setEventSuggestion(data.events); 
            } else {
              console.error('Fetch error:', error); 
            }
        }
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            console.error('Error fetching suggestion data:', error);
          }
        }finally {
            setEventSearchLoader(false);
          }
        }
      // }
      };
      
      useEffect(() => {
        
        
      //  if(searchInput?.length>0){
        if(searchInput!==previousInput)
        setEventSearchLoader(true);
        const debounceTimeout = setTimeout(() => {
          fetchSearchSuggestion();
        }, 500);
        return () => clearTimeout(debounceTimeout);
          // }else setEventSuggestion([]);
      }, [searchInput, index, isFocused]);
      const getDomain = (url?: string) => {
        if (!url || url === "undefined") return "";
        try {
          const hostname = new URL(url).hostname;
          return hostname.replace("www.", "");
        } catch (error) {
          return url;
        }
      };
      useEffect(()=>{
            if(eventSuggestion?.length>0){  
                setIsOpen(true);
                let updatedData;
                console.log(type);
                
                if(type==="T_BRAND_BUILDING"){
                  
                  updatedData = eventSuggestion.map((item:EventSuggestionItem)=>({
                    key:item?.id,
                    name: item?.name || '',
                    city: item?.location?.cityName || '',
                    country: item?.location?.countryName || '',
                    tableEntry: item?.name || ''
                  }))
                }
                else if(type==="T_AUDIENCE_DEPT_PROFILE"){
                  updatedData = eventSuggestion.map((item: any, index: number) => ({
                    key: item.id || index,
                    name: item.name || '',
                    // city: item?.location?.cityName || '',
                    // country: item?.location?.countryName || '',
                    tableEntry: `${item.name}_${item.id}` || ''
                  }));
                  setRestructureData(updatedData);
                }
                else if (type === "T_COMPETITOR" || type==="T_CUSTOMER_ICP") {
                  
                  updatedData = eventSuggestion.map((item: EventSuggestionItem, index: number) => ({
                    key: item.id,
                    name: item?.name || '',
                    city: item?.location?.cityName || '',
                    country: item?.location?.countryName || '',
                    tableEntry: item.host && item.host !== "undefined" 
                      ? item.host 
                      : item.website && item.website !== "undefined" 
                      ? getDomain(item.website) 
                      : item.name,
                    location:{
                        cityName:item?.location?.cityName,
                        countryName:item?.location?.countryName
                    }
                }));
                } else if (type === "T_EVENT_PARTICIPATION") {
                  updatedData = eventSuggestion.map((item:Event) => {
                    return {
                      key: item.basic.id,
                      eventLocation:item?.basic?.eventLocation?.cityName,
                      eventCountry:item?.basic?.eventLocation?.countryName,
                      name: item.basic.name || '',
                      tableEntry: `${item.basic.name}_${item?.basic?.eventLocation?.name}_${item?.basic?.eventLocation?.cityName}_${item?.basic?.eventLocation?.countryName}_${item?.basic?.eventLocation?.locationType}_${item.basic.startDateTime}_${item.basic.endDateTime} `,
                      eventStartDate: item.basic.startDateTime || "",
                      eventEndDate: item.basic.endDateTime || "",
                      location: item.basic.eventLocation
                    };
                  });
                }
                else {
                  updatedData = eventSuggestion.map((item: EventSuggestionItem, index: number) => ({
                    key: item.id,
                    name: item?.name || '',
                    city: item?.city || '',
                    country: item?.country || ''
                  }));
                }
                
                setRestructureData(updatedData);
            }
      },[eventSuggestion])
     const selectedEventId = (id: any, name: string) => {
  // 1. Immediately mark selection and prevent default behaviors
  setSelectionMade(true);
  setIsOpen(false);
  
  // 2. Process selection
  handleSelect(id, name, index || 0);
  setPreviousInput(name);
  setEventSearchLoader(false);
  
  // 3. Trigger blur in parent (should update inputFocus state)
  onOptionSelected?.();
  
  // 4. Reset selection flag after everything settles
  setTimeout(() => {
    setSelectionMade(false);
  }, 100);
};
      
  return (
        <>
         {/* {(searchInput?.length > 0 && type!=="T_AUDIENCE_DEPT_PROFILE") && (isOpen || isFocused) && ( */}
  {(isOpen && 
  (type === "T_AUDIENCE_DEPT_PROFILE" ? isFocused : (searchInput?.length > 0 && isFocused)) && 
  !selectionMade && restructureData?.length>0) &&(


  <div ref={dropdownRef} className={`${styles.eventName_container2} top-auto bottom-[55px] md:bottom-auto md:top-[45px]`}
>
  <Command>
  <CommandGroup>
                  <CommandList>
  {restructureData.map((item, index) => (
    <CommandItem
      key={item.key ?? index}
      onSelect={() => selectedEventId(item.key, item.tableEntry ?? item.name)}
      onClick={() => selectedEventId(item.key, item.tableEntry ?? item.name)}
      onMouseDown={(e) => e.preventDefault()} 
      className="flex flex-col items-start cursor-pointer"
    >
      <div className="font-medium">
                              <span>{item.name}</span>
                              <span className="sr-only">{item.key}</span>
                              {type==="T_EVENT_PARTICIPATION" &&
                              <span className="text-xs text-muted-foreground ml-2">
                                {formattedDateRange(
                                  item.eventStartDate || "", item.eventEndDate || "",
                                  false
                                )}
                              </span>
                              }
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.location && formatLocationParts(item.location, true)}
                            </div>
    </CommandItem>
  ))}
</CommandList>

                </CommandGroup>
    </Command>
  </div>)}
{/* )} */}
         </> 
         
  )
}

export default SearchBar