import React from 'react'
import styles from './advanceFilter.style.module.css'
const index = () => {
    const format = ["Hybrid", "In-person", "Virtual", "Offline"]
    const freq=["Annual","Biannual","Queartly"]
    const entry=["Free","Paid","Invites","Member Access"];
    const rank=["Country Rank","Category Rank"];
    const key=["Tags","Airport","Animal","Sea","Arson","Cruise","National","Shows"];
    return (
        <div className={styles.container}>
            <div className={styles.formatFreq}>
                <div className={styles.format}>
                    <div className={styles.formatHead}>Event Format</div>
                    <div className={styles.allCat}>
                        {format.map((item, id) => (
                            <>
                                <label style={{display:"flex"}} >
                                    <input

                                        className={styles.text}
                                        type="checkbox"
                                        // onChange={() => onChange()}
                                        checked={true}
                                        disabled
                                    />
                                    <span className={styles.item}>{item}</span>
                                </label>
                            </>
                        ))}
                    </div>
                </div>
                <div className={styles.format}>
                    <div className={styles.formatHead}>Event Frequency</div>
                    <div className={styles.allCat}>
                        {freq.map((item, id) => (
                            <>
                                <label style={{display:"flex"}} >
                                    <input

                                        className={styles.text}
                                        type="checkbox"
                                        // onChange={() => onChange()}
                                        checked={true}
                                        disabled
                                    />
                                    <span className={styles.item}>{item}</span>
                                </label>
                            </>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.formatFreq}>
                <div className={styles.format}>
                    <div className={styles.formatHead}>Event Entry</div>
                    <div className={styles.allCat}>
                        {entry.map((item, id) => (
                            <>
                                <label style={{display:"flex"}} >
                                    <input

                                        className={styles.text}
                                        type="checkbox"
                                        // onChange={() => onChange()}
                                        checked={true}
                                        disabled
                                    />
                                    <span className={styles.item}>{item}</span>
                                </label>
                            </>
                        ))}
                    </div>
                </div>
                <div className={styles.format}>
                    <div className={styles.formatHead}>Rankings</div>
                    <div className={styles.allCat}>
                        {rank.map((item, id) => (
                            <>
                                <label style={{display:"flex"}} >
                                    <input

                                        className={styles.text}
                                        type="checkbox"
                                        // onChange={() => onChange()}
                                        checked={true}
                                        disabled
                                    />
                                    <span className={styles.item}>{item}</span>
                                </label>
                            </>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.formatFreq1}>
                <div className={styles.format}>
                    <div className={styles.formatHead}>Keywords</div>
                    <div className={styles.allCat1}>
                        {key.map((item, id) => (
                            <>
                                <div className={styles.key}>{item}</div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default index
