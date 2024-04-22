'use client'
import React, { useState } from 'react'
import TagIcon from '/public/tag.svg'
import Image from 'next/image'
import styles from './tags.style.module.css'
import Tag from './Tag'
import AddIcon from '/public/add.svg'

const Tags = () => {
    const [tagsList, setTagsList] = useState<string[]>([])
    const [inputTag, setInputTag] = useState<string>("")

    const handleAddTag = () => {
        setTagsList([...tagsList, inputTag])
        setInputTag("")
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTagsList(tagsList.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className={styles.tagsContainer}>
            <div className={styles.tag_title}>
                <div>Tags</div>
                <Image src={TagIcon} alt="tagIcon" />
            </div>
            <div className={styles.innerContainer}>
                <div className={styles.inputContainer}>
                    <input type="text" placeholder='Enter Tag' className={styles.tagInput} value={inputTag} onChange={(e) => setInputTag(e.target.value)} />
                    <button className={styles.addBtn} type='button' onClick={handleAddTag}><Image src={AddIcon} alt='add'/></button>
                </div>
                <div className={styles.tagsList}>
                    {tagsList.map((tag, key) => (
                        <Tag key={key} name={tag} onRemove={() => handleRemoveTag(tag)} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Tags