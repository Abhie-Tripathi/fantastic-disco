import React from 'react'
import styles from './sketelon.style.module.css'

const SkeletonWidget = () => {
    return (
        <div className={styles.container}> 
            <div className={styles.line}>
            </div>
        </div>
    );
}

export default SkeletonWidget