import React from 'react'
import styles from './emptycard.style.module.css'
import EmptyCardIcon from '/public/empty_card_image.svg'
import Image from 'next/image'

const EmptyCard = () => {
    return (
        <div className={styles.body}>
            <Image src={EmptyCardIcon} alt='empty'/>
            <div>No Widgets Added</div>
            <p>Choose your widgets and start customizing to fit your needs.</p>
            <p>Enhance your drafts with the perfect widgets today!</p>
        </div>
    )
}


export default EmptyCard