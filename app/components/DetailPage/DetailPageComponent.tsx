'use client'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import styles from './detailpage.style.module.css'
import Image from 'next/image'
import ShareButtons from '@/app/components/DetailPage/ShareButtons'
import { generateEmailContent } from '@/hooks/useEmailBody'
import { useRouter } from 'next/navigation'
import ParticipationContainer from '@/app/components/DetailPage/ParticipationContainer'
import DateTimeContainer from '@/app/components/DetailPage/DateTimeContainer'
import RegisterForm from '@/app/components/DetailPage/RegisterForm'
import LocationContainer from '@/app/components/DetailPage/LocationContainer'
import DescriptionContainer from '@/app/components/DetailPage/DescriptionContainer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EventsType } from '@/types/alleventtype'
import SideEventCarousel from './SideEventCarousel'
import RegistrationClosed from './RegistrationClosed'
import confetti from 'canvas-confetti'
import LeafTwo from '/public/widgetimages/leaf2.png'
import SpeakerContainer from './SpeakerContainer'
import { usePathname } from 'next/navigation';
import LeafTheme from '../UI/LeafTheme'
import SnowfallTheme from '../UI/SnowfallTheme'
// import LinkIcon from '/public/link.svg'

interface EventProps {
    snowTheme: boolean;
    venue: string;
    latitude: number;
    eventFont: string;
    longitude: number;
    pageBgColor: string;
    pageGradient: string;
    confettiType: string;
    leavesTheme: boolean;
    registerBtnText: string;
    registerMessage: string;
    registerBtnColor: string;
    speaker: any[];
    participationMessage: string;
    participationType?: string;
    name: string;
    format: string;
    logoUrl: string;
    end_date: string;
    end_time: string;
    gmt_time: string;
    start_date: string;
    start_time: string;
    description: string;
    location_city: string;
    location_country: string;
    widgetId?: string;
    eventId: string;
    hashtags: string;
    childrenData: EventsType[]
    parentName: string;
    parentId: string;
    capacity: number;
    registration: boolean;
    approval: boolean;
    waitlisting: boolean;
    virtualLink: string
}

const Mapview = React.lazy(() => import('@/app/components/DetailPage/Mapview'));
const DetailPageComponent = ({ snowTheme, venue, latitude, eventFont, longitude, pageBgColor, registerBtnText, registerMessage, registerBtnColor, speaker, participationMessage, name, format, logoUrl, end_date, end_time, gmt_time,
    start_date, start_time, description, location_city, location_country, eventId, hashtags, participationType, childrenData, widgetId, parentName, parentId, capacity, registration, approval, waitlisting, pageGradient, confettiType, leavesTheme, virtualLink }: EventProps) => {
    const [isMobile, setIsMobile] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
    const [isRegistratonClosed, setRegistrationClosed] = useState(false)
    const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const confettiCanvasRefTwo = useRef<HTMLCanvasElement | null>(null);
    const pathname = usePathname();
    const pathName = pathname.split("/")[1];

    const fireConfetti = () => {
        if (confettiCanvasRef.current) {
            const myConfetti = confetti.create(confettiCanvasRef.current, { resize: true });
            myConfetti({
                particleCount: 2000,
                spread: 400,
                origin: { y: 1 },
                shapes: confettiType === "circle" ? ['circle'] : confettiType === "party" ? ['circle', 'square', 'star'] : ['star'],

            });
        }
        if (confettiCanvasRefTwo.current) {
            const myConfetti = confetti.create(confettiCanvasRefTwo.current, { resize: true });
            myConfetti({
                particleCount: 1000,
                spread: 200,
                origin: { y: 1 },
                shapes: confettiType === "circle" ? ['circle'] : confettiType === "party" ? ['circle', 'square', 'star'] : ['star'],
            });
        }
    };
    useEffect(() => {
        if (confettiType?.length > 0) {
            // Fire confetti immediately
            fireConfetti();
            // Set up the interval for firing every 4 seconds
            const interval = setInterval(fireConfetti, 4000);
            // Cleanup interval when confettiType changes or component unmounts
            return () => clearInterval(interval);
        }
    }, [confettiType]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 821);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (registerSuccess) {
            toast.success("Succesfully Registered for the event. Check your mail for more info")
        }
    }, [registerSuccess])

    // const urlVal = window.location.href

    const router = useRouter()
    const handleMainEventClick = () => {
        console.log("parent id :  ", parentId)
        if (parentId) {
            router.push(`/detailpage/${parentId}`)
        }
    }
    const console_url = process.env.NEXT_PUBLIC_CONSOLE_PAGE_DOMAIN

    return (
        <div className={`${styles.body} ${pageGradient ? styles[pageGradient] : ""}`}
            style={{ backgroundColor: pageBgColor }}
        >
            <div style={{ position: "absolute", top: "30px", left: "30px", cursor: "pointer", zIndex: 10 }}>
                {
                    pathName === "detailpage" &&
                    <button className={styles.backBtn} onClick={() => router.back()}>
                        <BackIcon />
                    </button>
                }
            </div>
            <canvas ref={confettiCanvasRef} className={styles.confettiCanvas}></canvas>
            <canvas ref={confettiCanvasRefTwo} className={styles.confettiCanvasTwo}></canvas>
            {leavesTheme && <div className={styles.themeContainer}>
                <LeafTheme leafCount={130} />
            </div>}
            {snowTheme && <div className={styles.themeContainer}>
                <SnowfallTheme />
            </div>}
            <ToastContainer />
            {parentName &&
                <div className={styles.mainEventLinkContainer}>
                    <div className={styles.linkIcon}><LinkIcon /></div>
                    <span>Linked to</span>
                    <div className={styles.linkline}></div>
                    <div className={styles.maineventName} onClick={handleMainEventClick} style={{ cursor: parentId ? "pointer" : "default" }}>{parentName.toUpperCase()}</div>
                </div>}
            {(participationType !== "HappyHours" && participationType !== "CocktailHours" && participationType !== "FoundersParty") && <div className={styles.participationContainer}><ParticipationContainer participationMessage={participationMessage} participationType={participationType ? participationType : "Speaker"} /></div>}

            {childrenData.length > 0 && <div className={styles.carousel}><SideEventCarousel childrenData={childrenData} /></div>}

            <div className={styles.detailsContainer}>
                <div className={styles.leftSection}>
                    <div className={styles.posterContainer}>
                        <Image className={styles.poster} src={logoUrl} alt='Poster'
                            width={296} height={290}
                            style={{ borderRadius: 20, objectFit: "cover" }} />
                    </div>
                    {hashtags && <div className={styles.hashtagsContainer}>
                        {hashtags?.split(",").map((tag, key) => (
                            <div className={styles.hashtag} key={key}>{tag}</div>
                        ))}
                    </div>}
                    <div className={styles.shareContainer}>
                        <div className={styles.heading}>Share</div>
                        <ShareButtons formTheme='light' copyIcon disabled={false} shareUrl={`${console_url}/detailpage/${eventId}`} />
                    </div>
                </div>
                <div className={styles.rightSection}>
                    {isMobile &&
                        <div className={styles.detailPageMobileView}>
                            {(participationType !== "HappyHours" && participationType !== "CocktailHours" && participationType !== "FoundersParty") && <div className={styles.mobile_participationContainer}><ParticipationContainer participationMessage={participationMessage} participationType={participationType ? participationType : "Speaker"} /></div>}
                        </div>
                    }
                    <textarea className={styles.eventName} disabled placeholder='Event Name' value={name} style={{ fontFamily: eventFont }} />
                    <div className={styles.dateTimeContainer}><DateTimeContainer endDate={end_date} startDate={start_date} endTime={end_time} startTime={start_time} timeZone={gmt_time} /></div>

                    <div className={styles.locationContainer}><LocationContainer eventFormat={format} cityName={location_city} countryName={location_country} virtualLink={virtualLink} /></div>

                    {
                        <div className={styles.resgitrationContainer}><RegisterForm setRegisterSuccess={setRegisterSuccess} registerBtnColor={registerBtnColor} registerBtnText={registerBtnText} registerMessage={registerMessage} eventId={eventId} widgetId={widgetId} capacity={capacity} registration={registration} approval={approval} waitlisting={waitlisting} end_date={end_date} start_date={start_date} /></div>
                    }

                    {isMobile &&
                        <div className={styles.detailPageMobileView}>
                            <div className={styles.mobile_shareContainer}>
                                <div className={styles.heading}>Share</div>
                                <ShareButtons formTheme='light' copyIcon hashtags={hashtags.split("")} disabled={true} shareUrl={`${console_url}/detailpage/${eventId}`} />
                            </div>
                        </div>
                    }
                    <div className={styles.descriptionContainer} ><DescriptionContainer description={description} /></div>
                    {speaker?.length > 0 && <div className={styles.speakerContainer}><SpeakerContainer speakerProfilesData={speaker} /></div>}
                    <div className={styles.map}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Mapview latitude={latitude}
                                venue={location_city}
                                longitude={longitude}
                                zoom={6} />
                        </Suspense>
                    </div>

                </div>
            </div>
            <div className={styles.line}></div>
            <footer className={styles.footer}>Powered by Eventgeni &copy; 2024</footer>
        </div>
        // </div>

    )
}

export default DetailPageComponent

function LinkIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.57467 12.0001C4.57467 10.4326 5.84884 9.15841 7.41634 9.15841H11.083V7.41675H7.41634C4.88634 7.41675 2.83301 9.47008 2.83301 12.0001C2.83301 14.5301 4.88634 16.5834 7.41634 16.5834H11.083V14.8417H7.41634C5.84884 14.8417 4.57467 13.5676 4.57467 12.0001ZM8.33301 12.9167H15.6663V11.0834H8.33301V12.9167ZM16.583 7.41675H12.9163V9.15841H16.583C18.1505 9.15841 19.4247 10.4326 19.4247 12.0001C19.4247 13.5676 18.1505 14.8417 16.583 14.8417H12.9163V16.5834H16.583C19.113 16.5834 21.1663 14.5301 21.1663 12.0001C21.1663 9.47008 19.113 7.41675 16.583 7.41675Z" fill="#0062D1" />
        </svg>
    )
}

function BackIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            style={{ marginRight: "8px" }}
        >
            <path
                fillRule="evenodd"
                d="M11.354 1.354a.5.5 0 0 1 0 .707L5.707 7.707H14.5a.5.5 0 0 1 0 1H5.707l5.647 5.646a.5.5 0 0 1-.708.708l-6.5-6.5a.5.5 0 0 1 0-.708l6.5-6.5a.5.5 0 0 1 .708 0z"
            />
        </svg>
    );
}