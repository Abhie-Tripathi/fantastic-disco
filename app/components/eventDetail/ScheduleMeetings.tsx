// import React, { useState,useEffect } from 'react';
// import styles from './scheduleMeetings.module.css';
// import Search from '@/public/search.svg';
// import Image from 'next/image';
// import rightArrowIcon from '/public/rightbigarrow.svg';

// const ScheduleMeetings = (props) => {

//     // const [meet,setMeet]=useState(false);
//     const [start,setStart]=useState<number>();
//     const [end,setEnd]=useState<number>();
//     const meets=props.meets;
//     const meet=props.meet;
//     const [weeks, setWeeks] = useState<number[][]>([]);
//     const days=["Sun", "Mon", "Tue","Wed","Thu", "Fri", "Sat"];
   
//     useEffect(() => {
//         const getStartingDayOfMonth = (year: number, month: number) => {
//             const firstDayOfMonth: Date = new Date(year, month - 1, 1);
//             return firstDayOfMonth.getDay();
//         };

//         const getEndDayOfMonth = (year: number, month: number) => {
//             const lastDayOfMonth = new Date(year, month, 0);
//             return lastDayOfMonth.getDate();
//         };

//         const startingDay = getStartingDayOfMonth(new Date().getFullYear(), new Date().getMonth());
//         setStart(startingDay);
//         const endDay = getEndDayOfMonth(new Date().getFullYear(), new Date().getMonth());
//         setEnd(endDay);

//         let daysArray = [];
//         let dayCounter = 1;

//         for (let i = 0; i < 5; i++) {
//             let week = [];
//             for (let j = 0; j < 7; j++) {
//                 if (i === 0 && j >= startingDay) {
//                     week.push(dayCounter);
//                     dayCounter++;
//                 } else if (i !== 0 && dayCounter <= endDay) {
//                     week.push(dayCounter);
//                     dayCounter++;
//                 } else {
//                     week.push(" ");
//                 }
//             }
//             daysArray.push(week);
//         }

//         setWeeks(daysArray);
//     }, []);
      
// //       console.log(a);
// //       const weeks = [];
// // while (a.length > 0) {
// //   weeks.push(a.splice(0, 7));
// // }
// //    console.log(a);
//   const meetingCards = new Array(15).fill(null).map((_, index) => (
//     <div className={styles.card1} key={index}>
//       <div className={styles.card1top}>
//         <div className={styles.profileDetail}>
//           <div className={styles.profilePic}>A</div>
//           <div>
//             <div style={{ fontSize: "12px" }}>Rob Slate @Robstatexy</div>
//             <div style={{ fontSize: "10px" }}>Marketing / Sales Strategy</div>
//           </div>
//         </div>
//         <div className={styles.eventDetails} onClick={meets}>
//           <div className={styles.detailContainer}>
//             <div>Meet</div>
//             <Image src={rightArrowIcon} alt="rightArrowIcon" width={30} height={20} />
//           </div>
//         </div>
//       </div>
//       <div className={styles.card1bottom}>
//         Lorem ipsum dolor sit amet consectetur. In sit eget non aliquet nisi. Eu dictum sit fermentum lectus. Nunc hac tortor elit vestibulum lorem auctor.
//       </div>
//     </div>
//   ));
//   return (
//     <div className={styles.meetingContainer}>
//       <div className={styles.container1} >
//         <div className={styles.innerContainer1}>
//           <div className={styles.circles}>
//             <div className={styles.circle}>A</div>
//             <div className={styles.circle}>B</div>
//             <div className={styles.circle}>C</div>
//           </div>
//           <div style={{ fontSize: "10px" }}>224 people have shown interest to participate in the event</div>
//         </div>
//         <div className={styles.innerContainer2}>
//           <Image src={Search} alt="Search" />
//           <div>
//             <input type='text' className={styles.search} placeholder='Search @name / department' />
//           </div>
//         </div>
//       </div>
//       <div className={styles.container2}>
//         <div className={styles.mainCard}>
//           {meetingCards}
//         </div>
//       </div>
//       {meet&&
//       <div className={styles.modal}>
//       <div className={styles.meetPop}>
//        <div className={styles.singleMeet}>
//         <div className={styles.cardDetail}>
//             <div className={styles.personDetail}>
//             <div className={styles.circle} style={{marginRight:"0px"}}>A</div>
//             <div>Schedule a meet with  @Robslatex</div>
//             </div>
//             <div className={styles.btn}>Availabe</div>
//         </div>
//         <div style={{display:"flex", gap:"20px"}}>
//         <div style={{display:"flex", gap:"20px"}}>
//             <button>next</button>
//         <table>
//             <thead>
//             <tr className={styles.tableRow}>
//             {days.map((day)=>(
//                 <th>{day}</th>
//                 ))}
//             </tr>
//             </thead>
//             <tbody>
//               {weeks.map((week, index) => (
//                 <tr key={index} className={styles.tableRow}>
//                   {week.map((date, index) => (
//                     <td key={index}>{date !== ' ' ? date : ''}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//         </table>
//         </div>
//         </div>
//         </div>
//         </div>
//         </div>}
//     </div>
//   );
// }

// export default ScheduleMeetings;

import React, { useState } from 'react';
import styles from './scheduleMeetings.module.css';
import Search from '@/public/search.svg';
import Image from 'next/image';
import rightArrowIcon from '/public/rightbigarrow.svg';

const ScheduleMeetings = (props) => {

    // const [meet,setMeet]=useState(false);
    const [start,setStart]=useState<number>();
    const [end,setEnd]=useState<number>();
    const meets=props.meets;
    const meet=props.meet;
    const days=["Sun", "Mon", "Tue","Wed","Thu", "Fri", "Sat"];
   
    const getStartingDayOfMonth = (year:number, month:number) => {
        const firstDayOfMonth:Date = new Date(year, month- 1, 1);
        return firstDayOfMonth.getDay();
      };
      
      const getEndDayOfMonth = (year:number, month:number) => {
        const nextMonthFirstDay = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month, 0);
        return lastDayOfMonth.getDate();
      };
    //   const startingDay=getStartingDayOfMonth(new Date().getFullYear(),new Date().getMonth());
    //   setStart(startingDay);
      const startingDay = getStartingDayOfMonth(2024, 2);
    //   const endDay=getEndDayOfMonth(new Date().getFullYear(),new Date().getMonth());
    //   setEnd(endDay);
      const endDay = getEndDayOfMonth(2024, 2);
      let a = [];
      let c = 1;
      console.log(startingDay);
      
      for (let i = 0; i < 5; i++) {
        
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j >= startingDay) {
            a.push(c);
            c++;
          } else {
            if (c <= endDay&&i!==0) {
              a.push(c);
              c++;
            } else a.push(" ");
          }
        }
      }
      
      console.log(a);
      const weeks = [];
while (a.length > 0) {
  weeks.push(a.splice(0, 7));
}
   console.log(a);
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
      {meet&&
      <div className={styles.modal}>
      <div className={styles.meetPop}>
       <div className={styles.singleMeet}>
        <div className={styles.cardDetail}>
            <div className={styles.personDetail}>
            <div className={styles.circle} style={{marginRight:"0px"}}>A</div>
            <div>Schedule a meet with  @Robslatex</div>
            </div>
            <div className={styles.btn}>Availabe</div>
        </div>
        <div style={{display:"flex", gap:"20px"}}>
        <div style={{display:"flex", gap:"20px"}}>
            {/* <button>next</button> */}
        <table>
            <thead>
            <tr className={styles.tableRow}>
            {days.map((day)=>(
                <th>{day}</th>
                ))}
            </tr>
            </thead>
            <tbody>
              {weeks.map((week, index) => (
                <tr key={index} className={styles.tableRow}>
                  {week.map((date, index) => (
                    <td key={index}>{date !== ' ' ? date : ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
        </table>
        </div>
        </div>
        </div>
        </div>
        </div>}
    </div>
  );
}

export default ScheduleMeetings;
