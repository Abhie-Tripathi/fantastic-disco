import React, { useState } from 'react'
import Styles from './focusAndType.style.module.css'

const FocusAndTypes = ({ focus, setFocus, type, setType }) => {
  return (
    <div className={Styles.focus_type_container}>
      <div className={Styles.button_container}>
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
    </div>
  );
}

export default FocusAndTypes
