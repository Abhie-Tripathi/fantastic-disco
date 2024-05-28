"use client";
import React, { useState, useEffect } from "react";
import styles from "./monthCalendar.module.css";
import { log } from "console";
import EventCard from "@/app/components/EventCard";
import { useTheme } from "@/context";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import Image from "next/image";
import LeftArrow from "/public/leftArrow.svg";
import RightArrow from "/public/rightArrow.svg";
import CalendarList from "./CalendarList";

interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  tags: string[];
  logo: string;
  imageUrl: string;
  duration: number;
  background: string;
  top: string;
}

interface Event2 {
  id: number;
  name: string;
  startDate: string;
  enddate: string;
  background?: string;
  top?: string;
  duration?: number;
}

interface DateWithEvent {
  date: Date;
  events: Event[];
}

const days = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const months = [
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

const events: Event[] = [
  {
    id: 1,
    name: "HORN Ok Food Festival",
    description:
      "A food fest including a variety of drinks and food that you will savour for your entire life",
    location: "Delhi",
    startDate: "3/15/2024",
    endDate: "3/16/2024",
    tags: ["food", "festival", "drinks", "gathering", "hornok", "horn", "fest"],
    logo: "https://1000logos.net/wp-content/uploads/2021/11/logo-Paramount.png",
    imageUrl:
      "https://i.pinimg.com/originals/0f/ab/ea/0fabead80613002cfed665309f3dd6cc.jpg",
    duration: 2,
    background: "rgb(249 196 100)",
    top: "55%",
  },
  {
    id: 2,
    name: "Great Indian Food Festival",
    description:
      "A food fest including a variety of drinks and food that you will savour for your entire life",
    location: "Gurgaon",
    startDate: "3/11/2024",
    endDate: "3/12/2024",
    tags: [
      "food",
      "festival",
      "drinks",
      "gathering",
      "great indian food festival",
      "fest",
    ],
    logo: "https://1000logos.net/wp-content/uploads/2021/11/logo-Paramount.png",
    imageUrl:
      "https://miro.medium.com/v2/resize:fit:1400/1*nmMagIDyextUFs5J9aGnPw.jpeg",
    duration: 2,
    background: "rgb(183 235 255)",
    top: "55%",
  },
  {
    id: 3,
    name: "Painting Fest",
    description:
      "A area filled with people and canvas boards to paint on. Come and paint your imagination",
    location: "Ney York",
    startDate: "3/9/2024",
    endDate: "3/12/2024",
    tags: ["paint", "painting", "colors", "color", "fest"],
    logo: "https://1000logos.net/wp-content/uploads/2021/11/logo-Paramount.png",
    imageUrl:
      "https://palmbeach.floridaweekly.com/wp-content/uploads/images/2023-02-23/27p1.jpg",
    duration: 3,
    background: "rgb(211 183 248)",
    top: "35%",
  },
  {
    id: 4,
    name: "Tomartina Tomato Fest",
    description:
      "A annual tomato fest in which streets get filled with tomatoes and people throw tomatoes at each other for fun",
    location: "Italy",
    startDate: "3/12/2024",
    endDate: "3/18/2024",
    tags: ["tomato", "tomartina", "holi", "gathering", "fight"],
    logo: "https://1000logos.net/wp-content/uploads/2021/11/logo-Paramount.png",
    imageUrl:
      "https://images.ladepeche.fr/api/v1/images/view/63106cfdef5bdc39f1680c68/large/image.jpg?v=1",
    duration: 7,
    background: "rgb(149 126 100)",
    top: "75%",
  },
  {
    id: 5,
    name: "Film Festival",
    description:
      "A annual film festival where people from all over India send in there directed films and they are shown in this festival on the large screen",
    location: "Gurgaon",
    startDate: "3/15/2024",
    endDate: "3/18/2024",
    tags: [
      "movie",
      "films",
      "movies",
      "fest",
      "festival",
      "acting",
      "direction",
      "film",
    ],
    logo: "https://1000logos.net/wp-content/uploads/2021/11/logo-Paramount.png",
    imageUrl:
      "https://cdn.choosechicago.com/uploads/2019/06/chicago-film-festival-1800x900.jpg",
    duration: 4,
    background: "rgb(190 290 155)",
    top: "35%",
  },
];

function generateMonthArray(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayIndex = firstDayOfMonth.getDay();
  const monthArray = [];
  let currentDate = new Date(firstDayOfMonth);
  if (firstDayIndex === 1) {
    monthArray.push("");
  } else {
    for (let i = 0; i < firstDayIndex; i++) {
      monthArray.push("");
    }
  }

  for (let day = 1; day <= daysInMonth; day++) {
    monthArray.push(new Date(year, month - 1, day, 5, 30, 0, 0));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return monthArray;
}

/*
const [year, setYear] = useState<number>(2024);
const [month, setMonth] = useState<number>(3);
const monthDatesArray = generateMonthArray(year, month);
const datesWithEvents = monthDatesArray.map((date: any) => {
  if (date === "") return "";
  else {
    const filteredEvents = events.filter((event) => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);
      return eventStartDate <= date && date <= eventEndDate;
    });

    return { date: date, events: filteredEvents };
  }
});
*/

function formatDateString(dateString: any) {
  const [month, day, year] = dateString.split("/");

  // Add leading zeros to day and month if necessary
  const formattedDay = day.padStart(2, "0");
  const formattedMonth = month.padStart(2, "0");

  // Return the rearranged and formatted date string
  return `${formattedDay}/${formattedMonth}/${year}`;
}

function formatDate(dateString: any) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDurationInDays(startDate: any, endDate: any) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const differenceInMilliseconds = Math.abs(end - start);

  const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

  return differenceInDays+1;
}

const MonthCalendar: React.FC = () => {
  const { theme } = useTheme();
  const [monthEvents, setMonthEvents] = useState<Event2[]>();

  const [year, setYear] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [datesWithEvents, setDatesWithEvents] = useState<any>();

  const fetchEventsData = async() => {
    try {
      let apiMonth = '';
      if(month==0) return;
      else {
        if(month<9){
          apiMonth = '0'+month;
        }else
          apiMonth = month.toString();
      }
      const apiUrl = `${baseUrl}/event/search?groupBy=${year}-${apiMonth}-01,${year}-${apiMonth}-31`;
      const apiData = await myFetch(apiUrl, {
          method: "GET",
          headers: headers,
      });
      if(apiData.data) {
        setMonthEvents(apiData.data);
        // setupCalendar();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const setupCalendar = () => {
    const monthDatesArray = generateMonthArray(year, month);
    var datesWithEventsTmp2 =  monthDatesArray.map((date: any) => {
      if (date === "") return "";
      else {
        let c_date = formatDate(date);
        var filteredEvents = [];
        if(monthEvents && monthEvents[c_date] && monthEvents[c_date].event.length > 0){
          filteredEvents = monthEvents[c_date].event.sort((a, b) => {
            return new Date(a.enddate) - new Date(b.enddate);
          });
          filteredEvents.map((event, index)=>{
            if(index==0){
              event['background'] = "rgb(249 196 100)";
              event['top']= "35%";
            }else if(index == 1){
              event['background'] = "rgb(190 290 155)";
              event['top']= "52.5%";
            }else{
              event['background'] = "rgb(183 235 255)";
              event['top']= "70%";
            }
            event['duration']= getDurationInDays(event['startDate'], event['endDate']);
          })
        }

        return { date: date, events: filteredEvents, totalEvent: monthEvents[c_date]?.totalEvent };
      }
    });

    setDatesWithEvents(datesWithEventsTmp2);
  }

  const prevButtonHandler = () => {
    if(month > 1)
      setMonth(month-1);
  }

  const nextButtonHandler = () => {
    if(month < 12)
      setMonth(month+1);
  }

  const [eventListDate, setEventListDate] = useState<string>('');

  const handleListOpen = (date: Date) => {
    setEventListDate(formatDate(date));
  }

  useEffect(() => {
    if(month > 0)
      setupCalendar();
  }, [monthEvents]);

  useEffect(() => {
    var date = new Date();
    setMonth(date.getMonth()+1);
    setYear(date.getFullYear());
  }, []);

  useEffect(() => {
    if(month > 0) {
      fetchEventsData();
    }
  }, [month]);

  return (
  <>
    <div className={styles.control_buttons_container}>
      <button onClick={prevButtonHandler}>
        <Image src={LeftArrow} width={28} alt="leftarrow" />
      </button>
      <div>
        {month > 0 &&
          months[month-1] + ' ' + year
        }
      </div>
      <button onClick={nextButtonHandler}>
        <Image src={RightArrow} width={28} alt="rightarrow" />
      </button>
    </div>
    <div className={styles.container}>
      <div className={styles.dayCards_container}>
        {days.map((day) => (
          <div key={day} className={styles.dayCard}>
            <div className={styles.day_title}>{day}</div>
          </div>
        ))}
      </div>
      <div className={styles.monthCards_container}>
        {/* FIRST APPROACH */}

        {/* {datesWithEvents.map((dateWithEvent, index) => {
          if (dateWithEvent == "") {
            return <div className={styles.emptyCard}></div>;
          } else {
            let count = dateWithEvent.events.length;
            return (
              <div className={styles.monthCard}>
                <div className={styles.monthCard_dayno}>
                  {dateWithEvent.date.getDate()}
                  {`idx=${index}`}
                </div>
                {dateWithEvent.events.map((event) => {
                  const formattedDate = formatDateString(event.startDate);
                  if (
                    formattedDate == dateWithEvent.date.toLocaleDateString()
                  ) {
                    count = count - 1;
                    let width = "85%";
                    if (event.duration > 0) {
                      event.duration == 2
                        ? (width = "200%")
                        : event.duration == 3
                        ? (width = "310%")
                        : "85%";
                    }

                    return (
                      <>
                        <div
                          className={styles.event}
                          style={{
                            width: `${width}`,
                            top: `${40 + count * 20}%`,
                            backgroundColor: event.background,
                            color: "black",
                            fontSize: "12px",
                          }}
                        >
                          {event.name}
                        </div>
                      </>
                    );
                  }
                })}
              </div>
            );
          }
        })} */}

        {/* SECOND APPROACH */}

        {/* <>
           {datesWithEvents.map((dateWithEvent, index) => {
            if (dateWithEvent === "") {
              return <div className={styles.emptyCard} key={index}></div>;
            } else {
              let count = dateWithEvent?.events?.length;
              const eventCards = dateWithEvent.events.map(
                (event, eventIndex) => {
                  count = count - 1;
                  return (
                    <EventCard
                      key={eventIndex}
                      // top={event.top}
                      top={
                        count > 0
                          ? `${35 + count * 20}%`
                          : `${35 + count * 40}%`
                      }
                      background={event.background}
                      name={event.name}

                    />
                  );
                }
              );
              return (
                <div className={`${styles.monthCard} ${theme === 'light' && styles.monthCard_light}`} key={index}>
                  <div className={styles.monthCard_dayno}>
                    {dateWithEvent.date.getDate()}
                  </div>
                  {eventCards}
                </div>
              );
            }
          })}
        </>  */}

        {/* THIRD APPROACH */}
        {datesWithEvents && datesWithEvents.map((dateWithEvent, index) => {
          if (dateWithEvent === "") {
            return <div className={styles.emptyCard} key={index}></div>;
          } else {
            const currentDate = dateWithEvent.date;
            let count = dateWithEvent.events.length;

            const eventCards = dateWithEvent.events.map((event, eventIndex) => {
              const eventStartDate = new Date(event.startDate);
              const eventEndDate = new Date(event.endDate);

              // Get Next day events
              const nextDay = eventIndex + 1;
              // console.log("next_day", currentDate, eventStartDate, eventEndDate, event.duration, dateWithEvent.totalEvent);
              if (currentDate.getTime() === eventStartDate.getTime()) {
                count = count - 1;
                console.log("COUNT", count, event.name, event.startDate);
                if(event.duration === 1){
                  // -------------- CHECKING FOR ONE DAY EVENT --------------------
                  return (
                    <EventCard
                      styleClass={"stylesClass_A"}
                      key={eventIndex}
                      top={event.top}
                      background={event.background}
                      l
                      name={event.name}
                      singleDayEvent={true}
                    />
                  );
                }
                if (event.duration >= 2) {
                  //  ------------------------------CHECKING EVENT DAY IS SATURDAY FOR EVENT CARD STRIP---------------
                  if (currentDate.getDay() === 6) {
                    return (
                      <EventCard
                        styleClass={"stylesClass_A"}
                        key={eventIndex}
                        top={event.top}
                        background={event.background}
                        l
                        name={event.name}
                      />
                    );
                  } else {
                    console.log(
                      "countt-------------------------------------------1",
                      count,
                      event.name
                    );

                    return (
                      <EventCard
                        styleClass={"stylesClass_B"}
                        key={eventIndex}
                        top={event.top}
                        background={event.background}
                        name={event.name}
                      />
                    );
                  }
                } else {
                  // Render full event card on the start date
                  console.log(
                    "countt-------------------------------------------2",
                    count,
                    event.name
                  );

                  return (
                    <EventCard
                      styleClass={"styleClass_A"}
                      key={eventIndex}
                      top={event.top}
                      background={event.background}
                      name={event.name}
                    />
                  );
                }
              } else if (
                currentDate.getTime() > eventStartDate.getTime() &&
                currentDate.getTime() <= eventEndDate.getTime()
              ) {
                // Render only the color strip for subsequent days
                if (currentDate.getDay() === 6) {
                  console.log(
                    "countt-------------------------------------------3",
                    count,
                    event.name
                  );
                  //  ------------------------------CHECKING EVENT DAY IS SATURDAY FOR COLOR STRIP---------------
                  return (
                    <div
                      key={eventIndex}
                      className={styles.colorStrip}
                      style={{
                        backgroundColor: event.background,
                        top: event.top,
                      }}
                    ></div>
                  );
                } else if (currentDate.getTime() == eventEndDate.getTime()) {
                  // --------------------- CKECKING FOR EVENT END DAY ---------------------

                  console.log(
                    "countt-------------------------------------------4",
                    count,
                    event.name
                  );

                  return (
                    <div
                      key={eventIndex}
                      className={styles.colorStrip}
                      style={{
                        backgroundColor: event.background,
                        top: event.top,
                        // top: `${
                        //   count > 0
                        //     ? `${20 + count * 20}%`
                        //     : `${35 + count * 40}%`
                        // }`,
                        width: "100%",
                      }}
                    ></div>
                    // <>event end day</>
                  );
                } else {
                  console.log(
                    "countt-------------------------------------------5",
                    count
                  );

                  return (
                    <div
                      key={eventIndex}
                      className={styles.colorStrip}
                      style={{
                        backgroundColor: event.background,
                        top: event.top,
                        width: "120%",
                      }}
                    ></div>
                  );
                }
              } else {
                return null;
              }
            });

            return (
              <div
                className={`${styles.monthCard} ${
                  theme === "light" && styles.monthCard_light
                }`}
                key={index}
              >
                <div className={styles.monthCard_dayno}>
                  {currentDate.getDate()}
                </div>
                {eventCards}
                { dateWithEvent.totalEvent > 3 &&
                  <div onClick={()=>handleListOpen(currentDate)} style={{position:"absolute", top:"85%", cursor:"pointer"}}>+{dateWithEvent.totalEvent - 3} more</div>
                }
              </div>
            );
          }
        })}
      </div>
    </div>
    <CalendarList filters={''} startDate={eventListDate} endDate={eventListDate}/>
  </>
  );
};

export default MonthCalendar;
