'use client'
import React, { useEffect, useState } from 'react'
import styles from './globalsearch.style.module.css'
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { useTheme } from '@/context'
import Image from 'next/image';
import logo from '/public/10timeslogo.png'

interface Props {
    widgetId: string;
}

const GlobalSearch = ({ widgetId }: Props) => {

    const [searchValue, setSearchValue] = useState<string>("")
    const [dataDropdown, setDatadropdown] = useState<boolean>(false)
    const [searchData, setSearchData] = useState<any[]>([])

    const { theme } = useTheme();

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            handleSearchInput(searchValue);
        }, 300);
        return () => clearTimeout(debounceTimeout);
    }, [searchValue]);

    const handleClickEvent = (event: any) => {
        console.log(event)
    }

    const handleSearchInput = async (text: string) => {
        if (text) {
            const { data, error } = await myFetch(
                `${baseUrl}/event/suggestion?name=${text}&widgetId=${widgetId}`
            );
            if (error) {
                console.log(error);
                return;
            }

            if (data) {
                console.log(data);
                setDatadropdown(true)
                setSearchData(data.events);
            }
        } else {
            setSearchData([]);
            setDatadropdown(false)
        }
    };


    return (
        <div className={styles.searchContainer} style={{ backgroundColor: theme === "dark" ? "#1a1a1a" : "#F9F9F9" }}>
            <input type="text" placeholder='Search for events' onChange={(e) => setSearchValue(e.target.value)} style={{ color: theme === "light" ? "black" : "white", backgroundColor : theme === "light" ? "white" : "#131313" }} />
            {dataDropdown &&
                <div className={`${styles.dropdownContainer} ${theme === "dark" ? styles.darkDropdown : styles.lightDropdown}`}>
                    {searchData.length > 0 ? searchData.map((event) => (
                        <div className={styles.dropdownEvent} key={event.id} onClick={() => handleClickEvent(event)}>
                            <div className={styles.eventNameContaier}>
                                <span className={styles.dropeventName}>{event.name},</span>
                                <span className={styles.dropeventLocation}>{event.data.location_city}</span>
                            </div>
                            {event.data.isMicroServiceData && <Image src={logo} alt="logo" width={15} height={15}/>}
                            {event.isUsed && <div className={styles.checkBoxContainer}>
                                <input
                                    type="checkbox"
                                    id='check'
                                    className={styles.checkboxInput}
                                    checked={true}
                                />
                                <label htmlFor="check" className={styles.checkBox}></label></div>}
                        </div>
                    )) :
                        <div className={styles.noevent}>No events Found with this search</div>
                    }

                </div>}
        </div>
    )
}

export default GlobalSearch