import ClockIcon from '/public/clock.svg'
import crossIcon from "/public/close.svg";
import Image from "next/image";
import styles from './statusDropdown.style.module.css';
import { useState } from "react";
interface PropType {
  label: string;
  eventId: number;
}
const StatusChangeDropdown: React.FC<PropType> = (props:PropType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("Pending");
  const openDropDownHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen((prev) => !prev);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMenuItemClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    setIsOpen(false);
    setValue(target.innerText);
    setIsModalOpen(true);
  };

  const closeModal = () =>{
    setIsModalOpen(false);
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
            <Image src={ClockIcon} alt="clock" width={16} height={16} />
            {value}
          </div>
        </div>
        {isOpen && (
          <div className={styles.dropdown_menu}>
            <div
              className={styles.dropdown_menu_items}
              onClick={handleMenuItemClick}
            >
              <div className={`${styles.dropdown_menu_item} ${styles.dropdown_menu_item}`} >
                Shortlist
              </div>
              <div className={`${styles.dropdown_menu_item} ${styles.dropdown_menu_item}`} >
                Reject
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    {
      isModalOpen && (
          <div className={styles["modalContainer"]} onClick={handleClickEvent} >
              <div className={styles["modal"]} >
                <header className={styles["modal_header"]}>
                  <div className={styles["modal_header-title"]}>Modal Heading</div>
                  <button className={styles["close"]} onClick={() => closeModal()} >
                    <Image src={crossIcon} alt="clock" width={16} height={16} />
                  </button>
                </header>
                <main className={styles["modal_content"]} style={{padding:"0 1rem"}}>
                </main>
              </div>
          </div>
      )
    }
    </>
  );
};
export default StatusChangeDropdown;