import React from 'react';
import styles from './yourEventCard.style.module.css'
import UserIcon from '/public/user.svg';
import calendarIcon from '/public/calendar.svg';
import person1 from '@/public/person1.svg'
import place from '@/public/internal/place.svg'
import person2 from '@/public/person2.svg'
import Image from 'next/image';
import Link from 'next/link';
import ClockIcon from '/public/clock.svg'

interface YourEventCardProps {
  eventId: number;
  eventName: string;
  eventCtas: string[];
  eventLocation: string;
  eventImage: string
  eventDate: string;
  eventCompany: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: {} = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

const YourEventCard: React.FC<YourEventCardProps> = ({ eventId, eventName, eventCtas, eventLocation, eventImage, eventDate, eventCompany }) => {
  const formattedDate = formatDate(eventDate);

  return (
    <Link href={`/employee/${eventId}`} className={styles.card}>
      <Image src={eventImage} alt="eventImage" width={238} height={192} className={styles.cardImg} />
      <div className={styles.cardDetails}>
        <div className={styles.eventNameComp}>
          <div>
            <div className={styles.eventName}>{eventName}</div>
            <div className={styles.company}>{eventCompany}</div>
          </div>
          <div className={styles.tag}>
            <Image src={ClockIcon} alt="clock" width={16} height={16}/>
            <div>Pending</div>
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
            <div>I'm Interested</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default YourEventCard;
