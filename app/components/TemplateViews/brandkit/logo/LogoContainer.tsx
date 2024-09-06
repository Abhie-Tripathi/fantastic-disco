import React from 'react'
import styles from './logocontainer.style.module.css'
import Logo from '/public/10timeslogotwo.png'
import Image from 'next/image'

interface Props {
  setPreview: (value: string) => void
  fetchedLogos : string[]
}

const LogoContainer = ({ setPreview,fetchedLogos }: Props) => {
  return (
    <div className={styles.body} >
      <div className={styles.heading}>Brand Logo</div>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Image src={fetchedLogos[0]} alt='logo' height={40} width={40} />
          <div className={styles.uploadBtn}>
            <input type="file" id='upload' />
            <label htmlFor="upload"><UploadIcon /></label>
          </div>
        </div>
        <div className={styles.addLogo}>
          <AddIcon />
        </div>
      </div>
    </div>
  )
}

export default LogoContainer

function AddIcon() {
  return (
    <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18.8984" width="8.1" height="45" fill="#EADDFF" />
      <rect y="27" width="8.1" height="45" transform="rotate(-90 0 27)" fill="#EADDFF" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.46967 1.0473C5.76257 0.754414 6.23744 0.754414 6.53033 1.0473L8.83523 3.35222L9.23303 3.74997L8.4375 4.54546L8.03977 4.14771L6.5625 2.67046V7.68747V8.24997H5.4375V7.68747V2.67046L3.96025 4.14771L3.5625 4.54546L2.767 3.74997L3.16475 3.35222L5.46967 1.0473ZM10.125 6.93747V10.125H1.875V6.93747V6.37497H0.75V6.93747V10.5C0.75 10.9142 1.08578 11.25 1.5 11.25H10.5C10.9142 11.25 11.25 10.9142 11.25 10.5V6.93747V6.37497H10.125V6.93747Z" fill="black" />
    </svg>

  )
}