'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import RegistrationQues from '@/app/components/TemplateViewsNew/Events/Manage/Resgitration/RegistrationQues'
import CapacityModal from '@/app/components/TemplateViewsNew/Events/Manage/Resgitration/CapacityModal'
import useOutsideClick from '@/hooks/useOutsideClick'
import ApprovalModal from '@/app/components/TemplateViewsNew/Events/Manage/Resgitration/ApprovalModal'
import { useEventContext } from '@/context/eventcontext'

const Page = () => {

  const {fetchEventData, eventId, fetchedEvent } = useEventContext();

  const [capacityModal, setCapacityModal] = useState<boolean>(false)
  const [approvalModal, setApprovalModal] = useState<boolean>(false)
  const [approvalValue, setApprovalValue] = useState<boolean>(fetchedEvent?.approval && fetchedEvent?.approval === true ? true : false)
  const [capacityValue, setCapacityValue] = useState<number>(0)
  const [waitlistValue, setWaitlistValue] = useState<boolean>(fetchedEvent?.waitlisting && fetchedEvent?.waitlisting === true ? true : false)

  const capacityModalRef = useOutsideClick(() => setCapacityModal(false))
  const approvalModalRef = useOutsideClick(() => setApprovalModal(false))

  useEffect(() => {
    setApprovalValue(fetchedEvent?.approval && fetchedEvent?.approval === true ? true : false)
    setCapacityValue(fetchedEvent?.capacity || 0)
    setWaitlistValue(fetchedEvent?.waitlisting && fetchedEvent?.waitlisting === true ? true : false)
  }, [fetchedEvent])

  return (
    <div className={styles.body}>
      <div className={styles.btnContainer}>
        <button disabled={approvalModal} onClick={() => setApprovalModal(true)}>
          <span className={styles.icon1}>A</span>
          <div className={styles.sub_headingContainer}>
            Approval
            <span>{fetchedEvent?.approval === true ? "On" : "Off" }</span>
          </div>
        </button>
        <button disabled={capacityModal} onClick={() => setCapacityModal(true)}>
          <span className={styles.icon2}>EC</span>
          <div className={styles.sub_headingContainer}>
            Event Capacity
            <span className={styles.capacity}>
              <span>{fetchedEvent?.capacity === -1 ? "Unlimited" : fetchedEvent?.capacity}</span>
              <span className={styles.dot}>{"."}</span>
              <span>{waitlistValue ? "Waitlist On" : "Waitlist Off"}</span>
            </span>
          </div>
        </button>
      </div>
      <div className={styles.line}></div>
      <RegistrationQues />
      {capacityModal &&
        <div className={styles.modal} ref={capacityModalRef}>
          <CapacityModal fetchEventData={fetchEventData} waitlistValue={waitlistValue} setWaitlistValue={setWaitlistValue} eventId={eventId} capacityValue={capacityValue} setCapacityValue={setCapacityValue} setCapacityModal={setCapacityModal} />
        </div>
      }
      {approvalModal &&
        <div className={styles.modal} ref={approvalModalRef}>
          <ApprovalModal fetchEventData={fetchEventData} eventId={eventId} approvalValue={approvalValue} setApprovalValue={setApprovalValue} setApprovalModal={setApprovalModal} />
        </div>
      }
    </div>
  )
}

export default Page