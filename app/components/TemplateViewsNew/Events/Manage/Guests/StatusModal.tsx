import React, { useState } from 'react'
import styles from './statusmodal.style.module.css'
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { showToast } from '@/utils/showToast';
import useOutsideClick from '@/hooks/useOutsideClick';

interface Props {
    setStatusModal : (value : boolean) => void
    fetchGuests: () => Promise<void>;
    statusValue: string;
    setStatusValue: (value: string) => void
    mail: string;
    name: string;
    interestId: string;
    eventId: string;
}

const StatusModal = ({setStatusModal, fetchGuests, statusValue, setStatusValue, mail, name, interestId, eventId }: Props) => {
    const [statusDropdown, setStatusDropdown] = useState<boolean>(false)
    const console_url = process.env.NEXT_PUBLIC_CONSOLE_PAGE_DOMAIN

    const statusModalRef = useOutsideClick(() => setStatusDropdown(false))

    const handleStatusValue = (status : string)=>{
        setStatusValue(status)
        setStatusDropdown(false)
    }

    const handleSubmit = async () => {
        const newObj = {
            id: interestId,
            status: statusValue,
            redirectUrl: `${console_url}detailpage/${eventId}`
        }
        const { data, error } = await myFetch(`${baseUrl}/intend`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newObj)
        })
        if (data) {
            showToast("success", "Status of the user updated")
            fetchGuests()
            setStatusModal(false)
        }
        if (error) {
            showToast("error", "Error in updating status")
        }
    }

    return (
        <div className={styles.body}>
            <div className={styles.nameStatusContainer}>
                <div className={styles.name}>{name}</div>
                <div className={`${styles.status} ${statusValue === "PENDING" ? styles.pending :
                    statusValue === "CONFIRMED" ? styles.going :
                        statusValue === "WAITLISTING" ? styles.waitlist :
                            statusValue === "FOLLOWING" ? styles.following : styles.notgoing
                    }`}>
                    {statusValue === "PENDING" ? "Pending" : statusValue === "CONFIRMED" ? "Going" : statusValue === "WAITLISTING" ? "Waitlist" : statusValue === "FOLLOWING" ? "Following" : "Not Going"}
                </div>
            </div>
            <div className={styles.mail}>{mail}</div>
            <div className={styles.statusContainer}>
                <div className={styles.statusHeading}>
                    Change status to:
                </div>
                <div className={styles.statusInputContainer} onClick={() => setStatusDropdown(!statusDropdown)}>
                    {statusValue === "PENDING" ? "Pending" : statusValue === "CONFIRMED" ? "Going" : statusValue === "WAITLISTING" ? "Waitlist" : statusValue === "FOLLOWING" ? "Following" : "Not Going"}
                    <DownArrow />
                </div>
                {statusDropdown && <div className={styles.statusDropdown} ref={statusModalRef}>
                    <div onClick={() => handleStatusValue("CONFIRMED")} className={`${styles.status} ${styles.going}`}>Going</div>
                    <div onClick={() => handleStatusValue("PENDING")} className={`${styles.status} ${styles.pending}`}>Pending</div>
                    <div onClick={() => handleStatusValue("REJECTED")} className={`${styles.status} ${styles.notgoing}`}>Not Going</div>
                    {/* <div onClick={() => setStatusValue("WAITLISTING")} className={`${styles.status} ${styles.waitlist}`}>Wailist</div> */}
                </div>}
            </div>
            <div className={styles.notify}>We will notify the user of the updated status through mail.</div>
            <button onClick={handleSubmit} className={styles.updateBtn}>Update status</button>
        </div>
    )
}

export default StatusModal
function DownArrow() {
    return (
        <svg width={10} height={10} viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47124 5.47026C5.34622 5.59524 5.17668 5.66545 4.9999 5.66545C4.82313 5.66545 4.65359 5.59524 4.52857 5.47026L0.757237 1.69893C0.693563 1.63743 0.642775 1.56387 0.607836 1.48253C0.572896 1.40119 0.554505 1.31371 0.553736 1.22519C0.552967 1.13667 0.569835 1.04889 0.603355 0.966957C0.636876 0.885027 0.686378 0.810592 0.748973 0.747996C0.811568 0.685401 0.886003 0.635899 0.967934 0.602379C1.04986 0.568858 1.13765 0.55199 1.22617 0.55276C1.31469 0.553529 1.40217 0.57192 1.48351 0.606859C1.56484 0.641798 1.63841 0.692586 1.6999 0.75626L4.9999 4.05626L8.2999 0.75626C8.42564 0.634821 8.59404 0.567625 8.76884 0.569144C8.94363 0.570663 9.11084 0.640775 9.23445 0.76438C9.35805 0.887986 9.42817 1.05519 9.42969 1.22999C9.43121 1.40479 9.36401 1.57319 9.24257 1.69893L5.47124 5.47026Z" fill="currentColor" />
        </svg>

    )
}