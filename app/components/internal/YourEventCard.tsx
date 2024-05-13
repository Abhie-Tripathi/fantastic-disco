import React, { useState } from 'react';
import styles from './yourEventCard.style.module.css'
import UserIcon from '/public/user.svg';
import calendarIcon from '/public/calendar.svg';
import person1 from '@/public/person1.svg'
import place from '@/public/internal/place.svg'
import person2 from '@/public/person2.svg'
import Image from 'next/image';
import Link from 'next/link';
import ClockIcon from '/public/clock.svg'
import StatusChangeDropdown from '@/app/components/internal/eventdetail/statusDropdown';
import upArrow from '/public/internal/up_arrow.svg';
import { useTheme } from '@/context';
import UpVoteTag from '@/app/components/internal/coordinate/upVoteTag';

interface YourEventCardProps {
  eventId: number;
  eventName: string;
  eventCtas: string[];
  eventLocation: string;
  eventImage: string
  eventDate: string;
  eventCompany: string;
  handleModal: () => void;
  handleShortlistModal: () => void;
  handleRejectClick: () => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: {} = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

const YourEventCard: React.FC<YourEventCardProps> = ({ eventId, eventName, eventCtas, eventLocation, eventImage, eventDate, eventCompany, handleModal, handleShortlistModal, handleRejectClick }) => {
  const formattedDate = formatDate(eventDate);
  const {theme} = useTheme();
  const iconClass = theme === 'light' ? 'icons_light' : 'icon';

  const [voteStatus, setVoteStatus] = useState({
    Attending: false,
    Speaking: false,
    Sponsoring: false,
    Exhibiting: false,
  });

  const handleVoteClick = (item: keyof typeof voteStatus) => {
    setVoteStatus(prevState => ({
      ...prevState,
      [item]: !prevState[item]
    }));
  }

  const handleModalOpen = ()=>{
    handleModal()
  }

  const handleClickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }

  return (
    <div className={styles.card} onClick={handleModalOpen}>
    <div className={styles.topContainer} style={{display:"flex"}}>
      <div className={styles.leftContainer}>
        <div className='tablet_view mobile_view'>
          <StatusChangeDropdown label='' eventId={123} handleShortlistModal={handleShortlistModal} handleRejectClick={handleRejectClick} />
        </div>
        <div>
        <Image src={eventImage} alt="eventImage" width={238} height={192} className={styles.cardImg} />
        </div>
      </div>
      <div className={styles.cardDetails}>
        <div className={styles.eventNameComp}>
          <div>
            <div className={styles.eventName}>{eventName}</div>
            <div className={styles.company}>{eventCompany}</div>
          </div>
          {/* <div className={styles.tag} onClick={handleTest}>
            <Image src={ClockIcon} alt="clock" width={16} height={16} />
            <div>Pending</div>
          </div> */}
          <div className='desktop_view'>
            <StatusChangeDropdown label='' eventId={123} handleShortlistModal={handleShortlistModal} handleRejectClick={handleRejectClick} />
          </div>
        </div>
        <div className={styles.locationAndDateContainer}>
          <div className={styles.eventLocation}>
            <Image src={place} alt="locationIcon" width={24} height={24} />
            <div>{eventLocation}</div>
          </div>
          <div className={styles.eventLocation} style={{ display: "flex", gap: "5px" }}>
            <div className={styles.circle1}>7</div>
            <div>Days Event</div>
          </div>
          <div className={styles.eventDate}>
            <Image src={calendarIcon} alt="calendarIcon" width={14} height={14} />
            <div>{formattedDate}</div>
          </div>
        </div>
        <div className='tablet_view mobile_view'>
          <div style={{marginTop: "-50px"}}>
          <div className={styles.total_upvotes}>
            231
            <div style={{display:"flex", paddingTop: "5px"}}>
              <Image src={upArrow} alt="up"  width={16} height={16} className={'icons_light'} />
              &nbsp;Upvotes
            </div>
          </div>
          </div>
        </div>
        <div className='desktop_view'>
        <div style={{display:"flex", gap: "16px", flexWrap: "wrap", marginTop: "15px"}} onClick={handleClickEvent}>
          <div className={styles.total_upvotes}>
            231
            <div style={{display:"flex", paddingTop: "10px"}}>
              <Image src={upArrow} alt="up"  width={16} height={16} className={'icons_light'} />
              &nbsp;Upvotes
            </div>
          </div>
          <UpVoteTag type='Attending' status={voteStatus.Attending?'voted':''} voteCount={12} handleVoteClick={handleVoteClick} />
          <UpVoteTag type='Speaking' status={voteStatus.Speaking?'voted':''} voteCount={6} handleVoteClick={handleVoteClick} />
          <UpVoteTag type='Sponsoring' status={voteStatus.Sponsoring?'voted':''} voteCount={15} handleVoteClick={handleVoteClick} />
          <UpVoteTag type='Exhibiting' status={voteStatus.Exhibiting?'voted':''} voteCount={112} handleVoteClick={handleVoteClick} />
        </div>
        </div>
        {/* 
        <div className={styles.circles}>
          <div className={styles.circle} data-name="John Doe">
            <Image className={styles.image} src={person1} alt="person1" />
          </div>
          <div className={styles.circle} style={{ marginLeft: "-15px", width: "45px", height: "45px" }} data-name="Ravi Tripathi">
            RT
          </div>
          <div className={styles.circle} style={{ marginLeft: "-15px" }} data-name="Jane Smith">
            <Image className={styles.image} src={person2} alt="person2" />
          </div>
        </div>
        <div className={styles.eventDetails}>
          <div className={styles.detailContainer}>
            <Image src={UserIcon} alt="user" width={50} height={24} />
            <div>I&apos;m Interested</div>
          </div>
        </div>
         */}
      </div>
    </div>
      <div className={styles.bottomContainer}>
        <div className='tablet_view mobile_view'>
          <div style={{display:"flex", gap: "6px", paddingTop:"15px"}} onClick={handleClickEvent}>
            <UpVoteTag type='Attending' status={voteStatus.Attending?'voted':''} voteCount={12} handleVoteClick={handleVoteClick} />
            <UpVoteTag type='Speaking' status={voteStatus.Speaking?'voted':''} voteCount={6} handleVoteClick={handleVoteClick} />
            <UpVoteTag type='Sponsoring' status={voteStatus.Sponsoring?'voted':''} voteCount={15} handleVoteClick={handleVoteClick} />
            <UpVoteTag type='Exhibiting' status={voteStatus.Exhibiting?'voted':''} voteCount={112} handleVoteClick={handleVoteClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourEventCard;
