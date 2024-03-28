import React,{useState} from 'react'
import Styles from './focusAndType.style.module.css'

const FocusAndTypes = ({ focus, setFocus, type, setType }) => {
    return (
        <div>
          <div className={Styles.focus_type_container}>
            {/* <div className="button_container">
              <div>Focus</div>
              <button state={focus} setState={setFocus}>Product</button>
              <button state={focus} setState={setFocus}>Service</button>
              {focusError && <div className={styles.error}>{focusError}</div>}
            </div> */}
            <div className={Styles.button_container}>
              {/* <div>Type</div> */}
              <div style={{display:"flex",gap:"10px"}}>
              <div className={`${Styles.button} ${type === "Sticky" ? Styles.active : ""}`}
                    onClick={() => setType("Sticky")}>
                    <div>Sticky</div>
              </div>
                <div className={`${Styles.button} ${type === "Section" ? Styles.active : ""}`}
                onClick={() => setType("Section")}>
                <div>Section</div>
                </div>
             <div className={`${Styles.button} ${type === "Full Width" ? Styles.active : ""}`}
                onClick={() => setType("Full Width")}>
                <div>Page</div>
            </div>
              </div>
              {/* {typeError && <div className={styles.error}>{typeError}</div>} */}
            </div>
          </div>
        </div>
      );
}

export default FocusAndTypes
