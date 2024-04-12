import React, { useState, useEffect } from 'react';
import styles from './scheduleMeetings.module.css';
import Search from '@/public/search.svg';
import Script from 'next/script';
import Image from 'next/image';
import Close from '/public/close.svg';
import rightArrowIcon from '/public/rightbigarrow.svg';
interface Props {
  meets: () => void;
  meet: boolean;
}
const ScheduleMeetings: React.FC<Props> = (props) => {

  // const [meet,setMeet]=useState(false);
  const [start, setStart] = useState<number>();
  const [selectedDate, setSelectedDay] = useState<string>(new Date().getDate().toString());
  const val = new Date().getDate().toString();
  const times = {
    [val]: ["9:00 AM - 9:30 AM", "7:00 PM - 7:30 PM", "9:00 PM - 9:30 PM"],
    "12": ["9:00 AM - 9:30 AM", "8:00 AM - 8:30 AM", "7:00 PM - 7:30 PM", "9:00 PM - 9:30 PM"],
    "14": ["9:00 AM - 9:30 AM", "10:00 AM - 10:30 AM", "8:00 AM - 8:30 AM", "7:00 PM - 7:30 PM"],
    "18": ["9:00 AM - 9:30 AM", "10:00 AM - 10:30 AM", "8:00 AM - 8:30 AM", "7:00 PM - 7:30 PM", "9:00 PM - 9:30 PM"]
  }
  const [timeSlots, setTimeSlots] = useState<string[]>(["9:00 AM - 9:30 AM", "10:00 AM - 10:30 AM", "8:00 AM - 8:30 AM", "7:00 PM - 7:30 PM", "9:00 PM - 9:30 PM"])
  const [end, setEnd] = useState<number>();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear())
  const meets = props.meets;
  const meet = props.meet;
  const [weeks, setWeeks] = useState<string[][]>([]);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthAbb = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  useEffect(() => {
    const getStartingDayOfMonth = (year: number, month: number) => {
      const firstDayOfMonth: Date = new Date(year, month, 1);
      return firstDayOfMonth.getDay();
    };

    const getEndDayOfMonth = (year: number, month: number) => {
      const lastDayOfMonth = new Date(year, month + 1, 0);
      return lastDayOfMonth.getDate();
    };

    const startingDay = getStartingDayOfMonth(year, month);
    setStart(startingDay);
    const endDay = getEndDayOfMonth(year, month);
    setEnd(endDay);

    let daysArray = [];
    let dayCounter = 1;

    for (let i = 0; i < 6; i++) {
      let week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j >= startingDay) {
          week.push(dayCounter.toString());
          dayCounter++;
        } else if (i !== 0 && dayCounter <= endDay) {
          week.push(dayCounter.toString());
          dayCounter++;
        } else {
          week.push(" ");
        }
      }
      daysArray.push(week);
    }

    setWeeks(daysArray);
  }, [year, month]);
  const nextMonth = () => {
    if (month < 11)
      setMonth(month + 1);
    else {
      setYear(year + 1);
      setMonth(0);
    }
  }
  const prevMonth = () => {
    if (month > 0) setMonth(month - 1);
    else {
      setYear(year - 1);
      setMonth(11);
    }
  }
  const getSlotData = (date: string) => {
    setSelectedDay(date)
    if (times.hasOwnProperty(date)) {
      setTimeSlots(times[parseInt(date)]);
    }
  }
  console.log(times);
  const meetingCards = new Array(15).fill(null).map((_, index) => (
    <div className={styles.card1} key={index}>
      <div className={styles.card1top}>
        <div className={styles.profileDetail}>
          <div className={styles.profilePic}>A</div>
          <div>
            <div style={{ fontSize: "12px" }}>Rob Slate @Robstatexy</div>
            <div style={{ fontSize: "10px" }}>Marketing / Sales Strategy</div>
          </div>
        </div>
        <div className={styles.eventDetails} onClick={meets}>
          <div className={styles.detailContainer}>
            <div>Meet</div>
            <Image src={rightArrowIcon} alt="rightArrowIcon" width={30} height={20} />
          </div>
        </div>
      </div>
      <div className={styles.card1bottom}>
        Lorem ipsum dolor sit amet consectetur. In sit eget non aliquet nisi. Eu dictum sit fermentum lectus. Nunc hac tortor elit vestibulum lorem auctor.
      </div>
    </div>
  ));
  return (
    <div className={styles.meetingContainer}>

      <div className={styles.container1} >
        <div className={styles.innerContainer1}>
          <div className={styles.circles}>
            <div className={styles.circle}>A</div>
            <div className={styles.circle}>B</div>
            <div className={styles.circle}>C</div>
          </div>
          <div style={{ fontSize: "10px" }}>224 people have shown interest to participate in the event</div>
        </div>
        <div className={styles.innerContainer2}>
          <Image src={Search} alt="Search" />
          <div>
            <input type='text' className={styles.search} placeholder='Search @name / department' />
          </div>
        </div>
      </div>
      <div className={styles.container2}>
        <div className={styles.mainCard}>
          {meetingCards}
        </div>
      </div>
      {meet &&
        <div className={styles.modal}>
          <div className={styles.meetPop}>
            <div className={styles.singleMeet}>
              <div className={styles.cardDetail}>
                <div className={styles.personDetail}>
                  <div className={styles.circle} style={{ marginRight: "0px" }}>A</div>
                  <div>Schedule a meet with  @Robslatex</div>
                </div>
                <div className={styles.btn}><span className={styles.circle1}></span>Availabe</div>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                  <div className={styles.buttons} style={{ fontSize: "10px" }}>
                    <div className={styles.monthyear}>
                      <div onClick={prevMonth} className={styles.changeBtn}>{"<"}</div>
                      <div style={{ width: "50px", textAlign: "center" }}>{monthAbb[month]}, {year}</div>
                      <div onClick={nextMonth} className={styles.changeBtn}>{">"}</div>
                    </div>
                    <div>Timezone : Calcutta</div>
                  </div>
                  <table>
                    <thead>
                      <tr className={styles.tableRow}>
                        {days.map((day, ind) => (
                          <th key={ind}>{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {weeks.map((week, index) => (
                        <tr key={index} className={styles.tableRow}>
                          {week.map((date, index) => (
                            date !== ' ' ? <td key={index} onClick={() => getSlotData(date)} style={{ position: "relative" }} className={date === selectedDate ? styles.selectedDay : ''}>{date}{times.hasOwnProperty(date) && <span className={styles.circle2}></span>}</td> : <td key={index}></td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.line}></div>
                <div className={styles.timeDetail}>
                  <div className={styles.slotsInfo}>
                    <div>Availabe Time Slot</div>
                    <div className={styles.slot}>
                      {timeSlots.map((item, ind) => (
                        <div key={ind} className={styles.time}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.meetDiv}>
                    <div>Book Meeting</div>
                  </div>
                </div>
              </div>
            </div>
            <Image onClick={meets} src={Close} alt="close" className={styles.crossImage} />
          </div>
        </div>}
    </div>
  );
}

export default ScheduleMeetings;