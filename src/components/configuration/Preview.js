import React from 'react'
import styles from './preview.styles.module.css'

const Preview = () => {
  return (
    <div className={styles.container}>
        <div className={styles.heading}>Preview</div>
        <div className={styles.screen}></div>
    </div>
  )
}

export default Preview