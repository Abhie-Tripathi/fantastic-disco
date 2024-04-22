'use client'
import React, { useState } from 'react'
import TagIcon from '/public/tag.svg'
import Image from 'next/image'
import styles from './tags.style.module.css'
import Tag from './Tag'

const Tags = () => {
    const [tagsList, setTagsList] = useState<string[]>([])
    const [inputTag, setInputSet] = useState<string>("")

    const handleAddTag = () => {
        setTagsList([...tagsList, inputTag])
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
            <div className={styles.border_container}>
                <div className={styles.tagsList}>
                    {tagsList.map((tag, key) => (
                        <Tag name={tag} onRemove={()=>handleRemoveTag(tag)}  />
                    ))}
                </div>
                <input type="text" placeholder='Enter Tag' className={styles.tagInput} value={inputTag} onChange={(e) => setInputSet(e.target.value)} />
                <button className={styles.addBtn} type='button' onClick={handleAddTag}>+ Add</button>
            </div>
        </div>
    )
}

export default Tags