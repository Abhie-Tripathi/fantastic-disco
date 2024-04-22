"use client"
import React, { useState, useEffect, useRef } from 'react';
import styles from './notesmodal.style.module.css'
import { Notes } from '@/app/components/eventDetail/Notes';
import SingleEvent from '@/app/components/eventDetail/SingleEvent';
import eventData from '@/public/data/demoEvent.json';
import CloseIcon from '/public/close.svg'
import Image from 'next/image';

interface EventData {
    id: number;
    imageUrl: string;
    name: string;
    description: string;
}
interface NotesProps{
    handleModal : ()=>void
}

const NotesModal = ({handleModal} : NotesProps) => {
    const [userCta, setUserCta] = useState<string>("Notes");
    const [meet, setMeet] = useState(false);
    const leftContainerRef = useRef<HTMLDivElement>(null); // Define leftContainerRef
    const rightContainerRef = useRef<HTMLDivElement>(null); // Define rightContainerRef

    const singledata: EventData | undefined = { id: 12, imageUrl: "https://i.pinimg.com/originals/0f/ab/ea/0fabead80613002cfed665309f3dd6cc.jpg", name: "Great Indian Food Festival", description: "Celebrate the rich diversity of Indian cuisine at the Great Indian Food Festival in Gurgaon. Indulge in a feast for the senses as you explore a myriad of flavors, aromas, and textures from across the subcontinent. From spicy street food to traditional delicacies, the festival showcases the best of Indian culinary heritage. Discover hidden gems, sample regional specialties, and immerse yourself in the vibrant ambiance of this culinary extravaganza. Whether you're a foodie, a gourmand, or simply curious to explore new tastes, the Great Indian Food Festival offers an unparalleled culinary experience that will leave you craving for more." };

    useEffect(() => {
        if (leftContainerRef.current && rightContainerRef.current) {
            const leftContainerHeight = leftContainerRef.current.clientHeight;
            rightContainerRef.current.style.height = leftContainerHeight + 'px';
            console.log(leftContainerHeight);
        }

    }, [singledata]);

    const handleCloseModal = ()=>{
        handleModal()
    }
    return (
        <div className={meet ? `${styles.container} ${styles.fullHeight}` : styles.container}>
            <Image className={styles.closeIcon} src={CloseIcon} alt='X' onClick={handleCloseModal}/>
            <div className={styles.innerContainer}>
                <div className={styles.containerLeft} ref={leftContainerRef}>
                    <div className={styles.containerOne}>
                        {singledata && <SingleEvent data={singledata} />}
                    </div>
                </div>
                <div className={styles.containerRight} ref={rightContainerRef}>
                    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div className={styles.containerBottomRight}>
                            {userCta === "Notes" && <Notes />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotesModal;

