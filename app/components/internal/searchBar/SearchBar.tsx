import { baseUrl, useTheme } from '@/context';
import { myFetch } from '@/utils/myFetch';
import React,{useState, useEffect, useRef} from 'react'
import styles from './searchBar.style.module.css'
import Image from 'next/image';
import SearchIcon from "/public/search.svg";
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
  host?:string;
  tableEntry?: string;
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
        let url = `${baseUrl}/${endpoint}?query=${searchInput}&limit=5&offset=0`;
        
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
              else if(type==="T_COMPETITOR"){
                
                setEventSuggestion(data.companies);
              }else
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
      useEffect(()=>{
            if(eventSuggestion?.length>0){  
                setIsOpen(true);
                let updatedData;
                console.log(type);
                
                if(type==="T_BRAND_BUILDING"){
                  console.log(eventSuggestion);
                  
                  updatedData = eventSuggestion.map((item:EventSuggestionItem)=>({
                    key:item?.id,
                    name: item?.name || '',
                    city: item?.location?.cityName || '',
                    country: item?.location?.countryName || '',
                    tableEntry: item?.name || ''
                  }))
                }
                else if (type === "T_COMPETITOR") {
                  updatedData = eventSuggestion.map((item: EventSuggestionItem, index: number) => ({
                    key: item.id,
                    name: item?.name || '',
                    city: item?.location?.cityName || '',
                    country: item?.location?.countryName || '',
                    tableEntry: item?.host? item.host:item.name
                  }));
                } else {
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
  <div ref={dropdownRef} className={styles.eventName_container2}>
    {restructureData && restructureData.length > 0  ? (
      restructureData.map((item) => (
        <div key={item.key} className={styles.resultData_list} onClick={() => selectedEventId(item.key, item.tableEntry??"")}>
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