import React, { useEffect, useState } from 'react'
import styles from './preview.style.module.css'
import StickyPreview from '@/app/components/TemplateViews/previews/sticky/StickyPreview'
import HeroBanner from '../../TemplateViews/previews/section/Herobanner/HeroBanner';
import GridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/GridView'
import ListView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListView'
import HeroBannerAndViews from '@/app/components/TemplateViews/previews/page/SinglePromotedAndEvents/HeroBannerAndViews'
import CaraouselAndViews from '@/app/components/TemplateViews/previews/page/MultipleHighlightedEvents/CaraouselAndViews'
import PortraitPopup from '../../TemplateViews/previews/popup/portraitstyles/PortraitPopup';
import LandscapePopup from '../../TemplateViews/previews/popup/landscapesstyles/LandscapePopup';
import ScrollView from '@/app/components/TemplateViews/previews/section/ScrollView'
import CaraouselView from '@/app/components/TemplateViews/previews/page/CarouselView/CaraouselView';
import { StaticImageData } from 'next/image';
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { useRouter } from 'next/navigation';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import { AddedEventsType } from '@/types/addedeventtype'
import { ButtonSettingsState } from '@/types/buttoncustomizetypes';
import Demobanner from '/public/demobanner.png'
import { useEventServices } from '@/services/geniservices/eventService';
import { useWidgetServices } from '@/services/geniservices/widgetService';
import { useBrandKitServices } from '@/services/geniservices/brandkitService';
interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
}

interface PreviewProps {
    selectedTemplate?: string;
    selectedCard?: string;
    setSelectedCard?: (value: string) => void
    setIsFullScreen: (value: boolean) => void
    isFullScreen: boolean
    widgetSelected?: string;
    // templateName?: string;
    selectedImage?: StaticImageData
    cardBgColor?: string;
    previewWindowBgColor?:string;
    isDark?:boolean;
    setIsDark?:(value: boolean) => void;
    cardBorderRadius?: number;
    fontSettings?: {
        heading: FontSettings;
        subheading: FontSettings;
        body: FontSettings;
    };
    buttonSettings?: ButtonSettingsState
    closeButtonSetting?:ButtonSettingsState
    selectedBtn?: "primary" | "secondary"
    draftWidget?: boolean;
    draftWidgets?: DraftWidgetsType[]
    fetchDraftWidgets?: () => Promise<void>;
    fetchedAddedEvents?: AddedEventsType[];
    widgetId?: string;
    smallCard: boolean;
    setIsDraftSaved?: (value: boolean) => void
}
interface DraftWidgetsType {
    widgetType: string;
    templateId: string;
    widgetId: string;
    status: string;
    widgetStatus: string;
}

const demoBanner: string = Demobanner as unknown as string;
const demoEventName: string = "Demo Event"
const demoDescription: string = "This is a demo event created to showcase the functionalities of our event widgets. Please note, this is a placeholder description and does not represent a real event. Feel free to replace this with your event details to see how the widgets will appear with live data."
const demoLocation: string = "Corpus Christi, USA"
const demoDate = "29 Jan - 5 Feb"

const PreviewWindow = ({ selectedTemplate, selectedCard, setIsFullScreen, isFullScreen, setSelectedCard, widgetSelected, draftWidget, fetchDraftWidgets,
    cardBgColor = "#ffffff", cardBorderRadius = 20,
    previewWindowBgColor = "#ffffff",
    isDark,
    setIsDark,
    fontSettings = {
        heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bold" },
        subheading: { fontFamily: "arial", fontSize: 14, fontColor: "#000000", fontWeight: "normal" },
        body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "normal" }
    },
    buttonSettings = {
        primary: { buttonColor: "#6750a4", fontColor: "#ffffff", borderRadius: 4, borderColor: "#6750a4", buttonText: "Meet Us" },
        secondary: { fontColor: "#000000", borderRadius: 4, borderColor: "#6750a4", buttonText: "Meet Us" }
    },
    closeButtonSetting = {
        primary: { buttonColor: "#8F8F8F1F", fontColor: "#171717", borderRadius: 4, borderColor: "#6750a4", buttonText: "Close" },
        secondary: { fontColor: "#000000", borderRadius: 4, borderColor: "#6750a4", buttonText: "Close" }
    },
   
    selectedBtn = "primary", fetchedAddedEvents, widgetId, smallCard, setIsDraftSaved }: PreviewProps) => {

    const [fetchedAddedOtherData, setFetchedAddedOtherData] = useState<PrefilledAddedEventsType[]>([])
    const [storedDomain, setStoredDomain] = useState<string>("")
    const router = useRouter();
    const getAsciiString = (str: string): string => {
        return str.split('').map(char => char.charCodeAt(0).toString()).join('');
    };
    const {getEventById, error} = useEventServices();
    const {updateWidgetData} = useWidgetServices();
    const {getBrandkit} = useBrandKitServices();
    useEffect(() => {
        const fetchDomain = async () => {
            // const { data, error } = await myFetch(`${baseUrl}/kit`)
            const data:any = await getBrandkit();
            setStoredDomain(data.domain.domain)
        }
        fetchDomain()
    }, [])

    useEffect(() => {
        const handleOtherDataFetch = async () => {
            if (!fetchedAddedEvents) {
                return
            }
            try {
                const newFetchedAddedOtherData = await Promise.all(
                    fetchedAddedEvents.map(async (event) => {
                        // const { data, error } = await myFetch(`${baseUrl}/event/${event.id}?source=eventgtm`);
                        const data:any = await getEventById(event.id)
                        if (error) {
                            console.error(`Error fetching event data for event ID ${event.id}:`, error);
                            return null;
                        }

                        const eventData = data?.data;
                        // console.log("fetcched event data : ", eventData)
                        if (!eventData) return null;

                        return {
                            id: event.id,
                            name: data.name,
                            pageBgColor: eventData.customizationData.pageBgColor,
                            description: eventData.description,
                            eventFont: eventData.customizationData.eventFont,
                            startDate: eventData.start_date,
                            endDate: eventData.end_date,
                            startTime: eventData.start_time,
                            endTime: eventData.end_time,
                            timeZone: eventData.gmt_time,
                            cityName: eventData.location_city,
                            countryName: eventData.location_country,
                            participationType: eventData.participationType,
                            eventFormat: eventData.format,
                            registerBtnColor: eventData.customizationData.registerBtnColor,
                            registerBtnText: eventData.customizationData.registerBtnText,
                            registerMessage: eventData.customizationData.registerMessage,
                            boothNumber: eventData.customizationData.boothNumber,
                            speakerProfilesData: eventData.customizationData.speakerProfilesData,
                            participationMessage: eventData.customizationData.participationMessage,
                            bannerUrl: eventData.logoUrl,
                            latitude: event.latitude,
                            longitude: event.longitude,
                            venue: eventData.customizationData.venue,
                            hashtags: eventData.customizationData.hashtags,
                            promoted: event.promoted,
                            eventType : data.type,
                            event_type:eventData.event_type
                        } as PrefilledAddedEventsType;
                    })
                );

                setFetchedAddedOtherData(newFetchedAddedOtherData.filter((event): event is PrefilledAddedEventsType => event !== null));
            } catch (err) {
                console.error("Error in handleOtherDataFetch:", err);
            }
        };

        handleOtherDataFetch();
    }, [fetchedAddedEvents]);

    const handleDraftWidgets = async (navigate: boolean) => {
        if (!selectedTemplate || !widgetSelected || !fontSettings || !buttonSettings || !selectedCard || !closeButtonSetting ) {
            console.error('Missing required data');
            return;
        }
        const templatePublicId = getAsciiString(selectedTemplate);
        const customizeData = new FormData();

        customizeData.append('templatePublicId', templatePublicId);
        let tempSelectedWidget = widgetSelected;
        if (widgetSelected === "Sticky") {
            tempSelectedWidget = "StickyTop";
        }
        const otherdata = {
            event: []
        }
        customizeData.append('type', tempSelectedWidget);
        customizeData.append('status', 'draft');
        customizeData.append('domain', storedDomain); // replace with actual domain
        customizeData.append('otherdata', JSON.stringify(otherdata))
        const customizationData = {
            fontSettings,
            buttonSettings,
            cardBgColor,
            cardBorderRadius,
            selectedBtn,
            selectedCard,
            previewWindowBgColor,
            isDark
            // closeButtonSetting,
        };
        customizeData.append('customizationData', JSON.stringify(customizationData));
        // const { data, error } = await myFetch(
        //     `${baseUrl}/widget`,
        //     {
        //         method: 'POST',
        //         body: customizeData,
        //     }
        // );
        const data:any = await updateWidgetData(customizeData);
        if (data) {
            console.log(data);
            if (fetchDraftWidgets && setIsDraftSaved) {
                fetchDraftWidgets();
                setIsDraftSaved(true)
            }
            if (navigate && data.id) {
                router.push(`/widget/edit/${data.id}`);
            }
        } else {
            console.log(error);
        }
    };
    return (
        <div className={styles.body} 
        // style={{backgroundColor:previewWindowBgColor}}
        >
            <div className={styles.heading_btnContainer}>
                {(selectedTemplate === "LS" || selectedTemplate === "GS" || selectedTemplate === "HBL" || selectedTemplate === "HBG" || selectedTemplate === "CVL" || selectedTemplate === "CVG" || selectedTemplate === "HS" || selectedTemplate === "LSR" || selectedTemplate === "RSR" || selectedTemplate === "CV" || selectedTemplate === "HB" || selectedTemplate === "PUVP" || selectedTemplate === "PUVL") && setSelectedCard && (
                    <div className={styles.styleBtns}>
                        <button
                            className={`${styles.styleBtn} ${selectedCard === "style1" ? styles.activeBtn : ""}`}
                            onClick={() => setSelectedCard("style1")}
                        >
                            Style 1
                        </button>
                        <button
                            className={`${styles.styleBtn} ${selectedCard === "style2" ? styles.activeBtn : ""} `}
                            onClick={() => setSelectedCard("style2")}
                        >
                            Style 2
                        </button>
                        <button
                            className={`${styles.styleBtn} ${selectedCard === "style3" ? styles.activeBtn : ""} `}
                            onClick={() => setSelectedCard("style3")}
                        >
                            Style 3
                        </button>
                    </div>
                )}

                <div className={styles.viewBtnContainer} style={{ position: "absolute", right: 10, top: selectedCard ? 10 : 0,
                    //   backgroundColor: "rgba(0, 0, 0, 0.2)", 
                    //   borderRadius: "50%", 
                    //   cursor: "pointer", 
                    //   zIndex:"20"
                 }}>
                    {/* <div><MobileIcon color={theme === "dark" ? "white" : "black"} /></div>
                    <div><DesktopIcon color={theme === "dark" ? "white" : "black"} /></div> */}
                    <div onClick={() => setIsFullScreen(!isFullScreen)}>
                        {isFullScreen ? <CloseFullScreenIcon/> : <FullScreenIcon/>}
                    </div>
                </div>
            </div>
            <div className={`${styles.preview_btnContainer} ${(!draftWidget || isFullScreen) ? styles.bigpreview_btnContainer : ""}`}>
                <div className={`${styles.preview} ${(!draftWidget || isFullScreen) ? styles.bigPreview : ""}`} >
                    {selectedTemplate === "ST" ? <StickyPreview type="top" demoDate={demoDate} fetchedAddedOtherData={fetchedAddedOtherData} smallCard={smallCard} selectedBtn={selectedBtn} buttonSettings={buttonSettings} selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} widgetId={widgetId} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                        selectedTemplate === "SB" ? <StickyPreview type="down" demoDate={demoDate} fetchedAddedOtherData={fetchedAddedOtherData} smallCard={smallCard} selectedBtn={selectedBtn} buttonSettings={buttonSettings} selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} widgetId={widgetId} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                            selectedTemplate === "HB" ? <HeroBanner fetchedAddedOtherData={fetchedAddedOtherData} selectedBtn={selectedBtn} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} buttonSettings={buttonSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                selectedTemplate === "GS" ? <GridView demoDate={demoDate} widgetId={widgetId} fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoLocation={demoLocation} /> :
                                    selectedTemplate === "LS" ? <ListView 
                                    smallCard={smallCard}
                                    isFullScreen={isFullScreen}  demoDate={demoDate} widgetId={widgetId} fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                        selectedTemplate === "HBL" ? <HeroBannerAndViews
                                        smallCard={smallCard}
                                         isFullScreen={isFullScreen} demoDate={demoDate} type='list' selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                            selectedTemplate === "HBG" ? <HeroBannerAndViews smallCard={smallCard} isFullScreen={isFullScreen} demoDate={demoDate} type='grid' selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                selectedTemplate === "CVL" ? <CaraouselAndViews demoDate={demoDate} type='list'
                                                smallCard={smallCard}
                                                    fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} widgetId={widgetId} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                    selectedTemplate === "CVG" ? <CaraouselAndViews 
                                                    smallCard={smallCard} demoDate={demoDate} type='grid' fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} widgetId={widgetId} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                        selectedTemplate === "CV" ? <CaraouselView  demoDate={demoDate} widgetId={widgetId} fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                            selectedTemplate === "HS" ? <ScrollView widgetId={widgetId} demoDate={demoDate} fetchedAddedOtherData={fetchedAddedOtherData} type='top' selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                                selectedTemplate === "LSR" ? <ScrollView widgetId={widgetId} demoDate={demoDate} fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} type='left' cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                                    selectedTemplate === "RSR" ? <ScrollView widgetId={widgetId} demoDate={demoDate} fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} type='right' cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                                        selectedTemplate === "PUVP" ? <PortraitPopup
                                                                        widgetId={widgetId}
                                                                            smallCard={smallCard}
                                                                            fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} buttonSettings={buttonSettings} closeButtonSetting={closeButtonSetting} selectedBtn={selectedBtn} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} demoDate={demoDate}/> : 
                                                                            selectedTemplate === "PUVL" ? <LandscapePopup
                                                                            widgetId={widgetId}
                                                                                smallCard={smallCard} fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} buttonSettings={buttonSettings} closeButtonSetting={closeButtonSetting} selectedBtn={selectedBtn} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} demoDate={demoDate}/> : <></>}
                </div>
                {(draftWidget && !isFullScreen) && <div className={styles.previewButtons}>
                    <button onClick={() => handleDraftWidgets(false)} className={styles.previewBtn}>Save to Draft widgets</button>
                    <button onClick={() => handleDraftWidgets(true)} className={styles.previewBtn}> Continue with this template</button>
                </div>}
            </div>
        </div>
    )
}

export default PreviewWindow

function MobileIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 6H13.5M16.286 3H7.714C6.768 3 6 3.806 6 4.8V19.2C6 20.194 6.768 21 7.714 21H16.286C17.233 21 18 20.194 18 19.2V4.8C18 3.806 17.233 3 16.286 3Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}
function DesktopIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 20H12M12 20H15M12 20V17M12 17H19C19.5304 17 20.0391 16.7893 20.4142 16.4142C20.7893 16.0391 21 15.5304 21 15V6C21 5.46957 20.7893 4.96086 20.4142 4.58579C20.0391 4.21071 19.5304 4 19 4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6V15C3 15.5304 3.21071 16.0391 3.58579 16.4142C3.96086 16.7893 4.46957 17 5 17H12Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}
function FullScreenIcon() {
    // return (
    //     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z" /></svg>
    // )
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="23" height="23" rx="5.5" fill="#EBEBEB"/>
        <rect x="0.5" y="0.5" width="23" height="23" rx="5.5" stroke="#C9C9C9"/>
        <path d="M13.625 11.224C13.5123 11.3367 13.3595 11.4 13.2002 11.4C13.0408 11.4 12.888 11.3367 12.7754 11.224C12.6627 11.1113 12.5994 10.9585 12.5994 10.7992C12.5994 10.6399 12.6627 10.4871 12.7754 10.3744L17.5754 5.5744C17.6312 5.51861 17.6974 5.47436 17.7703 5.44417C17.8432 5.41398 17.9213 5.39844 18.0002 5.39844C18.0791 5.39844 18.1572 5.41398 18.2301 5.44417C18.303 5.47436 18.3692 5.51861 18.425 5.5744C18.4808 5.63018 18.525 5.69641 18.5552 5.7693C18.5854 5.84218 18.6009 5.9203 18.6009 5.9992C18.6009 6.07809 18.5854 6.15621 18.5552 6.2291C18.525 6.30198 18.4808 6.36821 18.425 6.424L13.625 11.224ZM6.42497 18.424C6.36919 18.4798 6.30296 18.524 6.23007 18.5542C6.15719 18.5844 6.07906 18.6 6.00017 18.6C5.92128 18.6 5.84316 18.5844 5.77027 18.5542C5.69738 18.524 5.63116 18.4798 5.57537 18.424C5.51959 18.3682 5.47533 18.302 5.44514 18.2291C5.41495 18.1562 5.39941 18.0781 5.39941 17.9992C5.39941 17.9203 5.41495 17.8422 5.44514 17.7693C5.47533 17.6964 5.51959 17.6302 5.57537 17.5744L10.3754 12.7744C10.488 12.6617 10.6408 12.5984 10.8002 12.5984C10.9595 12.5984 11.1123 12.6617 11.225 12.7744C11.3376 12.8871 11.4009 13.0399 11.4009 13.1992C11.4009 13.3585 11.3376 13.5113 11.225 13.624L6.42497 18.424Z" fill="black"/>
        <path d="M6.00039 18.5984C5.84126 18.5984 5.68865 18.5352 5.57613 18.4227C5.4636 18.3102 5.40039 18.1576 5.40039 17.9984C5.40039 17.8393 5.4636 17.6867 5.57613 17.5742C5.68865 17.4617 5.84126 17.3984 6.00039 17.3984H10.8004C10.9595 17.3984 11.1121 17.4617 11.2247 17.5742C11.3372 17.6867 11.4004 17.8393 11.4004 17.9984C11.4004 18.1576 11.3372 18.3102 11.2247 18.4227C11.1121 18.5352 10.9595 18.5984 10.8004 18.5984H6.00039Z" fill="black"/>
        <path d="M6.59941 17.9984C6.59941 18.1576 6.5362 18.3102 6.42368 18.4227C6.31116 18.5352 6.15854 18.5984 5.99941 18.5984C5.84028 18.5984 5.68767 18.5352 5.57515 18.4227C5.46263 18.3102 5.39941 18.1576 5.39941 17.9984V13.1984C5.39941 13.0393 5.46263 12.8867 5.57515 12.7742C5.68767 12.6617 5.84028 12.5984 5.99941 12.5984C6.15854 12.5984 6.31116 12.6617 6.42368 12.7742C6.5362 12.8867 6.59941 13.0393 6.59941 13.1984V17.9984ZM18.5994 10.7984C18.5994 10.9576 18.5362 11.1102 18.4237 11.2227C18.3112 11.3352 18.1585 11.3984 17.9994 11.3984C17.8403 11.3984 17.6877 11.3352 17.5751 11.2227C17.4626 11.1102 17.3994 10.9576 17.3994 10.7984V5.99844C17.3994 5.83931 17.4626 5.6867 17.5751 5.57417C17.6877 5.46165 17.8403 5.39844 17.9994 5.39844C18.1585 5.39844 18.3112 5.46165 18.4237 5.57417C18.5362 5.6867 18.5994 5.83931 18.5994 5.99844V10.7984Z" fill="black"/>
        <path d="M13.1996 6.59844C13.0405 6.59844 12.8879 6.53522 12.7753 6.4227C12.6628 6.31018 12.5996 6.15757 12.5996 5.99844C12.5996 5.83931 12.6628 5.6867 12.7753 5.57417C12.8879 5.46165 13.0405 5.39844 13.1996 5.39844H17.9996C18.1587 5.39844 18.3114 5.46165 18.4239 5.57417C18.5364 5.6867 18.5996 5.83931 18.5996 5.99844C18.5996 6.15757 18.5364 6.31018 18.4239 6.4227C18.3114 6.53522 18.1587 6.59844 17.9996 6.59844H13.1996Z" fill="black"/>
        </svg>
    )


    
}

function CloseFullScreenIcon() {
    // return (
    //     <svg data-testid="geist-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16"><path fillRule="evenodd" clipRule="evenodd" d="M6 1V1.75V5C6 5.55229 5.55228 6 5 6H1.75H1V4.5H1.75H4.5V1.75V1H6ZM14.25 6H15V4.5H14.25H11.5V1.75V1H10V1.75V5C10 5.55228 10.4477 6 11 6H14.25ZM10 14.25V15H11.5V14.25V11.5H14.29H15.04V10H14.29H11C10.4477 10 10 10.4477 10 11V14.25ZM1.75 10H1V11.5H1.75H4.5V14.25V15H6V14.25V11C6 10.4477 5.55229 10 5 10H1.75Z" fill="currentColor"></path></svg>
    // )
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="23" height="23" rx="5.5" fill="#EBEBEB"/>
        <rect x="0.5" y="0.5" width="23" height="23" rx="5.5" stroke="#C9C9C9"/>
        <path d="M5 18.5L9.70787 13.7907M9.70787 13.7907H5M9.70787 13.7907L9.76471 18.1029M18.5 5L13.7919 9.70665M13.7919 9.70665H18.5M13.7919 9.70665V5" stroke="black" stroke-width="1.02101" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}



// useEffect(() => {
//     const handleOtherDataFetch = async () => {
//         const newFetchedAddedOtherData: (PrefilledAddedEventsType | null)[] = await Promise.all(
//             fetchedAddedEvents.map(async (event) => {
//                 const { data, error } = await myFetch(${baseUrl}/event?id=${event.id});
//                 if (error) {
//                     console.error(Error fetching event data for event ID ${event.id}:, error);
//                     return null;
//                 }
//                 if (data) {
//                     console.log("data of fetched event : ",)
//                 }
//                 return {
//                     id: event.id,
//                     name: data.data[0].name,
//                     pageBgColor: event.pageBgColor,
//                     description: data.data[0].data.description,
//                     eventFont: event.eventFont,
//                     startDate: data.data[0].data.start_date,
//                     endDate: data.data[0].data.end_date,
//                     startTime: data.data[0].data.start_time,
//                     endTime: data.data[0].data.end_time,
//                     timeZone: data.data[0].data.gmt_time,
//                     cityName: data.data[0].data.location_city,
//                     countryName: data.data[0].data.location_country,
//                     participationType: data.data[0].data.participationType,
//                     eventFormat: data.data[0].data.format,
//                     registerBtnColor: event.registerBtnColor,
//                     registerBtnText: event.registerBtnText,
//                     registerMessage: event.registerMessage,
//                     boothNumber: event.boothNumber,
//                     speakerProfilesData: event.speakerProfilesData,
//                     participationMessage: event.participationMessage,
//                     bannerUrl: event.bannerUrl,
//                     latitude: event.latitude,
//                     longitude: event.longitude,
//                     venue: event.venue,
//                     hashtags : event.hashtags
//                 } as PrefilledAddedEventsType;
//             })
//         );
//         setFetchedAddedOtherData(newFetchedAddedOtherData.filter((event): event is PrefilledAddedEventsType => event !== null));
//     };

//     handleOtherDataFetch();
// }, [fetchedAddedEvents])