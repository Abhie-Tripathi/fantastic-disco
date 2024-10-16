import React, { useEffect, useRef } from "react";
import styles from "./capacity.style.module.css";
import { FormState } from "@/types/Formstate";

interface Props{
  handleChange: (field: keyof FormState, value: any) => void;
  isOpen:boolean 
  onClose:()=>void;
  capacity:number;
  waitlisting:boolean;
  

}
const CapacityModal = ({isOpen, onClose,capacity,handleChange,waitlisting}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  if (!isOpen) return null;
  const handleClose = () =>{
    onClose();
  }
  return (
    <div className={styles.body} ref={modalRef}>
      <div className={styles.header}>
        <div className={styles.heading}>Max Capacity</div>
        <div className={styles.subheading}>
          Auto-close registration when the capacity is reached. Only approved
          guests count toward the cap.
        </div>
      </div>
      <div className={styles.inputContainer}>
        <div className={styles.heading}>Capacity</div>
        <input type="number" value={ capacity} onChange={(e) => handleChange('capacity', e.target.value)}/>
      </div>
      <div className={styles.waitlistContainer}>
        <div className={styles.heading}>Over-Capacity Waitlist</div>
        <input type="checkbox" id="register" className={styles.checkboxInput} checked={waitlisting} onChange={() => handleChange("waitlisting",true)} />
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
