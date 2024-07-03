import React from 'react'
import styles from './advanceFilter.style.module.css'
const index = ({ format, freq, entry, rank, keywords, eventRank, localRank }: any) => {
    // const format = ["Hybrid", "In-person", "Virtual", "Offline"]
    // const freq=["Annual","Biannual","Queartly"]
    // const entry=["Free","Paid","Invites","Member Access"];
    // const rank=["Country Rank","Category Rank"];
    const key = ["Tags", "Airport", "Animal", "Sea", "Arson", "Cruise", "National", "Shows"];
    return (
        <div className={styles.container}>
            <div className={styles.formatFreq}>
                <div className={styles.format}>
                    <div className={styles.formatHead}>Event Format</div>
                    <div className={styles.allCat}>
                        {format?.map((item: string, id: number) => (
                            <>
                                <label style={{ display: "flex" }} >
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
                        {freq?.map((item: string, id: number) => (
                            <>
                                <label style={{ display: "flex" }} >
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
                        {entry?.map((item: string, id: number) => (
                            <>
                                <label style={{ display: "flex" }} >
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
                        {eventRank.length!==0 && 
                        <div className={styles.item}>Event Rank: {eventRank[0]}-{eventRank[1]}</div>
                        }
                        {localRank.length!==0 && 
                        <div className={styles.item}>Local Rank: {localRank[0]}-{localRank[1]}</div>
                        }
                    </div>
                </div>
            </div>
            <div className={styles.formatFreq1}>
                <div className={styles.format}>
                    <div className={styles.formatHead}>Keywords</div>
                    <div className={styles.allCat1}>
                        {keywords?.map((item: string, id: number) => (
                            item?.charAt(0) !== '-' ? (
                                <div key={id} className={`${styles.tooltipContainer} ${styles.key}`}>{item}
                                <span className={styles.tooltipText}>Include Keyword</span>
                                </div>
                            ) : (
                                <div key={id} className={`${styles.tooltipContainer} ${styles.keyNegative}`}>{item.substring(1)}
                                <span className={styles.tooltipText}>Exclude Keyword</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default index
