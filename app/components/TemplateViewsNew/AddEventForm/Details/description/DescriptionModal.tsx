// import React from 'react'
// import styles from './modal.style.module.css'

// interface Props{
//     setDescriptionModal : (value : boolean)=>void
//     handleDescClick : ()=>void
//     setTextValue : (value : string)=>void
//     textValue :string
// }

// const DescriptionModal = ({setDescriptionModal,handleDescClick,setTextValue,textValue}:Props) => {
//     return (
//         <div className={styles.descriptionModal}>
//             <div><span>Add your description</span><span className={styles.close} onClick={() => setDescriptionModal(false)}>Close</span></div>
//             <textarea onChange={(e) => setTextValue(e.target.value)} value={textValue} />
//             <button onClick={handleDescClick}>Save</button>
//         </div>
//     )
// }

// export default DescriptionModal
import { Editor } from "react-draft-wysiwyg";
import styles from './modal.style.module.css'
import { ContentState, EditorState, convertFromHTML, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"; // Import editor styles
import { useEffect, useState } from "react";
import draftToHtml from "draftjs-to-html";

interface Props {
    setDescriptionModal: (value: boolean) => void;
    handleDescClick: () => void;
    setTextValue: (value: string) => void;
    textValue: string;
}

const DescriptionModal = ({
    setDescriptionModal,
    handleDescClick,
    setTextValue,
    textValue
}: Props) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const onEditorStateChange = (state: EditorState) => {
        setEditorState(state);
        // Convert editor content to HTML and set text value
        const htmlContent = draftToHtml(convertToRaw(state.getCurrentContent()));
        setTextValue(htmlContent);
    };

    return (
        <div className={styles.descriptionModal}>
            <div className={styles.header}>
                <span>Add your description</span>
                <span className={styles.close} onClick={() => setDescriptionModal(false)}>Close</span>
            </div>
            <Editor
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
            />

            <button onClick={handleDescClick}>Save</button>
        </div>
    );
};

export default DescriptionModal;
