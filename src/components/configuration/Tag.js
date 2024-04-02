import React from 'react'
import Cross from "../../icons/cross.svg";
import styles from './tag.style.module.css'

const Tag = ({ name, onRemove  }) => {
    return (
        <div className={styles.tag}>
            <img src={Cross} alt="Cross" onClick={onRemove}/>
            <div>{name}</div>
        </div>
    )
}

export default Tag