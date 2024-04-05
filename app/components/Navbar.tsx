import React from 'react'
import styles from './navbar.style.module.css'
import logo from '/public/croppedlogo.png'
import settingsIcon from '/public/settings.svg'
import Image from 'next/image'
import Link from 'next/link'

const Navbar = () => {

  return (
    <div className={styles.navbar}>
        <Image className={styles.logo} src={logo} width={45} height={53} alt='logo'/>
        <Link href={'/widget'} className={styles.settings}><Image src={settingsIcon} alt='settings'/></Link>
    </div>
  )
}

export default Navbar