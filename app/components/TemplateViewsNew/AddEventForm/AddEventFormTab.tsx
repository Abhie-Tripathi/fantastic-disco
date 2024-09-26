import React, { useRef, useState } from 'react'
import styles from './addeventformtab.style.module.css'
import Placeholder from '/public/placeholder.png'
import { useTheme } from '@/context'
import { myFetch } from '@/utils/myFetch'
import { baseUrl } from '@/constants'
import { AllEventsType } from '@/types/alleventtype'
import { GolbalEventType } from '@/types/globaleventtype'
import { showToast } from "@/utils/showToast";
import Details from './Details/Details'

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
    eventFlow : string;
}
const AddEventFormTab = ({ setIsAddEventModalOpen, pageBgColor, eventFont, widgetId, prefilledEvent, prefilledGlobalEvent, eventName, setEventName, cityName, setCityName, participationType, setParticipationType, description, setDescription, fetchEvents, addedEventIds,  eventFlow}: Props) => {

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
    const [endDate, setEndDate] = useState<string>(prefilledEvent?.endDate || prefilledGlobalEvent?.endDate || "")
    const [startTime, setStartTime] = useState<string>(prefilledEvent?.startTime || "12:00 A.M")
    const [endTime, setEndTime] = useState<string>(prefilledEvent?.endTime || "12:00 A.M")
    const [eventFormat, setEventFormat] = useState<string>(prefilledEvent?.customizationData.eventFormat || prefilledGlobalEvent?.format || "In-person")

    const [boothNumber, setBoothNumber] = useState<string>(prefilledEvent?.customizationData.boothNumber || "")
    const [participationMessage, setParticipationMessage] = useState<string>(prefilledEvent?.customizationData.participationMessage || "")
    const [loadingState, setLoadingState] = useState<boolean>(false)
    const [banner, setBanner] = useState<ImageState>({
        placeHolder: prefilledEvent?.logoUrl || Placeholder,
        file: null
    });
    const [venue, setVenue] = useState(prefilledEvent?.customizationData.venue || prefilledGlobalEvent?.venue || "")
    const [latitude, setLatitude] = useState(Number(prefilledEvent?.latitude || prefilledGlobalEvent?.latitude) || 37.7749)
    const [longitude, setLongitude] = useState(Number(prefilledEvent?.longitude || prefilledGlobalEvent?.longitude) || -122.4194);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [hashtags, setHashtags] = useState<string[]>(prefilledEvent?.customizationData.hashtags.split(",") || [])
    const [query, setQuery] = useState("")
    const [isEventNameEmpty, setIsEventNameEmpty] = useState(false);
    const [isEventFormatEmpty, setIsEventFormatEmpty] = useState(false);
    const [isEventDescriptionEmpty, setIsEventDescriptionEmpty] = useState(false);
    const [isEventParticipationEmpty, setIsEventParticipationEmpty] = useState(false);
    const [isParticipationMessageEmpty, setIsParticipationMessageEmpty] = useState<boolean>(false)
    const [isTextValueMessageEmpty, setIsTextValueMessageEmpty] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState("Event name is required.");
    const [activeBtn, setActiveBtn] = useState<string>("main")
    const [collapseMainEventForm, setCollapseMainEventForm] = useState<boolean>(false)

    const { theme } = useTheme()

    const handleAddEvent = async () => {
        if (!eventName || eventName === "") {
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

        if (!banner.placeHolder && !banner.file) {
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
                formData.append("logoUrl", banner.placeHolder); // Use logoUrl if the banner is AI-generated
            }
        }

        // formData.append("interest", participationType.toUpperCase())
        // formData.append("source", "eventgeni/widget/event")
        formData.append("sourceId", widgetId)

        const { data, error } = await myFetch(`${baseUrl}/event`, {
            method: 'POST',
            body: formData
        })
        if (data) {
            console.log("event added :", data)
            setIsAddEventModalOpen(false)
            showToast("success", "Event Added Successfully")
            fetchEvents(0, "update")
        }
        if (error) {
            console.log(error)
        }

    }

    // This function can be called from 2 perspectives. If the already added event in the widget is getting updated or if we are adding the event to the widget from all events list
    const handleSaveEvent = async (eventId: string) => {
        if (!eventName || eventName === "") {
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
            if (!banner.placeHolder && !banner.file) {
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
                formData.append("logoUrl", banner.placeHolder); // Use logoUrl if the banner is AI-generated
            }
        }
        const { data, error } = await myFetch(`${baseUrl}/event`, {
            method: 'PATCH',
            body: formData,
        });
        if (data) {
            setIsAddEventModalOpen(false)
            showToast("success", "Event Updated Successfully")
            fetchEvents(0, "update")
        }
        if (error) {
            console.log(error);
        }
    }
    return (
        <div className={styles.body}>
            <div className={styles.btnContainer} style={{ backgroundColor: theme === "dark" ? "#131313" : "#FAFAFA" }}>
                <div className={styles.eventBtns}>
                    <button className={activeBtn === "main" ? styles.activebtn : ""}>Main Event</button>
                    <button className={activeBtn === "side" ? styles.activebtn : ""}>Side Event</button>
                </div>
                <div className={styles.saveCancelBtns}>
                    <button className={styles.closeBtn} style={{ color: theme === "dark" ? "white" : "black" }} onClick={() => setIsAddEventModalOpen(false)}>Close</button>
                    <button className={`${styles.addBtn} ${loadingState || loadingState ? styles.addBtnDisable : ""}`} // This class is if hashtags are generating we need to disable the button
                        disabled={loadingState || loadingState}
                        onClick={
                            prefilledEvent
                                ? () => handleSaveEvent(prefilledEvent.eventId)
                                : handleAddEvent
                        }>
                        Save and Add event</button>
                </div>
            </div>
            <div className={styles.formContainer} style={{ backgroundColor: pageBgColor }}>
                <Details
                    pageBgColor={pageBgColor}
                    eventFont={eventFont}
                    eventName={eventName}
                    setEventName={setEventName}
                    cityName={cityName}
                    setCityName={setCityName}
                    participationType={participationType}
                    setParticipationType={setParticipationType}
                    description={description}
                    setDescription={setDescription}
                    textValue={textValue}
                    setTextValue={setTextValue}
                    speakerProfilesData={speakerProfilesData}
                    setSpeakerProfilesData={setSpeakerProfilesData}
                    prefilledProfile={prefilledProfile}
                    setPrefilledProfile={setPrefilledProfile}
                    registerMessage={registerMessage}
                    setRegisterMessage={setRegisterMessage}
                    registerBtnText={registerBtnText}
                    setRegisterBtnText={setRegisterBtnText}
                    registerBtnColor={registerBtnColor}
                    setRegisterBtnColor={setRegisterBtnColor}
                    countryName={countryName}
                    setCountryName={setCountryName}
                    timeZone={timeZone}
                    setTimeZone={setTimeZone}
                    timeZoneKey={timeZoneKey}
                    setTimeZoneKey={setTimeZoneKey}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    startTime={startTime}
                    setStartTime={setStartTime}
                    endTime={endTime}
                    setEndTime={setEndTime}
                    eventFormat={eventFormat}
                    setEventFormat={setEventFormat}
                    boothNumber={boothNumber}
                    setBoothNumber={setBoothNumber}
                    participationMessage={participationMessage}
                    setParticipationMessage={setParticipationMessage}
                    setLoadingState={setLoadingState}
                    banner={banner}
                    setBanner={setBanner}
                    venue={venue}
                    setVenue={setVenue}
                    latitude={latitude}
                    setLatitude={setLatitude}
                    longitude={longitude}
                    setLongitude={setLongitude}
                    fileInputRef={fileInputRef}
                    hashtags={hashtags}
                    setHashtags={setHashtags}
                    query={query}
                    setQuery={setQuery}
                    isEventNameEmpty={isEventNameEmpty}
                    setIsEventNameEmpty={setIsEventNameEmpty}
                    isEventFormatEmpty={isEventFormatEmpty}
                    setIsEventFormatEmpty={setIsEventFormatEmpty}
                    isEventDescriptionEmpty={isEventDescriptionEmpty}
                    setIsEventDescriptionEmpty={setIsEventDescriptionEmpty}
                    isEventParticipationEmpty={isEventParticipationEmpty}
                    setIsEventParticipationEmpty={setIsEventParticipationEmpty}
                    isParticipationMessageEmpty={isParticipationMessageEmpty}
                    setIsParticipationMessageEmpty={setIsParticipationMessageEmpty}
                    isTextValueMessageEmpty={isTextValueMessageEmpty}
                    setIsTextValueMessageEmpty={setIsTextValueMessageEmpty}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    prefilledEvent={prefilledEvent}
                    setCollapseMainEventForm = {setCollapseMainEventForm}
                    collapseMainEventForm = {collapseMainEventForm}
                />
            </div>

        </div >
    )
}

export default AddEventFormTab