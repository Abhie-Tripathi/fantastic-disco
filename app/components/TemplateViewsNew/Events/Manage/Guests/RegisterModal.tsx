import React, { useState } from 'react'
import styles from './registermodal.style.module.css'
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { showToast } from '@/utils/showToast';
import { useEventServices } from '@/services/geniservices/eventService';
interface Props {
    eventId: string;
    setRegisterModal : (value : boolean) => void
    setRegisterValue : (value : boolean) => void
    registerValue : boolean;
    fetchEventData : () => Promise<null | undefined>;
}

const RegisterModal = ({fetchEventData,setRegisterModal, eventId,setRegisterValue,registerValue }: Props) => {
    const {updateEvent,error} = useEventServices()
    const handleChange = async () => {
        const formData = new FormData()
        formData.append("id", eventId);
        formData.append("registration", registerValue + "")
        // const { data, error } = await myFetch(`${baseUrl}/event`, {
        //     method: 'PATCH',
        //     body: formData
        // })
        const data:any = updateEvent(formData);
        if(data){
            console.log("response data ,", data)
            await new Promise((resolve) => setTimeout(resolve, 100));
            showToast("success", "Registration changes updated")
            setRegisterModal(false)
            fetchEventData()
        }else{
            console.log("error",error)
        }
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
                    checked = {registerValue}
                    onChange={()=>setRegisterValue(!registerValue)}
                />
                <label htmlFor="register" className={styles.checkBox}></label>
            </div>
            <button className={styles.confirmBtn} onClick={handleChange}>Confirm</button>
        </div>
    )
}

export default RegisterModal