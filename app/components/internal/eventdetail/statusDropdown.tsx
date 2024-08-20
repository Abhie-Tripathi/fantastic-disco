import ClockIcon from '/public/clock.svg'
import ClockIconLight from '/public/clock_light.svg'
import Image from "next/image";
import styles from './statusDropdown.style.module.css';
import { useState } from "react";
import { useTheme } from '@/context';
import { toast } from 'react-toastify';
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import upArrowLight from '/public/internal/up_arrow_light.svg'
import upArrow from '/public/internal/up_arrow.svg'
interface PropType {
  label: string;
  eventId: string;
  enquiryId: string;
  currentEnquiryStatus: string;
  handleShortlistModal: (eventId: string, enquiryId: string) => void;
}
const StatusChangeDropdown: React.FC<PropType> = (props:PropType) => {
  const [isOpen, setIsOpen] = useState(false);
  const enquiryStatus = (props.currentEnquiryStatus == 'REJECTED') ? 'Rejected' : 
    (props.currentEnquiryStatus == 'IN_DISCUSSION') ?'Pending' : 'Shortlisted';
  const [value, setValue] = useState(enquiryStatus);
  const {theme} = useTheme();
  const iconClass = theme === 'light' ? 'icons_light' : 'icon'
  const openDropDownHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen((prev) => !prev);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setIsOpen(false);
    // setValue(target.innerText);
    props.handleShortlistModal(props.eventId, props.enquiryId);
  };

  const handleRejectClick = async() => {
    let payloadData = {
      enquiryId: props.enquiryId,
      enquiryStatus:"REJECTED"
    };
    try {
      const apiUrl = baseUrl + "/userInterest/enquiry";
      const apiData = await myFetch(apiUrl, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(payloadData),
      });
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
      const apiUrl = baseUrl + "/userInterest/enquiry";
      const apiData = await myFetch(apiUrl, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(payloadData),
      });
      setValue(enquiryStatus);
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
          className={styles.dropdown_container3}
          onClick={openDropDownHandler}
        >
          <div className={styles.dropdown_value}>
            <Image src={theme==="light"?ClockIconLight:ClockIcon} alt="clock" width={16} height={16}/>
            {value}
            <Image
                    src={theme==="light"?upArrowLight:upArrow}
                    alt="up"
                    width={16}
                    height={16}
                    className="icons"
                    style={{transform:"rotate(180deg)"}}
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