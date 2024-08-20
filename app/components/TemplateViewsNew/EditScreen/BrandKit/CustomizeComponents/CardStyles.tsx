import React, { useState } from 'react'
import styles from './cardstyles.style.module.css'
import Card1 from '/public/widgetimages/cardstyle1.png'
import Card2 from '/public/widgetimages/cardstyle2.png'
import Card3 from '/public/widgetimages/cardstyle3.png'
import CardDark1 from '/public/widgetimages/cardstyledark1.png'
import CardDark2 from '/public/widgetimages/cardstyledark2.png'
import CardDark3 from '/public/widgetimages/cardstyledark3.png'
import Image from 'next/image'
import { useTheme } from '@/context'

interface Props {
    cardStyle: string;
    setCardStyle: React.Dispatch<React.SetStateAction<string>>;
}

const CardStyles = ({ cardStyle, setCardStyle }: Props) => {
    const { theme } = useTheme()
    const [accordian, setAccordian] = useState<boolean>(false)

    return (
        <div className={styles.body}>
            <div className={styles.header} onClick={() => setAccordian(!accordian)}>
                <div className={styles.headingContainer}>
                    <div className={styles.heading}>Card Styles</div>
                    <div className={styles.subheading}>Select your card styles</div>
                </div>
                {accordian ?
                    <div className={styles.btn} onClick={() => setAccordian(false)}><UpArrow color={theme === "light" ? "black" : "white"} /></div> : <div className={styles.btn} onClick={() => setAccordian(true)}><DownArrow color={theme === "light" ? "black" : "white"} /></div>}
            </div>

            {accordian && <div className={styles.editContainer}>
                <div className={styles.cardContainer} onClick={() => setCardStyle("style1")}>
                    <Image src={theme === "light" ? Card1 : CardDark1} alt='style1' />
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
                <div className={styles.cardContainer} onClick={() => setCardStyle("style2")}>
                    <Image src={theme === "light" ? Card2 : CardDark2} alt='style2' />
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
                <div className={styles.cardContainer} onClick={() => setCardStyle("style3")}>
                    <Image src={theme === "light" ? Card3 : CardDark3} alt='style3' />
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
            </div>}
        </div>
    )
}

export default CardStyles

interface IconProps {
    color: string;
}
function UpArrow({ color }: IconProps) {
    return (
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.52876 0.529741C4.65378 0.40476 4.82332 0.334549 5.0001 0.334549C5.17687 0.334549 5.34641 0.40476 5.47143 0.529741L9.24276 4.30107C9.30644 4.36257 9.35723 4.43613 9.39216 4.51747C9.4271 4.59881 9.44549 4.68629 9.44626 4.77481C9.44703 4.86333 9.43017 4.95111 9.39664 5.03304C9.36312 5.11497 9.31362 5.18941 9.25103 5.252C9.18843 5.3146 9.114 5.3641 9.03207 5.39762C8.95014 5.43114 8.86235 5.44801 8.77383 5.44724C8.68531 5.44647 8.59783 5.42808 8.51649 5.39314C8.43516 5.3582 8.36159 5.30741 8.3001 5.24374L5.0001 1.94374L1.7001 5.24374C1.57436 5.36518 1.40596 5.43238 1.23116 5.43086C1.05637 5.42934 0.889156 5.35922 0.765551 5.23562C0.641946 5.11201 0.571833 4.94481 0.570313 4.77001C0.568794 4.59521 0.635991 4.42681 0.757429 4.30107L4.52876 0.529741Z" fill={color} />
        </svg>

    )
}
function DownArrow({ color }: IconProps) {
    return (
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47124 5.47026C5.34622 5.59524 5.17668 5.66545 4.9999 5.66545C4.82313 5.66545 4.65359 5.59524 4.52857 5.47026L0.757237 1.69893C0.693563 1.63743 0.642775 1.56387 0.607836 1.48253C0.572896 1.40119 0.554505 1.31371 0.553736 1.22519C0.552967 1.13667 0.569835 1.04889 0.603355 0.966957C0.636876 0.885027 0.686378 0.810592 0.748973 0.747996C0.811568 0.685401 0.886003 0.635899 0.967934 0.602379C1.04986 0.568858 1.13765 0.55199 1.22617 0.55276C1.31469 0.553529 1.40217 0.57192 1.48351 0.606859C1.56484 0.641798 1.63841 0.692586 1.6999 0.75626L4.9999 4.05626L8.2999 0.75626C8.42564 0.634821 8.59404 0.567625 8.76884 0.569144C8.94363 0.570663 9.11084 0.640775 9.23445 0.76438C9.35805 0.887986 9.42817 1.05519 9.42969 1.22999C9.43121 1.40479 9.36401 1.57319 9.24257 1.69893L5.47124 5.47026Z" fill={color} />
        </svg>

    )
}