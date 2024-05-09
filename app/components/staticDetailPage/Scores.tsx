import React from 'react'
import styles from './scores.style.module.css'

const Scores = () => {
    return (
        <div className={styles.container}>
            <div className={styles.heading}>SCORES</div>
            <div className={styles.valuesContainer}>
                <div className={styles.predictedDataContainer}>
                    <div className={styles.predictedData}>
                        <div className={styles.predictedDataHeading}>Attendance</div>
                        <div className={styles.predictedDataValue}>5000</div>
                    </div>
                    <div className={styles.predictedData}>
                        <div className={styles.predictedDataHeading}>Exhibitors</div>
                        <div className={styles.predictedDataValue}>400</div>
                    </div>
                </div>
                <div className={styles.eventCardStats}>
                    <div className={styles.rank_container}>
                        <div className={styles.rank}>90</div>
                        <div className={styles.rank_title}>Eis</div>
                    </div>
                    <div className={styles.rank_container}>
                        <div className={styles.rank}>70</div>
                        <div className={styles.rank_title}>Influence</div>
                    </div>
                    <div className={styles.rank_container}>
                        <div className={styles.rank}>70</div>
                        <div className={styles.rank_title}>Intl.</div>
                    </div>
                    <div className={styles.rank_container}>
                        <div className={styles.rank}>60</div>
                        <div className={styles.rank_title}>Local</div>
                    </div>
                    <div className={styles.rank_container}>
                        <div className={styles.rank}>45</div>
                        <div className={styles.rank_title}>Regional</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Scores