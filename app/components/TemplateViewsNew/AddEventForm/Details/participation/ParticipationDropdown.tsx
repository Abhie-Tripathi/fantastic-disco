import React, { useState } from 'react'
import styles from './dropdown.style.module.css'

const ParticipationDropdown = () => {

    const [selectedType, setSelectedType] = useState<string>("Attendee")

    return (
        <div className={styles.body}>
            <div className={styles.participationTypes}>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedType === "Attendee"}
                        onChange={() => setSelectedType("Attendee")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Attendee</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedType === "Speaker"}
                        onChange={() => setSelectedType("Speaker")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Speaker</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedType === "Exhibitor"}
                        onChange={() => setSelectedType("Exhibitor")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Exhibitor</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedType === "Organiser"}
                        onChange={() => setSelectedType("Organiser")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Organiser</span>
                </label>
            </div>
        </div>
    )
}

export default ParticipationDropdown