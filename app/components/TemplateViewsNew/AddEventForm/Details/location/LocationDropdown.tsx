import React, { useState } from 'react'
import styles from './locationdropdown.style.module.css'

const LocationDropdown = () => {
    const [selectedType, setSelectedType] = useState<string>("In-person")

    return (
        <div className={styles.body}>
            <div className={styles.locationTypes}>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedType === "In-person"}
                        onChange={() => setSelectedType("In-person")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>In-person</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedType === "Virtual"}
                        onChange={() => setSelectedType("Virtual")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Virtual</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedType === "Hybrid"}
                        onChange={() => setSelectedType("Hybrid")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Hybrid</span>
                </label>
            </div>
            {(selectedType === "In-person" || selectedType === "Hybrid") && <div className={styles.locationInputContainer}>
                <input type="text" placeholder='Enter Location' />
                <div className={styles.recentHeading}>Recent Locations</div>
                <div className={styles.recentLocation}>
                    <LocationIcon /> <span className={styles.state}>Bengaluru</span><span className={styles.country}>India</span>
                </div>
            </div>}
            {(selectedType === "Virtual" || selectedType === "Hybrid") &&
                <div className={styles.inputLinkContainer}>
                    <input type="text" placeholder='Enter Virtual Link' />
                    <div><span className={styles.infoBtn}>i</span><span className={styles.info}>If you have a virtual event link, you can enter or paste it above.</span></div>
                </div>}
        </div>
    )
}

export default LocationDropdown

function LocationIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill="#7D7D7D" /></svg>
    )
}