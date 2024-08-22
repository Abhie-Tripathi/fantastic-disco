import React from 'react'
import styles from './logocontainer.style.module.css'
import Logo from '/public/10timeslogotwo.png'
import Image from 'next/image'

interface Props {
  setPreview: (value: string) => void
}

const LogoContainer = ({ setPreview }: Props) => {
  return (
    <div className={styles.body} >
      <div className={styles.heading}>Brand Logo</div>
      <div className={styles.container} onClick={() => setPreview("logo")}>
        <div className={styles.logoContainer}>
          <Image src={Logo} alt='logo' height={40} width={40} />
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