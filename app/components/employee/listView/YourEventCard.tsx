import React from "react";
import styles from "./yourEventCard.module.css";
import locationIcon from "/public/location.svg";
import rightArrowIcon from "/public/rightbigarrow.svg";
import calendarIcon from "/public/calendar.svg";
import person1 from "@/public/person1.svg";
import person2 from "@/public/person2.svg";
import ChatHeads from "./ChatHeads";
import Image from "next/image";
import Link from "next/link";
interface YourEventCardProps {
  eventId: number;
  eventName: string;
  eventCtas: string[];
  eventLocation: string;
  eventImage: string;
  eventDate: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: {} = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
};

const YourEventCard: React.FC<YourEventCardProps> = ({
  eventId,
  eventName,
  eventCtas,
  eventLocation,
  eventImage,
  eventDate,
}) => {
  const formattedDate = formatDate(eventDate);

  return (
    <Link href={`/employee/${eventId}`} className={styles.card}>
      <div className={styles.cardImg_container}>
        <Image
          src={eventImage}
          alt="eventImage"
          width={238}
          height={192}
          className={styles.cardImg}
        />
      </div>
      <div className={styles.cardDetails}>
        <div className={styles.eventHeader}>
          <div className={styles.eventName}>{eventName}</div>
          <div className='desktop_view' >
            <div className={styles.pills}>
            {eventCtas.map((item, index) => (
              <div key={index} className={styles.pill}>
                {item}
              </div>
            ))}
            </div>
          </div>
        </div>
        <div className={styles.locationAndDateContainer}>
          <div className={styles.eventLocation}>
            <Image
              src={locationIcon}
              alt="locationIcon"
              width={24}
              height={24}
            />
            <div>{eventLocation}</div>
          </div>
          <div className={styles.eventDate}>
            <Image
              src={calendarIcon}
              alt="calendarIcon"
              width={14}
              height={14}
            />
            <div>{formattedDate}</div>
          </div>
        </div>
        <div className={styles.card_footer}>
          <div className={styles.circles}>
            <div className={styles.circle} data-name="John Doe">
              <Image className={styles.image} src={person1} alt="person1" />
            </div>
            <div
              className={styles.circle}
              style={{ marginLeft: "-15px" }}
              data-name="Ravi Tripathi"
            >
              RT
            </div>
            <div
              className={styles.circle}
              style={{ marginLeft: "-15px" }}
              data-name="Jane Smith"
            >
              <Image className={styles.image} src={person2} alt="person2" />
            </div>
          </div>
          <div className='mobile_view' >
            <div className={styles.pills}>
              {eventCtas.map((item, index) => (
                <div key={index} className={styles.pill}>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className='desktop_view' >
            <div className={styles.eventDetails}>
              <div className={styles.detailContainer}>
                <div>View Details</div>
                <Image
                  src={rightArrowIcon}
                  alt="rightArrowIcon"
                  width={50}
                  height={24}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default YourEventCard;
