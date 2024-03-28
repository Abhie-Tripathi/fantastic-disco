import React,{useState} from 'react'
import FocusAndTypes from './FocusAndType';
import EventsDropDown from './EventsDropdown';
import demoEvent from '../../eventdata/demoEvent.json'
import Styles from './configuration.style.module.css'
import Section from './Section';
const Configuration = () => {
    const [focus, setFocus] = useState("");
    const [buyerTags, setBuyerTags] = useState([]);
  const [type, setType] = useState("Sticky");
  return (
    <div className={Styles.container} style={{padding:'20px'}}>
        
    <div className={Styles.row_container}>
        <div className={Styles.main_container}>
          <div className={Styles.first_container}>
            <div className={Styles.product_container}>
            <FocusAndTypes
              focus={focus}
              setFocus={setFocus}
              type={type}
              setType={setType}
            //   focusError={errors.focus}
            //   typeError={errors.type}
            />

            <div className={Styles.dropdown_container}>
                {type==="Sticky"&& <EventsDropDown demoEvent={demoEvent} buyerTags={buyerTags} setBuyerTags={setBuyerTags} />}
                {type==="Section" && <Section demoEvent={demoEvent}/>}
                {type==="Full Width" && <Section demoEvent={demoEvent}/>}
              </div>
                </div>
                </div>
                <div className={Styles.second_container}></div>
                </div>
                </div>
    </div>
  )
}

export default Configuration
