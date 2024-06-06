import React from 'react'
import styles from './widgetbtns.style.module.css'

interface WidgetBtnsProps {
    widgetSelected?: string;
    // setType?: React.Dispatch<React.SetStateAction<string>>;
    
}
const WidgetBtns: React.FC<WidgetBtnsProps> = ({ widgetSelected }) => {
    return (
        <div className={styles.button_container}>
            <div className={`${styles.button} ${widgetSelected === "Sticky" ? styles.active : ""}`}
                // onClick={() => setType("Sticky")}
                >
                <div>Sticky</div>
            </div>
            <div className={`${styles.button} ${widgetSelected === "Section" ? styles.active : ""}`}
                // onClick={() => setType("Section")}
                >
                <div>Section</div>
            </div>
            <div className={`${styles.button} ${widgetSelected === "Page" ? styles.active : ""}`}
                // onClick={() => setType("Page")}
                >
                <div>Page</div>
            </div>
            <div className={`${styles.button} ${widgetSelected === "Popup" ? styles.active : ""}`}
                // onClick={() => setType("Popup")}
                >
                <div>Popup</div>
            </div>
        </div>
    )
}

export default WidgetBtns