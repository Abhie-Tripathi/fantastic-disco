import React, { useState } from "react";
import styles from "./capacity.style.module.css";

const CapacityModal = ({ isOpen, onClose }: any) => {
  if (!isOpen) return null;

  const [capacity, setCapacity] = useState<number | "">(0);
  const [isApproved, setIsApproved] = useState(false);

  const handleToggle = () => {
    setIsApproved(!isApproved);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCapacity(value ? Number(value) : "");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 style={{ textAlign: "left" }}>Max Capacity</h2>
        <p className={styles.text}>
          Auto-close registration when the capacity is reached. Only approved
          guests count towards capacity.
        </p>
        <input
          type="number"
          value={capacity}
          onChange={handleInputChange}
          placeholder="Enter Max Capacity"
          className={styles.capacityInput}
        />
        <div className={styles.toggleCotainer}>
          <div className={styles.itemText}>
            over 
          </div>
          <div className={styles.toggleContainer}>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={isApproved}
                onChange={handleToggle}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CapacityModal;
