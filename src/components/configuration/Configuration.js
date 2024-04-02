import React, { useState } from 'react'
import FocusAndTypes from './FocusAndType';
import StickyWidget from './widgets/StickyWidget';
import demoEvent from '../../eventdata/demoEvent.json'
import Styles from './configuration.style.module.css'
import Navbar from '../Navbar';
import Preview from './Preview';
import SectionWidget from './widgets/SectionWidget';

const Configuration = () => {
  const [focus, setFocus] = useState("");
  const [buyerTags, setBuyerTags] = useState([]);
  const [type, setType] = useState("Sticky");
  const [previewState, setPreviewState] = useState("Side Preview")

  const handlePreviewToggle = ()=>{
    if(previewState === "Side Preview"){
      setPreviewState("Full Preview")
    }else setPreviewState("Side Preview")
  }

  return (
    <div className={Styles.body}>
      <Navbar />
      <div className={Styles.container} >
        {previewState === "Side Preview" && <div className={Styles.configurationForm}>
          <FocusAndTypes
            focus={focus}
            setFocus={setFocus}
            type={type}
            setType={setType}
          />
          <div className={Styles.dropdown_container}>
            {type === "Sticky" && <StickyWidget demoEvent={demoEvent} buyerTags={buyerTags} setBuyerTags={setBuyerTags} />}
            {type === "Section" && <SectionWidget demoEvent={demoEvent} />}
            {type === "Full Width" && <SectionWidget demoEvent={demoEvent} />}
          </div>
        </div>}
        <div className={`${Styles.previewSection} ${previewState === "Full Preview" ? Styles.fullPreview : ""}`}>
          <Preview toggle = {handlePreviewToggle}/>
        </div>
      </div>
    </div>
  )
}

export default Configuration
