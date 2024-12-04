import React, { useEffect, useRef, useState } from "react";
import styles from "./capacity.style.module.css";
import { FormState } from "@/types/Formstate";
import useOutsideClick from "@/hooks/useOutsideClick";
import { showToast } from "@/utils/showToast";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
interface Props {
  handleChange: (field: keyof FormState, value: any) => void;
  capacity: number;
  waitlisting: boolean;
  capacityModal: boolean;
  eventId?: string;
}
const CapacityModal = ({
  capacity,
  handleChange,
  waitlisting,
  capacityModal,
  eventId,
}: Props) => {
  const [inputValue, setInputValue] = useState<number>(
    capacity === -1 ? 50 : capacity
  );
  const capacityModalRef = useOutsideClick(() =>
    handleChange("capacityModal", false)
  );

  const handleClose = () => {
    handleChange("capacityModal", false);
    handleChange("capacity", inputValue);
  };

  const handleChangecapacity = async () => {
    const formData = new FormData();

    if (eventId) {
      formData.append("id", eventId);
    }

    if (inputValue !== 0 || inputValue !== undefined) {
      handleChange("capacity", inputValue);
      handleChange("capacityModal", false);
    } else {
      console.log("Updating maxCapacity");
    }
  };
  
  const removeLimit = ()=>{
    handleChange("capacity", -1);
    handleChange("capacityModal", false);
  }

  return (
    <div className={styles.body} ref={capacityModalRef}>
      <div className={styles.header}>
        <div className={styles.heading}>Max Capacity</div>
        <div className={styles.subheading}>
          Auto-close registration when the capacity is reached. Only approved
          guests count toward the cap.
        </div>
      </div>
      <div className={styles.inputContainer}>
        <div className={styles.heading}>Capacity</div>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(Number(e.target.value))}
        />
      </div>
      <div className={styles.waitlistContainer}>
        <div className={styles.heading}>Over-Capacity Waitlist</div>
        <input
          type="checkbox"
          id="register"
          className={styles.checkboxInput}
          checked={waitlisting}
          onChange={(e) => handleChange("waitlisting", e.target.checked)}
        />
        <label htmlFor="register" className={styles.checkBox}></label>
      </div>
      <div className={styles.btnContainer}>
        <button className={styles.setBtn} onClick={handleChangecapacity}>
          Set Limit
        </button>
        <button className={styles.removeBtn} onClick={removeLimit}>Remove Limit</button>
      </div>
    </div>
  );
};

export default CapacityModal;

// import React, { useState } from "react";
// import styles from "./capacity.style.module.css";
// import { FormState } from "@/types/Formstate";
// import useOutsideClick from "@/hooks/useOutsideClick";
// import { showToast } from "@/utils/showToast";
// import { myFetch } from "@/utils/myFetch";
// import { baseUrl } from "@/constants";

// interface Props {
//   handleChange: (field: keyof FormState, value: any) => void;
//   capacity: number;
//   waitlisting: boolean;
//   capacityModal: boolean;
//   eventId?: string;
// }

// const CapacityModal = ({
//   capacity,
//   handleChange,
//   waitlisting,
//   capacityModal,
//   eventId,
// }: Props) => {
//   const [inputValue, setInputValue] = useState<number>(capacity);
//   const capacityModalRef = useOutsideClick(() =>
//     handleChange("capacityModal", false)
//   );

//   const handleClose = () => {
//     handleChange("capacityModal", false);
//     handleChange("capacity", inputValue);
//   };

//   const handleChangecapacity = async () => {
//     const formData = new FormData();

//     if (eventId) {
//       formData.append("id", eventId);
//     }

//     if (inputValue !== 0 || inputValue !== undefined) {
//       console.log("Adding new capacity");
//       handleChange("maxCapacity", inputValue);
//       handleChange("capacityModal", false);
//       showToast("success", "Capacity set successfully!");
//     } else {
//       console.log("Updating maxCapacity");
//       formData.append("maxCapacity", inputValue + "");
//       formData.append("waitlisting", waitlisting + "");

//       const { data, error } = await myFetch(`${baseUrl}/event`, {
//         method: "PATCH",
//         body: formData,
//       });

//       if (data) {
//         showToast("success", "Capacity and Waitlist updated");
//         handleChange("capacityModal", false);
//       } else {
//         console.log("API error", error);
//       }
//     }
//   };

//   return (
//     <div className={styles.body} ref={capacityModalRef}>
//       <div className={styles.header}>
//         <div className={styles.heading}>Max Capacity</div>
//         <div className={styles.subheading}>
//           Auto-close registration when the capacity is reached. Only approved
//           guests count toward the cap.
//         </div>
//       </div>
//       <div className={styles.inputContainer}>
//         <div className={styles.heading}>Capacity</div>
//         <input
//           type="number"
//           value={inputValue}
//           onChange={(e) => setInputValue(Number(e.target.value))}
//         />
//       </div>
//       <div className={styles.waitlistContainer}>
//         <div className={styles.heading}>Over-Capacity Waitlist</div>
//         <input
//           type="checkbox"
//           id="register"
//           className={styles.checkboxInput}
//           checked={waitlisting}
//           onChange={(e) => handleChange("waitlisting", e.target.checked)}
//         />
//         <label htmlFor="register" className={styles.checkBox}></label>
//       </div>
//       <div className={styles.btnContainer}>
//         <button className={styles.setBtn} onClick={handleChangecapacity}>
//           {capacity === 0 || capacity === undefined ? "Set Limit" : "Update Limit"}
//         </button>
//         <button className={styles.removeBtn} onClick={handleClose}>Remove Limit</button>
//       </div>
//     </div>
//   );
// };

// export default CapacityModal;
