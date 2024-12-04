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
}
const WaitListAndCap = ({
  waitlisting,
  approval,
  capacity,
  handleChange,
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
            <Ticket />
          </div>
          <div className={styles.itemText}>Tickets</div>
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
            <span className={styles.freeAndPaid_text}>Free</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="radio"
              name="ticketOption"
              value="option2"
              checked={selectedOption === "option2"}
              onChange={handleRadioChange}
            />
            <span className={styles.freeAndPaid_text}>Paid</span>
          </label>
        </div>
      </div>

      <div className={styles.cardItem}>
        <div className={styles.icon_textContainer}>
          <div className={styles.icon}>
            <Approval />
          </div>
          <div className={styles.itemText}>Require Approval</div>
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
            <Capacity />
          </div>
          <div className={styles.itemText}>
            Capacity
            <div className={styles.waitListText}>
              {waitlisting ? "Waitlist Enabled" : ""}
            </div>
          </div>
        </div>
        <div className={styles.waitlistNumber}>
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

function Capacity() {
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
        fill="#7D7D7D"
      />
      <path
        d="M6.29289 13.7071C6.68342 14.0976 7.31658 14.0976 7.70711 13.7071L11 10.4142L11 21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21L13 10.4142L16.2929 13.7071C16.6834 14.0976 17.3166 14.0976 17.7071 13.7071C18.0976 13.3166 18.0976 12.6834 17.7071 12.2929L12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289L6.29289 12.2929C5.90237 12.6834 5.90237 13.3166 6.29289 13.7071Z"
        fill="#7D7D7D"
      />
    </svg>
  );
}

function Ticket() {
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
        stroke="#7D7D7D"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        opacity="0.4"
        d="M10 4L10 20"
        stroke="#7D7D7D"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="5 5"
      />
    </svg>
  );
}

function Approval() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.2 16.55L16.3946 15.5798C16.4968 15.0667 16.7712 14.5928 16.8692 14.079C16.8902 13.9721 16.9005 13.8625 16.9 13.75C16.8997 13.5064 16.8486 13.2656 16.7499 13.0429C16.6512 12.8203 16.5071 12.6207 16.3268 12.4569C16.1465 12.2931 15.934 12.1687 15.703 12.0918C15.4719 12.0148 15.2273 11.9869 14.9848 12.0099C14.7423 12.0329 14.5073 12.1063 14.2948 12.2253C14.0823 12.3444 13.897 12.5064 13.7507 12.7012C13.6044 12.8959 13.5004 13.1191 13.4453 13.3563C13.3903 13.5936 13.3853 13.8397 13.4308 14.079C13.5288 14.5935 13.8032 15.066 13.9061 15.5798L14.1 16.55M16.2 16.55H14.1M16.2 16.55L17.9479 17.0162C18.2463 17.0826 18.5132 17.2487 18.7044 17.4872C18.8957 17.7257 19 18.0223 19 18.328C19 18.699 18.699 19 18.328 19H11.972C11.7938 19 11.6228 18.9292 11.4968 18.8032C11.3708 18.6772 11.3 18.5062 11.3 18.328C11.3 17.698 11.7375 17.1527 12.3521 17.0162L14.1 16.55M15.5 9.9V9.2C15.5 7.2204 15.5 6.2299 14.8847 5.6153C14.2701 5 13.2796 5 11.3 5H9.2C7.2204 5 6.2299 5 5.6153 5.6153C5 6.2299 5 7.2204 5 9.2V14.8C5 16.7796 5 17.7701 5.6153 18.3847C6.2299 19 7.2204 19 9.2 19" stroke="#7D7D7D" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8.50078 9.66768C8.50078 9.66768 8.93828 9.66768 9.37578 10.6008C9.37578 10.6008 10.7653 8.26768 12.0008 7.80078M7.80078 13.4008H10.6008M7.80078 15.5008H10.6008" stroke="#7D7D7D" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  );
}
