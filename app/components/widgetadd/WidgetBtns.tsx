import React from 'react'
import styles from './widgetbtns.style.module.css'

interface WidgetBtnsProps {
    type: string;
    setType: React.Dispatch<React.SetStateAction<string>>;

}
const WidgetBtns: React.FC<WidgetBtnsProps> = ({ type,setType}:WidgetBtnsProps) => {
    return (
        <div className={styles.button_container}>
            <div className={`${styles.button} ${type === "Sticky" ? styles.active : ""}`}
                onClick={() => setType("Sticky")}
                >
                <div>Sticky</div>
            </div>
            <div className={`${styles.button} ${type === "Section" ? styles.active : ""}`}
                onClick={() => setType("Section")}
                >
                <div>Section</div>
            </div>
            <div className={`${styles.button} ${type === "Page" ? styles.active : ""}`}
                onClick={() => setType("Page")}
                >
                <div>Page</div>
            </div>
            <div className={`${styles.button} ${type === "Popup" ? styles.active : ""}`}
                onClick={() => setType("Popup")}
                >
                <div>Popup</div>
            </div>
        </div>
    )
}

export default WidgetBtns