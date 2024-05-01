import ClockIcon from '/public/clock.svg'
import Image from "next/image";
import styles from './statusDropdown.style.module.css';
import { useState } from "react";

interface PropType {
  label: string;
  eventId: number;
  handleShortlistModal: () => void;
  handleRejectClick: () => void;
}
const StatusChangeDropdown: React.FC<PropType> = (props:PropType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("Pending");
  const openDropDownHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen((prev) => !prev);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setIsOpen(false);
    setValue(target.innerText);
    props.handleShortlistModal();
  };

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
            <Image src={ClockIcon} alt="clock" width={16} height={16} />
            {value}
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
              <div onClick={props.handleRejectClick} className={`${styles.dropdown_menu_item} ${styles.dropdown_menu_item}`} >
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