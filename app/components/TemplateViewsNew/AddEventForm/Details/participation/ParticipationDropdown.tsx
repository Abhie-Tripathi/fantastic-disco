import React, { useState } from 'react'
import styles from './dropdown.style.module.css'

interface Props {
    setInputMessage: (value: string) => void
    inuputMessage: string;
    setParticipationType: (value: string) => void
    participationType: string;
}

const ParticipationDropdown = ({ setInputMessage, inuputMessage, setParticipationType, participationType }: Props) => {

    return (
        <div className={styles.body}>
            <div className={styles.participationTypes}>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={participationType === "Attendee"}
                        onChange={() => setParticipationType("Attendee")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Attendee</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={participationType === "Speaker"}
                        onChange={() => setParticipationType("Speaker")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Speaker</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={participationType === "Exhibitor"}
                        onChange={() => setParticipationType("Exhibitor")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Exhibitor</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={participationType === "Organiser"}
                        onChange={() => setParticipationType("Organiser")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Organiser</span>
                </label>
            </div>
            <div className={styles.messageContainer}>
                <div className={styles.heading}>Customize your message</div>
                <textarea className={styles.textarea} onChange={(e) => setInputMessage(e.target.value)}>{inuputMessage}</textarea>
            </div>
        </div>
    )
}

export default ParticipationDropdown