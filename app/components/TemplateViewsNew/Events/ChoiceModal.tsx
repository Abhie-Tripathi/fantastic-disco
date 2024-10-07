// import React from 'react'
// import styles from './choicemodal.style.module.css'
// import MainEventIcon from '/public/widgetimages/Mainevent.svg'
// import SideEventIcon from '/public/widgetimages/Sideevent.svg'
// import Image from 'next/image'

// interface Props {
//     setChoiceFormModal : (value : boolean)=> void
//     setEventFlow : (value : string)=> void
// }

// const ChoiceModal = ({setChoiceFormModal, setEventFlow}: Props) => {
//     return (
//         <div className={styles.body}>
//             <div className={styles.header}>
//                 <div className={styles.heading}>Add Event</div>
//                 <button className={styles.cancelBtn} onClick={()=>setChoiceFormModal(false)}>Cancel</button>
//             </div>
//             <div className={styles.subHeading}>Make a selection to add your event</div>
//             <div className={styles.choiceContainer}>
//                 <div className={styles.eventContainer} onClick={()=>setEventFlow("main")}>
//                     <div className={styles.imageContainer}>
//                         <Image src={MainEventIcon} alt='mainevent' unoptimized />
//                     </div>
//                     <div className={styles.eventName}>Main Event</div>
//                     <div className={styles.eventSummary}>Your primary event that is mainly focused on networking, entertainment, or other experiences.</div>
//                 </div>
//                 <div className={styles.eventContainer} onClick={()=>setEventFlow("side")}>
//                     <div className={styles.imageContainer}>
//                         <Image src={SideEventIcon} alt='sideevent' unoptimized />
//                     </div>
//                     <div className={styles.eventName}>Side Event</div>
//                     <div className={styles.eventSummary}>Supplementary activity that enhances the main event by offering various experiences for attendees.</div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ChoiceModal

import React, { useState } from "react";
import styles from "./choicemodal.style.module.css";
import MainEventIcon from "/public/widgetimages/Mainevent.svg";
import SideEventIcon from "/public/widgetimages/Sideevent.svg";
import Image from "next/image";

interface Props {
  setChoiceFormModal: (value: boolean) => void;
  setEventFlow: (value: string) => void;
}

const ChoiceModal = ({ setChoiceFormModal, setEventFlow }: Props) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const handleEventClick = (event: string) => {
    if (selectedEvent === event) {
      setSelectedEvent(null);
      setEventFlow("");
    } else {
      setSelectedEvent(event);
      setEventFlow(event);
    }
  };
  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <div className={styles.heading}>Add Event</div>
        <button
          className={styles.cancelBtn}
          onClick={() => setChoiceFormModal(false)}
        >
          Cancel
        </button>
      </div>
      <div className={styles.subHeading}>
        Make a selection to add your event
      </div>
      <div className={styles.choiceContainer}>
        <div
          className={styles.eventContainer}
          onClick={() => handleEventClick("main")}
        >
          <div className={styles.imageContainer}>
            <Image src={MainEventIcon} alt="mainevent" unoptimized />
          </div>
          <div className={styles.eventName}>Main Event</div>
          <div className={styles.eventSummary}>
            Your primary event that is mainly focused on networking,
            entertainment, or other experiences.
          </div>
        </div>
        <div
          className={styles.eventContainer}
          onClick={() => handleEventClick("side")}
        >
          <div className={styles.imageContainer}>
            <Image src={SideEventIcon} alt="sideevent" unoptimized />
          </div>
          <div className={styles.eventName}>Side Event</div>
          <div className={styles.eventSummary}>
            Supplementary activity that enhances the main event by offering
            various experiences for attendees.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoiceModal;
