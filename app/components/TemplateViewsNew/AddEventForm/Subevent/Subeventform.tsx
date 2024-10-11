import React, { Suspense, useEffect, useRef, useState } from 'react'
import styles from './subevent.style.module.css'
import Image from 'next/image'
import Placeholder from '/public/placeholder.png'
import AiIcon from '/public/AiIcon.svg'
import UploadIcon from '/public/UploadImageIcon.svg'
import ShareButtons from '@/app/components/DetailPage/ShareButtons'
import DateTimeContainer from '../Details/dateandtime/DateTimeContainer'
import LocationContainer from '../Details/location/LocationContainer'
import ParticipationContainer from '../Details/participation/ParticipationContainer'
import RegistrationForm from '../Details/resgistration/RegistrationForm'
import DescriptionContainer from '../Details/description/DescriptionContainer'
import SpeakerProfile from '../Details/participation/speaker/SpeakerProfile'
import SpeakerModal from '../Details/participation/speaker/SpeakerModal'
import ExhibitorContainer from '../Details/participation/exhibitor/ExhibitorContainer'
import RegistrationModal from '../Details/resgistration/RegistrationModal'
import { useTheme } from '@/context'
import usePosterGenerator from '@/app/service/posterGenerator'
import { AllEventsType, EventsType } from '@/types/alleventtype'
import DescriptionModal from '../Details/description/DescriptionModal'
import useHashtagsGenerator from '@/hooks/useHashtagsGenerator'
import HashtagContainer from '../Details/Hashtags/HashtagContainer'
import MapView from '@/app/components/DetailPage/Mapview'
import { showToast } from "@/utils/showToast";
import SideEventIcon from '/public/sideevent.svg'
import GlobalSearch from '../../EditScreen/FilterEvents/GlobalSearch'
import { GolbalEventType } from '@/types/globaleventtype'
import { FormState } from '@/types/Formstate'
import WaitListAndCap from '../Details/waitListAndCapacity/WaitListAndCap'

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
    prefilledEvent?: EventsType | null
    eventFont: string;
    setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
    fileInputRef: React.RefObject<HTMLInputElement>;
    eventFlow: string;
    prefilledSubEvent?: EventsType | null;
    // setMainEventName: (value: string) => void
    isApproved?:boolean;
  setIsApproved?:(value:boolean) =>void
}
const Subeventform = ({ handleChange, formState, prefilledEvent, eventFont, setLoadingState, fileInputRef, eventFlow, prefilledSubEvent,isApproved, setIsApproved }: Props) => {
    // const [isApproved, setIsApproved] = useState(false)
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const { isLoading, imageUrl, generatePrompt } = usePosterGenerator();
    const { loadingState, generateHashtags, generatedHashtags } = useHashtagsGenerator();

    const handlePrefill = (profile: SpeakerProfileType) => {
        handleChange('prefilledProfile', profile)
        // setPrefilledProfile(profile)
        handleChange('speakerModal', true)
        // setSpeakerModal(true)
    }
    const { theme } = useTheme()

    const handleDescClick = () => {
        const trimmedValue = formState.textValue.trim();

        // Update the description and set the trimmed value in formState
        handleChange('textValue', trimmedValue);
        handleChange('description', trimmedValue)
        // setDescription(trimmedValue); 
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
        if (!prefilledEvent && !prefilledSubEvent) {
            if (formState.description && formState.eventName) {
                generateHashtags(formState.eventName, formState.description)
            }
        }
    }, [formState.description, formState.eventName, formState.countryName])

    useEffect(() => {
        if (loadingState || isLoading) {
            setLoadingState(true)
        } else {
            setLoadingState(false)
        }
    }, [loadingState, isLoading])

    useEffect(() => {
        if (!prefilledEvent && !prefilledSubEvent) {
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
            handleChange('eventName', value)
            // setEventName(value);
            if (value.trim() === "") {
                handleChange('isEventNameEmpty', true)
                // setIsEventNameEmpty(true);
            }
        }
    };

    return (
        <div className={`${styles.body} ${formState.descriptionModal || formState.speakerModal || formState.registerModal ? styles.modalBody : ""}`}>
            {eventFlow === "side" && <div className={styles.globalSearch}>
                <GlobalSearch widgetId='123' handleChange={handleChange} />
            </div>}

            <div className={`${styles.detailsContainer} ${formState.descriptionModal || formState.speakerModal || formState.registerModal ? styles.modalOpen : ""}`} >
                <div>
                    <div className={`${styles.participationContainer}`}>
                        <ParticipationContainer
                            handleChange={handleChange} formState={formState}
                            heading='Choose Your sub event type' type='side' size="large" />
                    </div>
                    {formState.isEventParticipationEmpty && <p className={styles.errorMessage}>Please select any mode of participation.</p>}
                </div>
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
                            style={{ fontFamily: prefilledEvent?.customizationData.eventFont || eventFont }}
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
                        isApproved={isApproved}setIsApproved={setIsApproved}
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
                    <div className={styles.resgitrationContainer}><WaitListAndCap isApproved={isApproved}setIsApproved={setIsApproved}/></div>
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
                        formState={formState}
                    />
                </div>
            }
        </div >
    )
}

export default Subeventform
