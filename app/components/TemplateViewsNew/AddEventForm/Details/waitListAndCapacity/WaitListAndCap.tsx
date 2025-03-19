import { useState } from "react";
import styles from "./waitlistandcap.style.module.css";
import EditIcon from "/public/EditIcon.svg";
import Image from "next/image";
import CapacityModal from "./capacitymodal/Capacity";
import { FormState } from "@/types/Formstate";

interface Props {
  waitlisting: boolean;
  approval: boolean;
  capacity: number;
  handleChange: (field: keyof FormState, any: any) => void;
  formTheme : string;
}
const WaitListAndCap = ({
  waitlisting,
  approval,
  capacity,
  handleChange,
  formTheme
}: Props) => {
  // const [inputValue, setInputValue] = useState("");
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("option1");
  const openCapacityModal = () => {
    handleChange("capacityModal", true);
    setIsCapacityModalOpen(true);
  };
  const closeCapacityModal = () => {
    setIsCapacityModalOpen(false);
  };

  const handleRadioChange = (e: any) => {
    setSelectedOption(e.target.value);
  };
  const handleToggle = () => {
    handleChange("approval", !approval);
  };

  return (
    <div className={`${styles.cardContainer}`}>
      <div className={styles.cardItem}>
        <div className={styles.icon_textContainer}>
          <div className={styles.icon}>
            <Ticket color={formTheme === "dark" ? "white" : "#7d7d7d"}/>
          </div>
          <div className={`${styles.itemText} ${formTheme === "light" ? "text-[var(--tertiary-text-color)]" : "text-[#ffffff]"}`}>Tickets</div>
        </div>
        <div className={styles.radioContainer}>
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="radio"
              name="ticketOption"
              value="option1"
              checked={selectedOption === "option1"}
              onChange={handleRadioChange}
            />
            <span className={`${styles.freeAndPaid_text} ${formTheme === "dark" ? "text-[#ffffff]" : "text-[#000000]"}`}>Free</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="radio"
              name="ticketOption"
              value="option2"
              checked={selectedOption === "option2"}
              onChange={handleRadioChange}
            />
            <span className={`${styles.freeAndPaid_text} ${formTheme === "dark" ? "text-[#ffffff]" : "text-[#000000]"}`}>Paid</span>
          </label>
        </div>
      </div>

      <div className={styles.cardItem}>
        <div className={styles.icon_textContainer}>
          <div className={styles.icon}>
            <Approval color={formTheme === "dark" ? "white" : "#7d7d7d"}/>
          </div>
          <div className={`${styles.itemText} ${formTheme === "light" ? "text-[var(--tertiary-text-color)]" : "text-[#ffffff]"}`}>Require Approval</div>
        </div>
        <div className={styles.toggleContainer}>
          <label className={styles.switch}>
            <input type="checkbox" checked={approval} onChange={handleToggle} />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.cardItem}>
        <div className={styles.icon_textContainer}>
          <div className={styles.icon}>
            <Capacity color={formTheme === "dark" ? "white" : "#7d7d7d"}/>
          </div>
          <div className={`${styles.itemText} ${formTheme === "light" ? "text-[var(--tertiary-text-color)]" : "text-[#ffffff]"}`}>
            Capacity
            <div className={styles.waitListText}>
              {waitlisting ? "Waitlist Enabled" : ""}
            </div>
          </div>
        </div>
        <div className={`${styles.waitlistNumber} ${formTheme === "light" ? "text-[var(--tertiary-text-color)]" : "text-[#ffffff]"}`}>
          <div>{capacity === -1 ? "Unlimited" : capacity}</div>
          <Image
            className={styles.editBtn}
            src={EditIcon}
            alt="edit"
            onClick={openCapacityModal}
          />
        </div>
      </div>
    </div>
  );
};

export default WaitListAndCap;

interface IconProps{
  color : string;
}

function Capacity({color} : IconProps) {
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      fill="#7D7D7D"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 2C3.44772 2 3 2.44772 3 3C3 3.55228 3.44772 4 4 4H20C20.5523 4 21 3.55228 21 3C21 2.44772 20.5523 2 20 2H4Z"
        fill={color}
      />
      <path
        d="M6.29289 13.7071C6.68342 14.0976 7.31658 14.0976 7.70711 13.7071L11 10.4142L11 21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21L13 10.4142L16.2929 13.7071C16.6834 14.0976 17.3166 14.0976 17.7071 13.7071C18.0976 13.3166 18.0976 12.6834 17.7071 12.2929L12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289L6.29289 12.2929C5.90237 12.6834 5.90237 13.3166 6.29289 13.7071Z"
        fill={color}
      />
    </svg>
  );
}

function Ticket({color} : IconProps) {
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.5 12.5C19.5 11.12 20.62 10 22 10V9C22 5 21 4 17 4H7C3 4 2 5 2 9V9.5C3.38 9.5 4.5 10.62 4.5 12C4.5 13.38 3.38 14.5 2 14.5V15C2 19 3 20 7 20H17C21 20 22 19 22 15C20.62 15 19.5 13.88 19.5 12.5Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        opacity="0.4"
        d="M10 4L10 20"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="5 5"
      />
    </svg>
  );
}

function Approval({color} : IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.2 12.55L12.3946 11.5798C12.4968 11.0667 12.7712 10.5928 12.8692 10.079C12.8902 9.97213 12.9005 9.86247 12.9 9.75C12.8997 9.50643 12.8486 9.26561 12.7499 9.04294C12.6512 8.82028 12.5071 8.62066 12.3268 8.45688C12.1465 8.29309 11.934 8.16874 11.703 8.09178C11.4719 8.01482 11.2273 7.98695 10.9848 8.00994C10.7423 8.03294 10.5073 8.1063 10.2948 8.22532C10.0823 8.34435 9.89698 8.50643 9.75071 8.70118C9.60444 8.89593 9.50043 9.11907 9.44535 9.35633C9.39026 9.59358 9.38531 9.83972 9.4308 10.079C9.5288 10.5935 9.8032 11.066 9.9061 11.5798L10.1 12.55M12.2 12.55H10.1M12.2 12.55L13.9479 13.0162C14.2463 13.0826 14.5132 13.2487 14.7044 13.4872C14.8957 13.7257 15 14.0223 15 14.328C15 14.699 14.699 15 14.328 15H7.972C7.79377 15 7.62285 14.9292 7.49682 14.8032C7.3708 14.6772 7.3 14.5062 7.3 14.328C7.3 13.698 7.7375 13.1527 8.3521 13.0162L10.1 12.55M11.5 5.9V5.2C11.5 3.2204 11.5 2.2299 10.8847 1.6153C10.2701 1 9.2796 1 7.3 1H5.2C3.2204 1 2.2299 1 1.6153 1.6153C1 2.2299 1 3.2204 1 5.2V10.8C1 12.7796 1 13.7701 1.6153 14.3847C2.2299 15 3.2204 15 5.2 15" stroke={color} stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M4.50078 5.66768C4.50078 5.66768 4.93828 5.66768 5.37578 6.60078C5.37578 6.60078 6.76528 4.26768 8.00078 3.80078M3.80078 9.40078H6.60078M3.80078 11.5008H6.60078" stroke={color} stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round" />
    </svg>


  );
}
