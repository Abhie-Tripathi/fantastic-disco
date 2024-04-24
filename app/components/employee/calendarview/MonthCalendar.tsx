import React, { useState } from "react";
import styles from "./monthCalendar.module.css";
<<<<<<< HEAD
import { log } from "console";
import EmptyCard from "@/app/components/EmptyCard";
import EventCard from "@/app/components/EventCard";

=======
>>>>>>> d737f804ccb3e8fb3d2f099735b5183159f387b9
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
}

<<<<<<< HEAD
interface DateWithEvent {
  date: Date;
  events: Event[];
}
=======
// interface DateWithEvent {
//     date: Date;
//     events: Event[];
// }
>>>>>>> d737f804ccb3e8fb3d2f099735b5183159f387b9
const days = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const events: Event[] = [
  {
    id: 1,
    name: "HORN Ok Food Festival",
    description:
      "A food fest including a variety of drinks and food that you will savour for your entire life",
    location: "Delhi",
    startDate: "3/20/2024",
    endDate: "3/21/2024",
    tags: ["food", "festival", "drinks", "gathering", "hornok", "horn", "fest"],
    logo: "https://1000logos.net/wp-content/uploads/2021/11/logo-Paramount.png",
    imageUrl:
      "https://i.pinimg.com/originals/0f/ab/ea/0fabead80613002cfed665309f3dd6cc.jpg",
    duration: 2,
    background: "rgb(249 196 200)",
  },
  {
    id: 2,
    name: "Great Indian Food Festival",
    description:
      "A food fest including a variety of drinks and food that you will savour for your entire life",
    location: "Gurgaon",
    startDate: "3/14/2024",
    endDate: "3/16/2024",
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
  },
  {
    id: 3,
    name: "Painting Fest",
    description:
      "A area filled with people and canvas boards to paint on. Come and paint your imagination",
    location: "Ney York",
    startDate: "3/10/2024",
    endDate: "3/12/2024",
    tags: ["paint", "painting", "colors", "color", "fest"],
    logo: "https://1000logos.net/wp-content/uploads/2021/11/logo-Paramount.png",
    imageUrl:
      "https://palmbeach.floridaweekly.com/wp-content/uploads/images/2023-02-23/27p1.jpg",
    duration: 2,
    background: "rgb(211 183 248)",
  },
  {
    id: 4,
    name: "Tomartina Tomato Fest",
    description:
      "A annual tomato fest in which streets get filled with tomatoes and people throw tomatoes at each other for fun",
    location: "Italy",
    startDate: "3/7/2024",
    endDate: "3/8/2024",
    tags: ["tomato", "tomartina", "holi", "gathering", "fight"],
    logo: "https://1000logos.net/wp-content/uploads/2021/11/logo-Paramount.png",
    imageUrl:
      "https://images.ladepeche.fr/api/v1/images/view/63106cfdef5bdc39f1680c68/large/image.jpg?v=1",
    duration: 2,
    background: "rgb(149 126 100)",
  },
  {
    id: 5,
    name: "Film Festival",
    description:
      "A annual film festival where people from all over India send in there directed films and they are shown in this festival on the large screen",
    location: "Gurgaon",
    startDate: "3/13/2024",
    endDate: "3/15/2024",
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
    duration: 5,
    background: "rgb(190 290 155)",
  },
];

function generateMonthArray(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // console.log("first_day", daysInMonth);
  // console.log("last_day", lastDayOfMonth);

  const firstDayIndex = firstDayOfMonth.getDay();

  const monthArray = [];

  let currentDate = new Date(firstDayOfMonth);
  // console.log("first_day_index", firstDayIndex);

  if (firstDayIndex === 1) {
    monthArray.push("");
  } else {
    for (let i = 0; i < firstDayIndex; i++) {
      monthArray.push("");
    }
  }
<<<<<<< HEAD

  for (let day = 1; day <= daysInMonth; day++) {
    monthArray.push(new Date(year, month - 1, day));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return monthArray;
}

const year = 2024;
const month = 3;
const monthDatesArray = generateMonthArray(year, month);
// console.log("monthDatesArray", monthDatesArray);

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

function formatDateString(dateString: any) {
  const [month, day, year] = dateString.split("/");

  // Add leading zeros to day and month if necessary
  const formattedDay = day.padStart(2, "0");
  const formattedMonth = month.padStart(2, "0");

  // Return the rearranged and formatted date string
  return `${formattedDay}/${formattedMonth}/${year}`;
}

// const calculateEventWidth = (duration: any) => {
//   // Default width for events with duration 1
//   let width = "85%";
//   // Adjust width based on duration
//   if (duration === 2) {
//     width = "200%";
//   } else if (duration === 3) {
//     width = "310%";
//   }
//   return width;
// };

// const calculateTopPosition = (totalCount: any, currentIndex: any) => {
//   // Calculate the total number of positions available for events
//   const totalPositions = 200;

//   // Calculate the height of each position
//   const positionHeight = totalPositions / totalCount;

//   // Calculate the top position of the current event based on its index
//   const topPosition = positionHeight * currentIndex;

//   return topPosition;
// };

const MonthCalendar: React.FC = () => {
  const [calendarIndex, setCalendarIndex] = useState([]);

  return (
    <div className={styles.container}>
=======
  
  const year = 2024;
  const month = 3;
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

const MonthCalendar: React.FC = () => {
    
    return (
        <div className={styles.container}>
>>>>>>> d737f804ccb3e8fb3d2f099735b5183159f387b9
      <div className={styles.dayCards_container}>
        {days.map((day) => (
          <div key={day} className={styles.dayCard}>
            <div className={styles.day_title}>{day}</div>
          </div>
        ))}
      </div>

      <div className={styles.monthCards_container}>
        {datesWithEvents.map((dateWithEvent, indexd) => {
          if (dateWithEvent == "") {
            return <div className={styles.emptyCard}></div>;
          } else {
            let count = dateWithEvent.events.length;
            // console.log("count_dada", indexd);
            return (
              <div className={styles.monthCard}>
                <div className={styles.monthCard_dayno}>
                  {dateWithEvent.date.getDate()} {`idx->${indexd}`}
                </div>
                {dateWithEvent.events.map((event) => {
                  const formattedDate = formatDateString(event.startDate);
                  const arrayFromNumber = Array.from({
                    length: event.duration,
                  });
                  if (
                    formattedDate == dateWithEvent.date.toLocaleDateString()
                  ) {
                    // count = count - 1;
                    // let width = "85%";
                    // if (event.duration > 0) {
                    //   event.duration == 2
                    //     ? (width = "200%")
                    //     : event.duration == 5
                    //     ? (width = "420%")
                    //     : "85%";
                    // }
                    let width = "85%";
                    // console.log("ddd",arrayFromNumber.length)
                    for (
                      let events = 0;
                      events < arrayFromNumber.length;
                      events++
                    ) {
                      // console.log("eventttt");
                      for(let eventIndex = events; eventIndex < events; eventIndex++ ){
                        console.log("inside_for", indexd)
                      }
                      // for (
                      //   let eventsDuration = 1;
                      //   eventsDuration < arrayFromNumber.length;
                      //   eventsDuration++
                      // ) {
                      //   console.log("eventttt");
                      // }
                      // if(event.background && indexd){
                      //   console.log("farh")
                      // }
                    }
<<<<<<< HEAD

                    // console.log("RESULT", dateWithEvent.date.getDate(), count);
=======
>>>>>>> d737f804ccb3e8fb3d2f099735b5183159f387b9

                    return (
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
                    );
                  }
                })}
              </div>
            );
          }
        })}

        {/* <>
          {datesWithEvents.map((dateWithEvent, index) => {
            if (dateWithEvent === "") {
              return <div className={styles.emptyCard} key={index}></div>;
            } else {
              const formattedDate = dateWithEvent.date.toLocaleDateString();
              const eventCards = dateWithEvent.events.map(
                (event, eventIndex) => {
                  const eventWidth = calculateEventWidth(event.duration);
                  return (
                    <EventCard
                      key={eventIndex}
                      width={eventWidth}
                      top={`${calculateTopPosition(
                        dateWithEvent.events.length,
                        eventIndex
                      )}%`}
                      background={event.background}
                      name={event.name}
                    />
                  );
                }
              );
              return (
                <div className={styles.monthCard} key={index}>
                  <div className={styles.monthCard_dayno}>
                    {dateWithEvent.date.getDate()}
                  </div>
                  {eventCards}
                </div>
              );
            }
          })}
        </> */}
      </div>
    </div>
  );
};

export default MonthCalendar;
