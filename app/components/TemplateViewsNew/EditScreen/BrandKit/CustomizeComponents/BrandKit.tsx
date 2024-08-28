import React, { useState } from 'react'
import styles from './brandkit.style.module.css'
import LogoComponent from './LogoComponent'
import BrandColor from './BrandColor'
import BrandkitTypography from './BrandkitTypography';
import { useTheme } from '@/context';

interface Props {
    extractedColors: string[];
    setExtractedColors: (value: string[]) => void
    flex: boolean
    setPageBgColor: (value: string) => void
    pageBgColor: string;
    eventFont: string;
    setEventFont: (value: string) => void
}

const BrandKit = ({ extractedColors, setExtractedColors, flex, setPageBgColor, pageBgColor, eventFont, setEventFont }: Props) => {

    const { theme } = useTheme()
    const [accordian, setAccordian] = useState<boolean>(true)

    const [valueUpdate, setValueUpdated] = useState<boolean>(false) // To activate the save kit button

    return (
        <div className={theme === "dark" ? styles.darkBody : styles.lightBody} style={{ padding: flex ? "12px 36px 17px 23px" : 0 }}>
            <div className={styles.header} style={{ padding: flex ? 0 : "12px 19px" }} onClick={() => setAccordian(!accordian)}>
                <div className={styles.heading} >
                    <StarIcon color={theme === "light" ? "black" : "white"} />
                    <span>Brand Kit</span>
                </div>
                {accordian ?
                    <div className={styles.btn} onClick={() => setAccordian(false)}><UpArrow color={theme === "light" ? "black" : "white"} /></div> : <div className={styles.btn} onClick={() => setAccordian(true)}><DownArrow color={theme === "light" ? "black" : "white"} /></div>}
            </div>
            {accordian && <div className={styles.accordian} style={{ marginTop: flex ? 24 : 0 }}>
                <div className={styles.logoContainer} style={{ padding: flex ? 0 : "12px 19px" }}>
                    <LogoComponent flex={flex} />
                </div>
                {!flex && <div className={styles.line}></div>}
                <div className={styles.brandColorContainer} style={{ padding: flex ? 0 : "12px 19px", marginTop: flex ? 36 : 0 }}>
                    <BrandColor setPageBgColor={setPageBgColor} pageBgColor={pageBgColor} flex={flex} setValueUpdated={setValueUpdated} setExtractedColors={setExtractedColors} extractedColors={extractedColors} />
                </div>
                {!flex && <div className={styles.line}></div>}
                <div className={styles.fontContainer} style={{ padding: flex ? 0 : "12px 19px", marginTop: flex ? 36 : 0 }}>
                    <BrandkitTypography flex={flex} setEventFont={setEventFont} eventFont={eventFont}/>
                </div>
                <div className={styles.btnContainer} style={{ padding: flex ? 0 : "12px 19px" }}>
                    <button className={`${styles.kitBtn} ${valueUpdate ? styles.activeBtn : styles.deactiveBtn}`}>Save Kit</button>
                </div>
            </div>}
        </div>
    )
}

export default BrandKit


interface IconProps {
    color: string;
}
function StarIcon({ color }: IconProps) {
    return (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.50044 8.79336L8.09419 10.3621C8.56919 10.6496 9.15044 10.2246 9.02544 9.68711L8.33794 6.73711L10.6317 4.74961C11.0504 4.38711 10.8254 3.69961 10.2754 3.65586L7.25669 3.39961L6.07544 0.612109C5.86294 0.105859 5.13794 0.105859 4.92544 0.612109L3.74419 3.39336L0.725442 3.64961C0.175442 3.69336 -0.0495579 4.38086 0.369192 4.74336L2.66294 6.73086L1.97544 9.68086C1.85044 10.2184 2.43169 10.6434 2.90669 10.3559L5.50044 8.79336Z" fill={color} />
        </svg>
    )
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