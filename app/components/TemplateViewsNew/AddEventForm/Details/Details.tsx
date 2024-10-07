import React, { useEffect, useRef, useState } from 'react'
import styles from './details.style.module.css'
import Image from 'next/image'
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
interface Props {
  formState: FormState;
  handleChange: (field: keyof FormState, value: any) => void;
  prefilledEvent?: AllEventsType | null
  eventFont: string;
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  setCollapseMainEventForm: React.Dispatch<React.SetStateAction<boolean>>;
  collapseMainEventForm: boolean;
  handleCollapseForm: (value: string) => void
  // setActiveBtn: (value: string) => void;
}
const Details = ({ formState, handleChange, prefilledEvent, eventFont, setLoadingState, fileInputRef,
  handleCollapseForm }: Props) => {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { isLoading, imageUrl, generatePrompt } = usePosterGenerator();
  const { loadingState, generateHashtags, generatedHashtags } = useHashtagsGenerator();


  const handlePrefill = (profile: SpeakerProfileType) => {
    handleChange('prefilledProfile', profile)
    // setPrefilledProfile(profile)
    handleChange('speakerModal', true)
    // setSpeakerModal(true)
  }

  const handleDescClick = () => {
    const trimmedValue = formState.textValue.trim();

    // Update the description and set the trimmed value in formState
    handleChange('textValue', trimmedValue);
    handleChange('description', trimmedValue)
    // setDescription(trimmedValue); // Assuming this is still necessary for the modal
    handleChange('descriptionModal', false)
    // setDescriptionModal(false); // Close the modal
  }
  const deleteSpeaker = (id: string) => {
    handleChange('speakerProfilesData', (prevData: any) =>
      prevData.filter((p: any) => p.id !== id)
    );
    handleChange('speakerModal', false)
    // setSpeakerModal(false);
    handleChange('prefilledProfile', undefined)
    // setPrefilledProfile(undefined);
  };

  const updateSpeaker = (updatedProfile: SpeakerProfileType) => {
    const currentSpeakers = formState.speakerProfilesData || [];
    // Update the relevant speaker by mapping through the array
    const updatedSpeakers = currentSpeakers.map((p: any) =>
      p.id === updatedProfile.id ? updatedProfile : p
    );
    handleChange('speakerProfilesData', updatedSpeakers);
    handleChange('speakerModal', false)
    // setSpeakerModal(false);
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
  const handleGeneratePoster = () => {
    if (!isLoading) { // if poster is in generaing state, the handle poster function should not work
      if (formState.eventName && formState.participationMessage) {
        generatePrompt(formState.participationMessage, formState.description, formState.eventName, 1024, 1024)
      } else {
        showToast("error", "Please provide Event name, Description, and participationMessage to generate the Banner");
      }
    } else {
      showToast("error", "Please wait for the banner to generate first before generating again");
    }
  }
  const handleTagsGenerate = () => {
    if (!loadingState) {
      if (formState.description && formState.eventName) {
        generateHashtags(formState.eventName, formState.description)
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
      if (formState.description && formState.eventName) {
        if (formState.hashtags.length === 0) {
          generateHashtags(formState.eventName, formState.description)
        }
      }
    }
  }, [formState.description, formState.eventName])

  useEffect(() => {
    if (loadingState || isLoading) {
      setLoadingState(true)
    } else {
      setLoadingState(false)
    }
  }, [loadingState, isLoading])

  useEffect(() => {
    if (!prefilledEvent) {
      if (formState.hashtags.length === 0) {
        handleChange('hashtags', generatedHashtags)
      }
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
      handleChange('eventName', value)
      // setEventName(value);
      if (value.trim() === "") {
        handleChange('isEventNameEmpty', true)
        // setIsEventNameEmpty(true);
      }
    }
  };
  const handleFormCollapse = () => {
    handleCollapseForm("side")
  }
  // useEffect(() => {
  //   console.log("speaker are : ", formState.speakerProfilesData)
  // }, [formState.speakerProfilesData])

  return (
    <div className={`${styles.body} ${formState.descriptionModal || formState.speakerModal || formState.registerModal ? styles.modalBody : ""}`}>
      <div className={`${styles.detailsContainer} ${formState.descriptionModal || formState.speakerModal || formState.registerModal ? styles.modalOpen : ""}`} >
        <div>
          <div className={`${styles.participationContainer}`}><ParticipationContainer
            handleChange={handleChange} formState={formState}
            heading='Choose Your Mode of Participation' type='main' size="large" />
          </div>
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
                <div onClick={handleGeneratePoster} data-name={formState.eventName && formState.participationMessage ? "Generate your Banner" : "Add Event name and participationMessage to generate a banner"}>
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
                handleChange={handleChange} handleTagsGenerate={handleTagsGenerate} />
            </div>
            <div className={styles.shareContainer}>
              <div className={styles.heading}>Share</div>
              <ShareButtons disabled={true} shareUrl='www.10times.com' />
            </div>
          </div>
          <div className={styles.rightSection}>
            <div>
              <textarea
                ref={textAreaRef}
                className={`${styles.eventName} ${formState.isEventNameEmpty ? styles.errorBackground : ""}`}
                maxLength={80}
                placeholder='Event Name'
                style={{ fontFamily: prefilledEvent?.mainEvent.customizationData.eventFont || eventFont }}
                onChange={(e) => handleInputChange(e.target.value)}
                value={formState.eventName}
              />
              {formState.isEventNameEmpty && <p className={styles.errorMessage}>{formState.errorMessage}</p>}
            </div>
            <div className={styles.dateTimeContainer}><DateTimeContainer handleChange={handleChange} formState={formState} /></div>
            <div>
              <div className={`${styles.locationContainer}`} ><LocationContainer handleChange={handleChange}
                formState={formState} /></div>
              {formState.isEventFormatEmpty && <span className={styles.errorMessage}>Event location is required.</span>}
            </div>
            <div className={styles.resgitrationContainer}><RegistrationForm
              registerBtnColor={formState.registerBtnColor} registerBtnText={formState.registerBtnText} registerMessage={formState.registerMessage}
              // setRegisterModal={setRegisterModal}
              handleChange={handleChange}
            /></div>
            <div>
              <div className={`${styles.descriptionContainer}`} ><DescriptionContainer
                // setDescriptionModal={setDescriptionModal}
                description={formState.description} isEventDescriptionEmpty={formState.isEventDescriptionEmpty}
                // setIsEventDescriptionEmpty={setIsEventDescriptionEmpty} 
                handleChange={handleChange} /></div>
              {formState.isTextValueMessageEmpty && formState.isEventDescriptionEmpty && <span className={styles.errorMessage}>Event description is required.</span>}
            </div>
            {formState.participationType === "Speaker" ? <div className={styles.speakerProfileContainer}><SpeakerProfile speakerProfilesData={formState.speakerProfilesData}
              // setSpeakerModal={setSpeakerModal} 
              handlePrefill={handlePrefill} handleChange={handleChange} /></div> : formState.participationType === "Exhibitor" ? <div>
                <ExhibitorContainer handleChange={handleChange} boothNumber={formState.boothNumber} /></div> : <></>}

            {formState.cityName &&
              // <div className={styles.map} ref={mapDivRef}>
              // <Suspense fallback={<div>Loading...</div>}>
              <MapView latitude={formState.latitude}
                longitude={formState.longitude}
                venue={formState.cityName}
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
              <button onClick={() => handleFormCollapse()}>Yes</button>
            </div>
          </div>
        </div>
      </div>
      {
        formState.descriptionModal && <div className={styles.descriptionModal}>
          <DescriptionModal
            // setDescriptionModal={setDescriptionModal}
            textValue={formState.textValue}
            // setTextValue={setTextValue}
            handleChange={handleChange}
            handleDescClick={handleDescClick} />
        </div>
      }
      {
        formState.speakerModal && <div className={styles.speakerModal}>
          <SpeakerModal
            speakerProfilesData={formState.speakerProfilesData}
            handleChange={handleChange}
            // setSpeakerProfilesData={setSpeakerProfilesData} 
            // setSpeakerModal={setSpeakerModal} 
            prefilledProfile={formState.prefilledProfile} deleteSpeaker={deleteSpeaker} updateSpeaker={updateSpeaker} />
        </div>
      }
      {
        formState.registerModal && <div className={styles.registerModal}>
          <RegistrationModal
            handleChange={handleChange}
            formState={formState} />
        </div>
      }
    </div >
  )
}

export default Details
