import downIcon from '/public/internal/dropdown_arrow.svg'
import Image from "next/image";
import styles from './eventTypeDropdown.module.css';
import { useState } from "react";
import { useTheme } from '@/context';

interface PropType {
  label: string;
  eventId: number;
}
const EventTypeDropdown: React.FC<PropType> = (props: PropType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("Event Type");
  const { theme } = useTheme();
  const iconClass = theme === 'light' ? 'icons_light' : 'icon'
  const invertIconClass = theme === 'light' ? 'icon' : 'icons_light'
  const openDropDownHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen((prev) => !prev);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setIsOpen(false);
    setValue(target.innerText);
  };

  const handleClickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }

  return (
    <>
      <div className={`${styles.filter_container} mobile_view`} onClick={handleClickEvent}>
        <div className={styles.filter}>
          <div
            className={`${styles.dropdown_container3} ${theme === 'light' ? styles.dropdown_container_light : ""}`}
            onClick={openDropDownHandler}
          >
            <div className={styles.dropdown_value}>
              {value}
              <Image src={downIcon} alt="clock" width={18} height={18} className={invertIconClass} />
            </div>
          </div>
          {isOpen && (
            <div className={`${styles.dropdown_menu} ${theme === 'light' ? styles.dropdown_menu_light : ""}`}>
              <div
                className={`${styles.dropdown_menu_header} ${styles.dropdown_menu_header}`}
              >
                <div>{props.label}</div>
              </div>
              <div
                className={styles.dropdown_menu_items}
              >
                <div onClick={handleMenuItemClick} className={`${styles.dropdown_menu_item} ${styles.dropdown_menu_item}`} >
                  All Events
                </div>
                <div onClick={handleMenuItemClick} className={`${styles.dropdown_menu_item} ${styles.dropdown_menu_item}`} >
                  Team Events
                </div>
                <div onClick={handleMenuItemClick} className={`${styles.dropdown_menu_item} ${styles.dropdown_menu_item}`} >
                  My Events
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default EventTypeDropdown;