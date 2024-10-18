import React from 'react'
import styles from './approvalmodal.style.module.css'
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/constants';
import { showToast } from '@/utils/showToast';

interface Props {
    eventId: string;
    setApprovalValue: (value: boolean) => void
    approvalValue: boolean;
    setApprovalModal: (value: boolean) => void
    fetchEventData : () => Promise<null | undefined>;
}

const ApprovalModal = ({ setApprovalValue, approvalValue, setApprovalModal, eventId,fetchEventData }: Props) => {

    const handleChange = async () => {
        const formData = new FormData()
        formData.append("id", eventId);
        formData.append("approval", approvalValue + "")
        const { data, error } = await myFetch(`${baseUrl}/event`, {
            method: 'PATCH',
            body: formData
        })
        if (data) {
            showToast("success", "Approval changes updated")
            setApprovalModal(false)
            fetchEventData()
        } else {
            console.log("error", error)
        }
    }


    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <div className={styles.heading}>Edit Approval</div>
                <div className={styles.subheading}>If the user needs an approval or not</div>
            </div>
            <div className={styles.approvalContainer}>
                <div className={styles.heading}>
                    Require Approval
                </div>
                <input
                    type="checkbox"
                    id="register"
                    className={styles.checkboxInput}
                    checked = {approvalValue}
                    onChange={()=>setApprovalValue(!approvalValue)}
                />
                <label htmlFor="register" className={styles.checkBox}></label>
            </div>
            <button className={styles.confirmBtn} onClick={handleChange}>Confirm</button>
        </div>
    )
}

export default ApprovalModal