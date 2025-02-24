'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import GuestList from '@/app/components/TemplateViewsNew/Events/Manage/Guests/GuestList'
import RegisterModal from '@/app/components/TemplateViewsNew/Events/Manage/Guests/RegisterModal'
import useOutsideClick from '@/hooks/useOutsideClick'
import InviteGuest from '@/app/components/TemplateViewsNew/Events/Manage/Guests/InviteGuest'
import { useEventContext } from '@/context/eventcontext'
import GuestBar from '@/app/components/TemplateViewsNew/Events/Manage/Guests/GuestBar'
import RegisterIcon from '/public/widgetimages/manage_registerIcon.svg'
import InviteIcon from '/public/widgetimages/manage_inviteIcon.svg'
import GrpRegisterIcon from '/public/widgetimages/manage_grpRegisterIcon.svg'
import Image from 'next/image'
import { useIntendServices } from '@/services/geniservices/intendService'

const Page = () => {
  const { fetchEventData, eventId, fetchedEvent } = useEventContext();

  const [registerModal, setRegisterModal] = useState<boolean>(false);
  const [inviteGuestModal, setInviteGuestModal] = useState<boolean>(false);
  const [registerValue, setRegisterValue] = useState<boolean>(
    fetchedEvent?.registration && fetchedEvent?.registration === true ? true : false
    // true
  )

  const [statusModal, setStatusModal] = useState<boolean>(false)
  const registerModalRef = useOutsideClick(() => setRegisterModal(false))
  const inviteModalRef = useOutsideClick(() => setInviteGuestModal(false))
  const {getAllGuest, getGuestCount,error} = useIntendServices()
  const [goingGuests, setGoingGuests] = useState<number>(0)
  const [notgoingGuests, setNotgoingGuests] = useState<number>(0)
  const [pendingGuests, setPendingGuests] = useState<number>(0)
  const [followingGuests, setFollowingGuests] = useState<number>(0)
  const [waitlistGuests, setWaitlistGuests] = useState<number>(0)
  const [invitedGuests, setInvitedGuests] = useState<number>(0)

  const [sortBy, setSortBy] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [inputName, setInputName] = useState<string>("")
  const [guests, setGuests] = useState<any[]>(
    [
      // { name: "Walter White", email: "killguss@yahoo.com", status: "Going" }, { name: "Sheldon Cooper", email: "bazinga.buzz@gmail.com", status: "Waitlist" }, { name: "Joey Trib", email: "howyoudoin@gmail.com", status: "Not Going" }
    ]
  )

  useEffect(() => {
    setRegisterValue(fetchedEvent?.registration && fetchedEvent?.registration === true ? true : false)
    // console.log("data", fetchedEvent)
    fetchCounts()
  }, [fetchedEvent])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();

    // Get the day suffix
    const daySuffix =
      day === 1 || day === 21 || day === 31 ? "st" :
        day === 2 || day === 22 ? "nd" :
          day === 3 || day === 23 ? "rd" : "th";

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day}${daySuffix} ${month} ${year}`;
  };

  const [debouncedInputName, setDebouncedInputName] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInputName(inputName);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [inputName]);

  const fetchGuests = async () => {
    // let fetchUrl = `${baseUrl}/intend/users?eventId=${eventId}&sortType=asc`;
    // if (sortBy.length > 0) {
    //   fetchUrl += `&sortBy=${sortBy}`;
    // }

    // if (filterStatus.length > 0) {
    //   fetchUrl += `&status=${filterStatus}`;
    // }
    // if (debouncedInputName) {
    //   fetchUrl += `&name=${debouncedInputName}`;
    // }
    // const { data, error } = await myFetch(`${fetchUrl}`)
    try {
      const queryParams = new URLSearchParams({
        eventId: eventId,
        sortType: "asc",
        ...(sortBy.length > 0 && { sortBy }),
        ...(filterStatus.length > 0 && { status: filterStatus }),
        ...(debouncedInputName && { name: debouncedInputName })
      }).toString();
    
        const data:any = await getAllGuest(queryParams)
        if (error) {
          console.log("error is : ", error);
        } else {
          const fetchedGuests = data.users.map((user: any) => ({
            name: `${user.firstname} ${user.lastname}`,
            email: user.email,
            status: user.status,
            interestId: user.interestId,
            date: formatDate(user.created)
          }));
          setGuests(fetchedGuests);
        }
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGuests()
  }, [sortBy, filterStatus, debouncedInputName])

  useEffect(() => {
    if (registerModal || statusModal || inviteGuestModal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [registerModal, statusModal, inviteGuestModal])

  const fetchCounts = async () => {
    // let fetchUrl = `${baseUrl}/intend/users?eventId=${eventId}`;
    // const { data, error } = await myFetch(`${fetchUrl}`)
    try {
      const data:any = await getGuestCount(eventId)
      if (error) {
        console.log("error is : ", error);
      } else {
        data.stats.map((stat: any) => {
          switch (stat.status) {
            case "CONFIRMED":
              setGoingGuests(stat.count);
              break;
            case "REJECTED":
              setNotgoingGuests(stat.count);
              break;
            case "PENDING":
              setPendingGuests(stat.count);
              break;
            case "FOLLOWING":
              setFollowingGuests(stat.count);
              break;
            case "WAITLISTING":
              setWaitlistGuests(stat.count);
              break;
            case "INVITATION":
              setInvitedGuests(stat.count);
              break;
            default:
              break; // Handle any unexpected statuses
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={`${styles.body} ${registerModal || inviteGuestModal || statusModal ? styles.modalOpen : ""}`}>
      <div className={styles.btnContainer}>
        <button onClick={() => setInviteGuestModal(true)}>
          <Image src={InviteIcon} alt='invite' />
          Invite Guests
        </button>
        <button onClick={() => setRegisterModal(true)}>
          <Image src={RegisterIcon} alt='register' />
          <div className={styles.sub_headingContainer}>
            Registration
            <span>{registerValue ? "Open" : "Closed"}</span>
          </div>
        </button>
        <button className={styles.lockedBtn}>
          <Image src={GrpRegisterIcon} alt='grp' />
          <div className={styles.sub_headingContainer}>
            Group Registration
            <span>On<LockIcon /></span>
          </div>
        </button>
      </div>
      <div className={styles.guestBar}>
        <div className={styles.heading}>At a Glance</div>
        <GuestBar setFilterStatus={setFilterStatus} goingGuests={goingGuests} notgoingGuests={notgoingGuests} waitlistGuest={waitlistGuests} invitedGuests={invitedGuests} pendingGuests={pendingGuests} followingGuests={followingGuests} capacity={fetchedEvent?.capacity} />
      </div>
      <GuestList fetchGuests={fetchGuests} filterStatus={filterStatus} guests={guests} setSortBy={setSortBy} setFilterStatus={setFilterStatus} setInputName={setInputName} eventId={eventId} statusModal={statusModal} setStatusModal={setStatusModal} />

      {registerModal && <div className={styles.modal} ref={registerModalRef}>
        <RegisterModal fetchEventData={fetchEventData} setRegisterValue={setRegisterValue} registerValue={registerValue} setRegisterModal={setRegisterModal} eventId={eventId} />
      </div>}
      {inviteGuestModal && <div className={styles.modal} ref={inviteModalRef}>
        <InviteGuest fetchGuests={fetchGuests} setInviteGuestModal={setInviteGuestModal} eventId={eventId} />
      </div>}
    </div>
  )
}

export default Page

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.2913 14.0166L16.9497 15.5749L16.2163 16.7666L12.9163 14.7499V10.1666H14.2913V14.0166ZM21.1663 13.8333C21.1663 17.8758 17.8755 21.1666 13.833 21.1666C11.9813 21.1666 10.2947 20.4699 9.00217 19.3333H4.66634C3.61217 19.3333 2.83301 18.5541 2.83301 17.4999V9.24992C2.83301 8.22325 3.64884 7.45325 4.66634 7.41659V6.95825C4.66634 4.67575 6.50884 2.83325 8.79134 2.83325C10.9363 2.83325 12.678 4.47409 12.8797 6.57325C13.1913 6.52742 13.5122 6.49992 13.833 6.49992C17.8755 6.49992 21.1663 9.79075 21.1663 13.8333ZM6.49967 7.41659H11.083V6.73825C10.973 5.57409 9.98301 4.66659 8.79134 4.66659C7.52634 4.66659 6.49967 5.69325 6.49967 6.95825V7.41659ZM19.333 13.8333C19.333 10.7991 16.8672 8.33325 13.833 8.33325C10.7988 8.33325 8.33301 10.7991 8.33301 13.8333C8.33301 16.8674 10.7988 19.3333 13.833 19.3333C16.8672 19.3333 19.333 16.8674 19.333 13.8333Z" fill="#7d7d7d" />
    </svg>

  )
}