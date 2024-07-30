import React from 'react'
import styles from './cardstyles.style.module.css'
import Card1 from '/public/widgetimages/cardstyle1.png'
import Card2 from '/public/widgetimages/cardstyle2.png'
import Card3 from '/public/widgetimages/cardstyle3.png'
import Image from 'next/image'

interface Props{
    cardStyle : string;
    setCardStyle : React.Dispatch<React.SetStateAction<string>>;
}

const CardStyles = ({ cardStyle, setCardStyle } : Props) => {
    return (
        <div className={styles.body}>
            <div className={styles.headingContainer}>
                <div className={styles.heading}>Card Styles</div>
                <div className={styles.subheading}>Select your card styles</div>
            </div>
            <div className={styles.editContainer}>
                <div className={styles.cardContainer} onClick={()=>setCardStyle("style1")}>
                    <Image src={Card1} alt='style1'/>
                    <label className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={cardStyle === "style1"}
                            onChange={() => setCardStyle("style1")}
                        />
                        <span className={styles.customCheckbox}></span>
                        <span className={styles.checkboxLabel}>Style 1</span>
                    </label>
                </div>
                <div className={styles.cardContainer} onClick={()=>setCardStyle("style2")}>
                    <Image src={Card2} alt='style2'/>
                    <label className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={cardStyle === "style2"}
                            onChange={() => setCardStyle("style2")}
                        />
                        <span className={styles.customCheckbox}></span>
                        <span className={styles.checkboxLabel}>Style 2</span>
                    </label>
                </div>
                <div className={styles.cardContainer} onClick={()=>setCardStyle("style3")}>
                    <Image src={Card3} alt='style3'/>
                    <label className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={cardStyle === "style3"}
                            onChange={() => setCardStyle("style3")}
                        />
                        <span className={styles.customCheckbox}></span>
                        <span className={styles.checkboxLabel}>Style 3</span>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default CardStyles