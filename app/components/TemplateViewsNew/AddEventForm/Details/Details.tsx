import React, { useEffect, useRef, useState } from 'react'
import styles from './details.style.module.css'
import Image from 'next/image'
import Placeholder from '/public/placeholder.png'
import AiIcon from '/public/AiIcon.svg'
import UploadIcon from '/public/UploadImageIcon.svg'
import ShareButtons from '@/app/components/DetailPage/ShareButtons'
import DateTimeContainer from './dateandtime/DateTimeContainer'
import LocationContainer from './location/LocationContainer'
import ParticipationContainer from './participation/ParticipationContainer'
import RegistrationForm from './RegistrationForm'
import DescriptionContainer from './description/DescriptionContainer'
import SpeakerProfile from './participation/SpeakerProfile'
import SpeakerModal from './participation/SpeakerModal'

interface SpeakerProfileType {
  name: string;
  linkedin: string;
  designation: string;
  profileImage: string | ArrayBuffer | null;
}

interface Props {
  setIsAddEventModalOpen: (value: boolean) => void
  pageBgColor: string;
  eventFont: string;
}
const Details = ({ setIsAddEventModalOpen, pageBgColor, eventFont }: Props) => {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [descriptionModal, setDescriptionModal] = useState<boolean>(false)
  const [speakerModal, setSpeakerModal] = useState<boolean>(false)
  const [description, setDescription] = useState<string>("")
  const [textValue, setTextValue] = useState<string>("")
  const [participationType, setParticipationType] = useState<string>("Attendee")

  const [speakerProfilesData, setSpeakerProfilesData] = useState<SpeakerProfileType[]>([])


  useEffect(() => {
    const adjustHeight = () => {
      const textArea = textAreaRef.current;
      if (textArea) {
        textArea.style.height = 'auto'; // Reset the height
        textArea.style.height = `${textArea.scrollHeight}px`; // Set the height to the scroll height
      }
    };

    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.addEventListener('input', adjustHeight);
      adjustHeight(); // Initial adjustment
    }

    return () => {
      if (textArea) {
        textArea.removeEventListener('input', adjustHeight);
      }
    };
  }, []);

  const handleDescClick = () => {
    setDescription(textValue)
    setDescriptionModal(false)
  }

  useEffect(() => {
    console.log(speakerProfilesData)
  }, [speakerProfilesData])

  return (
    <div className={styles.body}>
      <div className={styles.btnContainer}>
        <button className={styles.closeBtn} onClick={() => setIsAddEventModalOpen(false)}>Close</button>
        <button className={styles.addBtn}>Save and Add event</button>
      </div>
      <div className={styles.line}></div>
      <div className={`${styles.detailsContainer} ${descriptionModal || speakerModal ? styles.modalOpen : ""}`} style={{ backgroundColor: pageBgColor }}>
        <div className={styles.leftSection}>
          <div className={styles.posterContainer}>
            <Image src={Placeholder} alt='Poster' width={296} height={290} style={{ borderRadius: 20 }} />
            <div className={styles.posterIcons}>
              <div>
                <Image src={AiIcon} alt='aigenerate' className={styles.aiIcon}></Image>
              </div>
              <div>
                <Image src={UploadIcon} alt='upload'></Image>
              </div>
            </div>
          </div>
          <div className={styles.participationContainer}><ParticipationContainer setParticipationType={setParticipationType} participationType={participationType} /></div>
          <div className={styles.shareContainer}>
            <div className={styles.heading}>Share</div>
            <ShareButtons shareUrl='www.10times.com' />
          </div>
        </div>
        <div className={styles.rightSection}>
          <textarea ref={textAreaRef} className={styles.eventName} maxLength={80} placeholder='Event Name' style={{ fontFamily: eventFont }}></textarea>
          <div className={styles.dateTimeContainer}><DateTimeContainer /></div>
          <div className={styles.locationContainer}><LocationContainer /></div>
          <div className={styles.resgitrationContainer}><RegistrationForm /></div>
          {participationType === "Speaker" && <div className={styles.speakerProfileContainer}><SpeakerProfile speakerProfilesData={speakerProfilesData} setSpeakerModal={setSpeakerModal} /></div>}
          <div className={styles.descriptionContainer} ><DescriptionContainer setDescriptionModal={setDescriptionModal} description={description} /></div>
        </div>
      </div>
      {descriptionModal && <div className={styles.descriptionModal}>
        <div><span>Add your description</span><span className={styles.close} onClick={() => setDescriptionModal(false)}>Close</span></div>
        <textarea onChange={(e) => setTextValue(e.target.value)} value={textValue} />
        <button onClick={handleDescClick}>Save</button>
      </div>}
      {speakerModal && <div className={styles.speakerModal}>
        <SpeakerModal setSpeakerProfilesData={setSpeakerProfilesData} setSpeakerModal={setSpeakerModal} />
      </div>}
    </div>
  )
}

export default Details