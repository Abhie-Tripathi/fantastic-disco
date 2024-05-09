"use client";
import React, { useState } from "react";
import styles from "./eventcard.style.module.css";
import Image from "next/image";
import Circle from "/public/circle.svg";
import Festival from "/public/festival.svg";
import Refresh from "/public/Refresh.svg";
import { EventCardType } from "@/types/ListViewCard";
import TrendingIcon from "/public/trendingarrow.svg";
import LocatioinIcon from "/public/location.svg";
import { useTheme } from "@/context";

interface EventCardProps {
  data: EventCardType;
}

const EventCard = ({ data }: EventCardProps) => {
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [accordian, setAccordian] = useState(false);

  const formatDate = (dateString: any) => {
    const newDateString = dateString;
    var date = new Date(newDateString);

    // Array of days of the week and months
    var daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Get day of the week, month, and year
    var dayOfWeek = daysOfWeek[date.getDay()];
    var month = months[date.getMonth()];
    var day = date.getDate();
    var year = date.getFullYear();

    var formattedDate = dayOfWeek + "," + " " + month + " " + day + " " + year;

    // console.log("formatted_date__farah", formattedDate);
    return formattedDate;
  };

  const formattedStartDate = formatDate(data.startDate);
  const formattedEndDate = formatDate(data.endDate);

  return (
    <div
      className={`${styles.eventCard_container} ${
        theme === "light" ? styles.eventCard_container_light : ""
      }`}
      onClick={() => setAccordian(!accordian)}
    >
      <div className={styles.eventCard_header}>
        <div className={styles.title_dateContainer}>
          <div className={styles.eventTitle}>{data.eventName}</div>
          <div className={styles.eventDate}>
            {formattedStartDate} - {formattedEndDate}
            {}
          </div>
        </div>
        <div className={styles.minorDetailsContainer}>
          <div className={styles.eventOrganiser}>{data.organiser}</div>
          <div className={styles.eventFeeContainer}>
            <div className={styles.feeHeading}>ATTENDEE FEE</div>
            <div className={styles.fees}>${data.fee}</div>
          </div>
          <div className={styles.participantCountContainer}>
            <Image
              src={TrendingIcon}
              alt="arrow"
              height={15}
              width={15}
              className={iconClass}
            />
            <div className={styles.participantCount}>
              + {data.participantCount}
            </div>
            <div className={styles.participantHeading}>New Participants</div>
          </div>
        </div>
        <div className={styles.majorDetailsContainer}>
          <div className={styles.eventtype_categoryContainer}>
            <div className={styles.typeContainer}>
              <Image src={Festival} alt="fest" className={iconClass} />
              <div className={styles.eventType}>
                {data.eventType.toUpperCase()}
              </div>
              <div className={styles.eventFormat}>
                {data.format.toUpperCase()}
              </div>
            </div>
            <div className={styles.categoryContainer}>
              {data.categoryName.map((category: string, key) => (
                <div className={styles.category} key={key}>
                  {category}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.eventEditionContainer}>
            <div className={styles.editionHeading}>EDITION</div>
            <div className={styles.editionAnalysis}>
              <Image
                src={Refresh}
                alt="refresh"
                width={20}
                height={20}
                className={iconClass}
              />
              <div className={styles.editionFrequency}>{data.frequency}</div>
              <div className={styles.editionFrequencyData}>
                {data.forecastedFrequency}
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                <div className={styles.frequencyBorderOne}></div>
                <div className={styles.frequencyBorderTwo}></div>
                <div className={styles.frequencyBorderThree}></div>
                <div className={styles.frequencyBorderFour}></div>
              </div>
            </div>
          </div>
          <div className={styles.eventAreaContainer}>
            <div className={styles.zoneContainer}>
              <Image
                src={LocatioinIcon}
                width={17}
                height={17}
                alt="gps"
                className={iconClass}
              />
              <div className={styles.zone}>{data.eventZone.toUpperCase()}</div>
            </div>
            <div className={styles.eventVenueAddress}>
              {data.venueAddress}, {data.venueCountry}
            </div>
          </div>
          <div className={styles.predictedDataContainer}>
            <div className={styles.predictedData}>
              <div className={styles.predictedDataHeading}>Attendance</div>
              <div className={styles.predictedDataValue}>
                {data.estimatedAttendance}
              </div>
            </div>
            <div className={styles.predictedData}>
              <div className={styles.predictedDataHeading}>Exhibitors</div>
              <div className={styles.predictedDataValue}>
                {data.estimatedExhibitors}
              </div>
            </div>
          </div>
          <div className={styles.eventCardStats}>
            <div className={styles.rank_container}>
              <Image src={Circle} alt="circle" width={50} />
              <div className={styles.rank}>{data.stats.EIS}</div>
              <div className={styles.rank_title}>Eis</div>
            </div>
            <div className={styles.rank_container}>
              <Image src={Circle} alt="circle" width={50} />
              <div className={styles.rank}>{data.stats.influence}</div>
              <div className={styles.rank_title}>Influence</div>
            </div>
            <div className={styles.rank_container}>
              <Image src={Circle} alt="circle" width={50} />
              <div className={styles.rank}>{data.stats.international}</div>
              <div className={styles.rank_title}>Intl.</div>
            </div>
            <div className={styles.rank_container}>
              <Image src={Circle} alt="circle" width={50} />
              <div className={styles.rank}>{data.stats.local}</div>
              <div className={styles.rank_title}>Local</div>
            </div>
            <div className={styles.rank_container}>
              <Image src={Circle} alt="circle" width={50} />
              <div className={styles.rank}>{data.stats.regional}</div>
              <div className={styles.rank_title}>Regional</div>
            </div>
          </div>
        </div>
      </div>
      {accordian && (
        <div className={styles.eventAdditionalDetailsContainer}>
          <div className={styles.accordianContainer}>
            <div className={styles.additionaHeading}>KEYWORDS</div>
            {data.tags.keywords.map((keyword, key) => (
              <div className={styles.additionalDetail} key={key}>
                {keyword},{" "}
              </div>
            ))}
          </div>
          <div className={styles.accordianContainer}>
            <div className={styles.additionaHeading}>DEPARTMENT</div>
            {data.tags.department.map((department, key) => (
              <div className={styles.additionalDetail} key={key}>
                {department},{" "}
              </div>
            ))}
          </div>
          <div className={styles.accordianContainer}>
            <div className={styles.additionaHeading}>DESIGNATION</div>
            {data.tags.designation.map((designation, key) => (
              <div className={styles.additionalDetail} key={key}>
                {designation},{" "}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
