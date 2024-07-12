'use client'
import React, { useState } from 'react'
import styles from './resourcecard.style.module.css'

interface Props {
    description: string;
    setIsModalOpen: (value: boolean) => void
}

const ResourceCard = ({ description, setIsModalOpen }: Props) => {
    const [isHeartClicked, setIsHeartClicked] = useState(false);

    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = () => {
        setIsFlipped(!isFlipped);
    };

    const handleHeartClick = () => {
        setIsHeartClicked(!isHeartClicked);
    };

    return (
        <div className={styles.cardContainer} onClick={handleClick}>
            <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}>
                <div className={styles.front}>
                    <h4>{description}</h4>
                </div>
                <div className={styles.back}>
                    <p>Back Side Description</p>
                </div>
            </div>
        </div>
    )
}

export default ResourceCard

interface IconProps {
    isClicked: boolean;
}
function DiscussIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="black"><path d="M280-240q-17 0-28.5-11.5T240-280v-80h520v-360h80q17 0 28.5 11.5T880-680v600L720-240H280ZM80-280v-560q0-17 11.5-28.5T120-880h520q17 0 28.5 11.5T680-840v360q0 17-11.5 28.5T640-440H240L80-280Zm520-240v-280H160v280h440Zm-440 0v-280 280Z" /></svg>
    )
}
function HeartIcon({ isClicked }: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill={isClicked ? "red" : "black"}><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" /></svg>
    )
}