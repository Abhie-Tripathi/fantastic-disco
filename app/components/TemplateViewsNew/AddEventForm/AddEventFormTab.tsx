import React, { useEffect, useRef, useState } from 'react'
import styles from './addeventformtab.style.module.css'
import Placeholder from '/public/placeholder.png'
import { useTheme } from '@/context'
import { myFetch } from '@/utils/myFetch'
import { baseUrl } from '@/constants'
import { EventsType } from '@/types/alleventtype'
import { GolbalEventType } from '@/types/globaleventtype'
import { showToast } from "@/utils/showToast";
import Details from './Details/Details'
import Subeventform from './Subevent/Subeventform'
import { FormState } from '@/types/Formstate'
import confetti from "canvas-confetti";
import LeafTheme from '../../UI/LeafTheme'
import SnowfallTheme from '../../UI/SnowfallTheme'
import RandomTheme from '../../UI/RandomTheme'

interface Props {
    uploadedPhoto : File | undefined
    snowTheme : boolean;
    leavesTheme: boolean;
    setIsAddEventModalOpen: (value: boolean) => void
    formTheme: string;
    pageBgColor: string;
    pageGradient: string;
    confettiType: string;
    eventFont: string;
    widgetId: string;
    fetchEvents?: (page: number, type?: string) => Promise<void>;
    addedEventIds: string[]
    prefilledEvent?: EventsType | null
    prefilledGlobalEvent?: GolbalEventType | null
    eventFlow: string;
    setEventFlow?: (value: string) => void;
    mainEventState: FormState;
    subEventState: FormState;
    handleSubeventChange: (field: keyof FormState, value: any) => void;
    handleMaineventChanges: (field: keyof FormState, value: any) => void;
    setPrefilledGlobalEvent?: (value: GolbalEventType | null) => void;
    setPrefilledEvent?: (value: EventsType | null) => void;
    prefilledSubEvent?: EventsType | null;
    setPrefilledSubEvent?: (value: EventsType | null) => void
    fetchEventData?: () => Promise<undefined | null>;
    setChoiceFormModal?: (value: boolean) => void,
    isApproved?: boolean;
    setIsApproved?: (value: boolean) => void
}

const AddEventFormTab = ({uploadedPhoto,snowTheme, leavesTheme, formTheme, setPrefilledEvent, setPrefilledGlobalEvent, setIsAddEventModalOpen, pageBgColor, eventFont, widgetId, prefilledEvent, prefilledGlobalEvent, fetchEvents, addedEventIds, eventFlow, setEventFlow, mainEventState, subEventState, handleSubeventChange, handleMaineventChanges, prefilledSubEvent, setPrefilledSubEvent, setChoiceFormModal, fetchEventData, pageGradient, confettiType, isApproved, setIsApproved }: Props) => {
    const [loadingState, setLoadingState] = useState<boolean>(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [activeBtn, setActiveBtn] = useState<string>("main")
    const [collapseMainEventForm, setCollapseMainEventForm] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

    // const [mainEventName, setMainEventName] = useState<string>("");
    const { theme } = useTheme()

    const fireConfetti = () => {
        if (confettiCanvasRef.current) {
            const myConfetti = confetti.create(confettiCanvasRef.current, { resize: true });
            myConfetti({
                particleCount: 300,
                spread: 100,
                origin: { y: 0.9 },
                shapes: confettiType === "circle" ? ['circle'] : confettiType === "party" ? ['circle', 'square', 'star'] : ['star'],

            });
        }
    };
    useEffect(() => {
        if (confettiType.length > 0) {
            // Fire confetti immediately
            fireConfetti();
            // Set up the interval for firing every 4 seconds
            const interval = setInterval(fireConfetti, 4000);
            // Cleanup interval when confettiType changes or component unmounts
            return () => clearInterval(interval);
        }
    }, [confettiType]);

    console.log("mainEvent",mainEventState)

    const handleAddEvent = async () => {
        if (eventFlow === "main") {
            if (activeBtn === "side") {
                if (subEventState.eventName || subEventState.description || subEventState.query || subEventState.participationType) {
                    if (!subEventState.eventName || subEventState.eventName === "") {
                        handleSubeventChange('isEventNameEmpty', true)
                        // setIsEventNameEmpty(true)
                    } else {
                        handleSubeventChange('isEventNameEmpty', false)
                        // setIsEventNameEmpty(false)
                    }
                    if (!subEventState.query) {
                        handleSubeventChange('isEventFormatEmpty', true)
                        // setIsEventFormatEmpty(true)
                    } else {
                        handleSubeventChange('isEventFormatEmpty', false)
                        // setIsEventFormatEmpty(false)
                    }
                    if (!subEventState.description) {
                        handleSubeventChange('isEventDescriptionEmpty', true)
                        // setIsEventDescriptionEmpty(true)
                    } else {
                        handleSubeventChange('isEventDescriptionEmpty', false)
                        // setIsEventDescriptionEmpty(false)
                    }
                    if (!subEventState.participationType) {
                        handleSubeventChange('isEventParticipationEmpty', true)
                        // setIsEventParticipationEmpty(true)
                    } else {
                        handleSubeventChange('isEventParticipationEmpty', false)
                        // setIsEventParticipationEmpty(false)
                    }
                    if (!subEventState.textValue) {
                        handleSubeventChange('isTextValueMessageEmpty', true)
                        // setIsTextValueMessageEmpty(true)
                    }
                    if (subEventState.banner.placeHolder === Placeholder && !subEventState.banner.file) {
                        showToast("error", "Please upload or generate a Poster");
                        return; // Exit the function if any field is missing
                    }
                }
            }
            if (!mainEventState.eventName || mainEventState.eventName === "") {
                handleMaineventChanges('isEventNameEmpty', true)
                // setIsEventNameEmpty(true)
            } else {
                handleMaineventChanges('isEventNameEmpty', false)
                // setIsEventNameEmpty(false)
            }
            if ((mainEventState.eventFormat === "In-person" || mainEventState.eventFormat === "Hybrid" || mainEventState.eventFormat === "OFFLINE") && !mainEventState.query) {
                handleMaineventChanges('isEventFormatEmpty', true);
            } else if (mainEventState.eventFormat === "Virtual" || mainEventState.eventFormat === "ONLINE") {
                handleMaineventChanges('isEventFormatEmpty', false); // No need for location in virtual format
            }
            if (!mainEventState.description) {
                handleMaineventChanges('isEventDescriptionEmpty', true)
                // setIsEventDescriptionEmpty(true)
            } else {
                handleMaineventChanges('isEventDescriptionEmpty', false)
                // setIsEventDescriptionEmpty(false)
            }
            if (!mainEventState.participationType) {
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
            if (!mainEventState.event_type) {
                handleMaineventChanges('isEventTypeEmpty', true)
                // setIsParticipationMessageEmpty(true)
            }
            

            if (!mainEventState.textValue) {
                handleMaineventChanges('isTextValueMessageEmpty', true)
                // setIsTextValueMessageEmpty(true)
            }

            if (
                !mainEventState.eventName.trim() ||
                !mainEventState.eventFormat ||
                !mainEventState.startTime ||
                !mainEventState.endTime ||
                !mainEventState.startDate ||
                !mainEventState.endDate ||
                !mainEventState.description.trim() ||
                !mainEventState.participationType ||
                !mainEventState.participationMessage ||
                // Check location fields only for "In-person" or "Hybrid" events
                ((mainEventState.eventFormat === "In-person" || mainEventState.eventFormat === "Hybrid" || mainEventState.eventFormat === "OFFLINE") &&
                    (!mainEventState.cityName || !mainEventState.countryName || !mainEventState.timeZone || !mainEventState.latitude || !mainEventState.longitude))
            ) {
                showToast("error", "Please fill in all the required fields");
                return; // Exit the function if any field is missing
            }


            if (mainEventState.banner.placeHolder === Placeholder && !mainEventState.banner.file) {
                console.log("this code is running")
                showToast("error", "Please upload or generate a Poster");
                return; // Exit the function if any field is missing
            }
            const eventCustomizationData = {
                pageBgColor,
                pageGradient,
                confettiType,
                leavesTheme,
                snowTheme,
                eventFont,
                registerBtnColor: mainEventState.registerBtnColor,
                registerBtnText: mainEventState.registerBtnText,
                registerMessage: mainEventState.registerMessage,
                // speakerProfilesData: mainEventState.speakerProfilesData,
                participationMessage: mainEventState.participationMessage,
                venue: mainEventState.venue,
                hashtags: mainEventState.hashtags.join(","),
                boothNumber: mainEventState.boothNumber,
                speaker: [],
                exhibitor:[]
            }
            const eventData = {
                format: mainEventState.eventFormat,
                start_time: mainEventState.startTime,
                end_time: mainEventState.endTime,
                end_date: mainEventState.endDate,
                start_date: mainEventState.startDate,
                description: mainEventState.description,
                location_city: mainEventState.cityName,
                virtualLink: mainEventState.virtualLink,
                location_country: mainEventState.countryName,
                gmt_time: mainEventState.timeZone,
                latitude: mainEventState.latitude,
                longitude: mainEventState.longitude,
                participationType: mainEventState.participationType,
                event_type: mainEventState.event_type,
                customizationData: JSON.stringify(eventCustomizationData),
            };
            const formData = new FormData()
            formData.append("name", mainEventState.eventName)
            formData.append("data", JSON.stringify(eventData))
            formData.append("type", "MAIN")
            formData.append("capacity", mainEventState?.capacity + "")
            formData.append("approval", mainEventState?.approval + "")
            formData.append("waitlisting", mainEventState?.waitlisting + "")
            

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
                if (!subEventState.isEventNameEmpty && !subEventState.isEventFormatEmpty && !subEventState.isEventDescriptionEmpty && !subEventState.isEventParticipationEmpty && !subEventState.event_type&& !subEventState.isParticipationMessageEmpty && (subEventState.banner.placeHolder !== Placeholder || subEventState.banner.file)) {
                    addSubEvent(data.data.id)
                } else {
                    setIsAddEventModalOpen(false)
                    showToast("success", "Main Event Added Successfully")
                    if (fetchEvents) {
                        // fetchEvents(0, "update")
                        window.location.reload();
                    }
                    if (mainEventState.speaker.length > 0) {
                        mainEventState.speaker.map((speaker: any) => {
                            addSpeakers(data.data.id, speaker)
                        })
                    }

                    if (mainEventState.exhibitor.length > 0) {
                        mainEventState.exhibitor.map((exhibitor: any) => {
                            addExhibitorDetails(data.data.id, exhibitor)
                        })
                    }

                    if (setChoiceFormModal) {
                        setChoiceFormModal(false)
                    }
                    if (setEventFlow) {
                        setEventFlow("")
                    }
                }
            }
            if (error) {
                console.log(error)
            }
        } else {
            addSubEvent()
        }

    }

    const addSpeakers = async (eventId: string, speaker: any) => {
        console.log("speaker_called",speaker, eventId)
        const formData = new FormData()
        const speakerObject = {
            name: speaker.data.name,
            linkedIn: speaker.data.linkedIn,
            designation: speaker.data.designation
        }
        formData.append("eventId", eventId)
        formData.append("data", JSON.stringify(speakerObject))
        formData.append("file", speaker.imageUrl || "")
        const { data, error } = await myFetch(`${baseUrl}/event/speaker`, {
            method: 'POST',
            body: formData
        })
        if (error) {
            console.log("error : ", error)
        }
    }

    const addExhibitorDetails = async (eventId: string, exhibitor: any) => {
        console.log("exhibitor_called",exhibitor, eventId)
        const formData = new FormData()
        const exhibitorObject = {
            companyName: exhibitor.data.companyName,
            boothNumber: exhibitor.data.boothNumber,
           
        }
        formData.append("eventId", eventId)
        formData.append("data", JSON.stringify(exhibitorObject))
        formData.append("file", exhibitor.imageUrl || "")
        formData.append("isExhibitor", 'true')
        const { data, error } = await myFetch(`${baseUrl}/event/speaker`, {
            method: 'POST',
            body: formData
        })
        if (error) {
            console.log("error : ", error)
        }
    }

    const addSubEvent = async (eventId?: string) => {
        if (!subEventState.eventName || subEventState.eventName === "") {
            handleSubeventChange('isEventNameEmpty', true)
            // setIsEventNameEmpty(true)
        } else {
            handleSubeventChange('isEventNameEmpty', false)
            // setIsEventNameEmpty(false)
        }
        if (!subEventState.query) {
            handleSubeventChange('isEventFormatEmpty', true)
            // setIsEventFormatEmpty(true)
        } else {
            handleSubeventChange('isEventFormatEmpty', false)
            // setIsEventFormatEmpty(false)
        }
        if (!subEventState.description) {
            handleSubeventChange('isEventDescriptionEmpty', true)
            // setIsEventDescriptionEmpty(true)
        } else {
            handleSubeventChange('isEventDescriptionEmpty', false)
            // setIsEventDescriptionEmpty(false)
        }
        if (!subEventState.participationType) {
            handleSubeventChange('isEventParticipationEmpty', true)
            // setIsEventParticipationEmpty(true)
        } else {
            handleSubeventChange('isEventParticipationEmpty', false)
            // setIsEventParticipationEmpty(false)
        }
        // if (!subEventState.participationMessage) {
        //     handleSubeventChange('isParticipationMessageEmpty', true)
        //     // setIsParticipationMessageEmpty(true)
        // }
        if (!subEventState.textValue) {
            handleSubeventChange('isTextValueMessageEmpty', true)
            // setIsTextValueMessageEmpty(true)
        }

        if (!subEventState.eventName.trim() || !subEventState.eventFormat || !subEventState.startTime || !subEventState.endTime || !subEventState.startDate || !subEventState.endDate || !subEventState.description.trim() || !subEventState.cityName || !subEventState.countryName || !subEventState.timeZone || !subEventState.latitude || !subEventState.longitude || !subEventState.participationType
            // !subEventState.participationMessage
        ) {

            showToast("error", "Please fill in all the fields");
            return; // Exit the function if any field is missing
        }

        if (subEventState.banner.placeHolder === Placeholder && !subEventState.banner.file) {
            showToast("error", "Please upload or generate a Poster");
            return; // Exit the function if any field is missing
        }
        const eventCustomizationData = {
            pageBgColor,
            pageGradient,
            confettiType,
            leavesTheme,
            snowTheme,
            eventFont,
            registerBtnColor: subEventState.registerBtnColor,
            registerBtnText: subEventState.registerBtnText,
            registerMessage: subEventState.registerMessage,
            // speakerProfilesData: subEventState.speakerProfilesData,
            // participationMessage: subEventState.participationMessage,
            venue: subEventState.venue,
            hashtags: subEventState.hashtags.join(","),
            boothNumber: subEventState.boothNumber,
        }
        const parentData = subEventState.parentData || "";
        const [parenteventName, parenteventId] = parentData.split(",");
        const eventData = {
            format: subEventState.eventFormat,
            start_time: subEventState.startTime,
            end_time: subEventState.endTime,
            end_date: subEventState.endDate,
            start_date: subEventState.startDate,
            description: subEventState.description,
            location_city: subEventState.cityName,
            location_country: subEventState.countryName,
            gmt_time: subEventState.timeZone,
            latitude: subEventState.latitude,
            longitude: subEventState.longitude,
            participationType: subEventState.participationType,
            event_type: "Tradeshow",
            customizationData: JSON.stringify(eventCustomizationData),
            parentData: parenteventName ? parenteventName : "",
        };
        const formData = new FormData()
        formData.append("name", subEventState.eventName)
        formData.append("data", JSON.stringify(eventData))
        formData.append("type", "SUB")
        if (eventId) {
            formData.append('eventId', eventId)
        }
        if (parenteventId) {
            formData.append('eventId', parenteventId)
        }
        formData.append("capacity", subEventState?.capacity + "")
        formData.append("registration", subEventState?.registration + "")
        formData.append("approval", subEventState?.approval + "")
        formData.append("waitlisting", subEventState?.waitlisting + "")

        if (subEventState.banner.file || subEventState.banner.placeHolder.includes("oaidalleapiprodscus")) {
            if (subEventState.banner.file) {
                formData.append("file", subEventState.banner.file); // Use the file field if uploaded by the user
            } else {
                formData.append("logoUrl", subEventState.banner.placeHolder); // Use logoUrl if the banner is AI-generated
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
            console.log("subevent added :", data)
            setIsAddEventModalOpen(false)
            showToast("success", "Subevent Added Successfully")
            if (fetchEvents) {
                // fetchEvents(0, "update")
                window.location.reload();
                if (setChoiceFormModal) {
                    setChoiceFormModal(false)
                }
            }
            if (setEventFlow) {
                setEventFlow("")
            }

        }
        if (error) {
            console.log(error)
        }
    }

    // This function can be called from 2 perspectives. Updating a Main or Updating a main event whose type is sub. So in that case the formState will change to SubEventState
    const handleSaveEvent = async (eventId: string) => {
        // Use the eventFlow variable to decide which state to use
        const eventState = eventFlow === "main" ? mainEventState : subEventState;

        // Perform the necessary validation checks with the selected state
        if (!eventState.eventName || eventState.eventName === "") {
            handleMaineventChanges('isEventNameEmpty', true);
        } else {
            handleMaineventChanges('isEventNameEmpty', false);
        }

        if ((!eventState.query && !eventState.latitude) || !eventState.longitude) {
            handleMaineventChanges('isEventFormatEmpty', true);
        } else {
            handleMaineventChanges('isEventFormatEmpty', false);
        }

        if (!eventState.description) {
            handleMaineventChanges('isEventDescriptionEmpty', true);
        } else {
            handleMaineventChanges('isEventDescriptionEmpty', false);
        }

        if (!eventState.participationType) {
            handleMaineventChanges('isEventParticipationEmpty', true);
        } else {
            handleMaineventChanges('isEventParticipationEmpty', false);
        }
        if (!eventState.textValue.trim()) {
            handleMaineventChanges('isTextValueMessageEmpty', true);
        }

        if (
            !eventState.eventName.trim() ||
            !eventState.eventFormat ||
            !eventState.startTime ||
            !eventState.endTime ||
            !eventState.startDate ||
            !eventState.endDate ||
            !eventState.description.trim() ||
            !eventState.participationType ||
            !eventState.participationMessage ||
            // Check location fields only for "In-person" or "Hybrid" events
            ((eventState.eventFormat === "In-person" || eventState.eventFormat === "Hybrid" || eventState.eventFormat === "OFFLINE") &&
                (!eventState.cityName || !eventState.countryName || !eventState.timeZone || !eventState.latitude || !eventState.longitude))
        ) {
            showToast("error", "Please fill in all the required fields");
            return; // Exit the function if any field is missing
        }
        // Check if banner exists, if not, show error for missing poster
        if (!prefilledEvent?.logoUrl) {
            if (!eventState.banner.placeHolder && !eventState.banner.file) {
                showToast("error", "Please upload or generate a Poster");
                return; // Exit the function if banner is missing
            }
        }

        // Prepare the event customization data
        const eventCustomizationData = {
            pageBgColor,
            pageGradient,
            confettiType,
            leavesTheme,
            snowTheme,
            eventFont,
            registerBtnColor: eventState.registerBtnColor,
            registerBtnText: eventState.registerBtnText,
            registerMessage: eventState.registerMessage,
            // speakerProfilesData: eventState.speakerProfilesData,
            participationMessage: eventState.participationMessage,
            venue: eventState.venue,
            hashtags: eventState.hashtags.join(","),
            boothNumber: eventState.boothNumber,
            speaker: eventState.speaker,
            exhibitor:eventState.exhibitor
        };

        // Prepare the event data
        const eventData = {
            id: eventId,
            format: eventState.eventFormat,
            start_time: eventState.startTime,
            end_time: eventState.endTime,
            end_date: eventState.endDate,
            start_date: eventState.startDate,
            description: eventState.description,
            logoUrl: eventState.banner.placeHolder,
            location_city: eventState.cityName,
            location_country: eventState.countryName,
            participationType: eventState.participationType,
            gmt_time: eventState.timeZone,
            latitude: eventState.latitude,
            longitude: eventState.longitude,
            event_type: eventState.event_type,
            customizationData: JSON.stringify(eventCustomizationData),
            parentData: eventState.parentData,
        };

        // Prepare formData for the request
        const formData = new FormData();
        formData.append("id", eventId);
        formData.append("name", eventState.eventName);
        formData.append("data", JSON.stringify(eventData));
        formData.append("sourceId", widgetId);
        formData.append("maxCapacity", eventState?.capacity + "")

        // Check if the banner has been updated
        if (eventState.banner.placeHolder.includes("eventgeni") === false) {
            if (eventState.banner.file) {
                // formData.append("file", eventState.banner.file); // Use the file field if uploaded by the user
            } else {
                formData.append("logoUrl", eventState.banner.placeHolder); // Use logoUrl if the banner is AI-generated
            }
        }

        // Make the PATCH request
        const { data, error } = await myFetch(`${baseUrl}/event`, {
            method: 'PATCH',
            body: formData,
        });

        // Handle the response
        if (data) {
            setIsAddEventModalOpen(false);
            showToast("success", "Event Updated Successfully");
            if (fetchEvents) {
                // fetchEvents(0, "update")
                window.location.reload();
            }
            if (fetchEventData) {
                fetchEventData()
            }
        }

        if (error) {
            console.log(error);
        }
    };

    const handleModalClose = () => {
        if (setPrefilledEvent && setPrefilledSubEvent && setPrefilledGlobalEvent) {
            setPrefilledEvent(null)
            setPrefilledSubEvent(null)
            setPrefilledGlobalEvent(null)
        }
        setIsAddEventModalOpen(false)
        if (setEventFlow) {
            setEventFlow("")
        }
    }
    useEffect(() => {
        if (mainEventState.speakerModal ||mainEventState.exhibitorModal|| mainEventState.descriptionModal || mainEventState.registerModal || subEventState.speakerModal || subEventState.descriptionModal || subEventState.registerModal) {
            setIsModalOpen(true)
        } else {
            setIsModalOpen(false)
        }
    }, [mainEventState.speakerModal,mainEventState.exhibitorModal, mainEventState.descriptionModal, mainEventState.registerModal, subEventState.speakerModal, subEventState.descriptionModal, subEventState.registerModal,])
    const formContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isModalOpen && formContainerRef.current) {
            formContainerRef.current.scrollTop = 0;
        }
    }, [isModalOpen]);

    // useEffect(() => {
    //     console.log("main event name :", mainEventName)
    // }, [mainEventName])

    const handleCollapseForm = (type: string) => {
        if (type === "side") { // This is when we click on sideevent button or Yes button
            if (mainEventState.eventName && mainEventState.description && mainEventState.participationType && mainEventState.participationMessage && mainEventState.cityName && (mainEventState.banner.placeHolder !== Placeholder || mainEventState.banner.file)) {
                setCollapseMainEventForm(true)
                setActiveBtn("side")
            }
            else {
                showToast("error", "Fill all the fields in this form to proceed")
                if (!mainEventState.eventName || mainEventState.eventName === "") {
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
                if (!mainEventState.description) {
                    handleMaineventChanges('isEventDescriptionEmpty', true)
                    // setIsEventDescriptionEmpty(true)
                } else {
                    handleMaineventChanges('isEventDescriptionEmpty', false)
                    // setIsEventDescriptionEmpty(false)
                }
                if (!mainEventState.participationType) {
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
                if (!mainEventState.event_type) {
                    handleMaineventChanges('isEventTypeEmpty', true)
                    // setIsParticipationMessageEmpty(true)
                }
                
                if (!mainEventState.textValue.trim()) {
                    handleMaineventChanges('isTextValueMessageEmpty', true)
                    // setIsTextValueMessageEmpty(true)
                }
            }
        } else {
            setCollapseMainEventForm(false)
            setActiveBtn("main")
        }
    }

    return (
        <div className={styles.body}>
            <div className={`${styles.btnContainer} ${eventFlow === "side" ? styles.endBtnContainer : ""}`} style={{ backgroundColor: theme === "dark" ? "#131313" : "#FAFAFA" }}>
                {eventFlow === "main" && <div className={styles.eventBtns}>
                    <button className={activeBtn === "main" ? styles.activebtn : ""} onClick={() => handleCollapseForm("main")}>Main Event</button>
                    <button className={activeBtn === "side" ? styles.activebtn : ""} onClick={() => handleCollapseForm("side")}>Side Event</button>
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
            <div className={`${styles.formContainer} ${isModalOpen ? styles.modalOpen : ""} ${pageGradient ? styles[pageGradient] : ""}`}
            style={{ backgroundColor: pageBgColor}} 
            ref={formContainerRef}>
                <canvas ref={confettiCanvasRef} className={styles.confettiCanvas}></canvas>
                {leavesTheme && <div className={styles.themeContainer}>
                    <LeafTheme leafCount={100}/>
                </div>}
                {snowTheme && <div className={styles.themeContainer}>
                    <SnowfallTheme/>
                </div>}
                {uploadedPhoto && <div className={styles.themeContainer}>
                    <RandomTheme uploadedPhoto={uploadedPhoto}/>
                </div>}
                
                {collapseMainEventForm && eventFlow === 'main' ?
                    (<div className={styles.collapsedContainer}>
                        <div>
                            <DescIcon />
                            <span>Main Event</span>
                        </div>
                        <div className={styles.collapseBtn} onClick={() => handleCollapseForm("main")}><DownArrow /></div>
                    </div>) : (eventFlow === 'main' &&
                        <Details
                            formTheme={formTheme}
                            handleCollapseForm={handleCollapseForm}
                            formState={mainEventState}
                            handleChange={handleMaineventChanges}
                            eventFont={eventFont}
                            setLoadingState={setLoadingState}
                            fileInputRef={fileInputRef}
                            prefilledEvent={prefilledEvent}
                            setCollapseMainEventForm={setCollapseMainEventForm}
                            collapseMainEventForm={collapseMainEventForm}
                            isApproved={isApproved} setIsApproved={setIsApproved}
                        />
                        )}
                {(collapseMainEventForm || eventFlow === "side") && 
                <Subeventform
                    // setMainEventName={setMainEventName}
                    formTheme={formTheme}
                    formState={subEventState}
                    handleChange={handleSubeventChange}
                    eventFont={eventFont}
                    setLoadingState={setLoadingState}
                    fileInputRef={fileInputRef}
                    prefilledSubEvent={prefilledSubEvent}
                    prefilledEvent={prefilledEvent}
                    eventFlow={eventFlow}
                    isApproved={isApproved} setIsApproved={setIsApproved}
                />
                }
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