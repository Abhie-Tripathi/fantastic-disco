import React, { useState } from 'react'
import styles from './edit.style.module.css'
import FilterEvents from './FilterEvents/FilterEvents'
import CodeWindow from './Code/CodeWindow';
import Customization from './BrandKit/Customization';
import { useTheme } from '@/context';
import { AddedEventsType } from '@/types/addedeventtype';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype';
import { ButtonSettingsState } from '@/types/buttoncustomizetypes';
import { AllEventsType } from '@/types/alleventtype';
import { GolbalEventType } from '@/types/globaleventtype';
import { showToast } from "@/utils/showToast";

interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
}

interface FontSettingsState {
    heading: FontSettings;
    subheading: FontSettings;
    body: FontSettings;
}

interface EditScreenProps {
    setCardBgColor: React.Dispatch<React.SetStateAction<string>>;
    setCardBorderRadius: React.Dispatch<React.SetStateAction<number>>;
    setFontSettings: React.Dispatch<React.SetStateAction<FontSettingsState>>;
    setButtonSettings: React.Dispatch<React.SetStateAction<ButtonSettingsState>>;
    buttonSettings: ButtonSettingsState
    fontSettings: FontSettingsState
    cardBgColor: string
    previewWindowBgColor:string;
    setPreviewWindowBgColor:React.Dispatch<React.SetStateAction<string>>;
    isDark?:boolean;
    setIsDark?:(value: boolean) => void
    cardBorderRadius: number;
    cardStyle: string;
    setCardStyle: React.Dispatch<React.SetStateAction<string>>;
    setSelectedBtn: (value: "primary" | "secondary") => void
    selectedBtn: "primary" | "secondary"
    handleUpdateCustomization: () => Promise<void>;
    fetchedAllEvents: AllEventsType[]
    fetchEvents: (page : number) => Promise<void>;
    fetchAddedEvents: () => Promise<void>;
    widgetId: string;
    widgetType: string;
    fetchedAddedEvents: AddedEventsType[]
    // handlePrefillEvent: (event: AllEventsType , type : string) => void
    addedEventIds: string[]
    allEventsCount : number;
    selectedTemplate : string;

    isCustomisationWindowDisable:boolean
    setIsCustomisationWindowDisable:(value: boolean) => void;
    isCodeWindowDisable:boolean
    setIsCodeWindowDisable:(value: boolean) => void;
}

const EditScreen = ({ setCardBgColor, setCardBorderRadius, setFontSettings, fontSettings, setButtonSettings, cardBgColor, cardBorderRadius, buttonSettings, cardStyle, setCardStyle, setSelectedBtn, selectedBtn, handleUpdateCustomization, fetchedAllEvents, fetchEvents, widgetId, widgetType, fetchedAddedEvents, fetchAddedEvents, addedEventIds,
    // handlePrefillEvent,
    allEventsCount, selectedTemplate, isCustomisationWindowDisable,setIsCustomisationWindowDisable,isCodeWindowDisable,setIsCodeWindowDisable,previewWindowBgColor,setPreviewWindowBgColor }: EditScreenProps) => {
    const [selectedNavItem, setSelectedNavItem] = useState<string>("events")
    const [extractedColors, setExtractedColors] = useState<string[]>(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])
    const { theme } = useTheme()

    const getIconColor = (navItem: string) => {
        if (selectedNavItem === navItem) {
            return "#6750a4";
        } else {
            return theme === "light" ? "#424242" : "#ffffff";
        }
    };
    const handleCustomizationWindowClick=() => {
        if (isCustomisationWindowDisable) {
            if(selectedTemplate ==="LS"){
                showToast( 
                    "error",
                    "Please add at least one event to the widget to continue to the customization screen!"
                );
            } else if(selectedTemplate ==="ST"){
                showToast( 
                    "error",
                    "Please add at least one event to the widget to continue to the customization screen!"
                );
            }else if(selectedTemplate ==="PUVP"){
                showToast( 
                    "error",
                    "Please add at least one event to the widget to continue to the customization screen!"
                );
            }else if(selectedTemplate ==="PUVL"){
                showToast( 
                    "error",
                    "Please add at least one event to the widget to continue to the customization screen!"
                );
            }
            else if(selectedTemplate ==="LSR"){
                showToast( 
                    "error",
                    "Please add at least one event to the widget to continue to the customization screen!"
                );
            }
            else if(selectedTemplate ==="GS"){
                showToast( 
                    "error",
                    "Please add at least one event to the widget to continue to the customization screen!"
                );
            }
            else if(selectedTemplate ==="CVL"){
                showToast( 
                    "error",
                    "Select at least 1 event for the list and promote 3 for the carousel view!"
                );
            }else if(selectedTemplate ==="CVG"){
                showToast( 
                    "error",
                    "Select at least 2 events for the grid and promote 3 for the carousel view!"
                );
            }else if(selectedTemplate ==="CV"){
                showToast( 
                    "error",
                    "Select at least 3 events for the carousel view!"
                );
            } else if(selectedTemplate ==="HS"){
               
                showToast( 
                    "error",
                    "Select at least 3 events for this view!"
                );
            }
          } else {
            setSelectedNavItem("customize");
          }
    }

    const handleCodeWindowClick=() => {
        if (isCustomisationWindowDisable) {
            if(selectedTemplate ==="LS"){
                showToast( 
                    "error",
                    "Please add at least one event to the widget to continue to the code screen!"
                );
            }else if(selectedTemplate ==="PUVP"){
                showToast( 
                    "error",
                    "Please add at least one event to the widget to continue to the code screen!"
                );
            }else if(selectedTemplate ==="PUVL"){
                showToast( 
                    "error",
                    "Please add at least one event to the widget to continue to the code screen!"
                );
            }
            else if(selectedTemplate ==="ST"){
                showToast( 
                    "error",
                    "Please add at least one event to the widget to continue to the code screen!"
                );
            }
            else if(selectedTemplate ==="LSR"){
                showToast( 
                    "error",
                    "Please add at least one event to the widget to continue to the code screen!"
                );
            }
            else if(selectedTemplate ==="GS"){
                showToast( 
                    "error",
                    "Please add at least one event to the widget to continue to the code screen!"
                );
            }
            else if(selectedTemplate ==="CVL"){
                showToast( 
                    "error",
                    "Select at least 1 event for the list and promote 3 for the carousel view!"
                );
            }else if(selectedTemplate ==="CVG"){
                showToast( 
                    "error",
                    "Select at least 2 events for the grid and promote 3 for the carousel view!"
                );
            }else if(selectedTemplate ==="CV"){
                showToast( 
                    "error",
                    "Select at least 3 events for the carousel view!"
                );
            } else if(selectedTemplate ==="HS"){
               
                showToast( 
                    "error",
                    "Select at least 3 events for this view!"
                );
            }
           
          } else {
            setSelectedNavItem("code")
          }
    }
    return (
        <div className={styles.body} >
            <div className={styles.navbar} style={{ backgroundColor: theme === "light" ? "#FBF8FF" : "#1F1F1F" }}>
                <button onClick={() => setSelectedNavItem("events")}
                    className={`${selectedNavItem === "events" ? (theme === "dark" ? styles.darkactiveBtn : styles.lightactiveBtn) : ""} ${theme === "light" ? styles.lightBtn : styles.darkBtn}`}>
                    <FilterIcon color={getIconColor("events")} /><span>Select Events</span></button>

                <button  
                // onClick={() => setSelectedNavItem("customize")}
                onClick={() => {
                    handleCustomizationWindowClick()
                }}
                    className={`${selectedNavItem === "customize" ? (theme === "dark" ? styles.darkactiveBtn : styles.lightactiveBtn) : ""} ${theme === "light" ? styles.lightBtn : styles.darkBtn} ${isCustomisationWindowDisable ? styles.disabledBtn : ""}`}>
                    <CustomizeIcon color={getIconColor("customize")} /><span>Customize</span></button>

                <button  onClick={() => handleCodeWindowClick()}
                    className={`${selectedNavItem === "code" ? (theme === "dark" ? styles.darkactiveBtn : styles.lightactiveBtn) : ""} ${theme === "light" ? styles.lightBtn : styles.darkBtn} ${isCodeWindowDisable ? styles.disabledBtn : ""}`}>
                    <CodeIcon color={getIconColor("code")} /><span>Code</span></button>
            </div>
            <div className={styles.container}>
                {selectedNavItem === "customize" ? <Customization previewWindowBgColor={previewWindowBgColor}setPreviewWindowBgColor={setPreviewWindowBgColor} handleUpdateCustomization={handleUpdateCustomization} selectedBtn={selectedBtn} setSelectedBtn={setSelectedBtn} cardStyle={cardStyle} setCardStyle={setCardStyle} fontSettings={fontSettings} buttonSettings={buttonSettings} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} setButtonSettings={setButtonSettings} setFontSettings={setFontSettings} setCardBorderRadius={setCardBorderRadius} setCardBgColor={setCardBgColor} setExtractedColors={setExtractedColors} extractedColors={extractedColors} selectedTemplate={selectedTemplate} /> : selectedNavItem === "events" ? <FilterEvents selectedTemplate={selectedTemplate} allEventsCount={allEventsCount} isCustomisationWindowDisable={isCustomisationWindowDisable}setIsCustomisationWindowDisable={setIsCustomisationWindowDisable}isCodeWindowDisable={isCodeWindowDisable}setIsCodeWindowDisable={setIsCodeWindowDisable}
                // handlePrefillEvent={handlePrefillEvent}
                 addedEventIds={addedEventIds} widgetId={widgetId} fetchAddedEvents={fetchAddedEvents} fetchedAddedEvents={fetchedAddedEvents} fetchEvents={fetchEvents} fetchedAllEvents={fetchedAllEvents} /> : <CodeWindow widgetType={widgetType} widgetId={widgetId} />}
            </div>
        </div>
    )
}

export default EditScreen

interface IconProps {
    color: string;
}

function CustomizeIcon({ color }: IconProps) {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.44015 1.53313L5.24415 2.54613C5.20555 2.74529 5.12465 2.93383 5.0069 3.09902C4.88914 3.26421 4.7373 3.40219 4.56162 3.50363C4.38595 3.60507 4.19054 3.66761 3.98861 3.68702C3.78668 3.70643 3.58293 3.68226 3.39115 3.61613L2.41415 3.27813C2.18663 3.57735 1.99749 3.90389 1.85115 4.25013L2.63315 4.92913C3.28315 5.49413 3.28315 6.50413 2.63315 7.06913L1.85115 7.74813C1.99915 8.09746 2.18682 8.42113 2.41415 8.71913L3.39115 8.38213C3.58293 8.31601 3.78668 8.29183 3.98861 8.31124C4.19054 8.33065 4.38595 8.39319 4.56162 8.49463C4.7373 8.59607 4.88914 8.73405 5.0069 8.89924C5.12465 9.06443 5.20555 9.25298 5.24415 9.45213L5.44115 10.4651C5.81445 10.5107 6.19194 10.5104 6.56515 10.4641L6.76115 9.45213C6.79975 9.25298 6.88066 9.06443 6.99841 8.89924C7.11616 8.73405 7.26801 8.59607 7.44368 8.49463C7.61936 8.39319 7.81477 8.33065 8.0167 8.31124C8.21863 8.29183 8.42237 8.31601 8.61415 8.38213L9.58515 8.71713C9.81315 8.41847 10.0012 8.09346 10.1492 7.74213L9.37315 7.06913C9.21994 6.93612 9.09709 6.77175 9.01289 6.58715C8.9287 6.40255 8.88512 6.20203 8.88512 5.99913C8.88512 5.79624 8.9287 5.59571 9.01289 5.41111C9.09709 5.22651 9.21994 5.06215 9.37315 4.92913L10.1492 4.25513C10.0027 3.90779 9.81325 3.58023 9.58515 3.28013L8.61515 3.61513C8.42331 3.68143 8.21947 3.70573 8.01742 3.68641C7.81537 3.66708 7.61983 3.60458 7.44403 3.50312C7.26824 3.40166 7.11629 3.26362 6.99847 3.09835C6.88066 2.93307 6.79973 2.74441 6.76115 2.54513L6.56515 1.53513C6.19165 1.48844 5.81382 1.48777 5.44015 1.53313ZM4.91815 0.605132C5.63444 0.461682 6.37213 0.462362 7.08815 0.607132C7.18546 0.626546 7.27479 0.674473 7.34478 0.744813C7.41476 0.815154 7.46223 0.904727 7.48115 1.00213L7.74315 2.35513C7.7545 2.41371 7.7783 2.46918 7.81292 2.51778C7.84755 2.56637 7.8922 2.60697 7.94387 2.63683C7.99553 2.66669 8.053 2.68512 8.11239 2.69086C8.17179 2.69661 8.23172 2.68954 8.28815 2.67013L9.58815 2.22113C9.6819 2.18896 9.7831 2.18537 9.87889 2.21084C9.97469 2.2363 10.0608 2.28965 10.1262 2.36413C10.6042 2.90613 10.9772 3.54413 11.2132 4.24513C11.2448 4.33903 11.2478 4.44021 11.2218 4.53582C11.1958 4.63143 11.142 4.71716 11.0672 4.78213L10.0282 5.68413C9.98303 5.72328 9.94684 5.77166 9.92204 5.82601C9.89723 5.88035 9.8844 5.93939 9.8844 5.99913C9.8844 6.05887 9.89723 6.11791 9.92204 6.17226C9.94684 6.2266 9.98303 6.27499 10.0282 6.31413L11.0682 7.21513C11.1428 7.28022 11.1964 7.366 11.2222 7.46161C11.248 7.55721 11.2449 7.65833 11.2132 7.75213C10.9796 8.44552 10.6101 9.08535 10.1262 9.63413C10.0606 9.70844 9.97451 9.7616 9.87873 9.78688C9.78294 9.81217 9.68181 9.80842 9.58815 9.77613L8.28815 9.32713C8.23172 9.30773 8.17179 9.30066 8.11239 9.3064C8.053 9.31214 7.99553 9.33057 7.94387 9.36043C7.8922 9.39029 7.84755 9.43089 7.81292 9.47949C7.7783 9.52809 7.7545 9.58355 7.74315 9.64213L7.48115 10.9961C7.4623 11.0934 7.41498 11.1829 7.34518 11.2532C7.27539 11.3235 7.18628 11.3715 7.08915 11.3911C6.37313 11.5359 5.63544 11.5366 4.91915 11.3931C4.82153 11.3738 4.73188 11.3258 4.66169 11.2553C4.5915 11.1847 4.54396 11.0949 4.52515 10.9971L4.26315 9.64213C4.2518 9.58355 4.22801 9.52809 4.19338 9.47949C4.15876 9.43089 4.1141 9.39029 4.06244 9.36043C4.01078 9.33057 3.95331 9.31214 3.89391 9.3064C3.83452 9.30066 3.77458 9.30773 3.71815 9.32713L2.41115 9.77813C2.3175 9.81042 2.21636 9.81417 2.12058 9.78888C2.02479 9.7636 1.93867 9.71044 1.87315 9.63613C1.38982 9.08882 1.0203 8.45075 0.786153 7.75913C0.754544 7.66523 0.751547 7.56405 0.777541 7.46844C0.803536 7.37283 0.857349 7.2871 0.932153 7.22213L1.97715 6.31413C2.02211 6.27499 2.05815 6.22666 2.08285 6.17241C2.10755 6.11816 2.12033 6.05924 2.12033 5.99963C2.12033 5.94002 2.10755 5.8811 2.08285 5.82685C2.05815 5.7726 2.02211 5.72427 1.97715 5.68513L0.932153 4.77813C0.857155 4.71308 0.80322 4.62718 0.777219 4.53137C0.751217 4.43555 0.754328 4.33417 0.786153 4.24013C1.02215 3.54013 1.39615 2.90413 1.87315 2.36213C1.93867 2.28783 2.02479 2.23466 2.12058 2.20938C2.21636 2.1841 2.3175 2.18784 2.41115 2.22013L3.71815 2.67113C3.77458 2.69054 3.83452 2.69761 3.89391 2.69186C3.95331 2.68612 4.01078 2.66769 4.06244 2.63783C4.1141 2.60797 4.15876 2.56737 4.19338 2.51877C4.22801 2.47018 4.2518 2.41471 4.26315 2.35613L4.52515 1.00213C4.54389 0.904544 4.59129 0.814754 4.66129 0.744221C4.73128 0.673689 4.82071 0.625614 4.91815 0.606132M9.68915 10.7961C9.59687 10.7617 9.49595 10.7577 9.40126 10.7849C9.30656 10.8121 9.2231 10.869 9.16315 10.9471C9.02315 11.1418 8.90315 11.3495 8.80315 11.5701C8.76494 11.661 8.75695 11.7618 8.78036 11.8576C8.80376 11.9534 8.85733 12.0391 8.93315 12.1021L9.57315 12.6571C9.62215 12.6998 9.66143 12.7526 9.68835 12.8117C9.71527 12.8709 9.72919 12.9351 9.72919 13.0001C9.72919 13.0651 9.71527 13.1294 9.68835 13.1885C9.66143 13.2477 9.62215 13.3004 9.57315 13.3431L8.93315 13.8981C8.85733 13.9612 8.80376 14.0469 8.78036 14.1427C8.75695 14.2385 8.76494 14.3392 8.80315 14.4301C8.90315 14.6508 9.02315 14.8585 9.16315 15.0531C9.22297 15.1315 9.30637 15.1885 9.40108 15.2159C9.49578 15.2433 9.59676 15.2395 9.68915 15.2051L10.4892 14.9291C10.5506 14.9081 10.6159 14.9004 10.6806 14.9067C10.7453 14.913 10.8079 14.933 10.8642 14.9655C10.9204 14.998 10.9691 15.0422 11.0069 15.0951C11.0447 15.148 11.0707 15.2084 11.0832 15.2721L11.2432 16.1021C11.2832 16.3021 11.4372 16.4621 11.6392 16.4821C11.8782 16.5061 12.1191 16.5061 12.3582 16.4821C12.456 16.4696 12.5473 16.4258 12.6184 16.3574C12.6896 16.289 12.7368 16.1995 12.7532 16.1021L12.9132 15.2721C12.9255 15.2082 12.9514 15.1476 12.9892 15.0945C13.027 15.0414 13.0758 14.9971 13.1322 14.9646C13.1887 14.9321 13.2515 14.912 13.3163 14.9059C13.3812 14.8998 13.4466 14.9077 13.5082 14.9291L14.3082 15.2051C14.4005 15.2395 14.5015 15.2433 14.5962 15.2159C14.6909 15.1885 14.7743 15.1315 14.8342 15.0531C14.9742 14.8585 15.0942 14.6508 15.1942 14.4301C15.2324 14.3392 15.2404 14.2385 15.2169 14.1427C15.1935 14.0469 15.14 13.9612 15.0642 13.8981L14.4242 13.3431C14.3752 13.3004 14.3359 13.2477 14.309 13.1885C14.282 13.1294 14.2681 13.0651 14.2681 13.0001C14.2681 12.9351 14.282 12.8709 14.309 12.8117C14.3359 12.7526 14.3752 12.6998 14.4242 12.6571L15.0642 12.1021C15.14 12.0391 15.1935 11.9534 15.2169 11.8576C15.2404 11.7618 15.2324 11.661 15.1942 11.5701C15.0942 11.3495 14.9742 11.1418 14.8342 10.9471C14.7743 10.8688 14.6909 10.8117 14.5962 10.7844C14.5015 10.757 14.4005 10.7608 14.3082 10.7951L13.5082 11.0711C13.4467 11.0924 13.3814 11.1002 13.3166 11.0939C13.2519 11.0877 13.1892 11.0677 13.1329 11.0352C13.0766 11.0027 13.0279 10.9584 12.9901 10.9054C12.9524 10.8525 12.9265 10.792 12.9142 10.7281L12.7542 9.89813C12.7377 9.80065 12.6904 9.71105 12.619 9.6426C12.5477 9.57416 12.4562 9.53051 12.3582 9.51813C12.1191 9.49414 11.8782 9.49414 11.6392 9.51813C11.5413 9.53071 11.45 9.57445 11.3789 9.64288C11.3077 9.7113 11.2605 9.8008 11.2442 9.89813L11.0832 10.7281C11.0707 10.792 11.0447 10.8525 11.0068 10.9055C10.969 10.9585 10.9202 11.0027 10.8638 11.0352C10.8074 11.0677 10.7447 11.0878 10.6799 11.094C10.6151 11.1002 10.5497 11.0924 10.4882 11.0711L9.68915 10.7961ZM12.0002 13.9991C11.7349 13.9991 11.4806 13.8938 11.293 13.7062C11.1055 13.5187 11.0002 13.2643 11.0002 12.9991C11.0002 12.7339 11.1055 12.4796 11.293 12.292C11.4806 12.1045 11.7349 11.9991 12.0002 11.9991C12.2654 11.9991 12.5197 12.1045 12.7073 12.292C12.8948 12.4796 13.0002 12.7339 13.0002 12.9991C13.0002 13.2643 12.8948 13.5187 12.7073 13.7062C12.5197 13.8938 12.2654 13.9991 12.0002 13.9991ZM5.00015 5.99913C5.00015 5.73392 5.10551 5.47956 5.29305 5.29203C5.48058 5.10449 5.73494 4.99913 6.00015 4.99913C6.26537 4.99913 6.51972 5.10449 6.70726 5.29203C6.8948 5.47956 7.00015 5.73392 7.00015 5.99913C7.00015 6.26435 6.8948 6.5187 6.70726 6.70624C6.51972 6.89377 6.26537 6.99913 6.00015 6.99913C5.73494 6.99913 5.48058 6.89377 5.29305 6.70624C5.10551 6.5187 5.00015 6.26435 5.00015 5.99913ZM6.00015 3.99913C5.46972 3.99913 4.96101 4.20985 4.58594 4.58492C4.21087 4.95999 4.00015 5.4687 4.00015 5.99913C4.00015 6.52956 4.21087 7.03827 4.58594 7.41334C4.96101 7.78842 5.46972 7.99913 6.00015 7.99913C6.53059 7.99913 7.03929 7.78842 7.41437 7.41334C7.78944 7.03827 8.00015 6.52956 8.00015 5.99913C8.00015 5.4687 7.78944 4.95999 7.41437 4.58492C7.03929 4.20985 6.53059 3.99913 6.00015 3.99913Z" fill={color} />
        </svg>

    )
}
function FilterIcon({ color }: IconProps) {
    return (
        <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.1668 12.5C9.80016 12.5 9.48639 12.3696 9.2255 12.1087C8.96461 11.8478 8.83394 11.5338 8.8335 11.1667V8.5C8.8335 8.13333 8.96416 7.81956 9.2255 7.55867C9.48683 7.29778 9.80061 7.16711 10.1668 7.16667H12.8335C13.2002 7.16667 13.5142 7.29733 13.7755 7.55867C14.0368 7.82 14.1673 8.13378 14.1668 8.5V11.1667C14.1668 11.5333 14.0364 11.8473 13.7755 12.1087C13.5146 12.37 13.2006 12.5004 12.8335 12.5H10.1668ZM10.1668 11.1667H12.8335V8.5H10.1668V11.1667ZM0.833496 10.5V9.16667H6.8335V10.5H0.833496ZM10.1668 5.83333C9.80016 5.83333 9.48639 5.70289 9.2255 5.442C8.96461 5.18111 8.83394 4.86711 8.8335 4.5V1.83333C8.8335 1.46667 8.96416 1.15289 9.2255 0.892C9.48683 0.631111 9.80061 0.500444 10.1668 0.5H12.8335C13.2002 0.5 13.5142 0.630667 13.7755 0.892C14.0368 1.15333 14.1673 1.46711 14.1668 1.83333V4.5C14.1668 4.86667 14.0364 5.18067 13.7755 5.442C13.5146 5.70333 13.2006 5.83378 12.8335 5.83333H10.1668ZM10.1668 4.5H12.8335V1.83333H10.1668V4.5ZM0.833496 3.83333V2.5H6.8335V3.83333H0.833496Z" fill={color} />
        </svg>

    )
}
function CodeIcon({ color }: IconProps) {
    return (
        <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.0625 9.01562C7.0625 9.08438 7.11562 9.14062 7.17969 9.14062H10.0703C10.1344 9.14062 10.1875 9.08438 10.1875 9.01562V8.26562C10.1875 8.19688 10.1344 8.14062 10.0703 8.14062H7.17969C7.11562 8.14062 7.0625 8.19688 7.0625 8.26562V9.01562ZM4.01719 9.11094L7.01719 6.59531C7.07656 6.54531 7.07656 6.45312 7.01719 6.40312L4.01719 3.88906C3.99908 3.87366 3.97693 3.86378 3.95337 3.86059C3.92981 3.85741 3.90583 3.86105 3.88428 3.87108C3.86273 3.88112 3.84451 3.89713 3.83179 3.91721C3.81906 3.93729 3.81237 3.9606 3.8125 3.98438V4.96406C3.8125 5.00156 3.82812 5.03594 3.85781 5.05937L5.57344 6.5L3.85781 7.94063C3.84385 7.95232 3.83257 7.96688 3.82475 7.98333C3.81693 7.99978 3.81275 8.01773 3.8125 8.03594V9.01562C3.8125 9.12187 3.93594 9.17969 4.01719 9.11094ZM12.75 0.25H1.25C0.973437 0.25 0.75 0.473437 0.75 0.75V12.25C0.75 12.5266 0.973437 12.75 1.25 12.75H12.75C13.0266 12.75 13.25 12.5266 13.25 12.25V0.75C13.25 0.473437 13.0266 0.25 12.75 0.25ZM12.125 11.625H1.875V1.375H12.125V11.625Z" fill={color} />
        </svg>

    )
}