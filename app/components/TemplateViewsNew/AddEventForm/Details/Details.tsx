import React, { Suspense, useEffect, useRef, useState } from 'react'
import styles from './details.style.module.css'
import Image from 'next/image'
import Placeholder from '/public/placeholder.png'
import AiIcon from '/public/AiIcon.svg'
import UploadIcon from '/public/UploadImageIcon.svg'
import ShareButtons from '@/app/components/DetailPage/ShareButtons'
import DateTimeContainer from './dateandtime/DateTimeContainer'
import LocationContainer from './location/LocationContainer'
import ParticipationContainer from './participation/ParticipationContainer'
import RegistrationForm from './resgistration/RegistrationForm'
import DescriptionContainer from './description/DescriptionContainer'
import SpeakerProfile from './participation/speaker/SpeakerProfile'
import SpeakerModal from './participation/speaker/SpeakerModal'
import ExhibitorContainer from './participation/exhibitor/ExhibitorContainer'
import RegistrationModal from './resgistration/RegistrationModal'
import { useTheme } from '@/context'
import { myFetch } from '@/utils/myFetch'
import { baseUrl } from '@/constants'

interface SpeakerProfileType {
  id: string;
  name: string;
  linkedin: string;
  designation: string;
  profileImage: string | ArrayBuffer | null;
}

interface Props {
  setIsAddEventModalOpen: (value: boolean) => void
  pageBgColor: string;
  eventFont: string;
  widgetId: string;
  fetchEvents: () => Promise<void>;
  addedEventIds: string[]
}
const Details = ({ setIsAddEventModalOpen, pageBgColor, eventFont, widgetId, fetchEvents, addedEventIds }: Props) => {

  const Mapview = React.lazy(() => import('@/app/components/DetailPage/Mapview'));
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [descriptionModal, setDescriptionModal] = useState<boolean>(false)
  const [speakerModal, setSpeakerModal] = useState<boolean>(false)
  const [registerModal, setRegisterModal] = useState<boolean>(false)
  const [description, setDescription] = useState<string>("")
  const [textValue, setTextValue] = useState<string>(description)
  const [participationType, setParticipationType] = useState<string>("Attendee")
  const [speakerProfilesData, setSpeakerProfilesData] = useState<SpeakerProfileType[]>([])
  const [prefilledProfile, setPrefilledProfile] = useState<SpeakerProfileType | undefined>();
  const [registerMessage, setRegisterMessage] = useState<string>("Welcome! To join the event, please register below.")
  const [registerBtnText, setRegisterBtnText] = useState<string>("Register")
  const [registerBtnColor, setRegisterBtnColor] = useState<string>("#1a1a1a")
  const [cityName, setCityName] = useState<string>("")
  const [countryName, setCountryName] = useState<string>("")
  const [timeZone, setTimeZone] = useState<string>("GMT+05:30 Chennai")
  const [timeZoneKey, setTimeZoneKey] = useState<number>(18)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [startTime, setStartTime] = useState<string>("12:00 A.M")
  const [endTime, setEndTime] = useState<string>("12:00 A.M")
  const [eventFormat, setEventFormat] = useState<string>("In-person")
  const [eventName, setEventName] = useState<string>("");

  const handlePrefill = (profile: SpeakerProfileType) => {
    setPrefilledProfile(profile)
    setSpeakerModal(true)
  }
  const { theme } = useTheme()

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
  const deleteSpeaker = (id: string) => {
    setSpeakerProfilesData((prevData) =>
      prevData.filter((p) => p.id !== id)
    );
    setSpeakerModal(false);
    setPrefilledProfile(undefined);
  };

  const updateSpeaker = (updatedProfile: SpeakerProfileType) => {
    setSpeakerProfilesData((prevData) =>
      prevData.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
    setSpeakerModal(false);
    setPrefilledProfile(undefined);
  };

  const handleAddEvent = async () => {
    const eventData = {
      format: eventFormat,
      start_time: startTime,
      end_time: endTime,
      end_date: endDate,
      start_date: startDate,
      description,
      location_city: cityName,
      location_country: countryName,
    };
    const formData = new FormData()
    formData.append("name", eventName)
    formData.append("data", JSON.stringify(eventData))

    const { data, error } = await myFetch(`${baseUrl}/event`, {
      method: 'POST',
      body: formData
    })
    if (data) {
      const eventId = data.data.id
      addEventToWidget(eventId)

      fetchEvents();
      setIsAddEventModalOpen(false)
    }
    if (error) {
      console.log(error)
    }

  }
  const addEventToWidget = async (eventId: string) => {
    const customizedFormData = new FormData()
    const otherData = {
      event: [
        {
          id: eventId,
          name: eventName,
          pageBgColor,
          description,
          eventFont,
          startDate,
          endDate,
          startTime,
          endTime,
          timeZone,
          cityName,
          countryName,
          participationType,
          eventFormat,
          registerBtnColor,
          registerBtnText,
          registerMessage
        },
      ],
    };

    const eventIds = [...addedEventIds, eventId].join(',');

    customizedFormData.append('widgetId', widgetId);
    customizedFormData.append('otherdata', JSON.stringify(otherData))
    customizedFormData.append('eventId', eventIds)
    
    const { data, error } = await myFetch(`${baseUrl}/widget`, {
      method: 'POST',
      body: customizedFormData
    })
    if(data){
      console.log("widget event data", data)
    }
    if(error){
      console.log("error in adding event to widget ", error)
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.btnContainer} style={{ backgroundColor: theme === "dark" ? "#131313" : "#FAFAFA" }}>
        <button className={styles.closeBtn} style={{ color: theme === "dark" ? "white" : "black" }} onClick={() => setIsAddEventModalOpen(false)}>Close</button>
        <button className={styles.addBtn} onClick={handleAddEvent}>Save and Add event</button>
      </div>
      <div className={styles.line}></div>
      <div className={`${styles.detailsContainer} ${descriptionModal || speakerModal || registerModal ? styles.modalOpen : ""}`} style={{ backgroundColor: pageBgColor }}>
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
          <textarea ref={textAreaRef} className={styles.eventName} maxLength={80} placeholder='Event Name' style={{ fontFamily: eventFont }} onChange={(e) => setEventName(e.target.value)} value={eventName} />
          <div className={styles.dateTimeContainer}><DateTimeContainer setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} endTime={endTime} setEndTime={setEndTime} startTime={startTime} setStartTime={setStartTime} timeZone={timeZone} setTimeZone={setTimeZone} timeZoneKey={timeZoneKey} setTimeZoneKey={setTimeZoneKey} /></div>

          <div className={styles.locationContainer}><LocationContainer eventFormat={eventFormat} setEventFormat={setEventFormat} setCityName={setCityName} cityName={cityName} setCountryName={setCountryName} countryName={countryName} /></div>

          <div className={styles.resgitrationContainer}><RegistrationForm registerBtnColor={registerBtnColor} registerBtnText={registerBtnText} registerMessage={registerMessage} setRegisterModal={setRegisterModal} /></div>

          {participationType === "Speaker" ? <div className={styles.speakerProfileContainer}><SpeakerProfile speakerProfilesData={speakerProfilesData} setSpeakerModal={setSpeakerModal} handlePrefill={handlePrefill} /></div> : participationType === "Exhibitor" ? <div><ExhibitorContainer /></div> : <></>}

          {cityName && <Suspense fallback={<div>Loading...</div>}>
            <div className={styles.map}><Mapview latitude={37.7749}
              longitude={-122.4194}
              zoom={6} /></div>
          </Suspense>}
          <div className={styles.descriptionContainer} ><DescriptionContainer setDescriptionModal={setDescriptionModal} description={description} /></div>
        </div>
      </div>
      {descriptionModal && <div className={styles.descriptionModal}>
        <div><span>Add your description</span><span className={styles.close} onClick={() => setDescriptionModal(false)}>Close</span></div>
        <textarea onChange={(e) => setTextValue(e.target.value)} value={textValue} />
        <button onClick={handleDescClick}>Save</button>
      </div>}
      {speakerModal && <div className={styles.speakerModal}>
        <SpeakerModal setSpeakerProfilesData={setSpeakerProfilesData} setSpeakerModal={setSpeakerModal} prefilledProfile={prefilledProfile} deleteSpeaker={deleteSpeaker} updateSpeaker={updateSpeaker} />
      </div>}
      {registerModal && <div className={styles.registerModal}>
        <RegistrationModal registerBtnColor={registerBtnColor} registerBtnText={registerBtnText} registerMessage={registerMessage} setRegisterModal={setRegisterModal} setRegisterBtnColor={setRegisterBtnColor} setRegisterBtnText={setRegisterBtnText} setRegisterMessage={setRegisterMessage} />
      </div>}
    </div>
  )
}

export default Details