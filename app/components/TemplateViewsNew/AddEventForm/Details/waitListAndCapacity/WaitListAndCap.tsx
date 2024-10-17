import { useState } from "react";
import styles from "./waitlistandcap.style.module.css";
import EditIcon from "/public/EditIcon.svg";
import Image from "next/image";
import CapacityModal from "./capacitymodal/Capacity";
import { FormState } from "@/types/Formstate";
interface Props{
  waitlisting:boolean;
  approval:boolean;
  capacity:number;
  handleChange: (field: keyof FormState, any: any) => void;
  
  
}
const WaitListAndCap = ({waitlisting, approval, capacity, handleChange}:Props) => {
  // const [inputValue, setInputValue] = useState("");
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("option1");
 
  const openCapacityModal = () => {
    handleChange("capacityModal",true)
    setIsCapacityModalOpen(true);
  };
  const closeCapacityModal = () => {
    setIsCapacityModalOpen(false);
  };

  const handleRadioChange = (e: any) => {
    setSelectedOption(e.target.value);
  };
  const handleToggle = () => {
    handleChange("approval",true)
  }

  return (
    <div className={`${styles.cardContainer}`}>
      <div className={styles.cardItem}>
        <div className={styles.icon}>
          <Ticket />
        </div>
        <div className={styles.itemText}>Tickets</div>

        <div className={styles.radioContainer}>
          <label style={{display:"flex", alignItems:"center", gap:"5px"}}>
            <input
              type="radio"
              name="ticketOption"
              value="option1"
              checked={selectedOption === "option1"}
              onChange={handleRadioChange}
            />
            <span className={styles.freeAndPaid_text}>Free</span>
          </label>
          <label style={{display:"flex", alignItems:"center", gap:"5px"}}>
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
        <div className={styles.icon}>
          <Approval />
        </div>
        <div className={styles.itemText}>Require Approval</div>
        <div className={styles.toggleContainer}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={approval}
              onChange={handleToggle}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.cardItem}>
        <div className={styles.icon}>
          <Capacity />
        </div>
        <div className={styles.itemText}>Capacity
        <div className={styles.waitListText}>{waitlisting? 'Waitlist Enabled':""}</div>
        </div>
        <div className={styles.waitlistNumber}>{capacity?capacity:""}</div>
        <Image
          className={styles.editBtn}
          src={EditIcon}
          alt="edit"
          onClick={openCapacityModal}
        />
      </div>
      {/* Capacity Modal */}
      {/* <CapacityModal
        isOpen={isCapacityModalOpen}
        onClose={closeCapacityModal}
        capacity={ capacity}
        handleChange={handleChange}
        waitlisting={waitlisting}
      /> */}
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 96 960 960"
      width="20px"
      fill="#7D7D7D"
    >
      <path d="M669 1026 504 861l43-43 122 122 243-243 43 43-286 286ZM479.825 696Q415 696 371.5 652.65 328 609.3 328 544.5q0-64.8 43.5-108.15 43.5-43.35 108.325-43.35Q544 393 587.175 436.35q43.175 43.35 43.175 108.15 0 64.8-43.175 108.15Q544 696 479.825 696ZM188 866v-60q0-30 15.5-54.5T258 711q51-22 103-33.5t118-11.5q30 0 59.5 3t57.5 10l-49 50q-19-3-40-5t-40-2q-59 0-112.5 9.5T257 777q-16 7-25.5 22t-9.5 32v29h259L610 866H188Zm291-366q-45 0-74-29.5T376 397q0-45 29-73.5T479 295q45 0 74.5 28.5T583 397q0 45-29.5 74.5T479 500ZM479 437Zm.5 283Z" />
    </svg>
  );
}
