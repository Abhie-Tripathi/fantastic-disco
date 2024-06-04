import React from 'react'
import styles from './trackerUser.style.module.css'
import Person1 from '/public/person1.svg';
import Image from 'next/image';
const index = () => {
  return (
    <div className={styles.container}>
      <div className={styles.conatinerFirst}>
        <div className={styles.owner}>Tracker Users</div>
        <div className={styles.add}>Add Users</div>
      </div>
      <div className={styles.bar}></div>
      <div className={styles.profiles}>
      {Array.from({ length: 5 }).map((_, index) => (
        <>
        <div className={styles.profile}>
          <div className={styles.profileInner}>
          <div className={styles.square}>-</div>
          <div><Image src={Person1} alt="person1"/></div>
          <div>
            <div className={styles.name}>Rob Slate <span className={styles.tag}>@Robslatexv</span></div>
            <div className={styles.email}>robslatexv@acmen.com</div>
          </div>
          </div>
          <div className={styles.add} style={{textDecoration:"none"}}>Super Admin</div>
        </div>
        <div className={styles.profile}>
          <div className={styles.profileInner}>
          <div className={styles.square}>-</div>
          <div><Image src={Person1} alt="person1"/></div>
          <div>
            <div className={styles.name}>Rob Slate <span className={styles.tag}>@Robslatexv</span></div>
            <div className={styles.email}>robslatexv@acmen.com</div>
          </div>
          </div>
          <div className={styles.add} style={{textDecoration:"none"}}>Super Admin</div>
        </div>
        </>
        ))}
      </div>
    </div>
  )
}

export default index
