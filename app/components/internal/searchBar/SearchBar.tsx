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
    handleSelect: (id: number, name: string) => void;
    endpoint: string; 
    type?: string;
  }
const SearchBar = ({searchInput, setEventSearchLoader, handleSelect, endpoint, type}:SearchBarProps) => {
    const { theme } = useTheme();
    const { isOpen, toggleDropdown, dropdownRef, setIsOpen } = DropdownRef();
    const abortControllerRef = useRef<AbortController | null>(null);
    const [restructureData, setRestructureData] = useState<EventSuggestionItem[]>([]);
    const [eventSuggestion,setEventSuggestion]=useState([]);
    const [previousInput, setPreviousInput] = useState<string>(""); 
    const fetchSearchSuggestion = async () => {
      
      if(searchInput!==previousInput){
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
      };
      
      useEffect(() => {
       if(searchInput.length>0){
        if(searchInput!==previousInput)
        setEventSearchLoader(true);
        const debounceTimeout = setTimeout(() => {
          fetchSearchSuggestion();
        }, 500);
        return () => clearTimeout(debounceTimeout);
          }else setEventSuggestion([]);
      }, [searchInput]);
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
                      tableEntry: `${item.basic.name}, ${item?.basic?.eventLocation?.name}, ${item?.basic?.eventLocation?.cityName}, ${item?.basic?.eventLocation?.countryName}, ${item?.basic?.eventLocation?.locationType}, ${item.basic.startDateTime}, ${item.basic.endDateTime} `,
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
      const selectedEventId=(id:any, name:string)=>{
        handleSelect(id,name);
        setIsOpen(false);
        setPreviousInput(name); 
        setEventSearchLoader(false);
      }
      console.log(restructureData);
      
  return (
        <>
         {searchInput.length > 0 && isOpen && (
  <div ref={dropdownRef} className={`${styles.eventName_container2} top-auto bottom-[55px] md:bottom-auto md:top-[45px]`}
>
  <Command>
  <CommandGroup>
                  <CommandList>
  {restructureData.map((item, index) => (
    <CommandItem
      key={item.key ?? index}
      onSelect={() => selectedEventId(item.key, item.tableEntry ?? item.name)}
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
  </div>
)}
         </> 
         
  )
}

export default SearchBar