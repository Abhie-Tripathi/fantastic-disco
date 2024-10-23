'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import GuestList from '@/app/components/TemplateViewsNew/Events/Manage/Guests/GuestList'
import RegisterModal from '@/app/components/TemplateViewsNew/Events/Manage/Guests/RegisterModal'
import useOutsideClick from '@/hooks/useOutsideClick'
import InviteGuest from '@/app/components/TemplateViewsNew/Events/Manage/Guests/InviteGuest'
import { useEventContext } from '@/context/eventcontext'
import { baseUrl } from "@/constants";
import { myFetch } from "@/utils/myFetch";
import GuestBar from '@/app/components/TemplateViewsNew/Events/Manage/Guests/GuestBar'

const Page = () => {
  const { fetchEventData, eventId, fetchedEvent } = useEventContext();

  const [registerModal, setRegisterModal] = useState<boolean>(false);
  const [inviteGuestModal, setInviteGuestModal] = useState<boolean>(false);
  const [registerValue, setRegisterValue] = useState<boolean>(fetchedEvent?.registration && fetchedEvent?.registration === true ? true : false)

  const [statusModal, setStatusModal] = useState<boolean>(false)
  const registerModalRef = useOutsideClick(() => setRegisterModal(false))
  const inviteModalRef = useOutsideClick(() => setInviteGuestModal(false))

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
    let fetchUrl = `${baseUrl}/intend/users?eventId=${eventId}&sortType=asc`;

    if (sortBy.length > 0) {
      fetchUrl += `&sortBy=${sortBy}`;
    }

    if (filterStatus.length > 0) {
      fetchUrl += `&status=${filterStatus}`;
    }
    if (debouncedInputName) {
      fetchUrl += `&name=${debouncedInputName}`;
    }
    const { data, error } = await myFetch(`${fetchUrl}`)

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
  }

  return (
    <div className={`${styles.body} ${registerModal || inviteGuestModal || statusModal ? styles.modalOpen : ""}`}>
      <div className={styles.btnContainer}>
        <button onClick={() => setInviteGuestModal(true)}>
          <span className={styles.icon1}>I</span>
          Invite Guests
        </button>
        <button onClick={() => setRegisterModal(true)}>
          <span className={styles.icon2}>R</span>
          <div className={styles.sub_headingContainer}>
            Registration
            <span>{registerValue ? "Open" : "Closed"}</span>
          </div>
        </button>
        <button>
          <span className={styles.icon3}>GR</span>
          <div className={styles.sub_headingContainer}>
            Group Registration
            <span>On</span>
          </div>
        </button>
      </div>
      <div className={styles.guestBar}>
        <div className={styles.heading}>At a Glance</div>
        <GuestBar setFilterStatus={setFilterStatus} goingGuests={goingGuests} notgoingGuests={notgoingGuests} waitlistGuest={waitlistGuests} invitedGuests={invitedGuests} pendingGuests={pendingGuests} followingGuests={followingGuests} capacity={fetchedEvent?.capacity} />
      </div>
      <GuestList fetchGuests={fetchGuests} guests={guests} setSortBy={setSortBy} setFilterStatus={setFilterStatus} setInputName={setInputName} eventId={eventId} statusModal={statusModal} setStatusModal={setStatusModal} />

      {registerModal && <div className={styles.modal} ref={registerModalRef}>
        <RegisterModal fetchEventData={fetchEventData} setRegisterValue={setRegisterValue} registerValue={registerValue} setRegisterModal={setRegisterModal} eventId={eventId} />
      </div>}
      {inviteGuestModal && <div className={styles.modal} ref={inviteModalRef}>
        <InviteGuest />
      </div>}
    </div>
  )
}

export default Page