'use client'
import React,{useState} from 'react'
import Styles from './addtagsmodal.style.module.css'
import CrossSVG from '/public/cross.svg';
import Tags from './Tags';
import Image from 'next/image';

interface AddTagsModalProps {
    onClose: () => void;
    isOpen: boolean;
    tagList: string[];
    onSave: (data: string[]) => void;
  }

const AddTagsModal = ({ isOpen, onClose, tagList, onSave } : AddTagsModalProps) => {
    const [tagInput, setTagInput] = useState("");
    const [newTag, setNewTags] = useState([...tagList]);
  
    const handleClick = () => {
      if(tagInput.length!==0){
      setNewTags([...newTag, tagInput]);
      setTagInput("");
      }
    };
  
    const handleSave = () => {
      onSave(newTag);
    };
  return (
    <div
    className={`${Styles.modal} ${isOpen ? Styles.visible : ""}`}
      onClick={onClose}
    >
      <div className={Styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={Styles.circular_div}>
          <Image src={CrossSVG} onClick={onClose} className={Styles.closeButton} alt=""/>
        </div>
        <div className={Styles.outerContainer}>
          <input
            placeholder="Type here to add new tags"
            className={Styles.input}
            onChange={(e) => setTagInput(e.target.value)}
            value={tagInput}
          />
          <div
            className={Styles.add_button}
            onClick={() => {
              handleClick();
            }}
          >
            Add
          </div>
        </div>

        <div className={Styles.tagsContainer}>
          <Tags tagList={newTag} setTagList={setNewTags} isAdd={false}/>
        </div>
        <div
          className={Styles.save_button}
          onClick={() => {
            handleSave();
            onClose();
          }}
        >
          Done
        </div>
      </div>
    </div>
  );
}

export default AddTagsModal
