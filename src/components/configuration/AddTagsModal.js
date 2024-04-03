import React,{useState} from 'react'
import Styles from './addTagModal.style.module.css'
import CrossSVG from "../../icons/cross.svg";
import Tags from './Tags';
const AddTagsModal = ({ isOpen, onClose, tagList, onSave }) => {
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
          <img src={CrossSVG} onClick={onClose} className={Styles.closeButton} />
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
          <Tags tagList={newTag} setTagList={setNewTags}/>
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
