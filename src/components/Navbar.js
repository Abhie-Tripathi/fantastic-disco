import React from 'react'
import styles from './navbar.style.module.css'
import logo from '../assets/croppedlogo.png'
import settingsIcon from '../icons/settings.svg'

const Navbar = () => {
  return (
    <div className={styles.navbar}>
        <img className={styles.logo} src={logo} width={45} height={53}/>
        <div className={styles.settings}><img src={settingsIcon} /></div>
    </div>
  )
}

export default Navbar