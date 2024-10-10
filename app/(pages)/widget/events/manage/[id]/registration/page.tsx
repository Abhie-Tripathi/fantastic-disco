'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import RegistrationQues from '@/app/components/TemplateViewsNew/Events/Manage/Resgitration/RegistrationQues'
import CapacityModal from '@/app/components/TemplateViewsNew/Events/Manage/Resgitration/CapacityModal'
import useOutsideClick from '@/hooks/useOutsideClick'
import ApprovalModal from '@/app/components/TemplateViewsNew/Events/Manage/Resgitration/ApprovalModal'

const Page = () => {

  const [capacityModal, setCapacityModal] = useState<boolean>(false)
  const [approvalModal, setApprovalModal] = useState<boolean>(false)

  const capacityModalRef = useOutsideClick(() => setCapacityModal(false))
  const approvalModalRef = useOutsideClick(() => setApprovalModal(false))

  return (
    <div className={styles.body}>
      <div className={styles.btnContainer}>
        <button disabled={approvalModal} onClick={()=>setApprovalModal(true)}>
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
      {approvalModal &&
        <div className={styles.modal} ref={approvalModalRef}>
          <ApprovalModal />
        </div>
      }
    </div>
  )
}

export default Page