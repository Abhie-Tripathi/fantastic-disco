import React from 'react'
import styles from './widgetcard.style.module.css'
import Image from 'next/image';
import ListViewImage from '/public/widgetimages/pageimages/listview.png'
import GridViewImage from '/public/widgetimages/pageimages/gridview.png'
import CarouselGridImage from '/public/widgetimages/pageimages/CarouselGrid.png'
import CarouselListImage from '/public/widgetimages/pageimages/CarouselList.png'
import HeroGridViewImage from '/public/widgetimages/pageimages/HeroGridView.png'
import HeroListViewImage from '/public/widgetimages/pageimages/HeroListView.png'
import ListViewImageDark from '/public/widgetimages/pageimages/listviewdark.png'
import GridViewImageDark from '/public/widgetimages/pageimages/gridviewdark.png'
import CarouselGridImageDark from '/public/widgetimages/pageimages/CarouselGridDark.png'
import CarouselListImageDark from '/public/widgetimages/pageimages/CarouselListDark.png'
import HeroGridViewImageDark from '/public/widgetimages/pageimages/HeroGridViewDark.png'
import HeroListViewImageDark from '/public/widgetimages/pageimages/HeroListViewDark.png'
import CarouselViewImage from '/public/widgetimages/sectionimages/carouselview.png'
import HorizontalScrollImage from '/public/widgetimages/sectionimages/horizontalscroll.png'
import LeftScrollImage from '/public/widgetimages/sectionimages/leftscroll.png'
import RightScrollImage from '/public/widgetimages/sectionimages/rightscroll.png'
import CarouselViewImageDark from '/public/widgetimages/sectionimages/carouselviewdark.png'
import HorizontalScrollImageDark from '/public/widgetimages/sectionimages/horizontalscrolldark.png'
import LeftScrollImageDark from '/public/widgetimages/sectionimages/leftscrolldark.png'
import RightScrollImageDark from '/public/widgetimages/sectionimages/rightscrolldark.png'
import HeroBannerImageDark from '/public/widgetimages/pageimages/herobannerdark.png'
import HeroBannerImage from '/public/widgetimages/pageimages/herobanner.png'
import StickyTopImage from '/public/widgetimages/stickyimages/stickytop.png'
import StickyBottomImage from '/public/widgetimages/stickyimages/stickybottom.png'
import StickyTopImageDark from '/public/widgetimages/stickyimages/stickytopdark.png'
import StickyBottomImageDark from '/public/widgetimages/stickyimages/stickybottomdark.png'
import PopupViewImage1 from '/public/widgetimages/popupimages/popupviewportrait.png'
import PopupViewImage2 from '/public/widgetimages/popupimages/popupviewlandscape.png'
import PopupViewImage1Dark from '/public/widgetimages/popupimages/popupviewportraitdark.png'
import PopupViewImage2Dark from '/public/widgetimages/popupimages/popupviewlandscapedark.png'
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/constants';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context';

interface WidgetProps {
    removeCalled?: boolean;
    setRemoveCalled?: (value : boolean) => void
    widgetType: string;
    templateId: TemplateId;
    widgetNumber?: number;
    widgetId: string;
    fetchDraftWidgets: () => Promise<void>;
    handleWidgetClick?: (value: string) => Promise<void>
    widgetStatus: string;
    fetchedEventsSize?: number;
    fetchAllWidgets?: () => Promise<void>;
    selected?: boolean
    key: number;
}
type TemplateId = 'ST' | 'SB' | 'HB' | 'GS' | 'LS' | 'HBL' | 'HBG' | 'CVL' | 'CVG' | 'CV' | 'HS' | 'LSR' | 'RSR' | 'PUVP' | 'PUVL';

const WidgetCard = ({ widgetType, templateId, widgetNumber, widgetId, fetchDraftWidgets, handleWidgetClick, widgetStatus, fetchedEventsSize, fetchAllWidgets, selected, key,removeCalled,setRemoveCalled }: WidgetProps) => {
    const { theme } = useTheme()
    const templateMap = {
        'ST': { image: theme === "light" ? StickyTopImage : StickyTopImageDark, heading: 'Sticky Top' },
        'SB': { image: theme === "light" ? StickyBottomImage : StickyBottomImageDark, heading: 'Sticky Bottom' },
        'HB': { image: theme === "light" ? HeroBannerImage : HeroBannerImageDark, heading: 'Hero Banner' },
        'GS': { image: theme === "light" ? GridViewImage : GridViewImageDark, heading: 'Grid View' },
        'LS': { image: theme === "light" ? ListViewImage : ListViewImageDark, heading: 'List View' },
        'HBL': { image: theme === "light" ? HeroListViewImage : HeroListViewImageDark, heading: 'Hero List View' },
        'HBG': { image: theme === "light" ? HeroGridViewImage : HeroGridViewImageDark, heading: 'Hero Grid View' },
        'CVL': { image: theme === "light" ? CarouselListImage : CarouselListImageDark, heading: 'Carousel List' },
        'CVG': { image: theme === "light" ? CarouselGridImage : CarouselGridImageDark, heading: 'Carousel Grid' },
        'CV': { image: theme === "light" ? CarouselViewImage : CarouselViewImageDark, heading: 'Carousel View' },
        'HS': { image: theme === "light" ? HorizontalScrollImage : HorizontalScrollImageDark, heading: 'Horizontal Scroll' },
        'LSR': { image: theme === "light" ? LeftScrollImage : LeftScrollImageDark, heading: 'Left Scroll' },
        'RSR': { image: theme === "light" ? RightScrollImage : RightScrollImageDark, heading: 'Right Scroll' },
        'PUVP': { image: theme === "light" ? PopupViewImage1 : PopupViewImage1Dark, heading: 'Popup View Portrait' },
        'PUVL': { image: theme === "light" ? PopupViewImage2 : PopupViewImage2Dark, heading: 'Popup View Landscape' },

    };

    const borderClass = widgetNumber === 1 ? styles.halfBorder : styles.fullBorder;

    const { image = null, heading = "" } = templateMap[templateId] || {};
    const router = useRouter()

    const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        const editData = new FormData();
        editData.append('widgetId', widgetId)
        editData.append('published', 'false')

        const { data, error } = await myFetch(
            `https://gtmdev-api.whr.ai/widget`,
            {
                method: 'POST',
                body: editData,
            }
        );
        if (data) {
            console.log("removed called")
            console.log("data is",data);
            if(setRemoveCalled){
                setRemoveCalled(!removeCalled)
                console.log("removed called")
            }
            if (fetchAllWidgets) {
                fetchAllWidgets();
            }
            fetchDraftWidgets()
        } else {
            console.log(error);
        }
    }

    const handleRoute = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        router.push(`/widget/edit/${widgetId}`);
    }

    const handleCardClick = () => {
        if (handleWidgetClick) {
            handleWidgetClick(widgetId)
        }
    }

    const handleWidgetStatus = async () => {
        const customizeData = new FormData();
        customizeData.append("widgetId", widgetId)
        customizeData.append("status", widgetStatus === "Active" ? "deactivate" : "active")
        const { data, error } = await myFetch(
            `https://gtmdev-api.whr.ai/widget`,
            {
                method: 'POST',
                body: customizeData,
            }
        );
        if (data) {
            console.log("Status Updated")
            if (fetchAllWidgets) {
                fetchAllWidgets();
            }
        }
        else { console.log(error) }

    }

    return (
        <div className={`${styles.body} ${selected ? styles.selectedCard : ""}`} onClick={handleCardClick}>
            {image && <Image src={image} alt={heading} />}
            <div className={styles.details}>
                <div>
                    <div className={styles.heading_eventsContainer}>
                        <div className={styles.templateHeading}>{heading}</div>
                        <div className={styles.eventsHeading}>
                            {fetchedEventsSize === 0 ? "No Events Added" : `${fetchedEventsSize} ${fetchedEventsSize === 1 ? "Event Added" : "Events Added"}`}</div>
                    </div>
                    <div className={styles.widgetTypeContainer}>
                        <WidgetIcon />
                        <div>{widgetType} Widget</div>
                    </div>
                </div>

                {/* {widgetType === "Sticky" ?
                    <div className={styles.widgetNumberContainerOne}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <InfoIcon />
                            <div className={styles.heading}>Can add maximum of 2 sticky widgets</div>
                        </div>
                        <div className={`${styles.widgetNumber} ${widgetNumber === 2 ? styles.filledTwo : ''}`}>
                            <div>
                                {widgetNumber}/2
                            </div>
                        </div>
                    </div> :
                    <div className={styles.widgetNumberContainerTwo}>
                        <TickIcon />
                        <div>1/1 Section widget selected.</div>
                    </div>} */}
                <div className={styles.status_btnContainer}>
                    <div className={styles.status_checkboxContainer}>
                        <div className={widgetStatus === "Draft" ? styles.draft : widgetStatus === "Active" ? styles.active : styles.inactive}>{widgetStatus}</div>
                        {(widgetStatus === "Active" || widgetStatus === "Inactive") && <input
                            id={widgetId}
                            type="checkbox"
                            checked={widgetStatus === "Active" ? true : false}
                            className={styles.checkboxInput}
                            onClick={(e) => e.stopPropagation()}
                            onChange={handleWidgetStatus}
                        />}
                        {(widgetStatus === "Active" || widgetStatus === "Inactive") && <label htmlFor={widgetId} className={styles.checkBox}></label>}
                    </div>
                    <div className={styles.btnContainer}>
                        <button className={styles.removeBtn} onClick={(e) => handleRemove(e)}>Remove</button>
                        <button className={styles.editBtn} onClick={(e) => handleRoute(e)}>Edit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function WidgetIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.0826 1.5559V3.56808H1.02172V1.5559H11.0826ZM11.0826 0.549805H1.02172C0.754885 0.549805 0.498982 0.655803 0.310303 0.844482C0.121624 1.03316 0.015625 1.28907 0.015625 1.5559V3.56808C0.015625 3.83492 0.121624 4.09082 0.310303 4.2795C0.498982 4.46818 0.754885 4.57418 1.02172 4.57418H11.0826C11.3495 4.57418 11.6054 4.46818 11.7941 4.2795C11.9827 4.09082 12.0887 3.83492 12.0887 3.56808V1.5559C12.0887 1.28907 11.9827 1.03316 11.7941 0.844482C11.6054 0.655803 11.3495 0.549805 11.0826 0.549805ZM3.0339 6.58636V11.6168H1.02172V6.58636H3.0339ZM3.0339 5.58027H1.02172C0.754885 5.58027 0.498982 5.68627 0.310303 5.87495C0.121624 6.06363 0.015625 6.31953 0.015625 6.58636V11.6168C0.015625 11.8837 0.121624 12.1396 0.310303 12.3282C0.498982 12.5169 0.754885 12.6229 1.02172 12.6229H3.0339C3.30074 12.6229 3.55664 12.5169 3.74532 12.3282C3.934 12.1396 4.04 11.8837 4.04 11.6168V6.58636C4.04 6.31953 3.934 6.06363 3.74532 5.87495C3.55664 5.68627 3.30074 5.58027 3.0339 5.58027ZM11.0826 6.58636V11.6168H6.05218V6.58636H11.0826ZM11.0826 5.58027H6.05218C5.78535 5.58027 5.52945 5.68627 5.34077 5.87495C5.15209 6.06363 5.04609 6.31953 5.04609 6.58636V11.6168C5.04609 11.8837 5.15209 12.1396 5.34077 12.3282C5.52945 12.5169 5.78535 12.6229 6.05218 12.6229H11.0826C11.3495 12.6229 11.6054 12.5169 11.7941 12.3282C11.9827 12.1396 12.0887 11.8837 12.0887 11.6168V6.58636C12.0887 6.31953 11.9827 6.06363 11.7941 5.87495C11.6054 5.68627 11.3495 5.58027 11.0826 5.58027Z" fill="#585871" />
        </svg>
    )
}
function TickIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.81884 0.454102C3.33274 0.454102 0.480469 3.30637 0.480469 6.79247C0.480469 10.2786 3.33274 13.1308 6.81884 13.1308C10.3049 13.1308 13.1572 10.2786 13.1572 6.79247C13.1572 3.30637 10.3049 0.454102 6.81884 0.454102ZM6.81884 11.8632C4.02362 11.8632 1.74814 9.58769 1.74814 6.79247C1.74814 3.99725 4.02362 1.72178 6.81884 1.72178C9.61406 1.72178 11.8895 3.99725 11.8895 6.79247C11.8895 9.58769 9.61406 11.8632 6.81884 11.8632ZM9.72815 3.99091L5.55117 8.1679L3.90953 6.5326L3.01582 7.42631L5.55117 9.96166L10.6219 4.89096L9.72815 3.99091Z" fill="#398E4A" />
        </svg>

    )
}

function InfoIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.41602 8.91699H6.58268V5.41699H5.41602V8.91699ZM5.99935 4.25033C6.16463 4.25033 6.30327 4.19433 6.41527 4.08233C6.52727 3.97033 6.58307 3.83188 6.58268 3.66699C6.58229 3.5021 6.52629 3.36366 6.41468 3.25166C6.30307 3.13966 6.16463 3.08366 5.99935 3.08366C5.83407 3.08366 5.69563 3.13966 5.58402 3.25166C5.4724 3.36366 5.4164 3.5021 5.41602 3.66699C5.41563 3.83188 5.47163 3.97052 5.58402 4.08291C5.6964 4.1953 5.83485 4.2511 5.99935 4.25033ZM5.99935 11.8337C5.1924 11.8337 4.43407 11.6804 3.72435 11.374C3.01463 11.0675 2.39727 10.652 1.87227 10.1274C1.34727 9.6028 0.931739 8.98544 0.625683 8.27532C0.319628 7.56521 0.166405 6.80688 0.166016 6.00033C0.165627 5.19377 0.31885 4.43544 0.625683 3.72533C0.932516 3.01521 1.34804 2.39785 1.87227 1.87324C2.39649 1.34863 3.01385 0.933103 3.72435 0.626659C4.43485 0.320214 5.19318 0.166992 5.99935 0.166992C6.80552 0.166992 7.56385 0.320214 8.27435 0.626659C8.98485 0.933103 9.60221 1.34863 10.1264 1.87324C10.6507 2.39785 11.0664 3.01521 11.3736 3.72533C11.6808 4.43544 11.8338 5.19377 11.8327 6.00033C11.8315 6.80688 11.6783 7.56521 11.373 8.27532C11.0677 8.98544 10.6522 9.6028 10.1264 10.1274C9.60066 10.652 8.98329 11.0677 8.27435 11.3746C7.5654 11.6814 6.80707 11.8344 5.99935 11.8337Z" fill="#52A8FF" />
        </svg>

    )
}
export default WidgetCard