import React from 'react'
import styles from './host.style.module.css'
import PlaceHolder from '/public/placeholder.png'
import Image from 'next/image'

const HostDetails = () => {
    return (
        <div className={styles.hostDetailsContainer}>
            <Image src={PlaceHolder} alt='company' width={48} height={48} style={{ borderRadius: 12 }} />
            <div className={styles.hostDetails}>
                <div className={styles.hostname}>10 Times</div>
                <div className={styles.hostlocation}>
                    <LocationIcon />
                    <span>Bengaluru, Karnataka</span>
                </div>
                <div className={styles.upcoming}>Upcoming Events <span>N/A</span></div>
                <div className={styles.hosted}>Events Hosted <span>12</span></div>
            </div>
        </div>
    )
}
function LocationIcon() {
    return (
        <svg width="13" height="16" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.966 11.5463L8 15.59L4.03405 11.5463C1.82198 9.29089 1.82198 5.6208 4.03405 3.36537C6.2282 1.1282 9.77179 1.1282 11.966 3.36537C14.178 5.6208 14.178 9.29089 11.966 11.5463ZM13.1707 12.7279L9.18182 16.795L8 18L6.81817 16.795L2.82928 12.7279C-0.0264295 9.81623 -0.0264271 5.09545 2.82928 2.18377C5.685 -0.727923 10.315 -0.727923 13.1707 2.18377C16.0264 5.09545 16.0264 9.81623 13.1707 12.7279ZM9.125 7.3125C9.125 7.93381 8.62131 8.4375 8 8.4375C7.37868 8.4375 6.875 7.93381 6.875 7.3125C6.875 6.69118 7.37868 6.1875 8 6.1875C8.62131 6.1875 9.125 6.69118 9.125 7.3125ZM8 10.125C9.5533 10.125 10.8125 8.8658 10.8125 7.3125C10.8125 5.7592 9.5533 4.5 8 4.5C6.4467 4.5 5.1875 5.7592 5.1875 7.3125C5.1875 8.8658 6.4467 10.125 8 10.125Z" fill="#A1A1A1" />
        </svg>

    )
}
export default HostDetails