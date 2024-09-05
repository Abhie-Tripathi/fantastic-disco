'use client'
import React from 'react'
import styles from './typocontainer.style.module.css'

interface Props {
    setPreview: (value: string) => void
}

const TypoContainer = ({ setPreview }: Props) => {
    // const scrollRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     const handleScroll = (event: WheelEvent) => {
    //         if (scrollRef.current) {
    //             event.preventDefault();
    //             scrollRef.current.scrollLeft += event.deltaY;
    //         }
    //     };

    //     const refCurrent = scrollRef.current;
    //     if (refCurrent) {
    //         refCurrent.addEventListener('wheel', handleScroll);
    //     }

    //     return () => {
    //         if (refCurrent) {
    //             refCurrent.removeEventListener('wheel', handleScroll);
    //         }
    //     };
    // }, []);
    const fonts = ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", "Arial", "sans-serif", "Times New Roman"]
    return (
        <div className={styles.body} >
            <div className={styles.heading}>Brand Typography</div>
            <div className={styles.fontFamily}>
                {fonts.map((font, key) => (
                    <div className={styles.font} key={key}>
                        <span>{font}</span>
                        <div className={styles.deleteBtn}><DeleteIcon /></div>
                    </div>
                ))}
                <div className={styles.addColor}>
                    <AddIcon />
                </div>
            </div>
        </div>
    )
}

export default TypoContainer

function AddIcon() {
    return (
        <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="18.8984" width="8.1" height="45" fill="#EADDFF" />
            <rect y="27" width="8.1" height="45" transform="rotate(-90 0 27)" fill="#EADDFF" />
        </svg>
    )
}

function DeleteIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" fill="black" /></svg>
    )
}