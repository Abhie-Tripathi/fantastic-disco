import React, { useEffect, useState } from 'react'
import styles from './inviteguest.style.module.css'
import InviteGuestsFirstScreen from './InviteGuestsFirstScreen';
import InviteGuestsSecScreen from './InviteGuestsSecScreen';
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { showToast } from '@/utils/showToast';

interface Props {
  eventId: string;
  setInviteGuestModal : (value : boolean)=> void
}

const InviteGuest = ({ eventId, setInviteGuestModal }: Props) => {

  const [count, setCount] = useState(4); // Default starting count
  const [screen, setScreen] = useState<string>("first");
  const [selectedMails, setSelectedMails] = useState<string[]>([])
  const [suggestedMails, setSuggestedMails] = useState<string[]>([]) // This is array for showing the suggested mails
  const maxCount = 15

  const console_url = process.env.NEXT_PUBLIC_CONSOLE_PAGE_DOMAIN

  const [suggestedMailQuery, setSuggestedMailQuery] = useState<string>("")

  const fetchSuggestions = async()=>{
    let url = `${baseUrl}/invite`
    if(suggestedMailQuery.length > 0){
      url+=`?q=${suggestedMailQuery}`
    }
    const {data, error} = await myFetch(`${url}`)
    let emailArray : string[] = []
    if(error){
      console.log("error occured", error)
    }else{
      data.invite.map((email : any)=>{
        emailArray.push(email.email)
      })
    }
    setSuggestedMails(emailArray)
  }

  const fetchInviteCount = async()=>{
    const {data, error} = await myFetch(`${baseUrl}/invite?invites=true`)
    if(data){
      setCount(data.inviteCount)
    }else{
      console.log("error is", error)
    }
  }
  useEffect(()=>{
    fetchSuggestions()
    fetchInviteCount()
  },[suggestedMailQuery])

  const handleSubmit = async () => {
    if(selectedMails.length === 0){
      showToast("warning","Select or Enter atleast one email to send invite")
      return;
    }
    const newObj = {
      emails: selectedMails.join(),
      eventId,
      redirectUrl: `${console_url}/detailpage/${eventId}`
    }
    const { data, error } = await myFetch(`${baseUrl}/invite/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newObj),

    })
    if (data) {
      showToast('success', "Invitation sent")
      setInviteGuestModal(false)
    } else {
      showToast('error', "Error sending invitation")
    }
  }

  const percentageFilled = ((maxCount-count) / maxCount) * 100;
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
          <div>{count < 0 ? "0" : count} left</div>
        </div>
      </div>
      <div className={styles.line}></div>
      {screen === "first" ? <InviteGuestsFirstScreen setSuggestedMailQuery={setSuggestedMailQuery}  suggestedMails={suggestedMails} selectedMails={selectedMails} setSelectedMails={setSelectedMails} /> :
        <InviteGuestsSecScreen selectedMails={selectedMails} />}
      <div className={styles.line}></div>
      <div className={styles.selectedBtnContainer}>
        <div>0 Selected</div>
        {/* {screen === "first" ? <button onClick={() => setScreen("second")} className={styles.nextBtn}>Next</button> :
          <div className={styles.btnContainer}>
            <button onClick={() => setScreen("first")} className={styles.nextBtn}>Back</button>
            <button className={styles.nextBtn} onClick={handleSubmit}>Send Invites</button>
          </div>} */}
          
          <div className={styles.btnContainer}>
            {/* <button onClick={() => setScreen("first")} className={styles.nextBtn}>Back</button> */}
            <button className={styles.nextBtn} onClick={handleSubmit}>Send Invites</button>
          </div>
      </div>

    </div>
  )
}

export default InviteGuest