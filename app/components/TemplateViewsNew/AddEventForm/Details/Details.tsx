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
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import usePosterGenerator from '@/app/service/posterGenerator'
import { AllEventsType } from '@/types/alleventtype'
import DescriptionModal from './description/DescriptionModal'
import { AddedEventsType } from '@/types/addedeventtype'
import { GolbalEventType } from '@/types/globaleventtype'
import useHashtagsGenerator from '@/hooks/useHashtagsGenerator'
import HashtagContainer from './Hashtags/HashtagContainer'
import MapView from '@/app/components/DetailPage/Mapview'
import { showToast } from "@/utils/showToast";

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
  setIsAddEventModalOpen: (value: boolean) => void
  pageBgColor: string;
  eventFont: string;
  widgetId: string;
  fetchEvents: (page: number, type?: string) => Promise<void>;
  addedEventIds: string[]
  prefilledEvent?: AllEventsType
  prefilledGlobalEvent?: GolbalEventType
  eventName: string;
  setEventName: (value: string) => void;
  cityName: string;
  setCityName: (value: string) => void;
  participationType: string;
  setParticipationType: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
}
const Details = ({ setIsAddEventModalOpen, pageBgColor, eventFont, widgetId, prefilledEvent, prefilledGlobalEvent, eventName, setEventName, cityName, setCityName, participationType, setParticipationType, description, setDescription,fetchEvents }: Props) => {

  // const Mapview = React.lazy(() => import('@/app/components/DetailPage/Mapview'));
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [descriptionModal, setDescriptionModal] = useState<boolean>(false)
  const [speakerModal, setSpeakerModal] = useState<boolean>(false)
  const [registerModal, setRegisterModal] = useState<boolean>(false)

  const [textValue, setTextValue] = useState<string>(description)

  const [speakerProfilesData, setSpeakerProfilesData] = useState<SpeakerProfileType[]>([])
  const [prefilledProfile, setPrefilledProfile] = useState<SpeakerProfileType | undefined>();
  const [registerMessage, setRegisterMessage] = useState<string>(prefilledEvent?.customizationData.registerMessage || "Welcome! To join the event, please register below.")
  const [registerBtnText, setRegisterBtnText] = useState<string>(prefilledEvent?.customizationData.registerBtnText || "Register")
  const [registerBtnColor, setRegisterBtnColor] = useState<string>(prefilledEvent?.customizationData.registerBtnColor || "#1a1a1a")

  const [countryName, setCountryName] = useState<string>(prefilledEvent?.countryName || prefilledGlobalEvent?.countryName || "")
  const [timeZone, setTimeZone] = useState<string>(prefilledEvent?.gmtZone || "GMT+05:30 Chennai")
  const [timeZoneKey, setTimeZoneKey] = useState<number>(18)
  const [startDate, setStartDate] = useState<string>(prefilledEvent?.startDate || prefilledGlobalEvent?.startDate || "")
  const [endDate, setEndDate] = useState<string>(prefilledEvent?.endDate ||prefilledGlobalEvent?.startDate || "")
  const [startTime, setStartTime] = useState<string>(prefilledEvent?.startTime || "12:00 A.M")
  const [endTime, setEndTime] = useState<string>(prefilledEvent?.endTime || "12:00 A.M")
  const [eventFormat, setEventFormat] = useState<string>(prefilledEvent?.customizationData.eventFormat || prefilledGlobalEvent?.format || "In-person")

  const [boothNumber, setBoothNumber] = useState<string>(prefilledEvent?.customizationData.boothNumber || "")
  const [participationMessage, setParticipationMessage] = useState<string>(prefilledEvent?.customizationData.participationMessage || "")
  const { isLoading, imageUrl, generatePrompt } = usePosterGenerator();
  const [banner, setBanner] = useState<ImageState>({
    placeHolder: prefilledEvent?.logoUrl || Placeholder,
    file: null
  });
  const [venue, setVenue] = useState(prefilledEvent?.customizationData.venue || prefilledGlobalEvent?.venue || "")
  const [latitude, setLatitude] = useState(Number(prefilledEvent?.latitude || prefilledGlobalEvent?.latitude) || 37.7749)
  const [longitude, setLongitude] = useState(Number(prefilledEvent?.longitude || prefilledGlobalEvent?.longitude) || -122.4194);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hashtags, setHashtags] = useState<string[]>(prefilledEvent?.customizationData.hashtags.split(",") || [])
  const eventPromoted = prefilledEvent?.customizationData.promoted || "false"
  const { loadingState, generateHashtags, generatedHashtags } = useHashtagsGenerator();
  const [isEventNameEmpty, setIsEventNameEmpty] = useState(false);
  const [isEventFormatEmpty, setIsEventFormatEmpty] = useState(false);
  const [isEventDescriptionEmpty, setIsEventDescriptionEmpty] = useState(false);
  const [isEventParticipationEmpty, setIsEventParticipationEmpty] = useState(false);
  const [query, setQuery] = useState("")
  const [isParticipationMessageEmpty, setIsParticipationMessageEmpty] = useState<boolean>(false)
  const [isTextValueMessageEmpty, setIsTextValueMessageEmpty] = useState<boolean>(false)
  const [errorMessage, setErrorMssage] = useState("Event name is required.");
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

  useEffect(() => {
    console.log("banner is :", banner.placeHolder)
    console.log("banner is :", banner.file)
  }, [banner])

  const handleAddEvent = async () => {
    if (!eventName || eventName ==="") {
      setIsEventNameEmpty(true)
    } else {
      setIsEventNameEmpty(false)
    }
    if (!query) {
      setIsEventFormatEmpty(true)
    } else {
      setIsEventFormatEmpty(false)
    }
    if (!description) {
      setIsEventDescriptionEmpty(true)
    } else {
      setIsEventDescriptionEmpty(false)
    }
    if (!participationType) {
      setIsEventParticipationEmpty(true)
    } else {
      setIsEventParticipationEmpty(false)
    }
    if (!participationMessage) {
      setIsParticipationMessageEmpty(true)
    }
    if (!textValue) {
      setIsTextValueMessageEmpty(true)
    }

    if (!eventName.trim() || !eventFormat || !startTime || !endTime || !startDate || !endDate || !description.trim() || !cityName || !countryName || !timeZone || !latitude || !longitude || !participationType || !participationMessage) {
      
      showToast("error", "Please fill in all the fields");
      return; // Exit the function if any field is missing
    }

    if (!imageUrl && !banner.file) {
      showToast("error", "Please upload or generate a Poster");
      return; // Exit the function if any field is missing
    }
    const eventCustomizationData = {
      pageBgColor,
      eventFont,
      registerBtnColor,
      registerBtnText,
      registerMessage,
      speakerProfilesData,
      participationMessage,
      venue,
      hashtags: hashtags.join(","),
      promoted: eventPromoted,
      boothNumber 
    }
    const eventData = {
      format: eventFormat,
      start_time: startTime,
      end_time: endTime,
      end_date: endDate,
      start_date: startDate,
      description,
      location_city: cityName,
      location_country: countryName,
      gmt_time: timeZone,
      latitude,
      longitude,
      participationType,
      event_type: "Tradeshow",
      customizationData: JSON.stringify(eventCustomizationData)
    };
    const formData = new FormData()
    formData.append("name", eventName)
    formData.append("data", JSON.stringify(eventData))
    formData.append("type", "MAIN")

    if (banner.file || banner.placeHolder.includes("oaidalleapiprodscus")) {
      if (banner.file) {
        formData.append("file", banner.file); // Use the file field if uploaded by the user
      } else {
        formData.append("logoUrl", imageUrl); // Use logoUrl if the banner is AI-generated
      }
    }

    // formData.append("interest", participationType.toUpperCase())
    // formData.append("source", "eventgeni/widget/event")
    formData.append("sourceId", widgetId)

    const { data, error } = await myFetch(`${baseUrl}/event`, {
      method: 'POST',
      body: formData
    })
    if(data){
      setIsAddEventModalOpen(false)
      showToast("success","Event Added Successfully")
      fetchEvents(0, "update")
    }
    if (error) {
      console.log(error)
    }

  }
  // const addEventToWidget = async (eventId: string, bannerUrl: string) => {
  //   const customizedFormData = new FormData()
  //   const existingEvents = fetchedAddedEvents || [];
  //   const newEvent = {
  //     id: eventId,
  //     pageBgColor,
  //     eventFont,
  //     registerBtnColor,
  //     registerBtnText,
  //     registerMessage,
  //     speakerProfilesData,
  //     participationMessage,
  //     bannerUrl,
  //     latitude,
  //     longitude,
  //     venue,
  //     hashtags: hashtags.join(","),
  //     promoted: eventPromoted
  //   };
  //   const mergedEvents = [...existingEvents, newEvent];

  //   const otherData = {
  //     event: mergedEvents,
  //   };

  //   const eventIds = [...addedEventIds, eventId].join(',');

  //   customizedFormData.append('widgetId', widgetId);
  //   customizedFormData.append('otherdata', JSON.stringify(otherData))
  //   customizedFormData.append('eventId', eventIds)
  //   customizedFormData.append('status', 'active');

  //   const { data, error } = await myFetch(`${baseUrl}/widget`, {
  //     method: 'POST',
  //     body: customizedFormData
  //   })
  //   if (data) {
  //     console.log("widget event data", data)
  //     setIsAddEventModalOpen(false)
  //     fetchEvents(0, "update");
  //     fetchAddedEvents();
  //   }
  //   if (error) {
  //     console.log("error in adding event to widget ", error)
  //   }
  // }

  // This function can be called from 2 perspectives. If the already added event in the widget is getting updated or if we are adding the event to the widget from all events list
  const handleSaveEvent = async (eventId: string) => {
    if (!eventName || eventName ==="") {
      setIsEventNameEmpty(true)
    } else {
      setIsEventNameEmpty(false)
    }
    if (!query && !latitude || !longitude) {
      setIsEventFormatEmpty(true)
    } else {
      setIsEventFormatEmpty(false)
    }
    if (!description) {
      setIsEventDescriptionEmpty(true)
    } else {
      setIsEventDescriptionEmpty(false)
    }
    if (!participationType) {
      setIsEventParticipationEmpty(true)
    } else {
      setIsEventParticipationEmpty(false)
    }
    if (!participationMessage) {
      setIsParticipationMessageEmpty(true)
    }
    if (!textValue.trim()) {
      setIsTextValueMessageEmpty(true)
    }
    if (!eventName.trim() || !eventFormat || !startTime || !endTime || !startDate || !endDate || !description.trim() || !cityName || !countryName || !timeZone || !latitude || !longitude || !participationType || !participationMessage) {
      showToast("error", "Please fill in all the fields");
      return; // Exit the function if any field is missing
    }
    if (!prefilledEvent?.logoUrl) { // We are checking that if the banner is already there i.e if the user has not upadted the banner while saving, then we dont need to check the below conditions
      if (!imageUrl && !banner.file) {
        showToast("error", "Please upload or generate a Poster");
        return; // Exit the function if any field is missing
      }
    }
    const eventCustomizationData = {
      pageBgColor,
      eventFont,
      registerBtnColor,
      registerBtnText,
      registerMessage,
      speakerProfilesData,
      participationMessage,
      venue,
      hashtags: hashtags.join(","),
      promoted: eventPromoted,
      boothNumber 
    }
    const eventData = {
      id: eventId,
      format: eventFormat,
      start_time: startTime,
      end_time: endTime,
      end_date: endDate,
      start_date: startDate,
      description,
      logoUrl: banner.placeHolder,
      location_city: cityName,
      location_country: countryName,
      participationType,
      gmt_time: timeZone,
      latitude,
      longitude,
      event_type: "Tradeshow",
      customizationData: JSON.stringify(eventCustomizationData)
    };
    const formData = new FormData();
    formData.append("id", eventId);
    formData.append("name", eventName);
    formData.append("data", JSON.stringify(eventData));
    // formData.append("interest", participationType.toUpperCase())
    formData.append("sourceId", widgetId)
    if (banner.placeHolder.includes("eventgeni") == false) { // This means if the banner is not updated we dont want to send the patch request for banner updation.
      if (banner.file) {
        formData.append("file", banner.file); // Use the file field if uploaded by the user
      } else {
        formData.append("logoUrl", imageUrl); // Use logoUrl if the banner is AI-generated
      }
    }
    const { data, error } = await myFetch(`${baseUrl}/event`, {
      method: 'PATCH',
      body: formData,
    });
    // if (data) {
    //   const updatedEventId = data.data.id;
    //   const updatedBannerUrl = data.data.data.logoUrl;
    //   if (prefilledAddedEvent) {
    //     updateEventInWidget(updatedEventId, updatedBannerUrl)
    //   } else {
    //     addEventToWidget(updatedEventId, updatedBannerUrl);
    //   }

    // }
    if(data){
      setIsAddEventModalOpen(false)
      showToast("success","Event Updated Successfully")
      fetchEvents(0, "update")
    }
    if (error) {
      console.log(error);
    }
  }
  // const updateEventInWidget = async (eventId: string, updatedBannerUrl: string) => {
  //   const customizedFormData = new FormData();
  //   const existingEvents = fetchedAddedEvents || [];
  //   const updatedEvent = {
  //     id: eventId,
  //     pageBgColor,
  //     registerBtnColor,
  //     registerBtnText,
  //     registerMessage,
  //     boothNumber,
  //     eventFont,
  //     speakerProfilesData,
  //     participationMessage,
  //     bannerUrl: updatedBannerUrl,
  //     latitude,
  //     longitude,
  //     venue,
  //     hashtags: hashtags.join(","),
  //     promoted: eventPromoted
  //   };

  //   // Find and update the existing event
  //   const updatedEvents = existingEvents.map(event =>
  //     event.id === eventId ? updatedEvent : event
  //   );

  //   const otherData = {
  //     event: updatedEvents,
  //   };

  //   const eventIds = updatedEvents.map(event => event.id).join(',');

  //   customizedFormData.append('widgetId', widgetId);
  //   customizedFormData.append('otherdata', JSON.stringify(otherData));
  //   customizedFormData.append('eventId', eventIds);

  //   const { data, error } = await myFetch(`${baseUrl}/widget`, {
  //     method: 'POST',
  //     body: customizedFormData,
  //   });
  //   if (data) {
  //     console.log("widget event data", data);
  //     setIsAddEventModalOpen(false);
  //     fetchEvents(0, "update");
  //     fetchAddedEvents();
  //   }
  //   if (error) {
  //     console.log("error in updating event in widget ", error);
  //   }
  // };


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
      <div className={styles.btnContainer} style={{ backgroundColor: theme === "dark" ? "#131313" : "#FAFAFA" }}>
        <button className={styles.closeBtn} style={{ color: theme === "dark" ? "white" : "black" }} onClick={() => setIsAddEventModalOpen(false)}>Close</button>
        <button className={`${styles.addBtn} ${loadingState ? styles.addBtnDisable : ""}`} // This class is if hashtags are generating we need to disable the button
          disabled={loadingState || isLoading}
          onClick={
            prefilledEvent
              ? () => handleSaveEvent(prefilledEvent.eventId)
                : handleAddEvent
          }>
          Save and Add event</button>
      </div>
      <div className={styles.line}></div>
      <div className={`${styles.detailsContainer} ${descriptionModal || speakerModal || registerModal ? styles.modalOpen : ""}`} style={{ backgroundColor: pageBgColor }}>
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

          </div>
        </div>
      </div>
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