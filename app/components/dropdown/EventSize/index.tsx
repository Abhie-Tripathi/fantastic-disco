import React, { useRef } from "react";
import styles from "@/app/components/dropdown/EventFormat/EventFormt.module.css";
import useClickOutside from "@/hooks/useClickOutside";
import { useTheme } from "@/context";

interface EventSizeProps {
  dropdownRef: React.MutableRefObject<null>;
  state: string | null;
  setState: (state: string) => void;
  onClose: () => void;
}

const EventSize = ({
  dropdownRef,
  state,
  setState,
  onClose,
}: EventSizeProps) => {
  const menuNode = useRef(null);
  useClickOutside(dropdownRef, () => onClose());
  const {theme} = useTheme();

  const selectFeeHandler = (event: React.MouseEvent<HTMLUListElement>) => {
    const eventTarget = event.target as HTMLElement;
    setState(eventTarget.innerText);
    onClose();
  };

  return (
    <div className={`${styles.container} ${theme === 'light' ? styles.container_light : ""}`} ref={menuNode}>
      <div className={styles.header_container}>
        <div className={styles.header_title}>Event Size</div>
      </div>

      <ul className={styles.dateRangeList} onClick={selectFeeHandler}>
        <li>All</li>
        <li>100 - 500</li>
        <li>500 - 1000</li>
        <li>1000+</li>
      </ul>
    </div>
  );
};

export default EventSize;