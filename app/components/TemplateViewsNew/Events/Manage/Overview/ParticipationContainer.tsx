import React from 'react'
import styles from './participation.style.module.css'
import AttendeeIcon from '/public/widgetimages/attendeeIcon.svg'
import SpeakerIcon from '/public/widgetimages/speakerIcon.svg'
import ExhibitorIcon from '/public/widgetimages/exhibitorIcon.svg'
import OrganiserIcon from '/public/widgetimages/organiserIcon.svg'
import HappyHoursIcon from '/public/widgetimages/Happyhours.png'
import FoundersIcon from '/public/widgetimages/foundersparty.png'
import CocktailHoursIcon from '/public/widgetimages/cocktailhours.png'
import Image from 'next/image'

interface Props {
    participationType?: string;
}

const ParticipationContainer = ({ participationType }: Props) => {

    const participationImage = participationType === "Attendee" ? AttendeeIcon : 
    participationType === "Speaker" ? SpeakerIcon : 
    participationType === "Exhibitor" ? ExhibitorIcon : 
    participationType === "Organiser" ? OrganiserIcon: 
    participationType === "HappyHours" ? HappyHoursIcon : 
    participationType === "CocktailHours" ? CocktailHoursIcon : 
    participationType === "FoundersParty" ? FoundersIcon : ""

    return (
        <div className={styles.body}>
            <Image src={participationImage} alt='icon'/>
            <div className={styles.type}>{participationType}</div>
        </div>
    )
}

export default ParticipationContainer