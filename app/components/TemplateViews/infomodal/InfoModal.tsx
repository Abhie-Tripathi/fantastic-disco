import React from 'react'
import styles from './infomodal.style.module.css'

interface ModalProps{
    setInfoModal : (vaule : boolean)=>void
    preview : string;
    widgetSelected : string;
    setDraftWidgets: (widgets: DraftWidget[]) => void;
    draftWidgets : DraftWidget[]
}
interface DraftWidget {
    widgetType: string;
    preview: string;
  }
  

const InfoModal = ({setInfoModal, preview, widgetSelected, setDraftWidgets, draftWidgets} : ModalProps) => {

    const handleContinue = () => {
        const updatedWidgets = draftWidgets.map(widget =>
          widget.widgetType === widgetSelected ? { ...widget, preview } : widget
        );
        setDraftWidgets(updatedWidgets);
        setInfoModal(false);
      };

    return (
        <div className={styles.body}>
            <div className={styles.heading}>**Existing Widget Detected**</div>
            <p className={styles.desc}>
                You already have a widget saved in the draft with this widget type. Adding this widget will replace the previously saved widget of the same type.
            </p>
            <div className={styles.btns}>
                <div className={styles.btn} data-name="Replace the existing widget with the new one" onClick={handleContinue}>Continue</div>
                <div className={styles.btn} data-name="Keep the existing widget and try saving a widget with a different type" onClick={()=>setInfoModal(false)}>Cancel
                </div>
            </div>
        </div>
    )
}

export default InfoModal