import React, { useState } from 'react'
import styles from './dropdown.style.module.css'
import { Editor, EditorState } from "react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"; // Import editor styles
import draftToHtml from "draftjs-to-html";

interface Props {
    setInputMessage: (value: string) => void
    inputMessage: string;
    setParticipationType: (value: string) => void
    participationType: string;
    size : string;
}

const ParticipationDropdown = ({ setInputMessage, inputMessage, setParticipationType, participationType,size }: Props) => {

    const [editorState, setEditorState] = useState<any>();
    const onEditorStateChange = (state: EditorState) => {
        setEditorState(state);
        // Convert editor content to HTML and set text value
        const htmlContent = draftToHtml(convertToRaw(state.getCurrentContent()));
        setInputMessage(htmlContent);
    };

    return (
        <div className={styles.body}>
            <div className={styles.participationTypes}>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={participationType === "Attendee"}
                        onChange={() => setParticipationType("Attendee")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Attendee</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={participationType === "Speaker"}
                        onChange={() => setParticipationType("Speaker")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Speaker</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={participationType === "Exhibitor"}
                        onChange={() => setParticipationType("Exhibitor")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Exhibitor</span>
                </label>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={participationType === "Organiser"}
                        onChange={() => setParticipationType("Organiser")}
                    />
                    <span className={styles.customCheckbox}></span>
                    <span className={styles.checkboxLabel}>Organiser</span>
                </label>
            </div>
           <div className={styles.messageContainer}>
                <div className={styles.heading}>Customize your message</div>
                {/* <Editor
                    editorState={editorState}
                    toolbar={{
                        options: ["inline", "colorPicker"],
                        inline: {
                            options: ["bold", "italic", "underline"],
                            bold: { className: "toolbar-btn" },
                            italic: { className: "toolbar-btn" },
                            underline: { className: "toolbar-btn" },
                        },
                        colorPicker: { className: "toolbar-btn" }
                    }}
                    onEditorStateChange={onEditorStateChange}
                    editorClassName={styles.editor}
                    toolbarClassName={styles.toolbar}
                    wrapperClassName={styles.wrapper}   
                /> */}
            </div>
        </div>
    )
}

export default ParticipationDropdown