import styles from './statusDropdown.style.module.css';
import { useEffect, useState } from "react";
import { useTheme } from '@/context';
import { toast } from 'react-toastify';
import { useCoordinateService } from '@/services/coordinateService';
import { Clock } from 'geist-icons';
import { ChevronDown } from 'lucide-react';
interface PropType {
  label: string;
  eventId?: string;
  enquiryId: string;
  currentEnquiryStatus: string;
  handleShortlistModal?: (eventId: string, enquiryId: string) => void;
  setSelectedId:any;
  // value:any;
  // setValue:any;
}

const formatText = (val: string) => {
  if(val) {
    return val?.charAt(0).toUpperCase() + val?.substring(1).toLowerCase();
  }
}

const StatusChangeDropdown: React.FC<PropType> = (props:PropType) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const {theme} = useTheme();

  const coordinateService = useCoordinateService();

  const openDropDownHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if(props?.currentEnquiryStatus == 'IN_NEGO' || props?.currentEnquiryStatus == 'IN_DISCUSSION' || props?.currentEnquiryStatus == 'CONFIRMED')
      return
    else
      setIsOpen((prev) => !prev);
  };
useEffect(()=>{
 setValue((props.currentEnquiryStatus == 'REJECTED') ? 'Rejected' : 
 (props.currentEnquiryStatus == 'IN_DISCUSSION') ?'Pending' : 'Shortlisted')

 setIsOpen(false);
 if(props?.currentEnquiryStatus)
   setValue((props.currentEnquiryStatus == 'IN_DISCUSSION' || props.currentEnquiryStatus == 'IN_NEGO') ? 'In Progress' : props.currentEnquiryStatus)
}, [props.currentEnquiryStatus])
  const handleMenuItemClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setIsOpen(false);
    // setValue(target.innerText);
    if(props.handleShortlistModal && props.eventId && props.enquiryId){
      props.handleShortlistModal(props.eventId, props.enquiryId);
      props.setSelectedId(props.eventId);
    }

  };

  const handleRejectClick = async() => {
    let payloadData = {
      enquiryId: props.enquiryId,
      enquiryStatus:"REJECTED"
    };
    try {
      const apiData = await coordinateService.setEnquiryStatus(payloadData);
      if(apiData){
        toast.error(
          <div>Status updated! <span className={styles['reject-undo-btn']} onClick={() => handleUndoClick()}>UNDO</span></div>, {
          position: 'bottom-right',
          autoClose: 3000,
          closeButton: false,
          hideProgressBar: true,
        });
        setValue('Rejected');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleUndoClick = async() => {
    let payloadData = {
      enquiryId: props.enquiryId,
      enquiryStatus: props.currentEnquiryStatus,
    };
    try {
      const apiData = await coordinateService.setEnquiryStatus(payloadData);
      setValue((props.currentEnquiryStatus == 'REJECTED') ? 'Rejected' : 
      (props.currentEnquiryStatus == 'IN_DISCUSSION') ?'Pending' : 'Shortlisted');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleClickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }

  return (
    <>
    <div className={styles.filter_container} onClick={handleClickEvent}>
      <div className={styles.filter}>
        <div
          className='text-[var(--info-text-color)] bg-[var(--info-background-color)] h-fit font-semibold text-sm py-1 px-2 border-[var(--border-color)] border rounded-md w-fit'
          onClick={openDropDownHandler}
        >
          <div className={styles.dropdown_value}>
            <Clock height={'14px'} width={'14px'} color="var(--info-text-color)" style={{display:"flex"}} />
            {formatText(value)}
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-180 transform" : ""
              }`}
            />
          </div>
        </div>
        {isOpen && (
          <div className={styles.dropdown_menu}>
            <div
              className={styles.dropdown_menu_items}
            >
              <div onClick={handleMenuItemClick} className={`${styles.dropdown_menu_item} ${styles.dropdown_menu_item}`} >
                Shortlist
              </div>
              <div onClick={handleRejectClick} className={`${styles.dropdown_menu_item} ${styles.dropdown_menu_item}`} >
                Reject
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};
export default StatusChangeDropdown;