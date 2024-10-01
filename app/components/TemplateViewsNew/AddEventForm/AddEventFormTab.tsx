import React, { useRef, useState } from 'react'
import styles from './addeventformtab.style.module.css'
import { AddedEventsType } from '@/types/addedeventtype';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype';
import { AllEventsType } from '@/types/alleventtype';
import { GolbalEventType } from '@/types/globaleventtype';
import Placeholder from '/public/placeholder.png'
import { useTheme } from '@/context'

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
    fetchAddedEvents: () => Promise<void>;
    addedEventIds: string[]
    fetchedAddedEvents: AddedEventsType[]
    prefilledAddedEvent?: PrefilledAddedEventsType
    prefilledNormalEvent?: AllEventsType
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

const AddEventFormTab = ({ setIsAddEventModalOpen, pageBgColor, eventFont, widgetId, fetchEvents, addedEventIds, fetchAddedEvents, fetchedAddedEvents, prefilledAddedEvent, prefilledNormalEvent, prefilledGlobalEvent, eventName, setEventName, cityName, setCityName, participationType, setParticipationType, description, setDescription }: Props) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [descriptionModal, setDescriptionModal] = useState<boolean>(false)
    const [speakerModal, setSpeakerModal] = useState<boolean>(false)
    const [registerModal, setRegisterModal] = useState<boolean>(false)

    const [textValue, setTextValue] = useState<string>(description)

    const [speakerProfilesData, setSpeakerProfilesData] = useState<SpeakerProfileType[]>([])
    const [prefilledProfile, setPrefilledProfile] = useState<SpeakerProfileType | undefined>();
    const [registerMessage, setRegisterMessage] = useState<string>(prefilledAddedEvent?.registerMessage || "Welcome! To join the event, please register below.")
    const [registerBtnText, setRegisterBtnText] = useState<string>(prefilledAddedEvent?.registerBtnText || "Register")
    const [registerBtnColor, setRegisterBtnColor] = useState<string>(prefilledAddedEvent?.registerBtnColor || "#1a1a1a")

    const [countryName, setCountryName] = useState<string>(prefilledAddedEvent?.countryName || prefilledNormalEvent?.countryName || prefilledGlobalEvent?.countryName || "")
    const [timeZone, setTimeZone] = useState<string>(prefilledAddedEvent?.timeZone || "GMT+05:30 Chennai")
    const [timeZoneKey, setTimeZoneKey] = useState<number>(18)
    const [startDate, setStartDate] = useState<string>(prefilledAddedEvent?.startDate || prefilledNormalEvent?.startDate || prefilledGlobalEvent?.startDate || "")
    const [endDate, setEndDate] = useState<string>(prefilledAddedEvent?.endDate || prefilledNormalEvent?.endDate || prefilledGlobalEvent?.endDate || "")
    const [startTime, setStartTime] = useState<string>(prefilledAddedEvent?.startTime || prefilledNormalEvent?.startTime || "12:00 A.M")
    const [endTime, setEndTime] = useState<string>(prefilledAddedEvent?.endTime || prefilledNormalEvent?.endTime || "12:00 A.M")
    const [eventFormat, setEventFormat] = useState<string>(prefilledAddedEvent?.eventFormat || prefilledNormalEvent?.format || prefilledGlobalEvent?.format || "In-person")

    const [boothNumber, setBoothNumber] = useState<string>(prefilledAddedEvent?.boothNumber || "")
    const [participationMessage, setParticipationMessage] = useState<string>(prefilledAddedEvent?.participationMessage || "")
    const [banner, setBanner] = useState<ImageState>({
        placeHolder: prefilledAddedEvent?.bannerUrl || Placeholder,
        file: null
    });
    // const [mapWidth, setMapWidth] = useState(0);
    const [venue, setVenue] = useState(prefilledAddedEvent?.venue || prefilledGlobalEvent?.venue || "")
    const [latitude, setLatitude] = useState(Number(prefilledAddedEvent?.latitude || prefilledNormalEvent?.latitude || prefilledGlobalEvent?.latitude) || 37.7749)
    const [longitude, setLongitude] = useState(Number(prefilledAddedEvent?.longitude || prefilledNormalEvent?.longitude || prefilledGlobalEvent?.longitude) || -122.4194)
    // const mapDivRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [hashtags, setHashtags] = useState<string[]>(prefilledAddedEvent?.hashtags.split(",") || [])
    const eventPromoted = prefilledAddedEvent?.promoted || "false"
    const [isEventNameEmpty, setIsEventNameEmpty] = useState(false);
    const [isEventFormatEmpty, setIsEventFormatEmpty] = useState(false);
    const [isEventDescriptionEmpty, setIsEventDescriptionEmpty] = useState(false);
    const [isEventParticipationEmpty, setIsEventParticipationEmpty] = useState(false);
    const [query, setQuery] = useState("")
    const [isParticipationMessageEmpty, setIsParticipationMessageEmpty] = useState<boolean>(false)
    const [isTextValueMessageEmpty, setIsTextValueMessageEmpty] = useState<boolean>(false)
    const handlePrefill = (profile: SpeakerProfileType) => {
        setPrefilledProfile(profile)
        setSpeakerModal(true)
    }
    const { theme } = useTheme()
    return (
        <div>AddEventFormTab</div>
    )
}

export default AddEventFormTab