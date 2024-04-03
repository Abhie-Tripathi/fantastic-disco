import React, { useState } from 'react'
import styles from './preview.styles.module.css'

const Preview = ({toggle}) => {

  const [toggleState, setToggleState] = useState("Side Preview")

  const handleToggleState = ()=>{
    if(toggleState === "Side Preview"){
      setToggleState("Full Preview")
    }else setToggleState("Side Preview")
    toggle()
  }


  return (
    <div className={styles.container}>
        <div className={styles.toggleHeading} onClick={handleToggleState}>{toggleState}</div>
        <div className={styles.screen}></div>
    </div>
  )
}

export default Preview