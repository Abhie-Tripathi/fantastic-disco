"use client"
import React, { useState, useEffect, useRef } from 'react';
import styles from './eventdetail.style.module.css'
import { Notes } from '@/app/components/eventDetail/Notes';
import SingleEvent from './SingleEvent';
import EventDescription from './EventDescription';
import Organiser from './Organiser';
import EventPoc from './EventPoc';
import Image from 'next/image';
import CloseIcon from '/public/close.svg'
import Navbar from '@/app/components/internal/eventdetail/navbar/Navbar'
import Follower from './followers/Follower';

interface EventData {
    id: number;
    imageUrl: string;
    name: string;
    description: string;
}
interface Props {
    openEventDetails: boolean
    openOrganiserDetails: boolean
    openPocDetails: boolean
    closeBtn: boolean;
    handleModal?: () => void
}

const EventDetail = ({ openEventDetails, openOrganiserDetails, openPocDetails, closeBtn, handleModal }: Props) => {
    const [activeState, setActiveState] = useState<string>("Notes");
    const [meet, setMeet] = useState(false);
    const leftContainerRef = useRef<HTMLDivElement>(null); // Define leftContainerRef
    const rightContainerRef = useRef<HTMLDivElement>(null); // Define rightContainerRef

    const singledata: EventData = { id: 12, imageUrl: "https://i.pinimg.com/originals/0f/ab/ea/0fabead80613002cfed665309f3dd6cc.jpg", name: "Great Indian Food Festival", description: "Celebrate the rich diversity of Indian cuisine at the Great Indian Food Festival in Gurgaon. Indulge in a feast for the senses as you explore a myriad of flavors, aromas, and textures from across the subcontinent. From spicy street food to traditional delicacies, the festival showcases the best of Indian culinary heritage. Discover hidden gems, sample regional specialties, and immerse yourself in the vibrant ambiance of this culinary extravaganza. Whether you're a foodie, a gourmand, or simply curious to explore new tastes, the Great Indian Food Festival offers an unparalleled culinary experience that will leave you craving for more." };

    useEffect(() => {
        if (leftContainerRef.current && rightContainerRef.current) {
            const leftContainerHeight = leftContainerRef.current.clientHeight;
            rightContainerRef.current.style.height = leftContainerHeight + 'px';
            console.log(leftContainerHeight);
        }

    }, [singledata]);

    const handleCloseModal = () => {
        if (handleModal) {
            handleModal()
        }
    }
    return (
        <div className={meet ? `${styles.container} ${styles.fullHeight}` : styles.container}>
            {closeBtn && <Image className={styles.closeIcon} src={CloseIcon} alt='X' onClick={handleCloseModal} />}
            <div className={styles.innerContainer}>
                <div className={styles.containerLeft} ref={leftContainerRef}>
                    {singledata && <SingleEvent {...singledata} />}
                    <EventDescription description={singledata.description} open={openEventDetails} />
                    <Organiser open={openOrganiserDetails} />
                    <EventPoc open={openPocDetails} />
                </div>
                <div className={styles.containerRight} ref={rightContainerRef}>
                    <Navbar setActiveState = {setActiveState}/>
                    {activeState === "Notes" && <Notes />}
                    {activeState === "Followers" && <Follower/>}
                </div>
            </div>
        </div>
    );
}

export default EventDetail;

