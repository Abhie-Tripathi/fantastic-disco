'use client'
import React, { useState } from 'react'
import styles from './tags.style.module.css'
import AddTagsModal from './AddTagsModal';
import TagIcon from "/public/tag.svg";
import Cross from "/public/cross.svg";
import Add from "/public/plus.svg";
import Image from 'next/image';

interface TagProps {
    name: string;
    setState: React.Dispatch<React.SetStateAction<string[]>>;
    state: string[];
}
const Tag: React.FC<TagProps> = ({ name, setState, state }) => {
    return (
        <div
            className={styles.tag}
            onClick={() => setState(state.filter((tag) => tag !== name))}
        >
            <Image src={Cross} alt="Cross" />
            <div>{name}</div>
        </div>
    );
};

interface TagsProps {
    tagList: string[];
    setTagList: React.Dispatch<React.SetStateAction<string[]>>;
    isAdd: boolean;
}

const Tags: React.FC<TagsProps> = ({ tagList, setTagList, isAdd }) => {
    const [savedData, setSavedData] = useState<string[]>([]);
    const [showAddTagsModal, setShowAddTagsModal] = useState<boolean>(false);
    const handleCloseAddTagsModal = () => {
        setShowAddTagsModal(false);
    };

    const handleSaveData = (data: string[]) => {
        setTagList([...savedData, ...data]);
    };
    return (
        <div className={styles.tag_container}>
            <div className={styles.tag_title}>
                <div>Tags</div>
                <Image src={TagIcon} alt="tagIcon" />
            </div>
            <div className={styles.border_container}>
                <div className={styles.tagButtons_container}>
                    {tagList?.map((tag) => (
                        <Tag key={tag} name={tag} setState={setTagList} state={tagList} />
                    ))}

                    {isAdd && (
                        <div
                            className={styles.small_Button}
                            onClick={() => {
                                setShowAddTagsModal(true);
                            }}
                        >
                            <Image src={Add} alt="add" />
                        </div>
                    )}
                </div>

                {showAddTagsModal && (
                    <AddTagsModal
                        onClose={handleCloseAddTagsModal}
                        isOpen={showAddTagsModal}
                        tagList={tagList}
                        onSave={handleSaveData}
                    />
                )}
            </div>
        </div>
    );
}

export default Tags