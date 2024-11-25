import React, { useState, useEffect } from "react";
import styles from "./typographyModal.module.css";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { useBrandKitServices } from '@/services/geniservices/brandkitService';
const API_KEY: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API;
interface Font {
  family: string;
}

const TypographyModal = ({
  setPreview,
  setFetchedFonts,
  fetchedFonts,
}: any) => {
  const [selectedFont, setSelectedFont] = useState("");
  const [importSource, setImportSource] = useState("Google");
  const [googleFonts, setGoogleFonts] = useState<Font[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {updateBrandkit,error} = useBrandKitServices()
  useEffect(() => {
    if (importSource === "Google") {
      const fetchFonts = async () => {
        try {
          if (API_KEY) {
            const fonts = await fetchGoogleFonts(API_KEY);
            setGoogleFonts(fonts);
          } else {
            throw new Error("API_KEY is not defined");
          }
        } catch (error) {
          console.error("Error fetching Google Fonts:", error);
        }
      };
      fetchFonts();
    }
  }, [importSource]);

  const handleFontChange = (font: any) => {
    setSelectedFont(font.family);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSave = async () => {
    const updatedFonts = [...fetchedFonts, selectedFont];
    const newFonts = [...fetchedFonts, selectedFont];
    setFetchedFonts(updatedFonts);
    // const { data, error } = await myFetch(`${baseUrl}/kit`, {
    //   method: "PATCH",
    //   body: JSON.stringify({ fontFamily: newFonts.join() }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    const data:any = await updateBrandkit({ fontFamily: newFonts.join() })
    if (error) {
      console.log(error);
      return;
    }
    setPreview("");
  };

  const filteredFonts = googleFonts.filter((font) =>
    font.family.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (importSource === "Google" && selectedFont) {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(
        /\s+/g,
        "+"
      )}&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [selectedFont, importSource]);

  return (
    <div className={styles.modalContainer}>
      <div className={styles.leftPanel}>
        <h4>Preview</h4>
        <div className={styles.preview_screen}>
          {selectedFont ? (
            <div
              className={styles.previewText}
              style={{ fontFamily: selectedFont }}
            >
              The quick brown fox jumps over the lazy dog.
            </div>
          ) : (
            <p>Select a font to preview</p>
          )}
        </div>
      </div>

      <div className={styles.rightPanel}>
        <h4>Select a Typography</h4>
        <div className={styles.fonts_container}>
          {importSource === "Google" && (
            <>
              <input
                type="text"
                placeholder="Search fonts..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
              <div className={styles.fontList}>
                {filteredFonts.map((font, index) => (
                  <div
                    key={index}
                    className={`${styles.fontItem} ${
                      selectedFont === font.family ? styles.selected : ""
                    }`}
                    onClick={() => handleFontChange(font)}
                  >
                    {selectedFont === font.family && (
                      <div className={styles.tickIcon}>
                        <TickIcon />
                      </div>
                    )}
                    {font.family}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={styles.modalActions}>
          <button onClick={handleSave}>Save</button>
          {/* <button onClick={() => setPreview("")}>Cancel</button> */}
        </div>
      </div>
    </div>
  );
};

const fetchGoogleFonts = async (apiKey: string) => {
  const response = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`
  );
  const data = await response.json();
  console.log("fetched_front", data.items)
  return data.items;
};

export default TypographyModal;

function TickIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="14"
      viewBox="0 -960 960 960"
      width="14"
    >
      <path
        d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
        fill="#0072F5"
      />
    </svg>
  );
}

