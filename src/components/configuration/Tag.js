import React from 'react'
import Cross from "../../icons/cross.svg";
import styles from './tag.style.module.css'

const Tag = ({ name }) => {
    return (
        <div className={styles.tag}>
            <img src={Cross} alt="Cross" />
            <div>{name}</div>
        </div>
    )
}

export default Tag