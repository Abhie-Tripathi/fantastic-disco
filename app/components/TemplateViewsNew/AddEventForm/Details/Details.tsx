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
import usePosterGenerator from '@/app/service/posterGenerator'
import { AllEventsType } from '@/types/alleventtype'
import DescriptionModal from './description/DescriptionModal'
import useHashtagsGenerator from '@/hooks/useHashtagsGenerator'
import HashtagContainer from './Hashtags/HashtagContainer'
import MapView from '@/app/components/DetailPage/Mapview'
import { showToast } from "@/utils/showToast";
import SideEventIcon from '/public/sideevent.svg'

interface SpeakerProfileType {
  id: string;
  name: string;
  linkedin: string;
  designation: string;
  // profileImage: string | ArrayBuffer | null;
  profileImage: File | null
}
interface ImageState {
  placeHolder: any;
  file: File | null;
}
interface Props {
  prefilledEvent?: AllEventsType
  pageBgColor: string;
  eventFont: string;
  eventName: string;
  setEventName: (value: string) => void;
  cityName: string;
  setCityName: (value: string) => void;
  participationType: string;
  setParticipationType: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  textValue: string;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  speakerProfilesData: SpeakerProfileType[];
  setSpeakerProfilesData: React.Dispatch<React.SetStateAction<SpeakerProfileType[]>>;
  prefilledProfile?: SpeakerProfileType;
  setPrefilledProfile: React.Dispatch<React.SetStateAction<SpeakerProfileType | undefined>>;
  registerMessage: string;
  setRegisterMessage: React.Dispatch<React.SetStateAction<string>>;
  registerBtnText: string;
  setRegisterBtnText: React.Dispatch<React.SetStateAction<string>>;
  registerBtnColor: string;
  setRegisterBtnColor: React.Dispatch<React.SetStateAction<string>>;
  countryName: string;
  setCountryName: React.Dispatch<React.SetStateAction<string>>;
  timeZone: string;
  setTimeZone: React.Dispatch<React.SetStateAction<string>>;
  timeZoneKey: number;
  setTimeZoneKey: React.Dispatch<React.SetStateAction<number>>;
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  startTime: string;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  endTime: string;
  setEndTime: React.Dispatch<React.SetStateAction<string>>;
  eventFormat: string;
  setEventFormat: React.Dispatch<React.SetStateAction<string>>;
  boothNumber: string;
  setBoothNumber: React.Dispatch<React.SetStateAction<string>>;
  participationMessage: string;
  setParticipationMessage: React.Dispatch<React.SetStateAction<string>>;
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  banner: ImageState;
  setBanner: React.Dispatch<React.SetStateAction<ImageState>>;
  venue: string;
  setVenue: React.Dispatch<React.SetStateAction<string>>;
  latitude: number;
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
  longitude: number;
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  hashtags: string[];
  setHashtags: React.Dispatch<React.SetStateAction<string[]>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  isEventNameEmpty: boolean;
  setIsEventNameEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  isEventFormatEmpty: boolean;
  setIsEventFormatEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  isEventDescriptionEmpty: boolean;
  setIsEventDescriptionEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  isEventParticipationEmpty: boolean;
  setIsEventParticipationEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  isParticipationMessageEmpty: boolean;
  setIsParticipationMessageEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  isTextValueMessageEmpty: boolean;
  setIsTextValueMessageEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setCollapseMainEventForm: React.Dispatch<React.SetStateAction<boolean>>;
  collapseMainEventForm: boolean;
}
const Details = ({ prefilledEvent, pageBgColor, eventFont, eventName, setEventName, cityName, setCityName, participationType, setParticipationType, description, setDescription, textValue, setTextValue, speakerProfilesData, setSpeakerProfilesData, prefilledProfile, setPrefilledProfile, registerMessage, setRegisterMessage, registerBtnText,
  setRegisterBtnText, registerBtnColor, setRegisterBtnColor, countryName, setCountryName, timeZone, setTimeZone, timeZoneKey, setTimeZoneKey, startDate, setStartDate, endDate, setEndDate, startTime, setStartTime, endTime, setEndTime, eventFormat, setEventFormat, boothNumber, setBoothNumber, participationMessage, setParticipationMessage,
  setLoadingState, banner, setBanner, venue, setVenue, latitude, setLatitude, longitude, setLongitude, fileInputRef, hashtags, setHashtags, query, setQuery, isEventNameEmpty, setIsEventNameEmpty, isEventFormatEmpty, setIsEventFormatEmpty, isEventDescriptionEmpty, setIsEventDescriptionEmpty, isEventParticipationEmpty, setIsEventParticipationEmpty, isParticipationMessageEmpty, setIsParticipationMessageEmpty, isTextValueMessageEmpty, setIsTextValueMessageEmpty, errorMessage, setErrorMessage, setCollapseMainEventForm, collapseMainEventForm }: Props) => {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [descriptionModal, setDescriptionModal] = useState<boolean>(false)
  const [speakerModal, setSpeakerModal] = useState<boolean>(false)
  const [registerModal, setRegisterModal] = useState<boolean>(false)
  const { isLoading, imageUrl, generatePrompt } = usePosterGenerator();
  const { loadingState, generateHashtags, generatedHashtags } = useHashtagsGenerator();


  const handlePrefill = (profile: SpeakerProfileType) => {
    setPrefilledProfile(profile)
    setSpeakerModal(true)
  }
  const { theme } = useTheme()

  const handleDescClick = () => {
    setDescription(textValue)
    setDescriptionModal(false)
    setTextValue(textValue.trim())
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setBanner({ placeHolder: fileUrl, file });
    }
  };


  const handleGeneratePoster = () => {
    if (!isLoading) { // if poster is in generaing state, the handle poster function should not work
      if (eventName && participationMessage) {
        generatePrompt(participationMessage, description, eventName, 1024, 1024)
      } else {
        showToast("error", "Please provide Event name, Description, and participationMessage to generate the Banner");
      }
    } else {
      showToast("error", "Please wait for the banner to generate first before generating again");
    }
  }
  const handleTagsGenerate = () => {
    if (!loadingState) {
      if (description && eventName) {
        generateHashtags(eventName, description)
      }
    }
  }
  useEffect(() => {
    // if (!prefilledAddedEvent && !banner.file) { // we dont want the poster to start generating it self if prefilled event is there
    //   if (description && eventName && countryName) {
    //     generatePrompt(countryName, description, eventName, 1024, 1024)
    //   }
    // }
    if (!prefilledEvent) {
      if (description && eventName) {
        generateHashtags(eventName, description)
      }
    }
  }, [description, eventName, countryName])

  useEffect(() => {
    if (loadingState || isLoading) {
      setLoadingState(true)
    } else {
      setLoadingState(false)
    }
  }, [loadingState, isLoading])

  useEffect(() => {
    if (!prefilledEvent) {
      setHashtags(generatedHashtags)
    }
  }, [generatedHashtags])

  useEffect(() => {
    if (imageUrl) {
      setBanner({ placeHolder: imageUrl, file: null });
    }
  }, [imageUrl]);

  const handleInputChange = (value: string) => {
    console.log("value typed : ", value)
    const specialCharRegex = /[@#$%^&*"|<>]/g;
    setIsEventNameEmpty(false)
    if (specialCharRegex.test(value)) {
      showToast("error", "Please check, input should not contain any special character");
    } else {
      setEventName(value);
      if (value.trim() === "") {
        setIsEventNameEmpty(true);
      }
    }
  };
  return (
    <div className={styles.body}>
      {collapseMainEventForm ?
        <div className={styles.collapsedContainer}>
          <div className={styles.collapsedSubContainer}>
            <div>
              <DescIcon />
              <span>Main Event</span>
            </div>
            <div className={styles.collapseBtn} onClick={()=>setCollapseMainEventForm(false)}><DownArrow /></div>
          </div>
        </div> :
        <div className={`${styles.detailsContainer} ${descriptionModal || speakerModal || registerModal ? styles.modalOpen : ""}`} >
          <div>
            <div className={`${styles.participationContainer}`}><ParticipationContainer type='widget' size="large" participationMessage={participationMessage} setParticipationMessage={setParticipationMessage} setParticipationType={setParticipationType} participationType={participationType} isEventParticipationEmpty={isEventParticipationEmpty} setIsEventParticipationEmpty={setIsEventParticipationEmpty} isParticipationMessageEmpty={isParticipationMessageEmpty} setIsParticipationMessageEmpty={setIsParticipationMessageEmpty} /></div>
            {isEventParticipationEmpty && <p className={styles.errorMessage}>Please select any mode of participation.</p>}
          </div>
          <div className={styles.sections}>
            <div className={styles.leftSection}>
              <div className={styles.posterContainer}>
                {isLoading ?
                  <div className={styles.loader}>
                    <div className={styles.spinner}></div>
                  </div> : <Image src={banner.placeHolder} alt='Poster' width={296} height={290} style={{ borderRadius: 20, objectFit: "cover" }} unoptimized />}
                <div className={styles.posterIcons}>
                  <div onClick={handleGeneratePoster} data-name={eventName && participationMessage ? "Generate your Banner" : "Add Event name and participationMessage to generate a banner"}>
                    <Image src={AiIcon} alt='aigenerate' className={styles.aiIcon}></Image>
                  </div>
                  <div data-name="Upload Your Banner" onClick={() => fileInputRef.current?.click()}>
                    <Image src={UploadIcon} alt='upload'></Image>
                    <input type="file" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} ref={fileInputRef} />
                  </div>
                </div>
              </div>
              <div className={styles.hashtagsContainer}>
                <HashtagContainer loadingState={loadingState} hashtags={hashtags} setHashtags={setHashtags} handleTagsGenerate={handleTagsGenerate} />
              </div>
              <div className={styles.shareContainer}>
                <div className={styles.heading}>Share</div>
                <ShareButtons disabled={true} shareUrl='www.10times.com' />
              </div>
            </div>
            <div className={styles.rightSection}>
              {/* <textarea ref={textAreaRef} className={`${styles.eventName} ${isEventNameEmpty ? styles.errorHighlight : ""} `} maxLength={80} placeholder='Event Name' style={{ fontFamily:prefilledAddedEvent?.eventFont || eventFont }} onChange={(e) => setEventName(e.target.value)} value={eventName} /> */}
              <div>
                <textarea
                  ref={textAreaRef}
                  className={`${styles.eventName} ${isEventNameEmpty ? styles.errorBackground : ""}`}
                  maxLength={80}
                  placeholder='Event Name'
                  style={{ fontFamily: prefilledEvent?.customizationData.eventFont || eventFont }}
                  onChange={(e) => handleInputChange(e.target.value)}
                  value={eventName}
                />
                {isEventNameEmpty && <p className={styles.errorMessage}>{errorMessage}</p>}
              </div>
              <div className={styles.dateTimeContainer}><DateTimeContainer setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} endTime={endTime} setEndTime={setEndTime} startTime={startTime} setStartTime={setStartTime} timeZone={timeZone} setTimeZone={setTimeZone} timeZoneKey={timeZoneKey} setTimeZoneKey={setTimeZoneKey} /></div>
              <div>
                <div className={`${styles.locationContainer}`} ><LocationContainer setLatitude={setLatitude} setLongitude={setLongitude} eventFormat={eventFormat} setEventFormat={setEventFormat} setCityName={setCityName} cityName={cityName} setCountryName={setCountryName} countryName={countryName} isEventFormatEmpty={isEventFormatEmpty} query={query} setQuery={setQuery} setIsEventFormatEmpty={setIsEventFormatEmpty} /></div>
                {isEventFormatEmpty && <span className={styles.errorMessage}>Event location is required.</span>}
              </div>
              <div className={styles.resgitrationContainer}><RegistrationForm registerBtnColor={registerBtnColor} registerBtnText={registerBtnText} registerMessage={registerMessage} setRegisterModal={setRegisterModal} /></div>
              <div>
                <div className={`${styles.descriptionContainer}`} ><DescriptionContainer setDescriptionModal={setDescriptionModal} description={description} isEventDescriptionEmpty={isEventDescriptionEmpty} setIsEventDescriptionEmpty={setIsEventDescriptionEmpty} /></div>
                {isTextValueMessageEmpty && isEventDescriptionEmpty && <span className={styles.errorMessage}>Event description is required.</span>}
              </div>
              {participationType === "Speaker" ? <div className={styles.speakerProfileContainer}><SpeakerProfile speakerProfilesData={speakerProfilesData} setSpeakerModal={setSpeakerModal} handlePrefill={handlePrefill} /></div> : participationType === "Exhibitor" ? <div><ExhibitorContainer setBoothNumber={setBoothNumber} boothNumber={boothNumber} /></div> : <></>}

              {cityName &&
                // <div className={styles.map} ref={mapDivRef}>
                // <Suspense fallback={<div>Loading...</div>}>
                <MapView latitude={latitude}
                  longitude={longitude}
                  venue={cityName}
                  zoom={6} />
                // </Suspense>
                // </div>
              }
              <div className={styles.sideEventContainer}>
                <div className={styles.sideEventSubContainer}>
                  <Image src={SideEventIcon} alt='sideevent' />
                  <div
                    className={styles.sideEventHeading}
                  >
                    Do you wish to add a side event ?
                  </div>
                </div>
                <button onClick={() => setCollapseMainEventForm(true)}>Yes</button>
              </div>
            </div>
          </div>
        </div>}
      {
        descriptionModal && <div className={styles.descriptionModal}>
          <DescriptionModal setDescriptionModal={setDescriptionModal} textValue={textValue} setTextValue={setTextValue} handleDescClick={handleDescClick} />
        </div>
      }
      {
        speakerModal && <div className={styles.speakerModal}>
          <SpeakerModal setSpeakerProfilesData={setSpeakerProfilesData} setSpeakerModal={setSpeakerModal} prefilledProfile={prefilledProfile} deleteSpeaker={deleteSpeaker} updateSpeaker={updateSpeaker} />
        </div>
      }
      {
        registerModal && <div className={styles.registerModal}>
          <RegistrationModal registerBtnColor={registerBtnColor} registerBtnText={registerBtnText} registerMessage={registerMessage} setRegisterModal={setRegisterModal} setRegisterBtnColor={setRegisterBtnColor} setRegisterBtnText={setRegisterBtnText} setRegisterMessage={setRegisterMessage} />
        </div>
      }
    </div >
  )
}

export default Details
function DescIcon() {
  return (
    <svg
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.1665 1.66699H12.8332M1.1665 5.00033H12.8332M1.1665 8.33366H6.1665"
        stroke="#A8A8A8"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function DownArrow() {
  return (
    <svg width={10} height={10} viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47124 5.47026C5.34622 5.59524 5.17668 5.66545 4.9999 5.66545C4.82313 5.66545 4.65359 5.59524 4.52857 5.47026L0.757237 1.69893C0.693563 1.63743 0.642775 1.56387 0.607836 1.48253C0.572896 1.40119 0.554505 1.31371 0.553736 1.22519C0.552967 1.13667 0.569835 1.04889 0.603355 0.966957C0.636876 0.885027 0.686378 0.810592 0.748973 0.747996C0.811568 0.685401 0.886003 0.635899 0.967934 0.602379C1.04986 0.568858 1.13765 0.55199 1.22617 0.55276C1.31469 0.553529 1.40217 0.57192 1.48351 0.606859C1.56484 0.641798 1.63841 0.692586 1.6999 0.75626L4.9999 4.05626L8.2999 0.75626C8.42564 0.634821 8.59404 0.567625 8.76884 0.569144C8.94363 0.570663 9.11084 0.640775 9.23445 0.76438C9.35805 0.887986 9.42817 1.05519 9.42969 1.22999C9.43121 1.40479 9.36401 1.57319 9.24257 1.69893L5.47124 5.47026Z" fill="black" />
    </svg>

  )
}