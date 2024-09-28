import React, { useState } from "react";
import styles from "./description.style.module.css";
import EditIcon from "/public/EditIcon.svg";
import Image from "next/image";
import { FormState } from "@/types/Formstate";

interface Props {
  handleChange: (field: keyof FormState, value: any) => void;
  // setDescriptionModal: (value: boolean) => void;
  description: string;
  theme?: string;
  isEventDescriptionEmpty: boolean;
  // setIsEventDescriptionEmpty: (value: boolean) => void;
}

const DescriptionContainer = ({
  // setDescriptionModal,
  description,
  theme,
  isEventDescriptionEmpty,
  // setIsEventDescriptionEmpty,
  handleChange
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleClick = () => {
    handleChange('descriptionModal', true)
    // setDescriptionModal(true);
    handleChange('isEventDescriptionEmpty', false)
    // setIsEventDescriptionEmpty(false);
  };

  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <div
      className={`${styles.body} ${
        isEventDescriptionEmpty ? styles.errorHighlight : ""
      } ${theme && theme === "dark" ? styles.darkBody : ""}`}
    >
      <div className={styles.descHeader}>
        <div className={styles.descContainer}>
          <DescIcon />
          <div
            className={styles.descriptionHeading}
            onClick={() => handleClick()}
          >
            Add Event Description
          </div>
        </div>
        <Image
          className={styles.editBtn}
          src={EditIcon}
          alt="edit"
          onClick={() => handleClick()}
        />
      </div>
      {/* {description && <div className={styles.description} dangerouslySetInnerHTML={{ __html: description.substring(0,400) + (description.length > 400 ? "...":"") }}></div>} */}
      {/* {description && (
                <div className={styles.description} dangerouslySetInnerHTML={{
                    __html: isExpanded
                        ? description
                        : description.substring(0, 400) + (description.length > 400 ? "..." : "")
                }}></div>
            )} */}
      {description && (
        <div className={styles.description}>
          <div
            dangerouslySetInnerHTML={{
              __html: isExpanded
                ? description
                : `${description.substring(0, 400)}`,
            }}
          />
          {description.length > 400 && (
            <button onClick={toggleReadMore} className={styles.readMoreButton}>
              {isExpanded ? "Read Less" : "...Read More"}
            </button>
          )}
        </div>
      )}
      {/* <div className={styles.readmore_style}>
                <span>
                     {description.length > 400 && (
                         <button onClick={toggleReadMore} className={styles.readMoreButton}>
                             {isExpanded ? "Read Less" : "Read More"}
                         </button>
                     )}
                 </span>
           </div> */}
    </div>
  );
};

export default DescriptionContainer;

function DescIcon() {
  return (
    <svg
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.1665 1.66699H12.8332M1.1665 5.00033H12.8332M1.1665 8.33366H6.1665"
        stroke="#A8A8A8"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
