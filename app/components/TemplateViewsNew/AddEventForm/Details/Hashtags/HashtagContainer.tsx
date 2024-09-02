import React, { useState } from 'react'
import styles from './hashtag.style.module.css'
import Image from 'next/image';
import AiIcon from '/public/AiIcon.svg'
import EditIcon from '/public/EditIcon.svg'

interface Props {
    hashtags: string[];
    setHashtags: (value: string[]) => void
    loadingState: boolean;
    handleTagsGenerate: (value: void) => void
}

const HashtagContainer = ({ hashtags, setHashtags, loadingState, handleTagsGenerate }: Props) => {

    const [showInput, setShowInput] = useState<boolean>(false)
    const [newTag, setNewTag] = useState<string>("");

    const handleGenerateClick = () => {
        handleTagsGenerate()
    }
    const handleTagDelete = (index: number) => {
        const updatedHashtags = hashtags.filter((_, i) => i !== index);
        setHashtags(updatedHashtags);
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTag(e.target.value);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTag.trim() !== "") {
            setHashtags([...hashtags, newTag.trim()]);
            setNewTag(""); // Clear the input field
            setShowInput(false); // Hide the input field
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.hashtagsContainer}>
                {loadingState ? <div className={styles.tagsLoader}><div className={styles.tagSpinner}></div></div> :
                    hashtags.length === 0 ? "Enter Event name and description to auto generate the hashtags" :
                        hashtags.map((tag, key) => (
                            <div key={key} className={styles.hashtag}>
                                <span onClick={() => handleTagDelete(key)} className={styles.deleteIcon}>x</span><span>{tag}</span>
                            </div>
                        ))
                }
                {(hashtags.length < 5) && (hashtags.length > 0) && (!showInput) && <button onClick={() => setShowInput(true)} className={styles.addBtn}>+</button>}
                {(showInput && hashtags.length < 5) && (
                    <form className={styles.inputContainer} onSubmit={handleFormSubmit}>
                        <span>#</span>
                        <input
                        maxLength={30}
                            type="text"
                            value={newTag}
                            onChange={handleInputChange}
                            autoFocus
                            className={styles.tagInput}
                        />
                    </form>
                )}
            </div>
            {hashtags.length > 0 && <div onClick={handleGenerateClick} data-name="Generate Your Banner" className={styles.hashtagButton}>
                <Image src={AiIcon} alt='aigenerate' className={styles.aiIcon} width={15} height={15}></Image>
            </div>}
        </div>
    )
}

export default HashtagContainer