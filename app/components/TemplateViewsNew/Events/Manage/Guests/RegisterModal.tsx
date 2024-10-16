import React from 'react'
import styles from './registermodal.style.module.css'
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';

interface Props {
    eventId: string;
}

const RegisterModal = ({ eventId }: Props) => {

    const handleChange = async () => {
        const formData = new FormData()
        formData.append("id", eventId);
        const { data, error } = await myFetch(`${baseUrl}/event`, {
            method: 'POST',
            body: formData
        })
    }

    return (
        <div className={styles.body}>
            <div className={styles.heading}>Registration</div>
            <div className={styles.subheading}>Close registration to stop accepting new guests, including anyone who may have been invited.</div>
            <div className={styles.subheading}> Please note that capacity and availability settings apply when registration is open.</div>
            <div className={styles.regisBtnContainer}>
                <div className={styles.heading}>
                    Accept Registration
                </div>
                <input
                    type="checkbox"
                    id="register"
                    className={styles.checkboxInput}
                    checked
                    onChange={handleChange}
                />
                <label htmlFor="register" className={styles.checkBox}></label>
            </div>
            <button className={styles.confirmBtn}>Confirm</button>
        </div>
    )
}

export default RegisterModal