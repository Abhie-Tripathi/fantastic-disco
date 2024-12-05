import React, { useEffect } from 'react'
import styles from './capacitymodal.style.module.css'
import { showToast } from '@/utils/showToast';
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/constants';
import { useEventServices } from '@/services/geniservices/eventService'
interface Props {
    eventId: string;
    setCapacityModal: (value: boolean) => void
    capacityValue: string;
    setCapacityValue: (value: string) => void
    setWaitlistValue: (value: boolean) => void
    waitlistValue: boolean;
    fetchEventData: () => Promise<null | undefined>;
}

const CapacityModal = ({ eventId, setCapacityModal, setCapacityValue, capacityValue, setWaitlistValue, waitlistValue, fetchEventData }: Props) => {
    const { updateEvent, error } = useEventServices()
    useEffect(() => {
        if (capacityValue === "-1") {
            setCapacityValue("50")
        }
    }, [])

    const handleChange = async (e: React.FormEvent) => {
        e.preventDefault()
        // Validate the capacity value
        if (capacityValue === "") {
            showToast("error", "Capacity can not be empty");
            return; 
        }
        const formData = new FormData()
        formData.append("id", eventId);
        formData.append("maxCapacity", capacityValue + "")
        formData.append("waitlisting", waitlistValue + "")
        // const { data, error } = await myFetch(`${baseUrl}/event`, {
        //     method: 'PATCH',
        //     body: formData
        // })
        const data = await updateEvent(formData)
        if (data) {
            showToast("success", "Capacity and Waitlist updated")
            setCapacityModal(false)
            fetchEventData()
        } else {
            console.log("error", error)
        }
    }

    const handleRemoveLimit = async () => {
        const formData = new FormData()
        formData.append("id", eventId);
        formData.append("maxCapacity", -1 + "")
        formData.append("waitlisting", false + "")
        const data = await updateEvent(formData)
        if (data) {
            showToast("success", "Removed Capacity Limit")
            setCapacityModal(false)
            fetchEventData()
        } else {
            console.log("error", error)
        }
    }

    return (
        <form className={styles.body} onSubmit={handleChange}>
            <div className={styles.header}>
                <div className={styles.heading}>Max Capacity</div>
                <div className={styles.subheading}>Auto-close registration when the capacity is reached. Only approved guests count toward the cap.</div>
            </div>
            <div className={styles.inputContainer}>
                <div className={styles.heading}>Capacity</div>
                <input type="number" onChange={(e) => setCapacityValue(e.target.value)} value={capacityValue} min={1} />
            </div>
            <div className={styles.waitlistContainer}>
                <div className={styles.heading}>
                    Over-Capacity Waitlist
                </div>
                <input
                    type="checkbox"
                    id="capacity"
                    className={styles.checkboxInput}
                    checked={waitlistValue}
                    onChange={() => setWaitlistValue(!waitlistValue)}
                />
                <label htmlFor="capacity" className={styles.checkBox}></label>
            </div>
            <div className={styles.btnContainer}>
                <button type='submit' className={styles.setBtn}>Set Limit</button>
                <button type='button' className={styles.removeBtn} onClick={handleRemoveLimit}>Remove Limit</button>
            </div>
        </form>
    )
}

export default CapacityModal