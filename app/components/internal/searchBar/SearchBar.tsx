import { baseUrl, useTheme } from '@/context';
import { myFetch } from '@/utils/myFetch';
import React,{useState, useEffect, useRef} from 'react'
import styles from './searchBar.style.module.css'
import Image from 'next/image';
import SearchIcon from "/public/search.svg";
import { useTrackerServices } from "@/services/trackerServices";
import DropdownRef from '../../employee/listView/DropdownRef';
interface EventSuggestionItem {
  key: string | number;
  id?:any;
  name: string;
  location?: {
    cityName?: string;
    countryName?: string;
  };
  city?: string;
  country?: string;
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
    const {getSuggestion} = useTrackerServices();
    const { isOpen, toggleDropdown, dropdownRef, setIsOpen } = DropdownRef();
    const abortControllerRef = useRef<AbortController | null>(null);
    const [restructureData, setRestructureData] = useState<EventSuggestionItem[]>([]);
    const [eventSuggestion,setEventSuggestion]=useState([]);
    const [previousInput, setPreviousInput] = useState<string>(""); 
    const fetchSearchSuggestion = async () => {
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
      }
  
      const controller = new AbortController();
      abortControllerRef.current = controller;
  
      console.log("AbortController Signal:", controller.signal);
  
      try {
          const response = await getSuggestion(endpoint, searchInput, controller.signal);
          setEventSuggestion(response);
      } catch (error: any) {
          if (error.name === "AbortError") {
              console.log("Request was aborted");
          } else {
              console.error("Error in fetchSearchSuggestion:", error);
          }
      }finally {
        setEventSearchLoader(false);
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
      useEffect(()=>{
        console.log("suggestion called");
        
            if(eventSuggestion){  
                setIsOpen(true);
                let updatedData;
                if (type === "T_COMPETITOR" || type==="T_CUSTOMER_ICP") {
                  console.log(eventSuggestion);
                  updatedData = eventSuggestion?.companies?.map((item: EventSuggestionItem, index: number) => ({
                    key: item.id,
                    name: item?.name || '',
                    host: item?.host || '',
                    city: item?.location?.cityName || '',
                    country: item?.location?.countryName || ''
                  }));
                } else {
                  updatedData = eventSuggestion.map((item: EventSuggestionItem, index: number) => ({
                    key: item.id,
                    name: item?.name || '',
                    city: item?.city || '',
                    country: item?.country || ''
                  }));
                }
                console.log(updatedData);
                
                setRestructureData(updatedData);
            }
      },[eventSuggestion])
      const selectedEventId=(id:any, name:string)=>{
       console.log(name);
       
        handleSelect(id,name);
        setIsOpen(false);
        setPreviousInput(name); 
        setEventSearchLoader(false);
      }
      console.log(restructureData);
      
  return (
        <>
         {searchInput.length > 0 && isOpen && (
  <div ref={dropdownRef} className={styles.eventName_container2}>
    {restructureData  ? (
      restructureData.map((item) => (
        <div key={item.key} className={styles.resultData_list} onClick={() => selectedEventId(item.key, item.host)}>
          <div className={styles.event} >
  {item.name}
  {item.city || item.country ? ", " : null} 
  <span className={styles.subHeading}>
    {item.city === item.country
      ? item.country
      : `${item.city ? item.city + ', ' : ''}${item.country || ''}`}
  </span>
</div>
        </div>
      ))
    ) : (
      <div className={styles.resultData_list}>
        No results
      </div>
    )}
  </div>
)}
         </> 
         
  )
}

export default SearchBar