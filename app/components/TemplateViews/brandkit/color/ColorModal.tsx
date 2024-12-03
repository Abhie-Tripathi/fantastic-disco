import React, { useEffect, useState } from 'react'
import styles from './colormodal.style.module.css'
import { ChromePicker } from 'react-color';
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { useBrandKitServices } from '@/services/geniservices/brandkitService';

interface Props {
    colorCode: string
    setColorCode: (value: string) => void
    fetchedColors :  string[]
    colorModalType : string;
    colorModalIndex : number;
    setFetchedColors : (value : string[]) => void
    setPreview : (value : string)=> void
}

const ColorModal = ({ colorCode, setColorCode,fetchedColors,colorModalType,setFetchedColors,setPreview,colorModalIndex }: Props) => {
    const {updateBrandkit,error} = useBrandKitServices();
    const handleColorChange = (color: any) => {
        setColorCode(color.hex);
    };
    const handleColorSave = async()=>{
        // This will be done if we are ADDING a color
        if(colorModalType === "add"){
            setFetchedColors([...fetchedColors,colorCode])
            const newColors = [...fetchedColors,colorCode]
            // const {data,error} = await myFetch(`${baseUrl}/kit`,{
            //     method : "PATCH",
            //     body: JSON.stringify({color : newColors.join()}),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }       
            // })
            const data:any = await updateBrandkit({color : newColors.join()})
            if(error){
                console.log(error)
                return
            }
            setPreview("")
        }else{
            const updatedColorArray = [...fetchedColors]
            updatedColorArray[colorModalIndex] = colorCode; 
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
            setPreview("")
        }
    }

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
    return (
        <div className={styles.body}>
            <div className={styles.colorContainer} style={{ backgroundColor: colorCode }}>
                <span style={{ color: isColorDark(colorCode) ? '#ffffff' : '#000000' }}>{colorCode}</span>
            </div>
            <div className={styles.configure}>
                <div className={styles.colorPicker}>
                    <ChromePicker
                        color={colorCode}
                        onChange={handleColorChange}
                    />
                </div>
                <div className={styles.line}></div>
                <button style={{backgroundColor : colorCode,color: isColorDark(colorCode) ? '#ffffff' : '#000000'}} onClick={handleColorSave}>{colorModalType ==="update" ?"Update Color" : "Add Color"}</button>
            </div>
        </div>
    )
}

export default ColorModal