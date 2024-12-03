"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.style.module.css";
import BrandKit from "@/app/components/TemplateViews/brandkit/BrandKit";
import DetailSection from "@/app/components/TemplateViews/brandkit/DetailSection";
import ColorModal from "@/app/components/TemplateViews/brandkit/color/ColorModal";
import LogoModal from "@/app/components/TemplateViews/brandkit/logo/LogoModal";
import { baseUrl } from "@/constants";
import { myFetch } from "@/utils/myFetch";
import Errorpage from "@/app/components/TemplateViewsNew/Errorpage";
import TypographyModal from "@/app/components/TemplateViews/brandkit/typography/TypographyModal";
import { useBrandKitServices } from "@/services/geniservices/brandkitService";
const Page = () => {
  const [preview, setPreview] = useState<string>("");
  const [colorCode, setColorCode] = useState<string>("");
  const [fetchedColors, setFetchedColors] = useState<string[]>([]);
  const [fetchedFonts, setFetchedFonts] = useState<string[]>([]);
  const [fetchedLogos, setFetchedLogos] = useState<string[]>([]);
  const [fetchedDomain, setFetchedDomain] = useState<string>("");
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [colorModalType, setColorModalType] = useState<string>("");
  const [colorModalIndex, setColorModalIndex] = useState<number>(0);
  const [typographyPreview, setTypogtaphyPreview] = useState<string>("");
  const [typography, setTypography] = useState<string>("");
  const {getBrandkit, error} = useBrandKitServices()
  const fetchBrandkit = async () => {
    // const { data, error } = await myFetch(`${baseUrl}/kit`);
    const data:any = await getBrandkit()
    if (error) {
      console.error("Error fetching brand kit:", error);
      return;
    }

    const cleanedFonts: string[] = Array.from(
      new Set(
        data.fontFamily.map((font: string) => font.trim().replace(/['"]+/g, ""))
      )
    );
    setFetchedColors(data.color);
    setFetchedFonts(cleanedFonts);
    setFetchedLogos(data.logo);
    setFetchedDomain(data.domain.domain);
  };

  const handleColorModal = (type: string, index: number) => {
    setColorModalType(type);
    setColorModalIndex(index);
  };
  useEffect(() => {
    fetchBrandkit();
  }, []);

  useEffect(() => {
    if (fetchedLogos.length > 0) {
      setLoadingState(false);
    }
  }, [fetchedLogos]);

  return (
    <div className={`${styles.body} ${preview ? styles.fixBody : ""}`}>
      <div className={styles.container}>
        {loadingState ? (
          <div className={styles.loadingMessage}>
            <Errorpage type="brandkit" />
          </div>
        ) : (
          <>
            <div className={styles.leftSection}>
              <DetailSection
                fetchedLogos={fetchedLogos}
                fetchedDomain={fetchedDomain}
              />
            </div>
            <div className={styles.rightSection}>
              <BrandKit
                fetchBrandkit = {fetchBrandkit}
                setFetchedFonts={setFetchedFonts}
                setFetchedColors={setFetchedColors}
                handleColorModal={handleColorModal}
                fetchedFonts={fetchedFonts}
                fetchedLogos={fetchedLogos}
                fetchedDomain={fetchedDomain}
                fetchedColors={fetchedColors}
                setColorCode={setColorCode}
                setPreview={setPreview}
                preview={preview}
                setTypography={setTypography}
              />
            </div>
          </>
        )}
      </div>
      {preview.length > 0 && <div className={styles.blackScreen}></div>}
      <div className={styles.modalContainer}>
        {preview.length > 0 && (
          <div className={styles.closBtn} onClick={() => setPreview("")}>
            X
          </div>
        )}
        <div className={styles.modal}>
          {/* {preview === "logo" ? <LogoModal /> : preview === "color" ? <ColorModal setPreview={setPreview} setFetchedColors={setFetchedColors} fetchedColors={fetchedColors} setColorCode={setColorCode} colorCode={colorCode} colorModalType = {colorModalType} colorModalIndex={colorModalIndex}/> : <></>} */}
          <div className={styles.modal}>
            {preview === "logo" ? (
              <LogoModal />
            ) : preview === "color" ? (
              <ColorModal
                setPreview={setPreview}
                setFetchedColors={setFetchedColors}
                fetchedColors={fetchedColors}
                setColorCode={setColorCode}
                colorCode={colorCode}
                colorModalType={colorModalType}
                colorModalIndex={colorModalIndex}
              />
            ) : preview === "typography" ? (
              <TypographyModal
                setPreview={setPreview}
                setFetchedFonts={setFetchedFonts}
                fetchedFonts={fetchedFonts}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
