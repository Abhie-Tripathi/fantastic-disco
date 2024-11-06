import React, { useEffect, useState } from 'react'
import styles from './overview.style.module.css'
import EventSmallDetailView from './EventSmallDetailView'
import ShareButtons from '@/app/components/DetailPage/ShareButtons'
import { showToast } from "@/utils/showToast";
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/constants';
import RegisterIcon from '/public/widgetimages/manage_registerIcon.svg'
import WaitlistIcon from '/public/widgetimages/manage_waitlistIcon.svg'
import ApprovalIcon from '/public/widgetimages/manage_approvalIcon.svg'
import CapacityIcon from '/public/widgetimages/manage_capacityIcon.svg'
import Image from 'next/image';

interface Props {
  format?: string;
  registration?: boolean;
  approval?: boolean;
  waitlist?: boolean;
  capacity?: number;
  eventId: string;
  imageUrl?: string;
  eventName?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  hashtags?: string;
  timeZone?: string;
  pageBgColor?: string;
  pageGradient?: string;
  leavesTheme?: boolean;
  snowTheme?: boolean;
  confettiType?: string;
  eventFont?: string;
  locationCity?: string;
  virtualLink? : string;
  locationCountry?: string;
  participationType?: string;
  isPresentinWidget?: boolean;
  setAddEventModal: (value: boolean) => void
  setDeleteModal: (value: boolean) => void;
  setDeleteModalTwo: (value: boolean) => void;
  isPastEvent: boolean;
}

const Overview = ({virtualLink, format, leavesTheme, snowTheme, eventId, imageUrl, eventName, startDate, endDate, startTime, endTime, hashtags, timeZone, pageBgColor, pageGradient, confettiType, eventFont, locationCity, locationCountry, setAddEventModal, participationType, setDeleteModal, setDeleteModalTwo, isPresentinWidget, registration, waitlist, capacity, approval, isPastEvent }: Props) => {
  const console_url = process.env.NEXT_PUBLIC_CONSOLE_PAGE_DOMAIN

  const [guestCount, setGuestCount] = useState<number>(0)

  const [goingGuests, setGoingGuests] = useState<number>(0)
  // const [pendingGuests, setPendingGuests] = useState<number>(0)
  const [followingGuests, setFollowingGuests] = useState<number>(0)
  // const [waitlistGuests, setWaitlistGuests] = useState<number>(0)
  const [invitedGuests, setInvitedGuests] = useState<number>(0)

  const handleCopy = () => {
    const textToCopy = `${console_url}/detailpage/${eventId}`;
    navigator.clipboard.writeText(textToCopy);
    showToast("success", "Link copied")
  };

  const fetchGuests = async () => {
    const { data, error } = await myFetch(`${baseUrl}/intend/users?eventId=${eventId}`)
    if (error) {
      console.log("error is : ", error)
    } else {
      setGuestCount(data?.totalUser)
    }
  }
  useEffect(() => {
    fetchGuests()
    fetchCounts()
  }, [])
  const fetchCounts = async () => {
    let fetchUrl = `${baseUrl}/intend/users?eventId=${eventId}`;
    const { data, error } = await myFetch(`${fetchUrl}`)
    if (error) {
      console.log("error is : ", error);
    } else {
      data.stats.map((stat: any) => {
        switch (stat.status) {
          case "CONFIRMED":
            setGoingGuests(stat.count);
            break;
          case "FOLLOWING":
            setFollowingGuests(stat.count);
            break;
          case "INVITATION":
            setInvitedGuests(stat.count);
            break;
          default:
            break; // Handle any unexpected statuses
        }
      });
    }
  }
  return (
    <div className={styles.body}>
      <div className={styles.eventDetailView}>
        <div className={styles.viewContainer} onClick={() => setAddEventModal(true)}>
          <EventSmallDetailView virtualLink={virtualLink} snowTheme={snowTheme} leavesTheme={leavesTheme} participationType={participationType} eventId={eventId} imageUrl={imageUrl} eventName={eventName} startDate={startDate} endDate={endDate} startTime={startTime} endTime={endTime} hashtags={hashtags} timeZone={timeZone} pageBgColor={pageBgColor} pageGradient={pageGradient} confettiType={confettiType} eventFont={eventFont} locationCity={locationCity} locationCountry={locationCountry} format={format}  />
        </div>
        <div className={styles.eventDetailContainer}>
          {!isPastEvent && <div className={styles.share_leadsContainer}>
            <div className={styles.shareContainer}>
              <div className={styles.shareHeading}>Share Event</div>
              <ShareButtons formTheme='light' copyIcon={false} disabled={false} shareUrl={`${console_url}/detailpage/${eventId}`} />
              <div className={styles.inputContainer}>
                <input type="text" disabled value={`${console_url}/detailpage/${eventId}`} />
                <button onClick={handleCopy}>Copy</button>
              </div>
            </div>
            <div className={styles.leadsContainer}>
              <UserIcon />
              <span>{guestCount} Interests</span>
            </div>
          </div>}
          {isPastEvent &&
            <div className={styles.pastLeadsContainer}>
              <div className={styles.countContainerTwo}>
                <span><span className={`${styles.icon3} ${styles.icon}`}>{guestCount}</span> Interests</span>
                <span><span className={`${styles.icon2} ${styles.icon}`}>{goingGuests}</span>Attended</span>
              </div>
              <div className={styles.countContainerTwo}>
                <span><span className={`${styles.icon1} ${styles.icon}`}>{followingGuests}</span> Followed</span>
                <span><span className={`${styles.icon4} ${styles.icon}`}>{invitedGuests}</span> Invited</span>
              </div>
            </div>}
          <div className={styles.valuesContainer}>
            <div className={styles.valueContainer}>
              <div><span className={styles.icon}><Image src={RegisterIcon} alt='register' /></span>Registration : <span>{registration === true ? "ON" : "OFF"}</span></div>
              <div><span className={styles.icon}><Image src={ApprovalIcon} alt='approval' /></span>Approval : <span>{approval === true ? "ON" : "OFF"}</span></div>
            </div>
            <div className={styles.valueContainer}>
              <div><span className={styles.icon}><Image src={WaitlistIcon} alt='waitlist' /></span>Waitlist : <span>{waitlist === true ? "ON" : "OFF"}</span></div>
              <div><span className={styles.icon}><Image src={CapacityIcon} alt='capacity' /></span>Capacity : <span>{capacity === -1 ? "Unlimited" : capacity}</span></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Overview

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" fill="#6750a4" /></svg>
  )
}