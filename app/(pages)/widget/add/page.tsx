'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import Image from 'next/image'
import RightArrow from '/public/rightArrow.svg'
import WidgetOptions from '@/app/components/TemplateViewsNew/WidgetOptions/WidgetOptions'
import TemplatesPreview from '@/app/components/TemplateViewsNew/TemplatesPreview/TemplatesPreview'
import DraftWidgets from "@/app/components/TemplateViews/draftwidgets/DraftWidgets";
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/constants';
import useOutsideClick from '@/hooks/useOutsideClick'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface DraftWidgetsType {
    widgetType: string;
    templateId: string;
    widgetId: string;
    status: string;
    eventSize: number;
    widgetStatus: string;
}

const Page = () => {
    const [widgetSelected, setWidgetSelected] = useState("");
    const [exploreWindow, setExploreWindow] = useState<boolean>(false);
    const [widgetOptionsWindow, setWidgetOptionsWindow] = useState<boolean>(true)
    const [yourWidgetModal, setYourWidgetModal] = useState<boolean>(false)
    const [draftWidgets, setDraftWidgets] = useState<DraftWidgetsType[]>([])
    const dropdownRef = useOutsideClick(() => setYourWidgetModal(false))
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const [isDraftSaved, setIsDraftSaved]= useState<boolean>(false)

    const handleExplore = () => {
        if (widgetSelected) {
            setExploreWindow(true)
            setWidgetOptionsWindow(false)
        }
    }
    const handleWidgetOptionsWindow = () => {
        if (exploreWindow) {
            setWidgetOptionsWindow(!widgetOptionsWindow)
        }
    }
    const asciiToString = (ascii: number): string => {
        let convertedValue = ascii.toString();
        let str = '';
        for (let i = 0; i < convertedValue.length; i += 2) {
            const code = convertedValue.substring(i, i + 2);
            str += String.fromCharCode(parseInt(code, 10));
        }
        return str;
    };
    const fetchDraftWidgets = async () => {
        const { data, error } = await myFetch(`${baseUrl}/widget`);
        if (data) {
            console.log(data);
            const filteredWidgets = data.data.filter((widget: any) => widget.status === "draft")
                .map((widget: any) => ({
                    ...widget,
                    templateId: asciiToString(widget.templatePublicId),
                    widgetType: widget.type,
                    widgetId: widget.id,
                    eventSize: widget.otherdata.event.length,
                    widgetStatus: "Draft"
                }));
            setDraftWidgets(filteredWidgets);
        }
        if (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchDraftWidgets()
    }, [])
    useEffect(()=>{
        // This is to trigger the toast container when widget is saved to draft
        if(isDraftSaved){
            toast.success("Widget Added to draft")
        }
        setIsDraftSaved(false)
    },[isDraftSaved])
    return (
        <div className={`${styles.body}`}>
            <ToastContainer />
            <div className={styles.navRightBtns}>
                {/* <div className={styles.hide_showBtn} onClick={handleWidgetOptionsWindow}>
                    {!widgetOptionsWindow ? <EyeIconOff fillColor='#6750a4' /> : <EyeIconOn fillColor='#6750a4' />}
                </div> */}
                {/* <div className={styles.line}></div> */}
                {!isFullScreen && <div className={styles.myWidgetBtnContainer} onClick={() => setYourWidgetModal(true)}>
                    <div className={styles.myWidgetBtn}>Draft Widgets <span>{draftWidgets.length}</span></div>
                    <Image src={RightArrow} alt='arrow' />
                </div>}
            </div>
            {(!widgetOptionsWindow && !isFullScreen) && <div className={styles.leftNav}>
                <div className={`${styles.navItem} ${widgetSelected === "Page" ? styles.activeNavItem : ""}`} onClick={() => setWidgetSelected("Page")}>Page Widgets
                    {widgetSelected === "Page" && <div className={styles.activeLine}></div>}
                </div>
                <div className={`${styles.navItem} ${widgetSelected === "Section" ? styles.activeNavItem : ""}`} onClick={() => setWidgetSelected("Section")}>Section Widgets
                    {widgetSelected === "Section" && <div className={styles.activeLine}></div>}
                </div>
                <div className={`${styles.navItem} ${widgetSelected === "Sticky" ? styles.activeNavItem : ""}`} onClick={() => setWidgetSelected("Sticky")}>Sticky Widgets
                    {widgetSelected === "Sticky" && <div className={styles.activeLine}></div>}
                </div>
                <div className={`${styles.navItem} ${widgetSelected === "Pop" ? styles.activeNavItem : ""}`} onClick={() => setWidgetSelected("Pop")}>Pop-up Widget
                    {widgetSelected === "Pop" && <div className={styles.activeLine}></div>}
                </div>
            </div>}
            {widgetOptionsWindow && <div className={styles.widgetOptions}>
                <WidgetOptions setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected} widgetOptionsWindow={widgetOptionsWindow} exploreWindow={exploreWindow} handleExplore={handleExplore} />
            </div>}
            {/* {!exploreWindow && <div className={styles.exploreBtnContainer}>
                <div onClick={handleExplore} className={`${styles.explporeBtn} ${widgetSelected ? styles.activeExploreBtn : ""}`} style={!widgetSelected ? { cursor: "not-allowed" } : { cursor: "pointer" }}>Explore Styles</div>
            </div>} */}
            {(!widgetOptionsWindow && !isFullScreen) && <div className={styles.line}></div>}
            {exploreWindow &&
                <div className={styles.templates_preview}>
                    <TemplatesPreview setIsDraftSaved={setIsDraftSaved} setIsFullScreen={setIsFullScreen} isFullScreen={isFullScreen} setDraftWidgets={setDraftWidgets} draftWidgets={draftWidgets} widgetSelected={widgetSelected} fetchDraftWidgets={fetchDraftWidgets} />
                </div>
            }
            <div className={`${styles.yourWidgetModal} ${yourWidgetModal ? styles.open : ''}`} ref={dropdownRef}>
                <DraftWidgets draftWidgets={draftWidgets} setDraftWidgets={setDraftWidgets} setYourWidgetModal={setYourWidgetModal} fetchDraftWidgets={fetchDraftWidgets} />
            </div>
        </div>
    )
}

// function EyeIconOn({ fillColor }: { fillColor: string }) {
//     return (
//         <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <g mask="url(#mask0_1423_19272)">
//                 <path d="M9 12C9.9375 12 10.7344 11.6719 11.3906 11.0156C12.0469 10.3594 12.375 9.5625 12.375 8.625C12.375 7.6875 12.0469 6.89062 11.3906 6.23438C10.7344 5.57812 9.9375 5.25 9 5.25C8.0625 5.25 7.26562 5.57812 6.60938 6.23438C5.95312 6.89062 5.625 7.6875 5.625 8.625C5.625 9.5625 5.95312 10.3594 6.60938 11.0156C7.26562 11.6719 8.0625 12 9 12ZM9 10.65C8.4375 10.65 7.95938 10.4531 7.56563 10.0594C7.17188 9.66563 6.975 9.1875 6.975 8.625C6.975 8.0625 7.17188 7.58437 7.56563 7.19063C7.95938 6.79688 8.4375 6.6 9 6.6C9.5625 6.6 10.0406 6.79688 10.4344 7.19063C10.8281 7.58437 11.025 8.0625 11.025 8.625C11.025 9.1875 10.8281 9.66563 10.4344 10.0594C10.0406 10.4531 9.5625 10.65 9 10.65ZM9 14.25C7.175 14.25 5.5125 13.7406 4.0125 12.7219C2.5125 11.7031 1.425 10.3375 0.75 8.625C1.425 6.9125 2.5125 5.54688 4.0125 4.52813C5.5125 3.50938 7.175 3 9 3C10.825 3 12.4875 3.50938 13.9875 4.52813C15.4875 5.54688 16.575 6.9125 17.25 8.625C16.575 10.3375 15.4875 11.7031 13.9875 12.7219C12.4875 13.7406 10.825 14.25 9 14.25ZM9 12.75C10.4125 12.75 11.7094 12.3781 12.8906 11.6344C14.0719 10.8906 14.975 9.8875 15.6 8.625C14.975 7.3625 14.0719 6.35938 12.8906 5.61562C11.7094 4.87187 10.4125 4.5 9 4.5C7.5875 4.5 6.29063 4.87187 5.10938 5.61562C3.92812 6.35938 3.025 7.3625 2.4 8.625C3.025 9.8875 3.92812 10.8906 5.10938 11.6344C6.29063 12.3781 7.5875 12.75 9 12.75Z" fill={fillColor} />
//             </g>
//         </svg>
//     )
// }
// function EyeIconOff({ fillColor }: { fillColor: string }) {
//     return (
//         <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <g mask="url(#mask0_1423_19272)">
//                 <path d="M9 12C9.9375 12 10.7344 11.6719 11.3906 11.0156C12.0469 10.3594 12.375 9.5625 12.375 8.625C12.375 7.6875 12.0469 6.89062 11.3906 6.23438C10.7344 5.57812 9.9375 5.25 9 5.25C8.0625 5.25 7.26562 5.57812 6.60938 6.23438C5.95312 6.89062 5.625 7.6875 5.625 8.625C5.625 9.5625 5.95312 10.3594 6.60938 11.0156C7.26562 11.6719 8.0625 12 9 12ZM9 10.65C8.4375 10.65 7.95938 10.4531 7.56563 10.0594C7.17188 9.66563 6.975 9.1875 6.975 8.625C6.975 8.0625 7.17188 7.58437 7.56563 7.19063C7.95938 6.79688 8.4375 6.6 9 6.6C9.5625 6.6 10.0406 6.79688 10.4344 7.19063C10.8281 7.58437 11.025 8.0625 11.025 8.625C11.025 9.1875 10.8281 9.66563 10.4344 10.0594C10.0406 10.4531 9.5625 10.65 9 10.65ZM9 14.25C7.175 14.25 5.5125 13.7406 4.0125 12.7219C2.5125 11.7031 1.425 10.3375 0.75 8.625C1.425 6.9125 2.5125 5.54688 4.0125 4.52813C5.5125 3.50938 7.175 3 9 3C10.825 3 12.4875 3.50938 13.9875 4.52813C15.4875 5.54688 16.575 6.9125 17.25 8.625C16.575 10.3375 15.4875 11.7031 13.9875 12.7219C12.4875 13.7406 10.825 14.25 9 14.25ZM9 12.75C10.4125 12.75 11.7094 12.3781 12.8906 11.6344C14.0719 10.8906 14.975 9.8875 15.6 8.625C14.975 7.3625 14.0719 6.35938 12.8906 5.61562C11.7094 4.87187 10.4125 4.5 9 4.5C7.5875 4.5 6.29063 4.87187 5.10938 5.61562C3.92812 6.35938 3.025 7.3625 2.4 8.625C3.025 9.8875 3.92812 10.8906 5.10938 11.6344C6.29063 12.3781 7.5875 12.75 9 12.75Z" fill={fillColor} />
//             </g>
//             <line x1="1" y1="1" x2="17" y2="17" stroke="#A1A2A2" stroke-width="2" />
//         </svg>

//     )
// }
export default Page