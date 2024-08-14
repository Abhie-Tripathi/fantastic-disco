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
  fetchEvents: () => Promise<void>;
  fetchAddedEvents: () => Promise<void>;
  addedEventIds: string[]
  fetchedAddedEvents: AddedEventsType[]
  prefilledAddedEvent?: PrefilledAddedEventsType
  prefilledNormalEvent?: AllEventsType
  prefilledGlobalEvent?: GolbalEventType
}
const Details = ({ setIsAddEventModalOpen, pageBgColor, eventFont, widgetId, fetchEvents, addedEventIds, fetchAddedEvents, fetchedAddedEvents, prefilledAddedEvent, prefilledNormalEvent, prefilledGlobalEvent }: Props) => {

  const Mapview = React.lazy(() => import('@/app/components/DetailPage/Mapview'));
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [descriptionModal, setDescriptionModal] = useState<boolean>(false)
  const [speakerModal, setSpeakerModal] = useState<boolean>(false)
  const [registerModal, setRegisterModal] = useState<boolean>(false)
  const [description, setDescription] = useState<string>(prefilledAddedEvent?.description || prefilledNormalEvent?.description || prefilledGlobalEvent?.description || "")
  const [textValue, setTextValue] = useState<string>(description)
  const [participationType, setParticipationType] = useState<string>("Attendee")
  const [speakerProfilesData, setSpeakerProfilesData] = useState<SpeakerProfileType[]>([])
  const [prefilledProfile, setPrefilledProfile] = useState<SpeakerProfileType | undefined>();
  const [registerMessage, setRegisterMessage] = useState<string>(prefilledAddedEvent?.registerMessage || "Welcome! To join the event, please register below.")
  const [registerBtnText, setRegisterBtnText] = useState<string>(prefilledAddedEvent?.registerBtnText || "Register")
  const [registerBtnColor, setRegisterBtnColor] = useState<string>(prefilledAddedEvent?.registerBtnColor || "#1a1a1a")
  const [cityName, setCityName] = useState<string>(prefilledAddedEvent?.cityName || prefilledNormalEvent?.cityName || prefilledGlobalEvent?.cityName || "")
  const [countryName, setCountryName] = useState<string>(prefilledAddedEvent?.countryName || prefilledNormalEvent?.countryName || prefilledGlobalEvent?.countryName || "")
  const [timeZone, setTimeZone] = useState<string>(prefilledAddedEvent?.timeZone || "GMT+05:30 Chennai")
  const [timeZoneKey, setTimeZoneKey] = useState<number>(18)
  const [startDate, setStartDate] = useState<string>(prefilledAddedEvent?.startDate || prefilledNormalEvent?.startDate || prefilledGlobalEvent?.startDate || "")
  const [endDate, setEndDate] = useState<string>(prefilledAddedEvent?.endDate || prefilledNormalEvent?.endDate || prefilledGlobalEvent?.endDate || "")
  const [startTime, setStartTime] = useState<string>(prefilledAddedEvent?.startTime || prefilledNormalEvent?.startTime || "12:00 A.M")
  const [endTime, setEndTime] = useState<string>(prefilledAddedEvent?.endTime || prefilledNormalEvent?.endTime || "12:00 A.M")
  const [eventFormat, setEventFormat] = useState<string>(prefilledAddedEvent?.eventFormat || prefilledNormalEvent?.format || prefilledGlobalEvent?.format || "In-person")
  const [eventName, setEventName] = useState<string>(prefilledAddedEvent?.name || prefilledNormalEvent?.name || prefilledGlobalEvent?.name || "");
  const [boothNumber, setBoothNumber] = useState<string>(prefilledAddedEvent?.boothNumber || "")
  const [participationMessage, setParticipationMessage] = useState<string>(prefilledAddedEvent?.participationMessage || "")
  const { isLoading, imageUrl, generatePrompt } = usePosterGenerator();
  const [banner, setBanner] = useState<ImageState>({
    placeHolder: prefilledAddedEvent?.bannerUrl || Placeholder,
    file: null
  });
  const [mapWidth, setMapWidth] = useState(0);
  const [venue, setVenue] = useState(prefilledAddedEvent?.venue || prefilledGlobalEvent?.venue || "")
  const [latitude, setLatitude] = useState(Number(prefilledAddedEvent?.latitude || prefilledGlobalEvent?.latitude) || 37.7749)
  const [longitude, setLongitude] = useState(Number(prefilledAddedEvent?.longitude || prefilledGlobalEvent?.longitude) || -122.4194)
  const mapDivRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);


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

  useEffect(() => {
    if (mapDivRef.current) {
      setMapWidth(mapDivRef.current.getBoundingClientRect().width);
    }
  }, [cityName])
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setBanner({ placeHolder: fileUrl, file });
    }
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
      gmt_time: timeZone,
    };
    const formData = new FormData()
    formData.append("name", eventName)
    formData.append("data", JSON.stringify(eventData))
    if (banner.file) {
      formData.append("file", banner.file); // Use the file field if uploaded by the user
    } else {
      formData.append("logoUrl", imageUrl); // Use logoUrl if the banner is AI-generated
    }
    formData.append("interest", participationType.toUpperCase())
    formData.append("source", "eventgeni/widget/event")
    formData.append("sourceId", widgetId)

    const { data, error } = await myFetch(`${baseUrl}/event`, {
      method: 'POST',
      body: formData
    })
    if (data) {
      const eventId = data.data.id
      const bannerUrl = data.data.data.logoUrl
      addEventToWidget(eventId, bannerUrl)
    }
    if (error) {
      console.log(error)
    }

  }
  const addEventToWidget = async (eventId: string, bannerUrl: string) => {
    const customizedFormData = new FormData()
    const existingEvents = fetchedAddedEvents || [];
    const newEvent = {
      id: eventId,
      pageBgColor,
      eventFont,
      registerBtnColor,
      registerBtnText,
      registerMessage,
      speakerProfilesData,
      participationMessage,
      bannerUrl,
      latitude,
      longitude,
      venue
    };
    const mergedEvents = [...existingEvents, newEvent];

    const otherData = {
      event: mergedEvents,
    };

    const eventIds = [...addedEventIds, eventId].join(',');

    customizedFormData.append('widgetId', widgetId);
    customizedFormData.append('otherdata', JSON.stringify(otherData))
    customizedFormData.append('eventId', eventIds)

    const { data, error } = await myFetch(`${baseUrl}/widget`, {
      method: 'POST',
      body: customizedFormData
    })
    if (data) {
      console.log("widget event data", data)
      setIsAddEventModalOpen(false)
      fetchEvents();
      fetchAddedEvents();
    }
    if (error) {
      console.log("error in adding event to widget ", error)
    }
  }

  // This function can be called from 2 perspectives. If the already added event in the widget is getting updated or if we are adding the event to the widget from all events list
  const handleSaveEvent = async (eventId: string) => {
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
      gmt_time: timeZone
    };
    const formData = new FormData();
    formData.append("id", eventId);
    formData.append("name", eventName);
    formData.append("data", JSON.stringify(eventData));
    formData.append("interest", participationType.toUpperCase())
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
    if (data) {
      const updatedEventId = data.data.id;
      const updatedBannerUrl = data.data.data.logoUrl;
      if (prefilledAddedEvent) {
        updateEventInWidget(updatedEventId, updatedBannerUrl)
      } else {
        addEventToWidget(updatedEventId, updatedBannerUrl);
      }

    }
    if (error) {
      console.log(error);
    }
  }
  const updateEventInWidget = async (eventId: string, updatedBannerUrl: string) => {
    const customizedFormData = new FormData();
    const existingEvents = fetchedAddedEvents || [];
    const updatedEvent = {
      id: eventId,
      pageBgColor,
      registerBtnColor,
      registerBtnText,
      registerMessage,
      boothNumber,
      speakerProfilesData,
      participationMessage,
      bannerUrl: updatedBannerUrl,
      latitude,
      longitude,
      venue
    };

    // Find and update the existing event
    const updatedEvents = existingEvents.map(event =>
      event.id === eventId ? updatedEvent : event
    );

    const otherData = {
      event: updatedEvents,
    };

    const eventIds = updatedEvents.map(event => event.id).join(',');

    customizedFormData.append('widgetId', widgetId);
    customizedFormData.append('otherdata', JSON.stringify(otherData));
    customizedFormData.append('eventId', eventIds);

    const { data, error } = await myFetch(`${baseUrl}/widget`, {
      method: 'POST',
      body: customizedFormData,
    });
    if (data) {
      console.log("widget event data", data);
      setIsAddEventModalOpen(false);
      fetchEvents();
      fetchAddedEvents();
    }
    if (error) {
      console.log("error in updating event in widget ", error);
    }
  };


  const handleGeneratePoster = () => {
    if (!isLoading) { // if poster is in generaing state, the handle poster function should not work
      if (description && eventName && countryName) {
        generatePrompt(countryName, description, eventName, 1024, 1024)
      }
    }
  }
  useEffect(() => {
    if (!prefilledAddedEvent && !banner.file) { // we dont want the poster to start generating it self if prefilled event is there
      if (description && eventName && countryName) {
        // generatePrompt(countryName, description, eventName, 1024, 1024)
      }
    }
  }, [description, eventName, countryName])

  useEffect(() => {
    if (imageUrl) {
      setBanner({ placeHolder: imageUrl, file: null });
    }
  }, [imageUrl]);

  return (
    <div className={styles.body}>
      <div className={styles.btnContainer} style={{ backgroundColor: theme === "dark" ? "#131313" : "#FAFAFA" }}>
        <button className={styles.closeBtn} style={{ color: theme === "dark" ? "white" : "black" }} onClick={() => setIsAddEventModalOpen(false)}>Close</button>
        <button className={styles.addBtn}
          onClick={
            prefilledAddedEvent
              ? () => handleSaveEvent(prefilledAddedEvent.id)
              : prefilledNormalEvent
                ? () => handleSaveEvent(prefilledNormalEvent.eventId)
                : handleAddEvent
          }>
          Save and Add event</button>
      </div>
      <div className={styles.line}></div>
      <div className={`${styles.detailsContainer} ${descriptionModal || speakerModal || registerModal ? styles.modalOpen : ""}`} style={{ backgroundColor: pageBgColor }}>
        <div className={styles.leftSection}>
          <div className={styles.posterContainer}>
            {isLoading ?
              <div className={styles.loader}>
                <div className={styles.spinner}></div>
              </div> : <Image src={banner.placeHolder} alt='Poster' width={296} height={290} style={{ borderRadius: 20, objectFit: "cover" }} />}
            <div className={styles.posterIcons}>
              <div onClick={handleGeneratePoster} data-name="Generate Your Banner">
                <Image src={AiIcon} alt='aigenerate' className={styles.aiIcon}></Image>
              </div>
              <div data-name="Upload Your Banner">
                <Image src={UploadIcon} alt='upload' onClick={() => fileInputRef.current?.click()}></Image>
                <input type="file" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} ref={fileInputRef} />
              </div>
            </div>
          </div>
          <div className={styles.participationContainer}><ParticipationContainer participationMessage={participationMessage} setParticipationMessage={setParticipationMessage} setParticipationType={setParticipationType} participationType={participationType} /></div>
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

          {participationType === "Speaker" ? <div className={styles.speakerProfileContainer}><SpeakerProfile speakerProfilesData={speakerProfilesData} setSpeakerModal={setSpeakerModal} handlePrefill={handlePrefill} /></div> : participationType === "Exhibitor" ? <div><ExhibitorContainer setBoothNumber={setBoothNumber} boothNumber={boothNumber} /></div> : <></>}

          {cityName &&
            <div className={styles.map} ref={mapDivRef}>
              <Suspense fallback={<div>Loading...</div>}>
                <Mapview latitude={latitude}
                  width={mapWidth}
                  longitude={longitude}
                  venue={venue}
                  zoom={6} />
              </Suspense>
            </div>
          }
          <div className={styles.descriptionContainer} ><DescriptionContainer setDescriptionModal={setDescriptionModal} description={description} /></div>
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