import React, { useState, useEffect } from "react";
import SearchIcon from '../../../icons/search.svg'
import styles from './sectionwidget.style.module.css'
import Down from '../../../icons/downArrow.svg'

const SectionWidget = () => {
    const [geoInput, setGeoInput] = useState("")
    return (
        <form className={styles.form}>
            <div className={styles.searchContainer}>
                <div className={styles.heading}>Event Geography</div>
                <div className={styles.searchInput}>
                    <img src={SearchIcon} alt='search' />
                    <input
                        type='text'
                        onChange={(e) => setGeoInput(e.target.value)}
                        value={geoInput}
                        placeholder="Search"
                        required
                    />
                </div>
            </div>
            <div className={styles.searchContainer}>
                <div className={styles.heading}>Event Category</div>
                <div className={styles.searchInput}>
                    <img src={SearchIcon} alt='search' />
                    <input
                        type='text'
                        onChange={(e) => setGeoInput(e.target.value)}
                        value={geoInput}
                        placeholder="Search"
                        required
                    />
                </div>
            </div>
        </form>
    )
}

export default SectionWidget