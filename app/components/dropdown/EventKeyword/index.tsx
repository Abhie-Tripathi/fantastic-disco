"use client";
import React, { useRef, useState } from "react";
import styles from "./EventKeyword.module.css";
import Image from "next/image";
import SearchIcon from "/public/search.svg";
import CloseIcon from "/public/close.svg";
import useClickOutside from "@/hooks/useClickOutside";
import { useTheme } from "@/context";

interface EventKeywordProps {
  state: string[];
  setState: React.Dispatch<React.SetStateAction<string[]>>;
  // onClose: () => void;
}

const EventKeyword = ({
  state,
  setState,
  // onClose,
}: EventKeywordProps) => {
  const [activeTab, setActiveTab] = useState<string>("Keywords");
  const [inputText, setInputText] = useState<string>("");
  const [eventKeyword, setEventKeyword] = useState<string[]>(state);
  const {theme} = useTheme()


  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      event.preventDefault();
      if (inputText.trim() !== "") {
        setEventKeyword((prev) => [...prev, inputText]);
        setInputText("");
      }
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setEventKeyword((prev) => prev.filter((item) => item !== keyword));
  };

  const handleSaveData = () => {
    setState(eventKeyword);
    // onClose();
  };

  return (
    <div>
      <div className={`${styles.container}  ${theme === 'light' ? styles.container_light : ""}`}>
        <div className={styles.header}>
          <div className={styles.tabs_container}>
            <div
              className={`${styles.tab} ${
                activeTab == "Keywords" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("Keywords")}
            >
              Keywords
            </div>
            <div
              className={`${styles.tab} ${
                activeTab == "Keywords excluded" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("Keywords excluded")}
            >
              Keywords excluded
            </div>
          </div>
          <div className={styles.header_button}>
            <Image src={CloseIcon} width={20} height={20} alt="close" />
          </div>
        </div>

        <div className={`${styles.searchBar_container} ${theme === 'light' ? styles.searchBar_container_light : ""}`}>
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
          <Image src={SearchIcon} alt="Search" width={20} height={20} />
        </div>

        <div className={styles.action_container}>
          <div className={styles.keywords_container}>
            {eventKeyword.length > 0 &&
              eventKeyword.map((keyword, index) => (
                <div className={styles.keyword_chip} key={index}>
                  <span>{keyword}</span>
                  <Image
                    src={CloseIcon}
                    width={20}
                    height={20}
                    alt="close"
                    className={styles.closeChip}
                    onClick={() => handleRemoveKeyword(keyword)}
                  />
                </div>
              ))}
          </div>

          <div className={styles.button_container}>
            <div className={styles.button} onClick={handleSaveData}>
              Save
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventKeyword;