import React,{useState} from 'react'
import AddTagsModal from './AddTagsModal';
import TagIcon from "../../icons/tag.svg";
import Cross from "../../icons/cross.svg";
import Add from "../../icons/plus.svg";
import Styles from './tags.style.module.css'
const Tag = ({ name, setState, state }) => {
    return (
      <div
        className={Styles.tag}
        onClick={() => setState(state.filter((tag) => tag !== name))}
      >
        <img src={Cross} alt="Cross"/>
        <div>{name}</div>
      </div>
    );
  };
const Tags = ({ tagList, setTagList, isAdd }) => {
    console.log(tagList)
    const [savedData, setSavedData] = useState([]);
    const [showAddTagsModal, setShowAddTagsModal] = useState(false);
  
    const handleCloseAddTagsModal = () => {
      setShowAddTagsModal(false);
    };
  
    const handleSaveData = (data) => {
      setTagList([...savedData, ...data]);
    };
  
    return (
      <div className={Styles.tag_container}>
        <div className={Styles.tag_title}>
          <div>Tags</div>
         <img src={TagIcon} alt="tagIcon"/>
        </div>
        <div className={Styles.border_container}>
          <div className={Styles.tagButtons_container}>
            {tagList?.map((tag) => (
              <Tag name={tag} key={tag} setState={setTagList} state={tagList} />
            ))}
  
            {isAdd && (
              <div
              className={Styles.small_Button}
                onClick={() => {
                  setShowAddTagsModal(true);
                }}
              >
                <img src={Add} alt="add"/>
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
    )
}

export default Tags;
