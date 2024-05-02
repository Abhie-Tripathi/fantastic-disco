'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import crossIcon from "/public/close.svg";
import styles from './tags.style.module.css'
import searchIcon from '/public/internal/SearchInput.svg'
import AddIcon from '/public/add.svg'

interface TagProps {
  name: string;
  onRemove: () => void;
}

const Tag = ({ name, onRemove }: TagProps) => {
  return (
    <div className={styles.tagItem}>
      <Image src={crossIcon} alt="Cross" onClick={onRemove} height={14} width={14} />
      <div>{name}</div>
    </div>
  )
}

const Tags = () => {
  const [tagsList, setTagsList] = useState<string[]>([])
  const [inputTag, setInputTag] = useState<string>("")

  const handleTagsSubmit = () => {
    if (inputTag && inputTag.trim() != '') {
      setTagsList([...tagsList, inputTag.trim()])
      setInputTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTagsList(tagsList.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTagsSubmit();
    }
  }

  return (
    <div className={`${styles.tagsOuterContainer}`}>
      <div className={styles.inputInnerContainer} style={{ border: "none" }} >
        <Image src={searchIcon} alt="clock" width={20} height={20} />
        <input type='text' placeholder="Search Tags" value={inputTag} onChange={(e) => setInputTag(e.target.value)} onKeyDown={handleKeyDown} />
        <button type='button' onClick={handleTagsSubmit} className={styles.addBtn}><Image src={AddIcon} alt='add' /></button>
      </div>
      <div className={styles.tagsContainer} >
        {tagsList.map((tag, key) => (
          <Tag key={key} name={tag} onRemove={() => handleRemoveTag(tag)} />
        ))}
      </div>
    </div>
  )
}

export default Tags