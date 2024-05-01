'use client'
import Image from "next/image";
import styles from './statusDropdown.style.module.css';
import crossIcon from "/public/close.svg";
import AttendeeCard from './AttendeeCard';
import tickIcon from '/public/internal/circle_tick.svg';
import attendeeIcon from '/public/internal/attendee.svg';
import exhibitorIcon from '/public/internal/exhibitor.svg';
import speakerIcon from '/public/internal/speaker.svg';
import sponsorIcon from '/public/internal/sponsor.svg';
import { useTheme } from '@/context';

interface Props {
    handleShortlistModal: () => void
}

const ShortlistModal = ({ handleShortlistModal }: Props) => {

    const closeModal = () => {
        handleShortlistModal();
    }
    const {theme} = useTheme();

    return (
        <div className={styles["modalContainer"]} >
            <div className={`${styles["modal"]} ${theme === 'light' ? styles.modal_light : ""}`} >
                <header className={styles["modal_header"]}>
                    <div className={styles["modal_header-title"]}>Shortlist Event</div>
                    <button className={styles["close"]} onClick={() => closeModal()} >
                        <Image src={crossIcon} alt="clock" width={16} height={16} />
                    </button>
                </header>
                <main className={styles["modal_content"]} style={{ padding: "0 1.8rem" }}>
                    <div className={styles["tag_container"]} >
                        <span className={styles["tag_item"]}>
                            <Image src={attendeeIcon} alt="" width={15} height={15} />
                            Attendee
                            <Image src={tickIcon} alt="" width={13} height={13} />
                        </span>
                        <span className={styles["tag_item"]}>
                            <Image src={speakerIcon} alt="" width={15} height={15} />
                            Speaker
                            <Image src={tickIcon} alt="" width={13} height={13} />
                        </span>
                        <span className={styles["tag_item"]}>
                            <Image src={exhibitorIcon} alt="" width={15} height={15} />
                            Exhibitors</span>
                        <span className={styles["tag_item"]}>
                            <Image src={sponsorIcon} alt="" width={15} height={15} />
                            Sponsors</span>
                    </div>
                    <div className={styles["total_attendee"]}>
                        50 People have shown interest
                    </div>
                    <div style={{ marginTop: "20px", display:"flex", gap:"15px" }}>
                        <AttendeeCard cardType={'Attendee'} />
                        <AttendeeCard cardType={'Speaker'} />
                    </div>
                </main>
                <footer className={styles.modal_footer}>
                    <span className={styles.submitBtn}>Mark as Shortlisted</span>
                </footer>
            </div>
        </div>
    )
}

export default ShortlistModal