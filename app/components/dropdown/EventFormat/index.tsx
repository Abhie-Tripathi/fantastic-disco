import React, { useRef } from "react";
import styles from "./EventFormt.module.css";
import useClickOutside from "@/hooks/useClickOutside";

interface EventStatusProps {
  dropdownRef: React.MutableRefObject<null>;
  state: string | null;
  setState: (state: string) => void;
  onClose: () => void;
}

const EventFormat = ({
  dropdownRef,
  state,
  setState,
  onClose,
}: EventStatusProps) => {
  const menuNode = useRef(null);
  useClickOutside(dropdownRef, () => onClose());

  const selectFormatHandler = (event: React.MouseEvent<HTMLUListElement>) => {
    console.log("Clicked");
    const eventTarget = event.target as HTMLElement;
    setState(eventTarget.innerText);
    onClose();
  };

  return (
    <div className={styles.container} ref={menuNode}>
      <div className={styles.header_container}>
        <div className={styles.header_title}>Event Format</div>
      </div>

      <ul className={styles.dateRangeList} onClick={selectFormatHandler}>
        <li>All</li>
        <li>Hybrid</li>
        <li>Online</li>
        <li>In-Person</li>
      </ul>
    </div>
  );
};

export default EventFormat;