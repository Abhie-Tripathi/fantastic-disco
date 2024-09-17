// import React from 'react'
// import styles from './modal.style.module.css'
// import { showToast } from "@/utils/showToast";

// interface Props {
//     setDescriptionModal: (value: boolean) => void
//     handleDescClick: () => void
//     setTextValue: (value: string) => void
//     textValue: string
// }

// const DescriptionModal = ({ setDescriptionModal, handleDescClick, setTextValue, textValue }: Props) => {

//     const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         let value = e.target.value;

//         const specialCharRegex = /[@#$%^&*"|<>]/g;

//         if (specialCharRegex.test(value)) {
//             showToast("error", "Please check, input should not contain any special character");
//         } else {
//             setTextValue(value);
//         }
//     };

//     return (
//         <div className={styles.descriptionModal}>
//             <div className={styles.header}>
//                 <span>Add your description</span>
//                 <span className={styles.close} onClick={() => setDescriptionModal(false)}>Close</span>
//             </div>
//             <textarea onChange={(e) => { handleInputChange(e) }} value={textValue} maxLength={1500} />
//             <button className={styles.saveBtn} onClick={handleDescClick}>Save</button>
//         </div>
//     )
// }

// export default DescriptionModal

// import React, { useState } from "react";
// import { Editor, EditorState, RichUtils, ContentState, convertToRaw, convertFromHTML } from "draft-js";
// import "draft-js/dist/Draft.css"; // Ensure Draft.js styles are imported
// import draftToHtml from "draftjs-to-html";
// import styles from "./modal.style.module.css"; // Your CSS file

// interface Props {
//     setDescriptionModal: (value: boolean) => void;
//     handleDescClick: () => void;
//     setTextValue: (value: string) => void;
//     textValue: string;
// }

// const DescriptionModal = ({
//     setDescriptionModal,
//     handleDescClick,
//     setTextValue,
//     textValue
// }: Props) => {
//     const [selectedBtns, setSelectedBtns] = useState<string[]>([]);
//     // Initialize editor state, loading existing HTML if available
//     const [editorState, setEditorState] = useState(() => {
//         if (textValue) {
//             const blocksFromHTML = convertFromHTML(textValue);
//             const contentState = ContentState.createFromBlockArray(
//                 blocksFromHTML.contentBlocks,
//                 blocksFromHTML.entityMap
//             );
//             return EditorState.createWithContent(contentState);
//         } else {
//             return EditorState.createEmpty();
//         }
//     });

//     // Handle editor state changes
//     const onEditorStateChange = (newState: EditorState) => {
//         setEditorState(newState);

//         // Convert the content to raw format, then to HTML
//         const contentState = newState.getCurrentContent();
//         const rawContent = convertToRaw(contentState);
//         const htmlContent = draftToHtml(rawContent);

//         // Update parent component's state with HTML
//         setTextValue(htmlContent);
//     };

//     // Handle inline formatting (e.g., bold, italic)
//     const handleKeyCommand = (command: string) => {
//         const newState = RichUtils.handleKeyCommand(editorState, command);
//         if (newState) {
//             setEditorState(newState);
//             return "handled";
//         }
//         return "not-handled";
//     };

//     // Function to apply inline styles (e.g., bold, italic, underline)
//     const toggleInlineStyle = (style: string) => {
//         const isActive = selectedBtns.includes(style);

//         // Toggle the style in the array
//         const newSelectedBtns = isActive
//             ? selectedBtns.filter(btn => btn !== style)
//             : [...selectedBtns, style];
//         setSelectedBtns(newSelectedBtns);
//         setEditorState(RichUtils.toggleInlineStyle(editorState, style));
//     };
//     return (
//         <div className={styles.descriptionModal}>
//             <div className={styles.header}>
//                 <span>Add your description</span>
//                 <span className={styles.close} onClick={() => setDescriptionModal(false)}>Close</span>
//             </div>

//             {/* Toolbar for inline styles */}
//             <div className={styles.toolbar}>
//                 <button className={selectedBtns.includes("BOLD") ? styles.activeBtn : ""}  onClick={() => toggleInlineStyle("BOLD")}>Bold</button>
//                 <button className={selectedBtns.includes("ITALIC") ? styles.activeBtn : ""}  onClick={() => toggleInlineStyle("ITALIC")}>Italic</button>
//                 <button className={selectedBtns.includes("UNDERLINE") ? styles.activeBtn : ""}  onClick={() => toggleInlineStyle("UNDERLINE")}>Underline</button>
//             </div>

//             {/* Draft.js Editor Component */}
//             <div className={styles.editorWrapper}>
//                 <Editor
//                     editorState={editorState}
//                     handleKeyCommand={handleKeyCommand}
//                     onChange={onEditorStateChange}
//                     placeholder="Write something..."
//                 />
//             </div>

//             <button className={styles.saveBtn} onClick={handleDescClick}>Save</button>
//         </div>
//     );
// };

// export default DescriptionModal;

// components/QuillEditor.tsx
'use client'
import React, { useEffect, useRef, useState } from "react";
import { showToast } from "@/utils/showToast";
import styles from './modal.style.module.css'
import "quill/dist/quill.snow.css";
interface Props {
    setDescriptionModal: (value: boolean) => void;
    handleDescClick: () => void;
    setTextValue: (value: string) => void;
    textValue: string;
}

const DescriptionModal: React.FC<Props> = ({
    setDescriptionModal,
    handleDescClick,
    setTextValue,
    textValue
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [editor, setEditor] = useState<any>(null);
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d-\s]{7,14}/;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

    const handleInputChange = (value: string) => {
        setTextValue(value);
    }
    const handleSave = () => {
        // Check for phone numbers and emails
        if (phoneRegex.test(textValue)) {
            showToast("error", "Please do not include phone numbers in the description.");
            return; // Prevent save
        }
        if (emailRegex.test(textValue)) {
            showToast("error", "Please do not include email addresses in the description.");
            return; // Prevent save
        }

        // If no invalid content is found, proceed with saving
        handleDescClick();
    };
    useEffect(() => {
        const loadQuillEditor = async () => {
            // Dynamically import Quill on the client side
            const Quill = (await import('quill')).default;

            if (editorRef.current) {
                const quillEditor = new Quill(editorRef.current, {
                    theme: 'snow',
                    modules: {
                        toolbar: [
                            [{ 'size': ['small', 'medium', 'large', 'huge'] }],
                            ['bold', 'italic', 'underline'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['link'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }],
                        ]
                    },
                    placeholder: 'Write something...'
                });

                setEditor(quillEditor);

                // Load initial content
                if (textValue) {
                    quillEditor.root.innerHTML = textValue;
                }
                // Listen to text change
                quillEditor.on('text-change', () => {
                    handleInputChange(quillEditor.root.innerHTML)
                });
            }
        };

        if (typeof window !== "undefined") {
            loadQuillEditor();
        }
    }, []);

    return (
        <div className={styles.descriptionModal}>
            <div className={styles.header}>
                <span>Add your description</span>
                <span className={styles.close} onClick={() => setDescriptionModal(false)}>Close</span>
            </div>
            <div ref={editorRef} style={{ height: '300px' }}></div>
            <button className={styles.saveBtn} onClick={handleSave}>Save</button>
        </div>
    );
};

export default DescriptionModal;
