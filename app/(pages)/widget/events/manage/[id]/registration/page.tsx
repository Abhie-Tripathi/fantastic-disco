'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import RegistrationQues from '@/app/components/TemplateViewsNew/Events/Manage/Resgitration/RegistrationQues'
import CapacityModal from '@/app/components/TemplateViewsNew/Events/Manage/Resgitration/CapacityModal'
import useOutsideClick from '@/hooks/useOutsideClick'

const Page = () => {

  const [capacityModal, setCapacityModal] = useState<boolean>(false)
  const capacityModalRef = useOutsideClick(() => setCapacityModal(false))

  return (
    <div className={styles.body}>
      <div className={styles.btnContainer}>
        <button>
          <span className={styles.icon1}>A</span>
          <div className={styles.sub_headingContainer}>
            Approval
            <span>On</span>
          </div>
        </button>
        <button disabled={capacityModal} onClick={()=>setCapacityModal(true)}>
          <span className={styles.icon2}>EC</span>
          <div className={styles.sub_headingContainer}>
            Event Capacity
            <span>Unlimited</span>
          </div>
        </button>
      </div>
      <div className={styles.line}></div>
      <RegistrationQues />
      {capacityModal &&
        <div className={styles.modal} ref={capacityModalRef}>
          <CapacityModal />
        </div>
      }
    </div>
  )
}

export default Page