import dropdownIcon from "/public/internal/drop_down_angle.svg";
import shortlistedIcon from "/public/internal/shortlist_status.svg";
import confirmedIcon from "/public/internal/confirmed_status.svg";
import cancelledIcon from "/public/internal/cancelled_status.svg";
import negotiationIcon from "/public/internal/negotiation_status.svg";
import Image from "next/image";
import styles from "./eventdesc.style.module.css";
import { useState } from "react";
import { useTheme } from "@/context";
interface PropType {
  label: string;
  eventId: number;
  handleStatusChange: (arg: number) => void;
  currentValue: string;
}

const statusValues: { [key: string]: number } = {
  SHORTLISTED: 1,
  "IN PROGRESS": 2,
  CONFIRMED: 10,
  CANCELED: 12,
};

const StatusChangeDropdown: React.FC<PropType> = (props: PropType) => {
  const [isOpen, setIsOpen] = useState(false);
  // console.log(props.currentValue);
  
  const [value, setValue] = useState(props.currentValue);
  const openDropDownHandler = () => {
    setIsOpen((prev) => !prev);
  };
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const handleMenuItemClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setIsOpen(false);
    setValue(target.innerText);
    props.handleStatusChange(statusValues[target.innerText]);
  };
  return (
    <div className={styles.filter_container}>
      <div className={styles.filter}>
        <div
          className={styles.dropdown_container}
          onClick={openDropDownHandler}
        >
          <div className={styles.dropdown_value}>
            <Image
              width={14}
              height={14}
              src={
                value == "SHORTLISTED"
                  ? shortlistedIcon
                  : value == "IN PROGRESS"
                  ? negotiationIcon
                  : value == "CONFIRMED"
                  ? confirmedIcon
                  : cancelledIcon
              }
              alt="downarrow"
              className={value !== "CONFIRMED" && value !== "CANCELLED" ? iconClass : ''}
            />
            {value}
          </div>
          <Image
            width={14}
            height={14}
            src={dropdownIcon}
            alt="downarrow"
            className={iconClass}
          />
        </div>
        {isOpen && (
          <div
            className={`${styles.dropdown_menu} ${theme === 'light' ? styles.dropdown_menu_light : ""}`}
          >
            <div
              className={styles.dropdown_menu_items}
              onClick={handleMenuItemClick}
            >
              <div
                className={`${styles.dropdown_menu_item} ${
                  theme === "light" ? styles.dropdown_menu_item_light : ""
                }`}
              >
                <Image
                  width={14}
                  height={14}
                  src={shortlistedIcon}
                  alt="downarrow"
                  className={iconClass}
                />
                SHORTLISTED
              </div>
              <div
                className={`${styles.dropdown_menu_item} ${
                  theme === "light" ? styles.dropdown_menu_item_light : ""
                }`}
              >
                <Image
                  width={14}
                  height={14}
                  src={negotiationIcon}
                  alt="downarrow"
                  className={iconClass}
                />
                IN PROGRESS
              </div>
              <div
                className={`${styles.dropdown_menu_item} ${
                  theme === "light" ? styles.dropdown_menu_item_light : ""
                }`}
              >
                <Image
                  width={14}
                  height={14}
                  src={confirmedIcon}
                  alt="confirm"
                />
                CONFIRMED
              </div>
              <div
                className={`${styles.dropdown_menu_item} ${
                  theme === "light" ? styles.dropdown_menu_item_light : ""
                }`}
              >
                <Image
                  width={14}
                  height={14}
                  src={cancelledIcon}
                  alt="downarrow"
                />
                CANCELED
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default StatusChangeDropdown;
