import { baseUrl } from '@/context';
import { myFetch } from '@/utils/myFetch';
import React,{useState, useEffect, useRef} from 'react'
import styles from './searchBar.style.module.css'
import DropdownRef from '../../employee/listView/DropdownRef';
interface RestructuredData {
    key: string; 
    value: string; 
  }
const SearchBar = ({searchInput, setEventSearchLoader, handleSelect}:any) => {
    const { isOpen, toggleDropdown, dropdownRef, setIsOpen } = DropdownRef();
    const abortControllerRef = useRef<AbortController | null>(null);
    const [restructureData, setRestructureData] = useState<RestructuredData[]>([]);
    const [eventSuggestion,setEventSuggestion]=useState([]);
    const fetchSearchSuggestion = async () => {
        let url = `${baseUrl}/userInterest/enquiry/suggestion?q=${searchInput}`;
        
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
      };
      
      useEffect(() => {
       if(searchInput.length>0){
        setEventSearchLoader(true);
        const debounceTimeout = setTimeout(() => {
          fetchSearchSuggestion();
        }, 500);
        return () => clearTimeout(debounceTimeout);
          }else setEventSuggestion([]);
      }, [searchInput]);
      useEffect(()=>{
            if(eventSuggestion.length>0){  
                setIsOpen(true);
                const updatedData = eventSuggestion.map((item, index) => ({
                    key: item.id,
                    value: item.name,
                  }));
                  setRestructureData(updatedData)
            }
      },[eventSuggestion])
      console.log(restructureData);
      const selectedEventId=(id, name)=>{
        handleSelect(id,name);
        setIsOpen(false);
      }
  return (
         <>
         {searchInput.length>0 && isOpen &&
          <div ref={dropdownRef} className={styles.eventName_container2}>
          {eventSuggestion && eventSuggestion.map((item) => (
  <div key={item.id} className={styles.resultData_list} onClick={()=>selectedEventId(item.id, item.name)}>
    {item.name}
  </div>
))}
      

          {/* {Object.keys(selectedEvents).length > 0 && showAllEvents && (
            <div className={styles.eventName_container2}>
              {Object.entries(selectedEvents).map(
                ([eventId, eventName], index) => (
                  <div className={styles.eventName_chip} key={0}>
                    <span className={styles.eventName_chip_text}>
                      {eventName}
                    </span>
                    <Image
                      src={CloseIcon}
                      width={14}
                      height={14}
                      alt="close"
                      className={styles.closeChip}
                      onClick={() => removeSelectionHandler(eventId)}
                    />
                  </div>
                )
              )}
            </div>
          )} */}
        </div>
         }
         </> 
         
  )
}

export default SearchBar
