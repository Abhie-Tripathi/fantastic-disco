import React from "react";
import styles from "./monthcalendar.style.module.css";

const days = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const events = [
    {
        id: 1,
        name: "HORN Ok Food Festival",
        description: "A food fest including a variety of drinks and food that you will savour for your entire life",
        location: "Delhi",
        startDate: "3/20/2024",
        endDate: "3/21/2024",
        tags: [
            "food",
            "festival",
            "drinks",
            "gathering",
            "hornok",
            "horn",
            "fest"
        ],
        logo: "https://1000logos.net/wp-content/uploads/2021/11/logo-Paramount.png",
        imageUrl: "https://i.pinimg.com/originals/0f/ab/ea/0fabead80613002cfed665309f3dd6cc.jpg",
        duration: 2
    },
    {
        id: 2,
        name: "Great Indian Food Festival",
        description: "A food fest including a variety of drinks and food that you will savour for your entire life",
        location: "Gurgaon",
        startDate: "3/14/2024",
        endDate: "3/16/2024",
        tags: [
            "food",
            "festival",
            "drinks",
            "gathering",
            "great indian food festival",
            "fest"
        ],
        logo: "https://1000logos.net/wp-content/uploads/2021/11/logo-Paramount.png",
        imageUrl: "https://miro.medium.com/v2/resize:fit:1400/1*nmMagIDyextUFs5J9aGnPw.jpeg",
        duration: 3
    },
    {
        id: 3,
        name: "Painting Fest",
        description: "A area filled with people and canvas boards to paint on. Come and paint your imagination",
        location: "Ney York",
        startDate: "3/10/2024",
        endDate: "3/12/2024",
        tags: [
            "paint",
            "painting",
            "colors",
            "color",
            "fest"
        ],
        logo: "https://1000logos.net/wp-content/uploads/2021/11/logo-Paramount.png",
        imageUrl: "https://palmbeach.floridaweekly.com/wp-content/uploads/images/2023-02-23/27p1.jpg",
        duration: 3
    },
    {
        id: 4,
        name: "Tomartina Tomato Fest",
        description: "A annual tomato fest in which streets get filled with tomatoes and people throw tomatoes at each other for fun",
        location: "Italy",
        startDate: "3/7/2024",
        endDate: "3/8/2024",
        tags: [
            "tomato",
            "tomartina",
            "holi",
            "gathering",
            "fight"
        ],
        logo: "https://1000logos.net/wp-content/uploads/2021/11/logo-Paramount.png",
        imageUrl: "https://images.ladepeche.fr/api/v1/images/view/63106cfdef5bdc39f1680c68/large/image.jpg?v=1",
        duration: 2
    },
    {
        id: 5,
        name: "Film Festival",
        description: "A annual film festival where people from all over India send in there directed films and they are shown in this festival on the large screen",
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
            "film"
        ],
        logo: "https://1000logos.net/wp-content/uploads/2021/11/logo-Paramount.png",
        imageUrl: "https://cdn.choosechicago.com/uploads/2019/06/chicago-film-festival-1800x900.jpg",
        duration: 3
    }
    
];

function generateMonthArray(year, month) {
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
    monthArray.push(new Date(year, month - 1, day));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return monthArray;
}

const year = 2024;
const month = 3;
const monthDatesArray = generateMonthArray(year, month);

// This contains a array of object which have date and events associated with that date
const datesWithEvents = monthDatesArray.map((date) => {
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
console.log(datesWithEvents)
const MonthCalendar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.dayCards_container}>
        {days.map((day) => (
          <div key={day} className={styles.dayCard}>
            <div className={styles.day_title}>{day}</div>
          </div>
        ))}
      </div>

      <div className={styles.monthCards_container}>
        {datesWithEvents.map((dateWithEvent) => {
          if (dateWithEvent == "") {
            return <div className={styles.emptyCard}></div>;
          } else {
            let count = dateWithEvent.events.length;
            return (
              <div className={styles.monthCard}>
                <div className={styles.monthCard_dayno}>
                  {dateWithEvent.date.getDate()}
                </div>
                {dateWithEvent.events.map((event) => {
                  if (
                    event.startDate ==
                    dateWithEvent.date.toLocaleDateString()
                  ) {
                    count = count - 1;
                    let width = "85%";
                    if (event.duration > 0) {
                        event.duration === 2
                        ? (width = "200%")
                        : event.duration === 3
                        ? (width = "310%")
                        : (width = "85%");         
                    }
                    return (
                      <div
                        className={styles.event}
                        style={{
                          width: `${width}`,
                          top: `${38 + count * 20}%`,
                          backgroundColor: "#6750A4",
                          color:"white"
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
      </div>
    </div>
  );
};

export default MonthCalendar;