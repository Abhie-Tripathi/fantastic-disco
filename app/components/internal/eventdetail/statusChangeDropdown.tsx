import dropdownIcon from "/public/internal/dropdown_arrow.svg";
import Image from "next/image";
import styles from './eventdesc.style.module.css';
import { useState } from "react";
interface PropType {
  label: string;
  eventId: number;
}
interface UserType {
  name: string
}
const StatusChangeDropdown: React.FC<PropType> = (props:PropType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("SHORTLISTED");
  const openDropDownHandler = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setIsOpen(false);
    setValue(target.innerText);
  };
  return (
    <div className={styles.filter_container}>
      <div className={styles.filter}>
        <div
          className={styles.dropdown_container}
          onClick={openDropDownHandler}
        >
          <div className={styles.dropdown_value}>
            {value}&nbsp;
          </div>
          <Image width={14} height={14} src={dropdownIcon} alt="downarrow" />
        </div>
        {isOpen && (
          <div className={styles.dropdown_menu}>
            <div
              className={styles.dropdown_menu_items}
              onClick={handleMenuItemClick}
            >
            <div
                className={`${styles.dropdown_menu_item} ${styles.dropdown_menu_item}`}
            >SHORTLISTED</div>
            <div
                className={`${styles.dropdown_menu_item} ${styles.dropdown_menu_item}`}
            >IN NEGOTIATION</div>
            <div
                className={`${styles.dropdown_menu_item} ${styles.dropdown_menu_item}`}
            >CONFIRMED</div>
            <div
                className={`${styles.dropdown_menu_item} ${styles.dropdown_menu_item}`}
            >CANCELLED</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default StatusChangeDropdown;