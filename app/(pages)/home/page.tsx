import React from 'react'
import styles from './page.style.module.css'
import Link from 'next/link'

const Page = () => {
    return (
        <div className={styles.body}>
            <div>Home Page, Showing Visuals and Videos of Eventgeni Widgets</div>
            <Link href={"/onboard"} className={styles.signupBtn}>Sign Up</Link>
        </div>
    )
}

export default Page