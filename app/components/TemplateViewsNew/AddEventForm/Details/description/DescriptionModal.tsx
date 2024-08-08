import React from 'react'
import styles from './modal.style.module.css'

interface Props{
    setDescriptionModal : (value : boolean)=>void
    handleDescClick : ()=>void
    setTextValue : (value : string)=>void
    textValue :string
}

const DescriptionModal = ({setDescriptionModal,handleDescClick,setTextValue,textValue}:Props) => {
    return (
        <div className={styles.descriptionModal}>
            <div><span>Add your description</span><span className={styles.close} onClick={() => setDescriptionModal(false)}>Close</span></div>
            <textarea onChange={(e) => setTextValue(e.target.value)} value={textValue} />
            <button onClick={handleDescClick}>Save</button>
        </div>
    )
}

export default DescriptionModal