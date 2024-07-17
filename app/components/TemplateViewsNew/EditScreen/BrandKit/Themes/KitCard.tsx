import React from 'react'
import styles from './kitcard.style.module.css'
import KitImage from '/public/KitCard.png'
import Image from 'next/image'

interface Props {
    extractedColors?: string[];
}

const KitCard = ({ extractedColors }: Props) => {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <Image src={KitImage} alt='img' />
                {extractedColors && (
                    <div className={styles.colorsContainer}>
                        {extractedColors.map((color, index) => (
                            <div className={styles.colorWrapper} key={index}>
                                <div
                                    className={styles.color}
                                    style={{
                                        backgroundColor: color,
                                        left: `${index * 10}px`
                                    }}
                                ></div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
            <div className={styles.nameContainer}>
                <div className={styles.name}>Company Kit</div>
                <div className={styles.tag}>Default Kit</div>
            </div>
        </div>
    )
}

export default KitCard