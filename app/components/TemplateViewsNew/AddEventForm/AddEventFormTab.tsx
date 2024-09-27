import React, { useEffect, useRef, useState } from 'react'
import styles from './addeventformtab.style.module.css'
import Placeholder from '/public/placeholder.png'
import { useTheme } from '@/context'
import { myFetch } from '@/utils/myFetch'
import { baseUrl } from '@/constants'
import { AllEventsType } from '@/types/alleventtype'
import { GolbalEventType } from '@/types/globaleventtype'
import { showToast } from "@/utils/showToast";
import Details from './Details/Details'
import Subeventform from './Subevent/Subeventform'
import { FormState } from '@/types/Formstate'

// interface SpeakerProfileType {
//     id: string;
//     name: string;
//     linkedin: string;
//     designation: string;
//     // profileImage: string | ArrayBuffer | null;
//     profileImage: File | null
// }
// interface ImageState {
//     placeHolder: any;
//     file: File | null;
// }

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
    eventFlow: string;
    setEventFlow: (value: string) => void;
}

const AddEventFormTab = ({ setIsAddEventModalOpen, pageBgColor, eventFont, widgetId, prefilledEvent, prefilledGlobalEvent, eventName, setEventName, cityName, setCityName, participationType, setParticipationType, description, setDescription, fetchEvents, addedEventIds, eventFlow, setEventFlow }: Props) => {
    const initialFormState: FormState = {
        textValue: description,
        speakerProfilesData: [],
        prefilledProfile: undefined,
        registerMessage: prefilledEvent?.customizationData.registerMessage || 'Welcome! To join the event, please register below.',
        registerBtnText:prefilledEvent?.customizationData.registerBtnText || 'Register',
        registerBtnColor: prefilledEvent?.customizationData.registerBtnColor || '#1a1a1a',
        countryName:prefilledEvent?.countryName || prefilledGlobalEvent?.countryName || '',
        timeZone:prefilledEvent?.gmtZone || 'GMT+05:30 Chennai',
        timeZoneKey: 1,
        startDate: prefilledEvent?.startDate || prefilledGlobalEvent?.startDate || '',
        endDate: prefilledEvent?.endDate || prefilledGlobalEvent?.endDate || '',
        startTime:prefilledEvent?.startTime || '12:00 A.M',
        endTime: prefilledEvent?.endTime || '12:00 A.M',
        eventFormat: prefilledEvent?.customizationData.eventFormat || prefilledGlobalEvent?.format || "In-person",
        boothNumber: prefilledEvent?.customizationData.boothNumber || "",
        participationMessage: prefilledEvent?.customizationData.participationMessage || "",
        banner: { placeHolder: prefilledEvent?.logoUrl || Placeholder, file: null }, // Customize placeholder as needed
        venue: prefilledEvent?.customizationData.venue || prefilledGlobalEvent?.venue || "",
        latitude: Number(prefilledEvent?.latitude || prefilledGlobalEvent?.latitude) || 37.7749,
        longitude: Number(prefilledEvent?.longitude || prefilledGlobalEvent?.longitude) || -122.4194,
        hashtags: prefilledEvent?.customizationData.hashtags.split(",") || [],
        query: '',
        isEventNameEmpty: false,
        isEventFormatEmpty: false,
        isEventDescriptionEmpty: false,
        isEventParticipationEmpty: false,
        isParticipationMessageEmpty: false,
        isTextValueMessageEmpty: false,
        errorMessage: 'Event name is required.',
    };
    const [mainEventState, setMainEventState] = useState<FormState>(initialFormState);
    const [subeventState, setSubeventState] = useState<FormState>(initialFormState);

    // const [textValue, setTextValue] = useState<string>(description)
    // const [speakerProfilesData, setSpeakerProfilesData] = useState<SpeakerProfileType[]>([])
    // const [prefilledProfile, setPrefilledProfile] = useState<SpeakerProfileType | undefined>();
    // const [registerMessage, setRegisterMessage] = useState<string>(prefilledEvent?.customizationData.registerMessage || "Welcome! To join the event, please register below.")
    // const [registerBtnText, setRegisterBtnText] = useState<string>(prefilledEvent?.customizationData.registerBtnText || "Register")
    // const [registerBtnColor, setRegisterBtnColor] = useState<string>(prefilledEvent?.customizationData.registerBtnColor || "#1a1a1a")
    // const [countryName, setCountryName] = useState<string>(prefilledEvent?.countryName || prefilledGlobalEvent?.countryName || "")
    // const [timeZone, setTimeZone] = useState<string>(prefilledEvent?.gmtZone || "GMT+05:30 Chennai")
    // const [timeZoneKey, setTimeZoneKey] = useState<number>(18)
    // const [startDate, setStartDate] = useState<string>(prefilledEvent?.startDate || prefilledGlobalEvent?.startDate || "")
    // const [endDate, setEndDate] = useState<string>(prefilledEvent?.endDate || prefilledGlobalEvent?.endDate || "")
    // const [startTime, setStartTime] = useState<string>(prefilledEvent?.startTime || "12:00 A.M")
    // const [endTime, setEndTime] = useState<string>(prefilledEvent?.endTime || "12:00 A.M")
    // const [eventFormat, setEventFormat] = useState<string>(prefilledEvent?.customizationData.eventFormat || prefilledGlobalEvent?.format || "In-person")

    // const [boothNumber, setBoothNumber] = useState<string>(prefilledEvent?.customizationData.boothNumber || "")
    // const [participationMessage, setParticipationMessage] = useState<string>(prefilledEvent?.customizationData.participationMessage || "")
    const [loadingState, setLoadingState] = useState<boolean>(false)
    // const [banner, setBanner] = useState<ImageState>({
    //     placeHolder: prefilledEvent?.logoUrl || Placeholder,
    //     file: null
    // });
    // const [venue, setVenue] = useState(prefilledEvent?.customizationData.venue || prefilledGlobalEvent?.venue || "")
    // const [latitude, setLatitude] = useState(Number(prefilledEvent?.latitude || prefilledGlobalEvent?.latitude) || 37.7749)
    // const [longitude, setLongitude] = useState(Number(prefilledEvent?.longitude || prefilledGlobalEvent?.longitude) || -122.4194);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    // const [hashtags, setHashtags] = useState<string[]>(prefilledEvent?.customizationData.hashtags.split(",") || [])
    // const [query, setQuery] = useState("")
    // const [isEventNameEmpty, setIsEventNameEmpty] = useState(false);
    // const [isEventFormatEmpty, setIsEventFormatEmpty] = useState(false);
    // const [isEventDescriptionEmpty, setIsEventDescriptionEmpty] = useState(false);
    // const [isEventParticipationEmpty, setIsEventParticipationEmpty] = useState(false);
    // const [isParticipationMessageEmpty, setIsParticipationMessageEmpty] = useState<boolean>(false)
    // const [isTextValueMessageEmpty, setIsTextValueMessageEmpty] = useState<boolean>(false)
    // const [errorMessage, setErrorMessage] = useState("Event name is required.");
    const [activeBtn, setActiveBtn] = useState<string>("main")
    const [collapseMainEventForm, setCollapseMainEventForm] = useState<boolean>(false)

    const { theme } = useTheme()

    const handleMaineventChanges = (field: keyof FormState, value: any) => {
        setMainEventState((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubeventChange = (field: keyof FormState, value: any) => {
        setSubeventState((prev) => ({ ...prev, [field]: value }));
    };
    const handleAddEvent = async () => {
        if (!eventName || eventName === "") {
            handleMaineventChanges('isEventNameEmpty', true)
            // setIsEventNameEmpty(true)
        } else {
            handleMaineventChanges('isEventNameEmpty', false)
            // setIsEventNameEmpty(false)
        }
        if (!mainEventState.query) {
            handleMaineventChanges('isEventFormatEmpty', true)
            // setIsEventFormatEmpty(true)
        } else {
            handleMaineventChanges('isEventFormatEmpty', false)
            // setIsEventFormatEmpty(false)
        }
        if (!description) {
            handleMaineventChanges('isEventDescriptionEmpty', true)
            // setIsEventDescriptionEmpty(true)
        } else {
            handleMaineventChanges('isEventDescriptionEmpty', false)
            // setIsEventDescriptionEmpty(false)
        }
        if (!participationType) {
            handleMaineventChanges('isEventParticipationEmpty', true)
            // setIsEventParticipationEmpty(true)
        } else {
            handleMaineventChanges('isEventParticipationEmpty', false)
            // setIsEventParticipationEmpty(false)
        }
        if (!mainEventState.participationMessage) {
            handleMaineventChanges('isParticipationMessageEmpty', true)
            // setIsParticipationMessageEmpty(true)
        }
        if (!mainEventState.textValue) {
            handleMaineventChanges('isTextValueMessageEmpty', true)
            // setIsTextValueMessageEmpty(true)
        }

        if (!eventName.trim() || !mainEventState.eventFormat || !mainEventState.startTime || !mainEventState.endTime || !mainEventState.startDate || !mainEventState.endDate || !description.trim() || !cityName || !mainEventState.countryName || !mainEventState.timeZone || !mainEventState.latitude || !mainEventState.longitude || !participationType || !mainEventState.participationMessage) {

            showToast("error", "Please fill in all the fields");
            return; // Exit the function if any field is missing
        }

        if (!mainEventState.banner.placeHolder && !mainEventState.banner.file) {
            showToast("error", "Please upload or generate a Poster");
            return; // Exit the function if any field is missing
        }
        const eventCustomizationData = {
            pageBgColor,
            eventFont,
            registerBtnColor: mainEventState.registerBtnColor,
            registerBtnText: mainEventState.registerBtnText,
            registerMessage: mainEventState.registerMessage,
            speakerProfilesData: mainEventState.speakerProfilesData,
            participationMessage: mainEventState.participationMessage,
            venue: mainEventState.venue,
            hashtags: mainEventState.hashtags.join(","),
            boothNumber: mainEventState.boothNumber
        }
        const eventData = {
            format: mainEventState.eventFormat,
            start_time: mainEventState.startTime,
            end_time: mainEventState.endTime,
            end_date: mainEventState.endDate,
            start_date: mainEventState.startDate,
            description,
            location_city: cityName,
            location_country: mainEventState.countryName,
            gmt_time: mainEventState.timeZone,
            latitude: mainEventState.latitude,
            longitude: mainEventState.longitude,
            participationType,
            event_type: "Tradeshow",
            customizationData: JSON.stringify(eventCustomizationData)
        };
        const formData = new FormData()
        formData.append("name", eventName)
        formData.append("data", JSON.stringify(eventData))
        formData.append("type", "MAIN")

        if (mainEventState.banner.file || mainEventState.banner.placeHolder.includes("oaidalleapiprodscus")) {
            if (mainEventState.banner.file) {
                formData.append("file", mainEventState.banner.file); // Use the file field if uploaded by the user
            } else {
                formData.append("logoUrl", mainEventState.banner.placeHolder); // Use logoUrl if the banner is AI-generated
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
            handleMaineventChanges('isEventNameEmpty', true)
            // setIsEventNameEmpty(true)
        } else {
            handleMaineventChanges('isEventNameEmpty', false)
            // setIsEventNameEmpty(false)
        }
        if (!mainEventState.query && !mainEventState.latitude || !mainEventState.longitude) {
            handleMaineventChanges('isEventFormatEmpty', true)
            // setIsEventFormatEmpty(true)
        } else {
            handleMaineventChanges('isEventFormatEmpty', false)
            // setIsEventFormatEmpty(false)
        }
        if (!description) {
            handleMaineventChanges('isEventDescriptionEmpty', true)
            // setIsEventDescriptionEmpty(true)
        } else {
            handleMaineventChanges('isEventDescriptionEmpty', false)
            // setIsEventDescriptionEmpty(false)
        }
        if (!participationType) {
            handleMaineventChanges('isEventParticipationEmpty', true)
            // setIsEventParticipationEmpty(true)
        } else {
            handleMaineventChanges('isEventParticipationEmpty', false)
            // setIsEventParticipationEmpty(false)
        }
        if (!mainEventState.participationMessage) {
            handleMaineventChanges('isParticipationMessageEmpty', true)
            // setIsParticipationMessageEmpty(true)
        }
        if (!mainEventState.textValue.trim()) {
            handleMaineventChanges('isTextValueMessageEmpty', true)
            // setIsTextValueMessageEmpty(true)
        }
        if (!eventName.trim() || !mainEventState.eventFormat || !mainEventState.startTime || !mainEventState.endTime || !mainEventState.startDate || !mainEventState.endDate || !description.trim() || !cityName || !mainEventState.countryName || !mainEventState.timeZone || !mainEventState.latitude || !mainEventState.longitude || !participationType || !mainEventState.participationMessage) {
            showToast("error", "Please fill in all the fields");
            return; // Exit the function if any field is missing
        }
        if (!prefilledEvent?.logoUrl) { // We are checking that if the banner is already there i.e if the user has not upadted the banner while saving, then we dont need to check the below conditions
            if (!mainEventState.banner.placeHolder && !mainEventState.banner.file) {
                showToast("error", "Please upload or generate a Poster");
                return; // Exit the function if any field is missing
            }
        }
        const eventCustomizationData = {
            pageBgColor,
            eventFont,
            registerBtnColor: mainEventState.registerBtnColor,
            registerBtnText: mainEventState.registerBtnText,
            registerMessage: mainEventState.registerMessage,
            speakerProfilesData: mainEventState.speakerProfilesData,
            participationMessage: mainEventState.participationMessage,
            venue: mainEventState.venue,
            hashtags: mainEventState.hashtags.join(","),
            boothNumber: mainEventState.boothNumber
        }
        const eventData = {
            id: eventId,
            format: mainEventState.eventFormat,
            start_time: mainEventState.startTime,
            end_time: mainEventState.endTime,
            end_date: mainEventState.endDate,
            start_date: mainEventState.startDate,
            description,
            logoUrl: mainEventState.banner.placeHolder,
            location_city: cityName,
            location_country: mainEventState.countryName,
            participationType,
            gmt_time: mainEventState.timeZone,
            latitude: mainEventState.latitude,
            longitude: mainEventState.longitude,
            event_type: "Tradeshow",
            customizationData: JSON.stringify(eventCustomizationData)
        };
        const formData = new FormData();
        formData.append("id", eventId);
        formData.append("name", eventName);
        formData.append("data", JSON.stringify(eventData));
        // formData.append("interest", participationType.toUpperCase())
        formData.append("sourceId", widgetId)
        if (mainEventState.banner.placeHolder.includes("eventgeni") == false) { // This means if the banner is not updated we dont want to send the patch request for banner updation.
            if (mainEventState.banner.file) {
                formData.append("file", mainEventState.banner.file); // Use the file field if uploaded by the user
            } else {
                formData.append("logoUrl", mainEventState.banner.placeHolder); // Use logoUrl if the banner is AI-generated
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
    const handleModalClose = () => {
        setIsAddEventModalOpen(false)
        setEventFlow("")
    }
    console.log("event flow is : ", eventFlow)
    return (
        <div className={styles.body}>
            <div className={`${styles.btnContainer} ${eventFlow === "side" ? styles.endBtnContainer : ""}`} style={{ backgroundColor: theme === "dark" ? "#131313" : "#FAFAFA" }}>
                {eventFlow === "main" && <div className={styles.eventBtns}>
                    <button className={activeBtn === "main" ? styles.activebtn : ""}>Main Event</button>
                    <button className={activeBtn === "side" ? styles.activebtn : ""}>Side Event</button>
                </div>}
                <div className={styles.saveCancelBtns}>
                    <button className={styles.closeBtn} style={{ color: theme === "dark" ? "white" : "black" }} onClick={handleModalClose}>Close</button>
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
                {collapseMainEventForm && eventFlow === 'main' ? (<div className={styles.collapsedContainer}>
                    <div>
                        <DescIcon />
                        <span>Main Event</span>
                    </div>
                    <div className={styles.collapseBtn} onClick={() => setCollapseMainEventForm(false)}><DownArrow /></div>
                </div>) : (eventFlow === 'main' &&
                    <Details
                        formState={mainEventState}
                        handleChange={handleMaineventChanges}
                        // pageBgColor={pageBgColor}
                        eventFont={eventFont}
                        eventName={eventName}
                        setEventName={setEventName}
                        cityName={cityName}
                        setCityName={setCityName}
                        participationType={participationType}
                        setParticipationType={setParticipationType}
                        description={description}
                        setDescription={setDescription}
                        // textValue={textValue}
                        // setTextValue={setTextValue}
                        // speakerProfilesData={speakerProfilesData}
                        // setSpeakerProfilesData={setSpeakerProfilesData}
                        // prefilledProfile={prefilledProfile}
                        // setPrefilledProfile={setPrefilledProfile}
                        // registerMessage={registerMessage}
                        // setRegisterMessage={setRegisterMessage}
                        // registerBtnText={registerBtnText}
                        // setRegisterBtnText={setRegisterBtnText}
                        // registerBtnColor={registerBtnColor}
                        // setRegisterBtnColor={setRegisterBtnColor}
                        // countryName={countryName}
                        // setCountryName={setCountryName}
                        // timeZone={timeZone}
                        // setTimeZone={setTimeZone}
                        // timeZoneKey={timeZoneKey}
                        // setTimeZoneKey={setTimeZoneKey}
                        // startDate={startDate}
                        // setStartDate={setStartDate}
                        // endDate={endDate}
                        // setEndDate={setEndDate}
                        // startTime={startTime}
                        // setStartTime={setStartTime}
                        // endTime={endTime}
                        // setEndTime={setEndTime}
                        // eventFormat={eventFormat}
                        // setEventFormat={setEventFormat}
                        // boothNumber={boothNumber}
                        // setBoothNumber={setBoothNumber}
                        // participationMessage={participationMessage}
                        // setParticipationMessage={setParticipationMessage}
                        setLoadingState={setLoadingState}
                        // banner={banner}
                        // setBanner={setBanner}
                        // venue={venue}
                        // setVenue={setVenue}
                        // latitude={latitude}
                        // setLatitude={setLatitude}
                        // longitude={longitude}
                        // setLongitude={setLongitude}
                        fileInputRef={fileInputRef}
                        // hashtags={hashtags}
                        // setHashtags={setHashtags}
                        // query={query}
                        // setQuery={setQuery}
                        // isEventNameEmpty={isEventNameEmpty}
                        // setIsEventNameEmpty={setIsEventNameEmpty}
                        // isEventFormatEmpty={isEventFormatEmpty}
                        // setIsEventFormatEmpty={setIsEventFormatEmpty}
                        // isEventDescriptionEmpty={isEventDescriptionEmpty}
                        // setIsEventDescriptionEmpty={setIsEventDescriptionEmpty}
                        // isEventParticipationEmpty={isEventParticipationEmpty}
                        // setIsEventParticipationEmpty={setIsEventParticipationEmpty}
                        // isParticipationMessageEmpty={isParticipationMessageEmpty}
                        // setIsParticipationMessageEmpty={setIsParticipationMessageEmpty}
                        // isTextValueMessageEmpty={isTextValueMessageEmpty}
                        // setIsTextValueMessageEmpty={setIsTextValueMessageEmpty}
                        // errorMessage={errorMessage}
                        // setErrorMessage={setErrorMessage}
                        prefilledEvent={prefilledEvent}
                        setCollapseMainEventForm={setCollapseMainEventForm}
                        collapseMainEventForm={collapseMainEventForm}
                    />)}
                {(collapseMainEventForm || eventFlow === "side") && <Subeventform 
                formState={subeventState}
                handleChange={handleSubeventChange}
                // pageBgColor={pageBgColor}
                    eventFont={eventFont}
                    eventName={eventName}
                    setEventName={setEventName}
                    cityName={cityName}
                    setCityName={setCityName}
                    participationType={participationType}
                    setParticipationType={setParticipationType}
                    description={description}
                    setDescription={setDescription}
                    // textValue={textValue}
                    // setTextValue={setTextValue}
                    // speakerProfilesData={speakerProfilesData}
                    // setSpeakerProfilesData={setSpeakerProfilesData}
                    // prefilledProfile={prefilledProfile}
                    // setPrefilledProfile={setPrefilledProfile}
                    // registerMessage={registerMessage}
                    // setRegisterMessage={setRegisterMessage}
                    // registerBtnText={registerBtnText}
                    // setRegisterBtnText={setRegisterBtnText}
                    // registerBtnColor={registerBtnColor}
                    // setRegisterBtnColor={setRegisterBtnColor}
                    // countryName={countryName}
                    // setCountryName={setCountryName}
                    // timeZone={timeZone}
                    // setTimeZone={setTimeZone}
                    // timeZoneKey={timeZoneKey}
                    // setTimeZoneKey={setTimeZoneKey}
                    // startDate={startDate}
                    // setStartDate={setStartDate}
                    // endDate={endDate}
                    // setEndDate={setEndDate}
                    // startTime={startTime}
                    // setStartTime={setStartTime}
                    // endTime={endTime}
                    // setEndTime={setEndTime}
                    // eventFormat={eventFormat}
                    // setEventFormat={setEventFormat}
                    // boothNumber={boothNumber}
                    // setBoothNumber={setBoothNumber}
                    // participationMessage={participationMessage}
                    // setParticipationMessage={setParticipationMessage}
                    setLoadingState={setLoadingState}
                    // banner={banner}
                    // setBanner={setBanner}
                    // venue={venue}
                    // setVenue={setVenue}
                    // latitude={latitude}
                    // setLatitude={setLatitude}
                    // longitude={longitude}
                    // setLongitude={setLongitude}
                    fileInputRef={fileInputRef}
                    // hashtags={hashtags}
                    // setHashtags={setHashtags}
                    // query={query}
                    // setQuery={setQuery}
                    // isEventNameEmpty={isEventNameEmpty}
                    // setIsEventNameEmpty={setIsEventNameEmpty}
                    // isEventFormatEmpty={isEventFormatEmpty}
                    // setIsEventFormatEmpty={setIsEventFormatEmpty}
                    // isEventDescriptionEmpty={isEventDescriptionEmpty}
                    // setIsEventDescriptionEmpty={setIsEventDescriptionEmpty}
                    // isEventParticipationEmpty={isEventParticipationEmpty}
                    // setIsEventParticipationEmpty={setIsEventParticipationEmpty}
                    // isParticipationMessageEmpty={isParticipationMessageEmpty}
                    // setIsParticipationMessageEmpty={setIsParticipationMessageEmpty}
                    // isTextValueMessageEmpty={isTextValueMessageEmpty}
                    // setIsTextValueMessageEmpty={setIsTextValueMessageEmpty}
                    // errorMessage={errorMessage}
                    // setErrorMessage={setErrorMessage}
                    prefilledEvent={prefilledEvent}
                    eventFlow={eventFlow}
                />}
            </div>
        </div >
    )
}

export default AddEventFormTab

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