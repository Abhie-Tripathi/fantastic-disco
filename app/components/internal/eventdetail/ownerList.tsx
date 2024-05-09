import dropdownIcon from "/public/internal/drop_down_angle.svg";
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
const OwnerList: React.FC<PropType> = (props: PropType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('User name');
  const openDropDownHandler = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.filter_container}>
      <div className={styles.filter}>
        <div
          className={styles.dropdown_container2}
          onClick={openDropDownHandler}
        >
          <div className={styles.dropdown_value} style={{ display: "flex", marginRight: "1rem" }}>
            <Image
              src={'https://c1.10times.com/board/images/default_user.png'}
              alt="user"
              className={styles["owner_img"]}
              style={{ width: 48, height: 48 }}
              referrerPolicy="no-referrer"
            />
            <div>
              <span style={{ fontSize:"14px", textWrap: "nowrap", marginRight: "0.5rem" }}>{value}&nbsp;</span><br />
              <span style={{fontSize:"10px"}}>OWNER&nbsp;</span>
            </div>
          </div>
          <Image width={14} height={14} src={dropdownIcon} alt="downarrow" />
        </div>
      </div>
    </div>
  );
};
export default OwnerList;