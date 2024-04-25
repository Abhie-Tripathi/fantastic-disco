"use client";
import React, { useRef, useState } from "react";
import styles from "@/app/components/dropdown/EventFormat/EventFormt.module.css";
import Image from "next/image";
import SearchIcon from "/public/search.svg";
import CloseIcon from "/public/close.svg";
import uploadIcon from "/public/internal/upload.svg";
import useClickOutside from "@/hooks/useClickOutside";

interface CompanySearchProps {
  className?: string;
  dropdownRef: React.MutableRefObject<null>;
  state: string[];
  setState: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
}

const CompanySearch = ({
  className,
  dropdownRef,
  state,
  setState,
  onClose,
}: CompanySearchProps) => {
  const [activeTab, setActiveTab] = useState<string>("Search");
  const [inputText, setInputText] = useState<string>("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [companyData, setCompanyData] = useState<string[]>(state);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useClickOutside(dropdownRef, () => onClose());

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      event.preventDefault();
      if (inputText.trim() !== "") {
        setCompanyData((prev) => [...prev, inputText]);
        setInputText("");
      }
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setCompanyData((prev: string[]) => prev.filter((item) => item !== keyword));
  };

  const handleUploadFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setInputFile(file);
  };

  const handleSaveData = () => {
    setState(companyData)
    onClose();
  }

  return (
    <div>
      <div className={`${styles.container} ${className}`}>
        <div className={styles.header}>
          <div className={styles.tabs_container}>
            <div
              className={`${styles.tab} ${
                activeTab == "Search" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("Search")}
            >
              Search
            </div>
            <div
              className={`${styles.tab} ${
                activeTab == "Import CSV" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("Import CSV")}
            >
              Import CSV
            </div>
          </div>
          <div className={styles.header_button} onClick={() => onClose()}>
            <Image src={CloseIcon} width={20} height={20} alt="close" />
          </div>
        </div>

        {activeTab == "Search" && (
          <div className={styles.searchBar_container}>
            <input
              type="text"
              placeholder="Type your keywords to be included in search result"
              className={styles.inputSearch}
              onChange={handleKeywordChange}
              onKeyDown={handleKeyDown}
              value={inputText}
            />
            <Image src={SearchIcon} alt="Search" width={20} height={20} />
          </div>
        )}

        {activeTab == "Import CSV" && (
          <div className={styles.import_container}>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Image
              src={uploadIcon}
              width={100}
              height={100}
              alt="upload"
              className={styles.upload_icon}
              onClick={handleUploadFile}
            />
          </div>
        )}

        <div className={styles.action_container}>
          <div className={styles.keywords_container}>
            {companyData.length > 0 &&
              companyData.map((keyword, index) => (
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
            <div className={styles.button} onClick={handleSaveData}>Save</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySearch;