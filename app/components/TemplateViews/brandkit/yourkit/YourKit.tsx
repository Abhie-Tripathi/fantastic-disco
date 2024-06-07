'use client'
import React, { useState } from 'react'
import styles from './yourkit.style.module.css'
import DefaultKit from './defaultkit/DefaultKit';

const YourKit = () => {

    const [activeKit, setActiveKit] = useState<string | null>(null);

    const handleBack = () => {
        setActiveKit(null);
    };

    return (
        <div className={styles.body}>
            {!activeKit && <div className={styles.kitContainer}>
                <div className={styles.kitItem} onClick={() => setActiveKit("default")}>Default Kit</div>
                <div className={styles.kitItem} onClick={() => setActiveKit("kit2")}>Kit 2</div>
                <div className={styles.kitItem} onClick={() => setActiveKit("kit3")}>Kit 3</div>
            </div>}
            {activeKit && <div className={styles.kitPreview}>
                <div className={styles.heading_btnContainer}>
                    <div className={styles.kitName}>Kit Name</div>
                    <div className={styles.backBtn} onClick={handleBack}>Back</div>
                </div>
                {activeKit === "default" ? <DefaultKit kitName="default"/> :
                activeKit === "kit2" ? <DefaultKit kitName='kit2'/> :
                activeKit === "kit3" ? <DefaultKit kitName='kit3'/> :<></>}

            </div>}
        </div>
    )
}

export default YourKit