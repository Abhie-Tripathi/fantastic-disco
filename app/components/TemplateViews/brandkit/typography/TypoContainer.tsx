'use client'
import React from 'react'
import styles from './typocontainer.style.module.css'
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { useBrandKitServices } from '@/services/geniservices/brandkitService';
interface Props {
    setPreview: (value: string) => void
    fetchedFonts : string[];
    setFetchedFonts: (value : string[])=>void;
    setTypography: (value: string) => void;
    handleColorModal : (type: string, index : number) => void
}

const TypoContainer = ({ setPreview, setTypography, fetchedFonts ,setFetchedFonts, handleColorModal}: Props) => {
    console.log("fetched_fonts", fetchedFonts)
    const fonts = ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", "Arial", "sans-serif", "Times New Roman"]
    const {updateBrandkit,error} = useBrandKitServices()
    const handleDelete = async(e: React.MouseEvent<HTMLDivElement>,indexToRemove : number)=>{
        e.stopPropagation();
        const updatedFontsArray = fetchedFonts.filter((_, index) => index !== indexToRemove);
        setFetchedFonts(updatedFontsArray)
        console.log("updates fonts :", updatedFontsArray)
        const data:any = await updateBrandkit({fontFamily : updatedFontsArray.join()})
     
        if(error){
            console.log(error)
            return
        }        
    }

    const handleTypographyClick = (typography: string, type : string, index : number) => {
        setTypography(typography)
        setPreview("typography")
        handleColorModal(type, index)
    }

    return (
        <div className={styles.body} >
            <div className={styles.heading}>Brand Typography</div>
            <div className={styles.fontFamily}>
                {fetchedFonts.map((font, key) => (
                    <div className={styles.font} key={key}>
                        <span>{font}</span>
                        <div className={styles.deleteBtn} onClick={(e) => handleDelete(e,key)}><DeleteIcon /></div>
                    </div>
                ))}
                <div className={styles.addFont} onClick={() => handleTypographyClick(fetchedFonts[0], "add",0)}>
                    <AddIcon />
                </div>
            </div>
        </div>
    )
}

export default TypoContainer

function AddIcon() {
    return (
        <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="18.8984" width="8.1" height="45" fill="#7d7d7d" />
            <rect y="27" width="8.1" height="45" transform="rotate(-90 0 27)" fill="#7d7d7d" />
        </svg>
    )
}

function DeleteIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" fill="black" /></svg>
    )
}