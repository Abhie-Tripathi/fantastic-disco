import React from 'react'
import styles from './eventlistcard.style.module.css'
import calendarIcon from "/public/calendar.svg";
import locationIcon from "/public/location.svg";
import placeholder from '/public/placeholder.png'
import Image from 'next/image';

interface CardProps {
    cardRadius?: number;
    cardBgColor?: string;
    eventNameColor?: string;
    eventNameSize?: number;
    dateFontSize?: number;
    locationFontSize?: number;
    btnBgColor?: string;
    btnFontColor?: string;
    btnBorderWidth?: number;
    btnBorderColor?: string;
    btnRadius?: number;
    btnFontSize?: number;
}

const EventListCard = ({ 
    cardRadius = 10,
    cardBgColor = '#6750a4',
    eventNameColor = '#000',
    eventNameSize = 16,
    dateFontSize = 12,
    locationFontSize = 12,
    btnBgColor = '#007bff',
    btnFontColor = '#fff',
    btnBorderWidth = 1,
    btnBorderColor = '#007bff',
    btnRadius = 5,
    btnFontSize = 14}: CardProps) => {
        return (
            <div
              className={styles.card}
              style={{
                borderRadius: `${cardRadius}px`,
                backgroundColor: cardBgColor,
              }}
            >
              <div className={styles.cardImg_container}>
                <Image
                  src={placeholder}
                  alt="eventImage"
                  width={238}
                  height={192}
                  className={styles.cardImg}
                />
              </div>
              <div className={styles.cardDetails}>
                <div className={styles.eventHeader}>
                  <div
                    className={styles.eventName}
                    style={{
                      color: eventNameColor,
                      fontSize: `${eventNameSize}px`,
                    }}
                  >
                    Event Name
                  </div>
                </div>
                <div className={styles.eventDesc}>Event Description</div>
                <div className={styles.location_date_btnContainer}>
                  <div className={styles.location_dateContainer}>
                    <div className={styles.eventLocation}>
                      <Image
                        src={locationIcon}
                        alt="locationIcon"
                        width={24}
                        height={24}
                      />
                      <div style={{ fontSize: `${locationFontSize}px` }}>Location</div>
                    </div>
                    <div className={styles.eventDate}>
                      <Image
                        src={calendarIcon}
                        alt="calendarIcon"
                        width={14}
                        height={14}
                      />
                      <div style={{ fontSize: `${dateFontSize}px` }}>Date</div>
                    </div>
                  </div>
                  <div
                    className={styles.registerBtn}
                    style={{
                      backgroundColor: btnBgColor,
                      color: btnFontColor,
                      borderWidth: `${btnBorderWidth}px`,
                      borderStyle : "solid",
                      borderColor: btnBorderColor,
                      borderRadius: `${btnRadius}px`,
                      fontSize: `${btnFontSize}px`,
                    }}
                  >
                    Register
                  </div>
                </div>
              </div>
            </div>
          );
}

export default EventListCard