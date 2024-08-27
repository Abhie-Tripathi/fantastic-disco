"use client";
import React, { useRef, useState, useEffect } from "react";
import styles from "./EventKeyword.module.css";
import Image from "next/image";
import SearchIcon from "/public/search.svg";
import CloseIcon from "/public/internal/cross.svg";
import useClickOutside from "@/hooks/useClickOutside";
import { useTheme } from "@/context";

interface EventKeywordProps {
  state: string[];
  setState: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
  type?:boolean;
  isMandatory?:boolean;
  setIsMandatory?:any;
}

const EventKeyword = ({
  state,
  setState,
  onClose,
  type,
  isMandatory,
  setIsMandatory
}: EventKeywordProps) => {
  const [activeTab, setActiveTab] = useState<string>("Keywords");
  const [inputText, setInputText] = useState<string>("");
  const [eventKeyword, setEventKeyword] = useState<string[]>(state);
  const [positiveKeyword, setPositiveKeyword] = useState<string[]>([]);
  const [negativeKeyword, setNegativeKeyword] = useState<string[]>([]);
  const {theme} = useTheme()
  const iconClass = theme === "light" ? "icons_light" : "icon";


  useEffect(() => {
    const positive: string[] = [];
    const negative: string[] = [];

    eventKeyword.forEach((item) => {
      item =item.replaceAll(/ /g, "_")
      if (item.startsWith('-')) {
        negative.push(item.substring(1));
      } else {
        positive.push(item);
      }
    });

    setPositiveKeyword(positive);
    setNegativeKeyword(negative);
  }, [eventKeyword]);

  useEffect(() => {
    if(type){
    const positive: string[] = [];
    const negative: string[] = [];

    state.forEach((item) => {
      item =item.replaceAll(/ /g, "_")
      if (item.startsWith('-')) {
        negative.push(item.substring(1));
      } else {
        positive.push(item);
      }
    });

    setPositiveKeyword(positive);
    setNegativeKeyword(negative);
  }
  }, [state]);

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
    if(type) setIsMandatory(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      event.preventDefault();
      if (inputText.trim() !== "") {
        console.log(inputText);
        
        // setEventKeyword((prev) => [...prev, inputText]);
        let allKey = inputText.split(',');
        if(activeTab == "Keywords excluded")
          setNegativeKeyword((prev) => [...prev, ...allKey]);
        else
          setPositiveKeyword((prev) => [...prev, ...allKey]);
        setInputText("");
        if(type) handleSaveData();
      }
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    // setEventKeyword((prev) => prev.filter((item) => item !== keyword));
    if(activeTab == "Keywords excluded")
      setNegativeKeyword((prev) => prev.filter((item) => item !== keyword));
    else
      setPositiveKeyword((prev) => prev.filter((item) => item !== keyword));
  };
// useEffect(()=>{
//   if(type) setState([...negativeKeyword, ...positiveKeyword])
// },[type])
  const handleSaveData = () => {
    // setState(eventKeyword);
    const newPositiveKeyword=positiveKeyword.map((keyword)=>keyword.replaceAll(/ /g, "_"))
    const newNegativeKeyword=negativeKeyword.map((keyword)=> `-${keyword.replaceAll(/ /g, "_")}`)
    console.log(newPositiveKeyword);
    
    let newEventKeyword = [
      ...newPositiveKeyword,
      ...newNegativeKeyword,
    ];

    if(inputText.trim() !== ""){
      let inputKey = inputText.split(',');
      if(activeTab == "Keywords excluded") {
        inputKey = inputKey.map((keyword) => `-${keyword.replaceAll(/ /g, "_")}`);
        const newInputKey = inputKey.map((key) => key.substring(1));
        setNegativeKeyword([...negativeKeyword, ...newInputKey]);
      }else {
        inputKey = inputKey.map((keyword) => `${keyword.replaceAll(/ /g, "_")}`);
        setPositiveKeyword([...positiveKeyword, ...inputKey])
      }
      newEventKeyword = [...newEventKeyword, ...inputKey]
    }
    setState(newEventKeyword);
    setInputText('');
    onClose();
  };
  return (
    <div>
      <div className={`${!type ? styles.container : styles.divContainer}`}>
        <div className={styles.header}>
        <div className={`${styles.tabs_container}`}>
          <div className={`${styles.keywordBtns}`} >
            <button
              className={`${styles.tab} ${
                activeTab == "Keywords" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("Keywords")}
            >
              Keywords
              {type && positiveKeyword.length>0 &&<span className={styles.selectedNo}>{positiveKeyword.length}</span>}
            </button>
            <button
              className={`${styles.tab} ${
                activeTab == "Keywords excluded" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("Keywords excluded")}
            >
              Keywords exclude
              {type && negativeKeyword.length>0 &&<span className={styles.selectedNo}>{negativeKeyword.length}</span>}
            </button>
          </div>
        </div>
          {/* <div className={styles.header_button} onClick={onClose}>
            <Image src={CloseIcon} width={20} height={20} alt="close" />
          </div> */}
        </div>

        <div className={`${styles.searchBar_container}`}
        style={
          isMandatory && type && state?.length==0
            ? { border: "1px solid var(--danger-text-color)" } 
            : {}
        }
        >
          <input
            type="text"
            placeholder={
              activeTab == "Keywords"
                ? "Type your keywords to be included in search result"
                : "Type your keywords to be excluded in search result"
            }
            className={styles.inputSearch}
            onChange={handleKeywordChange}
            onKeyDown={handleKeyDown}
            value={inputText}
          />
          <Image className={iconClass} src={SearchIcon} alt="Search" width={20} height={20} />
        </div>

        <div className={styles.action_container}>
          <div className={styles.keywords_container}>
            { (activeTab == "Keywords" && positiveKeyword.length > 0) &&
            positiveKeyword.map((keyword, index) => (
              <div className={`${styles.keyword_chip}`} key={index}>
                <span>{keyword.replaceAll("_", " ")}</span>
                <Image
                  src={CloseIcon}
                  width={14}
                  height={14}
                  alt="close"
                  className={styles.closeChip}
                  onClick={() => handleRemoveKeyword(keyword)}
                />
              </div>
            ))}
            { (activeTab == "Keywords excluded" && negativeKeyword.length > 0) &&
            negativeKeyword.map((keyword, index) => (
              <div className={`${styles.keyword_chip}`} key={index}>
                <span>{keyword.replaceAll("_", " ")}</span>
                <Image
                  src={CloseIcon}
                  width={14}
                  height={14}
                  alt="close"
                  className={styles.closeChip}
                  onClick={() => handleRemoveKeyword(keyword)}
                />
              </div>
            ))}
          </div>
          <div className={styles.button_container}>
          {!type && 
            <div className={styles.button} onClick={handleSaveData}>
              Save
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventKeyword;