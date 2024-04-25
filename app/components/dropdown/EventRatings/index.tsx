import React, { useRef } from "react";
import styles from "@/app/components/dropdown/EventFormat/EventFormt.module.css";
import useClickOutside from "@/hooks/useClickOutside";
import starRate from "/public/internal/rating_star.svg";
import Image from "next/image";

interface EventRatingProps {
  dropdownRef: React.MutableRefObject<null>;
  state: string | null;
  setState: (state: string) => void;
  onClose: () => void;
}

const EventRatings = ({
  dropdownRef,
  state,
  setState,
  onClose,
}: EventRatingProps) => {
  const menuNode = useRef(null);
  useClickOutside(dropdownRef, () => onClose());

  const selectRatingHandler = (event: React.MouseEvent<HTMLUListElement>) => {
    const eventTarget = event.target as HTMLElement;
    setState(eventTarget.innerText);
    onClose();
  };

  return (
    <div className={styles.container} ref={menuNode}>
      <div className={styles.header_container}>
        <div className={styles.header_title}>Event Ratings</div>
      </div>

      <ul className={styles.dateRangeList} onClick={selectRatingHandler}>
        <li>
          1&nbsp;
          <Image src={starRate} alt="rating" width={13} height={13} /> and above
        </li>
        <li>
          2&nbsp;
          <Image src={starRate} alt="rating" width={13} height={13} /> and above
        </li>
        <li>
          3&nbsp;
          <Image src={starRate} alt="rating" width={13} height={13} /> and above
        </li>
        <li>
          4&nbsp;
          <Image src={starRate} alt="rating" width={13} height={13} /> and above
        </li>
        <li>
          5&nbsp;
          <Image src={starRate} alt="rating" width={13} height={13} />
        </li>
      </ul>
    </div>
  );
};

export default EventRatings;