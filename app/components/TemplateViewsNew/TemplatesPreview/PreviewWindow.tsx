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


const PreviewWindow = ({ selectedTemplate, selectedCard, setIsFullScreen, isFullScreen, setSelectedCard, widgetSelected, draftWidget, fetchDraftWidgets,
    cardBgColor = "#ffffff", cardBorderRadius = 20,
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

    useEffect(() => {
        const fetchDomain = async () => {
            const { data, error } = await myFetch(`${baseUrl}/kit`)
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
                        const { data, error } = await myFetch(`${baseUrl}/event/${event.id}?source=eventgtm`);
                        if (error) {
                            console.error(`Error fetching event data for event ID ${event.id}:`, error);
                            return null;
                        }

                        const eventData = data?.data;
                        console.log("fetcched event data : ", eventData)
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
                            eventType : data.type
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
            closeButtonSetting,
        };
        customizeData.append('customizationData', JSON.stringify(customizationData));
        const { data, error } = await myFetch(
            `${baseUrl}/widget`,
            {
                method: 'POST',
                body: customizeData,
            }
        );
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
        <div className={styles.body} >
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

                <div className={styles.viewBtnContainer} style={{ position: "absolute", right: 10, top: selectedCard ? 10 : 0 }}>
                    {/* <div><MobileIcon color={theme === "dark" ? "white" : "black"} /></div>
                    <div><DesktopIcon color={theme === "dark" ? "white" : "black"} /></div> */}
                    <div onClick={() => setIsFullScreen(!isFullScreen)}>
                        {isFullScreen ? <CloseFullScreenIcon/> : <FullScreenIcon/>}
                    </div>
                </div>
            </div>
            <div className={`${styles.preview_btnContainer} ${(!draftWidget || isFullScreen) ? styles.bigpreview_btnContainer : ""}`}>
                <div className={`${styles.preview} ${(!draftWidget || isFullScreen) ? styles.bigPreview : ""}`} >
                    {selectedTemplate === "ST" ? <StickyPreview type="top" fetchedAddedOtherData={fetchedAddedOtherData} smallCard={smallCard} selectedBtn={selectedBtn} buttonSettings={buttonSettings} selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} widgetId={widgetId} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                        selectedTemplate === "SB" ? <StickyPreview type="down" fetchedAddedOtherData={fetchedAddedOtherData} smallCard={smallCard} selectedBtn={selectedBtn} buttonSettings={buttonSettings} selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} widgetId={widgetId} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                            selectedTemplate === "HB" ? <HeroBanner fetchedAddedOtherData={fetchedAddedOtherData} selectedBtn={selectedBtn} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} buttonSettings={buttonSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                selectedTemplate === "GS" ? <GridView widgetId={widgetId} fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoLocation={demoLocation} /> :
                                    selectedTemplate === "LS" ? <ListView widgetId={widgetId} fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                        selectedTemplate === "HBL" ? <HeroBannerAndViews type='list' selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                            selectedTemplate === "HBG" ? <HeroBannerAndViews type='grid' selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                selectedTemplate === "CVL" ? <CaraouselAndViews type='list'
                                                    fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} widgetId={widgetId} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                    selectedTemplate === "CVG" ? <CaraouselAndViews type='grid' fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} widgetId={widgetId} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                        selectedTemplate === "CV" ? <CaraouselView widgetId={widgetId} fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                            selectedTemplate === "HS" ? <ScrollView fetchedAddedOtherData={fetchedAddedOtherData} type='top' selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                                selectedTemplate === "LSR" ? <ScrollView fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} type='left' cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                                    selectedTemplate === "RSR" ? <ScrollView fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} type='right' cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> :
                                                                        selectedTemplate === "PUVP" ? <PortraitPopup
                                                                            smallCard={smallCard}
                                                                            fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} buttonSettings={buttonSettings} closeButtonSetting={closeButtonSetting} selectedBtn={selectedBtn} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> : selectedTemplate === "PUVL" ? <LandscapePopup
                                                                                smallCard={smallCard} fetchedAddedOtherData={fetchedAddedOtherData} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} buttonSettings={buttonSettings} closeButtonSetting={closeButtonSetting} selectedBtn={selectedBtn} demoBanner={demoBanner} demoEventName={demoEventName} demoDescription={demoDescription} demoLocation={demoLocation} /> : <></>}
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
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z" /></svg>
    )
}

function CloseFullScreenIcon() {
    return (
        <svg data-testid="geist-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16"><path fillRule="evenodd" clipRule="evenodd" d="M6 1V1.75V5C6 5.55229 5.55228 6 5 6H1.75H1V4.5H1.75H4.5V1.75V1H6ZM14.25 6H15V4.5H14.25H11.5V1.75V1H10V1.75V5C10 5.55228 10.4477 6 11 6H14.25ZM10 14.25V15H11.5V14.25V11.5H14.29H15.04V10H14.29H11C10.4477 10 10 10.4477 10 11V14.25ZM1.75 10H1V11.5H1.75H4.5V14.25V15H6V14.25V11C6 10.4477 5.55229 10 5 10H1.75Z" fill="currentColor"></path></svg>
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