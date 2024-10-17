import React, { useEffect, useRef, useState } from "react";
import styles from "./capacity.style.module.css";
import { FormState } from "@/types/Formstate";
import useOutsideClick from '@/hooks/useOutsideClick'
interface Props{
  handleChange: (field: keyof FormState, value: any) => void;
  // isOpen:boolean 
  // onClose:()=>void;
  capacity:number;
  waitlisting:boolean;
  capacityModal:boolean;
}
const CapacityModal = ({capacity,handleChange,waitlisting,capacityModal}: Props) => {
  const [inputValue, setInputValue] = useState("");
  // const modalRef = useRef<HTMLDivElement>(null);
  const capacityModalRef = useOutsideClick(() => handleChange("capacityModal",false))

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
  //     onClose();
      
  //   }
  // };
  // useEffect(() => {
  //   if (isOpen) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isOpen]);

  // if (!isOpen) return null;
  const handleClose = () =>{
    // onClose();
    handleChange("capacityModal",false)
    if(inputValue !== ""){
      handleChange("capacity", inputValue)
    }
    

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
        <input type="number" value={ inputValue} onChange={(e) => setInputValue(e.target.value)}/>
      </div>
      <div className={styles.waitlistContainer}>
        <div className={styles.heading}>Over-Capacity Waitlist</div>
        <input type="checkbox" id="register" className={styles.checkboxInput} checked={waitlisting} 
        onChange={(e) => handleChange("waitlisting", e.target.checked)} 
        />
        <label htmlFor="register" className={styles.checkBox}></label>
      </div>
      <div className={styles.btnContainer}>
        <button className={styles.setBtn} onClick={handleClose}>Set Limit</button>
        <button className={styles.removeBtn}>Remove Limit</button>
      </div>
    </div>
  );
};

export default CapacityModal;
