'use client'
import React, { useState, useEffect, FormEvent } from 'react'
import styles from './stickywidget.style.module.css'
import SearchIcon from '/public/search.svg'
import Down from '/public/downArrow.svg'
import Image from 'next/image'
import useFetch from '@/hooks/useFetch'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface StickyWidgetProps {
    stickyId: string;
}

const StickyWidget = (props: StickyWidgetProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_EVENTGENI_URL
    const { data } = useFetch(`${baseUrl}/widgets/${props.stickyId}?type=sticky`)

    const [bgColor, setBgColor] = useState<string>("");
    const [fgColor, setFColor] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [fontSize, setFontSize] = useState<string>("")

    const [deactivated, setDeactivated] = useState<boolean>(false)

    useEffect(() => {
        setBgColor(data?.bgColor)
        setFColor(data?.fgColor)
        setHeight(data?.height)
        setFontSize(data?.fontSize)
        const active = data?.active
        if (active === "false") {
            setDeactivated(true)
        } else {
            setDeactivated(false)
        }
    }, [data])
    const handleColorChange = (event: any) => {
        setBgColor(event.target.value);
    };
    const handlefColorChange = (event: any) => {
        setFColor(event.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const baseURL = process.env.NEXT_PUBLIC_EVENTGENI_URL;
        const endpoint = `widgets/${props.stickyId}`;
        const body = JSON.stringify({
            type: "sticky",
            bgColor,
            fgColor,
            height,
            fontSize,
            active: !deactivated ? "true" : "false"
        });
        try {
            const response = await fetch(`${baseURL}/${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            });
            if (!response.ok) {
                console.error('Failed to update the resource:', response.status, response.statusText);
                return;
            }
            toast.success('Updated successfully. Please reload the page to preview the changes.');
        } catch (error) {
            console.error('An error occurred while updating the resource:', error);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <ToastContainer />
            <div className={styles.header}>
                <div className={styles.widgetName}>Sticky Widget</div>
            </div>
            <div className={styles.eventNameContainer}>
                <div className={styles.heading}>Event</div>
                <div className={styles.eventNameInput}>
                    <Image src={SearchIcon} alt='search' />
                    <input
                        type='text'
                        placeholder="Add Event"
                        value={data?.event}
                        disabled
                    />
                </div>
            </div>
            <div className={styles.heightAndFont}>
                <div className={styles.heightContainer}>
                    <div className={styles.heading}>Height</div>
                    <div className={styles.heightInput}>
                        <input onChange={(e) => setHeight(e.target.value)} value={height} type='number' />
                        <div className={styles.dropdownIconValue}>
                            <div>px</div>
                            <Image src={Down} alt="dropdown"></Image>
                        </div>
                    </div>
                </div>
                <div className={styles.fontContainer}>
                    <div className={styles.heading}>Font Size</div>
                    <div className={styles.fontInput}>
                        <input onChange={(e) => setFontSize(e.target.value)} value={fontSize} type='number' />
                        <div className={styles.dropdownIconValue}>
                            <div>px</div>
                            <Image src={Down} alt="dropdown"></Image>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.colorContainer}>
                <div className={styles.heading}>Color</div>
                <div className={styles.colorOptions}>
                    <div >
                        Background Color
                        <div className={styles.colorInputWrapper}>
                            <input type="color" className={styles.colorInput} value={bgColor}
                                onChange={handleColorChange} />
                        </div>
                    </div>
                    <div>
                        Foreground Color
                        <div className={styles.colorInputWrapper}>
                            <input type="color" className={styles.colorInput} value={fgColor}
                                onChange={handlefColorChange} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.activateBtn}>
                <div className={styles.heading}>Deactivated</div>
                <input type="checkbox" id="activate" className={styles.checkboxInput} checked={deactivated} onChange={() => setDeactivated(!deactivated)} />
                <label htmlFor="activate" className={styles.checkBox}></label>
            </div>
            <div className={styles.btns}>
                <button className={styles.submitBtn}>Update</button>
                <button className={styles.cancelBtn} type="button">Cancel</button>
            </div>
        </form>
    )
}

export default StickyWidget