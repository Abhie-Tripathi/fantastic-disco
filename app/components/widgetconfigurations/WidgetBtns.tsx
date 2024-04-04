import React from 'react'
import styles from './widgetbtns.style.module.css'

interface WidgetBtnsProps {
    type: string;
    setType: React.Dispatch<React.SetStateAction<string>>;
}
const WidgetBtns: React.FC<WidgetBtnsProps> = ({ type, setType }) => {
    return (
        <div className={styles.focus_type_container}>
            <div className={styles.button_container}>
                <div className={`${styles.button} ${type === "Sticky" ? styles.active : ""}`}
                    onClick={() => setType("Sticky")}>
                    <div>Sticky</div>
                </div>
                <div className={`${styles.button} ${type === "Section" ? styles.active : ""}`}
                    onClick={() => setType("Section")}>
                    <div>Section</div>
                </div>
                <div className={`${styles.button} ${type === "Full Width" ? styles.active : ""}`}
                    onClick={() => setType("Full Width")}>
                    <div>Page</div>
                </div>
            </div>
        </div>
    )
}

export default WidgetBtns