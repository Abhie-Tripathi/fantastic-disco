import React from 'react'
import styles from './navbar.style.module.css'
import logo from '/public/croppedlogo.png'
import settingsIcon from '/public/settings.svg'
import Image from 'next/image'

const Navbar = () => {

  return (
    <div className={styles.navbar}>
        <Image className={styles.logo} src={logo} width={45} height={53} alt='logo'/>
        <div className={styles.settings}><Image src={settingsIcon} alt='settings'/></div>
    </div>
  )
}

export default Navbar