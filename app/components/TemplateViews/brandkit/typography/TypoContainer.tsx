'use client'
import React, { useEffect, useRef } from 'react'
import styles from './typocontainer.style.module.css'

interface Props {
    setPreview: (value: string) => void
}

const TypoContainer = ({ setPreview }: Props) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            if (scrollRef.current) {
                event.preventDefault();
                scrollRef.current.scrollLeft += event.deltaY;
            }
        };

        const refCurrent = scrollRef.current;
        if (refCurrent) {
            refCurrent.addEventListener('wheel', handleScroll);
        }

        return () => {
            if (refCurrent) {
                refCurrent.removeEventListener('wheel', handleScroll);
            }
        };
    }, []);
    const fonts = ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", "Arial", "sans-serif", "Times New Roman"]
    return (
        <div className={styles.body} >
            <div className={styles.heading}>Brand Typography</div>
            <div className={styles.fontFamily} ref={scrollRef}>
                {fonts.map((font, key) => (
                    <div className={styles.font} key={key}>
                        <span>{font}</span>
                    </div>
                ))}
                {/* <div className={styles.addColor}>
                    <AddIcon />
                </div> */}
            </div>
        </div>
    )
}

export default TypoContainer