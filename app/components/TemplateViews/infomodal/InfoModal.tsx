import React from 'react'
import styles from './infomodal.style.module.css'

const InfoModal = () => {
    return (
        <div className={styles.body}>
            <p>**Existing Widget Detected**</p>
            <p>
                You already have a widget saved in the draft with this widget type. Adding this widget will replace the previously saved widget of the same type.
            </p>
            <p>
                Would you like to:
                <ul>
                    <li><strong>Continue:</strong> Replace the existing widget with the new one.</li>
                    <li><strong>Cancel:</strong> Keep the existing widget and try saving a widget with a different type.</li>
                </ul>
            </p>
            <div className={styles.btns}>
                <button>Continue</button>
                <button>Cancel</button>
            </div>
        </div>
    )
}

export default InfoModal