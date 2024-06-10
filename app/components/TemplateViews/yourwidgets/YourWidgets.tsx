import React from 'react'
import styles from './yourwidget.style.module.css'

interface Props{
    setYourWidgetModal : (value : boolean)=>void
}

const YourWidgets = ({setYourWidgetModal} : Props) => {
  return (
    <div className={styles.body}>
        <div className={styles.heading_btnContainer}>
            <div className={styles.heading}>Your Widgets</div>
            <div className={styles.closeBtn} onClick={()=>(setYourWidgetModal(false))}>{`>>`}</div>
        </div>
    </div>
  )
}

export default YourWidgets