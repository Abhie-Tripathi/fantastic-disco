import React, { useState } from 'react'
import styles from './inviteguest.style.module.css'
import InviteGuestsFirstScreen from './InviteGuestsFirstScreen';
import InviteGuestsSecScreen from './InviteGuestsSecScreen';
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { showToast } from '@/utils/showToast';

interface Props {
  eventId: string;
}

const InviteGuest = ({ eventId }: Props) => {

  const maxCount = 15;
  const [count, setCount] = useState(4); // Default starting count
  const [screen, setScreen] = useState<string>("first");
  const [selectedMails, setSelectedMails] = useState<string[]>([])

  const console_url = process.env.NEXT_PUBLIC_CONSOLE_PAGE_DOMAIN
  const handleSubmit = async () => {
    const newObj = {
      emails: selectedMails.join(),
      eventId,
      redirectUrl: `${console_url}/detailpage/${eventId}`
    }
    console.log(newObj)
    const { data, error } = await myFetch(`${baseUrl}/invite/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newObj),

    })
    if (data) {
      showToast('success', "Invitation sent")
    } else {
      showToast('error', "Error sending invitation")
    }
  }

  const percentageFilled = (count / maxCount) * 100;
  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <div className={styles.heading}>Invite Guests</div>
        <div className={styles.counterContainer}>
          <div
            className={styles.counter}
            style={{
              background: `conic-gradient(#4caf50 ${percentageFilled}%, #e0e0e0 0)`,
            }}
          ></div>
          <div>{15 - count} left</div>
        </div>
      </div>
      <div className={styles.line}></div>
      {screen === "first" ? <InviteGuestsFirstScreen selectedMails={selectedMails} setSelectedMails={setSelectedMails} /> :
        <InviteGuestsSecScreen selectedMails={selectedMails} />}
      <div className={styles.line}></div>
      <div className={styles.selectedBtnContainer}>
        <div>0 Selected</div>
        {screen === "first" ? <button onClick={() => setScreen("second")} className={styles.nextBtn}>Next</button> :
          <div className={styles.btnContainer}>
            <button onClick={() => setScreen("first")} className={styles.nextBtn}>Back</button>
            <button className={styles.nextBtn} onClick={handleSubmit}>Send Invites</button>
          </div>}
      </div>

    </div>
  )
}

export default InviteGuest