import React from 'react';
import styles from './yourEventCard.module.css';
import locationIcon from '/public/location.svg';
import rightArrowIcon from '/public/rightbigarrow.svg';
import calendarIcon from '/public/calendar.svg';
import ChatHeads from './ChatHeads';
import Image from 'next/image';
import Link from 'next/link';
interface YourEventCardProps {
  eventId:number;
  eventName: string;
  eventCtas: string[];
  eventLocation: string;
  eventImage: string
  eventDate: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options:{} = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

const YourEventCard: React.FC<YourEventCardProps> = ({ eventId, eventName, eventCtas, eventLocation, eventImage, eventDate }) => {
  const formattedDate = formatDate(eventDate);

  return (
    <div className={styles.card}>
      <Image src={eventImage} alt="eventImage" width={300} height={238} className={styles.cardImg} />
      <div className={styles.cardDetails}>
        <div style={{ position: "relative" }}>
          <div className={styles.eventName}>{eventName}</div>
          <div className={styles.pills}>
            {eventCtas.map((item, index) => (
              <div key={index} className={styles.pill}>{item}</div>
            ))}
          </div>
        </div>
        <div className={styles.locationAndDateContainer}>
          <div className={styles.eventLocation}>
            <Image src={locationIcon} alt="locationIcon" width={24} height={24} />
            <div>{eventLocation}</div>
          </div>
          <div className={styles.eventDate}>
            <Image src={calendarIcon} alt="calendarIcon" width={14} height={14} />
            <div>{formattedDate}</div>
          </div>
        </div>
        <ChatHeads data={["A", "B", "C"]} />
        <div className={styles.eventDetails}>
          <div className={styles.detailContainer}>
            <Link href={`/employee/${eventId}`}><div>View Details</div></Link>
            <Image src={rightArrowIcon} alt="rightArrowIcon" width={50} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourEventCard;
