import React, { useRef } from "react";
import styles from "./EventFormt.module.css";
import useClickOutside from "@/hooks/useClickOutside";
import { useTheme } from "@/context";

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
  const {theme} = useTheme();

  const selectFormatHandler = (event: React.MouseEvent<HTMLUListElement>) => {
    console.log("Clicked");
    const eventTarget = event.target as HTMLElement;
    setState(eventTarget.innerText);
    onClose();
  };

  return (
    <div className={`${styles.container} ${theme === 'light' ? styles.container_light : ""}`} ref={menuNode}>
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