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
import { EventsType } from '@/types/alleventtype'
import DescriptionModal from './description/DescriptionModal'
import useHashtagsGenerator from '@/hooks/useHashtagsGenerator'
import HashtagContainer from './Hashtags/HashtagContainer'
import MapView from '@/app/components/DetailPage/Mapview'
import { showToast } from "@/utils/showToast";
import { FormState } from '@/types/Formstate'
import SideeventIcon from '../SideeventIcon'
import WaitListAndCap from '../Details/waitListAndCapacity/WaitListAndCap'
import CapacityModal from '../Details/waitListAndCapacity/capacitymodal/Capacity'
import ExhibitorDetails from './exhibitordetails/ExhibitorDetails'
import ExhibitorDetailsModal from './exhibitordetails/exhibitordetailsmodal/ExhibitorDetailsModal'
import EventType from './eventtypeinmaineventform/EventType'
interface SpeakerProfileType {
  id: string;
  name: string;
  linkedin: string;
  designation: string;
  // profileImage: string | ArrayBuffer | null;
  profileImage: File | null
}
interface Props {
  formTheme: string;
  formState: FormState;
  handleChange: (field: keyof FormState, value: any) => void;
  prefilledEvent?: EventsType | null
  eventFont: string;
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  setCollapseMainEventForm: React.Dispatch<React.SetStateAction<boolean>>;
  collapseMainEventForm: boolean;
  handleCollapseForm: (value: string) => void
  // setActiveBtn: (value: string) => void;
  isApproved?: boolean;
  setIsApproved?: (value: boolean) => void
}
const Details = ({ formTheme, formState, handleChange, prefilledEvent, eventFont, setLoadingState, fileInputRef,
  handleCollapseForm, isApproved, setIsApproved }: Props) => {
console.log("prefilled",prefilledEvent)
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { isLoading, imageUrl, generatePrompt } = usePosterGenerator();
  const { loadingState, generateHashtags, generatedHashtags } = useHashtagsGenerator();
  const [speakerIndex, setSpeakerIndex] = useState<number>(0)
  const [exhibitorIndex, setExhibitorIndex] = useState<number>(0)

  const handlePrefill = (profile: any, key: number) => {
    setSpeakerIndex(key)
    handleChange('prefilledProfile', profile)
    // setPrefilledProfile(profile)
    handleChange('speakerModal', true)
    // setSpeakerModal(true)
  }

  const handlePrefillExhibitorDetails = (profile: any, key: number) => {
    setExhibitorIndex(key)
    handleChange("prefilledExhibitorDetails",profile)
    handleChange('exhibitorModal',true)
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

  const deleteSpeaker = () => {
    const updatedSpeakers = formState.speaker.filter((_: any, index: number) => index !== speakerIndex)
    handleChange('speaker', updatedSpeakers)
    handleChange('speakerModal', false);
    handleChange('prefilledProfile', undefined);
  };

  const updateSpeaker = (updatedProfile: SpeakerProfileType) => {
    const currentSpeakers = formState.speaker || [];
    // Update the relevant speaker by mapping through the array
    const updatedSpeakers = currentSpeakers.map((p: any) =>
      p.id === updatedProfile.id ? updatedProfile : p
    );
    handleChange('speaker', updatedSpeakers);
    handleChange('speakerModal', false)
    // setSpeakerModal(false);
    handleChange('prefilledProfile', undefined)
    // setPrefilledProfile(undefined);
  };

  const deleteExhibitorDetails = () => {
    const updatedSpeakers = formState.exhibitor.filter((_: any, index: number) => index !== exhibitorIndex)
    handleChange('exhibitor', updatedSpeakers)
    handleChange('exhibitorModal', false);
    handleChange('prefilledExhibitorDetails', undefined);
  }

  const updateExhibitorDetails = (updatedProfile:any) => {
    const currentExibitor = formState.exhibitor || [];
    const updatedExhibitor = currentExibitor.map((p: any) =>
      p.id === updatedProfile.id ? updatedProfile : p
    );
    handleChange('exhibitor', updatedExhibitor);
    handleChange('exhibitorModal', false)
    handleChange('prefilledProfile', undefined)
  }

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
        generatePrompt(formState.participationMessage, formState.eventName, 1024, 1024)
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

  return (
    <div className={`${styles.body} ${formState.descriptionModal || formState.speakerModal || formState.exhibitorModal || formState.registerModal ? styles.modalBody : ""}`}>
      <div className={`${styles.detailsContainer} ${formState.descriptionModal || formState.speakerModal || formState.exhibitorModal || formState.registerModal ||formState.capacityModal? styles.modalOpen : ""}`} >
       
       <div>
       <div><EventType prefilledEvent={prefilledEvent} mainEventType={formState.event_type} handleChange={handleChange} /></div>
       <div> {formState.isEventTypeEmpty && <p className={styles.errorMessage}>Please select any event type</p>}</div>
       </div>
        <div>
        {
          formState.event_type && (<div className={`${styles.participationContainer}`}><ParticipationContainer formTheme={formTheme} handleChange={handleChange} formState={formState} heading='Choose Your Mode of Participation' type='main' size="large" />
          </div>)
         }
         {formState.event_type&& formState.isParticipationMessageEmpty && <p className={styles.errorMessage}>Please select any mode of participation</p>}
        </div>
          
      
        <div className={styles.sections}>
          <div className={styles.leftSection}>
            <div className={styles.posterContainer}>
              {isLoading ?
                <div className={styles.loader}>
                  <div className={styles.spinner}></div>
                </div> : <Image src={formState.banner.placeHolder} alt='Poster' width={296} height={290} style={{ borderRadius: 20, objectFit: "cover"}} className='h-[290px] w-[296px]' unoptimized />}
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
              <HashtagContainer formTheme={formTheme} loadingState={loadingState} hashtags={formState.hashtags}
                handleChange={handleChange} handleTagsGenerate={handleTagsGenerate} />
            </div>
            <div className={styles.shareContainer}>
              <div className={styles.heading}>Share</div>
              <ShareButtons formTheme={formTheme} copyIcon disabled={true} shareUrl='www.10times.com' />
            </div>
          </div>
          <div className={styles.rightSection}>
            <div>
              <textarea
                ref={textAreaRef}
                className={`${styles.eventName} ${formState.isEventNameEmpty ? styles.errorBackground : ""} ${formTheme === "dark" ? styles.darkeventName : styles.lighteventName}`}
                maxLength={80}
                placeholder='Event Name'
                style={{ fontFamily: prefilledEvent?.customizationData.eventFont || eventFont }}
                onChange={(e) => handleInputChange(e.target.value)}
                value={formState.eventName}
              />
              {formState.isEventNameEmpty && <p className={styles.errorMessage}>{formState.errorMessage}</p>}
            </div>
            <div className={styles.dateTimeContainer}><DateTimeContainer formTheme={formTheme} handleChange={handleChange} formState={formState} /></div>
            <div>
              <div className={`${styles.locationContainer}`} ><LocationContainer formTheme={formTheme} handleChange={handleChange}
                formState={formState} /></div>
              {formState.isEventFormatEmpty && <span className={styles.errorMessage}>Event location is required.</span>}
            </div>
            <div className={styles.resgitrationContainer}><RegistrationForm
              formTheme={formTheme}
              isApproved={isApproved} setIsApproved={setIsApproved}
              registerBtnColor={formState.registerBtnColor} registerBtnText={formState.registerBtnText} registerMessage={formState.registerMessage}
              // setRegisterModal={setRegisterModal}
              handleChange={handleChange}
            /></div>
            <div>
              <div className={`${styles.descriptionContainer}`} ><DescriptionContainer
                formTheme={formTheme}
                // setDescriptionModal={setDescriptionModal}
                description={formState.description} isEventDescriptionEmpty={formState.isEventDescriptionEmpty}
                // setIsEventDescriptionEmpty={setIsEventDescriptionEmpty} 
                handleChange={handleChange} /></div>
              {formState.isTextValueMessageEmpty && formState.isEventDescriptionEmpty && <span className={styles.errorMessage}>Event description is required.</span>}
            </div>
            {
              formState.participationType === "Organiser"?<WaitListAndCap waitlisting={formState.waitlisting} approval={formState.approval} capacity={formState.capacity} handleChange={handleChange} />:""
            }

            {
              formState.participationType === "Organiser"?<div className={styles.speakerProfileContainer}><ExhibitorDetails exhibitorDetailsData={formState.exhibitor} handlePrefillExhibitorDetails={handlePrefillExhibitorDetails} handleChange={handleChange} />
              </div>:""
            }

            {formState.participationType === "Speaker" || formState.participationType === "Organiser"? <div className={styles.speakerProfileContainer}><SpeakerProfile speakerProfilesData={formState.speaker}
              // setSpeakerModal={setSpeakerModal} 
              handlePrefill={handlePrefill} handleChange={handleChange} /></div> : formState.participationType === "Exhibitor" ? <div>
                <ExhibitorContainer handleChange={handleChange} boothNumber={formState.boothNumber} /></div> : <></>}

            {(formState.cityName && formState.eventFormat !== "Virtual") &&
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
                <SideeventIcon color={formTheme === "dark" ? "white" : "#7d7d7d"} />
                <div
                  className={`${styles.sideEventHeading} ${formTheme === "dark" ? styles.darkSideEventHeading : ""}`}
                >
                  Do you wish to add a side event ?
                </div>
              </div>
              <button className={formTheme === "dark" ? styles.darkBtn : ""} onClick={() => handleFormCollapse()}>Yes</button>
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
            speakerProfilesData={formState.speaker}
            handleChange={handleChange}
            // setSpeakerProfilesData={setSpeakerProfilesData} 
            // setSpeakerModal={setSpeakerModal} 
            prefilledProfile={formState.prefilledProfile} deleteSpeaker={deleteSpeaker} updateSpeaker={updateSpeaker} />
        </div>
      }

      {
        formState.exhibitorModal && <div className={styles.exhibitorModal}>
          <ExhibitorDetailsModal
          exhibitorDetailsData={formState.exhibitor}
          handleChange={handleChange}
          deleteExhibitorDetails={deleteExhibitorDetails}
          updateExhibitorDetails={updateExhibitorDetails}
          prefilledExhibitorDetails={formState.prefilledExhibitorDetails}
          />
        </div>
      }
      {
        formState.registerModal && <div className={styles.registerModal}>
          <RegistrationModal
            handleChange={handleChange}
            formState={formState} />
        </div>
      }
      {
          formState.participationType === "Organiser"&&
                formState.capacityModal &&  
                <div className={styles.capacityModal}>
                  <CapacityModal
                  capacityModal={formState.capacityModal}
                  capacity={ formState.capacity}
                  handleChange={handleChange}
                  waitlisting={formState.waitlisting}
                 /> 
                </div>
                 
      }
      
    </div >
  )
}

export default Details
