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
import { FormState } from '@/types/Formstate'

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
  formState: FormState;
  handleChange: (field: keyof FormState, value: any) => void;
  prefilledEvent?: AllEventsType
  // pageBgColor: string;
  eventFont: string;
  eventName: string;
  setEventName: (value: string) => void;
  cityName: string;
  setCityName: (value: string) => void;
  participationType: string;
  setParticipationType: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  // textValue: string;
  // setTextValue: React.Dispatch<React.SetStateAction<string>>;
  // speakerProfilesData: SpeakerProfileType[];
  // setSpeakerProfilesData: React.Dispatch<React.SetStateAction<SpeakerProfileType[]>>;
  // prefilledProfile?: SpeakerProfileType;
  // setPrefilledProfile: React.Dispatch<React.SetStateAction<SpeakerProfileType | undefined>>;
  // registerMessage: string;
  // setRegisterMessage: React.Dispatch<React.SetStateAction<string>>;
  // registerBtnText: string;
  // setRegisterBtnText: React.Dispatch<React.SetStateAction<string>>;
  // registerBtnColor: string;
  // setRegisterBtnColor: React.Dispatch<React.SetStateAction<string>>;
  // countryName: string;
  // setCountryName: React.Dispatch<React.SetStateAction<string>>;
  // timeZone: string;
  // setTimeZone: React.Dispatch<React.SetStateAction<string>>;
  // timeZoneKey: number;
  // setTimeZoneKey: React.Dispatch<React.SetStateAction<number>>;
  // startDate: string;
  // setStartDate: React.Dispatch<React.SetStateAction<string>>;
  // endDate: string;
  // setEndDate: React.Dispatch<React.SetStateAction<string>>;
  // startTime: string;
  // setStartTime: React.Dispatch<React.SetStateAction<string>>;
  // endTime: string;
  // setEndTime: React.Dispatch<React.SetStateAction<string>>;
  // eventFormat: string;
  // setEventFormat: React.Dispatch<React.SetStateAction<string>>;
  // boothNumber: string;
  // setBoothNumber: React.Dispatch<React.SetStateAction<string>>;
  // participationMessage: string;
  // setParticipationMessage: React.Dispatch<React.SetStateAction<string>>;
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  // banner: ImageState;
  // setBanner: React.Dispatch<React.SetStateAction<ImageState>>;
  // venue: string;
  // setVenue: React.Dispatch<React.SetStateAction<string>>;
  // latitude: number;
  // setLatitude: React.Dispatch<React.SetStateAction<number>>;
  // longitude: number;
  // setLongitude: React.Dispatch<React.SetStateAction<number>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  // hashtags: string[];
  // setHashtags: React.Dispatch<React.SetStateAction<string[]>>;
  // query: string;
  // setQuery: React.Dispatch<React.SetStateAction<string>>;
  // isEventNameEmpty: boolean;
  // setIsEventNameEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  // isEventFormatEmpty: boolean;
  // setIsEventFormatEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  // isEventDescriptionEmpty: boolean;
  // setIsEventDescriptionEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  // isEventParticipationEmpty: boolean;
  // setIsEventParticipationEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  // isParticipationMessageEmpty: boolean;
  // setIsParticipationMessageEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  // isTextValueMessageEmpty: boolean;
  // setIsTextValueMessageEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  // errorMessage: string;
  // setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setCollapseMainEventForm: React.Dispatch<React.SetStateAction<boolean>>;
  collapseMainEventForm: boolean;
}
const Details = ({ formState, handleChange, prefilledEvent, eventFont, eventName, setEventName, cityName, setCityName, participationType, setParticipationType, description, setDescription,
  // textValue, setTextValue, speakerProfilesData, setSpeakerProfilesData, prefilledProfile, setPrefilledProfile, registerMessage, setRegisterMessage, registerBtnText,
  // setRegisterBtnText, registerBtnColor, setRegisterBtnColor, countryName, setCountryName, timeZone, setTimeZone, timeZoneKey, setTimeZoneKey, startDate, setStartDate, endDate, setEndDate, startTime, setStartTime, endTime, setEndTime, eventFormat, setEventFormat, boothNumber, setBoothNumber, participationMessage, setParticipationMessage,
  setLoadingState, fileInputRef,
  // banner, setBanner, venue, setVenue, latitude, setLatitude, longitude, setLongitude, fileInputRef, hashtags, setHashtags, query, setQuery, isEventNameEmpty, setIsEventNameEmpty, isEventFormatEmpty, setIsEventFormatEmpty, isEventDescriptionEmpty, setIsEventDescriptionEmpty, isEventParticipationEmpty, setIsEventParticipationEmpty, isParticipationMessageEmpty, setIsParticipationMessageEmpty, isTextValueMessageEmpty, setIsTextValueMessageEmpty, errorMessage, setErrorMessage, 
  setCollapseMainEventForm, collapseMainEventForm }: Props) => {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [descriptionModal, setDescriptionModal] = useState<boolean>(false)
  const [speakerModal, setSpeakerModal] = useState<boolean>(false)
  const [registerModal, setRegisterModal] = useState<boolean>(false)
  const { isLoading, imageUrl, generatePrompt } = usePosterGenerator();
  const { loadingState, generateHashtags, generatedHashtags } = useHashtagsGenerator();


  const handlePrefill = (profile: SpeakerProfileType) => {
    handleChange('prefilledProfile', profile)
    // setPrefilledProfile(profile)
    setSpeakerModal(true)
  }
  const { theme } = useTheme()

  const handleDescClick = () => {
    const trimmedValue = formState.textValue.trim();

    // Update the description and set the trimmed value in formState
    handleChange('textValue', trimmedValue);

    setDescription(trimmedValue); // Assuming this is still necessary for the modal
    setDescriptionModal(false); // Close the modal
  }
  const deleteSpeaker = (id: string) => {
    handleChange('speakerProfilesData', (prevData: any) =>
      prevData.filter((p: any) => p.id !== id)
    );
    setSpeakerModal(false);
    handleChange('prefilledProfile', undefined)
    // setPrefilledProfile(undefined);
  };

  const updateSpeaker = (updatedProfile: SpeakerProfileType) => {
    handleChange('speakerProfilesData', (prevData: any) =>
      prevData.map((p: any) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
    // setSpeakerProfilesData((prevData) =>
    //   prevData.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    // );
    setSpeakerModal(false);
    handleChange('prefilledProfile', undefined)
    // setPrefilledProfile(undefined);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      handleChange('banner', {
        placeHolder: fileUrl,
        file: file,
      });
    }
  };

  useEffect(()=>{
    console.log("banner is",formState.banner)
  },[formState.banner])

  const handleGeneratePoster = () => {
    if (!isLoading) { // if poster is in generaing state, the handle poster function should not work
      if (eventName && formState.participationMessage) {
        generatePrompt(formState.participationMessage, description, eventName, 1024, 1024)
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
  }, [description, eventName, formState.countryName])

  useEffect(() => {
    if (loadingState || isLoading) {
      setLoadingState(true)
    } else {
      setLoadingState(false)
    }
  }, [loadingState, isLoading])

  useEffect(() => {
    if (!prefilledEvent) {
      handleChange('hashtags', generatedHashtags)
      // setHashtags(generatedHashtags)
    }
  }, [generatedHashtags])

  useEffect(() => {
    if (imageUrl) {
      handleChange('banner', {
        placeHolder: imageUrl,
        file: null,
      });
    }
  }, [imageUrl]);

  const handleInputChange = (value: string) => {
    console.log("value typed : ", value)
    const specialCharRegex = /[@#$%^&*"|<>]/g;
    handleChange('isEventNameEmpty', false)
    // setIsEventNameEmpty(false)
    if (specialCharRegex.test(value)) {
      showToast("error", "Please check, input should not contain any special character");
    } else {
      setEventName(value);
      if (value.trim() === "") {
        handleChange('isEventNameEmpty', true)
        // setIsEventNameEmpty(true);
      }
    }
  };
  return (
    <div className={styles.body}>
      <div className={`${styles.detailsContainer} ${descriptionModal || speakerModal || registerModal ? styles.modalOpen : ""}`} >
        <div>
          <div className={`${styles.participationContainer}`}><ParticipationContainer 
          handleChange = {handleChange} formState={formState}
          heading='Choose Your Mode of Participation' type='main' size="large"
            // participationMessage={participationMessage} setParticipationMessage={setParticipationMessage}
             setParticipationType={setParticipationType} participationType={participationType} 
            //  isEventParticipationEmpty={isEventParticipationEmpty} setIsEventParticipationEmpty={setIsEventParticipationEmpty} isParticipationMessageEmpty={isParticipationMessageEmpty} setIsParticipationMessageEmpty={setIsParticipationMessageEmpty}
          /></div>
          {formState.isParticipationMessageEmpty && <p className={styles.errorMessage}>Please select any mode of participation.</p>}
        </div>
        <div className={styles.sections}>
          <div className={styles.leftSection}>
            <div className={styles.posterContainer}>
              {isLoading ?
                <div className={styles.loader}>
                  <div className={styles.spinner}></div>
                </div> : <Image src={formState.banner.placeHolder} alt='Poster' width={296} height={290} style={{ borderRadius: 20, objectFit: "cover" }} unoptimized />}
              <div className={styles.posterIcons}>
                <div onClick={handleGeneratePoster} data-name={eventName && formState.participationMessage ? "Generate your Banner" : "Add Event name and participationMessage to generate a banner"}>
                  <Image src={AiIcon} alt='aigenerate' className={styles.aiIcon}></Image>
                </div>
                <div data-name="Upload Your Banner" onClick={() => fileInputRef.current?.click()}>
                  <Image src={UploadIcon} alt='upload'></Image>
                  <input type="file" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} ref={fileInputRef} />
                </div>
              </div>
            </div>
            <div className={styles.hashtagsContainer}>
              <HashtagContainer loadingState={loadingState} hashtags={formState.hashtags} 
              handleChange = {handleChange} handleTagsGenerate={handleTagsGenerate} />
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
                className={`${styles.eventName} ${formState.isEventNameEmpty ? styles.errorBackground : ""}`}
                maxLength={80}
                placeholder='Event Name'
                style={{ fontFamily: prefilledEvent?.customizationData.eventFont || eventFont }}
                onChange={(e) => handleInputChange(e.target.value)}
                value={eventName}
              />
              {formState.isEventNameEmpty && <p className={styles.errorMessage}>{formState.errorMessage}</p>}
            </div>
            <div className={styles.dateTimeContainer}><DateTimeContainer handleChange = {handleChange} formState={formState}
            // setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} endTime={endTime} setEndTime={setEndTime} startTime={startTime} setStartTime={setStartTime} timeZone={timeZone} setTimeZone={setTimeZone} timeZoneKey={timeZoneKey} setTimeZoneKey={setTimeZoneKey} 
            /></div>
            <div>
              <div className={`${styles.locationContainer}`} ><LocationContainer handleChange={handleChange}
              formState={formState}
              // setLatitude={setLatitude} setLongitude={setLongitude} eventFormat={eventFormat} setEventFormat={setEventFormat} 
              setCityName={setCityName} cityName={cityName}
              //  setCountryName={setCountryName} countryName={countryName} isEventFormatEmpty={isEventFormatEmpty} query={query} setQuery={setQuery} setIsEventFormatEmpty={setIsEventFormatEmpty} 
               /></div>
              {formState.isEventFormatEmpty && <span className={styles.errorMessage}>Event location is required.</span>}
            </div>
            <div className={styles.resgitrationContainer}><RegistrationForm
              registerBtnColor={formState.registerBtnColor} registerBtnText={formState.registerBtnText} registerMessage={formState.registerMessage}
              setRegisterModal={setRegisterModal} /></div>
            <div>
              <div className={`${styles.descriptionContainer}`} ><DescriptionContainer setDescriptionModal={setDescriptionModal} description={description} isEventDescriptionEmpty={formState.isEventDescriptionEmpty} 
              // setIsEventDescriptionEmpty={setIsEventDescriptionEmpty} 
              handleChange = {handleChange}/></div>
              {formState.isTextValueMessageEmpty && formState.isEventDescriptionEmpty && <span className={styles.errorMessage}>Event description is required.</span>}
            </div>
            {participationType === "Speaker" ? <div className={styles.speakerProfileContainer}><SpeakerProfile speakerProfilesData={formState.speakerProfilesData} setSpeakerModal={setSpeakerModal} handlePrefill={handlePrefill} /></div> : participationType === "Exhibitor" ? <div>
              <ExhibitorContainer handleChange={handleChange} boothNumber={formState.boothNumber} /></div> : <></>}

            {cityName &&
              // <div className={styles.map} ref={mapDivRef}>
              // <Suspense fallback={<div>Loading...</div>}>
              <MapView latitude={formState.latitude}
                longitude={formState.longitude}
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
      </div>
      {
        descriptionModal && <div className={styles.descriptionModal}>
          <DescriptionModal setDescriptionModal={setDescriptionModal} textValue={formState.textValue}
          // setTextValue={setTextValue}
          handleChange={handleChange}
          handleDescClick={handleDescClick} />
        </div>
      }
      {
        speakerModal && <div className={styles.speakerModal}>
          <SpeakerModal 
          handleChange={handleChange}
          // setSpeakerProfilesData={setSpeakerProfilesData} 
          setSpeakerModal={setSpeakerModal} 
          prefilledProfile={formState.prefilledProfile} deleteSpeaker={deleteSpeaker} updateSpeaker={updateSpeaker} />
        </div>
      }
      {
        registerModal && <div className={styles.registerModal}>
          <RegistrationModal 
          handleChange={handleChange}
          formState = {formState}
          // registerBtnColor={registerBtnColor} registerBtnText={registerBtnText} registerMessage={registerMessage} 
          setRegisterModal={setRegisterModal}
          // setRegisterBtnColor={setRegisterBtnColor} setRegisterBtnText={setRegisterBtnText} setRegisterMessage={setRegisterMessage} 
          />
        </div>
      }
    </div >
  )
}

export default Details
