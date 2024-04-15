import React from 'react'
import Cross from "/public/cross.svg";
import styles from './tag.style.module.css'
import Image from 'next/image';

interface TagProps {
    name: string;
    onRemove: () => void;
  }

const Tag = ({ name, onRemove  } : TagProps) => {
    return (
        <div className={styles.tag}>
            <Image src={Cross} alt="Cross" onClick={onRemove}/>
            <div>{name}</div>
        </div>
    )
}

export default Tag