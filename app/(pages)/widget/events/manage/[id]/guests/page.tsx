'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import GuestList from '@/app/components/TemplateViewsNew/Events/Manage/Guests/GuestList'
import RegisterModal from '@/app/components/TemplateViewsNew/Events/Manage/Guests/RegisterModal'
import useOutsideClick from '@/hooks/useOutsideClick'

const Page = () => {
  const [registerModal, setRegisterModal] = useState<boolean>(false);
  const registerModalRef = useOutsideClick(() => setRegisterModal(false))
  return (
    <div className={styles.body}>
      <div className={styles.btnContainer}>
        <button>
          <span className={styles.icon1}>I</span>
          Invite Guests
        </button>
        <button onClick={() => setRegisterModal(!registerModal)}>
          <span className={styles.icon2}>R</span>
          <div className={styles.sub_headingContainer}>
            Registration
            <span>Open</span>
          </div>
        </button>
        <button>
          <span className={styles.icon3}>GR</span>
          <div className={styles.sub_headingContainer}>
            Group Registration
            <span>On</span>
          </div>
        </button>
      </div>
      <GuestList />
      {registerModal && <div className={styles.registerModal} ref={registerModalRef}>
        <RegisterModal/>
      </div>}
    </div>
  )
}

export default Page