import React from 'react'
import Styles from './widgetCard.style.module.css'
// import "./WidgetCard.css"
import Analytics from './Analytics'
import Calendar from '../../icons/vector.svg'
import Spinner from '../../icons/Icon.svg'
const WidgetCard = (props) => {
    const data=props.data;
    console.log(data);
  return (
    <>
    <div className={Styles.cardSec1}>
     <div className={Styles.iconCircle}><img src={Spinner} alt="icon"/></div>
     <div className={Styles.heading}>{data.heading}</div>
     <div className={Styles.eventDetail}>
        <div style={{display:"flex"}}><img src={Calendar} alt="calendar"/></div>
        <div className={Styles.date}>1st Apr 2024</div>
        <div>-</div>
        <div className={Styles.date}>30th Apr 2024</div>
        
     </div>
     <div className={Styles.statusBtn}>
        <div className={Styles.activeFlag}></div>
        <div className={Styles.status}>Active</div>
     </div>
    </div>
    <div className={Styles.cardSec2}>
        <div className={Styles.type}>
        <div className={Styles.typeHead}>Widget Type</div>
        <div className={Styles.typeBtn}>Section</div>
        </div>
        <div className={Styles.line}></div>
        <div className={Styles.type}>
        <div className={Styles.typeHead}>Geography</div>
        <div className={Styles.typeBtn}>India</div>
        </div>
        <div className={Styles.line}></div>
        <div className={Styles.type}>
        <div className={Styles.typeHead}>Event Category</div>
        <div className={Styles.allTypeBtn}>
        <div className={Styles.typeBtn}>Hospitality</div>
        <div className={Styles.typeBtn}>Festivals</div>
        </div>
        </div>
        <div className={Styles.line}></div>
        <div className={Styles.type}>
        <div className={Styles.typeHead}>Event Type</div>
        <div className={Styles.allTypeBtn}>
        <div className={Styles.typeBtn}>Seminar</div>
        </div>
        </div>
        <div className={Styles.line}></div>
        <div className={Styles.type}>
        <div className={Styles.typeHead}>Event Format</div>
        <div className={Styles.allTypeBtn}>
        <div className={Styles.typeBtn}>Exhibition</div>
        </div>
        </div>
        <div className={Styles.line}></div>
        <div className={Styles.type}>
        <div className={Styles.typeHead}>Mode of Participation</div>
        <div className={Styles.allTypeBtn}>
        <div className={Styles.typeBtn}>Virtual</div>
        </div>
        </div>
    </div>
    <div className={Styles.cardSec3}>
        <Analytics/>
    </div>
    </>
  )
}

export default WidgetCard
