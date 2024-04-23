import React, { useState } from 'react'
import styles from './meetingRequests.style.module.css'
import Image from 'next/image'
import person1 from '@/public/person1.svg'
import person2 from '@/public/person2.svg'
import Incorrect from '@/public/incorrect.svg'
import Correct from '@/public/correct.svg'
import Calendar from '@/public/vector.svg'
import meetings from '@/public/data/meetings.json'
import DeclineNote from './DeclineNote'
const MeetingRequest = () => {
  const [decline, setDecline] = useState(false);
  const [acceptedEvent,setAcceptedEvent]=useState({});
  const [id,setId]=useState(-1);
  const declineFun=(val:number)=>{
    setDecline(true);
    setId(val);
    console.log(decline);
    
    // if(!decline) setId(-1);
  }
  const acceptFun=(val:number)=>{
    const data=meetings.find((item)=>item.id===val)
    console.log(data);
    
  }
  return (
    <>
     <div className={styles.req}>
        <div>Meeting Requests</div>
        <div className={styles.newReq}>{meetings.length} New Requests</div>
      </div>
   
    <div className={styles.container}>
     
      <div className={styles.cards}>
        {meetings.map((item, ind) => (
          <>
            <div className={styles.cardContainer}>
              <div>
                <div className={styles.circles}>
                  {ind%2==0 ? (<><div className={styles.circle} data-name="John Doe">
                                <Image className={styles.image} src={person1} alt="person1" />
                            </div>
                            <div className={styles.circle} style={{ marginLeft: "-15px", width: "45px", height: "45px" }} data-name="Akash Jindal">
                                AJ
                            </div></>):(<>
                              <div className={styles.circle} style={{width: "45px", height: "45px" }} data-name="Emily Brown">
                                EB
                            </div>
                            <div className={styles.circle} data-name="Jane Smith" style={{ marginLeft: "-15px", }}>
                                <Image className={styles.image} src={person2} alt="person1" />
                            </div>
                            </>)}
                </div>
              </div>
              <div className={styles.allEventDetail}>
                <div>{item.meeting_heading}</div>
                <div className={styles.linkTime}>
                  <div className={styles.card3}>
                    <Image src={Calendar} alt="Calendar" />
                    <div style={{ fontSize: "10px" }}> 1st  Apr 2024 2:30 PM</div>
                  </div>
                  <div style={{ color: "#999999" }}>{item.meeting_link}</div>
                </div>
                <div className={styles.card4}>
                  <div className={styles.hostBtn}>HOST</div>
                  <div style={{ color: "#8C8EA4", fontSize: "12px" }}>@Robslatexv,@alexia_cohade_1</div>
                </div>
              </div>
              <div className={styles.allCta}>
                <div className={styles.incorrectDiv} onClick={() => declineFun(item.id)}>
                  <Image src={Incorrect} alt="incorrect" />
                  <div className={styles.decAcc} >
                    Decline
                  </div>
                </div>
                {item.id!==id &&
                <div className={styles.correctDiv} onClick={()=>acceptFun(item.id)}>
                <Image src={Correct} alt="correct" />
                <div className={styles.decAcc}>Accept</div>
              </div>
                }
                
              </div>
            </div>
            {decline && item.id === id && <DeclineNote />}
            {item.id !== meetings.length-1 && <div className={styles.line}></div>}
            
          </>
        ))}

        {/* <div className={styles.line}></div> */}
      </div>
    </div>
    </>
  )
}

export default MeetingRequest
