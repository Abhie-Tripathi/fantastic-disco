import React from 'react'
import styles from './participation.style.module.css'
import Image from 'next/image'
import ParticipationIcon from '/public/ParticipationIcon.svg'
import AttendeeIcon from '/public/widgetimages/attendeeIcon.svg'
import SpeakerIcon from '/public/widgetimages/speakerIcon.svg'
import ExhibitorIcon from '/public/widgetimages/exhibitorIcon.svg'
import OrganiserIcon from '/public/widgetimages/organiserIcon.svg'
import HappyHoursIcon from '/public/widgetimages/Happyhours.png'
import FoundersIcon from '/public/widgetimages/foundersparty.png'
import CocktailHoursIcon from '/public/widgetimages/cocktailhours.png'

interface Props {
  participationType: string;
  participationMessage: string
}

const ParticipationContainer = ({ participationType, participationMessage }: Props) => {
  const options = [
    { label: 'Attendee', value: 'Attendee', icon: AttendeeIcon },
    { label: 'Speaker', value: 'Speaker', icon: SpeakerIcon },
    { label: 'Exhibitor', value: 'Exhibitor', icon: ExhibitorIcon },
    { label: 'Organiser', value: 'Organiser', icon: OrganiserIcon },
    { label: 'Happy Hours', value: 'HappyHours', icon: HappyHoursIcon },
    { label: 'Cocktail Hours', value: 'CocktailHours', icon: CocktailHoursIcon },
    { label: 'Founders Party', value: 'FoundersParty', icon: FoundersIcon },
  ];
  return (
    <div className={styles.body}>
      {options.map(
        (option) =>
          participationType === option.value && (
            <div key={option.value} className={styles.selectedOption}>
              <div className={styles.option}>
                <Image src={option.icon} alt={`${option.label} icon`} />
                <span>{option.label}</span>
              </div>
            </div>
          )
      )}
      <div
        className={`${styles.line} ${
          styles[`line${participationType.toLowerCase()}`]
        }`}
      ></div>
      <div
        className={`${styles.message} ${
          styles[`message${participationType.toLowerCase()}`]
        }`}
      >
        {participationMessage}
      </div>
    </div>
  );
  
}

export default ParticipationContainer