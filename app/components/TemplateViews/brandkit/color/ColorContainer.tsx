'use client'
import React, { useState } from 'react'
import styles from './colorcontainer.style.module.css'
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { useBrandKitServices } from '@/services/geniservices/brandkitService';
interface Props {
    setPreview: (value: string) => void
    setColorCode: (value: string) => void
    fetchedColors : string[];
    handleColorModal : (type: string, index : number) => void
    setFetchedColors : (value : string[])=> void
    
}
const ColorContainer = ({ setPreview, setColorCode,fetchedColors,handleColorModal ,setFetchedColors}: Props) => {
    const colors = ['#eb6809', '#f7f6f4', '#d29168', '#fcb676', '#d4ac94']
    const {updateBrandkit,error} = useBrandKitServices();
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const handleCopyClick = (e: React.MouseEvent<HTMLDivElement>, color: string) => {
        e.stopPropagation();
        setCopiedColor(color);
        navigator.clipboard.writeText(color);
    };
    const handleMouseLeave = () => {
        setTimeout(() => {
            setCopiedColor(null);
        }, 100)
        // Revert back to the copy icon on mouse leave
    };

    const isColorDark = (color: string) => {
        // Convert hex color to RGB
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        // Convert RGB values to linear space
        const linearize = (value: number) => {
            const v = value / 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };

        const rLin = linearize(r);
        const gLin = linearize(g);
        const bLin = linearize(b);

        // Calculate luminance using the linear RGB values
        const luminance = 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;

        // Return true if the color is dark (luminance is less than 0.5)
        return luminance < 0.5;
    };

    const handleColorClick = (color: string, type : string, index : number) => {
        setColorCode(color)
        setPreview("color")
        handleColorModal(type, index)
    }
    const handleDelete = async(e: React.MouseEvent<HTMLDivElement>,indexToRemove : number)=>{
        e.stopPropagation();
        const updatedColorArray = fetchedColors.filter((_, index) => index !== indexToRemove);
        console.log("updated colors : ", updatedColorArray)
        setFetchedColors(updatedColorArray)
        // const {data,error} = await myFetch(`${baseUrl}/kit`,{
        //     method : "PATCH",
        //     body: JSON.stringify({color : updatedColorArray.join()}),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }       
        // })
        const data:any = await updateBrandkit({color : updatedColorArray.join()})
        if(error){
            console.log(error)
            return
        }        
    }

    return (
        <div className={styles.body}>
            <div className={styles.heading}>Brand Colors</div>
            <div className={styles.colorPallete}>
                {fetchedColors.map((color, key) => (
                    <div className={styles.color} key={key} style={{ backgroundColor: color }} onClick={() => handleColorClick(color, "update", key)} onMouseLeave={handleMouseLeave}>
                        <span style={{ color: isColorDark(color) ? '#ffffff' : '#000000' }}>{color}</span>
                        <div className={styles.btnContainer}>
                            <div className={styles.deleteBtn} onClick={(e) => handleDelete(e,key)}><DeleteIcon /></div>
                            <div
                                className={styles.copyBtn}
                                data-name={color}
                                onClick={(e) => handleCopyClick(e, color)}
                            >{copiedColor === color ? <TickIcon /> : <CopyIcon />}</div>
                        </div>

                    </div>
                ))}
                <div className={styles.addColor} onClick={() => handleColorClick(colors[0], "add",0)}>
                    <AddIcon />
                </div>
            </div>
        </div>
    )
}

function AddIcon() {
    return (
        <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="18.8984" width="8.1" height="45" fill="#7d7d7d"/>
            <rect y="27" width="8.1" height="45" transform="rotate(-90 0 27)" fill="#7d7d7d" />
        </svg>
    )
}
function DeleteIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" fill="white" /></svg>
    )
}
function CopyIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15"><path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" fill="white" /></svg>
    )
}
function TickIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" fill="white" /></svg>
    )
}
export default ColorContainer