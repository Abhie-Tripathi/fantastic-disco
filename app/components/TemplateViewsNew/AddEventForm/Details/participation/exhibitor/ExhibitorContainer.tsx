"use client";
import React, { useState } from "react";
import styles from "./exhibitor.style.module.css";
import EditIcon from "/public/EditIcon.svg";
import Image from "next/image";
import ExhibitorIcon from "/public/exhibitoricon.svg";
import useOutsideClick from "@/hooks/useOutsideClick";
import { FormState } from "@/types/Formstate";
interface Props {
  // setBoothNumber: (value: string) => void;
  handleChange: (field: keyof FormState, value: any) => void;
  boothNumber: string;
  formTheme: string;
}

const ExhibitorContainer = ({ handleChange, boothNumber, formTheme }: Props) => {
  const dropdownRef = useOutsideClick(() => setDropdown(false));
  const [dropdown, setDropdown] = useState<boolean>(false);
  // const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        {!boothNumber ? (
          <div className={styles.header}>
            <Image src={ExhibitorIcon} alt="icon" />
            <span style={{color : formTheme === "dark" ? "white" : "#7d7d7d"}}>Add Booth / Stall details</span>
          </div>
        ) : (
          <div className={styles.boothContainer}>
            <div className={styles.heading} style={{color : formTheme === "dark" ? "white" : "#7d7d7d"}}>Booth Number</div>
            <div>{boothNumber}</div>
          </div>
        )}
        <Image
          src={EditIcon}
          className={styles.editBtn}
          alt="edit"
          onClick={() => setDropdown(!dropdown)}
        />
      </div>
      {dropdown && (
        <div className={styles.dropdown} ref={dropdownRef}>
          <input
            placeholder="Stall/booth number"
            value={boothNumber}
            onChange={(e) => handleChange('boothNumber', e.target.value)}
            maxLength={40}
          />
        </div>
      )}
    </div>
  );
};

export default ExhibitorContainer;
