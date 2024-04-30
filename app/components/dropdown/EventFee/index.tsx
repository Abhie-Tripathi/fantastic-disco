import React, { useRef } from "react";
import styles from "@/app/components/dropdown/EventFormat/EventFormt.module.css";
import useClickOutside from "@/hooks/useClickOutside";
import { useTheme } from "@/context";

interface EventFeeProps {
  dropdownRef: React.MutableRefObject<null>;
  state: string | null;
  setState: (state: string) => void;
  onClose: () => void;
}

const EventFee = ({
  dropdownRef,
  state,
  setState,
  onClose,
}: EventFeeProps) => {
  const menuNode = useRef(null);
  useClickOutside(dropdownRef, () => onClose());
  const {theme} = useTheme();

  const selectFeeHandler = (event:any) => {
    console.log(event)
    setState(event.target.innerText);
    onClose();
  };

  return (
    <div className={`${styles.container} ${theme === 'light' ? styles.container_light : ""}`} ref={menuNode}>
      <div className={styles.header_container}>
        <div className={styles.header_title}>Entry Fee</div>
      </div>

      <ul className={styles.dateRangeList} onClick={selectFeeHandler}>
        <li>All</li>
        <li>Free</li>
        <li>Paid</li>
      </ul>
    </div>
  );
};

export default EventFee;